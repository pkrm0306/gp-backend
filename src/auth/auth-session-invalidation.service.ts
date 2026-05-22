import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../common/redis/redis.service';

/** JWT payload fields used for session invalidation checks. */
export type SessionInvalidationPayload = {
  iat?: number;
  userId?: string;
  manufacturerId?: string;
  vendorId?: string;
};

@Injectable()
export class AuthSessionInvalidationService {
  private readonly logger = new Logger(AuthSessionInvalidationService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  private sessionInvalidationTtlSeconds(): number {
    const raw = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '24h';
    const s = String(raw).trim();
    const dayMatch = /^(\d+)d$/i.exec(s);
    if (dayMatch) {
      const days = Number(dayMatch[1]);
      return Math.max(days + 1, 1) * 24 * 60 * 60;
    }
    const hourMatch = /^(\d+)h$/i.exec(s);
    if (hourMatch) {
      const hours = Number(hourMatch[1]);
      return Math.max(hours * 60 * 60 + 3600, 3600);
    }
    return 9 * 24 * 60 * 60;
  }

  private manufacturerKey(manufacturerId: string): string {
    return this.redisService.buildKey(
      'auth',
      'manufacturer-sessions-invalidated-at',
      manufacturerId,
    );
  }

  private userKey(userId: string): string {
    return this.redisService.buildKey(
      'auth',
      'user-sessions-invalidated-at',
      userId,
    );
  }

  /** Log out all portal users for a manufacturer (vendor email change from admin list). */
  async invalidateSessionsForManufacturer(
    manufacturerId: string,
  ): Promise<void> {
    const id = String(manufacturerId ?? '').trim();
    if (!id) return;

    const epoch = Math.floor(Date.now() / 1000);
    await this.redisService.set(
      this.manufacturerKey(id),
      { epoch },
      this.sessionInvalidationTtlSeconds(),
    );
    this.logger.log(
      `Invalidated active sessions for manufacturer ${id} (epoch=${epoch})`,
    );
  }

  /** Log out a single user (optional; manufacturer-wide invalidation is preferred for email sync). */
  async invalidateSessionsForUser(userId: string): Promise<void> {
    const id = String(userId ?? '').trim();
    if (!id) return;

    const epoch = Math.floor(Date.now() / 1000);
    await this.redisService.set(
      this.userKey(id),
      { epoch },
      this.sessionInvalidationTtlSeconds(),
    );
    this.logger.log(`Invalidated active sessions for user ${id} (epoch=${epoch})`);
  }

  private async maxInvalidatedEpochForPayload(
    payload: SessionInvalidationPayload,
  ): Promise<number> {
    const epochs: number[] = [];

    const userId = String(payload.userId ?? '').trim();
    if (userId) {
      const u = await this.redisService.get<{ epoch?: number }>(
        this.userKey(userId),
      );
      if (typeof u?.epoch === 'number') epochs.push(u.epoch);
    }

    const manufacturerId = String(
      payload.manufacturerId ?? payload.vendorId ?? '',
    ).trim();
    if (manufacturerId) {
      const m = await this.redisService.get<{ epoch?: number }>(
        this.manufacturerKey(manufacturerId),
      );
      if (typeof m?.epoch === 'number') epochs.push(m.epoch);
    }

    return epochs.length ? Math.max(...epochs) : 0;
  }

  /**
   * Rejects access/refresh tokens issued before a global session invalidation event.
   */
  async assertSessionActive(payload: SessionInvalidationPayload): Promise<void> {
    const iat = typeof payload.iat === 'number' ? payload.iat : 0;
    if (!iat) return;

    const invalidatedAt = await this.maxInvalidatedEpochForPayload(payload);
    if (invalidatedAt > 0 && iat < invalidatedAt) {
      throw new UnauthorizedException(
        'Session expired. Please sign in again.',
      );
    }
  }
}
