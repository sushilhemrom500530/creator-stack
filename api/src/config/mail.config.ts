import { registerAs } from '@nestjs/config';

export const mailConfig = registerAs('mail', () => ({
  email: process.env.NODE_MAILER_EMAIL,
  password: process.env.NODE_MAILER_PASSWORD,
}));
