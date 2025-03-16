import { Db } from "mongodb";
import { SubProject } from "../types";
import { BaseService } from "./base-service";

const SUB_PROJECTS_COLLECTION = "sub_projects";

export class SubProjectService extends BaseService<SubProject> {
  constructor(db: Db) {
    super(db, SUB_PROJECTS_COLLECTION);
  }

  /**
   * Find sub-projects by project ID
   * @param projectId The project ID to filter by
   * @returns Promise resolving to an array of sub-projects
   */
  async findByProjectId(projectId: string) {
    return this.collection.find({ project_id: projectId }).toArray();
  }

  /**
   * Find active sub-projects by project ID
   * @param projectId The project ID to filter by
   * @returns Promise resolving to an array of active sub-projects
   */
  async findActiveByProjectId(projectId: string) {
    return this.collection.find({ 
      project_id: projectId,
      active: true 
    }).toArray();
  }

  /**
   * Update sub-project active status
   * @param id Sub-project ID
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
   * Update sub-project name
   * @param id Sub-project ID
   * @param name New sub-project name
   * @returns Promise resolving to the update result
   */
  async updateName(id: string, name: string) {
    return this.update(id, { 
      sub_project_name: name,
      updated_at: new Date() 
    });
  }
} 