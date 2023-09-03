import { pgEnum } from "drizzle-orm/pg-core";

export const pauseModeEnum = pgEnum("pause_mode", [
  "void",
  "free",
]);
