// Import the Hono app from the compiled output
const { default: app } = require('../dist/index.js');
const { handle } = require('@hono/node-server/vercel');

// Disable built-in Vercel helpers for proper Hono handling
process.env.NODEJS_HELPERS = '0';

// Vercel configuration
module.exports.config = {
  api: {
    bodyParser: false
  }
};

// Export the handler
module.exports = handle(app); 