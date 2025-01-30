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
app.use('*', clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY || '',
  secretKey: process.env.CLERK_SECRET_KEY || '',
}));

// Connect to MongoDB
app.use('*', async (c, next) => {
  try {
    await connectDB();
    await next();
  } catch (error) {
    return c.json({ error: 'Database connection failed' }, 500);
  }
});

// Routes
import organizationsRouter from './routes/organizations';
import projectsRouter from './routes/projects';

app.route('/api/organizations', organizationsRouter);
app.route('/api/projects', projectsRouter);

// Swagger UI
app.get('/swagger', swaggerUI({ url: '/docs' }));

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }));

export default app; 