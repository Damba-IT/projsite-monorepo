# Migration Guide to Monorepo Structure

This guide will help you transition from the current repository structure to the new Turborepo-based monorepo structure.

## Current Structure

```
projsite-api/
├── projsite-postgres/    # PostgreSQL implementation
├── projsite-mongo/       # MongoDB implementation
└── package.json         # Root package.json
```

## New Structure (Monorepo)

```
projsite-monorepo/
├── apps/
│   ├── projsite-mongo/       # MongoDB-based API
│   ├── projsite-postgres/    # PostgreSQL-based API
│   ├── projsite-web/         # Next.js web application (future)
│   └── projsite-mobile/      # Expo mobile application (future)
└── packages/
    ├── projsite-types/       # Shared TypeScript types
    └── projsite-auth/        # Shared authentication utilities
```

## Migration Steps

### 1. Initialize Git Repository (Optional - if you want to start fresh)

```bash
# Create a new git repository if needed
git init
git add .
git commit -m "Initial commit for monorepo structure"
```

### 2. Clean Up Existing Directories

We have already copied the contents of the `projsite-mongo` and `projsite-postgres` directories to the `apps` directory. You can remove the original directories after verifying that everything is working correctly:

```bash
# Remove original directories (only after verifying the apps directory has the correct contents)
rm -rf projsite-mongo projsite-postgres
```

### 3. Install Dependencies

```bash
# Install dependencies for the entire monorepo
bun install
```

### 4. Update Import Paths

You'll need to update import paths in your code to reflect the new package names:

- Update any imports of types from `projsite-types` to `@projsite/types`
- Add imports for auth utilities from `@projsite/auth` where needed

### 5. Configure Workspaces in External Tools

If you use any CI/CD tools or other external services, update them to work with the new monorepo structure.

## Running Apps in Development Mode

```bash
# Run all apps and packages
bun run dev

# Run specific apps
bun run dev --filter=@projsite/api-mongo
bun run dev --filter=@projsite/api-postgres
```

## Building Apps

```bash
# Build all apps and packages
bun run build

# Build specific apps
bun run build --filter=@projsite/api-mongo
```

## Next Steps

1. Integrate `projsite-web` (Next.js) and `projsite-mobile` (Expo) apps into the monorepo
2. Enhance shared packages (`@projsite/types` and `@projsite/auth`) with more functionality
3. Set up CI/CD for the monorepo 