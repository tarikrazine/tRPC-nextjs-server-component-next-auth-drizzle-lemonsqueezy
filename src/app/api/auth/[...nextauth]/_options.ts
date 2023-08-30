import { type NextRequest } from "next/server";
import { cookies } from "next/headers";

import { type NextAuthOptions } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
//@ts-ignore
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { db } from "@/db";
import { env } from "@/env.mjs";
import { users } from "@/db/schema/users";
import { sessions } from "@/db/schema/sessions";
import { decode, encode } from "next-auth/jwt";
import { z } from "zod";

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
  const { params } = context;
  const isCredentialsCallback = params?.nextauth?.includes("callback") &&
    params.nextauth.includes("credentials") &&
    request.method === "POST";

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
        async jwt({ token, user, session }) {
          return token;
        },
        async session({ token, user, session }) {
          return session;
        },
        //   async signIn({ user }) {
        //     if (isCredentialsCallback) {
        //       if (user) {
        //         const sessionToken = crypto.randomUUID();
        //         const sessionExpiry = new Date(
        //           Date.now() + 60 * 60 * 24 * 30 * 1000,
        //         );

        //         await db.insert(sessions).values({
        //           sessionToken,
        //           userId: user.id,
        //           expires: sessionExpiry,
        //         });

        //         cookies().set("next-auth.session-token", sessionToken, {
        //           expires: sessionExpiry,
        //         });
        //       }
        //     }
        //     return true;
        //   },
        //   async redirect({ baseUrl }) {
        //     return baseUrl;
        //   },
      },
      pages: {
        signIn: "/login",
        signOut: "/logout",
      },
      session: {
        strategy: "jwt",
      },
      // jwt: {
      //   maxAge: 60 * 60 * 24 * 30,
      //   encode: async (arg) => {
      //     if (isCredentialsCallback) {
      //       const cookie = cookies().get("next-auth.session-token");

      //       if (cookie) return cookie.value;
      //       return "";
      //     }

      //     return encode(arg);
      //   },
      //   decode: async (arg) => {
      //     if (isCredentialsCallback) {
      //       return null;
      //     }
      //     return decode(arg);
      //   },
      // },
      // events: {
      //   async signOut({ session }) {
      //     const { sessionToken = "" } = session as unknown as {
      //       sessionToken?: string;
      //     };

      //     if (sessionToken) {
      //       await db.delete(sessions).where(
      //         eq(sessions.sessionToken, sessionToken),
      //       );
      //     }
      //   },
      // },
      debug: env.NODE_ENV === "development",
      secret: env.NEXTAUTH_SECRET,
    } satisfies NextAuthOptions,
  ] as const;
};
