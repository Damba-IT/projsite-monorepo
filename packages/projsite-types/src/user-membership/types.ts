import {
  createUserMembershipSchema,
  getUserMembershipQuerySchema,
} from "./schema";
import { z } from "zod";
import { BaseEntity } from "../common/types";
import { WithId } from "mongodb";

export interface UserMembership extends BaseEntity {
  project_id?: string;
  level: "project" | "contractor"; // "contractor" level should and will be "company"
  level_id: string; // Maps to level
  clerk_user_id: string;
  role_id: string;
  custom_permissions?: Record<string, string>;
}

export interface ProcessedUserMembership
  extends WithId<{
    clerk_user_id: string;
    level_id: string;
    level_name: string;
    role: string;
    role_id: string;
    default_permissions: Record<string, boolean>;
    custom_permissions: Record<string, boolean>;
    permissions: Array<{ action: string; subject: string }>;
  }> {}

export type CreateUserMembership = z.infer<typeof createUserMembershipSchema>;
export type GetUserMembershipQuery = z.infer<
  typeof getUserMembershipQuerySchema
>;
