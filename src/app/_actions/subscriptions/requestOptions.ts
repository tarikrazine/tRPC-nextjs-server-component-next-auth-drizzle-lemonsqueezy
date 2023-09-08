import { env } from "@/env.mjs";

const lemonSqueezyApiKey = env.LEMON_SQUEEZY_API_KEY;
export const lemonSqueezyBaseUrl = "https://api.lemonsqueezy.com/v1";

function createHeaders() {
  const headers = new Headers();
  headers.append("Accept", "application/vnd.api+json");
  headers.append("Content-Type", "application/vnd.api+json");
  headers.append("Authorization", `Bearer ${lemonSqueezyApiKey}`);
  return headers;
}

export function createRequestOptions(method: string): RequestInit {
  const headers = createHeaders();

  return {
    method,
    headers,
    redirect: "follow",
    cache: "no-store",
  };
}
