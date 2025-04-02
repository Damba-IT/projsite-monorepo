# @projsite/api-mongo

A MongoDB-powered backend API service built with the Hono framework, designed to run on Vercel's serverless infrastructure.

## 🚀 Features

- Built with [Hono](https://hono.dev/) - a lightweight, ultrafast web framework
- MongoDB integration for data persistence
- Authentication via Clerk
- API validation using Zod
- Swagger UI for API documentation
- TypeScript support
- Vercel serverless deployment ready

## 📦 Installation

```bash
# Install dependencies
bun install
```

## 🔧 Configuration

Create a `.env` file in the root directory based on `.env.example`:

```env
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret
# Add other required environment variables
```

## 🛠️ Development

```bash
# Start development server with hot reload
bun run dev

# Build the application
bun run build

# Test Vercel deployment locally
bun run vercel:local
```

## 📁 Vercel Deployment Structure

The project follows a specific structure required for Vercel serverless deployment:

## 📝 Project Structure

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

## Development

This API runs alongside the PostgreSQL version of the API, allowing for parallel development and testing of both database implementations.

### Understanding the Vercel Bundle Structure

1. **Source Code (`src/`)**

   - Contains your main Hono application code
   - Written in TypeScript
   - Entry point is typically `src/index.ts`

2. **Build Output (`dist/`)**

   - Generated during `bun run build`
   - Contains the bundled application
   - Build command: `bun build src/index.ts --outdir dist --target node --external mongodb --format esm`

3. **Vercel Entry Point (`api/index.js`)**

   ```javascript
   import app from "../dist/index.js";
   import { handle } from "@hono/node-server/vercel";

   export default handle(app);
   ```

   - Required by Vercel for serverless deployment
   - Imports the bundled application from `dist/`
   - Uses Hono's Vercel adapter to handle requests

4. **Vercel Configuration (`vercel.json`)**
   - Configures how Vercel serves your application
   - Defines build settings and routing

### Build & Deploy Flow

1. When you deploy to Vercel:
   - `vercel-build` script runs `bun run build`
   - Source code is bundled into `dist/`
   - Vercel uses `api/index.js` as the serverless function entry point
   - The bundled app is imported and served through Vercel's infrastructure
