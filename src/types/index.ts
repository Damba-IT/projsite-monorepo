import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "../db/schema";

export type Env = {
  DATABASE_URL: string;
};

export type Database = ReturnType<typeof drizzle<typeof schema>>;

export type HonoEnv = {
  Bindings: Env;
  Variables: {
    db: Database;
  };
}; 