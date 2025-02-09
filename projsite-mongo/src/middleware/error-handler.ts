import { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import type { HonoEnv } from "../types";
import { response } from '../utils/response';

export const errorHandler: MiddlewareHandler<HonoEnv> = async (c, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof ZodError) {
      // Format Zod validation errors
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      
      return response.error(c, "Validation failed", 400, {
        validation_errors: formattedErrors
      });
    }

    if (error instanceof HTTPException) {
      // Use getResponse if a custom response was provided
      const res = error.getResponse();
      if (res) {
        return res;
      }

      // Include the cause if available
      const errorDetails = error.cause ? {
        cause: error.cause instanceof Error ? error.cause.message : error.cause
      } : {};

      return response.error(c, error.message, error.status, errorDetails);
    }

    console.error(error);
    return response.error(c, "Internal Server Error", 500);
  }
}; 