import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

//import { env } from "@/env.mjs";

dotenv.config({ path: "./.env.local" });

export default {
  schema: "./src/db/schema/*",
  out: "./src/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
