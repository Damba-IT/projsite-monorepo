import app from './index';

const port = process.env.PORT || 8787;

// Export Bun's native server configuration
export default {
  port: Number(port),
  fetch: (req: Request) => {
    // Inject environment variables into the context
    return app.fetch(req, {
      env: {
        MONGODB_URI: process.env.MONGODB_URI,
        CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY
      }
    });
  }
};
