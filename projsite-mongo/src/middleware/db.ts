import { MongoClient } from 'mongodb';
import type { MiddlewareHandler } from 'hono';
import type { HonoEnv } from '../types';

let client: MongoClient | null = null;

export const db: MiddlewareHandler<HonoEnv> = async (c, next) => {
  try {
    if (!client) {
      client = new MongoClient(c.env.MONGODB_URI, {
        maxPoolSize: 1,
        minPoolSize: 0,
        maxIdleTimeMS: 5000,
        serverSelectionTimeoutMS: 5000,
      });
      await client.connect();
    }

    const db = client.db();
    c.set('db', db);
    
    await next();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}; 