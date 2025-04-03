import { ObjectId } from "mongodb";
import { z } from "zod";

// Convert string ID to MongoDB ObjectId
export const toObjectId = (id: string | ObjectId): ObjectId => {
  return typeof id === "string" ? new ObjectId(id) : id;
};

// Zod schema for validating MongoDB ObjectId
export const idSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");
