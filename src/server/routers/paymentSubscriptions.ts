import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../trpc";
import { env } from "@/env.mjs";
import {
  SLemonSqueezyRequest,
  TLemonSqueezyRequest,
} from "@/lib/zod-lemon-squeezy";

const lemonSqueezyBaseUrl = "https://api.lemonsqueezy.com/v1";
const lemonSqueezyApiKey = env.LEMON_SQUEEZY_API_KEY;

function createHeaders() {
  const headers = new Headers();

  headers.append("Accept", "application/vnd.api+json");
  headers.append("Content-Type", "application/vnd.api+json");
  headers.append("Authorization", `Bearer ${lemonSqueezyApiKey}`);

  return headers;
}

function createRequestOptions(method: string, headers: Headers): RequestInit {
  return {
    method,
    headers,
    redirect: "follow",
    cache: "no-store",
  };
}

export const paymentSubscriptions = router({
  getProductVariants: publicProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { productId } = input;

      const url =
        `${lemonSqueezyBaseUrl}/variants?filter[product_id]=${productId}`;

      const headers = createHeaders();

      const requestOptions = createRequestOptions("GET", headers);

      const response: Response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as TLemonSqueezyRequest;

      const parsedData = SLemonSqueezyRequest.parse(data);

      return parsedData;
    }),
});
