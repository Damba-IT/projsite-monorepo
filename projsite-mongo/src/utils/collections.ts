// Collections
export const Collections = {
  ORGANIZATIONS: 'company',
  PROJECTS: 'projects',
  USERS: 'users',
} as const;

// Types
export type CollectionName = typeof Collections[keyof typeof Collections]; 