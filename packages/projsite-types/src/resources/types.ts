import { z } from "zod";
import { BaseEntity } from "../common/types";
import { createResourceSchema, updateResourceSchema } from "./schema";

export interface Resource extends BaseEntity {
    resource_name: string;
    project_id: string;
    resource_pattern: string;
    assigned_users: string[];
    active: boolean;
  }

  export type CreateResource = z.infer<typeof createResourceSchema>;
  export type UpdateResource = z.infer<typeof updateResourceSchema>; 