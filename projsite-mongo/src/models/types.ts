import { Document } from 'mongoose';

export type ProjectStatus = 'active' | 'inactive' | 'deleted';

export interface OrganizationSettings {
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

export interface IOrganization extends Document {
  name: string;
  active: boolean;
  is_deleted: boolean;
  logo?: string;
  settings: OrganizationSettings;
  created_by_user?: string;
  created_by_service?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IProject extends Document {
  project_id: string;
  name: string;
  organization: IOrganization['_id'];
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

export interface IUser extends Document {
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  old_phone_number?: string;
  password?: string;
  organization?: IOrganization['_id'];
  super_admin: boolean;
  image?: string;
} 