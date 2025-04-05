import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { HonoEnv } from "../types";
import { UserMembershipService } from "../services/user-membership-service";
import { validationErrorHandler } from "../middleware/error-handler";
import { HTTPException } from "hono/http-exception";
import { getUserMembershipQuerySchema } from "@projsite/types";

const userMembershipRouter = new Hono<HonoEnv>();

userMembershipRouter.get(
  "/",
  zValidator("query", getUserMembershipQuerySchema, validationErrorHandler),
  async c => {
    const db = c.get("db");
    const service = new UserMembershipService(db);
    const { clerk_user_id, level } = c.req.valid("query");

    const result = await service.getUserMembership(clerk_user_id, level);
    if (!result) {
      throw new HTTPException(404, { message: "User membership not found" });
    }

    return c.json({ success: true, data: result });
  }
);

export default userMembershipRouter;
