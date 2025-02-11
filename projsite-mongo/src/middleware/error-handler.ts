import { Context } from 'hono';
import { ZodError } from 'zod';
import { HTTPException } from 'hono/http-exception';
import type { HonoEnv } from '../types';
import { log } from '../utils/logger';

// Validation error handler for zValidator
export const validationErrorHandler = (result: any, c: any) => {
  if (!result.success) {
    // Throw the Zod error directly to be caught by handleError
    throw result.error;
  }
};

export const handleError = (err: Error, c: Context<HonoEnv>) => {
  // Log the full error for debugging
  log.error(`Error caught in onError: ${err.message}`, {
    stack: err.stack,
    url: c.req.url,
    method: c.req.method
  });
  
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message
    }));
    
    log.warn('Validation error:', { errors: formattedErrors });
    
    return c.json({
      success: false,
      error: "Validation failed",
      validation_errors: formattedErrors
    }, 400);
  }

  if (err instanceof HTTPException) {
    const errorMessage = err.message || 'Internal Server Error';
    const errorDetails = err instanceof Error ? (err as any).cause : undefined;
    
    // Log HTTP exceptions with appropriate severity
    if (err.status >= 500) {
      log.error(`Server error ${err.status}: ${errorMessage}`, errorDetails);
    } else {
      log.warn(`Client error ${err.status}: ${errorMessage}`, errorDetails);
    }
    
    return c.json({
      success: false,
      error: errorMessage,
      details: errorDetails,
      status: err.status
    }, err.status);
  }

  // Generic error handler for unexpected errors
  const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
  log.error('Unexpected error:', {
    message: errorMessage,
    error: err,
    stack: err instanceof Error ? err.stack : undefined
  });
  
  return c.json({
    success: false,
    error: errorMessage,
    details: process.env.NODE_ENV === 'development' ? err : undefined
  }, 500);
}; 