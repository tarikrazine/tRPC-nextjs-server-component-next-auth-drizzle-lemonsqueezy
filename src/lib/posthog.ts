import { env } from "@/env.mjs";
import { PostHog } from "posthog-node";

export const PostHogClient = new PostHog(
  env.POST_HOG,
  { host: "https://app.posthog.com" },
);
