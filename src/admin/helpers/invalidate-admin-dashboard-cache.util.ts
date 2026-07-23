import { Logger } from '@nestjs/common';
import { RedisService } from '../../common/redis/redis.service';

/** Clear cached admin dashboard widgets (KPIs, smart alerts signals, charts, etc.). */
export async function invalidateAdminDashboardCache(
  redisService: RedisService,
  logger?: Logger,
): Promise<void> {
  await redisService
    .deleteByPattern(redisService.buildKey('admin-dashboard', '*'))
    .catch((error) => {
      logger?.warn(
        `Failed to invalidate admin dashboard caches: ${(error as Error)?.message || 'unknown error'}`,
      );
    });
}
