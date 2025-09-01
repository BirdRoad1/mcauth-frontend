import type { Request, Response } from 'express';
import type z from 'zod';
import type { AuthenticatedLocals } from '../../middleware/auth.middleware.js';
import type { updateUserNoteSchema } from '../../schema/note.schema.js';
import { db } from '../../db/db.js';
import { savedNotes, users } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export const getById = async (req: Request<{ id: string }>, res: Response) => {
  const note = (
    await db
      .select()
      .from(savedNotes)
      .where(eq(savedNotes.publicId, req.params.id))
      .limit(1)
  )[0];

  if (!note) {
    return res.status(404).json({
      message: 'Note not found'
    });
  }

  res.contentType('text/plain').send(note.content);
};

export const get = async (
  req: Request,
  res: Response<unknown, AuthenticatedLocals>
) => {
  res.json({ content: res.locals.user.note });
};

export const post = async (
  req: Request<never, never, z.infer<typeof updateUserNoteSchema>>,
  res: Response<unknown, AuthenticatedLocals>
) => {
  const { content } = req.body;
  await db
    .update(users)
    .set({
      note: content
    })
    .where(eq(users.id, res.locals.user.id));
  res.json({});
};

export const share = async (
  req: Request<never, never, z.infer<typeof updateUserNoteSchema>>,
  res: Response<unknown, AuthenticatedLocals>
) => {
  const { content } = req.body;
  const publicId = crypto.randomUUID();
  await db.insert(savedNotes).values({
    publicId,
    userId: res.locals.user.id,
    content
  });

  res.json({
    id: publicId
  });
};
