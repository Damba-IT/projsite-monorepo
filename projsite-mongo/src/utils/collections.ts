// Collections
export const Collections = {
  ORGANIZATIONS: 'company',
  PROJECTS: 'projects',
  USERS: 'users',
  NINJA_ORDERS: 'ninja_orders',
} as const;

// Types
export type CollectionName = typeof Collections[keyof typeof Collections]; 