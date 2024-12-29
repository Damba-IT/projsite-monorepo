import { eq } from "drizzle-orm";
import { organizations } from "../db/schema";
import type { Database } from "../types";
import type { CreateOrganization } from "../routes/organizations";

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

  async update(id: number, name: string) {
    const [result] = await this.db
      .update(organizations)
      .set({ name })
      .where(eq(organizations.id, id))
      .returning();
    return result;
  }

  async delete(id: number) {
    return await this.db
      .delete(organizations)
      .where(eq(organizations.id, id))
      .returning();
  }
} 