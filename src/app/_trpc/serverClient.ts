import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";

import { appRouter } from "@/server/routers/_app";
import { getBaseUrl } from "@/lib/utils";

import { db } from "@/db";
import { getSession } from "next-auth/react";
import { headers } from "next/headers";

export const serverClient = async () => {
  const session = await getSession({
    req: {
      headers: Object.fromEntries(headers().entries()),
    },
  });

  return appRouter.createCaller({
    //@ts-ignore
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
      }),
    ],
    session: session,
    drizzle: db,
    //transformer: superjson,
  });
};
