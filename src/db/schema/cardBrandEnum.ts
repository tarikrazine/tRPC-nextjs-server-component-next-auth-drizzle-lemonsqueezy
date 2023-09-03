import { pgEnum } from "drizzle-orm/pg-core";

export const cardBrandEnum = pgEnum("card_brand", [
  "visa",
  "mastercard",
  "american_express",
  "discover",
  "jcb",
  "diners_club",
]);
