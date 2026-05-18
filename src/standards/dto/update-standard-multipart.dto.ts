import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { SectorsArrayFromForm } from './sectors-array-from-form.transform';
import { SectorIdFromForm } from './sector-id-from-form.transform';

export class UpdateStandardMultipartDto {
  @ApiPropertyOptional({
    description:
      'When sent, replaces linked categories with **all** categories in **each** selected sector (multiselect). Omit all sector fields to leave categories unchanged.',
    type: [Number],
    example: [1, 3],
  })
  @SectorsArrayFromForm()
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  sectors?: number[];

  @ApiPropertyOptional({
    description:
      'Legacy single sector id; when sent alone, same as one **sectors** entry.',
    example: 2,
  })
  @SectorIdFromForm()
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'sector must be an integer' })
  @Min(1, { message: 'sector must be a positive integer' })
  sector?: number;

  @Allow()
  @IsOptional()
  'sectors[]'?: unknown;

  @Allow()
  @IsOptional()
  sector_ids?: unknown;

  @Allow()
  @IsOptional()
  'sector_ids[]'?: unknown;

  @Allow()
  @IsOptional()
  sectorIds?: unknown;

  @Allow()
  @IsOptional()
  'sectorIds[]'?: unknown;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  resource_standard_type?: string;

  @ApiPropertyOptional({ enum: [0, 1] })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsEnum([0, 1])
  status?: 0 | 1;
}
