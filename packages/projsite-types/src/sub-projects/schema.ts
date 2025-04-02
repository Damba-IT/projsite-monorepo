import { z } from "zod";
import { objectIdSchema } from "../common/schema";

export const createSubProjectSchema = z.object({
  sub_project_name: z
    .string()
    .nonempty("Sub project name is required")
    .refine(
      val => val.trim().length > 0,
      "Sub project name cannot be empty or just spaces"
    ),
  project_id: objectIdSchema,
  active: z.boolean().default(true),
  created_by: z.string().optional(),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export const updateSubProjectSchema = createSubProjectSchema.partial().extend({
  updated_at: z.date().default(() => new Date()),
});
