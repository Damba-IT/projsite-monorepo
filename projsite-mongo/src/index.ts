import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { logger } from 'hono/logger';
import { swaggerUI } from '@hono/swagger-ui';
import { clerkMiddleware } from '@hono/clerk-auth';
import bookingsRouter from './routes/booking';
import mongoose from 'mongoose';
const app = new Hono();
console.log(process.env.MONGODB_URI);

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
app.use('*', logger());

// // Auth middleware
// app.use('*', async (c, next) => {
//   const publishableKey = c.env.CLERK_PUBLISHABLE_KEY || '';
//   const secretKey = c.env.CLERK_SECRET_KEY || '';
//   return clerkMiddleware({ publishableKey, secretKey })(c, next);
// });

app.onError((err, c) => {
  console.error(`[${c.req.method}] ${c.req.url}:`, err);
  return c.json({ success: false, error: 'Internal Server Error' }, 500);
});

app.get('/swagger', swaggerUI({ url: '/docs' }));

app.get('/health', (c) => c.json({ status: 'ok' }));

app.route('/api/bookings', bookingsRouter);

export default app;
