import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

function normalizeNumberArray(value: unknown): number[] | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const source = Array.isArray(value) ? value : String(value).split(',');
  const parsed = source
    .map((v) => Number(String(v).trim()))
    .filter((v) => Number.isFinite(v));
  return parsed.length > 0 ? parsed : undefined;
}

function normalizeOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  const v = String(value).trim();
  return v === '' ? undefined : v;
}

function normalizeOptionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export class AdminListProductsDto {
  @ApiPropertyOptional({
    description:
      'Lifecycle status filter. Supports single value or array. Example: [0,1]',
    type: [Number],
    example: [0, 1],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeNumberArray(value))
  @IsArray()
  @IsInt({ each: true })
  status?: number[];

  @ApiPropertyOptional({
    description: 'Product type filter: 0=online, 1=offline',
    enum: [0, 1],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalNumber(value))
  @IsInt()
  @IsIn([0, 1])
  product_type?: 0 | 1;

  @ApiPropertyOptional({
    description: 'Category ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsMongoId()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Manufacturer ID',
    example: '507f1f77bcf86cd799439012',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsMongoId()
  manufacturerId?: string;

  @ApiPropertyOptional({
    description: 'Created date start (ISO date string). Alias: fromDate',
    example: '2026-01-01',
  })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiPropertyOptional({
    description: 'Created date end (ISO date string). Alias: toDate',
    example: '2026-12-31',
  })
  @IsOptional()
  @IsString()
  to?: string;

  @ApiPropertyOptional({
    description: 'Alias for from',
    example: '2026-01-01',
  })
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiPropertyOptional({
    description: 'Alias for to',
    example: '2026-12-31',
  })
  @IsOptional()
  @IsString()
  toDate?: string;

  @ApiPropertyOptional({
    description: 'Filter by valid till year',
    example: 2026,
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalNumber(value))
  @IsInt()
  validTillYear?: number;

  @ApiPropertyOptional({
    description: 'Plant state ID',
    example: '507f1f77bcf86cd799439013',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsMongoId()
  stateId?: string;

  @ApiPropertyOptional({ description: 'Plant city', example: 'Mumbai' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description:
      'Global search on eoiNo, urnNo, productName, manufacturerName, email, phone',
  })
  @IsOptional()
  @IsString()
  search?: string;

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
  @Max(200)
  limit?: number = 10;

  @ApiPropertyOptional({
    enum: [
      'createdDate',
      'createdAt',
      'validTill',
      'productName',
      'eoiNo',
      'urnNo',
    ],
    default: 'createdDate',
  })
  @IsOptional()
  @IsIn([
    'createdDate',
    'createdAt',
    'validTill',
    'productName',
    'eoiNo',
    'urnNo',
  ])
  sortBy?:
    | 'createdDate'
    | 'createdAt'
    | 'validTill'
    | 'productName'
    | 'eoiNo'
    | 'urnNo' = 'createdDate';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({
    description: 'Alias for sortOrder',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';
}
