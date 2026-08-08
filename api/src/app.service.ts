import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) { }

  getStatus() {
    const env = this.configService.get<string>('app.nodeEnv') || 'development';
    const apiPrefix = this.configService.get<string>('app.apiPrefix') || 'api/v1';

    return {
      success: true,
      message: '🚀 Creator Stack API Engine is active and running professionally!',
      status: 'online',
      version: '1.0.0',
      environment: env,
      endpoints: {
        documentation: '/docs',
        healthCheck: `/${apiPrefix}/health`,
        authRegister: `/${apiPrefix}/auth/register`,
        authLogin: `/${apiPrefix}/auth/login`,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
