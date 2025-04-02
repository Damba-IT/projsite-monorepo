import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { customPrintFunc } from './utils/logger';
import { swaggerUI } from '@hono/swagger-ui';
import { clerkMiddleware } from '@hono/clerk-auth';
import { db } from './middleware/db';
import { handleError } from './middleware/error-handler';
import { auth } from './middleware/auth';
import type { HonoEnv } from './types';
import { openApiSpec } from './openapi';

const app = new Hono<HonoEnv>();

// Logger middleware should be first to catch all requests
app.use('*', logger(customPrintFunc));

// Other middleware
app.use('*', cors());
app.use('*', prettyJSON());

// Auth middleware
app.use('*', clerkMiddleware());

// Database middleware
app.use('*', db);

// Routes
import companiesRouter from './routes/companies';
import projectsRouter from './routes/projects';
import ninjaRouter from './routes/ninja';
import resourceRouter from './routes/resources';
//import subProjectRouter from './routes/sub-projects';
//import zoneRouter from './routes/unloading-zones';


// Protected routes - require authentication
app.use('/api/v1/companies/*', auth);
app.use('/api/v1/projects/*', auth);
app.use('/api/v1/ninja/*', auth);

app.route('/api/v1/companies', companiesRouter);
app.route('/api/v1/projects', projectsRouter);
app.route('/api/v1/ninja', ninjaRouter);

app.onError(handleError);

// Swagger UI
app.get('/api/docs', swaggerUI({ url: '/api/swagger.json' }));

// Serve OpenAPI spec
app.get('/api/swagger.json', (c) => c.json(openApiSpec));

// Health checks
app.get('/api/health', async (c) => {
  try {
    const db = c.get('db');
    const startTime = Date.now();
    
    // Test MongoDB connection with a ping
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

// Export both as default and named for compatibility
export default app;
export { app }; 