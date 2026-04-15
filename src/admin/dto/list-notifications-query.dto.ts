import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';

export class ListNotificationsQueryDto {
  @ApiPropertyOptional({
    description: 'Time filter',
    enum: ['all', 'today', 'week', '30d', '90d'],
    default: 'all',
  })
  @IsOptional()
  @Transform(({ value }) => String(value ?? 'all').trim().toLowerCase())
  @IsIn(['all', 'today', 'week', '30d', '90d'])
  range?: 'all' | 'today' | 'week' | '30d' | '90d' = 'all';

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Transform(({ value }) => {
    const n = Number.parseInt(String(value), 10);
    return Number.isFinite(n) ? n : 1;
  })
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Transform(({ value }) => {
    const n = Number.parseInt(String(value), 10);
    return Number.isFinite(n) ? n : 20;
  })
  @IsInt()
  @Min(1)
  limit?: number = 20;
}

