import z from 'zod';

const env_schema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['production', 'development']).default('development'),
  DATABASE_URL: z.string(),
  REFRESH_SECRET: z.string(),
  REFRESH_TIME: z.coerce.number(),
  ACCESS_SECRET: z.string(),
  ACCESS_TIME: z.coerce.number(),
  CONFIRMATION_SECRET: z.string(),
  CONFIRMATION_TIME: z.coerce.number(),
});
type I_ENV = z.infer<typeof env_schema>;

function env_initializer() {
  try {
    return env_schema.parse(Bun.env) as I_ENV;
  } catch (error: any) {
    const path = error.errors[0]?.path[0];
    const message = error.errors[0].message?.toLowerCase();
    console.error(`ENV '${path}' is ${message}`);
    process.exit(-1);
  }
}

export const ENV = env_initializer() as Readonly<I_ENV>;
