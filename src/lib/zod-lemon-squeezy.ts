import { z } from "zod";

const SPagination = z.object({
  currentPage: z.number(),
  from: z.number(),
  lastPage: z.number(),
  perPage: z.number(),
  to: z.number(),
  total: z.number(),
});

const SMeta = z.object({
  page: SPagination,
});

const SJsonapi = z.object({
  version: z.string(),
});

const SLinks = z.object({
  first: z.string(),
  last: z.string(),
});

const SProductRelationships = z.object({
  links: z.object({
    related: z.string(),
    self: z.string(),
  }),
});

const SAttributes = z.object({
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

const SVariants = z.object({
  type: z.string(),
  id: z.string(),
  attributes: SAttributes,
  relationships: z.object({
    product: SProductRelationships,
  }),
  links: z.object({
    self: z.string(),
  }),
});

export const SLemonSqueezyRequest = z.object({
  meta: SMeta,
  jsonapi: SJsonapi,
  links: SLinks,
  data: z.array(SVariants),
});

export type TLemonSqueezyRequest = z.infer<typeof SLemonSqueezyRequest>;
