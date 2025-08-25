import z from 'zod';

export const envSchema = z.object({
  PORT: z
    .string()
    .default('8000')
    .transform(z => Number(z))
    .refine(n => n >= 0 && n <= 65535, { error: 'Invalid port number' }),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  SERVER_URL: z.string().nonempty(),
  BASE_URL: z.string().nonempty(),
  PLUGIN_URL: z.string().nonempty(),
  DATABASE_URL: z.string().nonempty(),
  JWT_PRIVATE: z
    .string()
    .min(64)
    .regex(/[a-fA-F0-9]{64,}/, { error: 'must be a hex string' }),
});
