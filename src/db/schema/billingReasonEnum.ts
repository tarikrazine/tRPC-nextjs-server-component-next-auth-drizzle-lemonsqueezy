import { pgEnum } from "drizzle-orm/pg-core";

export const billingReasonEnum = pgEnum("billing_reason", [
  "initial",
  "renewal",
  "updated",
]);
