import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig, databaseConfig, jwtConfig, corsConfig, mailConfig, envValidationSchema } from './config';
import { MailModule } from './modules/mail/mail.module';
import { DatabaseModule } from './database/database.module';
import { SharedModule } from './shared/shared.module';
import { CommonModule } from './common/common.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { MongoSanitizeMiddleware } from './common/middleware/mongo-sanitize.middleware';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { HealthModule } from './modules/health/health.module';
import { DocsModule } from './modules/docs/docs.module';

@Module({
  imports: [
    //  Environment Validation using Joi
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, corsConfig, mailConfig],
      validationSchema: envValidationSchema,
    }),

    // Rate Limiting (100 requests / 60 seconds)
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    DatabaseModule,
    SharedModule,
    CommonModule,

    // Domain & Security Modules
    MailModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    ProductsModule,
    CategoriesModule,
    UploadsModule,
    NotificationsModule,
    SettingsModule,
    AuditLogModule,
    HealthModule,
    DocsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global Exception Filter
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //  Mongo Injection Protection & Request Logger
    consumer.apply(LoggerMiddleware, MongoSanitizeMiddleware).forRoutes('*');
  }
}
