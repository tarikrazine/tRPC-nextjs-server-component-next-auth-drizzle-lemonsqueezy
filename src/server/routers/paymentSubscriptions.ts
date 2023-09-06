import { z, ZodEffects } from "zod";
import camelcaseKeys from "camelcase-keys";
import { CamelCasedPropertiesDeep } from "type-fest";

import { protectedProcedure, publicProcedure, router } from "../trpc";
import { env } from "@/env.mjs";
import {
  ProductVariantSchema,
  productVariantSchema,
} from "@/schema/lemonSqueezy/variantsSchema";

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

export const zodToCamelCase = <T extends z.ZodTypeAny>(
  zod: T,
): ZodEffects<z.ZodTypeAny, CamelCasedPropertiesDeep<T["_output"]>> =>
  zod.transform((val) => camelcaseKeys(val) as CamelCasedPropertiesDeep<T>);

export const paymentSubscriptions = router({
  test: publicProcedure.query((ctx) => {
    console.log("req", ctx.ctx.req);
    return "ok";
  }),
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

      const data = (await response.json()) as ProductVariantSchema;

      const parsedData = productVariantSchema.parse(data);

      return parsedData;
    }),
});
