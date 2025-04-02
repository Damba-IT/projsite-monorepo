import { z } from "zod";
import { objectIdSchema } from "../common/schema";

export const createUnloadingZoneSchema = z.object({
  unloading_zone_name: z
    .string()
    .nonempty("Unloading zone name is required")
    .refine(
      val => val.trim().length > 0,
      "Unloading zone name cannot be empty or just spaces"
    ),
  project_id: objectIdSchema,
  zone_color: z.string().nonempty("Unloading Zone color is required"),
  active: z.boolean().default(true),
  created_by: z.string().optional(),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export const updateUnloadingZoneSchema = createUnloadingZoneSchema
  .partial()
  .extend({
    updated_at: z.date().default(() => new Date()),
  });
