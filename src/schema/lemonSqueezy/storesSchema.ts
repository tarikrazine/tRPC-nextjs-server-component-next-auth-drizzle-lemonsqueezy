import camelcaseKeys from "camelcase-keys";
import { z } from "zod";

const camelize = <T extends readonly unknown[] | Record<string, unknown>>(
  val: T,
) => camelcaseKeys(val, { deep: true });

const pageSchema = z.object({
  currentPage: z.number(),
  from: z.number(),
  lastPage: z.number(),
  perPage: z.number(),
  to: z.number(),
  total: z.number(),
}).transform(camelize);

const linksSchema = z.object({
  first: z.string().url(),
  last: z.string().url(),
}).transform(camelize);

const relationshipLinksSchema = z.object({
  related: z.string().url(),
  self: z.string().url(),
}).transform(camelize);

const relationshipsSchema = z.object({
  products: z.object({
    links: relationshipLinksSchema,
  }),
  orders: z.object({
    links: relationshipLinksSchema,
  }),
  subscriptions: z.object({
    links: relationshipLinksSchema,
  }),
  discounts: z.object({
    links: relationshipLinksSchema,
  }),
  "license-keys": z.object({
    links: relationshipLinksSchema,
  }),
  webhooks: z.object({
    links: relationshipLinksSchema,
  }),
}).transform(camelize);

const storeSchema = z.object({
  type: z.string(),
  id: z.string(),
  attributes: z.object({
    name: z.string(),
    slug: z.string(),
    domain: z.string(),
    url: z.string().url(),
    avatar_url: z.string().url(),
    plan: z.union([z.literal("fresh"), z.literal("sweet"), z.literal("free")]),
    country: z.string(),
    country_nicename: z.string(),
    currency: z.string(),
    total_sales: z.number().min(0),
    total_revenue: z.number().min(0),
    thirty_day_sales: z.number().min(0),
    thirty_day_revenue: z.number().min(0),
    created_at: z.string(),
    updated_at: z.string(),
  }).transform(camelize),
  relationships: relationshipsSchema,
  links: z.object({
    self: z.string().url(),
  }).transform(camelize),
}).transform(camelize);

export const storesSchema = z.object({
  meta: z.object({
    page: pageSchema,
  }).transform(camelize),
  jsonapi: z.object({
    version: z.string(),
  }).transform(camelize),
  links: linksSchema,
  data: z.array(storeSchema),
}).transform(camelize);
