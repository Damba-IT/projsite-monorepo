# Projsite Monorepo Setup

## What We've Done

We've converted the existing `projsite-api` repository into a Turborepo-based monorepo with the following features:

1. **Renamed the repository** to `projsite-monorepo` (in package.json, the actual repo name change would be done on GitHub)

2. **Created a monorepo structure** with:
   - `apps/` directory for applications
   - `packages/` directory for shared libraries

3. **Moved existing projects** into the apps directory:
   - `projsite-mongo` → `apps/projsite-mongo`
   - `projsite-postgres` → `apps/projsite-postgres`

4. **Created shared packages**:
   - `packages/projsite-types` - Common TypeScript types
   - `packages/projsite-auth` - Shared authorization utilities

5. **Added placeholder directories** for future applications:
   - `apps/projsite-web` - Next.js web application
   - `apps/projsite-mobile` - Expo mobile application

6. **Updated package names** to use the `@projsite` scope:
   - `@projsite/api-mongo`
   - `@projsite/api-postgres`
   - `@projsite/types`
   - `@projsite/auth`

7. **Configured Turborepo** with:
   - Root package.json with workspace configuration
   - turbo.json with pipeline configuration
   - Updated scripts for development, building, and testing

## Next Steps

1. **Remove original directories** after verifying everything works:
   ```bash
   rm -rf projsite-mongo projsite-postgres
   ```

2. **Install dependencies** for the entire monorepo:
   ```bash
   bun install
   ```

3. **Test the monorepo setup**:
   ```bash
   # Test building all packages
   bun run build
   
   # Test running the development servers
   bun run dev --filter=@projsite/api-mongo
   bun run dev --filter=@projsite/api-postgres
   ```

4. **Update import paths** in your codebase to use the new package names:
   - Update any imports from `projsite-types` to `@projsite/types`
   - Add imports from `@projsite/auth` where needed

5. **Integrate the other repositories**:
   - Integrate the `projsite-web` (Next.js) repository into the `apps/projsite-web` directory
   - Integrate the `projsite-mobile` (Expo) repository into the `apps/projsite-mobile` directory

6. **Set up CI/CD** for the monorepo:
   - Configure GitHub Actions or other CI/CD tools to work with the monorepo structure

7. **Update documentation** to reflect the new monorepo structure

## Benefits of the Monorepo Structure

- **Shared code**: Easier to share code between projects
- **Consistent tooling**: Standardized tooling across all projects
- **Simplified dependencies**: Centralized dependency management
- **Atomic changes**: Make changes across multiple projects in a single commit
- **Better collaboration**: Easier for teams to work on multiple projects
- **Simplified CI/CD**: Build and test multiple projects together 