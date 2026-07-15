import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  parseDashboardMonth,
  parseDashboardYear,
} from '../utils/dashboard-metrics-filters.util';

function trimOptional(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  const v = String(value).trim();
  return v === '' ? undefined : v;
}

/** Maps UI labels and short aliases to canonical period values. */
export function normalizeDashboardPeriod(
  value: unknown,
): string | undefined {
  const raw = trimOptional(value);
  if (!raw) return undefined;
  const key = raw.toLowerCase().replace(/\s+/g, '_');
  const aliases: Record<string, string> = {
    week: 'this_week',
    thisweek: 'this_week',
    month: 'this_month',
    thismonth: 'this_month',
    quarter: 'this_quarter',
    year: 'this_year',
    thisyear: 'this_year',
    lastweek: 'last_week',
    lastmonth: 'last_month',
    lastyear: 'last_year',
    last_month: 'last_month',
    last_week: 'last_week',
    last_year: 'last_year',
  };
  return aliases[key] ?? key;
}

export class DashboardMetricsQueryDto {
  @ApiPropertyOptional({
    enum: [
      'this_week',
      'this_month',
      'this_quarter',
      'this_year',
      'last_week',
      'last_month',
      'last_year',
    ],
    description:
      'Time window. Aliases: week, month, year, last_month (also accepts "Last Month").',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeDashboardPeriod(value))
  @IsIn([
    'this_week',
    'this_month',
    'this_quarter',
    'this_year',
    'last_week',
    'last_month',
    'last_year',
  ])
  period?:
    | 'this_week'
    | 'this_month'
    | 'this_quarter'
    | 'this_year'
    | 'last_week'
    | 'last_month'
    | 'last_year';

  @ApiPropertyOptional({
    example: 2026,
    description: 'Omit or send "all" for all years',
  })
  @IsOptional()
  @Transform(({ value }) => parseDashboardYear(value))
  @IsInt()
  @Min(2000)
  @Max(2100)
  year?: number;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 12,
    description: '1–12, or short name (Jan, Mar). Omit or "all" for all months',
  })
  @IsOptional()
  @Transform(({ value }) => parseDashboardMonth(value))
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 4 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(4)
  quarter?: number;

  @ApiPropertyOptional({
    enum: ['active', 'pending', 'completed', 'overdue'],
    description:
      'pending → productStatus 0–1; completed → certified & valid; overdue → expired certificate; active → in certification (URN 1–10 or approved)',
  })
  @IsOptional()
  @Transform(({ value }) => trimOptional(value))
  @IsIn(['active', 'pending', 'completed', 'overdue'])
  productStatus?: 'active' | 'pending' | 'completed' | 'overdue';

  @ApiPropertyOptional({
    description: 'Category MongoDB _id or slug (e.g. cement)',
  })
  @IsOptional()
  @Transform(({ value }) => trimOptional(value))
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ enum: ['north', 'south', 'east', 'west'] })
  @IsOptional()
  @Transform(({ value }) => trimOptional(value)?.toLowerCase())
  @IsIn(['north', 'south', 'east', 'west'])
  region?: 'north' | 'south' | 'east' | 'west';

  @ApiPropertyOptional({
    enum: ['monthly', 'weekly', 'quarterly'],
    default: 'monthly',
  })
  @IsOptional()
  @Transform(({ value }) => trimOptional(value) ?? 'monthly')
  @IsIn(['monthly', 'weekly', 'quarterly'])
  granularity?: 'monthly' | 'weekly' | 'quarterly' = 'monthly';

  /** Explicit custom range start (ISO date). Overrides period when both `from` and `to` are set. */
  @ApiPropertyOptional({ example: '2026-01-01', description: 'ISO date or datetime' })
  @IsOptional()
  @Transform(({ value }) => trimOptional(value))
  @IsString()
  from?: string;

  /** Explicit custom range end (ISO date). Overrides period when both `from` and `to` are set. */
  @ApiPropertyOptional({ example: '2026-03-31' })
  @IsOptional()
  @Transform(({ value }) => trimOptional(value))
  @IsString()
  to?: string;

  /** Manufacturer / vendor MongoDB _id — scopes products, payments, and manufacturer KPIs. */
  @ApiPropertyOptional({ description: 'Manufacturer MongoDB ObjectId' })
  @IsOptional()
  @Transform(({ value }) => trimOptional(value))
  @IsString()
  manufacturerId?: string;

  /** Alias for manufacturerId (vendor portal / payment vendorId). */
  @ApiPropertyOptional({ description: 'Alias of manufacturerId' })
  @IsOptional()
  @Transform(({ value }) => trimOptional(value))
  @IsString()
  vendorId?: string;

  /**
   * Generic status filter used by activity / pending panels.
   * Prefer `productStatus` for product KPIs; this is a freer string for activity feeds.
   */
  @ApiPropertyOptional({
    description: 'Generic status token (pending, verified, paid, etc.)',
  })
  @IsOptional()
  @Transform(({ value }) => trimOptional(value)?.toLowerCase())
  @IsString()
  status?: string;
}

export class DashboardRecentProductsQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}

export class DashboardActivityQueryDto {
  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
