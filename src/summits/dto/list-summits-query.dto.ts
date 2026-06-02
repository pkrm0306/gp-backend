import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { SUMMIT_STATUSES } from '../constants/summit.constants';
import { normalizeSummitStatus } from '../utils/summit-status.util';

export class ListSummitsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : String(value).trim()))
  search?: string;

  @ApiPropertyOptional({ enum: SUMMIT_STATUSES, description: 'Active | Inactive' })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === '' ? undefined : normalizeSummitStatus(value),
  )
  @IsIn([...SUMMIT_STATUSES])
  status?: 'active' | 'inactive';

  @ApiPropertyOptional({ example: '2026', description: 'Filter by summit year (dropdown value)' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : String(value).trim()))
  year?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, maximum: 200 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number = 20;

  @ApiPropertyOptional({
    enum: ['updated_at_desc', 'updated_at_asc', 'created_at_desc', 'date_desc'],
    default: 'updated_at_desc',
  })
  @IsOptional()
  @IsIn(['updated_at_desc', 'updated_at_asc', 'created_at_desc', 'date_desc'])
  sort?: string = 'updated_at_desc';
}
