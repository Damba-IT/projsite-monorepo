import { ObjectId } from 'mongodb';
import { BaseEntity, ProjectStatus } from '../common';

export interface Project extends BaseEntity {
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
  settings: ProjectSettings;
  form_validation_rules: FormValidationRules;
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