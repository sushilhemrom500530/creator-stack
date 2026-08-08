import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RedisCacheInterceptor.name);

  constructor(private readonly cacheService: CacheService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    // Only cache GET requests
    if (request.method !== 'GET') {
      return next.handle();
    }

    const cacheKey = `cache:${request.method}:${request.originalUrl || request.url}`;

    // Cache Hit via CacheService abstraction
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) {
      this.logger.log(`⚡ [CACHE HIT] Key: [${cacheKey}]`);
      return of(cachedData);
    }

    // Cache Miss via CacheService abstraction
    this.logger.log(`🐢 [CACHE MISS] Fetching from MongoDB for Key: [${cacheKey}]`);
    return next.handle().pipe(
      tap((responseData) => {
        if (responseData) {
          this.cacheService.set(cacheKey, responseData, 60); // 60s TTL
        }
      }),
    );
  }
}
