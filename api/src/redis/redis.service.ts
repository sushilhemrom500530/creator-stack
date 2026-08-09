import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from '@upstash/redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;

  constructor(private readonly configService: ConfigService) {
    this.initRedis();
  }

  private initRedis() {
    const url = (this.configService.get<string>('REDIS_REST_URL') || process.env.REDIS_REST_URL || '').trim();
    const token = (this.configService.get<string>('REDIS_REST_TOKEN') || process.env.REDIS_REST_TOKEN || '').trim();

    if (url && token) {
      this.client = new Redis({ url, token });
      this.logger.log(`Upstash Redis client initialized for [${url}]`);
    } else {
      this.logger.warn('REDIS_REST_URL and REDIS_REST_TOKEN are not configured.');
    }
  }

  async onModuleInit() {
    if (this.client) {
      try {
        await this.client.ping();
        this.logger.log('🚀 Upstash Redis connected & verified successfully!');
      } catch (err) {
        this.logger.error(`❌ Upstash Redis connection failed: ${err.message}`);
      }
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    if (!this.client) return null;
    try {
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 80));
      const data = await Promise.race([this.client.get<T>(key), timeoutPromise]);
      return data;
    } catch (err) {
      this.logger.error(`Redis get error for [${key}]: ${err.message}`);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    if (!this.client) return;
    try {
      if (ttlSeconds && ttlSeconds > 0) {
        await this.client.set(key, value, { ex: ttlSeconds });
      } else {
        await this.client.set(key, value);
      }
    } catch (err) {
      this.logger.error(`Redis set error for [${key}]: ${err.message}`);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.del(key);
    } catch (err) {
      this.logger.error(`Redis del error for [${key}]: ${err.message}`);
    }
  }

  async delByPattern(pattern: string): Promise<void> {
    if (!this.client) return;
    try {
      const keys = await this.client.keys(pattern);
      if (keys && keys.length > 0) {
        await this.client.del(...keys);
        this.logger.log(`Cleared ${keys.length} Redis keys matching [${pattern}]`);
      }
    } catch (err) {
      this.logger.error(`Redis delByPattern error for [${pattern}]: ${err.message}`);
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.client) return false;
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (err) {
      this.logger.error(`Redis exists error for [${key}]: ${err.message}`);
      return false;
    }
  }

  async ttl(key: string): Promise<number> {
    if (!this.client) return -1;
    try {
      return await this.client.ttl(key);
    } catch (err) {
      this.logger.error(`Redis ttl error for [${key}]: ${err.message}`);
      return -1;
    }
  }
}
