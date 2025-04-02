import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const projectStatusEnum = pgEnum("project_status", [
  "active",
  "inactive",
  "deleted",
]);

export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").unique(),
  active: boolean("active").default(true),
  is_deleted: boolean("is_deleted").default(false),
  logo: text("logo"),
  settings: jsonb("settings")
    .$type<{
      // TODO:: move to separate table or keep as JSONB in organizations table?
      warehouse_module: boolean;
    }>()
    .default({
      warehouse_module: false,
    }),
  created_by_user: text("created_by_user"),
  created_by_service: text("created_by_service"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),
    project_id: text("project_id").unique().notNull(),
    name: text("name").notNull(),
    organization_id: integer("organization_id")
      .notNull()
      .references(() => organizations.id),
    start_date: timestamp("start_date").notNull(),
    end_date: timestamp("end_date").notNull(),
    status: projectStatusEnum("status").default("active"),
    location_address: text("location_address"),
    location_formatted_address: text("location_formatted_address"),
    location_place_id: text("location_place_id"),
    location_lat: text("location_lat"),
    location_lng: text("location_lng"),
    created_by: text("created_by").notNull(),
    last_modified_by: text("last_modified_by"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
    settings: jsonb("settings")
      .$type<{
        // TODO:: move to separate table or keep as JSONB in projects table?
        waste_booking_color: string;
        resource_booking_color: string;
        information: string;
        shipment_module: boolean;
        checkpoint_module: boolean;
        warehouse_module: boolean;
        waste_module: boolean;
        inbox_module: boolean;
        auto_approval: boolean;
        waste_auto_approval: boolean;
        sub_projects_enabled: boolean;
      }>()
      .default({
        waste_booking_color: "#456ed5",
        resource_booking_color: "#aed5ab",
        information: "",
        shipment_module: true,
        checkpoint_module: false,
        warehouse_module: false,
        waste_module: false,
        inbox_module: false,
        auto_approval: false,
        waste_auto_approval: true,
        sub_projects_enabled: false,
      }),

    form_validation_rules: jsonb("form_validation_rules")
      .$type<{
        shipment_booking: {
          contractor: boolean;
          responsible_person: boolean;
          supplier: boolean;
          unloading_zone: boolean;
          prevent_zone_collide: boolean;
          sub_project: boolean;
          resources: boolean;
          env_data: boolean;
        };
        resource_booking: {
          contractor: boolean;
          responsible_person: boolean;
          sub_project: boolean;
          resources: boolean;
        };
        waste_booking: {
          sub_project: boolean;
          waste: boolean;
        };
      }>()
      .default({
        shipment_booking: {
          contractor: false,
          responsible_person: false,
          supplier: false,
          unloading_zone: false,
          prevent_zone_collide: false,
          sub_project: false,
          resources: false,
          env_data: false,
        },
        resource_booking: {
          contractor: false,
          responsible_person: false,
          sub_project: false,
          resources: false,
        },
        waste_booking: {
          sub_project: false,
          waste: false,
        },
      }),
  },
  table => ({
    projectIdIdx: sql`CREATE INDEX project_id_idx ON ${table} (project_id)`,
    orgIdIdx: sql`CREATE INDEX org_id_idx ON ${table} (organization_id)`,
    dateRangeIdx: sql`CREATE INDEX date_range_idx ON ${table} (start_date, end_date)`,
    locationIdx: sql`CREATE INDEX location_idx ON ${table} (location_lat, location_lng)`,
    statusIdx: sql`CREATE INDEX status_idx ON ${table} (status)`,

    dateCheck: sql`CHECK (${table.end_date} > ${table.start_date})`,
  })
);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  first_name: text("first_name"),
  last_name: text("last_name"),
  phone_number: text("phone"),
  old_phone_number: text("old_phone"),
  password: text("password"),
  organization_id: integer("organization_id").references(
    () => organizations.id
  ),
  super_admin: boolean("super_admin").default(false),
  image: text("image"),
});
