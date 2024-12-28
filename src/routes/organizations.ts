import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { HonoEnv } from "../types";
import { OrganizationService } from "../services/organization-service";

const app = new Hono<HonoEnv>();

const createOrgSchema = z.object({
  name: z.string().min(1),
});

app
  .get("/", async (c) => {
    const db = c.get('db');
    const service = new OrganizationService(db);
    const result = await service.findAll();
    return c.json(result);
  })
  .post("/", zValidator('json', createOrgSchema), async (c) => {
    const db = c.get('db');
    const service = new OrganizationService(db);
    const { name } = await c.req.json();
    const result = await service.create(name);
    return c.json(result, 201);
  })
  .get("/:id", async (c) => {
    const db = c.get('db');
    const service = new OrganizationService(db);
    const id = Number(c.req.param('id'));
    const result = await service.findById(id);
    if (!result) {
      return c.json({ message: "Organization not found" }, 404);
    }
    return c.json(result);
  });

export default app; 