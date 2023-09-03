import { pgEnum } from "drizzle-orm/pg-core";

export const licenseLengthUnitEnum = pgEnum("license_length_unit", [
  "days",
  "months",
  "years",
]);
