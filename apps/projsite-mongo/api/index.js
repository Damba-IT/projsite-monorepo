// Import the Hono app from the compiled output
import { app } from '../dist/index.js';
import { handle } from '@hono/node-server/vercel';

// Disable built-in Vercel helpers for proper Hono handling
process.env.NODEJS_HELPERS = '0';

// Vercel configuration
export const config = {
  api: {
    bodyParser: false
  }
};

// Export the handler
export default handle(app); 