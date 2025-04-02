import { z } from 'zod';

export const createResourceSchema = z.object({
  resource_name: z.string().min(1, "Resource name is required"),
  project_id: z.string().min(1, "Project ID is required"),
  resource_pattern: z.string().min(1, "Resource pattern is required"),
  assigned_users: z.array(z.string()),
  created_by: z.string().min(1, "Created by is required"),
  active: z.boolean().default(true),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export const updateResourceSchema = createResourceSchema.partial().extend({
  updated_at: z.date(),
});
