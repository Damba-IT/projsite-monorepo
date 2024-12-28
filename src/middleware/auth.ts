import { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { HonoEnv } from "../types";

export const auth: MiddlewareHandler<HonoEnv> = async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Here you would validate the token
    // For example, verify a JWT token
    // const payload = await verifyToken(token);
    // c.set('user', payload);
    
    // For now, we'll just check if token exists
    if (!token) {
      throw new Error("Invalid token");
    }

    await next();
  } catch (error) {
    throw new HTTPException(401, { message: "Invalid token" });
  }
}; 