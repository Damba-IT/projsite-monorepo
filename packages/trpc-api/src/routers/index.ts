import { router } from "../trpc";
import { projectRouter } from "./project";
import { companyRouter } from "./company";

export const appRouter = router({
  projects: projectRouter,
  companies: companyRouter,
});

export type AppRouter = typeof appRouter;
