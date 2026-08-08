import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(private readonly redisService: RedisService) {}

  async get<T = any>(key: string): Promise<T | null> {
    return this.redisService.get<T>(key);
  }

  async set(key: string, value: any, ttlSeconds: number = 60): Promise<void> {
    return this.redisService.set(key, value, ttlSeconds);
  }

  async delete(key: string): Promise<void> {
    return this.redisService.del(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    return this.redisService.delByPattern(pattern);
  }

  /**
   * Get cached entry or fetch from factory function and populate cache
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttlSeconds: number = 60,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null && cached !== undefined) {
      this.logger.log(`⚡ [CACHE HIT] Key: [${key}]`);
      return cached;
    }

    this.logger.log(`🐢 [CACHE MISS] Key: [${key}]`);
    const freshData = await factory();
    if (freshData !== null && freshData !== undefined) {
      await this.set(key, freshData, ttlSeconds);
    }
    return freshData;
  }
}
