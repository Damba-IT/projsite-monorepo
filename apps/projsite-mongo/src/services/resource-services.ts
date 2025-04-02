import { Db, ObjectId } from "mongodb";
import { Resource } from "@projsite/types";
import { BaseService } from "./base-service";
import { Collections } from "../utils/collections";

export class ResourceService extends BaseService<Resource> {
  constructor(db: Db) {
    super(db, Collections.RESOURCES);
  }

  /**
   * Find resources by project ID
   * @param projectId The project ID to filter by
   * @returns Promise resolving to an array of resources
   */
  async findByProjectId(projectId: string) {
    return this.findAll({
      project_id: projectId,
      active: { $ne: false },
    });
  }

  /**
   * Find active resources by project ID
   * @param projectId The project ID to filter by
   * @returns Promise resolving to an array of active resources
   */
  async findActiveByProjectId(projectId: string) {
    return this.findAll({
      project_id: projectId,
      active: true,
    });
  }

  /**
   * Find resources assigned to a specific user
   * @param userId The user ID to filter by
   * @returns Promise resolving to an array of resources
   */
  async findByAssignedUser(userId: string) {
    return this.findAll({
      assigned_users: userId,
      status: { $ne: false },
    });
  }

  /**
   * Update resource active status
   * @param id Resource ID
   * @param active New active status
   * @returns Promise resolving to the update result
   */
  async updateActiveStatus(id: string | ObjectId, active: boolean) {
    return this.update(id, {
      active,
      updated_at: new Date(),
    });
  }

  /**
   * Assign users to a resource
   * @param id Resource ID
   * @param userIds Array of user IDs to assign
   * @returns Promise resolving to the update result
   */
  async assignUsers(id: string | ObjectId, userIds: string[]) {
    return this.update(id, {
      assigned_users: userIds,
      updated_at: new Date(),
    });
  }

  async softDelete(id: string | ObjectId) {
    return this.update(id, {
      active: false,
      updated_at: new Date(),
    });
  }
}
