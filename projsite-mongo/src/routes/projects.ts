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
import { response } from '../utils/response';
import { idParamSchema } from '../utils/validation';

const app = new Hono<HonoEnv>();

app
  .get("/", async (c) => {
    const db = c.get('db');
    const service = new ProjectService(db);
    const result = await service.findAll();
    return response.success(c, result);
  })
  .post("/", zValidator('json', createProjectSchema), async (c) => {
    const db = c.get('db');
    const service = new ProjectService(db);
    const data = c.req.valid('json');
    const result = await service.create(data);
    if (!result) {
      return response.error(c, "Failed to create project", 400);
    }
    return response.success(c, result, 201);
  })
  .get("/:id", zValidator('param', idParamSchema), async (c) => {
    const db = c.get('db');
    const service = new ProjectService(db);
    const id = c.req.valid('param').id;
    const result = await service.findById(id);
    if (!result) {
      return response.error(c, "Project not found", 404);
    }
    return response.success(c, result);
  })
  .put("/:id", zValidator('param', idParamSchema), zValidator('json', updateProjectSchema), async (c) => {
    const db = c.get('db');
    const service = new ProjectService(db);
    const id = c.req.valid('param').id;
    const data = c.req.valid('json');
    const result = await service.update(id, data);
    if (!result) {
      return response.error(c, "Project not found", 404);
    }
    return response.success(c, result);
  })
  .delete("/:id", zValidator('param', idParamSchema), async (c) => {
    const db = c.get('db');
    const service = new ProjectService(db);
    const id = c.req.valid('param').id;
    const result = await service.softDelete(id);
    if (!result) {
      return response.error(c, "Project not found", 404);
    }
    return response.success(c, result);
  });

export default app; 