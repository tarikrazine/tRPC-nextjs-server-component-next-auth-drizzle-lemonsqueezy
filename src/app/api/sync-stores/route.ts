import { NextResponse } from "next/server";

import { env } from "@/env.mjs";
import { storesSchema } from "@/schema/lemonSqueezy/storesSchema";
import { db } from "@/db";
import { stores } from "@/db/schema/stores";

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
  const response = await fetch(`${lemonSqueezyBaseUrl}/stores`, requestOptions);
  const data = await response.json();

  const parsedData = storesSchema.parse(data);

  parsedData.data.map(async (store) => {
    await db
      .insert(stores)
      .values({
        ...store.attributes,
        id: store.id,
      })
      .onConflictDoUpdate({
        target: [stores.id],
        set: {
          ...store.attributes,
        },
      });
  });

  return NextResponse.json(parsedData, { status: 200 });
}
