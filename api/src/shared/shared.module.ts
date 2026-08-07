import { Global, Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { CacheModule } from './cache/cache.module';
import { MailModule } from './mail/mail.module';
import { RedisModule } from './redis/redis.module';
import { QueueModule } from './queue/queue.module';

@Global()
@Module({
  imports: [
    LoggerModule,
    CacheModule,
    MailModule,
    RedisModule,
    QueueModule,
  ],
  exports: [
    LoggerModule,
    CacheModule,
    MailModule,
    RedisModule,
    QueueModule,
  ],
})
export class SharedModule {}
