import { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { HonoEnv } from "../types";
import { response } from "../utils/response";

export const errorHandler: MiddlewareHandler<HonoEnv> = async (c, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof HTTPException) {
      return response.error(c, error.message, error.status);
    }

    console.error(error);
    return response.error(c, "Internal Server Error", 500);
  }
};
