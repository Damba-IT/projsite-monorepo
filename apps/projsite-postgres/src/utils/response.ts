import type { Context } from "hono";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  [key: string]: any; // For optional additions
};

export const response = {
  success: <T>(c: Context, data: T, status: number = 200, extras = {}) => {
    return c.json(
      {
        success: true,
        data,
        ...extras,
      },
      status
    );
  },

  error: (c: Context, message: string, status: number = 400, extras = {}) => {
    return c.json(
      {
        success: false,
        error: message,
        ...extras,
      },
      status
    );
  },
};
