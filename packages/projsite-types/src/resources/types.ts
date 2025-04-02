import { BaseEntity } from "../common/types";

export interface Resource extends BaseEntity {
    resource_name: string;
    project_id: string;
    resource_pattern: string;
    assigned_users: string[];
    active: boolean;
  }