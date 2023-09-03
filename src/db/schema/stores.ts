//@ts-nocheck
import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { storePlanEnum } from "./storePlanEnum";

export const stores = pgTable("stores", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  domain: text("domain").notNull(),
  url: text("url").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  plan: storePlanEnum("plan").notNull(),
  country: text("country").notNull(),
  countryNicename: text("country_nicename").notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
  totalSales: integer("total_sales").notNull(),
  totalRevenue: integer("total_revenue").notNull(),
  thirtyDaySales: integer("thirty_day_sales").notNull(),
  thirtyDayRevenue: integer("thirty_day_revenue").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull(),
});
