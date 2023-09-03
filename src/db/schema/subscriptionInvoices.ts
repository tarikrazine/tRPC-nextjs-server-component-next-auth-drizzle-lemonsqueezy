//@ts-nocheck
import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { billingReasonEnum } from "./billingReasonEnum";
import { cardBrandEnum } from "./cardBrandEnum";
import { invoiceStatusEnum } from "./invoiceStatusEnum";

export const subscriptionInvoices = pgTable("subscription_invoices", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id"),
  subscriptionId: integer("subscription_id"),
  billingReason: billingReasonEnum("billing_reason"),
  cardBrand: cardBrandEnum("card_brand"),
  cardLastFour: varchar("card_last_four", { length: 4 }),
  currency: varchar("currency", { length: 3 }),
  currencyRate: numeric("currency_rate", { precision: 10, scale: 8 }),
  subtotal: integer("subtotal"),
  discountTotal: integer("discount_total"),
  tax: integer("tax"),
  total: integer("total"),
  subtotalUsd: integer("subtotal_usd"),
  discountTotalUsd: integer("discount_total_usd"),
  taxUsd: integer("tax_usd"),
  totalUsd: integer("total_usd"),
  status: invoiceStatusEnum("status"),
  statusFormatted: text("status_formatted"),
  refunded: boolean("refunded"),
  refundedAt: timestamp("refunded_at"),
  urls: jsonb("urls"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
  testMode: boolean("test_mode"),
});
