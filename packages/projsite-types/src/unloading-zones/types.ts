import { BaseEntity } from "../common/types";
import { createUnloadingZoneSchema, updateUnloadingZoneSchema } from "./schema";
import { z } from "zod";

export interface UnloadingZone extends BaseEntity {
  unloading_zone_name: string;
  project_id: string;
  zone_color: string;
  active: boolean;
  created_by?: string;
  created_at: Date;
  updated_at: Date;
}

export type CreateUnloadingZone = z.infer<typeof createUnloadingZoneSchema>;
export type UpdateUnloadingZone = z.infer<typeof updateUnloadingZoneSchema>;
