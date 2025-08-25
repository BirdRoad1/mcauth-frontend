import { drizzle } from 'drizzle-orm/libsql';
import { env } from '../env/env.js';

export const db = drizzle({ connection: {
  url: env.DATABASE_URL,
}});