import type { Context } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  [key: string]: any;  // For optional additions
}

export const response = {
  success: <T>(c: Context, data: T, status: StatusCode = 200, extras = {}) => {
    const response = new Response(JSON.stringify({
      success: true,
      data,
      ...extras
    }), { status });
    return response;
  },

  error: (c: Context, message: string, status: StatusCode = 400, extras = {}) => {
    const response = new Response(JSON.stringify({
      success: false,
      error: message,
      ...extras
    }), { status });
    return response;
  }
}; 