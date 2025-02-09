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

// Initialize Hono App
const app = new Hono<HonoEnv>();

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/projsite_db';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Mongoose connected to', mongoUri);
}).catch((err) => {
  console.error('Mongoose connection error:', err);
});

// Middleware
app.use('*', cors());
app.use('*', prettyJSON());
app.use('*', logger(customPrintFunc));
app.use('*', db);

// Auth middleware
app.use('*', async (c, next) => {
  const publishableKey = c.env.CLERK_PUBLISHABLE_KEY || '';
  const secretKey = c.env.CLERK_SECRET_KEY || '';
  return clerkMiddleware({ publishableKey, secretKey })(c, next);
});

// Error Handling
app.onError((err, c) => {
  console.error(`[${c.req.method}] ${c.req.url}:`, err);
  return c.json({ success: false, error: 'Internal Server Error' }, 500);
});

// Routes
import bookingsRouter from './routes/booking';
import organizationsRouter from './routes/organizations';
import projectsRouter from './routes/projects';
import ninjaRouter from './routes/ninja';

app.route('/api/v1/organizations', organizationsRouter);
app.route('/api/v1/projects', projectsRouter);
app.route('/api/v1/ninja', ninjaRouter);
app.route('/api/v1/bookings', bookingsRouter);

// Swagger UI
app.get('/api/docs', swaggerUI({ url: '/swagger.json' }));
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
