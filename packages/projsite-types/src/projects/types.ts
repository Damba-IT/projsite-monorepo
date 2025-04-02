import { BaseEntity, DateRange, Location } from "../common/types";
import { createProjectSchema, updateProjectSchema } from "./schema";
import { z } from "zod";

export interface Project extends BaseEntity {
  project_id: string;
  project_name: string;
  company_id: string;
  status: boolean;
  location: Location;
  date_range: DateRange;
  settings: ProjectSettings;
}

export interface ProjectSettings {
  waste_booking_color: string;
  resource_booking_color: string;
  information: string;
  shipment_module: boolean;
  checkpoint_module: boolean;
  warehouse_module: boolean;
  waste_module: boolean;
  scanner_module: boolean;
  auto_approval: boolean;
  waste_auto_approval: boolean;
  sub_projects: boolean;
  unbooked: boolean;
  form_validation_rules: FormValidationRules;
  custom_project?: string;
}

export interface FormValidationRules {
  shipment_booking: {
    contractor: boolean;
    responsible_person: boolean;
    supplier: boolean;
    unloading_zone: boolean;
    prevent_zone_collide: boolean;
    sub_project: boolean;
    resources: boolean;
    env_data: boolean;
  };
  resource_booking: {
    contractor: boolean;
    responsible_person: boolean;
    sub_project: boolean;
    resources: boolean;
  };
  waste_booking: {
    sub_project: boolean;
    waste: boolean;
  };
}

export type CreateProject = z.infer<typeof createProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
