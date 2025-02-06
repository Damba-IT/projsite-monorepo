import { z } from 'zod';
import type { Collection } from 'mongodb';

export type Env = {
  MONGODB_URI: string;
  CLERK_SECRET_KEY: string;
  CLERK_PUBLISHABLE_KEY: string;
  SERVICE_API_KEY: string;
};

export type HonoEnv = {
  Bindings: Env;
  Variables: {
  };
};

// Booking API Types
export const BookingParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format'),
  bookingType: z.enum(['shipment', 'waste', 'resource']).optional(),
  expandReferences: z.boolean().optional()
});

export type BookingParams = z.infer<typeof BookingParamsSchema>;
export type PipelineOptions = { expandReferences?: boolean };

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
} 