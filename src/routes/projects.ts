import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { HonoEnv } from "../types";
import { projects } from "../db/schema";
import { eq } from "drizzle-orm";

const app = new Hono<HonoEnv>();

const createProjectSchema = z.object({
  name: z.string().min(1),
  organizationId: z.number(),
});

app
  .get("/", async (c) => {
    const db = c.get('db');
    const result = await db.select().from(projects);
    return c.json(result);
  })
  .post("/", zValidator('json', createProjectSchema), async (c) => {
    const db = c.get('db');
    const data = await c.req.json();
    const result = await db.insert(projects).values(data).returning();
    return c.json(result[0], 201);
  })
  .get("/:id", async (c) => {
    const db = c.get('db');
    const id = Number(c.req.param('id'));
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return c.json(result[0]);
  });

export default app; 