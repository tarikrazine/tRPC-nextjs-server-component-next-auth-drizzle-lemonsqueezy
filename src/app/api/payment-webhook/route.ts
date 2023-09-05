import { NextResponse } from "next/server";

import crypto from "crypto";

import { PostHogClient as postHog } from "@/lib/posthog";
import { env } from "@/env.mjs";
import { subscriptionWebhookRequest } from "@/lib/subscriptionWebhook";
import { db } from "@/db";
import { subscriptions } from "@/db/schema/subscriptions";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const secret = env.LEMON_SQUEEZY_SIGNING_SECRET;

  const rawBody = await request.text();

  console.log(rawBody);

  if (!rawBody) {
    return NextResponse.json({ message: "No body" }, { status: 400 });
  }

  const xSignature = request.headers.get("X-Signature");

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
    return NextResponse.json({ message: "Invalid Signature" }, { status: 400 });
  }

  const body = JSON.parse(rawBody);

  const type = body.data.type;

  if (type === "subscriptions") {
    const parsedBody = subscriptionWebhookRequest.parse(body);

    postHog.identify({
      distinctId: parsedBody.meta.customData.userId,
      properties: {
        subscription: {
          id: parsedBody.data.id,
          ...parsedBody.data.attributes,
        },
      },
    });

    if (parsedBody.meta.eventName === "subscription_created") {
      const [insertData] = await db.insert(subscriptions).values({
        userId: parsedBody.meta.customData.userId,
        id: parsedBody.data.id,
        ...parsedBody.data.attributes,
      }).returning();

      console.log(`Inserted subscription with id ${insertData.id}`);

      return NextResponse.json({
        "status": "ok",
      });
    }

    if (parsedBody.meta.eventName === "subscription_updated") {
      const [updatedData] = await db.update(subscriptions).set({
        id: parsedBody.data.id,
        ...parsedBody.data.attributes,
      }).where(eq(subscriptions.id, parsedBody.data.id)).returning();

      console.log(`Updated subscription with id: ${updatedData.id}`);

      return NextResponse.json({
        "status": "ok",
      });
    }
  }

  return NextResponse.json({ message: "OK" }, { status: 200 });
}