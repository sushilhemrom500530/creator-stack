import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Public } from './common/decorators';

@ApiTags('Root')
@Controller({ version: VERSION_NEUTRAL })
export class AppController {
  constructor(private readonly configService: ConfigService) { }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Server status and root information' })
  @ApiResponse({ status: 200, description: 'Server running status' })
  getRoot() {
    const appName = this.configService.get<string>('app.name') || 'Creator Stack API';
    const env = this.configService.get<string>('app.nodeEnv') || process.env.NODE_ENV || 'development';
    const apiPrefix = this.configService.get<string>('app.apiPrefix') || 'api/v1';

    return {
      success: true,
      message: `${appName} server is running successfully 🚀`,
      data: {
        name: appName,
        status: 'online',
        environment: env,
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(process.uptime())}s`,
        endpoints: {
          api: `/${apiPrefix}`,
          docs: '/docs',
          health: '/health',
        },
      },
    };
  }
}
