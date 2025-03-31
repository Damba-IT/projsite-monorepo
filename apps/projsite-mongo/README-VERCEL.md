# Vercel Deployment - Simplified Approach

We've simplified the Vercel deployment process for the Hono API with these changes:

## 1. ES Module Compatibility

- Changed `api/index.js` to use ES Module syntax (import/export)
- Set `process.env.NODEJS_HELPERS = '0'` to disable Vercel's Node.js helpers

## 2. Bundle Shared Packages

- Removed `@projsite/types` and `@projsite/auth` from the `external` list in the build command
- This ensures they get bundled directly into the output file

## 3. Simplified Configuration

- Kept `vercel.json` minimal with just rewrites and environment settings
- No complex build configuration in vercel.json

## Deployment Steps

1. Make sure `.env` variables are set in Vercel dashboard
2. Push changes to GitHub
3. Vercel should deploy automatically

## Troubleshooting

If you still encounter issues:
1. Check Vercel logs for specific errors
2. Verify MongoDB connection string is correctly set
3. Make sure CLERK keys are properly configured 