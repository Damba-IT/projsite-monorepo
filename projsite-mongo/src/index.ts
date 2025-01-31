// index.ts
// Patch process.emitWarning to avoid the "emitWarning is not a function" error


// Now import the rest:
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { logger } from 'hono/logger';
import { swaggerUI } from '@hono/swagger-ui';
import { clerkMiddleware } from '@hono/clerk-auth';
import { connectDB } from './utils/db';


const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', prettyJSON());
app.use('*', logger());

// Auth middleware
app.use('*', async (c, next) => {
  const publishableKey = c.env.CLERK_PUBLISHABLE_KEY || '';
  const secretKey = c.env.CLERK_SECRET_KEY || '';
  return clerkMiddleware({ publishableKey, secretKey })(c, next);
});

// Example route that queries 'projects' collection
app.get('/mongo-projects', async (c) => {
  try {
    const db = await connectDB(c.env.MONGODB_URI);
    const projects = await db.collection('projects').findOne({});
    console.log(projects);
    return c.json({ success: true, data: projects });
  } catch (err) {
    return c.json({ error: (err as Error).message }, 500);
  }
});

// Swagger UI
app.get('/swagger', swaggerUI({ url: '/docs' }));

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }));

export default app;
