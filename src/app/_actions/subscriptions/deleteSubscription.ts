"use server";

import { revalidatePath } from "next/cache";
import { createRequestOptions, lemonSqueezyBaseUrl } from "./requestOptions";

type DeleteSubscriptionParams = {
  subscriptionId: number;
};

export async function deleteSubscription(
  params: DeleteSubscriptionParams,
): Promise<void> {
  const url = `${lemonSqueezyBaseUrl}/subscriptions/${params.subscriptionId}`;

  const requestOptions = createRequestOptions("DELETE");

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
