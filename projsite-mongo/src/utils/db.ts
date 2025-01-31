// utils/db.ts
import { MongoClient, Db } from 'mongodb';

// REPLACE WITH YOUR CONNECTION STRING
let cachedDb: Db | null = null;

/**
 * Return a MongoDB Db instance, creating it if necessary.
 */
export async function connectDB(MONGODB_URI: string): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }
  const client = new MongoClient(MONGODB_URI);
  await client.connect();

  // "projsite" or any other DB name from the cluster:
  cachedDb = client.db('projsite_db'); 
  return cachedDb;
}
