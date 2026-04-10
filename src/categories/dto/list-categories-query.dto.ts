import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListCategoriesQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Filter by sector id',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  sector?: number;

  @ApiPropertyOptional({
    example: '1,2,5',
    description:
      'Listing only: filter by multiple sector ids (multi-select). Pass comma-separated values.',
  })
  @IsOptional()
  @IsString()
  sectors?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Filter by category status (category_status)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  status?: number;

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    default: 'asc',
    description: 'Sort by category_name: asc = A–Z, desc = Z–A',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sort?: 'asc' | 'desc';

  @ApiPropertyOptional({
    example: '1,3,5',
    description:
      'Filter by raw material ids (multi-select). Pass comma-separated values; matches categories containing any selected raw material.',
  })
  @IsOptional()
  @IsString()
  raw_material?: string;
}
