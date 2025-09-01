import { relations } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: int().primaryKey({ autoIncrement: true }),
  username: text().notNull().unique(),
  passbuildHash: text().notNull(),
  note: text()
});

export const usersRelations = relations(users, ({ many }) => ({
  savedNotes: many(savedNotes)
}));

export const savedNotes = sqliteTable('saved_notes', {
  id: int().primaryKey({ autoIncrement: true }),
  publicId: text().notNull().unique(),
  userId: int().notNull(),
  content: text().notNull()
});

export const savedNotesRelations = relations(savedNotes, ({ one }) => ({
  user: one(users, {
    fields: [savedNotes.userId],
    references: [users.id]
  })
}));
