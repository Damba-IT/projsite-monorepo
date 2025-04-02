import { z } from "zod";
import { dateRangeSchema, locationSchema } from "../common/schema";

const formValidationRulesSchema = z.object({
  shipment_booking: z.object({
    contractor: z.boolean().default(false),
    responsible_person: z.boolean().default(false),
    supplier: z.boolean().default(false),
    unloading_zone: z.boolean().default(false),
    prevent_zone_collide: z.boolean().default(false),
    sub_project: z.boolean().default(false),
    resources: z.boolean().default(false),
    env_data: z.boolean().default(false),
  }),
  resource_booking: z.object({
    contractor: z.boolean().default(false),
    responsible_person: z.boolean().default(false),
    sub_project: z.boolean().default(false),
    resources: z.boolean().default(false),
  }),
  waste_booking: z.object({
    sub_project: z.boolean().default(false),
    waste: z.boolean().default(false),
  }),
});

const projectSettingsSchema = z.object({
  waste_booking_color: z.string().default("#456ed5"),
  resource_booking_color: z.string().default("#aed5ab"),
  information: z.string().default(""),
  shipment_module: z.boolean().default(true),
  checkpoint_module: z.boolean().default(false),
  warehouse_module: z.boolean().default(false),
  waste_module: z.boolean().default(false),
  scanner_module: z.boolean().default(false),
  auto_approval: z.boolean().default(false),
  waste_auto_approval: z.boolean().default(true),
  sub_projects: z.boolean().default(false),
  unbooked: z.boolean().default(false),
  form_validation_rules: formValidationRulesSchema,
  custom_project: z.string().optional(),
});

export const createProjectSchema = z.object({
  project_id: z.string(),
  project_name: z.string().min(1, "Project name is required"),
  company_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  location: locationSchema,
  date_range: dateRangeSchema,
  settings: projectSettingsSchema,
  created_by: z.string().optional(),
  status: z.boolean().default(true),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  status: z.boolean().optional(),
});
