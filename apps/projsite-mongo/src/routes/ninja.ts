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
import { validationErrorHandler } from '../middleware/error-handler';

const app = new Hono<HonoEnv>();

app
  .get("/orders", async (c) => {
    const db = c.get('db');
    const service = new NinjaOrderService(db);
    const result = await service.findAll();
    return c.json({ success: true, data: result });
  })
  .get("/orders/company/:id", 
    zValidator('param', idParamSchema, validationErrorHandler),
    async (c) => {
      const db = c.get('db');
      const service = new NinjaOrderService(db);
      const companyId = c.req.valid('param').id;
      const result = await service.findByCompany(companyId);
      if (!result) {
        throw new HTTPException(404, { message: "No orders found for this company" });
      }
      return c.json({ success: true, data: result });
    }
  )
  .post("/orders", 
    zValidator('json', createNinjaOrderSchema, validationErrorHandler),
    async (c) => {
      const db = c.get('db');
      const service = new NinjaOrderService(db);
      const data = c.req.valid('json');
      const result = await service.create(data);
      if (!result) {
        throw new HTTPException(400, { message: "Failed to create order" });
      }
      return c.json({ success: true, data: result }, 201);
    }
  )
  .get("/orders/:id", 
    zValidator('param', idParamSchema, validationErrorHandler),
    async (c) => {
      const db = c.get('db');
      const service = new NinjaOrderService(db);
      const id = c.req.valid('param').id;
      const result = await service.findById(id);
      if (!result) {
        throw new HTTPException(404, { message: "Order not found" });
      }
      return c.json({ success: true, data: result });
    }
  )
  .put("/orders/:id", 
    zValidator('param', idParamSchema, validationErrorHandler),
    zValidator('json', updateNinjaOrderSchema, validationErrorHandler),
    async (c) => {
      const db = c.get('db');
      const service = new NinjaOrderService(db);
      const id = c.req.valid('param').id;
      const data = c.req.valid('json');
      const result = await service.update(id, data);
      if (!result) {
        throw new HTTPException(404, { message: "Order not found" });
      }
      return c.json({ success: true, data: result });
    }
  )
  .delete("/orders/:id", 
    zValidator('param', idParamSchema, validationErrorHandler),
    async (c) => {
      const db = c.get('db');
      const service = new NinjaOrderService(db);
      const id = c.req.valid('param').id;
      const result = await service.softDelete(id);
      if (!result) {
        throw new HTTPException(404, { message: "Order not found" });
      }
      return c.json({ success: true, data: result });
    }
  );

export default app;
