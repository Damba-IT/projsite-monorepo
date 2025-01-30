import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import type { MiddlewareHandler } from "hono";
import type { HonoEnv } from "../types";
import * as schema from "../db/schema";

export const db: MiddlewareHandler<HonoEnv> = async (c, next) => {
  const client = new Pool({ connectionString: c.env.DATABASE_URL });
  const db = drizzle(client, { schema });
  c.set('db', db);
  await next();
  await client.end();
}; 