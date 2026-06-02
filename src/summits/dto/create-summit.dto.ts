import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { SUMMIT_STATUSES } from '../constants/summit.constants';
import { normalizeSummitStatus } from '../utils/summit-status.util';

export class CreateSummitDto {
  @ApiProperty({
    example: '2026',
    description: 'Summit year from dropdown (4-digit year string)',
  })
  @IsString()
  @Matches(/^(19|20)\d{2}$/, { message: 'year must be a valid 4-digit year' })
  year: string;

  @ApiProperty({ example: 'GreenPro Summit 2026' })
  @IsString()
  @MinLength(2)
  title: string;

  @ApiPropertyOptional({ example: 'greenpro-summit-2026' })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase letters, numbers, and hyphens only',
  })
  slug?: string;

  @ApiPropertyOptional({ example: '2026-03-15' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be YYYY-MM-DD' })
  date?: string;

  @ApiPropertyOptional({ example: 'New Delhi, India' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ enum: SUMMIT_STATUSES, default: 'inactive' })
  @IsOptional()
  @Transform(({ value }) => normalizeSummitStatus(value))
  @IsIn([...SUMMIT_STATUSES])
  status?: 'active' | 'inactive';
}
