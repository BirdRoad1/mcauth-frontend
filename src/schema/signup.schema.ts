import z from 'zod';

export const startSignupSchema = z.object({
  username: z
    .string({ error: 'Please enter a valid username' })
    .min(3, { error: 'Your username must be at least 3 characters long' })
    .max(10, { error: 'Your username must be at most 10 characters long' })
});
