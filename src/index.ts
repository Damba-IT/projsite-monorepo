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
import { customPrintFunc } from './utils/logger'
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
//app.use("/*", rateLimiter(100, 60000)); // 100 requests per minute?? more??
app.use("/*", prettyJSON());
app.use("/*", db);

// Protected routes 
// TODO:: Test clerk auth + service auth. I have not tested the clerk or service auth yet. Therefor i comment it out for now)
//app.use("/organizations/*", auth);
//app.use("/projects/*", auth);
//app.use("/swagger", auth);

//TODO:: for booking endpoints investigate how to use websockets to update bookings/calendar... https://hono.dev/docs/helpers/websocket... https://hono.dev/docs/helpers/streaming??

// Routes
app.route("/organizations", organizationsRouter);
app.route("/projects", projectsRouter);

// Public endpoints (no auth)
app.get("/health", (c) => {
  return response.success(c, { status: "ok" });
});

export default app;



//TODO:: Look into implementing these middlewares:
// - cors - https://hono.dev/docs/middleware/builtin/cors
// - ip restrictions - https://hono.dev/docs/middleware/builtin/ip-restriction
// - csrf - https://hono.dev/docs/middleware/builtin/csrf