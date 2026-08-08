import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisService } from '../../shared/redis/redis.service';

@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RedisCacheInterceptor.name);

  constructor(private readonly redisService: RedisService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    // Only cache GET requests
    if (request.method !== 'GET') {
      return next.handle();
    }

    const cacheKey = `cache:${request.method}:${request.originalUrl || request.url}`;

    // Step 2: User -> NestJS -> Redis -> Data -> User (Cache Hit)
    const cachedData = await this.redisService.get(cacheKey);
    if (cachedData) {
      this.logger.log(`⚡ [UPSTASH REDIS CACHE HIT] Key: [${cacheKey}]`);
      return of(cachedData);
    }

    // Step 1: User -> NestJS -> Redis Check -> Cache Miss -> MongoDB -> Save to Redis (60s TTL) -> User
    this.logger.log(`🐢 [UPSTASH REDIS CACHE MISS] Fetching from MongoDB for Key: [${cacheKey}]`);
    return next.handle().pipe(
      tap((responseData) => {
        if (responseData) {
          this.redisService.set(cacheKey, responseData, 60); // 60s TTL
        }
      }),
    );
  }
}
