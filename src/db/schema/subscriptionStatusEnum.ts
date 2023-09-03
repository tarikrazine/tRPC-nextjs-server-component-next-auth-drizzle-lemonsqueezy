import { pgEnum } from "drizzle-orm/pg-core";

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "on_trial",
  "active",
  "paused",
  "past_due",
  "unpaid",
  "cancelled",
  "expired",
]);
