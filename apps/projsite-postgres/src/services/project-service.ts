import { eq, and, desc, sql } from "drizzle-orm";
import { projects } from "../db/schema";
import type { Database } from "../types";
import type { CreateProject, UpdateProject } from "../routes/projects";

export class ProjectService {
  constructor(private db: Database) {}

  async findAll() {
    return await this.db
      .select()
      .from(projects)
      .where(eq(projects.status, "active"))
      .orderBy(desc(projects.created_at));
  }

  async findById(id: number) {
    const [result] = await this.db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    return result;
  }

  async findByProjectId(projectId: string) {
    const [result] = await this.db
      .select()
      .from(projects)
      .where(eq(projects.project_id, projectId));
    return result;
  }

  async findByOrganization(organizationId: number) {
    return await this.db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.organization_id, organizationId),
          eq(projects.status, "active")
        )
      )
      .orderBy(desc(projects.created_at));
  }

  async create(data: CreateProject) {
    const [result] = await this.db
      .insert(projects)
      .values({
        ...data,
        status: "active",
      })
      .returning();
    return result;
  }

  async update(id: number, data: UpdateProject) {
    const baseUpdate: Partial<typeof projects.$inferInsert> = {};

    if (data.name) baseUpdate.name = data.name;
    if (data.start_date) baseUpdate.start_date = data.start_date;
    if (data.end_date) baseUpdate.end_date = data.end_date;
    if (data.status) baseUpdate.status = data.status;
    if (data.location_address)
      baseUpdate.location_address = data.location_address;
    if (data.location_formatted_address)
      baseUpdate.location_formatted_address = data.location_formatted_address;
    if (data.location_place_id)
      baseUpdate.location_place_id = data.location_place_id;
    if (data.location_lat) baseUpdate.location_lat = data.location_lat;
    if (data.location_lng) baseUpdate.location_lng = data.location_lng;

    if (data.settings) {
      baseUpdate.settings =
        data.settings as typeof projects.$inferInsert.settings;
    }

    if (data.form_validation_rules) {
      baseUpdate.form_validation_rules =
        data.form_validation_rules as typeof projects.$inferInsert.form_validation_rules;
    }

    baseUpdate.last_modified_by = data.last_modified_by;

    const [result] = await this.db
      .update(projects)
      .set(baseUpdate)
      .where(eq(projects.id, id))
      .returning();
    return result;
  }

  async delete(id: number) {
    const [result] = await this.db
      .update(projects)
      .set({ status: "deleted" })
      .where(eq(projects.id, id))
      .returning();
    return result;
  }

  async hardDelete(id: number) {
    const [result] = await this.db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();
    return result;
  }

  async findByDateRange(startDate: Date, endDate: Date) {
    const dateQuery = sql`${projects.start_date} <= ${endDate}::timestamp AND ${projects.end_date} >= ${startDate}::timestamp`;

    return await this.db
      .select()
      .from(projects)
      .where(and(eq(projects.status, "active"), dateQuery))
      .orderBy(desc(projects.start_date));
  }

  async findNearby(lat: number, lng: number, radiusKm: number = 10) {
    const haversineFormula = sql`
      6371 * acos(
        cos(radians(${lat}::float8)) 
        * cos(radians(${projects.location_lat}::float8))
        * cos(radians(${projects.location_lng}::float8) - radians(${lng}::float8))
        + sin(radians(${lat}::float8))
        * sin(radians(${projects.location_lat}::float8))
      )
    `;

    return await this.db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.status, "active"),
          sql`${haversineFormula} <= ${radiusKm}::float8`
        )
      )
      .orderBy(desc(projects.created_at));
  }
}
