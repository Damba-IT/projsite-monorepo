import { Hono } from "hono";
import { swaggerUI } from '@hono/swagger-ui'
import { logger } from 'hono/logger'
import { db } from "./middleware/db";
import { errorHandler } from "./middleware/error-handler";
//import { rateLimiter } from "./middleware/rate-limiter";
//import { auth } from "./middleware/auth";
import organizationsRouter from "./routes/organizations";
import projectsRouter from "./routes/projects";
import type { HonoEnv } from "./types";
import { openApiSpec } from './openapi'
import { customPrintFunc, log } from './utils/logger'

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
app.use("/*", db);

// Protected routes
//app.use("/organizations/*", auth);
//app.use("/projects/*", auth);

// Routes
app.route("/organizations", organizationsRouter);
app.route("/projects", projectsRouter);

// Basic health check
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

export default app;
