import { pgEnum } from "drizzle-orm/pg-core";

export const variantStatusEnum = pgEnum("variant_status", [
  "pending",
  "draft",
  "published",
]);
