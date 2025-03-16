import { z } from 'zod';

export const bookingParamsSchema = z.object({
  projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID'),
  bookingType: z.enum(['shipment', 'waste', 'resource']).optional(),
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking ID').optional()
}); 