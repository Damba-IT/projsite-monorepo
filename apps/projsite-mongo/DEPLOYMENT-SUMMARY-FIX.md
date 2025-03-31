# ES Module Fix for Vercel Deployment

## Issue Fixed

The deployment was failing with the error:

```
ReferenceError: require is not defined in ES module scope, you can use import instead
```

This happened because:
1. The package.json had `"type": "module"` which forces Node.js to treat .js files as ES modules
2. But the api/index.js file was using CommonJS syntax (`require()` and `module.exports`)

## Changes Made

1. **Updated API Handler to Use ES Module Syntax**:
   ```javascript
   // From CommonJS:
   const { default: app } = require('../dist/index.js');
   const { handle } = require('@hono/node-server/vercel');
   module.exports = handle(app);
   
   // To ES Modules:
   import { app } from '../dist/index.js';
   import { handle } from '@hono/node-server/vercel';
   export default handle(app);
   ```

2. **Updated Build Script to Output ES Modules**:
   ```json
   "build": "bun build src/index.ts --outdir dist --target node ... --format esm"
   ```

3. **Ensured Source Files Export Correctly**:
   ```typescript
   // In src/index.ts
   export default app;
   export { app };
   ```

4. **Updated Vercel Configuration**:
   ```json
   {
     "builds": [{
       "src": "api/index.js",
       "use": "@vercel/node",
       "config": {
         "includeFiles": ["dist/**"]
       }
     }],
     "routes": [{
       "src": "/(.*)",
       "dest": "/api/index.js"
     }],
     "env": {
       "NODEJS_HELPERS": "0"
     }
   }
   ```
   This ensures:
   - The dist directory (with bundled code) is included in the deployment
   - All requests are routed to our API handler
   - Node.js helpers are disabled for Hono compatibility

## Deployment Steps

1. Commit and push these changes to GitHub
2. Vercel should automatically deploy the updated code
3. If not, trigger a manual deployment in the Vercel dashboard

## What to Check

After deployment:
1. Check the function logs for any remaining errors
2. Verify API endpoints are working correctly
3. Ensure environment variables are set properly 