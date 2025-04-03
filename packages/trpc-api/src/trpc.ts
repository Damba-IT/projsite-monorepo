import { initTRPC, TRPCError } from "@trpc/server";
import { Db } from "mongodb";
import superjson from "superjson";

export interface Context {
  db: Db;
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const middleware = t.middleware;
export const mergeRouters = t.mergeRouters;
