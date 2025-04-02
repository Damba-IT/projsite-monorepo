import { BaseEntity } from "../common/types";
import { createSubProjectSchema, updateSubProjectSchema } from "./schema";
import { z } from "zod";

export interface SubProject extends BaseEntity {
  sub_project_name: string;
  project_id: string;
  active: boolean;
  created_by?: string;
  created_at: Date;
  updated_at: Date;
}

export type CreateSubProject = z.infer<typeof createSubProjectSchema>;
export type UpdateSubProject = z.infer<typeof updateSubProjectSchema>;
