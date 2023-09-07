import { NextResponse } from "next/server";

import { env } from "@/env.mjs";
import { db } from "@/db";
import { productVariants } from "@/db/schema/productVariants";
import {
  multipleVariantSchema,
  type VariantSchemaType,
} from "@/schema/lemonSqueezy/variantsSchema";

export const runtime = "edge";

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

  const parsedData = multipleVariantSchema.parse(data.data.slice(-3));

  parsedData.map(async (productVariant) => {
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

  return NextResponse.json(parsedData, { status: 200 });
}
