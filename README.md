# Projsite API

This repository contains two implementations of the Projsite API:
1. PostgreSQL version (using Drizzle ORM)
2. MongoDB version (using Mongoose)

Both implementations share the same API interface and functionality but use different databases.

## Prerequisites

- [Bun](https://bun.sh) installed on your system
- Node.js 18+ (for some development tools)
- Docker (optional, for running databases locally)

## Project Structure

```
projsite-api/
├── projsite-postgres/    # PostgreSQL implementation
│   ├── src/             # Source code
│   ├── drizzle/         # Database migrations
│   └── ...
│
├── projsite-mongo/      # MongoDB implementation
│   ├── src/             # Source code
│   └── ...
│
└── package.json         # Root package.json for managing both implementations
```

## Setup

1. Install dependencies for both implementations:
```bash
bun run install:all
```

2. Set up environment variables:
- For PostgreSQL version:
  ```bash
  cd projsite-postgres
  cp .dev.vars.example .dev.vars
  # Update .dev.vars with your PostgreSQL configuration
  ```
- For MongoDB version:
  ```bash
  cd projsite-mongo
  cp .dev.vars.example .dev.vars
  # Update .dev.vars with your MongoDB configuration
  ```

## Development

You can run either implementation in development mode:

- PostgreSQL version:
  ```bash
  bun run dev:pg
  ```

- MongoDB version:
  ```bash
  bun run dev:mongo
  ```

## Deployment

Deploy either implementation to Cloudflare Workers:

- PostgreSQL version:
  ```bash
  bun run deploy:pg
  ```

- MongoDB version:
  ```bash
  bun run deploy:mongo
  ```

## API Documentation

Both implementations expose their API documentation at `/swagger` when running the server.

## Common Features

Both implementations provide:
- Organization management
- Project management
- User authentication via Clerk
- Swagger documentation
- TypeScript support
- Cloudflare Workers deployment

The main difference is in the database layer and ORM used:
- PostgreSQL version uses Drizzle ORM
- MongoDB version uses Mongoose

## Performance

Using Bun as the runtime provides several advantages:
- Faster startup times
- Better TypeScript performance
- Native SQLite3 support
- Compatible with Node.js packages
- Built-in test runner and bundler
