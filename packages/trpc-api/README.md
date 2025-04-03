# @projsite/trpc-api

This package contains the tRPC API for the Projsite project. It exports both the tRPC router and direct service implementations, allowing flexibility in how the API is consumed.

## Features

- **tRPC Router**: Type-safe API with procedures for all business operations
- **Service Layer**: MongoDB service implementations for direct database access
- **Shared Types**: Uses `@projsite/types` for shared type definitions

## Usage in Next.js

```typescript
// apps/projsite-web/src/app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter, createTRPCContext } from "@projsite/trpc-api";
import { NextRequest } from "next/server";

const handler = async (req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });
};

export { handler as GET, handler as POST };
```

## Usage in Client

```typescript
// apps/projsite-web/src/utils/trpc.ts
import { createTRPCNext } from "@trpc/next";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@projsite/trpc-api";
import superjson from "superjson";

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        httpBatchLink({
          url: "/api/trpc",
        }),
      ],
    };
  },
  ssr: false,
});
```

## Available Procedures

- **projects**

  - `getAll`: Get all projects
  - `getById`: Get a project by ID
  - `create`: Create a new project
  - `update`: Update a project
  - `delete`: Soft-delete a project
  - `getByCompany`: Get projects by company
  - `getByDateRange`: Get projects within a date range

- **companies**

  - `getAll`: Get all companies
  - `getById`: Get a company by ID
  - `create`: Create a new company
  - `update`: Update a company
  - `delete`: Soft-delete a company
  - `getProjects`: Get projects for a company
  - `search`: Search companies by name

- **resources**

  - `getAll`: Get all resources
  - `getById`: Get a resource by ID
  - `getByProjectId`: Get resources by project ID
  - `getActiveByProjectId`: Get active resources by project ID
  - `getByAssignedUser`: Get resources assigned to a user
  - `create`: Create a new resource
  - `update`: Update a resource
  - `updateActiveStatus`: Update a resource's active status
  - `assignUsers`: Assign users to a resource
  - `delete`: Soft-delete a resource

- **subProjects**

  - `getAll`: Get all sub-projects
  - `getById`: Get a sub-project by ID
  - `getByProjectId`: Get sub-projects by project ID
  - `getActiveByProjectId`: Get active sub-projects by project ID
  - `create`: Create a new sub-project
  - `update`: Update a sub-project
  - `updateActiveStatus`: Update a sub-project's active status
  - `updateName`: Update a sub-project's name
  - `delete`: Soft-delete a sub-project

- **unloadingZones**

  - `getAll`: Get all unloading zones
  - `getById`: Get an unloading zone by ID
  - `getByProjectId`: Get unloading zones by project ID
  - `getActiveByProjectId`: Get active unloading zones by project ID
  - `create`: Create a new unloading zone
  - `update`: Update an unloading zone
  - `updateActiveStatus`: Update an unloading zone's active status
  - `updateName`: Update an unloading zone's name
  - `updateColor`: Update an unloading zone's color
  - `delete`: Soft-delete an unloading zone

- **ninja**
  - `getAll`: Get all ninja orders
  - `getById`: Get a ninja order by ID
  - `getByCompany`: Get ninja orders by company ID
  - `getByDateRange`: Get ninja orders within a date range
  - `getByStatus`: Get ninja orders by status
  - `getByCustomer`: Get ninja orders by customer email
  - `create`: Create a new ninja order
  - `update`: Update a ninja order
  - `delete`: Soft-delete a ninja order

## Direct Service Usage

You can also use the services directly in your code:

```typescript
import {
  ProjectService,
  CompanyService,
  ResourceService,
  SubProjectService,
  UnloadingZoneService,
  NinjaOrderService,
} from "@projsite/trpc-api";
import { connectToDatabase } from "./db";

async function fetchProjects() {
  const db = await connectToDatabase();
  const projectService = new ProjectService(db);
  return await projectService.findAll();
}

async function fetchResourcesByProject(projectId: string) {
  const db = await connectToDatabase();
  const resourceService = new ResourceService(db);
  return await resourceService.findByProjectId(projectId);
}

async function fetchSubProjectsByProject(projectId: string) {
  const db = await connectToDatabase();
  const subProjectService = new SubProjectService(db);
  return await subProjectService.findByProjectId(projectId);
}
```
