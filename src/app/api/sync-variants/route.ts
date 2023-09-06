import { NextResponse } from "next/server";

import { env } from "@/env.mjs";
import { db } from "@/db";
import { productVariants } from "@/db/schema/productVariants";
import { productVariantSchema } from "@/schema/lemonSqueezy/variantsSchema";
import { z, ZodError } from "zod";
import camelcaseKeys from "camelcase-keys";

export const runtime = "edge";

const camelize = <T extends readonly unknown[] | Record<string, unknown>>(
  val: T,
) => camelcaseKeys(val, { deep: true });

const singleVariantSchema = z.object({
  type: z.string(),
  id: z.string(),
  attributes: z.object({
    product_id: z.number().positive().int(),
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    price: z.number().positive().int(),
    is_subscription: z.boolean(),
    interval: z.union([z.enum(["day", "week", "month", "year"]), z.null()]),
    interval_count: z.number().int().nullable(),
    has_free_trial: z.boolean(),
    trial_interval: z.enum(["day", "week", "month", "year"]),
    trial_interval_count: z.number().int(),
    pay_what_you_want: z.boolean(),
    min_price: z.number().int(),
    suggested_price: z.number().int(),
    has_license_keys: z.boolean(),
    license_activation_limit: z.number().int(),
    is_license_limit_unlimited: z.boolean(),
    license_length_value: z.number().int(),
    license_length_unit: z.enum(["days", "months", "years"]),
    is_license_length_unlimited: z.boolean(),
    sort: z.number().int(),
    status: z.enum(["pending", "draft", "published"]),
    status_formatted: z.string(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
  }).transform(camelize),
  relationships: z.object({
    product: z.object({
      links: z.object({
        related: z.string().url(),
        self: z.string().url(),
      }).transform(camelize),
    }).transform(camelize),
  }).transform(camelize),
  links: z.object({
    self: z.string().url(),
  }).transform(camelize),
}).transform(camelize);

const variantSchema = z.object({
  meta: z.object({
    page: z.object({
      currentPage: z.number().int(),
      from: z.number().int(),
      lastPage: z.number().int(),
      perPage: z.number().int(),
      to: z.number().int(),
      total: z.number().int(),
    }).transform(camelize),
  }).transform(camelize),
  jsonapi: z.object({
    version: z.string(),
  }).transform(camelize),
  links: z.object({
    first: z.string().url(),
    last: z.string().url(),
  }).transform(camelize),
  data: z.array(singleVariantSchema),
}).transform(camelize);

type VariantSchemaType = z.infer<typeof variantSchema>;

export async function GET() {
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

  const headers = createHeaders();
  const requestOptions = createRequestOptions("GET", headers);

  const response = await fetch(
    `${lemonSqueezyBaseUrl}/variants`,
    requestOptions,
  );

  const data = await response.json() as VariantSchemaType;

  return NextResponse.json(data, { status: 200 });

  try {
    const parsedData = variantSchema.parse(data.data.slice(-3));

    console.log(
      parsedData.data.map((variant) => variant.attributes.description),
    );

    parsedData.data.slice(-3).map(async (productVariant) => {
      await db.insert(productVariants).values({
        ...productVariant.attributes,
        id: productVariant.id,
      }).onConflictDoUpdate({
        target: [productVariants.id],
        set: {
          ...productVariant.attributes,
        },
      });
    });

    return NextResponse.json("ok", { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(error);
    }

    return NextResponse.json("not ok", { status: 400 });
  }
}
