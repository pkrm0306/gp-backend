import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CategoryIdFromForm } from './category-id-from-form.transform';

export class CreateStandardMultipartDto {
  @ApiProperty({
    example: 1,
    description:
      'Required. Numeric `category_id` from GET /categories (same id the admin UI uses).',
  })
  @CategoryIdFromForm()
  @IsDefined({
    message:
      'category_id is required; use a category_id returned by GET /categories',
  })
  @IsInt({ message: 'category_id must be an integer' })
  @Min(1, { message: 'category_id must be a positive integer' })
  category_id: number;

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
