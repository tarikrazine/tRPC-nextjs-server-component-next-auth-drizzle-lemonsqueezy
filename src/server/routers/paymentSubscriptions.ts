import { headers } from "next/headers";

import { z, ZodEffects } from "zod";
import camelcaseKeys from "camelcase-keys";
import { CamelCasedPropertiesDeep } from "type-fest";
import crypto from "crypto";

import { protectedProcedure, publicProcedure, router } from "../trpc";
import { env } from "@/env.mjs";
import {
  ProductVariantSchema,
  productVariantSchema,
} from "@/lib/productVariantSchema";
import { subscriptionWebhookRequest } from "@/lib/subscriptionWebhook";
import { PostHogClient as posthog } from "@/lib/posthog";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { subscriptions } from "@/db/schema/subscriptions";
import { eq } from "drizzle-orm";

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
  subscriptionWebhook: publicProcedure
    .input(subscriptionWebhookRequest)
    .mutation(async ({ ctx, input }) => {
      const secret = env.LEMON_SQUEEZY_SIGNING_SECRET;

      const rawBody = JSON.stringify(input);

      const header = headers();

      const xSignature = header.get("X-Signature");

      console.log("xSignature", xSignature);

      const hmac = crypto.createHmac("sha256", secret);

      hmac.update(rawBody);
      const digest = hmac.digest("hex");

      if (
        !xSignature ||
        !crypto.timingSafeEqual(
          Buffer.from(digest, "hex"),
          Buffer.from(xSignature, "hex"),
        )
      ) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Invalid Signature",
        });
      }

      const type = input.data.type;

      console.log("type", type);

      if (type === "subscriptions") {
        console.log("eventName", input.meta.eventName);

        if (input.meta.eventName === "subscription_created") {
          const [insertData] = await db.insert(subscriptions).values({
            userId: input.meta.customData.userId,
            id: input.data.id,
            ...input.data.attributes,
          }).returning();

          console.log(`Inserted subscription with id ${insertData.id}`);

          return JSON.stringify({ status: "ok" });
        }

        if (input.meta.eventName === "subscription_updated") {
          const [updatedData] = await db.update(subscriptions).set({
            id: input.data.id,
            ...input.data.attributes,
          }).where(eq(subscriptions.id, input.data.id)).returning();

          console.log(`Updated subscription with id: ${updatedData.id}`);

          return JSON.stringify({ status: "ok" });
        }
      }
    }),
});
