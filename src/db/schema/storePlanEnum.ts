import { pgEnum } from "drizzle-orm/pg-core";

export const storePlanEnum = pgEnum("store_plan", [
  "fresh",
  "sweet",
  "free",
]);
