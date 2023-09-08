"use server";

import { revalidatePath } from "next/cache";
import { createRequestOptions, lemonSqueezyBaseUrl } from "./requestOptions";

type UpdateSubscriptionParams = {
  subscriptionId: number;
  cancelled: boolean;
};

export async function updateSubscription(
  params: UpdateSubscriptionParams,
): Promise<void> {
  const url = `${lemonSqueezyBaseUrl}/subscriptions/${params.subscriptionId}`;

  const body = {
    data: {
      type: "subscriptions",
      id: params.subscriptionId.toString(),
      attributes: {
        cancelled: params.cancelled,
      },
    },
  };

  const requestOptions = createRequestOptions("PATCH");
  requestOptions.body = JSON.stringify(body);

  const response: Response = await fetch(url, requestOptions);

  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(
      `HTTP error! status: ${response.status}, body: ${
        JSON.stringify(responseBody)
      }`,
    );
  }

  // Add delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  revalidatePath("/account/billing");
}
