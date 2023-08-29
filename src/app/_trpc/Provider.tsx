"use client";

import React, { useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getFetch, httpBatchLink, loggerLink } from "@trpc/client";
import superjson from 'superjson'

import { trpc } from "./client";
import { getDomain } from "@/lib/utils";

interface TRPCProviderProps {
  children: React.ReactNode;
}

function TRPCProvider(props: TRPCProviderProps) {
  const [queryCient] = useState(() => new QueryClient({}));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: () => true,
        }),
        httpBatchLink({
          url: `${getDomain()}/api/trpc`,
          fetch: async (input, init?) => {
            const fetch = getFetch();
            return fetch(input, {
              ...init,
              credentials: "include",
            });
          },
        }),
      ],
      transformer: superjson,
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryCient}>
      <QueryClientProvider client={queryCient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default TRPCProvider;
