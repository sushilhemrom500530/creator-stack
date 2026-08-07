import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, VersioningType, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Create NestJS Express application instance
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('app.nodeEnv') || 'development';
  const port = configService.get<number>('app.port') || 3000;
  const apiPrefix = configService.get<string>('app.apiPrefix') || 'api/v1';
  const corsOrigins = configService.get<string[]>('cors.origin');
  const cookieSecret = configService.get<string>('COOKIE_SECRET');

  // 29. Graceful Shutdown
  app.enableShutdownHooks();

  // 21. API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // 3. Validation Pipe (whitelist: true, forbidNonWhitelisted: true, transform: true)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 1 & 17. Helmet (HSTS, CSP, Frame Guard, MIME Sniffing, XSS Headers)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:'],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      frameguard: {
        action: 'deny',
      },
      noSniff: true,
      xssFilter: true,
    }),
  );

  // 9. Cookie Parser (Signed & HttpOnly)
  app.use(cookieParser(cookieSecret));

  // 15. Compression
  app.use(compression());

  // 7. CORS (Frontend Only - No origin: '*')
  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global Prefix
  app.setGlobalPrefix(apiPrefix, {
    exclude: [
      { path: '/', method: RequestMethod.GET },
      { path: '', method: RequestMethod.GET },
      { path: '/docs', method: RequestMethod.GET },
      { path: 'docs', method: RequestMethod.GET },
      { path: '/health', method: RequestMethod.GET },
      { path: 'health', method: RequestMethod.GET },
    ],
  });

  // 13. Global Exception Filter (Sanitized, no Mongo errors or stack traces exposed)
  app.useGlobalFilters(new GlobalExceptionFilter());

  // 23 & 12. Logger
  logger.log(`Initializing application in [${nodeEnv}] mode on port ${port}...`);

  // Start Server
  await app.listen(port);
  logger.log(`🚀 Server running on: http://localhost:${port}`);
  logger.log(`📚 Custom API Documentation available at: http://localhost:${port}/docs`);
}

bootstrap();
