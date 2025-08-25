import { eq } from 'drizzle-orm';
import { db } from '../db/db.js';
import { users } from '../db/schema.js';

export class User {
  static async create(username: string, passbuildHash: string) {
    await db.insert(users).values({
      username,
      passbuildHash
    });
  }
  
  static async getByUsername(username: string) {
    return (
      (
        await db
          .select()
          .from(users)
          .where(eq(users.username, username))
          .limit(1)
      )[0] ?? null
    );
  }
}
