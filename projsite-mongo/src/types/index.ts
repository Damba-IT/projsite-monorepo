import { ObjectId, Db } from 'mongodb';

export type ProjectStatus = 'active' | 'inactive' | 'deleted';

// Environment type for Hono
export interface HonoEnv {
  Bindings: {
    MONGODB_URI: string;
    CLERK_PUBLISHABLE_KEY: string;
    CLERK_SECRET_KEY: string;
  };
  Variables: {
    db: Db;
  };
}

export interface CompanySettings {
  warehouse_module: boolean;
}

export interface ProjectSettings {
  waste_booking_color: string;
  resource_booking_color: string;
  information: string;
  shipment_module: boolean;
  checkpoint_module: boolean;
  warehouse_module: boolean;
  waste_module: boolean;
  inbox_module: boolean;
  auto_approval: boolean;
  waste_auto_approval: boolean;
  sub_projects_enabled: boolean;
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

export interface Company {
  _id?: ObjectId;
  name: string;
  active: boolean;
  is_deleted: boolean;
  logo?: string;
  settings: CompanySettings;
  created_by_user?: string;
  created_by_service?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  _id?: ObjectId;
  project_id: string;
  name: string;
  company_id: ObjectId;
  start_date: Date;
  end_date: Date;
  status: ProjectStatus;
  location_address?: string;
  location_formatted_address?: string;
  location_place_id?: string;
  location_lat?: string;
  location_lng?: string;
  created_by: string;
  last_modified_by?: string;
  created_at: Date;
  updated_at: Date;
  settings: ProjectSettings;
  form_validation_rules: FormValidationRules;
}

export interface User {
  _id?: ObjectId;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  old_phone_number?: string;
  password?: string;
  company_id?: ObjectId;
  super_admin: boolean;
  image?: string;
}

export interface Resource {
  _id?: ObjectId;
  resource_name: string;
  project_id: string;
  resource_pattern: string;
  assigned_users: string[];
  active: boolean;
  created_at: Date;
  updated_at: Date;
}