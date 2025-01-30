ALTER TABLE "organizations" ADD COLUMN "active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "is_deleted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "logo" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "warehouse_module" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "created_by_user" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "created_by_service" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "updated_at" timestamp DEFAULT now();