import { Db, ObjectId } from 'mongodb';
import { BaseService } from './base-service';
import { Collections } from '../utils/collections';
import type { Organization } from '../types';
import type { CreateOrganizationInput, UpdateOrganizationInput } from '../schemas/organizations';

export class OrganizationService extends BaseService<Organization> {
  constructor(db: Db) {
    super(db, Collections.ORGANIZATIONS);
  }

  async findAll() {
    return await super.findAll({ is_deleted: false });
  }

  async findById(id: string | ObjectId) {
    return await super.findOne({ 
      _id: typeof id === 'string' ? new ObjectId(id) : id,
    });
  }

  async create(data: CreateOrganizationInput) {
    const newOrg = {
      ...data,
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date()
    };

    return await super.create(newOrg);
  }

  async update(id: string | ObjectId, data: UpdateOrganizationInput) {
    const updateData = {
      ...data,
      updated_at: new Date()
    };

    return await super.update(id, updateData);
  }

  async softDelete(id: string | ObjectId) {
    return await super.update(id, { 
      is_deleted: true,
      updated_at: new Date()
    });
  }

  async getProjects(id: string | ObjectId) {
    const projects = await this.db.collection(Collections.PROJECTS)
      .find({ 
        organization_id: typeof id === 'string' ? new ObjectId(id) : id,
        status: { $ne: 'deleted' }
      })
      .toArray();

    return projects;
  }

  async searchCompanies(query: string) {
    if (!query || query.trim() === '') {
      throw new Error('Invalid or missing company name');
    }

    const pipeline = [
      {
        $search: {
          index: 'companyAutoSuggestion',
          autocomplete: {
            query: query,
            path: 'company_name',
            tokenOrder: 'sequential',
            fuzzy: {
              maxEdits: 1,
              maxExpansions: 10,
            }
          },
        },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          company_name: 1,
          is_organization: 1,
          active: 1
        },
      },
    ];

    try {
      const companies = await this.collection.aggregate(pipeline).toArray();
      
      if (companies.length === 0) {
        return {
          noMatch: true,
          message: 'No matching document found',
          data: [],
        };
      }

      return {
        data: companies,
      };
    } catch (error: any) {
      console.error('Error occurred while fetching companies:', error);
      throw new Error(error.message);
    }
  }
} 