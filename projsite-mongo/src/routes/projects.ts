import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { HonoEnv } from '../types';
import {
  createProjectSchema,
  updateProjectSchema,
  type CreateProjectInput,
  type UpdateProjectInput
} from '../schemas/projects';
import { ProjectService } from "../services/project-service";
import { idParamSchema } from '../utils/validation';

const app = new Hono<HonoEnv>();

app
  .get("/", async (c) => {
    const db = c.get('db');
    const service = new ProjectService(db);
    const result = await service.findAll();
    return c.json({ success: true, data: result });
  })
  .post("/", zValidator('json', createProjectSchema), async (c) => {
    const db = c.get('db');
    const service = new ProjectService(db);
    const data = c.req.valid('json');
    const result = await service.create(data);
    if (!result) {
      return c.json({ success: false, error: "Failed to create project" }, 400);
    }
    return c.json({ success: true, data: result }, 201);
  })
  .get("/:id", zValidator('param', idParamSchema), async (c) => {
    const db = c.get('db');
    const service = new ProjectService(db);
    const id = c.req.valid('param').id;
    const result = await service.findById(id);
    if (!result) {
      return c.json({ success: false, error: "Project not found" }, 404);
    }
    return c.json({ success: true, data: result });
  })
  .put("/:id", zValidator('param', idParamSchema), zValidator('json', updateProjectSchema), async (c) => {
    const db = c.get('db');
    const service = new ProjectService(db);
    const id = c.req.valid('param').id;
    const data = c.req.valid('json');
    const result = await service.update(id, data);
    if (!result) {
      return c.json({ success: false, error: "Project not found" }, 404);
    }
    return c.json({ success: true, data: result });
  })
  .delete("/:id", zValidator('param', idParamSchema), async (c) => {
    const db = c.get('db');
    const service = new ProjectService(db);
    const id = c.req.valid('param').id;
    const result = await service.softDelete(id);
    if (!result) {
      return c.json({ success: false, error: "Project not found" }, 404);
    }
    return c.json({ success: true, data: result });
  });

export default app; 