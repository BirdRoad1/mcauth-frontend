import z from 'zod';

export const startSignupSchema = z.object({
  username: z
    .string()
    .min(3, { error: 'Your username must be at least 3 characters long' })
    .max(10, { error: 'Your username must be at most 10 characters long' })
});
