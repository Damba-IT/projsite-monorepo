import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  name: text('name').unique(),
  active: boolean('active').default(true),
  is_deleted: boolean('is_deleted').default(false),
  logo: text('logo'),
  warehouse_module: boolean('warehouse_module').default(false),
  created_by_user: text('created_by_user'),
  created_by_service: text('created_by_service'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name'),
  organization_id: integer('organization_id').references(() => organizations.id),
  active: boolean('active').default(true),
  is_deleted: boolean('is_deleted').default(false),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique(),
  first_name: text('first_name'),
  last_name: text('last_name'),
  phone_number: text('phone'),
  old_phone_number: text('old_phone'),
  password: text('password'),
  organization_id: integer('organization_id').references(() => organizations.id),
  super_admin: boolean('super_admin').default(false),
  image: text('image'),
});
