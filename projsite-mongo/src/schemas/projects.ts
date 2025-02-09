import { z } from 'zod';
import { ObjectId } from 'mongodb';
import type { Project, ProjectStatus } from '../types';

// Base validation rules schemas
const shipmentBookingRules = z.object({
  contractor: z.boolean(),
  responsible_person: z.boolean(),
  supplier: z.boolean(),
  unloading_zone: z.boolean(),
  prevent_zone_collide: z.boolean(),
  sub_project: z.boolean(),
  resources: z.boolean(),
  env_data: z.boolean()
});

const resourceBookingRules = z.object({
  contractor: z.boolean(),
  responsible_person: z.boolean(),
  sub_project: z.boolean(),
  resources: z.boolean()
});

const wasteBookingRules = z.object({
  sub_project: z.boolean(),
  waste: z.boolean()
});

// Base settings schema
const projectSettings = z.object({
  waste_booking_color: z.string(),
  resource_booking_color: z.string(),
  information: z.string(),
  shipment_module: z.boolean(),
  checkpoint_module: z.boolean(),
  warehouse_module: z.boolean(),
  waste_module: z.boolean(),
  inbox_module: z.boolean(),
  auto_approval: z.boolean(),
  waste_auto_approval: z.boolean(),
  sub_projects_enabled: z.boolean()
});

const defaultSettings = {
  waste_booking_color: "#456ed5",
  resource_booking_color: "#aed5ab",
  information: "",
  shipment_module: true,
  checkpoint_module: false,
  warehouse_module: false,
  waste_module: false,
  inbox_module: false,
  auto_approval: false,
  waste_auto_approval: true,
  sub_projects_enabled: false
} as const;

const defaultFormValidationRules = {
  shipment_booking: {
    contractor: false,
    responsible_person: false,
    supplier: false,
    unloading_zone: false,
    prevent_zone_collide: false,
    sub_project: false,
    resources: false,
    env_data: false
  },
  resource_booking: {
    contractor: false,
    responsible_person: false,
    sub_project: false,
    resources: false
  },
  waste_booking: {
    sub_project: false,
    waste: false
  }
} as const;

// Base schema with common fields
const baseProjectSchema = z.object({
  project_id: z.string(),
  name: z.string().min(1),
  organization_id: z.string().transform(id => new ObjectId(id)),
  start_date: z.string().transform(str => new Date(str)),
  end_date: z.string().transform(str => new Date(str)),
  location_address: z.string().optional(),
  location_formatted_address: z.string().optional(),
  location_place_id: z.string().optional(),
  location_lat: z.string().optional(),
  location_lng: z.string().optional()
});

// Create schema
export const createProjectSchema = baseProjectSchema.extend({
  created_by: z.string(),
  settings: projectSettings.default(defaultSettings),
  form_validation_rules: z.object({
    shipment_booking: shipmentBookingRules,
    resource_booking: resourceBookingRules,
    waste_booking: wasteBookingRules
  }).default(defaultFormValidationRules)
});

// Update schema
export const updateProjectSchema = baseProjectSchema
  .partial()
  .extend({
    last_modified_by: z.string().optional(),
    status: z.enum(['active', 'inactive', 'deleted'] as const).optional(),
    settings: projectSettings.optional(),
    form_validation_rules: z.object({
      shipment_booking: shipmentBookingRules,
      resource_booking: resourceBookingRules,
      waste_booking: wasteBookingRules
    }).optional()
  });

// Response schema
export const projectResponseSchema = baseProjectSchema.extend({
  _id: z.instanceof(ObjectId),
  status: z.enum(['active', 'inactive', 'deleted'] as const),
  settings: projectSettings,
  form_validation_rules: z.object({
    shipment_booking: shipmentBookingRules,
    resource_booking: resourceBookingRules,
    waste_booking: wasteBookingRules
  }),
  created_by: z.string(),
  last_modified_by: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
  organization: z.any() // This will be populated with organization data
});

// Type inference
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectResponse = z.infer<typeof projectResponseSchema>; 