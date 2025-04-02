import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { HonoEnv } from "../types";
import { OrganizationService } from "../services/organization-service";
import { response } from "../utils/response";

const app = new Hono<HonoEnv>();

const createOrgSchema = z.object({
  name: z.string().min(1),
  active: z.boolean().default(true),
  is_deleted: z.boolean().default(false),
  logo: z.string().optional(),
  warehouse_module: z.boolean().default(false),
  created_by_user: z.string().optional(),
  created_by_service: z.string().optional(),
  created_at: z.date().default(new Date()),
  updated_at: z.date().default(new Date()),
});

const updateOrgSchema = z.object({
  name: z.string().min(1).optional(),
  active: z.boolean().optional(),
  is_deleted: z.boolean().optional(),
  logo: z.string().optional(),
  warehouse_module: z.boolean().optional(),
});

const idParam = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateOrganization = z.infer<typeof createOrgSchema>;
export type UpdateOrganization = z.infer<typeof updateOrgSchema>;

app
  .get("/", async c => {
    const db = c.get("db");
    const service = new OrganizationService(db);
    const result = await service.findAll();
    return response.success(c, result);
  })
  .post("/", zValidator("json", createOrgSchema), async c => {
    const db = c.get("db");
    const service = new OrganizationService(db);
    const body = c.req.valid("json");
    const result = await service.create(body);
    return response.success(c, result, 201);
  })
  .get("/:id", zValidator("param", idParam), async c => {
    const db = c.get("db");
    const service = new OrganizationService(db);
    const { id } = c.req.valid("param");

    const result = await service.findById(id);
    if (!result) {
      return response.error(c, "Organization not found", 404);
    }
    return response.success(c, result);
  })
  .patch(
    "/:id",
    zValidator("param", idParam),
    zValidator("json", updateOrgSchema),
    async c => {
      const db = c.get("db");
      const service = new OrganizationService(db);
      const { id } = c.req.valid("param");
      const body = c.req.valid("json");

      const result = await service.update(id, body);
      if (!result) {
        return response.error(c, "Organization not found", 404);
      }
      return response.success(c, result);
    }
  )
  .delete("/:id", zValidator("param", idParam), async c => {
    const db = c.get("db");
    const service = new OrganizationService(db);
    const { id } = c.req.valid("param");

    const result = await service.delete(id);
    if (!result) {
      return response.error(c, "Organization not found", 404);
    }
    return response.success(c, {
      message: "Organization deleted successfully",
    });
  })
  .get("/:id/projects", zValidator("param", idParam), async c => {
    const db = c.get("db");
    const service = new OrganizationService(db);
    const { id } = c.req.valid("param");

    const projects = await service.getProjects(id);
    return response.success(c, projects);
  });

export default app;
