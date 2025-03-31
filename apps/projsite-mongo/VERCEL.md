# Vercel Deployment Guide

This document explains how to deploy the Projsite MongoDB API to Vercel.

## Prerequisites

- A Vercel account
- MongoDB Atlas database
- Clerk authentication setup

## Environment Variables

Make sure to set up the following environment variables in your Vercel project:

- `MONGODB_URI`: Your MongoDB connection string
- `CLERK_SECRET_KEY`: Your Clerk secret key
- `CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `SERVICE_API_KEY`: (if needed for service-to-service communication)
- `NODEJS_HELPERS`: Set to "0" to disable Vercel's Node.js helpers

## Deployment Structure

The deployment is configured to use Vercel's Node.js runtime with the following components:

- `vercel.json`: Configures build settings and routing
- `api/index.js`: Entry point for Vercel Functions
- `dist/index.js`: Compiled output from the build process

## Local Testing

To test the Vercel deployment locally:

1. Install Vercel CLI: `bun add -g vercel`
2. Run: `vercel dev` from the project directory

## Troubleshooting

If you encounter issues with the deployment:

1. Check that all environment variables are properly set
2. Verify MongoDB connection string and network access settings
3. Review build logs for any errors
4. Ensure the correct Node.js version is being used (16+)

## Monorepo Considerations

This project is part of a Turborepo monorepo. The build process is configured to handle dependencies correctly, but be aware of the following:

- Shared packages are marked as external in the build
- Build command references the monorepo structure
- Dependencies are properly resolved via workspace references 