CREATE TYPE "public"."project_status" AS ENUM('active', 'inactive', 'deleted');--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "active" TO "status";--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "organization_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "settings" jsonb DEFAULT '{"warehouse_module":false}'::jsonb;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "project_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "start_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "end_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "location_address" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "location_formatted_address" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "location_place_id" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "location_lat" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "location_lng" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "created_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "last_modified_by" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "settings" jsonb DEFAULT '{"waste_booking_color":"#456ed5","resource_booking_color":"#aed5ab","information":"","shipment_module":true,"checkpoint_module":false,"warehouse_module":false,"waste_module":false,"inbox_module":false,"auto_approval":false,"waste_auto_approval":true,"sub_projects_enabled":false}'::jsonb;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "form_validation_rules" jsonb DEFAULT '{"shipment_booking":{"contractor":false,"responsible_person":false,"supplier":false,"unloading_zone":false,"prevent_zone_collide":false,"sub_project":false,"resources":false,"env_data":false},"resource_booking":{"contractor":false,"responsible_person":false,"sub_project":false,"resources":false},"waste_booking":{"sub_project":false,"waste":false}}'::jsonb;--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "warehouse_module";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "is_deleted";--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_project_id_unique" UNIQUE("project_id");