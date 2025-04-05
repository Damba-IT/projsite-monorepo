import { z } from "zod";

export const createUserMembershipSchema = z.object({
  project_id: z.string().optional(),
  level: z.enum(["project", "contractor"]), // "contractor" level should and will be "company"
  level_id: z.string(), // Maps to level
  clerk_user_id: z.string(),
  role_id: z.string(),
  custom_permissions: z.object({}).optional(),
});

export const getUserMembershipQuerySchema = z.object({
  clerk_user_id: z.string(),
  level: z.enum(["project", "contractor"]),
});
