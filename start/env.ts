/*
|--------------------------------------------------------------------------
| Environment variables
|--------------------------------------------------------------------------
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),

  // Application configuration
  APP_KEY: Env.schema.secret(),
  APP_URL: Env.schema.string({ format: 'url', tld: false }),

  // Session configuration
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory', 'database'] as const),

  // Administrator authentication
  ADMIN_ACCESS_KEY: Env.schema.string.optional(),

  /*
  |--------------------------------------------------------------------------
  | Email and SMTP configuration
  |--------------------------------------------------------------------------
  */

  MAIL_MAILER: Env.schema.enum(['smtp'] as const),

  MAIL_FROM_NAME: Env.schema.string(),
  MAIL_FROM_ADDRESS: Env.schema.string(),

  SMTP_HOST: Env.schema.string(),
  SMTP_PORT: Env.schema.number(),

  // SMTP authentication
  SMTP_USERNAME: Env.schema.string(),
  SMTP_PASSWORD: Env.schema.secret(),
  OTP_SECRET: Env.schema.secret(),
})
