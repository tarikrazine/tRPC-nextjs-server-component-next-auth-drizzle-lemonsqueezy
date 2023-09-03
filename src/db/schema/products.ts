//@ts-nocheck
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { productStatusEnum } from "./productStatusEnum";

export const products = pgTable("products", {
  id: text("id").primaryKey().notNull(),
  storeId: integer("store_id").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull(),
  status: productStatusEnum("status").notNull(),
  statusFormatted: text("status_formatted").notNull(),
  thumbUrl: text("thumb_url"),
  largeThumbUrl: text("large_thumb_url"),
  price: integer("price").notNull(),
  payWhatYouWant: boolean("pay_what_you_want").notNull(),
  fromPrice: integer("from_price"),
  toPrice: integer("to_price"),
  buyNowUrl: text("buy_now_url").notNull(),
  priceFormatted: text("price_formatted").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  testMode: boolean("test_mode").notNull(),
});
