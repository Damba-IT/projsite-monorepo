# @projsite/types

Shared TypeScript types and Zod validation schemas for Projsite applications.

## Installation

This package is part of the Projsite monorepo and is automatically installed as a workspace dependency. No additional installation is required.

## Usage

### Importing Types and Schemas

```typescript
// Import types
import type { NinjaOrder, Project, Company } from '@projsite/types';

// Import schemas for validation
import { createNinjaOrderSchema, createProjectSchema } from '@projsite/types';

// Import specific domain types
import type { NinjaOrderStatus, ProjectSettings } from '@projsite/types';
```

### Using Schemas for Validation

```typescript
import { createNinjaOrderSchema } from '@projsite/types';

// Validate data
const result = createNinjaOrderSchema.parse({
  service_type: 'delivery',
  company_id: '123',
  total_cost: 100,
  created_by_service: 'web'
});

// Type-safe validation
if (result.success) {
  const order: CreateNinjaOrder = result.data;
  // Use the validated data
}
```

## Package Structure

```
src/
├── common.ts              # Common types and utilities
├── index.ts              # Main entry point
├── ninja-orders/         # Ninja orders domain
│   ├── index.ts         # Exports everything from this domain
│   ├── schema.ts        # Zod validation schemas
│   └── types.ts         # TypeScript interfaces
├── companies/           # Companies domain
│   ├── index.ts
│   ├── schema.ts
│   └── types.ts
└── projects/            # Projects domain
    ├── index.ts
    ├── schema.ts
    └── types.ts
```

## Development

### Building

```bash
# Build the package
bun run build

# Development with watch mode
bun run dev

# Type checking
bun run type-check

# Linting
bun run lint
```

### Adding New Types or Schemas

1. Create a new domain directory if needed
2. Add your types to `types.ts`
3. Add your schemas to `schema.ts`
4. Export everything through `index.ts`
5. Update the main `src/index.ts` to export the new domain

### Best Practices

- Keep types and schemas in sync
- Use Zod's type inference when possible
- Document complex types or schemas
- Use the common types from `common.ts` for shared patterns
- Keep domain-specific code in its own directory

## Dependencies

### Peer Dependencies
- `mongodb`: ^6.0.0
- `zod`: ^3.0.0

### Development Dependencies
- TypeScript
- tsup (for building)
- ESLint
- Bun

## License

UNLICENSED - Private package 