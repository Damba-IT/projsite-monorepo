import { MiddlewareHandler } from "hono";
import type { HonoEnv } from "../types";

type RateLimitStore = {
  [key: string]: {
    count: number;
    resetTime: number;
  };
};

const store: RateLimitStore = {};

export const rateLimiter = (
  limit: number = 100,
  windowMs: number = 60000
): MiddlewareHandler<HonoEnv> => {
  return async (c, next) => {
    const ip = c.req.header("x-forwarded-for") || "unknown";
    const now = Date.now();

    // Clean up old entries
    if (store[ip] && store[ip].resetTime < now) {
      delete store[ip];
    }

    // Initialize or increment counter
    if (!store[ip]) {
      store[ip] = {
        count: 1,
        resetTime: now + windowMs,
      };
    } else {
      store[ip].count++;
    }

    // Check limit
    if (store[ip].count > limit) {
      return c.json(
        {
          message: "Too many requests",
          status: 429,
        },
        429
      );
    }

    await next();
  };
};
