import { z } from 'zod';

const EnvSchema = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  EXPO_PUBLIC_API_BASE_URL: z.string().url().default('https://example.invalid'),
  EXPO_PUBLIC_ENABLE_DEV_SEED: z
    .string()
    .optional()
    .transform((value) => value !== 'false')
});

export const env = EnvSchema.parse({
  APP_ENV: process.env.APP_ENV,
  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  EXPO_PUBLIC_ENABLE_DEV_SEED: process.env.EXPO_PUBLIC_ENABLE_DEV_SEED
});
