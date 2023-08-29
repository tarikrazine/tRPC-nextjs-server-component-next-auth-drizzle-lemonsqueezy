import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import bcrypt from "bcrypt";

import { newUsers, users } from "@/db/schema/users";
import { publicProcedure, router } from "../trpc";
import { accounts } from "@/db/schema/accounts";

export const userRoutes = router({
  create: publicProcedure
    .input(
      z
        .object({
          name: z.string({
            required_error: "Username required",
          }),
          email: z.string().email(),
          password: z
            .string()
            .min(3, {
              message: "Password must be at least 3 characters.",
            })
            .max(50),
          confirmPassword: z
            .string()
            .min(1, { message: "Confirm Password is required" }),
          terms: z.literal(true, {
            errorMap: () => ({
              message: "You must accept Terms and Conditions",
            }),
          }),
        })
        .refine((data) => data.password === data.confirmPassword, {
          path: ["confirmPassword"],
          message: "Password don't match",
        }),
    )
    .mutation(async ({ input, ctx }) => {
      const { name, email, password } = input;

      const [userExists] = await ctx.drizzle.select().from(users).where(
        eq(users.email, email),
      );

      if (userExists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exist",
        });
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const data: newUsers = {
        id: crypto.randomUUID(),
        name,
        email,
        password: hashPassword,
      };

      const [newUser] = await ctx.drizzle.insert(users).values(data).returning({
        id: users.id,
        name: users.name,
        email: users.email,
      });

      const accountData = {
        userId: newUser.id,
        type: "credentials",
        provider: "credentials",
        providerAccountId: newUser.id,
      };

      const newAccount = await ctx.drizzle.insert(accounts).values(accountData)
        .returning();

      return { success: true, newUser, newAccount };
    }),
});
