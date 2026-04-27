import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListSectorsQueryDto {
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
    description: 'Case-insensitive partial match on name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: [0, 1], description: '1 active, 0 inactive' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsEnum([0, 1])
  status?: 0 | 1;

  @ApiPropertyOptional({ enum: ['id', 'name'], default: 'id' })
  @IsOptional()
  @IsEnum(['id', 'name'])
  sortBy?: 'id' | 'name' = 'id';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'asc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'asc';
}
