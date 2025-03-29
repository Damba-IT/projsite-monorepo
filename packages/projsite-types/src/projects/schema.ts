import { z } from 'zod';

const projectSettingsSchema = z.object({
  waste_booking_color: z.string().default('#456ed5'),
  resource_booking_color: z.string().default('#aed5ab'),
  information: z.string().default(''),
  shipment_module: z.boolean().default(true),
  checkpoint_module: z.boolean().default(false),
  warehouse_module: z.boolean().default(false),
  waste_module: z.boolean().default(false),
  inbox_module: z.boolean().default(false),
  auto_approval: z.boolean().default(false),
  waste_auto_approval: z.boolean().default(true),
  sub_projects_enabled: z.boolean().default(false)
});

const formValidationRulesSchema = z.object({
  shipment_booking: z.object({
    contractor: z.boolean().default(false),
    responsible_person: z.boolean().default(false),
    supplier: z.boolean().default(false),
    unloading_zone: z.boolean().default(false),
    prevent_zone_collide: z.boolean().default(false),
    sub_project: z.boolean().default(false),
    resources: z.boolean().default(false),
    env_data: z.boolean().default(false)
  }),
  resource_booking: z.object({
    contractor: z.boolean().default(false),
    responsible_person: z.boolean().default(false),
    sub_project: z.boolean().default(false),
    resources: z.boolean().default(false)
  }),
  waste_booking: z.object({
    sub_project: z.boolean().default(false),
    waste: z.boolean().default(false)
  })
});

export const createProjectSchema = z.object({
  project_id: z.string(),
  name: z.string().min(1, 'Project name is required'),
  organization_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  location_address: z.string().optional(),
  location_formatted_address: z.string().optional(),
  location_place_id: z.string().optional(),
  location_lat: z.string().optional(),
  location_lng: z.string().optional(),
  settings: projectSettingsSchema,
  form_validation_rules: formValidationRulesSchema,
  created_by: z.string()
});

export const updateProjectSchema = createProjectSchema
  .partial()
  .extend({
    status: z.enum(['active', 'inactive']).optional(),
    last_modified_by: z.string()
  });

export type CreateProject = z.infer<typeof createProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>; 