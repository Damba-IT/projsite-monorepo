import { Db, ObjectId, WithId } from "mongodb";
import { BaseService } from "./base-service";
import { Collections } from "../utils/collections";
import type {
  Company,
  CreateProject,
  UpdateProject,
  Project,
} from "@projsite/types";
import { toObjectId } from "../utils/validation";

type ProjectWithCompany = WithId<Project> & { company: WithId<Company> | null };

export class ProjectService extends BaseService<Project> {
  constructor(db: Db) {
    super(db, Collections.PROJECTS);
  }

  async findAll(): Promise<ProjectWithCompany[]> {
    const projects = await super.findAll({ status: { $ne: false } });
    return await this.populateCompanies(projects);
  }

  async findById(id: string | ObjectId): Promise<ProjectWithCompany | null> {
    const project = await super.findOne({
      _id: toObjectId(id),
      status: { $ne: false },
    });

    if (!project) return null;
    return await this.populateCompany(project);
  }

  async create(data: CreateProject): Promise<ProjectWithCompany | null> {
    // Validate company exists
    const company = await this.db
      .collection<Company>(Collections.COMPANIES)
      .findOne({
        _id: toObjectId(data.company_id),
        is_deleted: false,
      });

    if (!company) return null;

    // Zod has already validated and transformed the data with defaults
    const newProject: Omit<Project, "_id"> = {
      project_id: data.project_id,
      project_name: data.project_name,
      company_id: data.company_id,
      date_range: data.date_range,
      status: true,
      location: data.location,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: data.created_by,
      settings: data.settings,
    };

    const project = await super.create(newProject);
    if (!project) return null;

    return { ...project, company };
  }

  async update(
    id: string | ObjectId,
    data: UpdateProject
  ): Promise<ProjectWithCompany | null> {
    // Validate company if being updated
    let company = null;
    if (data.company_id) {
      company = await this.db
        .collection<Company>(Collections.COMPANIES)
        .findOne({
          _id: toObjectId(data.company_id),
          is_deleted: false,
        });

      if (!company) return null;
    }

    // Only include fields that are actually present in the update data
    const updateData: Partial<Project> = {
      ...(data.project_id && { project_id: data.project_id }),
      ...(data.project_name && { project_name: data.project_name }),
      ...(data.company_id && { company_id: data.company_id }),
      ...(data.date_range && { date_range: data.date_range }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.location && { location: data.location }),
      ...(data.settings && { settings: data.settings }),
      ...(data.created_by && { created_by: data.created_by }),
      updated_at: new Date(),
    };

    const project = await super.update(id, updateData);
    if (!project) return null;

    // Get company details if not already fetched
    if (!company && project.company_id) {
      company = await this.db
        .collection<Company>(Collections.COMPANIES)
        .findOne({
          _id: toObjectId(project.company_id),
          is_deleted: false,
        });
    }

    return { ...project, company };
  }

  async softDelete(id: string | ObjectId): Promise<WithId<Project> | null> {
    return await super.update(id, {
      status: false,
      updated_at: new Date(),
    });
  }

  async findByCompany(
    companyId: string | ObjectId
  ): Promise<ProjectWithCompany[]> {
    const _id = toObjectId(companyId);

    // First verify company exists
    const company = await this.db
      .collection<Company>(Collections.COMPANIES)
      .findOne({
        _id,
        is_deleted: false,
      });

    if (!company) return [];
    const projects = await super.findAll({
      company_id: _id.toString(),
      status: { $ne: false },
    });

    return projects.map(project => ({
      ...project,
      company,
    }));
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<ProjectWithCompany[]> {
    const projects = await super.findAll({
      date_range: { from: { $lte: endDate }, to: { $gte: startDate } },
      status: { $ne: false },
    });

    return await this.populateCompanies(projects);
  }

  private async populateCompany(
    project: WithId<Project>
  ): Promise<ProjectWithCompany> {
    const company = await this.db
      .collection<Company>(Collections.COMPANIES)
      .findOne({
        _id: toObjectId(project.company_id),
        is_deleted: false,
      });

    return { ...project, company };
  }

  private async populateCompanies(
    projects: WithId<Project>[]
  ): Promise<ProjectWithCompany[]> {
    if (projects.length === 0) return [];

    // Get unique company IDs
    const companyIds = [...new Set(projects.map(p => p.company_id))];

    // Fetch all companies in one query
    const companies = await this.db
      .collection<Company>(Collections.COMPANIES)
      .find({
        _id: { $in: companyIds.map(toObjectId) },
        is_deleted: false,
      })
      .toArray();

    const companyMap = new Map(
      companies.map(company => [company._id.toString(), company])
    );

    // Map company to projects
    return projects.map(project => ({
      ...project,
      company: companyMap.get(project.company_id.toString()) || null,
    }));
  }
}
