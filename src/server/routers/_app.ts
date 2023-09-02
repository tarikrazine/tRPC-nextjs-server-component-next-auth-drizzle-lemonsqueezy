import { router } from "../trpc";
import { notesRouter } from "./addNotes";
import { paymentSubscriptions } from "./paymentSubscriptions";
import { userRoutes } from "./user";

export const appRouter = router({
  user: userRoutes,
  notes: notesRouter,
  paymentSubscription: paymentSubscriptions,
});

// export type definition of API
export type AppRouter = typeof appRouter;
