import { MiddlewareHandler } from "hono";
import { clerkMiddleware } from '@hono/clerk-auth'
import type { HonoEnv } from "../types";
import { HTTPException } from "hono/http-exception";

// Combined auth middleware that handles both Clerk and Service auth
export const auth: MiddlewareHandler<HonoEnv> = async (c, next) => {
  const apiKey = c.req.header("X-API-Key");
  
  // If API key is provided, use service auth
  if (apiKey) {
    return serviceAuth(c, next);
  }
  
  // Otherwise, use Clerk auth
  return clerkMiddleware()(c, next);
}; 

// Private helper function for service auth
const serviceAuth: MiddlewareHandler<HonoEnv> = async (c, next) => {
  const apiKey = c.req.header("X-API-Key");

  if (!apiKey || apiKey !== c.env.SERVICE_API_KEY) {
    throw new HTTPException(401, { message: "Invalid API key" });
  }

  await next();
}; 