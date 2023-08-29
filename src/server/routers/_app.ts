import { publicProcedure, router } from "../trpc";
import { notesRouter } from "./addNotes";
import { userRoutes } from "./user";

export const appRouter = router({
  user: userRoutes,
  notes: notesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
