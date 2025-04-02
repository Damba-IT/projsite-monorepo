import { z } from 'zod';

const companySettingsSchema = z.object({
  warehouse_module: z.boolean().default(false)
});

export const createCompanySchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  image_url: z.string().optional(),
  settings: companySettingsSchema,
});

export const updateCompanySchema = createCompanySchema
  .partial()
  .extend({
    active: z.boolean().optional(),
    last_modified_by: z.string()
  });

export const searchCompanySchema = z.object({
  query: z.string().min(1).max(100)
});