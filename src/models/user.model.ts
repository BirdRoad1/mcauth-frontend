import { eq } from 'drizzle-orm';
import { db } from '../db/db.js';
import { users } from '../db/schema.js';

export async function create(username: string, passbuildHash: string) {
  return (
    (
      await db
        .insert(users)
        .values({
          username,
          passbuildHash
        })
        .returning()
    )[0] ?? null
  );
}

export async function get(id: number) {
  return (await db.select().from(users).where(eq(users.id, id)))?.[0] ?? null;
}

export async function getByUsername(username: string) {
  return (
    (
      await db.select().from(users).where(eq(users.username, username)).limit(1)
    )[0] ?? null
  );
}
