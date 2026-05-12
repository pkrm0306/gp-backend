import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  Allow,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CategoryIdFromForm } from './category-id-from-form.transform';

export class CreateStandardMultipartDto {
  @ApiPropertyOptional({
    description:
      'Legacy single category (treated as a one-element set). Prefer **category_ids** / **categoryIds** for multiple.',
  })
  @CategoryIdFromForm()
  @IsOptional()
  @IsInt({ message: 'category_id must be an integer' })
  @Min(1, { message: 'category_id must be a positive integer' })
  category_id?: number;

  @ApiPropertyOptional({
    description:
      'Repeated multipart fields or JSON array string of numeric category ids (GET /categories `category_id`).',
  })
  @Allow()
  @IsOptional()
  category_ids?: unknown;

  @ApiPropertyOptional({
    description: 'JSON string array of numeric category ids (admin UI).',
  })
  @IsOptional()
  @IsString()
  categoryIds?: string;

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

  @ApiPropertyOptional({ enum: [0, 1], default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsEnum([0, 1])
  status?: 0 | 1;
}
