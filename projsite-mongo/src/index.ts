import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { customPrintFunc } from './utils/logger';
import { swaggerUI } from '@hono/swagger-ui';
import { clerkMiddleware } from '@hono/clerk-auth';
import { db } from './middleware/db';
import type { HonoEnv } from './types';
import { openApiSpec } from './openapi';

const app = new Hono<HonoEnv>();

// Middleware
app.use('*', cors());
app.use('*', prettyJSON());
app.use('*', logger(customPrintFunc));

// Auth middleware
app.use('*', clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY || '',
  secretKey: process.env.CLERK_SECRET_KEY || '',
}));

// Database middleware
app.use('*', db);

// Routes
import organizationsRouter from './routes/organizations';
import projectsRouter from './routes/projects';

app.route('/api/organizations', organizationsRouter);
app.route('/api/projects', projectsRouter);

// Swagger UI
app.get('/docs', swaggerUI({ url: '/swagger.json' }));

// Serve OpenAPI spec
app.get('/swagger.json', (c) => c.json(openApiSpec));

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }));

export default app; 