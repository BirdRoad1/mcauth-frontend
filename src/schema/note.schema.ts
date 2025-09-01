import z from 'zod';

export const updateUserNoteSchema = z.object({
  content: z
    .string({ error: 'content must be a string' })
    .max(10000, { error: 'Your note is too long' })
});
