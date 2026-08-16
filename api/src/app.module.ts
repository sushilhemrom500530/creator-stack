import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { appConfig, databaseConfig, jwtConfig, corsConfig, mailConfig, socialConfig, envValidationSchema } from './config';
import { AppController } from './app.controller';
import { MailModule } from './modules/mail/mail.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { CacheModule } from './cache/cache.module';
import { LoggerModule } from './logger/logger.module';
import { QueueModule } from './queue/queue.module';
import { CommonModule } from './common/common.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { MongoSanitizeMiddleware } from './common/middleware/mongo-sanitize.middleware';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { SocialAccountsModule } from './modules/social-accounts/social-accounts.module';
import { SocialProvidersModule } from './providers/social';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { HealthModule } from './modules/health/health.module';
import { DocsModule } from './modules/docs/docs.module';
import { PostsModule, WhatsAppModule, PublishingModule, SchedulerModule, AiModule } from './modules';

@Module({
  imports: [
    // Environment Validation using Joi
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, corsConfig, mailConfig, socialConfig],
      validationSchema: envValidationSchema,
    }),

    // Rate Limiting (1000 requests / 60 seconds)
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 1000,
      },
    ]),

    DatabaseModule,
    RedisModule,
    CacheModule,
    LoggerModule,
    QueueModule,
    CommonModule,
    SocialProvidersModule,

    // Domain & Security Modules
    MailModule,
    AuthModule,
    UsersModule,
    WorkspacesModule,
    SocialAccountsModule,
    WhatsAppModule,
    PostsModule,
    PublishingModule,
    SchedulerModule,
    AiModule,
    RolesModule,
    PermissionsModule,
    UploadsModule,
    NotificationsModule,
    SettingsModule,
    AuditLogModule,
    HealthModule,
    DocsModule,
  ],
  controllers: [AppController],
  providers: [
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
    // Mongo Injection Protection & Request Logger
    consumer.apply(LoggerMiddleware, MongoSanitizeMiddleware).forRoutes('*');
  }
}
