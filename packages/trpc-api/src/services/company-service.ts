import { Db, ObjectId, WithId } from "mongodb";
import { BaseService } from "./base-service";
import { Collections } from "../utils/collections";
import type {
  Company,
  CreateCompany,
  UpdateCompany,
  Project,
} from "@projsite/types";
import { toObjectId } from "../utils/validation";
import { ProjectService } from "./project-service";

export class CompanyService extends BaseService<Company> {
  constructor(db: Db) {
    super(db, Collections.COMPANIES);
  }

  async findAll(): Promise<WithId<Company>[]> {
    return await super.findAll({ is_deleted: false });
  }

  async findById(id: string | ObjectId): Promise<WithId<Company> | null> {
    return await super.findOne({
      _id: toObjectId(id),
      is_deleted: false,
    });
  }

  async create(data: CreateCompany): Promise<WithId<Company> | null> {
    const newCompany: Omit<Company, "_id"> = {
      company_name: data.company_name,
      image_url: data.image_url,
      settings: data.settings,
      active: true,
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    return await super.create(newCompany);
  }

  async update(
    id: string | ObjectId,
    data: UpdateCompany
  ): Promise<WithId<Company> | null> {
    const updateData: Partial<Company> = {
      ...(data.company_name && { company_name: data.company_name }),
      ...(data.image_url && { image_url: data.image_url }),
      ...(data.settings && { settings: data.settings }),
      ...(data.active !== undefined && { active: data.active }),
      ...(data.last_modified_by && { last_modified_by: data.last_modified_by }),
      updated_at: new Date(),
    };

    return await super.update(id, updateData);
  }

  async softDelete(id: string | ObjectId): Promise<WithId<Company> | null> {
    return await super.update(id, {
      is_deleted: true,
      updated_at: new Date(),
    });
  }

  async getProjects(companyId: string | ObjectId): Promise<WithId<Project>[]> {
    const projectService = new ProjectService(this.db);
    const projectsWithCompany = await projectService.findByCompany(companyId);

    // Extract just the projects without the company data
    return projectsWithCompany.map(({ company, ...project }) => project);
  }

  async searchCompanies(query: string): Promise<WithId<Company>[]> {
    const regex = new RegExp(query, "i");
    return await super.findAll({
      company_name: { $regex: regex },
      is_deleted: false,
    });
  }
}
