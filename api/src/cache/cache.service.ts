import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

interface CacheItem<T = any> {
  value: T;
  expiry: number;
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly memoryCache = new Map<string, CacheItem>();

  constructor(private readonly redisService: RedisService) {
    // Purge expired memory entries every 60s
    setInterval(() => this.purgeExpiredMemoryCache(), 60000);
  }

  private purgeExpiredMemoryCache(): void {
    const now = Date.now();
    for (const [key, item] of this.memoryCache.entries()) {
      if (item.expiry < now) this.memoryCache.delete(key);
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    // Instant In-Memory Lookup (<1ms)
    const mem = this.memoryCache.get(key);
    if (mem) {
      if (mem.expiry > Date.now()) return mem.value as T;
      this.memoryCache.delete(key);
    }

    // Remote Redis Lookup
    const redisVal = await this.redisService.get<T>(key);
    if (redisVal !== null && redisVal !== undefined) {
      this.memoryCache.set(key, { value: redisVal, expiry: Date.now() + 60000 });
      return redisVal;
    }

    return null;
  }

  async set(key: string, value: any, ttlSeconds = 60): Promise<void> {
    this.memoryCache.set(key, { value, expiry: Date.now() + ttlSeconds * 1000 });
    this.redisService.set(key, value, ttlSeconds).catch((err) => {
      this.logger.error(`Background Redis set error: ${err.message}`);
    });
  }

  async delete(key: string): Promise<void> {
    this.memoryCache.delete(key);
    await this.redisService.del(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    for (const key of this.memoryCache.keys()) {
      if (regex.test(key)) this.memoryCache.delete(key);
    }
    await this.redisService.delByPattern(pattern);
  }

  async getOrSet<T>(key: string, factory: () => Promise<T>, ttlSeconds = 60): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null && cached !== undefined) return cached;

    const freshData = await factory();
    if (freshData !== null && freshData !== undefined) {
      await this.set(key, freshData, ttlSeconds);
    }
    return freshData;
  }
}
