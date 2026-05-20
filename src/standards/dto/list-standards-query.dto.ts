import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { normalizeResourceStandardTypeList } from '../utils/parse-resource-standard-types.util';

export class ListStandardsQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    default: 10,
    description: 'Page size (max 500). For CSV export use GET /api/standards/export instead.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Case-insensitive partial match on name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'Environmental',
    description: 'Single standard type (legacy). Merged with resource_standard_types.',
  })
  @IsOptional()
  @IsString()
  resource_standard_type?: string;

  @ApiPropertyOptional({
    example: 'Environmental,Energy',
    description:
      'Multi-select standard types. Comma-separated string, JSON array string, or repeated query param (resource_standard_types or resource_standard_types[]).',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeResourceStandardTypeList(value))
  @IsArray()
  @IsString({ each: true })
  resource_standard_types?: string[];

  @ApiPropertyOptional({
    example: 1,
    description:
      'Numeric `category_id` from GET /categories; limits results to that category.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  category_id?: number;

  @ApiPropertyOptional({
    example: 1,
    description:
      'Numeric sector `id` from GET /api/sectors; limits results to standards linked to any category in that sector.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  sector?: number;

  @ApiPropertyOptional({ enum: [0, 1] })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsEnum([0, 1])
  status?: 0 | 1;

  @ApiPropertyOptional({
    enum: ['id', 'name', 'resource_standard_type', 'created_at'],
    default: 'id',
  })
  @IsOptional()
  @IsEnum(['id', 'name', 'resource_standard_type', 'created_at'])
  sortBy?: 'id' | 'name' | 'resource_standard_type' | 'created_at' = 'id';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'asc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'asc';
}
