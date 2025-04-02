import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { HonoEnv } from '../types';
import {
  createProjectSchema,
  updateProjectSchema,
} from '@projsite/types';
import { ProjectService } from "../services/project-service";
import { idParamSchema } from '../utils/validation';
import { validationErrorHandler } from '../middleware/error-handler';
import { HTTPException } from 'hono/http-exception';

const projectRouter = new Hono<HonoEnv>();

projectRouter
  .get("/", async (c) => {
    const db = c.get('db');
    const service = new ProjectService(db);
    const result = await service.findAll();
    return c.json({ success: true, data: result });
  })
  .post("/", 
    zValidator('json', createProjectSchema, validationErrorHandler), 
    async (c) => {
      const db = c.get('db');
      const service = new ProjectService(db);
      const data = c.req.valid('json');
      const result = await service.create(data);
      if (!result) {
        throw new HTTPException(400, { message: "Failed to create project" });
      }
      return c.json({ success: true, data: result }, 201);
    }
  )
  .get("/:id", 
    zValidator('param', idParamSchema, validationErrorHandler), 
    async (c) => {
      const db = c.get('db');
      const service = new ProjectService(db);
      const id = c.req.valid('param').id;
      const result = await service.findById(id);
      if (!result) {
        throw new HTTPException(404, { message: "Project not found" });
      }
      return c.json({ success: true, data: result });
    }
  )
  .put("/:id", 
    zValidator('param', idParamSchema, validationErrorHandler),
    zValidator('json', updateProjectSchema, validationErrorHandler), 
    async (c) => {
      const db = c.get('db');
      const service = new ProjectService(db);
      const id = c.req.valid('param').id;
      const data = c.req.valid('json');
      const result = await service.update(id, data);
      if (!result) {
        throw new HTTPException(404, { message: "Project not found" });
      }
      return c.json({ success: true, data: result });
    }
  )
  .delete("/:id", 
    zValidator('param', idParamSchema, validationErrorHandler), 
    async (c) => {
      const db = c.get('db');
      const service = new ProjectService(db);
      const id = c.req.valid('param').id;
      const result = await service.softDelete(id);
      if (!result) {
        throw new HTTPException(404, { message: "Project not found" });
      }
      return c.json({ success: true, data: result });
    }
  );

export default projectRouter; 