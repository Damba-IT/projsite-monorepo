import { ObjectId } from 'mongodb';
import { locationSchema, dateRangeSchema } from './schema';
import { z } from 'zod';
// Common Base Types
export interface BaseEntity {
  _id?: ObjectId;
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  last_modified_by?: string;
} 

export type Location = z.infer<typeof locationSchema>;
export type DateRange = z.infer<typeof dateRangeSchema>;