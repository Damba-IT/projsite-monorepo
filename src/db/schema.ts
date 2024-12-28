import { pgTable, serial, text, integer, boolean } from 'drizzle-orm/pg-core';

export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  name: text('name').unique(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name'),
  organizationId: integer('organization_id').references(() => organizations.id),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique(),
  first_name: text('first_name'),
  last_name: text('last_name'),
  phone_number: text('phone'),
  old_phone_number: text('old_phone'),
  password: text('password'),
  organizationId: integer('organization_id').references(() => organizations.id),
  super_admin: boolean('super_admin').default(false),
  image: text('image'),
});
