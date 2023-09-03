import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { variantIntervalEnum } from "./variantIntervalEnum";
import { licenseLengthUnitEnum } from "./licenseLengthUnitEnum";
import { variantStatusEnum } from "./variantStatusEnum";

export const productVariants = pgTable("product_variants", {
  id: text("id").primaryKey().notNull(),
  productId: integer("product_id").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  isSubscription: boolean("is_subscription").notNull(),
  interval: variantIntervalEnum("interval"),
  intervalCount: integer("interval_count"),
  hasFreeTrial: boolean("has_free_trial").notNull(),
  trialInterval: variantIntervalEnum("trial_interval").notNull(),
  trialIntervalCount: integer("trial_interval_count").notNull(),
  payWhatYouWant: boolean("pay_what_you_want").notNull(),
  minPrice: integer("min_price"),
  suggestedPrice: integer("suggested_price"),
  hasLicenseKeys: boolean("has_license_keys").notNull(),
  licenseActivationLimit: integer("license_activation_limit"),
  isLicenseLimitUnlimited: boolean("is_license_limit_unlimited").notNull(),
  licenseLengthValue: integer("license_length_value"),
  licenseLengthUnit: licenseLengthUnitEnum("license_length_unit").notNull(),
  isLicenseLengthUnlimited: boolean("is_license_length_unlimited").notNull(),
  sort: integer("sort").notNull(),
  status: variantStatusEnum("status").notNull(),
  statusFormatted: text("status_formatted").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});
