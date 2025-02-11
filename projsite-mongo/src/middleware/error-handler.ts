import { Context } from 'hono';
import { ZodError } from 'zod';
import { HTTPException } from 'hono/http-exception';
import type { HonoEnv } from '../types';

export const handleError = (err: Error, c: Context<HonoEnv>) => {
  console.log('Error caught in onError:', err);
  
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message
    }));
    
    return c.json({
      success: false,
      error: "Validation failed",
      validation_errors: formattedErrors
    }, 400);
  }

  if (err instanceof HTTPException) {
    // Get the custom response if available
    const res = err.getResponse();
    if (res) return res;

    return c.json({
      success: false,
      error: err.message,
      cause: err.cause instanceof Error ? err.cause.message : err.cause
    }, err.status);
  }

  // Generic error handler
  const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
  return c.json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err : undefined
  }, 500);
}; 