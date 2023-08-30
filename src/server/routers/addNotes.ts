import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";

export const notesRouter = router({
  create: publicProcedure
    .input(
      z.object({
        note: z.string(),
      }),
    )
    .mutation((opts) => {
      const { note } = opts.input;
    }),
  list: protectedProcedure.query(async ({ ctx }) => {
    return ["First note", "Second note"];
  }),
});
