import { BaseEntity } from '../common';

export interface Organization extends BaseEntity {
  name: string;
  active: boolean;
  is_deleted: boolean;
  logo?: string;
  settings: OrganizationSettings;
  created_by_user?: string;
  created_by_service?: string;
} 

export interface OrganizationSettings {
  warehouse_module: boolean;
} 