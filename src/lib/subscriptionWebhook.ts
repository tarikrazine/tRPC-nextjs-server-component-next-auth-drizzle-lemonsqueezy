import { z } from "zod";
import camelcaseKeys from "camelcase-keys";

const camelize = <T extends readonly unknown[] | Record<string, unknown>>(
  val: T,
) => camelcaseKeys(val);

const Urls = z
  .object({
    update_payment_method: z.string(),
  })
  .transform(camelize);

const Attributes = z
  .object({
    urls: z
      .object({
        update_payment_method: z.string(),
      })
      .transform(camelize),
    pause: z.null().optional(),
    status: z.enum([
      "on_trial",
      "active",
      "paused",
      "past_due",
      "unpaid",
      "cancelled",
      "expired",
    ]),
    ends_at: z.coerce.date().optional(),
    order_id: z.number(),
    store_id: z.number(),
    cancelled: z.boolean(),
    renews_at: z.coerce.date(),
    test_mode: z.boolean(),
    user_name: z.string(),
    card_brand: z
      .enum([
        "visa",
        "mastercard",
        "american_express",
        "discover",
        "jcb",
        "diners_club",
      ])
      .nullable(),
    created_at: z.coerce.date(),
    product_id: z.number(),
    updated_at: z.coerce.date(),
    user_email: z.string(),
    variant_id: z.number(),
    customer_id: z.number(),
    product_name: z.string(),
    variant_name: z.string(),
    order_item_id: z.number(),
    trial_ends_at: z.coerce.date().optional(),
    billing_anchor: z.number(),
    card_last_four: z.string().nullable(),
    status_formatted: z.string(),
  })
  .transform(camelize);

const Links = z
  .object({
    self: z.string(),
    related: z.string().optional(),
  })
  .transform(camelize);

const Order = z
  .object({
    links: Links,
  })
  .transform(camelize);

const Relationships = z
  .object({
    order: Order,
    store: Order,
    product: Order,
    variant: Order,
    customer: Order,
    "order-item": Order,
    "subscription-invoices": Order,
  })
  .transform(camelize);

const Data = z
  .object({
    id: z.coerce.number(),
    type: z.string(),
    //links: Links,
    attributes: Attributes,
    //relationships: Relationships,
  })
  .transform(camelize);

const Meta = z
  .object({
    test_mode: z.boolean(),
    event_name: z.string(),
    custom_data: z
      .object({
        user_id: z.string(),
      })
      .transform(camelize),
  })
  .transform(camelize);

export const subscriptionWebhookRequest = z
  .object({
    data: Data,
    meta: Meta,
  })
  .transform(camelize);

export type SubscriptionWebhookRequest = z.infer<
  typeof subscriptionWebhookRequest
>;
