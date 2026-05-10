import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
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
      'Omit to leave unchanged. If set, must be a valid `category_id` from GET /categories. ' +
      'Empty string is treated as omitted. Standards are always tied to a category for new data; ' +
      'this field cannot be used to clear an existing link.',
  })
  @CategoryIdFromForm()
  @IsOptional()
  @IsInt({ message: 'category_id must be an integer' })
  @Min(1, { message: 'category_id must be a positive integer' })
  category_id?: number;

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
