import { MiddlewareHandler } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
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
  await clerkMiddleware()(c, next);

  // After Clerk middleware, verify that user is authenticated
  const auth = getAuth(c);
  if (!auth?.userId) {
    throw new HTTPException(401, {
      message: "Unauthorized - No valid authentication provided",
    });
  }
};

// Private helper function for service auth
const serviceAuth: MiddlewareHandler<HonoEnv> = async (c, next) => {
  const apiKey = c.req.header("X-API-Key");

  if (!apiKey || apiKey !== c.env.SERVICE_API_KEY) {
    throw new HTTPException(401, { message: "Invalid API key" });
  }

  await next();
};
