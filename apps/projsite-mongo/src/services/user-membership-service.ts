import { Db } from "mongodb";
import { BaseService } from "./base-service";
import { Collections } from "../utils/collections";
import { UserMembership, ProcessedUserMembership } from "@projsite/types";

export class UserMembershipService extends BaseService<UserMembership> {
  constructor(db: Db) {
    super(db, Collections.USER_MEMBERSHIPS);
  }

  async getUserMembership(
    clerk_user_id: string,
    level: "project" | "contractor"
  ): Promise<ProcessedUserMembership | null> {
    const pipeline = [
      {
        $match: {
          clerk_user_id,
          level,
        },
      },
      {
        $addFields: {
          role_id_object: { $toObjectId: "$role_id" },
          level_id_object: { $toObjectId: "$level_id" },
        },
      },
      {
        $lookup: {
          from: Collections.ROLES,
          localField: "role_id_object",
          foreignField: "_id",
          as: "roleDetails",
        },
      },
      {
        $unwind: {
          path: "$roleDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from:
            level === "project" ? Collections.PROJECTS : Collections.COMPANIES,
          localField: "level_id_object",
          foreignField: "_id",
          as: "levelDetails",
        },
      },
      {
        $unwind: {
          path: "$levelDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          clerk_user_id: 1,
          level_id: 1,
          role_id: 1,
          role: "$roleDetails.role",
          default_permissions: "$roleDetails.default_permissions",
          custom_permissions: 1,
          level_name: {
            $cond: {
              if: { $eq: [level, "project"] },
              then: "$levelDetails.project_name",
              else: {
                $cond: {
                  if: { $eq: [level, "contractor"] },
                  then: "$levelDetails.company_name",
                  else: undefined,
                },
              },
            },
          },
        },
      },
      { $limit: 1 },
    ];

    const membership = await this.collection
      .aggregate<ProcessedUserMembership>(pipeline)
      .next();
    if (!membership) return null;

    // Combine default and custom permissions
    const combinedPermissions = {
      ...(membership.default_permissions || {}),
      ...(membership.custom_permissions || {}),
    };

    // Transform permissions into the format expected by CASL(authorization provider)
    const permissions = Object.keys(combinedPermissions).reduce(
      (acc, key) => {
        if (combinedPermissions[key]) {
          const [action, ...subjectParts] = key.split("_");
          const subject = subjectParts.join("_");
          acc.push({ action, subject });
        }
        return acc;
      },
      [] as Array<{ action: string; subject: string }>
    );

    return {
      ...membership,
      permissions,
    };
  }
}
