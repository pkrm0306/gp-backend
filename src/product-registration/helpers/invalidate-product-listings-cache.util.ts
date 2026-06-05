import { Logger } from '@nestjs/common';
import { RedisService } from '../../common/redis/redis.service';

/** Clear admin/vendor product lists and public website certified product caches. */
export async function invalidateProductListingsCache(
  redisService: RedisService,
  logger?: Logger,
): Promise<void> {
  await Promise.all([
    redisService.deleteByPattern(
      redisService.buildKey('products', 'list', 'vendor', '*'),
    ),
    redisService.deleteByPattern(
      redisService.buildKey('products', 'list', 'admin', '*'),
    ),
    redisService.deleteByPattern(
      redisService.buildKey('website', 'public', 'certified-products', '*'),
    ),
  ]).catch((error) => {
    logger?.warn(
      `Failed to invalidate product listing caches: ${(error as Error)?.message || 'unknown error'}`,
    );
  });
}
