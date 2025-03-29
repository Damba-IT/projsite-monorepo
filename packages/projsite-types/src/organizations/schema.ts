import { z } from 'zod';

const organizationSettingsSchema = z.object({
  warehouse_module: z.boolean().default(false)
});

export const createOrganizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  logo: z.string().optional(),
  settings: organizationSettingsSchema,
  created_by_user: z.string().optional(),
  created_by_service: z.string().optional()
});

export const updateOrganizationSchema = createOrganizationSchema
  .partial()
  .extend({
    active: z.boolean().optional(),
    last_modified_by: z.string()
  });

export type CreateOrganization = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganization = z.infer<typeof updateOrganizationSchema>; 