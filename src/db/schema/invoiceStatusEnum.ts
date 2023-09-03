import { pgEnum } from "drizzle-orm/pg-core";

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "paid",
  "open",
  "void",
  "uncollectible",
  "draft",
]);
