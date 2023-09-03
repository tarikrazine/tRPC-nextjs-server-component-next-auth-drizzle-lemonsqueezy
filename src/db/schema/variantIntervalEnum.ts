import { pgEnum } from "drizzle-orm/pg-core";

export const variantIntervalEnum = pgEnum("variant_interval", [
  "day",
  "week",
  "month",
  "year",
]);
