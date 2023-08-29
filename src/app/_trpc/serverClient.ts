import { getServerSession } from "next-auth/next";

import { Session } from "next-auth";
import { getFetch, httpBatchLink, loggerLink } from "@trpc/client";
import superjson from "superjson";

import { appRouter } from "@/server/routers/_app";
import { getDomain } from "@/lib/utils";

import { db } from "@/db";

// export const serverClient = appRouter.createCaller({
//   //@ts-ignore
//   links: [httpBatchLink({ url: `${getDomain()}/api/trpc` })],
//   session: {
//     expires: "",
//     user: {
//       name: "tarik razine",
//       email: "ra.devweb.io@gmail.com",
//       image:
//         "https://lh3.googleusercontent.com/a/AAcHTtfx1uhkHS6h_RbCEt0SLYARLZdJCuM3K86s9ax4G9nXbQ=s96-c",
//     },
//   },
//   drizzle: db,
// });

export const serverClient = appRouter.createCaller({
  //@ts-ignore
  links: [
    httpBatchLink({
      url: `${getDomain()}/api/trpc`,
    }),
  ],
  session: {
    expires: "",
    user: {
      name: "tarik razine",
      email: "supabase@gmail.com",
      image: "",
    },
  },
  drizzle: db,
  transformer: superjson,
});
