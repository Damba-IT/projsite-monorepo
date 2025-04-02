import { Hono } from "hono";
import { ResourceService } from "../services/resource-services";
import type { HonoEnv } from "../types";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createResourceSchema, updateResourceSchema } from "@projsite/types";
import { idParamSchema } from "../utils/validation";
import { validationErrorHandler } from "../middleware/error-handler";
import { HTTPException } from "hono/http-exception";

const resourceRouter = new Hono<HonoEnv>();

resourceRouter
  .get("/", async c => {
    const db = c.get("db");
    const service = new ResourceService(db);
    const result = await service.findAll();
    return c.json({ success: true, data: result });
  })
  .get(
    "/project/:id",
    zValidator("param", idParamSchema, validationErrorHandler),
    async c => {
      const db = c.get("db");
      const service = new ResourceService(db);
      const projectId = c.req.valid("param").id;
      const result = await service.findByProjectId(projectId);
      return c.json({ success: true, data: result });
    }
  )
  .get(
    "/user/:id",
    zValidator("param", idParamSchema, validationErrorHandler),
    async c => {
      const db = c.get("db");
      const service = new ResourceService(db);
      const userId = c.req.valid("param").id;
      const result = await service.findByAssignedUser(userId);
      return c.json({ success: true, data: result });
    }
  )
  .get(
    "/:id",
    zValidator("param", idParamSchema, validationErrorHandler),
    async c => {
      const db = c.get("db");
      const service = new ResourceService(db);
      const id = c.req.valid("param").id;
      const result = await service.findById(id);
      if (!result) {
        throw new HTTPException(404, { message: "Resource not found" });
      }
      return c.json({ success: true, data: result });
    }
  )
  .post(
    "/",
    zValidator("json", createResourceSchema, validationErrorHandler),
    async c => {
      const db = c.get("db");
      const service = new ResourceService(db);
      const data = c.req.valid("json");
      const result = await service.create(data);
      if (!result) {
        throw new HTTPException(400, { message: "Failed to create resource" });
      }
      return c.json({ success: true, data: result }, 201);
    }
  )
  .put(
    "/:id",
    zValidator("param", idParamSchema, validationErrorHandler),
    zValidator("json", updateResourceSchema, validationErrorHandler),
    async c => {
      const db = c.get("db");
      const service = new ResourceService(db);
      const id = c.req.valid("param").id;
      const data = c.req.valid("json");
      const result = await service.update(id, data);
      if (!result) {
        throw new HTTPException(404, { message: "Resource not found" });
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
      const service = new ResourceService(db);
      const id = c.req.valid("param").id;
      const { active } = c.req.valid("json");
      const result = await service.updateActiveStatus(id, active);
      if (!result) {
        throw new HTTPException(404, { message: "Resource not found" });
      }
      return c.json({ success: true, data: result });
    }
  )
  .patch(
    "/:id/assign",
    zValidator("param", idParamSchema, validationErrorHandler),
    zValidator(
      "json",
      z.object({ userIds: z.array(z.string()) }),
      validationErrorHandler
    ),
    async c => {
      const db = c.get("db");
      const service = new ResourceService(db);
      const id = c.req.valid("param").id;
      const { userIds } = c.req.valid("json");
      const result = await service.assignUsers(id, userIds);
      if (!result) {
        throw new HTTPException(404, { message: "Resource not found" });
      }
      return c.json({ success: true, data: result });
    }
  )
  .delete(
    "/:id",
    zValidator("param", idParamSchema, validationErrorHandler),
    async c => {
      const db = c.get("db");
      const service = new ResourceService(db);
      const id = c.req.valid("param").id;
      const result = await service.softDelete(id);
      if (!result) {
        throw new HTTPException(404, { message: "Resource not found" });
      }
      return c.json({ success: true, data: result });
    }
  );

export default resourceRouter;
