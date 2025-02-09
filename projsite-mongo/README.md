# Projsite API (MongoDB Version)

This is the MongoDB version of the Projsite API, built with:
- Hono framework
- MongoDB
- TypeScript
- Cloudflare Workers
- Clerk Authentication

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
- Copy `.dev.vars.example` to `.dev.vars`
- Update the values in `.dev.vars` with your configuration:
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
npm run dev
```

## Deployment

1. Set up your Cloudflare Worker secrets:
```bash
wrangler secret put MONGODB_URI
wrangler secret put CLERK_SECRET_KEY
wrangler secret put SERVICE_API_KEY
```

2. Deploy to Cloudflare Workers:
```bash
npm run deploy
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