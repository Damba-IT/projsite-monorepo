// Collections
export const Collections = {
  ORGANIZATIONS: 'organizations',
  PROJECTS: 'projects',
  USERS: 'users',
} as const;

// Types
export type CollectionName = typeof Collections[keyof typeof Collections]; 