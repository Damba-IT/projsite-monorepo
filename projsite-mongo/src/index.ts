import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { customPrintFunc } from './utils/logger';
import { swaggerUI } from '@hono/swagger-ui';
import { clerkMiddleware } from '@hono/clerk-auth';
import { db } from './middleware/db';
import { handleError } from './middleware/error-handler';
import type { HonoEnv } from './types';
import { openApiSpec } from './openapi';
import bookingsRouter from './routes/booking';
import organizationsRouter from './routes/organizations';
import projectsRouter from './routes/projects';
import ninjaRouter from './routes/ninja';
import webhookRouter from './routes/webhooks';
import resourceRouter from './routes/resources';
import subProjectRouter from './routes/sub-projects';
import zoneRouter from './routes/zones';
import { env } from 'hono/adapter';

const app = new Hono<HonoEnv>();

// Logger middleware should be first to catch all requests
app.use('*', logger(customPrintFunc));

// Other middleware
app.use('*', cors());
app.use('*', prettyJSON());
app.use('*', logger(customPrintFunc));
app.use('*', db);

// Auth middleware
app.use('*', async (c, next) => {
  const publishableKey = env(c).CLERK_PUBLISHABLE_KEY || '';
  const secretKey = env(c).CLERK_SECRET_KEY || '';
  return clerkMiddleware({ publishableKey, secretKey })(c, next);
});

// Routes
app.route('/api/v1/organizations', organizationsRouter);
app.route('/api/v1/projects', projectsRouter);
app.route('/api/v1/ninja', ninjaRouter);
app.route('/api/v1/webhooks', webhookRouter);
app.route('/api/v1/resources', resourceRouter);
app.route('/api/v1/sub-projects', subProjectRouter);
app.route('/api/v1/zones', zoneRouter);

app.onError(handleError);

// Swagger UI
app.get('/api/docs', swaggerUI({ url: '/api/swagger.json' }));

// Serve OpenAPI spec
app.get('/api/swagger.json', (c) => c.json(openApiSpec));

// Health Check
app.get('/api/health', async (c) => {
  try {
    const db = c.get('db');
    const startTime = Date.now();
    await db.command({ ping: 1 });
    const responseTime = Date.now() - startTime;

    return c.json({
      status: 'healthy',
      mongodb: {
        status: 'connected',
        responseTime: `${responseTime}ms`
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return c.json({
      status: 'unhealthy',
      mongodb: {
        status: 'disconnected',
        error: error.message
      },
      timestamp: new Date().toISOString()
    }, 503);
  }
});

export default app;
