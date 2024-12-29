import { clerkMiddleware } from '@hono/clerk-auth'
import type { MiddlewareHandler } from "hono";
import type { HonoEnv } from "../types";

export const auth: MiddlewareHandler<HonoEnv> = clerkMiddleware(); 