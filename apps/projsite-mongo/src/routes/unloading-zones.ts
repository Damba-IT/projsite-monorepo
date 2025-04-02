import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { HonoEnv } from "../types";
import {
  createUnloadingZoneSchema,
  updateUnloadingZoneSchema,
} from "@projsite/types";
import { UnloadingZoneService } from "../services/unloading-zone-service";
import { idParamSchema } from "../utils/validation";
import { HTTPException } from "hono/http-exception";
import { validationErrorHandler } from "../middleware/error-handler";
import { z } from "zod";

const app = new Hono<HonoEnv>();

app
  .get(
    "/project/:id",
    zValidator("param", idParamSchema, validationErrorHandler),
    async c => {
      const db = c.get("db");
      const service = new UnloadingZoneService(db);
      const projectId = c.req.valid("param").id;
      const result = await service.findByProjectId(projectId);
      if (!result) {
        throw new HTTPException(404, { message: "Unloading zones not found" });
      }
      return c.json({ success: true, data: result });
    }
  )
  .get(
    "/:id",
    zValidator("param", idParamSchema, validationErrorHandler),
    async c => {
      const db = c.get("db");
      const service = new UnloadingZoneService(db);
      const id = c.req.valid("param").id;
      const result = await service.findById(id);
      if (!result) {
        throw new HTTPException(404, { message: "Unloading zone not found" });
      }
      return c.json({ success: true, data: result });
    }
  )
  .post(
    "/",
    zValidator("json", createUnloadingZoneSchema, validationErrorHandler),
    async c => {
      const db = c.get("db");
      const service = new UnloadingZoneService(db);
      const data = c.req.valid("json");
      const result = await service.create(data);
      if (!result) {
        throw new HTTPException(400, {
          message: "Failed to create unloading zone",
        });
      }
      return c.json({ success: true, data: result }, 201);
    }
  )
  .put(
    "/:id",
    zValidator("param", idParamSchema, validationErrorHandler),
    zValidator("json", updateUnloadingZoneSchema, validationErrorHandler),
    async c => {
      const db = c.get("db");
      const service = new UnloadingZoneService(db);
      const id = c.req.valid("param").id;
      const data = c.req.valid("json");
      const result = await service.update(id, data);
      if (!result) {
        throw new HTTPException(404, { message: "Unloading zone not found" });
      }
      return c.json({ success: true, data: result });
    }
  )
  .patch(
    "/:id/status",
    zValidator("param", idParamSchema, validationErrorHandler),
    zValidator(
      "json",
      z.object({ active: z.boolean() }),
      validationErrorHandler
    ),
    async c => {
      const db = c.get("db");
      const service = new UnloadingZoneService(db);
      const id = c.req.valid("param").id;
      const { active } = c.req.valid("json");
      const result = await service.updateActiveStatus(id, active);
      if (!result) {
        throw new HTTPException(404, {
          message: "Unloading zone not found",
        });
      }
      return c.json({ success: true, data: result });
    }
  )
  .patch(
    "/:id/name",
    zValidator("param", idParamSchema, validationErrorHandler),
    zValidator(
      "json",
      z.object({ name: z.string().min(1) }),
      validationErrorHandler
    ),
    async c => {
      const db = c.get("db");
      const service = new UnloadingZoneService(db);
      const id = c.req.valid("param").id;
      const { name } = c.req.valid("json");
      const result = await service.updateName(id, name);
      if (!result) {
        throw new HTTPException(404, {
          message: "Unloading zone not found",
        });
      }
      return c.json({ success: true, data: result });
    }
  )
  .patch(
    "/:id/color",
    zValidator("param", idParamSchema, validationErrorHandler),
    zValidator(
      "json",
      z.object({ color: z.string().min(1) }),
      validationErrorHandler
    ),
    async c => {
      const db = c.get("db");
      const service = new UnloadingZoneService(db);
      const id = c.req.valid("param").id;
      const { color } = c.req.valid("json");
      const result = await service.updateColor(id, color);
      if (!result) {
        throw new HTTPException(404, {
          message: "Unloading zone not found",
        });
      }
      return c.json({ success: true, data: result });
    }
  )
  .delete(
    "/:id",
    zValidator("param", idParamSchema, validationErrorHandler),
    async c => {
      const db = c.get("db");
      const service = new UnloadingZoneService(db);
      const id = c.req.valid("param").id;
      const result = await service.softDelete(id);
      if (!result) {
        throw new HTTPException(404, { message: "Unloading zone not found" });
      }
      return c.json({ success: true, data: result });
    }
  );

export default app;
