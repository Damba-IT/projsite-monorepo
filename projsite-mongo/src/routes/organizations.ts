import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { HonoEnv } from '../types';
import {
  createOrganizationSchema,
  updateOrganizationSchema,
  searchOrganizationSchema
} from '../schemas/organizations';
import { OrganizationService } from '../services/organization-service';
import { idParamSchema } from '../utils/validation';
import { validationErrorHandler } from '../middleware/error-handler';
import { HTTPException } from 'hono/http-exception';

const app = new Hono<HonoEnv>();

app
  .get('/', async (c) => {
    const db = c.get('db');
    const service = new OrganizationService(db);
    const result = await service.findAll();
    return c.json({ success: true, data: result });
  })
  .get('/search', 
    zValidator('query', searchOrganizationSchema, validationErrorHandler), 
    async (c) => {
      const db = c.get('db');
      const service = new OrganizationService(db);
      const { query } = c.req.valid('query');
      const results = await service.searchCompanies(query);
      return c.json({ success: true, data: results });
    }
  )
  .post('/', 
    zValidator('json', createOrganizationSchema, validationErrorHandler), 
    async (c) => {
      const db = c.get('db');
      const service = new OrganizationService(db);
      const data = c.req.valid('json');
      const result = await service.create(data);
      if (!result) {
        throw new HTTPException(400, { message: "Failed to create organization" });
      }
      return c.json({ success: true, data: result }, 201);
    }
  )
  .get('/:id', 
    zValidator('param', idParamSchema, validationErrorHandler), 
    async (c) => {
      const db = c.get('db');
      const service = new OrganizationService(db);
      const id = c.req.valid('param').id;
      const result = await service.findById(id);
      if (!result) {
        throw new HTTPException(404, { message: "Organization not found" });
      }
      return c.json({ success: true, data: result });
    }
  )
  .put('/:id', 
    zValidator('param', idParamSchema, validationErrorHandler),
    zValidator('json', updateOrganizationSchema, validationErrorHandler), 
    async (c) => {
      const db = c.get('db');
      const service = new OrganizationService(db);
      const id = c.req.valid('param').id;
      const data = c.req.valid('json');
      const result = await service.update(id, data);
      if (!result) {
        throw new HTTPException(404, { message: "Organization not found" });
      }
      return c.json({ success: true, data: result });
    }
  )
  .delete('/:id', 
    zValidator('param', idParamSchema, validationErrorHandler), 
    async (c) => {
      const db = c.get('db');
      const service = new OrganizationService(db);
      const id = c.req.valid('param').id;
      const result = await service.softDelete(id);
      if (!result) {
        throw new HTTPException(404, { message: "Organization not found" });
      }
      return c.json({ success: true, data: result });
    }
  )
  .get('/:id/projects', 
    zValidator('param', idParamSchema, validationErrorHandler), 
    async (c) => {
      const db = c.get('db');
      const service = new OrganizationService(db);
      const id = c.req.valid('param').id;

      const organization = await service.findById(id);
      if (!organization) {
        throw new HTTPException(404, { message: "Organization not found" });
      }

      const projects = await service.getProjects(id);
      return c.json({ success: true, data: projects });
    }
  );

export default app; 