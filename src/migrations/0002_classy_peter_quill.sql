DO $$ BEGIN
 CREATE TYPE "billing_reason" AS ENUM('initial', 'renewal', 'updated');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "card_brand" AS ENUM('visa', 'mastercard', 'american_express', 'discover', 'jcb', 'diners_club');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "invoice_status" AS ENUM('paid', 'open', 'void', 'uncollectible', 'draft');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "license_length_unit" AS ENUM('days', 'months', 'years');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "pause_mode" AS ENUM('void', 'free');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "product_status" AS ENUM('draft', 'published');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "store_plan" AS ENUM('fresh', 'sweet', 'free');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "subscription_status" AS ENUM('on_trial', 'active', 'paused', 'past_due', 'unpaid', 'cancelled', 'expired');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "variant_interval" AS ENUM('day', 'week', 'month', 'year');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "variant_status" AS ENUM('pending', 'draft', 'published');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" text PRIMARY KEY NOT NULL,
	"store_id" integer NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"status" "product_status" NOT NULL,
	"status_formatted" text NOT NULL,
	"thumb_url" text,
	"large_thumb_url" text,
	"price" integer NOT NULL,
	"pay_what_you_want" boolean NOT NULL,
	"from_price" integer,
	"to_price" integer,
	"buy_now_url" text NOT NULL,
	"price_formatted" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"test_mode" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_variants" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"is_subscription" boolean NOT NULL,
	"interval" "variant_interval",
	"interval_count" integer,
	"has_free_trial" boolean NOT NULL,
	"trial_interval" "variant_interval" NOT NULL,
	"trial_interval_count" integer NOT NULL,
	"pay_what_you_want" boolean NOT NULL,
	"min_price" integer,
	"suggested_price" integer,
	"has_license_keys" boolean NOT NULL,
	"license_activation_limit" integer,
	"is_license_limit_unlimited" boolean NOT NULL,
	"license_length_value" integer,
	"license_length_unit" "license_length_unit" NOT NULL,
	"is_license_length_unlimited" boolean NOT NULL,
	"sort" integer NOT NULL,
	"status" "variant_status" NOT NULL,
	"status_formatted" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stores" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"domain" text NOT NULL,
	"url" text NOT NULL,
	"avatar_url" text NOT NULL,
	"plan" "store_plan" NOT NULL,
	"country" text NOT NULL,
	"country_nicename" text NOT NULL,
	"currency" varchar(3) NOT NULL,
	"total_sales" integer NOT NULL,
	"total_revenue" integer NOT NULL,
	"thirty_day_sales" integer NOT NULL,
	"thirty_day_revenue" integer NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscription_invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" integer,
	"subscription_id" integer,
	"billing_reason" "billing_reason",
	"card_brand" "card_brand",
	"card_last_four" varchar(4),
	"currency" varchar(3),
	"currency_rate" numeric(10, 8),
	"subtotal" integer,
	"discount_total" integer,
	"tax" integer,
	"total" integer,
	"subtotal_usd" integer,
	"discount_total_usd" integer,
	"tax_usd" integer,
	"total_usd" integer,
	"status" "invoice_status",
	"status_formatted" text,
	"refunded" boolean,
	"refunded_at" timestamp,
	"urls" jsonb,
	"created_at" timestamp,
	"updated_at" timestamp,
	"test_mode" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"store_id" integer,
	"customer_id" integer,
	"order_id" integer,
	"order_item_id" integer,
	"product_id" integer,
	"variant_id" integer,
	"product_name" text,
	"variant_name" text,
	"user_name" text,
	"user_email" text,
	"status" "subscription_status",
	"status_formatted" text,
	"card_brand" "card_brand",
	"card_last_four" varchar(4),
	"pause" jsonb,
	"cancelled" boolean,
	"trial_ends_at" timestamp,
	"billing_anchor" integer,
	"urls" jsonb,
	"renews_at" timestamp,
	"ends_at" timestamp,
	"created_at" timestamp,
	"updated_at" timestamp,
	"test_mode" boolean
);
