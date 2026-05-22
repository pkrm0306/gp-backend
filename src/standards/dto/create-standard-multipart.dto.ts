import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { SectorsArrayFromForm } from './sectors-array-from-form.transform';
import { SectorIdFromForm } from './sector-id-from-form.transform';

/**
 * Whitelist alternate multipart keys for sector multiselect (global ValidationPipe
 * uses forbidNonWhitelisted). Parsed together in StandardsService via mergeSectorIdsFromFormObject.
 */
export class CreateStandardMultipartDto {
  @ApiPropertyOptional({
    description:
      'Preferred: one or more sector ids from GET /api/sectors (multiselect). JSON array string or repeated values.',
    type: [Number],
    example: [1, 2],
  })
  @SectorsArrayFromForm()
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  sectors?: number[];

  @ApiPropertyOptional({
    description:
      'Legacy single sector id; merged with **sectors** when both are sent. Prefer **sectors** for multiselect.',
    example: 1,
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

  @Allow()
  @IsOptional()
  sector_id?: unknown;

  @Allow()
  @IsOptional()
  category_id?: unknown;

  @Allow()
  @IsOptional()
  category_ids?: unknown;

  @Allow()
  @IsOptional()
  'category_ids[]'?: unknown;

  @Allow()
  @IsOptional()
  categoryIds?: unknown;

  @Allow()
  @IsOptional()
  'categoryIds[]'?: unknown;

  @ApiProperty({ example: 'Energy Efficiency Benchmark' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Benchmark details and applicability scope.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Energy' })
  @IsString()
  @IsNotEmpty()
  resource_standard_type: string;

  /** Ignored. New standards are always created as active (`status=1`). Use PATCH `.../status` to change. */
  @Allow()
  @IsOptional()
  status?: unknown;
}
