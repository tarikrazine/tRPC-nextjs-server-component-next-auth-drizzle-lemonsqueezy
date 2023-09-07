import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../trpc";
import { db } from "@/db";
import { productVariants } from "@/db/schema/productVariants";

export const paymentSubscriptions = router({
  test: publicProcedure.query((ctx) => {
    return "ok";
  }),
  getProductVariants: publicProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { productId } = input;

      const allVariants = await db.select().from(productVariants).where(
        eq(productVariants.productId, productId),
      ).orderBy(sql`${productVariants.sort}`);

      return allVariants;
    }),
});
