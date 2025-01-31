import { MongoClient } from 'mongodb';
import type { MiddlewareHandler } from 'hono';
import type { HonoEnv } from '../types';

let client: MongoClient | null = null;

export const db: MiddlewareHandler<HonoEnv> = async (c, next) => {
  try {
    if (!client) {
      // Get MongoDB URI from either context.env (Cloudflare Workers) or process.env (Bun Runtime)
      const mongoUri = c.env?.MONGODB_URI || process.env.MONGODB_URI;
      
      if (!mongoUri) {
        throw new Error('MongoDB URI is not defined');
      }

      client = new MongoClient(mongoUri, {
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