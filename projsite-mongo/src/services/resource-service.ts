import { Db, Filter } from "mongodb";
import { Resource } from "../types";
import { BaseService } from "./base-service";

const RESOURCES_COLLECTION = "resources";

export class ResourceService extends BaseService<Resource> {
  constructor(db: Db) {
    super(db, RESOURCES_COLLECTION);
  }

  /**
   * Find resources by project ID
   * @param projectId The project ID to filter by
   * @returns Promise resolving to an array of resources
   */
  async findByProjectId(projectId: string) {
    return this.collection.find({ project_id: projectId }).toArray();
  }

  /**
   * Find active resources by project ID
   * @param projectId The project ID to filter by
   * @returns Promise resolving to an array of active resources
   */
  async findActiveByProjectId(projectId: string) {
    return this.collection.find({ 
      project_id: projectId,
      active: true 
    }).toArray();
  }

  /**
   * Find resources assigned to a specific user
   * @param userId The user ID to filter by
   * @returns Promise resolving to an array of resources
   */
  async findByAssignedUser(userId: string) {
    return this.collection.find({ 
      assigned_users: userId 
    }).toArray();
  }

  /**
   * Update resource active status
   * @param id Resource ID
   * @param active New active status
   * @returns Promise resolving to the update result
   */
  async updateActiveStatus(id: string, active: boolean) {
    return this.update(id, { 
      active, 
      updated_at: new Date() 
    });
  }

  /**
   * Assign users to a resource
   * @param id Resource ID
   * @param userIds Array of user IDs to assign
   * @returns Promise resolving to the update result
   */
  async assignUsers(id: string, userIds: string[]) {
    return this.update(id, { 
      assigned_users: userIds,
      updated_at: new Date() 
    });
  }
} 