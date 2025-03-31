// Import the Hono app from the compiled output
import app from '../dist/index.js';
import { handle } from '@hono/node-server/vercel';

// Export the handler
export default handle(app); 