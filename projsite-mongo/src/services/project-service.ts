import { Db, ObjectId, WithId } from 'mongodb';
import { BaseService } from './base-service';
import { Collections } from '../utils/collections';
import type { Project, ProjectStatus, Organization, ProjectSettings, FormValidationRules } from '../types';
import type { CreateProjectInput, UpdateProjectInput } from '../schemas/projects';
import { toObjectId } from '../utils/validation';

type ProjectWithOrg = WithId<Project> & { organization: WithId<Organization> | null };

export class ProjectService extends BaseService<Project> {
  constructor(db: Db) {
    super(db, Collections.PROJECTS);
  }

  async findAll(): Promise<ProjectWithOrg[]> {
    const projects = await super.findAll({ status: { $ne: 'deleted' as ProjectStatus } });
    return await this.populateOrganizations(projects);
  }

  async findById(id: string | ObjectId): Promise<ProjectWithOrg | null> {
    const project = await super.findOne({ 
      _id: toObjectId(id),
      status: { $ne: 'deleted' as ProjectStatus }
    });

    if (!project) return null;
    return await this.populateOrganization(project);
  }

  async create(data: CreateProjectInput): Promise<ProjectWithOrg | null> {
    // Validate organization exists
    const organization = await this.db.collection<Organization>(Collections.ORGANIZATIONS).findOne({ 
      _id: data.organization_id,
      is_deleted: false
    });

    if (!organization) return null;

    // Zod has already validated and transformed the data with defaults
    const newProject: Omit<Project, '_id'> = {
      project_id: data.project_id,
      name: data.name,
      organization_id: data.organization_id,
      start_date: data.start_date,
      end_date: data.end_date,
      status: 'active',
      location_address: data.location_address,
      location_formatted_address: data.location_formatted_address,
      location_place_id: data.location_place_id,
      location_lat: data.location_lat,
      location_lng: data.location_lng,
      created_by: data.created_by,
      created_at: new Date(),
      updated_at: new Date(),
      settings: data.settings,
      form_validation_rules: data.form_validation_rules
    };

    const project = await super.create(newProject);
    if (!project) return null;

    return { ...project, organization };
  }

  async update(id: string | ObjectId, data: UpdateProjectInput): Promise<ProjectWithOrg | null> {
    // Validate organization if being updated
    let organization = null;
    if (data.organization_id) {
      organization = await this.db.collection<Organization>(Collections.ORGANIZATIONS).findOne({ 
        _id: data.organization_id,
        is_deleted: false
      });

      if (!organization) return null;
    }

    // Only include fields that are actually present in the update data
    const updateData: Partial<Project> = {
      ...(data.project_id && { project_id: data.project_id }),
      ...(data.name && { name: data.name }),
      ...(data.organization_id && { organization_id: data.organization_id }),
      ...(data.start_date && { start_date: data.start_date }),
      ...(data.end_date && { end_date: data.end_date }),
      ...(data.status && { status: data.status }),
      ...(data.location_address && { location_address: data.location_address }),
      ...(data.location_formatted_address && { location_formatted_address: data.location_formatted_address }),
      ...(data.location_place_id && { location_place_id: data.location_place_id }),
      ...(data.location_lat && { location_lat: data.location_lat }),
      ...(data.location_lng && { location_lng: data.location_lng }),
      ...(data.last_modified_by && { last_modified_by: data.last_modified_by }),
      ...(data.settings && { settings: data.settings }),
      ...(data.form_validation_rules && { form_validation_rules: data.form_validation_rules }),
      updated_at: new Date()
    };

    const project = await super.update(id, updateData);
    if (!project) return null;

    // Get organization details if not already fetched
    if (!organization && project.organization_id) {
      organization = await this.db.collection<Organization>(Collections.ORGANIZATIONS).findOne({ 
        _id: project.organization_id,
        is_deleted: false
      });
    }

    return { ...project, organization };
  }

  async softDelete(id: string | ObjectId): Promise<WithId<Project> | null> {
    return await super.update(id, { 
      status: 'deleted' as ProjectStatus,
      updated_at: new Date()
    });
  }

  async findByOrganization(organizationId: string | ObjectId): Promise<ProjectWithOrg[]> {
    const _id = toObjectId(organizationId);
    
    // First verify organization exists
    const organization = await this.db.collection<Organization>(Collections.ORGANIZATIONS).findOne({ 
      _id,
      is_deleted: false
    });

    if (!organization) return [];

    const projects = await super.findAll({ 
      organization_id: _id,
      status: { $ne: 'deleted' as ProjectStatus }
    });

    return projects.map(project => ({
      ...project,
      organization
    }));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<ProjectWithOrg[]> {
    const projects = await super.findAll({
      start_date: { $lte: endDate },
      end_date: { $gte: startDate },
      status: { $ne: 'deleted' as ProjectStatus }
    });

    return await this.populateOrganizations(projects);
  }

  private async populateOrganization(project: WithId<Project>): Promise<ProjectWithOrg> {
    const organization = await this.db.collection<Organization>(Collections.ORGANIZATIONS).findOne({ 
      _id: project.organization_id,
      is_deleted: false
    });

    return { ...project, organization };
  }

  private async populateOrganizations(projects: WithId<Project>[]): Promise<ProjectWithOrg[]> {
    if (projects.length === 0) return [];

    // Get unique organization IDs
    const orgIds = [...new Set(projects.map(p => p.organization_id))];
    
    // Fetch all organizations in one query
    const organizations = await this.db.collection<Organization>(Collections.ORGANIZATIONS)
      .find({ 
        _id: { $in: orgIds },
        is_deleted: false 
      })
      .toArray();

    const orgMap = new Map(organizations.map(org => [org._id.toString(), org]));

    // Map organizations to projects
    return projects.map(project => ({
      ...project,
      organization: orgMap.get(project.organization_id.toString()) || null
    }));
  }
} 