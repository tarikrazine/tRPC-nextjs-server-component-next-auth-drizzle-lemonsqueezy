import { z } from "zod";

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

const Jsonapi = z.object({
  version: z.string(),
});

const Links = z.object({
  first: z.string(),
  last: z.string(),
});

const ProductRelationships = z.object({
  links: z.object({
    related: z.string(),
    self: z.string(),
  }),
});

const Attributes = z.object({
  price: z.number(),
  is_subscription: z.boolean(),
  interval: z.string(),
  interval_count: z.number(),
  has_free_trial: z.boolean(),
  trial_interval: z.string(),
  trial_interval_count: z.number(),
  pay_what_you_want: z.boolean(),
  min_price: z.number(),
  suggested_price: z.number(),
  product_id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.nullable(z.string()),
  has_license_keys: z.boolean(),
  license_activation_limit: z.number(),
  is_license_limit_unlimited: z.boolean(),
  license_length_value: z.number(),
  license_length_unit: z.string(),
  is_license_length_unlimited: z.boolean(),
  sort: z.number(),
  status: z.string(),
  status_formatted: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  test_mode: z.boolean().optional(),
});

const Variants = z.object({
  type: z.string(),
  id: z.string(),
  attributes: Attributes,
  relationships: z.object({
    product: ProductRelationships,
  }),
  links: z.object({
    self: z.string(),
  }),
});

export const productVariantSchema = z.object({
  meta: Meta,
  jsonapi: Jsonapi,
  links: Links,
  data: z.array(Variants),
});

export type ProductVariantSchema = z.infer<typeof productVariantSchema>;
