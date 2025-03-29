import { BaseEntity } from '../common';

export interface Company extends BaseEntity {
  name: string;
  active: boolean;
  is_deleted: boolean;
  logo?: string;
  settings: CompanySettings;
  created_by_user?: string;
  created_by_service?: string;
} 

export interface CompanySettings {
  warehouse_module: boolean;
} 