import { z } from 'zod';
import { ObjectId } from 'mongodb';
import type { Organization } from '../types';

// Base schema with common fields
const baseOrganizationSchema = z.object({
  name: z.string().min(1),
  settings: z.object({
    warehouse_module: z.boolean()
  })
});

// Create schema
export const createOrganizationSchema = baseOrganizationSchema.extend({
  active: z.boolean().optional().default(true),
  logo: z.string().optional(),
  created_by_user: z.string().optional(),
  created_by_service: z.string().optional()
});

// Update schema
export const updateOrganizationSchema = baseOrganizationSchema
  .partial()
  .extend({
    active: z.boolean().optional(),
    logo: z.string().optional(),
  });

// Response schema
export const organizationResponseSchema = baseOrganizationSchema.extend({
  _id: z.instanceof(ObjectId),
  active: z.boolean(),
  is_deleted: z.boolean(),
  logo: z.string().optional(),
  created_by_user: z.string().optional(),
  created_by_service: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date()
});

// Search query schema
export const searchOrganizationSchema = z.object({
  query: z.string().min(1).max(100)
});

export type SearchOrganizationQuery = z.infer<typeof searchOrganizationSchema>;

// Type inference
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type OrganizationResponse = z.infer<typeof organizationResponseSchema>; 