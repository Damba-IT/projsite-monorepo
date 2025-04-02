import { Db } from "mongodb";
import { UnloadingZone } from "@projsite/types";
import { BaseService } from "./base-service";
import { Collections } from "../utils/collections";

export class UnloadingZoneService extends BaseService<UnloadingZone> {
  constructor(db: Db) {
    super(db, Collections.UNLOADING_ZONES);
  }

  /**
   * Find unloading zones by project ID
   * @param projectId The project ID to filter by
   * @returns Promise resolving to an array of unloading zones
   */
  async findByProjectId(projectId: string) {
    return this.collection.find({ project_id: projectId }).toArray();
  }

  /**
   * Find active unloading zones by project ID
   * @param projectId The project ID to filter by
   * @returns Promise resolving to an array of active unloading zones
   */
  async findActiveByProjectId(projectId: string) {
    return this.collection
      .find({
        project_id: projectId,
        active: true,
      })
      .toArray();
  }

  /**
   * Update unloading zone active status
   * @param id Unloading zone ID
   * @param active New active status
   * @returns Promise resolving to the update result
   */
  async updateActiveStatus(id: string, active: boolean) {
    return this.update(id, {
      active,
      updated_at: new Date(),
    });
  }

  /**
   * Update unloading zone name
   * @param id Unloading zone ID
   * @param name New unloading zone name
   * @returns Promise resolving to the update result
   */
  async updateName(id: string, name: string) {
    return this.update(id, {
      unloading_zone_name: name,
      updated_at: new Date(),
    });
  }

  /**
   * Update unloading zone color
   * @param id Unloading zone ID
   * @param color New unloading zone color
   * @returns Promise resolving to the update result
   */
  async updateColor(id: string, color: string) {
    return this.update(id, {
      zone_color: color,
      updated_at: new Date(),
    });
  }

  async softDelete(id: string) {
    return this.update(id, {
      active: false,
      updated_at: new Date(),
    });
  }
}
