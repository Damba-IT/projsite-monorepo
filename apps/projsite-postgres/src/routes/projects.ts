import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { HonoEnv } from "../types";
import { ProjectService } from "../services/project-service";
import { response } from "../utils/response";

const app = new Hono<HonoEnv>();

const createProjectSchema = z.object({
  project_id: z.string(),
  name: z.string().min(1),
  organization_id: z.number().int().positive(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  location_address: z.string().optional(),
  location_formatted_address: z.string().optional(),
  location_place_id: z.string().optional(),
  location_lat: z.string().optional(),
  location_lng: z.string().optional(),
  created_by: z.string(),
  settings: z
    .object({
      waste_booking_color: z.string(),
      resource_booking_color: z.string(),
      information: z.string(),
      shipment_module: z.boolean(),
      checkpoint_module: z.boolean(),
      warehouse_module: z.boolean(),
      waste_module: z.boolean(),
      inbox_module: z.boolean(),
      auto_approval: z.boolean(),
      waste_auto_approval: z.boolean(),
      sub_projects_enabled: z.boolean(),
    })
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
  form_validation_rules: z
    .object({
      shipment_booking: z.object({
        contractor: z.boolean(),
        responsible_person: z.boolean(),
        supplier: z.boolean(),
        unloading_zone: z.boolean(),
        prevent_zone_collide: z.boolean(),
        sub_project: z.boolean(),
        resources: z.boolean(),
        env_data: z.boolean(),
      }),
      resource_booking: z.object({
        contractor: z.boolean(),
        responsible_person: z.boolean(),
        sub_project: z.boolean(),
        resources: z.boolean(),
      }),
      waste_booking: z.object({
        sub_project: z.boolean(),
        waste: z.boolean(),
      }),
    })
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
});

const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  status: z.enum(["active", "inactive", "deleted"]).optional(),
  location_address: z.string().optional(),
  location_formatted_address: z.string().optional(),
  location_place_id: z.string().optional(),
  location_lat: z.string().optional(),
  location_lng: z.string().optional(),
  last_modified_by: z.string(),
  settings: z
    .object({
      waste_booking_color: z.string(),
      resource_booking_color: z.string(),
      information: z.string(),
      shipment_module: z.boolean(),
      checkpoint_module: z.boolean(),
      warehouse_module: z.boolean(),
      waste_module: z.boolean(),
      inbox_module: z.boolean(),
      auto_approval: z.boolean(),
      waste_auto_approval: z.boolean(),
      sub_projects_enabled: z.boolean(),
    })
    .strict()
    .partial()
    .optional(),
  form_validation_rules: z
    .object({
      shipment_booking: z
        .object({
          contractor: z.boolean(),
          responsible_person: z.boolean(),
          supplier: z.boolean(),
          unloading_zone: z.boolean(),
          prevent_zone_collide: z.boolean(),
          sub_project: z.boolean(),
          resources: z.boolean(),
          env_data: z.boolean(),
        })
        .partial(),
      resource_booking: z
        .object({
          contractor: z.boolean(),
          responsible_person: z.boolean(),
          sub_project: z.boolean(),
          resources: z.boolean(),
        })
        .partial(),
      waste_booking: z
        .object({
          sub_project: z.boolean(),
          waste: z.boolean(),
        })
        .partial(),
    })
    .optional(),
});

const idParam = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateProject = z.infer<typeof createProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;

app
  .get("/", async c => {
    const db = c.get("db");
    const service = new ProjectService(db);
    const result = await service.findAll();
    return response.success(c, result);
  })
  .post("/", zValidator("json", createProjectSchema), async c => {
    const db = c.get("db");
    const service = new ProjectService(db);
    const body = c.req.valid("json");
    const result = await service.create(body);
    return response.success(c, result, 201);
  })
  .get("/:id", zValidator("param", idParam), async c => {
    const db = c.get("db");
    const service = new ProjectService(db);
    const { id } = c.req.valid("param");

    const result = await service.findById(id);
    if (!result) {
      return response.error(c, "Project not found", 404);
    }
    return response.success(c, result);
  })
  .patch(
    "/:id",
    zValidator("param", idParam),
    zValidator("json", updateProjectSchema),
    async c => {
      const db = c.get("db");
      const service = new ProjectService(db);
      const { id } = c.req.valid("param");
      const body = c.req.valid("json");

      const result = await service.update(id, body);
      if (!result) {
        return response.error(c, "Project not found", 404);
      }
      return response.success(c, result);
    }
  )
  .delete("/:id", zValidator("param", idParam), async c => {
    const db = c.get("db");
    const service = new ProjectService(db);
    const { id } = c.req.valid("param");

    const result = await service.delete(id);
    if (!result) {
      return response.error(c, "Project not found", 404);
    }
    return response.success(c, { message: "Project deleted successfully" });
  })
  .get(
    "/organization/:id",
    zValidator(
      "param",
      z.object({
        id: z.coerce.number().int().positive(),
      })
    ),
    async c => {
      const db = c.get("db");
      const service = new ProjectService(db);
      const { id } = c.req.valid("param");

      const result = await service.findByOrganization(id);
      return response.success(c, result);
    }
  );

export default app;
