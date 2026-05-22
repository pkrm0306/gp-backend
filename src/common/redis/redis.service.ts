import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly prefix: string;
  private readonly inMemoryStore = new Map<
    string,
    { value: string; expiresAt?: number }
  >();

  constructor(private readonly configService: ConfigService) {
    this.prefix = this.configService.get<string>('REDIS_KEY_PREFIX') || 'greenpro:';
  }

  async onModuleInit(): Promise<void> {
    this.logger.log(
      'Using in-process cache (Map); no Redis server is used by RedisService. OK for local/single-instance; use a shared store if you scale horizontally.',
    );
  }

  async onModuleDestroy(): Promise<void> {
    this.inMemoryStore.clear();
  }

  buildKey(...parts: Array<string | number | boolean | undefined | null>): string {
    const safe = parts
      .filter((p) => p !== undefined && p !== null && String(p).trim() !== '')
      .map((p) => String(p).trim());
    return `${this.prefix}${safe.join(':')}`;
  }

  async get<T = string>(key: string): Promise<T | null> {
    const entry = this.inMemoryStore.get(key);
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      this.inMemoryStore.delete(key);
      return null;
    }
    const raw = entry.value;
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
    this.inMemoryStore.set(key, {
      value: serialized,
      ...(ttlSeconds && ttlSeconds > 0
        ? { expiresAt: Date.now() + ttlSeconds * 1000 }
        : {}),
    });
    return 'OK';
  }

  async del(key: string): Promise<number> {
    const existed = this.inMemoryStore.delete(key);
    return existed ? 1 : 0;
  }

  async deleteByPattern(pattern: string): Promise<number> {
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

  async exists(key: string): Promise<boolean> {
    const val = await this.get(key);
    return val !== null;
  }

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    if (!this.inMemoryStore.has(key) || ttlSeconds <= 0) return false;
    const current = this.inMemoryStore.get(key);
    if (!current) return false;
    this.inMemoryStore.set(key, {
      value: current.value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
    return true;
  }
}

