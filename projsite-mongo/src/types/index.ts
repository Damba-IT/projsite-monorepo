export type Env = {
  DATABASE_URL: string;
  CLERK_SECRET_KEY: string;
  CLERK_PUBLISHABLE_KEY: string;
  SERVICE_API_KEY: string;
};

export type HonoEnv = {
  Bindings: Env;
  Variables: {
  };
}; 