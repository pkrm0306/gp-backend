import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsIn,
  IsMongoId,
  Matches,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

function normalizeOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  const v = String(value).trim();
  return v === '' ? undefined : v;
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
    description: 'Number of items per page (default: 10)',
    example: 10,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

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
      'Filter EOIs by productStatus. URN is included if any child matches. 4 = expired (certified past validtill). Certified (2) is excluded from the default list.',
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
