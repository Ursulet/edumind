import { z } from 'zod';

/**
 * Environment variables validation schema for EduCarieră services
 */
export const envSchema = z.object({
  NODE_ENV: z.enum(['local', 'test', 'staging', 'production']).default('local'),
  PORT: z.string().transform(Number).default('3001'),
  DATABASE_URL: z.string().url().default('postgresql://educariera:educariera_secret@localhost:5432/educariera_db'),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  JWT_SECRET: z.string().min(16).default('super-secret-jwt-key-min-16-chars'),
  API_PREFIX: z.string().default('/api/v1'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(env: Record<string, string | undefined>): EnvConfig {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('Invalid environment configuration');
  }
  return result.data;
}

export * from './cms';
