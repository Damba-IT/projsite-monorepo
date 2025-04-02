import { Db } from "mongodb";

// Environment type for Hono
export interface HonoEnv {
  Bindings: {
    MONGODB_URI: string;
    CLERK_PUBLISHABLE_KEY: string;
    CLERK_SECRET_KEY: string;
  };
  Variables: {
    db: Db;
  };
}
