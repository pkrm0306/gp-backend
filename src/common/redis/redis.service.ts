import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly prefix: string;
  private client: Redis;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('REDIS_HOST') || 'redis';
    const port = parseInt(this.configService.get<string>('REDIS_PORT') || '6379', 10);
    const password = this.configService.get<string>('REDIS_PASSWORD') || undefined;
    const db = parseInt(this.configService.get<string>('REDIS_DB') || '0', 10);
    this.prefix = this.configService.get<string>('REDIS_KEY_PREFIX') || 'greenpro:';

    this.client = new Redis({
      host,
      port,
      password,
      db,
      lazyConnect: true,
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.client.connect();
      this.logger.log('Redis connected');
    } catch (error) {
      this.logger.warn(
        `Redis connection failed (continuing without Redis): ${(error as Error)?.message || 'unknown error'}`,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      if (this.client.status !== 'end') {
        await this.client.quit();
      }
    } catch {
      // no-op
    }
  }

  buildKey(...parts: Array<string | number | boolean | undefined | null>): string {
    const safe = parts
      .filter((p) => p !== undefined && p !== null && String(p).trim() !== '')
      .map((p) => String(p).trim());
    return `${this.prefix}${safe.join(':')}`;
  }

  async get<T = string>(key: string): Promise<T | null> {
    const raw = await this.client.get(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  }

  async set(
    key: string,
    value: unknown,
    ttlSeconds?: number,
  ): Promise<'OK' | null> {
    const serialized =
      typeof value === 'string' ? value : JSON.stringify(value ?? null);
    if (ttlSeconds && ttlSeconds > 0) {
      return this.client.set(key, serialized, 'EX', ttlSeconds);
    }
    return this.client.set(key, serialized);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async deleteByPattern(pattern: string): Promise<number> {
    let cursor = '0';
    let deleted = 0;
    do {
      const [nextCursor, keys] = await this.client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );
      cursor = nextCursor;
      if (keys.length > 0) {
        deleted += await this.client.del(...keys);
      }
    } while (cursor !== '0');
    return deleted;
  }

  async exists(key: string): Promise<boolean> {
    const count = await this.client.exists(key);
    return count > 0;
  }

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    const ok = await this.client.expire(key, ttlSeconds);
    return ok === 1;
  }
}

