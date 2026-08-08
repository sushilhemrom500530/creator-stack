import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, VersioningType, BadRequestException } from '@nestjs/common';
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
  const port = configService.get<number>('app.port') || 8080;
  const apiPrefix = (configService.get<string>('app.apiPrefix') || 'api').split('/')[0];
  const corsOrigins = configService.get<string[]>('cors.origin');
  const cookieSecret = configService.get<string>('COOKIE_SECRET');

  // Graceful Shutdown
  app.enableShutdownHooks();

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Validation Pipe (whitelist: true, transform: true)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((err) => {
          const constraints = err.constraints ? Object.values(err.constraints) : [];
          return {
            field: err.property,
            message: constraints[0] || `${err.property} is invalid`,
          };
        });
        return new BadRequestException({
          message: 'Validation failed.',
          errors: formattedErrors,
        });
      },
    }),
  );

  //  Helmet (HSTS, CSP, Frame Guard, MIME Sniffing, XSS Headers)
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

  // Cookie Parser (Signed & HttpOnly)
  app.use(cookieParser(cookieSecret));

  // Compression
  app.use(compression());

  // CORS (Frontend Only - No origin: '*')
  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global Prefix
  app.setGlobalPrefix(apiPrefix, { exclude: ['/', 'docs', 'health'] });

  // Global Exception Filter (Sanitized, no Mongo errors or stack traces exposed)
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Logger
  logger.log(`Initializing application in [${nodeEnv}] mode on port ${port}...`);

  // Start Server
  await app.listen(port);
  logger.log(`🚀 Server running on: http://localhost:${port}`);
  logger.log(`📚 Custom API Documentation available at: http://localhost:${port}/docs`);
}

bootstrap();
