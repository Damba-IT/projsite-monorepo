import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { HonoEnv } from '../types';
import {
  createOrganizationSchema,
  updateOrganizationSchema
} from '../schemas/organizations';
import { OrganizationService } from '../services/organization-service';
import { response } from '../utils/response';
import { idParamSchema } from '../utils/validation';

const app = new Hono<HonoEnv>();

app
  .get('/', async (c) => {
    const db = c.get('db');
    const service = new OrganizationService(db);
    const result = await service.findAll();
    return response.success(c, result);
  })
  .post('/', zValidator('json', createOrganizationSchema), async (c) => {
    const db = c.get('db');
    const service = new OrganizationService(db);
    const data = c.req.valid('json');
    const result = await service.create(data);
    if (!result) {
      return response.error(c, 'Failed to create organization', 400);
    }
    return response.success(c, result, 201);
  })
  .get('/:id', zValidator('param', idParamSchema), async (c) => {
    const db = c.get('db');
    const service = new OrganizationService(db);
    const id = c.req.valid('param').id;
    const result = await service.findById(id);
    if (!result) {
      return response.error(c, 'Organization not found', 404);
    }
    return response.success(c, result);
  })
  .put('/:id', zValidator('param', idParamSchema), zValidator('json', updateOrganizationSchema), async (c) => {
    const db = c.get('db');
    const service = new OrganizationService(db);
    const id = c.req.valid('param').id;
    const data = c.req.valid('json');
    const result = await service.update(id, data);
    if (!result) {
      return response.error(c, 'Organization not found', 404);
    }
    return response.success(c, result);
  })
  .delete('/:id', zValidator('param', idParamSchema), async (c) => {
    const db = c.get('db');
    const service = new OrganizationService(db);
    const id = c.req.valid('param').id;
    const result = await service.softDelete(id);
    if (!result) {
      return response.error(c, 'Organization not found', 404);
    }
    return response.success(c, result);
  })
  .get('/:id/projects', zValidator('param', idParamSchema), async (c) => {
    const db = c.get('db');
    const service = new OrganizationService(db);
    const id = c.req.valid('param').id;

    const organization = await service.findById(id);
    if (!organization) {
      return response.error(c, 'Organization not found', 404);
    }

    const projects = await service.getProjects(id);
    return response.success(c, projects);
  });

export default app; 