import { pgEnum } from "drizzle-orm/pg-core";

export const productStatusEnum = pgEnum("product_status", [
  "draft",
  "published",
]);
