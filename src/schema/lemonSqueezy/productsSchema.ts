import camelcaseKeys from "camelcase-keys";
import { z } from "zod";

const camelize = <T extends readonly unknown[] | Record<string, unknown>>(
  val: T,
) => camelcaseKeys(val, { deep: true });

const singleProductSchema = z.object({
  type: z.string(),
  id: z.string(),
  attributes: z.object({
    store_id: z.number().positive().int(),
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    status: z.enum(["draft", "published"]),
    status_formatted: z.string(),
    thumb_url: z.string().url().nullable(),
    large_thumb_url: z.string().url().nullable(),
    price: z.number().positive().int(),
    pay_what_you_want: z.boolean(),
    from_price: z.union([z.number().positive().int(), z.null()]),
    to_price: z.union([z.number().positive().int(), z.null()]),
    buy_now_url: z.string().url(),
    price_formatted: z.string(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    test_mode: z.boolean(),
  }).transform(camelize),
  relationships: z.object({
    store: z.object({
      links: z.object({
        related: z.string().url(),
        self: z.string().url(),
      }).transform(camelize),
    }).transform(camelize),
    variants: z.object({
      links: z.object({
        related: z.string().url(),
        self: z.string().url(),
      }).transform(camelize),
    }).transform(camelize),
  }).transform(camelize),
  links: z.object({
    self: z.string().url(),
  }).transform(camelize),
}).transform(camelize);

export const productSchema = z.object({
  meta: z.object({
    page: z.object({
      currentPage: z.number().int(),
      from: z.number().int(),
      lastPage: z.number().int(),
      perPage: z.number().int(),
      to: z.number().int(),
      total: z.number().int(),
    }).transform(camelize),
  }).transform(camelize),
  jsonapi: z.object({
    version: z.string(),
  }).transform(camelize),
  links: z.object({
    first: z.string().url(),
    last: z.string().url(),
    self: z.string().url().optional(),
  }).transform(camelize),
  data: z.array(singleProductSchema),
}).transform(camelize);
