import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsIn,
  IsMongoId,
  Matches,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

function normalizeOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  const v = String(value).trim();
  return v === '' ? undefined : v;
}

/** Query: `0,1` or repeated keys → EOI `productStatus` list. */
function normalizeProductStatusListFromQuery(value: unknown): number[] | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const source = Array.isArray(value) ? value : String(value).split(',');
  const parsed = source
    .map((v) => Number(String(v).trim()))
    .filter((v) => Number.isFinite(v));
  return parsed.length > 0 ? parsed : undefined;
}

export class ListProductsDto {
  @ApiProperty({
    description: 'Page number (default: 1)',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page (default: 20)',
    example: 20,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiProperty({
    description:
      'Global search term (searches in product_name, eoi_no, urn_no, category.category_name)',
    example: 'Solar Panel',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description:
      'Filter EOIs by **single** `productStatus` (EOI list status). Prefer `productStatusList` for multiple values. ' +
      'If **both** this and `productStatusList` are omitted, the list defaults to **Pending (0) + Submitted (1)** only. ' +
      'URN is included if any child matches. `4` = expired certified (past validtill).',
    example: 0,
    required: false,
    enum: [0, 1, 2, 3, 4],
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([0, 1, 2, 3, 4])
  productStatus?: number;

  @ApiPropertyOptional({
    description:
      'Filter EOIs by **multiple** EOI `productStatus` codes (comma-separated or repeated query param), e.g. **`0,1`** = Pending + Submitted. ' +
      'Takes precedence over `productStatus` / `status` when non-empty. Values: **0** Pending, **1** Submitted, **2** Certified, **3** Rejected, **4** Expired certified.',
    example: '0,1',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => normalizeProductStatusListFromQuery(value))
  @IsArray()
  @IsInt({ each: true })
  @IsIn([0, 1, 2, 3, 4], { each: true })
  productStatusList?: number[];

  @ApiPropertyOptional({
    description: 'Snake_case alias of `productStatusList`.',
    example: '0,1',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeProductStatusListFromQuery(value))
  @IsArray()
  @IsInt({ each: true })
  @IsIn([0, 1, 2, 3, 4], { each: true })
  product_status_list?: number[];

  @ApiPropertyOptional({
    description: 'Deprecated alias for productStatus',
    example: 0,
    enum: [0, 1, 2, 3, 4],
    deprecated: true,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([0, 1, 2, 3, 4])
  status?: number;

  @ApiPropertyOptional({
    description: 'Filter by category MongoDB ObjectId',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsMongoId()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Filter products created on or after this date (YYYY-MM-DD)',
    example: '2026-01-01',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  dateFrom?: string;

  @ApiPropertyOptional({
    description: 'Filter products created on or before this date (YYYY-MM-DD)',
    example: '2026-12-31',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  dateTo?: string;

  @ApiPropertyOptional({
    description:
      'Filter by manufacturing plant **country** (MongoDB `_id` from countries dropdown).',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsMongoId()
  countryId?: string;

  @ApiPropertyOptional({
    description: 'Snake_case alias of `countryId`.',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsMongoId()
  country_id?: string;

  @ApiPropertyOptional({
    description:
      'Filter by plant **state name** (free text, case-insensitive partial match). Not a state id.',
    example: 'Telangana',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    description: 'Snake_case alias of `state` (text search).',
    example: 'Telangana',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsString()
  state_name?: string;

  @ApiPropertyOptional({
    description:
      'Filter by plant **city** (free text, case-insensitive partial match).',
    example: 'Hyderabad',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Snake_case alias of `city`.',
    example: 'Hyderabad',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsString()
  city_name?: string;

  @ApiProperty({
    description: 'Sort order (default: desc)',
    example: 'desc',
    required: false,
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sort?: string = 'desc';
}
