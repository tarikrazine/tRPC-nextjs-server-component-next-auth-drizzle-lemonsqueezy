//@ts-nocheck
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { subscriptionStatusEnum } from "./subscriptionStatusEnum";
import { cardBrandEnum } from "./cardBrandEnum";

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  storeId: integer("store_id"),
  customerId: integer("customer_id"),
  orderId: integer("order_id"),
  orderItemId: integer("order_item_id"),
  productId: integer("product_id"),
  variantId: integer("variant_id"),
  productName: text("product_name"),
  variantName: text("variant_name"),
  userName: text("user_name"),
  userEmail: text("user_email"),
  status: subscriptionStatusEnum("status"),
  statusFormatted: text("status_formatted"),
  cardBrand: cardBrandEnum("card_brand"),
  cardLastFour: varchar("card_last_four", { length: 4 }),
  pause: jsonb("pause"),
  cancelled: boolean("cancelled"),
  trialEndsAt: timestamp("trial_ends_at"),
  billingAnchor: integer("billing_anchor"),
  urls: jsonb("urls"),
  renewsAt: timestamp("renews_at"),
  endsAt: timestamp("ends_at"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
  testMode: boolean("test_mode"),
});
