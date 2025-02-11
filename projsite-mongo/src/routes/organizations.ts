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

const app = new Hono<HonoEnv>();

app
  .get('/', async (c) => {
    const db = c.get('db');
    const service = new OrganizationService(db);
    const result = await service.findAll();
    return c.json({ success: true, data: result });
  })
  .get('/search', zValidator('query', searchOrganizationSchema), async (c) => {
    const db = c.get('db');
    const service = new OrganizationService(db);
    const { query } = c.req.valid('query');

    try {
      const results = await service.searchCompanies(query);
      return c.json({ success: true, data: results });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })
  .post('/', zValidator('json', createOrganizationSchema), async (c) => {
    const db = c.get('db');
    const service = new OrganizationService(db);
    const data = c.req.valid('json');
    const result = await service.create(data);
    if (!result) {
      return c.json({ success: false, error: 'Failed to create organization' }, 400);
    }
    return c.json({ success: true, data: result }, 201);
  })
  .get('/:id', zValidator('param', idParamSchema), async (c) => {
    const db = c.get('db');
    const service = new OrganizationService(db);
    const id = c.req.valid('param').id;
    const result = await service.findById(id);
    if (!result) {
      return c.json({ success: false, error: 'Organization not found' }, 404);
    }
    return c.json({ success: true, data: result });
  })
  .put('/:id', zValidator('param', idParamSchema), zValidator('json', updateOrganizationSchema), async (c) => {
    const db = c.get('db');
    const service = new OrganizationService(db);
    const id = c.req.valid('param').id;
    const data = c.req.valid('json');
    const result = await service.update(id, data);
    if (!result) {
      return c.json({ success: false, error: 'Organization not found' }, 404);
    }
    return c.json({ success: true, data: result });
  })
  .delete('/:id', zValidator('param', idParamSchema), async (c) => {
    const db = c.get('db');
    const service = new OrganizationService(db);
    const id = c.req.valid('param').id;
    const result = await service.softDelete(id);
    if (!result) {
      return c.json({ success: false, error: 'Organization not found' }, 404);
    }
    return c.json({ success: true, data: result });
  })
  .get('/:id/projects', zValidator('param', idParamSchema), async (c) => {
    const db = c.get('db');
    const service = new OrganizationService(db);
    const id = c.req.valid('param').id;

    const organization = await service.findById(id);
    if (!organization) {
      return c.json({ success: false, error: 'Organization not found' }, 404);
    }

    const projects = await service.getProjects(id);
    return c.json({ success: true, data: projects });
  });

export default app; 