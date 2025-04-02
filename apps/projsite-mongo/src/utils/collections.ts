// Collections
export const Collections = {
  COMPANIES: "company",
  PROJECTS: "projects",
  USERS: "users",
  NINJA_ORDERS: "ninja_orders",
  RESOURCES: "resource",
  SUB_PROJECTS: "sub_project",
  UNLOADING_ZONES: "unloading_zone",
} as const;

// Types
export type CollectionName = (typeof Collections)[keyof typeof Collections];
