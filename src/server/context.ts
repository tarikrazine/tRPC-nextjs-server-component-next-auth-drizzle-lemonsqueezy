import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { inferAsyncReturnType } from "@trpc/server";
import { Session } from "next-auth";

import { db } from "@/db";
import { getSession } from "next-auth/react";
import { headers } from "next/headers";

interface CreateInnerContextOptions extends Partial<CreateNextContextOptions> {
  session: Session | null;
}

export async function createContextInner(opts: CreateInnerContextOptions) {
  const req = opts.req;
  console.log("context", req);
  return {
    drizzle: db,
    session: opts.session,
    req,
  };
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext() {
  const session = await getSession({
    req: {
      headers: Object.fromEntries(headers().entries()),
    },
  }) as Session;

  const ctx = await createContextInner({ session });

  return {
    ...ctx,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
