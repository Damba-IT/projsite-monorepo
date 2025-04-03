import { Db, MongoClient } from "mongodb";
import { Context } from "./trpc";

let db: Db | null = null;

/**
 * This function connects to the MongoDB database if not already connected
 * and returns a database instance.
 */
async function getDb(): Promise<Db> {
  if (db) return db;

  const mongoUri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/projsite";
  const client = new MongoClient(mongoUri);
  await client.connect();
  db = client.db();

  return db;
}

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 */
export async function createTRPCContext(): Promise<Context> {
  const db = await getDb();
  return { db };
}

/**
 * Helper method to create a context with an already connected database
 * Useful for testing or when you already have a database connection
 */
export function createContextWithDb(db: Db): Context {
  return { db };
}
