import { NextResponse } from "next/server";

import { env } from "@/env.mjs";

import { productSchema } from "@/schema/lemonSqueezy/productsSchema";
import { db } from "@/db";
import { products } from "@/db/schema/products";

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
    `${lemonSqueezyBaseUrl}/products`,
    requestOptions,
  );
  const data = await response.json();

  console.log(JSON.stringify(data, null, 2));

  const parsedData = productSchema.parse(data);

  parsedData.data.map(async (product) => {
    await db.insert(products).values({
      ...product.attributes,
      id: product.id,
    }).onConflictDoUpdate({
      target: [products.id],
      set: {
        ...product.attributes,
      },
    });
  });

  return NextResponse.json(parsedData, { status: 200 });
}
