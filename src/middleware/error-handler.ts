import { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { HonoEnv } from "../types";

export const errorHandler: MiddlewareHandler<HonoEnv> = async (c, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json(
        {
          message: error.message,
          status: error.status,
        },
        error.status
      );
    }

    console.error(error);
    return c.json(
      {
        message: "Internal Server Error",
        status: 500,
      },
      500
    );
  }
}; 