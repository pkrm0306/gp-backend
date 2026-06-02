import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/** Query params for public website summit listing (active summits only). */
export class PublicListSummitsQueryDto {
  @ApiPropertyOptional({ default: 1, description: 'Page number (1-based)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    default: 12,
    description: 'Items per page (max 50)',
    example: 12,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 12;

  @ApiPropertyOptional({
    example: '2026',
    description: 'Filter by summit year',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : String(value).trim()))
  year?: string;

  @ApiPropertyOptional({
    description: 'Search in title, slug, or location',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : String(value).trim()))
  search?: string;
}
