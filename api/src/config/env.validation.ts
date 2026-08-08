import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  APP_NAME: Joi.string().default('Creator Stack API'),
  API_PREFIX: Joi.string().default('api/v1'),

  CORS_ORIGIN: Joi.string().required(),

  MONGODB_URI: Joi.string().required(),

  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  COOKIE_SECRET: Joi.string().min(16).required(),

  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),

  NODE_MAILER_EMAIL: Joi.string().optional().allow(''),
  NODE_MAILER_PASSWORD: Joi.string().optional().allow(''),
});
