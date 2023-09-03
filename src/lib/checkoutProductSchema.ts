import { z } from "zod";

export const validateCheckoutProductSchema = z.object({
  type: z.string(),
  attributes: z.object({
    checkout_data: z.object({
      discount_code: z.string().optional(),
      email: z.string().email(),
      name: z.string().optional(),
      custom: z.object({
        user_id: z.number(),
      }),
    }),
  }),
  relationships: z.object({
    store: z.object({
      data: z.object({
        type: z.string(),
        id: z.string(),
      }),
    }),
    variant: z.object({
      data: z.object({
        type: z.string(),
        id: z.string(),
      }),
    }),
  }),
});

export const data = z.object({
  type: z.string(),
  id: z.string(),
  attributes: z.object({
    store_id: z.number(),
    variant_id: z.number(),
    custom_price: z.number(),
    product_options: z.object({
      name: z.string(),
      description: z.string(),
      media: z.array(z.unknown()), // Assuming media is an array of unknown values
      redirect_url: z.string(),
      receipt_button_text: z.string(),
      receipt_link_url: z.string(),
      receipt_thank_you_note: z.string(),
      enabled_variants: z.array(z.number()),
    }),
    checkout_options: z.object({
      embed: z.boolean(),
      media: z.boolean(),
      logo: z.boolean(),
      desc: z.boolean(),
      discount: z.boolean(),
      dark: z.boolean(),
      subscription_preview: z.boolean(),
      button_color: z.string(),
    }),
    checkout_data: z.object({
      email: z.string(),
      name: z.string(),
      billing_address: z.array(z.unknown()), // Assuming billing_address is an array of unknown values
      tax_number: z.string(),
      discount_code: z.string(),
      custom: z.array(z.unknown()), // Assuming custom is an array of unknown values
      variant_quantities: z.array(z.unknown()), // Assuming variant_quantities is an array of unknown values
    }),
    preview: z.object({
      currency: z.string(),
      currency_rate: z.number(),
      subtotal: z.number(),
      discount_total: z.number(),
      tax: z.number(),
      total: z.number(),
      subtotal_usd: z.number(),
      discount_total_usd: z.number(),
      tax_usd: z.number(),
      total_usd: z.number(),
      subtotal_formatted: z.string(),
      discount_total_formatted: z.string(),
      tax_formatted: z.string(),
      total_formatted: z.string(),
    }),
    expires_at: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    test_mode: z.boolean(),
    url: z.string(),
  }),
  relationships: z.object({
    store: z.object({
      links: z.object({
        related: z.string(),
        self: z.string(),
      }),
    }),
    variant: z.object({
      links: z.object({
        related: z.string(),
        self: z.string(),
      }),
    }),
  }),
});

const Pagination = z.object({
  currentPage: z.number(),
  from: z.number(),
  lastPage: z.number(),
  perPage: z.number(),
  to: z.number(),
  total: z.number(),
});

const Meta = z.object({
  page: Pagination,
});

const Links = z.object({
  self: z.string(),
});

const Jsonapi = z.object({
  version: z.string(),
});

export const checkoutProductResponseSchema = z.object({
  meta: Meta,
  jsonapi: Jsonapi,
  links: Links,
  data: data,
});

export type CheckoutProductResponseSchema = z.infer<
  typeof checkoutProductResponseSchema
>;
