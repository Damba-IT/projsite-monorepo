import { Hono } from "hono";
import { swaggerUI } from '@hono/swagger-ui'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { db } from "./middleware/db";
import { errorHandler } from "./middleware/error-handler";
//import { rateLimiter } from "./middleware/rate-limiter"; // TODO:: Finish implementing rate limiter. What is the best way to do it? What is appropiate max rate limit?
import organizationsRouter from "./routes/organizations";
import projectsRouter from "./routes/projects";
import type { HonoEnv } from "./types";
import { openApiSpec } from './openapi'
import { customPrintFunc, log } from './utils/logger'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { response } from "./utils/response";

const app = new Hono<HonoEnv>();

// Swagger UI
app.get('/swagger', swaggerUI({
  url: '/swagger.json'
}))

// Serve OpenAPI spec
app.get('/swagger.json', (c) => c.json(openApiSpec))

// Global middleware (order matters)
app.use("/*", errorHandler);
app.use("/*", logger(customPrintFunc));
//app.use("/*", rateLimiter(100, 60000)); // 100 requests per minute??
app.use("/*", prettyJSON());
app.use("/*", db);

// Protected routes 
// TODO:: Test clerk auth. I have not tested the clerk auth yet. Therefor i comment it out for now)
//app.use("/organizations/*", clerkMiddleware());
//app.use("/projects/*", clerkMiddleware());

// Routes
app.route("/organizations", organizationsRouter);
app.route("/projects", projectsRouter);

// Basic health check
app.get("/health", (c) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return response.error(c, "Unauthorized", 401);
  }
  return response.success(c, { status: "ok" });
});

export default app;
