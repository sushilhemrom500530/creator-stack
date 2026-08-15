import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(5000),
  APP_NAME: Joi.string().default('Creator Stack API'),
  API_PREFIX: Joi.string().default('api/v1'),

  CORS_ORIGIN: Joi.string().required(),

  MONGODB_URI: Joi.string().required(),

  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  COOKIE_SECRET: Joi.string().min(16).required(),
  ENCRYPTION_KEY: Joi.string().min(16).optional(),

  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),

  NODE_MAILER_EMAIL: Joi.string().optional().allow(''),
  NODE_MAILER_PASSWORD: Joi.string().optional().allow(''),

  // Social OAuth & Meta APIs (Optional in dev, required in prod social publishing)
  META_APP_ID: Joi.string().optional().allow(''),
  META_APP_SECRET: Joi.string().optional().allow(''),
  META_CALLBACK_URL: Joi.string().optional().allow(''),
  META_GRAPH_VERSION: Joi.string().default('v21.0'),

  GOOGLE_CLIENT_ID: Joi.string().optional().allow(''),
  GOOGLE_CLIENT_SECRET: Joi.string().optional().allow(''),
  GOOGLE_CALLBACK_URL: Joi.string().optional().allow(''),

  LINKEDIN_CLIENT_ID: Joi.string().optional().allow(''),
  LINKEDIN_CLIENT_SECRET: Joi.string().optional().allow(''),
  LINKEDIN_CALLBACK_URL: Joi.string().optional().allow(''),

  TWITTER_CLIENT_ID: Joi.string().optional().allow(''),
  TWITTER_CLIENT_SECRET: Joi.string().optional().allow(''),
  TWITTER_CALLBACK_URL: Joi.string().optional().allow(''),

  WHATSAPP_BUSINESS_ACCOUNT_ID: Joi.string().optional().allow(''),
  WHATSAPP_PHONE_NUMBER_ID: Joi.string().optional().allow(''),
  WHATSAPP_ACCESS_TOKEN: Joi.string().optional().allow(''),
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: Joi.string().optional().allow(''),

  // AI Providers
  OPENAI_API_KEY: Joi.string().optional().allow(''),
  GEMINI_API_KEY: Joi.string().optional().allow(''),

  // Media & Storage
  CLOUDINARY_CLOUD_NAME: Joi.string().optional().allow(''),
  CLOUDINARY_API_KEY: Joi.string().optional().allow(''),
  CLOUDINARY_API_SECRET: Joi.string().optional().allow(''),
  AWS_S3_BUCKET: Joi.string().optional().allow(''),
  AWS_REGION: Joi.string().optional().allow(''),
  AWS_ACCESS_KEY_ID: Joi.string().optional().allow(''),
  AWS_SECRET_ACCESS_KEY: Joi.string().optional().allow(''),
});
