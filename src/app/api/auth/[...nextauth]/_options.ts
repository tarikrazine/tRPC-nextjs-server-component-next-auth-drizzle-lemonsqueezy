import { type NextRequest } from "next/server";

import { type NextAuthOptions } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
//@ts-ignore
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { z } from "zod";

import { db } from "@/db";
import { env } from "@/env.mjs";
import { users } from "@/db/schema/users";

interface Context {
  params: { nextauth: string[] };
}

const validateCredential = z.object({
  email: z.string().email(),
  password: z.string().min(3, {
    message: "Password must be at least 3 characters.",
  }),
});

export const authOptions = (request: NextRequest, context: Context) => {
  return [
    request,
    context,
    {
      adapter: DrizzleAdapter(db),
      providers: [
        GoogleProvider({
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
          authorization:
            "https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code",
        }),
        GithubProvider({
          clientId: env.GITHUB_CLIENT_ID,
          clientSecret: env.GITHUB_CLIENT_SECRET,
        }),
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: {
              label: "Email",
              type: "email",
              placeholder: "jsmith@example.com",
            },
            password: { label: "Password", type: "password" },
          },
          //@ts-ignore
          async authorize(credentials, _) {
            const result = await validateCredential.safeParseAsync(credentials);

            if (!result.success) {
              throw new Error(result.error.errors[0].message);
            }

            // Add logic here to look up the user from the credentials supplied
            const [user] = await db
              .select()
              .from(users)
              .where(eq(users.email, credentials?.email));

            if (!user) {
              throw new Error("User don't exists");
            }

            const verifyPassword = await bcrypt.compare(
              credentials?.password!,
              user.password,
            );

            if (!verifyPassword) {
              throw new Error("Incorrect password");
            }

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            };
          },
        }),
      ],
      callbacks: {
        async jwt({ token, user }) {
          const [userDb] = await db
            .select({
              id: users.id,
              name: users.name,
              email: users.email,
              image: users.image,
            })
            .from(users).where(eq(users.email, token.email));

          return {
            id: userDb.id,
            name: userDb.name,
            email: userDb.email,
            image: userDb.image,
          };
        },
        async session({ token, user, session }) {
          if (token) {
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.image = token.image;
          }

          return session;
        },
      },
      pages: {
        signIn: "/login",
        signOut: "/logout",
      },
      session: {
        strategy: "jwt",
      },
      debug: env.NODE_ENV === "development",
      secret: env.NEXTAUTH_SECRET,
    } satisfies NextAuthOptions,
  ] as const;
};
