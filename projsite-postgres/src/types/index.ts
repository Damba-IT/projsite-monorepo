import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "../db/schema";

export type Env = {
  DATABASE_URL: string;
  CLERK_SECRET_KEY: string;
  CLERK_PUBLISHABLE_KEY: string;
  SERVICE_API_KEY: string;
};

export type Database = ReturnType<typeof drizzle<typeof schema>>;

export type HonoEnv = {
  Bindings: Env;
  Variables: {
    db: Database;
  };
}; 