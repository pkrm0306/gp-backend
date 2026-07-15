import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { IsFromDateNotLaterThanToDate } from '../../common/validators/date-range.validator';
import { GrievanceStatus } from '../schemas/grievance.schema';

export class AdminListGrievancesQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description:
      'Case-insensitive search on grievanceNo, subject, category, description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: GrievanceStatus })
  @IsOptional()
  @IsEnum(GrievanceStatus)
  status?: GrievanceStatus;

  @ApiPropertyOptional({
    description: 'Exact category match (e.g. Personal Data)',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Filter createdAt from (inclusive). ISO date string.',
  })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({
    description: 'Filter createdAt to (inclusive). ISO date string.',
  })
  @IsOptional()
  @IsDateString()
  @IsFromDateNotLaterThanToDate()
  to?: string;
}
