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
  private client: Redis | null = null;
  private useInMemoryFallback = false;
  private suppressClientErrors = false;
  private readonly inMemoryStore = new Map<
    string,
    { value: string; expiresAt?: number }
  >();

  constructor(private readonly configService: ConfigService) {
    this.prefix =
      this.configService.get<string>('REDIS_KEY_PREFIX') || 'greenpro:';

    const redisEnabledRaw =
      this.configService.get<string>('REDIS_ENABLED') ?? 'true';
    const redisEnabled = redisEnabledRaw.toLowerCase() !== 'false';
    if (!redisEnabled) {
      this.useInMemoryFallback = true;
      this.logger.log(
        'Redis disabled (REDIS_ENABLED=false); using in-process cache (Map)',
      );
      return;
    }

    const redisUrl = (this.configService.get<string>('REDIS_URL') || '').trim();
    const host = this.configService.get<string>('REDIS_HOST') || '127.0.0.1';
    const port = parseInt(this.configService.get<string>('REDIS_PORT') || '6379', 10);
    const password = this.configService.get<string>('REDIS_PASSWORD') || undefined;
    const db = parseInt(this.configService.get<string>('REDIS_DB') || '0', 10);
    const redisTlsRaw = this.configService.get<string>('REDIS_TLS') || 'false';
    const useTls =
      redisTlsRaw.toLowerCase() === 'true' ||
      redisUrl.toLowerCase().startsWith('rediss://');

    const commonOptions = {
      db,
      lazyConnect: true,
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
      retryStrategy: () => null,
    };

    this.client = redisUrl
      ? new Redis(redisUrl, {
          ...commonOptions,
          ...(useTls ? { tls: {} } : {}),
        })
      : new Redis({
          host,
          port,
          password,
          ...commonOptions,
          ...(useTls ? { tls: {} } : {}),
        });

    this.client.on('error', (error: Error) => {
      if (this.useInMemoryFallback || this.suppressClientErrors) {
        return;
      }
      this.logger.error(`Redis error: ${error.message}`);
    });
  }

  async onModuleInit(): Promise<void> {
    if (this.useInMemoryFallback || !this.client) {
      if (!this.useInMemoryFallback) {
        this.useInMemoryFallback = true;
        this.logger.warn(
          'Redis client not configured; using in-process cache (Map)',
        );
      }
      return;
    }

    try {
      this.suppressClientErrors = true;
      await this.client.connect();
      const host = this.client.options.host ?? 'unknown';
      const port = this.client.options.port ?? 'unknown';
      const db = this.client.options.db ?? 0;
      this.logger.log(
        `Redis connected (${host}:${port}, db=${db}, prefix="${this.prefix}")`,
      );
    } catch (error) {
      this.useInMemoryFallback = true;
      this.logger.warn(
        `Redis unavailable at ${this.describeRedisTarget()}; using in-process cache (Map): ${
          (error as Error)?.message || 'unknown error'
        }`,
      );
      this.disconnectRedisClient();
    }
  }

  private describeRedisTarget(): string {
    const redisUrl = (this.configService.get<string>('REDIS_URL') || '').trim();
    if (redisUrl) {
      return redisUrl.replace(/\/\/.*@/, '//***@');
    }
    const host = this.configService.get<string>('REDIS_HOST') || '127.0.0.1';
    const port = this.configService.get<string>('REDIS_PORT') || '6379';
    return `${host}:${port}`;
  }

  private disconnectRedisClient(): void {
    if (!this.client) return;
    try {
      this.client.removeAllListeners();
      if (this.client.status !== 'end') {
        this.client.disconnect(false);
      }
    } catch {
      // no-op
    }
    this.client = null;
  }

  async onModuleDestroy(): Promise<void> {
    this.inMemoryStore.clear();
    this.disconnectRedisClient();
  }

  buildKey(...parts: Array<string | number | boolean | undefined | null>): string {
    const safe = parts
      .filter((p) => p !== undefined && p !== null && String(p).trim() !== '')
      .map((p) => String(p).trim());
    return `${this.prefix}${safe.join(':')}`;
  }

  async get<T = string>(key: string): Promise<T | null> {
    if (this.useInMemoryFallback) {
      return this.getFromMemory<T>(key);
    }

    const raw = await this.client!.get(key);
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

    if (this.useInMemoryFallback) {
      this.setInMemory(key, serialized, ttlSeconds);
      return 'OK';
    }

    if (ttlSeconds && ttlSeconds > 0) {
      return this.client!.set(key, serialized, 'EX', ttlSeconds);
    }
    return this.client!.set(key, serialized);
  }

  async del(key: string): Promise<number> {
    if (this.useInMemoryFallback) {
      const existed = this.inMemoryStore.delete(key);
      return existed ? 1 : 0;
    }
    return this.client!.del(key);
  }

  async deleteByPattern(pattern: string): Promise<number> {
    if (this.useInMemoryFallback) {
      return this.deleteByPatternInMemory(pattern);
    }

    let cursor = '0';
    let deleted = 0;
    do {
      const [nextCursor, keys] = await this.client!.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );
      cursor = nextCursor;
      if (keys.length > 0) {
        deleted += await this.client!.del(...keys);
      }
    } while (cursor !== '0');
    return deleted;
  }

  async exists(key: string): Promise<boolean> {
    if (this.useInMemoryFallback) {
      return (await this.getFromMemory(key)) !== null;
    }
    const count = await this.client!.exists(key);
    return count > 0;
  }

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    if (this.useInMemoryFallback) {
      if (!this.inMemoryStore.has(key) || ttlSeconds <= 0) return false;
      const current = this.inMemoryStore.get(key);
      if (!current) return false;
      this.inMemoryStore.set(key, {
        value: current.value,
        expiresAt: Date.now() + ttlSeconds * 1000,
      });
      return true;
    }
    const ok = await this.client!.expire(key, ttlSeconds);
    return ok === 1;
  }

  private getFromMemory<T>(key: string): T | null {
    const entry = this.inMemoryStore.get(key);
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      this.inMemoryStore.delete(key);
      return null;
    }
    try {
      return JSON.parse(entry.value) as T;
    } catch {
      return entry.value as unknown as T;
    }
  }

  private setInMemory(key: string, serialized: string, ttlSeconds?: number): void {
    this.inMemoryStore.set(key, {
      value: serialized,
      ...(ttlSeconds && ttlSeconds > 0
        ? { expiresAt: Date.now() + ttlSeconds * 1000 }
        : {}),
    });
  }

  private deleteByPatternInMemory(pattern: string): number {
    let deleted = 0;
    const regexPattern = new RegExp(
      `^${String(pattern)
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*')}$`,
    );
    for (const key of this.inMemoryStore.keys()) {
      if (regexPattern.test(key)) {
        this.inMemoryStore.delete(key);
        deleted += 1;
      }
    }
    return deleted;
  }
}
