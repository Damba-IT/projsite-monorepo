# Deploying a Monorepo API to Vercel

This document explains how we've set up the deployment of a Hono API from a Turborepo monorepo to Vercel Functions.

## The Challenge

The main challenge was getting shared packages (`@projsite/types` and `@projsite/auth`) to work correctly in the Vercel Functions environment. Initially, we encountered this error:

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@projsite/types' imported from /var/task/apps/projsite-mongo/dist/index.js
```

## The Solution

We've implemented a specialized build process that bundles the API and its dependencies into a self-contained deployment:

1. **Custom Build Script**: Created a `build-for-vercel.js` script that:
   - Bundles the app with shared dependencies included
   - Copies the API handler to the dist directory
   - Creates a package.json in the dist directory for proper module resolution

2. **Direct Entry Point**: Created `vercel.js` as a specialized entry point for Vercel that:
   - Imports the bundled app
   - Provides a handler function compatible with Vercel Functions
   - Handles converting between Node.js req/res and Fetch API Request/Response

3. **Updated Configuration**: Modified `vercel.json` to:
   - Use a custom build command
   - Specify an output directory
   - Use rewrites to direct all traffic to our entry point

## Key Files

- `build-for-vercel.js`: Custom build script for Vercel deployment
- `vercel.js`: Entry point for Vercel Functions
- `vercel.json`: Configuration for Vercel deployment
- `package.json`: Scripts and dependencies for the project

## Deployment Steps

1. Push changes to GitHub
2. Vercel automatically runs the build command: `bun run build:vercel`
3. The app is bundled with all dependencies into the dist directory
4. All requests are routed to the `vercel.js` handler

## Monorepo Considerations

- Using `"monorepo": true` in the root `vercel.json` helps Vercel understand the repository structure
- We directly bundle shared packages instead of trying to maintain separate packages in deployment
- The build script creates the necessary directory structure for module resolution in the output directory

## Environment Variables

Make sure to set these environment variables in the Vercel project:

- `MONGODB_URI` - MongoDB connection string
- `CLERK_SECRET_KEY` - Secret key for Clerk authentication
- `CLERK_PUBLISHABLE_KEY` - Publishable key for Clerk authentication
- `NODEJS_HELPERS` - Set to "0" to disable Vercel's Node.js helpers

## Debugging

If you encounter issues with the deployment:

1. Check the function logs in the Vercel dashboard
2. Try running the build script locally to see if there are any issues
3. Verify that all dependencies are properly bundled in the output directory 