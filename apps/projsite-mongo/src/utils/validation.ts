import { z } from "zod";
import { ObjectId } from "mongodb";

/**
 * Validates MongoDB ObjectId format in route parameters
 */
export const idParamSchema = z.object({
  id: z.string().refine(
    val => {
      try {
        return Boolean(val.match(/^[0-9a-fA-F]{24}$/));
      } catch {
        return false;
      }
    },
    { message: "Invalid ObjectId format" }
  ),
});

/**
 * Converts string or ObjectId to ObjectId
 */
export const toObjectId = (id: string | ObjectId): ObjectId => {
  return typeof id === "string" ? new ObjectId(id) : id;
};
