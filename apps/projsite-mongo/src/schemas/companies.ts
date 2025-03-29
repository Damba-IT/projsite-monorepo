import { z } from 'zod';
import { ObjectId } from 'mongodb';
import type { Company } from '../types';

// Base schema with common fields
const baseCompanySchema = z.object({
  name: z.string().min(1),
  settings: z.object({
    warehouse_module: z.boolean()
  })
});

// Create schema
export const createCompanySchema = baseCompanySchema.extend({
  active: z.boolean().optional().default(true),
  logo: z.string().optional(),
  created_by_user: z.string().optional(),
  created_by_service: z.string().optional()
});

// Update schema
export const updateCompanySchema = baseCompanySchema
  .partial()
  .extend({
    active: z.boolean().optional(),
    logo: z.string().optional(),
  });

// Response schema
export const companyResponseSchema = baseCompanySchema.extend({
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
export const searchCompanySchema = z.object({
  query: z.string().min(1).max(100)
});

export type SearchCompanyQuery = z.infer<typeof searchCompanySchema>;

// Type inference
export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type CompanyResponse = z.infer<typeof companyResponseSchema>; 