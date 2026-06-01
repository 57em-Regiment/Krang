import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),

  ALLOWED_HOST: z.string().optional(),
  CORS_ORIGINS: z
    .string()
    .default('*')
    .transform(val => (val === '*' ? '*' : val.split(',').map(s => s.trim()))),

  //PostgresSQL
  DATABASE_URL: z.url(),

  //57regiment Services
  WANSHITONG_SERVICE_URL: z.url(),
  RENENUTET_SERVICE_URL: z.url(),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
