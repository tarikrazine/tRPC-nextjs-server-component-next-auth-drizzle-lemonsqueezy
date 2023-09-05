import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";
import superjson from "superjson";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  //transformer: superjson,
});

const isAuthed = t.middleware(async ({ next, ctx }) => {
  const [user] = await ctx.drizzle.select({ email: users.email }).from(users)
    .where(eq(users.email, ctx.session?.user?.email));

  if (!ctx.session?.user?.email || typeof user === "undefined") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  return next({
    ctx: {
      // Infers the `session` as non-nullable
      session: ctx.session,
      drizzle: ctx.drizzle,
      req: ctx.req,
    },
  });
});

// Base router and procedure helpers
export const router = t.router;
export const middleware = t.middleware;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(isAuthed);
