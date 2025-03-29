import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const ninjaOrderStatusEnum = z.enum(['pending', 'processing', 'completed', 'cancelled', 'deleted'] as const);
export type NinjaOrderStatus = z.infer<typeof ninjaOrderStatusEnum>;

export const ninjaOrderCreatedByServiceEnum = z.enum(['web', 'mobile', "public_web"] as const);
export type NinjaOrderCreatedByService = z.infer<typeof ninjaOrderCreatedByServiceEnum>;

export const createNinjaOrderSchema = z.object({
  service_type: z.string(),
  service_form_values: z.record(z.any()),
  company_id: z.string(),
  status: ninjaOrderStatusEnum.default('pending'),
  total_cost: z.number().positive('Total cost must be positive'),
  notes: z.string().optional(),
  created_by_user: z.string().optional(),
  created_by_service: ninjaOrderCreatedByServiceEnum,
});

export const updateNinjaOrderSchema = createNinjaOrderSchema
  .partial()
  .extend({
    _id: z.instanceof(ObjectId),
    status: ninjaOrderStatusEnum.exclude(['deleted']).optional(),
    last_modified_by: z.string()
  });

export type CreateNinjaOrder = z.infer<typeof createNinjaOrderSchema>;
export type UpdateNinjaOrder = z.infer<typeof updateNinjaOrderSchema>; 