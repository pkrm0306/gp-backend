import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  IsDateString,
} from 'class-validator';

export class QueryAuditLogDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  action?: string;

  @ApiPropertyOptional({
    description: 'User-facing module (category, sector, product, …)',
  })
  @IsOptional()
  @IsString()
  module?: string;

  @ApiPropertyOptional({
    description:
      'User-facing action (create, update, delete, approve, reject, login)',
  })
  @IsOptional()
  @IsString()
  action_type?: string;

  @ApiPropertyOptional({
    description:
      'Filter by user id (matches actor.user_id or performed_by.user_id)',
  })
  @IsOptional()
  @IsString()
  actor_user_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  resource_type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  resource_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  urn_no?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  to?: string;
}
