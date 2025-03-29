# Projsite Monorepo

This monorepo contains all the code for the Projsite platform, including APIs, frontend applications, and shared libraries.

## Structure

The monorepo is structured as follows:

```
projsite-monorepo/
├── apps/
│   ├── projsite-mongo/       # MongoDB-based API
│   ├── projsite-postgres/    # PostgreSQL-based API on Cloudflare Workers
│   ├── projsite-web/         # Next.js web application (future)
│   └── projsite-mobile/      # Expo mobile application (future)
└── packages/
    ├── projsite-types/       # Shared TypeScript types
    └── projsite-auth/        # Shared authentication utilities
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0.0 or higher)
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
bun install
```

### Development

To start development on all apps and packages:

```bash
bun run dev
```

To start development on a specific app or package:

```bash
bun run dev --filter=@projsite/api-mongo  # MongoDB API
bun run dev --filter=@projsite/api-postgres  # PostgreSQL API
```

### Building

To build all apps and packages:

```bash
bun run build
```

To build a specific app or package:

```bash
bun run build --filter=@projsite/api-mongo
```

## API Documentation

### MongoDB API (@projsite/api-mongo)

The MongoDB API is built with Hono and MongoDB. Documentation is available via Swagger UI at `/docs` when running the development server.

### PostgreSQL API (@projsite/api-postgres)

The PostgreSQL API is built with Hono, Drizzle ORM, and PostgreSQL on Cloudflare Workers. Documentation is available via Swagger UI at `/docs` when running the development server.

## Shared Packages

### @projsite/types

Shared TypeScript types used across the monorepo.

### @projsite/auth

Shared authentication utilities used by both APIs and frontend applications.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on the process for submitting pull requests.

## License

This project is licensed under the ISC License.
