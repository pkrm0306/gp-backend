import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  normalizeNumberArray,
  normalizeStatusLabels,
} from '../utils/list-manufacturers-query.util';

export class ListManufacturersQueryDto {
  @ApiPropertyOptional({
    description:
      'Optional manufacturer MongoDB id. When provided, returns only that manufacturer (ignores pagination/search).',
    example: '660000000000000000000000',
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  id?: string;

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
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description:
      'Case-insensitive partial match on manufacturer name, vendor name, email, or GP internal ID',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Case-insensitive partial filter by manufacturerName',
  })
  @IsOptional()
  @IsString()
  manufacturerName?: string;

  @ApiPropertyOptional({
    description: 'Case-insensitive partial filter by gpInternalId',
  })
  @IsOptional()
  @IsString()
  gpInternalId?: string;

  @ApiPropertyOptional({
    description: 'Case-insensitive partial filter by manufacturerInitial',
  })
  @IsOptional()
  @IsString()
  manufacturerInitial?: string;

  @ApiPropertyOptional({
    description:
      'List scope: `verified` (manufacturerStatus=1), `unverified` (0 or 2), or `all`. Use `verified` for the verified-manufacturers admin screen.',
    enum: ['verified', 'unverified', 'all'],
    default: 'all',
  })
  @IsOptional()
  @IsEnum(['verified', 'unverified', 'all'])
  scope?: 'verified' | 'unverified' | 'all';

  @ApiPropertyOptional({
    description:
      '0 deleted / pending, 1 verified, 2 unverified. Ignored when `scope` is `verified` or `unverified` unless you need to override.',
    enum: [0, 1, 2],
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsEnum([0, 1, 2])
  manufacturerStatus?: 0 | 1 | 2;

  @ApiPropertyOptional({
    description:
      'Vendor lifecycle (single value): 0 unverified, 1 active, 2 inactive. Prefer `status` for UI Active/Inactive multiselect.',
    enum: [0, 1, 2],
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsEnum([0, 1, 2])
  vendor_status?: 0 | 1 | 2;

  @ApiPropertyOptional({
    description:
      'Vendor lifecycle (multi): same codes as vendor_status. Comma-separated or repeated, e.g. vendor_status=0,1',
    type: [Number],
    example: [0, 1],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeNumberArray(value))
  @IsArray()
  @IsInt({ each: true })
  @IsIn([0, 1, 2], { each: true })
  vendor_status_list?: number[];

  @ApiPropertyOptional({
    description:
      'UI status multiselect: `active` → vendor_status=1 (toggle On); `inactive` → vendor_status≠1 (toggle Off, includes 0/2/null/unset). Comma-separated or repeated.',
    type: [String],
    example: ['active'],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeStatusLabels(value))
  @IsArray()
  @IsIn(['active', 'inactive'], { each: true })
  status?: Array<'active' | 'inactive'>;

  @ApiPropertyOptional({
    enum: ['createdAt', 'manufacturerName'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsEnum(['createdAt', 'manufacturerName'])
  sortBy?: 'createdAt' | 'manufacturerName' = 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({
    description:
      'Only for `GET /api/manufacturers/export`: `csv` (default) or `xlsx` spreadsheet with Initial and Status columns aligned to the admin listing.',
    enum: ['csv', 'xlsx'],
    default: 'csv',
  })
  @IsOptional()
  @IsEnum(['csv', 'xlsx'])
  format?: 'csv' | 'xlsx';
}
