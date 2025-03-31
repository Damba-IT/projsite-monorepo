// Import the Hono app from the compiled output
import app from '../dist/index.js';
import { handle } from '@hono/node-server/vercel';

// Disable Node.js helpers
process.env.NODEJS_HELPERS = '0';

// Export the configuration for Vercel
export const config = {
  api: {
    bodyParser: false,
  },
};

// Export the handler
export default handle(app); 