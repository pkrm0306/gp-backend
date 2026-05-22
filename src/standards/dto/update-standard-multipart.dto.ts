import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  Allow,
  IsArray,
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

  /** Legacy admin UI aliases (ignored when **sectors** / **sector_ids** are sent). */
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

  /** Ignored on multipart update. Use PATCH `.../status` to change active/inactive. */
  @Allow()
  @IsOptional()
  status?: unknown;

  /** Admin UI: remove attached PDF without uploading a replacement (handled in service). */
  @Allow()
  @IsOptional()
  remove_file?: string;

  @Allow()
  @IsOptional()
  delete_file?: string;
}
