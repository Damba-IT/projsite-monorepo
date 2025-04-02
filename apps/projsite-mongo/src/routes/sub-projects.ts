import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { HonoEnv } from "../types";
import { SubProjectService } from "../services/sub-project-service";
import { idParamSchema } from "../utils/validation";
import { validationErrorHandler } from "../middleware/error-handler";
import { HTTPException } from "hono/http-exception";
import {
  createSubProjectSchema,
  updateSubProjectSchema,
} from "@projsite/types";

const subProjectRouter = new Hono<HonoEnv>();

subProjectRouter
  .get(
    "/project/:id",
    zValidator("param", idParamSchema, validationErrorHandler),
    async c => {
      const db = c.get("db");
      const service = new SubProjectService(db);
      const projectId = c.req.valid("param").id;
      const result = await service.findByProjectId(projectId);
      if (!result) {
        throw new HTTPException(404, { message: "Sub-project not found" });
      }
      return c.json({ success: true, data: result });
    }
  )
  .get(
    "/:id",
    zValidator("param", idParamSchema, validationErrorHandler),
    async c => {
      const db = c.get("db");
      const service = new SubProjectService(db);
      const id = c.req.valid("param").id;
      const result = await service.findById(id);
      if (!result) {
        throw new HTTPException(404, { message: "Sub-project not found" });
      }
      return c.json({ success: true, data: result });
    }
  )
  .post(
    "/",
    zValidator("json", createSubProjectSchema, validationErrorHandler),
    async c => {
      const db = c.get("db");
      const service = new SubProjectService(db);
      const data = c.req.valid("json");
      const result = await service.create(data);
      if (!result) {
        throw new HTTPException(400, {
          message: "Failed to create sub-project",
        });
      }
      return c.json({ success: true, data: result }, 201);
    }
  )
  .put(
    "/:id",
    zValidator("param", idParamSchema, validationErrorHandler),
    zValidator("json", updateSubProjectSchema, validationErrorHandler),
    async c => {
      const db = c.get("db");
      const service = new SubProjectService(db);
      const id = c.req.valid("param").id;
      const data = c.req.valid("json");
      const result = await service.update(id, data);
      if (!result) {
        throw new HTTPException(404, { message: "Sub-project not found" });
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
      const service = new SubProjectService(db);
      const id = c.req.valid("param").id;
      const { active } = c.req.valid("json");
      const result = await service.updateActiveStatus(id, active);
      if (!result) {
        throw new HTTPException(404, { message: "Sub-project not found" });
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
      const service = new SubProjectService(db);
      const id = c.req.valid("param").id;
      const { name } = c.req.valid("json");
      const result = await service.updateName(id, name);
      if (!result) {
        throw new HTTPException(404, { message: "Sub-project not found" });
      }
      return c.json({ success: true, data: result });
    }
  )
  .delete(
    "/:id",
    zValidator("param", idParamSchema, validationErrorHandler),
    async c => {
      const db = c.get("db");
      const service = new SubProjectService(db);
      const id = c.req.valid("param").id;
      const result = await service.softDelete(id);
      if (!result) {
        throw new HTTPException(404, { message: "Sub-project not found" });
      }
      return c.json({ success: true, data: result });
    }
  );

export default subProjectRouter;
