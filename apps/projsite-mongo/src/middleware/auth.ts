import { Context, Next } from 'hono';
import { getAuth } from '@hono/clerk-auth';
import { HTTPException } from 'hono/http-exception';

export const auth = async (c: Context, next: Next) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    throw new HTTPException(401, { message: 'Unauthorized - Please sign in to continue' });
  }

  await next();
}; 