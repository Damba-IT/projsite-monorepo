import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { HonoEnv } from '../types';
import {
  createNinjaOrderSchema,
  updateNinjaOrderSchema,
} from 'projsite-types/schemas';
import { NinjaOrderService } from "../services/ninja-order-service";
import { idParamSchema } from '../utils/validation';
import { HTTPException } from 'hono/http-exception';

const app = new Hono<HonoEnv>();

app
  .get("/orders", async (c) => {
    const db = c.get('db');
    const service = new NinjaOrderService(db);
    const result = await service.findAll();
    return c.json({ success: true, data: result });
  })
  .post("/orders", zValidator('json', createNinjaOrderSchema), async (c) => {
    const db = c.get('db');
    const service = new NinjaOrderService(db);
    const data = c.req.valid('json');
    const result = await service.create(data);
    if (!result) {
      return c.json({ success: false, error: "Failed to create order" }, 400);
    }
    return c.json({ success: true, data: result }, 201);
  })
  .get("/orders/:id", zValidator('param', idParamSchema), async (c) => {
    const db = c.get('db');
    const service = new NinjaOrderService(db);
    const id = c.req.valid('param').id;
    const result = await service.findById(id);
    if (!result) {
      return c.json({ success: false, error: "Order not found" }, 404);
    }
    return c.json({ success: true, data: result });
  })
  .put("/orders/:id", zValidator('param', idParamSchema), zValidator('json', updateNinjaOrderSchema), async (c) => {
    const db = c.get('db');
    const service = new NinjaOrderService(db);
    const id = c.req.valid('param').id;
    const data = c.req.valid('json');
    const result = await service.update(id, data);
    if (!result) {
      return c.json({ success: false, error: "Order not found" }, 404);
    }
    return c.json({ success: true, data: result });
  })
  .delete("/orders/:id", zValidator('param', idParamSchema), async (c) => {
    const db = c.get('db');
    const service = new NinjaOrderService(db);
    const id = c.req.valid('param').id;
    const result = await service.softDelete(id);
    if (!result) {
      return c.json({ success: false, error: "Order not found" }, 404);
    }
    return c.json({ success: true, data: result });
  });

export default app;
