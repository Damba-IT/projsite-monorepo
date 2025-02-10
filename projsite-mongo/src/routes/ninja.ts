import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { HonoEnv } from '../types';
import {
  createNinjaOrderSchema,
  updateNinjaOrderSchema,
} from 'projsite-types/schemas';
import { NinjaOrderService } from "../services/ninja-order-service";
import { response } from '../utils/response';
import { idParamSchema } from '../utils/validation';

const app = new Hono<HonoEnv>();

app
  .get("/orders", async (c) => {
    const db = c.get('db');
    const service = new NinjaOrderService(db);
    const result = await service.findAll();
    return response.success(c, result);
  })
  .post("/orders", zValidator('json', createNinjaOrderSchema), async (c) => {
    const db = c.get('db');
    const service = new NinjaOrderService(db);
    const data = c.req.valid('json');
    const result = await service.create(data);
    if (!result) {
      return response.error(c, "Failed to create order", 400);
    }
    return response.success(c, result, 201);
  })
  .get("/orders/:id", zValidator('param', idParamSchema), async (c) => {
    const db = c.get('db');
    const service = new NinjaOrderService(db);
    const id = c.req.valid('param').id;
    const result = await service.findById(id);
    if (!result) {
      return response.error(c, "Order not found", 404);
    }
    return response.success(c, result);
  })
  .put("/orders/:id", zValidator('param', idParamSchema), zValidator('json', updateNinjaOrderSchema), async (c) => {
    const db = c.get('db');
    const service = new NinjaOrderService(db);
    const id = c.req.valid('param').id;
    const data = c.req.valid('json');
    const result = await service.update(id, data);
    if (!result) {
      return response.error(c, "Order not found", 404);
    }
    return response.success(c, result);
  })
  .delete("/orders/:id", zValidator('param', idParamSchema), async (c) => {
    const db = c.get('db');
    const service = new NinjaOrderService(db);
    const id = c.req.valid('param').id;
    const result = await service.softDelete(id);
    if (!result) {
      return response.error(c, "Order not found", 404);
    }
    return response.success(c, result);
  });

export default app;
