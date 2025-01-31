import { z } from 'zod';
import { ObjectId } from 'mongodb';
import type { User } from '../types';

// Base schema with common fields
const baseUserSchema = z.object({
  email: z.string().email(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  organization_id: z.string().transform(id => new ObjectId(id)).optional(),
  image: z.string().optional()
});

// Create schema
export const createUserSchema = baseUserSchema.extend({
  super_admin: z.boolean().optional().default(false),
  password: z.string().optional() // Optional since we might use Clerk for auth
});

// Update schema
export const updateUserSchema = baseUserSchema
  .partial()
  .extend({
    super_admin: z.boolean().optional(),
    old_phone_number: z.string().optional()
  });

// Response schema
export const userResponseSchema = baseUserSchema.extend({
  _id: z.instanceof(ObjectId),
  super_admin: z.boolean(),
  old_phone_number: z.string().optional(),
  organization: z.any().optional() // Will be populated with organization data if needed
});

// Type inference
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>; 