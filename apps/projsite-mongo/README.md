# Projsite MongoDB API

This is the MongoDB-based API for Projsite, built with the Hono framework and TypeScript.

## Features

- RESTful API endpoints for managing projects and companies
- MongoDB database integration
- Clerk authentication
- OpenAPI documentation with Swagger UI
- Zod validation for request/response schemas

## Local Development

```bash
# Install dependencies
bun install

# Run in development mode with hot reloading
bun run dev

# Build for production
bun run build
```

## API Documentation

Once the server is running, you can access the Swagger UI documentation at:

```
http://localhost:8787/api/docs
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Required environment variables:

- `MONGODB_URI`: MongoDB connection string
- `CLERK_SECRET_KEY`: Clerk secret key
- `CLERK_PUBLISHABLE_KEY`: Clerk publishable key

## Vercel Deployment

This API can be deployed to Vercel Functions using the Node.js runtime. See the detailed deployment guide in [VERCEL.md](./VERCEL.md).

Quick deployment steps:

1. Link to Vercel project:
   ```bash
   npx vercel link
   ```

2. Deploy to Vercel:
   ```bash
   npx vercel
   ```

For a summary of the deployment setup and next steps, see [DEPLOYMENT-SUMMARY.md](./DEPLOYMENT-SUMMARY.md).

## Project Structure

```
src/
├── index.ts          # Main application setup
├── server.ts         # Server entry point
├── routes/           # API route handlers
├── schemas/          # Zod validation schemas
├── services/         # Business logic and database operations
├── middleware/       # Custom middleware
├── utils/            # Utility functions
└── types/            # TypeScript type definitions
```

## Monorepo Context

This API is part of the Projsite monorepo and uses shared packages:

- `@projsite/types`: Shared TypeScript types
- `@projsite/auth`: Shared authorization utilities

## Setup

1. Install dependencies:
```bash
bun install
```

2. Set up environment variables:
- Copy `.env.example` to `.env`
- Update the values in `.env` with your configuration:
  - `MONGODB_URI`: Your MongoDB connection string
  - `CLERK_SECRET_KEY`: Your Clerk secret key
  - `SERVICE_API_KEY`: Your service API key

3. Start MongoDB locally (if using local development):
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

4. Run the development server:
```bash
bun run dev
```

## Deployment

1. Set up your environment variables on your server:
```bash
export MONGODB_URI="your-mongodb-uri"
export CLERK_SECRET_KEY="your-clerk-secret-key"
export SERVICE_API_KEY="your-service-api-key"
```

2. Build and run the application:
```bash
# Build the application
bun run build

# Start the server
bun run start
```

## API Documentation

The API documentation is available at `/swagger` when running the server.

## Available Endpoints

### Organizations
- `GET /api/organizations` - List all organizations
- `GET /api/organizations/:id` - Get organization by ID
- `POST /api/organizations` - Create new organization
- `PUT /api/organizations/:id` - Update organization
- `DELETE /api/organizations/:id` - Delete organization (soft delete)

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project (soft delete)

## Development

This API runs alongside the PostgreSQL version of the API, allowing for parallel development and testing of both database implementations. 