import z from 'zod';

export const startLoginSchema = z.object({
  username: z.string({ error: 'Please enter a valid username' })
});
