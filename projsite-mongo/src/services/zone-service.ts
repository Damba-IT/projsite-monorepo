import { Db } from "mongodb";
import { Zone } from "../types";
import { BaseService } from "./base-service";

const ZONES_COLLECTION = "unloading_zones";

export class ZoneService extends BaseService<Zone> {
  constructor(db: Db) {
    super(db, ZONES_COLLECTION);
  }

  /**
   * Find zones by project ID
   * @param projectId The project ID to filter by
   * @returns Promise resolving to an array of zones
   */
  async findByProjectId(projectId: string) {
    return this.collection.find({ project_id: projectId }).toArray();
  }

  /**
   * Find active zones by project ID
   * @param projectId The project ID to filter by
   * @returns Promise resolving to an array of active zones
   */
  async findActiveByProjectId(projectId: string) {
    return this.collection.find({ 
      project_id: projectId,
      active: true 
    }).toArray();
  }

  /**
   * Update zone active status
   * @param id Zone ID
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
   * Update zone name
   * @param id Zone ID
   * @param name New zone name
   * @returns Promise resolving to the update result
   */
  async updateName(id: string, name: string) {
    return this.update(id, { 
      unloading_zone_name: name,
      updated_at: new Date() 
    });
  }

  /**
   * Update zone color
   * @param id Zone ID
   * @param color New zone color
   * @returns Promise resolving to the update result
   */
  async updateColor(id: string, color: string) {
    return this.update(id, { 
      zone_color: color,
      updated_at: new Date() 
    });
  }
} 