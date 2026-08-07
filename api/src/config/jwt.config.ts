import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'super-refresh-secret-key',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
}));
