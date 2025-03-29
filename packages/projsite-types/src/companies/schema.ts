import { z } from 'zod';

const companySettingsSchema = z.object({
  warehouse_module: z.boolean().default(false)
});

export const createCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  logo: z.string().optional(),
  settings: companySettingsSchema,
  created_by_user: z.string().optional(),
  created_by_service: z.string().optional()
});

export const updateCompanySchema = createCompanySchema
  .partial()
  .extend({
    active: z.boolean().optional(),
    last_modified_by: z.string()
  });

export type CreateCompany = z.infer<typeof createCompanySchema>;
export type UpdateCompany = z.infer<typeof updateCompanySchema>; 