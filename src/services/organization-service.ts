import { eq } from "drizzle-orm";
import { organizations } from "../db/schema";
import type { Database } from "../types";
import type { CreateOrganization, UpdateOrganization } from "../routes/organizations";
import { projects } from "../db/schema";

export class OrganizationService {
  constructor(private db: Database) {}

  async findAll() {
    return await this.db.select().from(organizations);
  }

  async findById(id: number) {
    const [result] = await this.db
      .select()
      .from(organizations)
      .where(eq(organizations.id, id));
    return result;
  }

  async create(data: CreateOrganization) {
    const [result] = await this.db
      .insert(organizations)
      .values(data)
      .returning();
    return result;
  }

  async update(id: number, data: UpdateOrganization) {
    const [result] = await this.db
      .update(organizations)
      .set(data)
      .where(eq(organizations.id, id))
      .returning();
    return result;
  }

  async delete(id: number) {
    const [result] = await this.db
      .delete(organizations)
      .where(eq(organizations.id, id))
      .returning();
    return result;
  }

  async getProjects(organizationId: number) {
    return await this.db
      .select()
      .from(projects)
      .where(eq(projects.organization_id, organizationId));
  }
} 