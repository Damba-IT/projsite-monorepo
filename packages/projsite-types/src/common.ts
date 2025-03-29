import { ObjectId } from 'mongodb';

// Status Types
export type ProjectStatus = 'active' | 'inactive' | 'deleted';

// Common Base Types
export interface BaseEntity {
  _id?: ObjectId;
  created_at: Date;
  updated_at: Date;
  created_by_user?: string;
  last_modified_by?: string;
} 