import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  Allow,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { CategoryIdFromForm } from './category-id-from-form.transform';

export class UpdateStandardMultipartDto {
  @ApiPropertyOptional({
    description:
      'Legacy primary category when updating categories (one-element set if no arrays). Omit all category fields to leave categories unchanged.',
  })
  @CategoryIdFromForm()
  @IsOptional()
  @IsInt({ message: 'category_id must be an integer' })
  @Min(1, { message: 'category_id must be a positive integer' })
  category_id?: number;

  @ApiPropertyOptional({
    description:
      'Repeated multipart or JSON string array of numeric category ids; replaces the full set when any category field is sent.',
  })
  @Allow()
  @IsOptional()
  category_ids?: unknown;

  @ApiPropertyOptional({ description: 'JSON string array of numeric category ids.' })
  @IsOptional()
  @IsString()
  categoryIds?: string;

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
