import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import {
  SEO_META_DESCRIPTION_MAX,
  SEO_META_TITLE_MAX,
} from '../../common/constants/seo-meta.constants';

/** All fields optional — send at least one field and/or a new `image` file */
export class UpdateCategoryMultipartDto {
  @ApiPropertyOptional({ example: 'Wooden Products' })
  @IsOptional()
  @IsString()
  category_name?: string;

  @ApiPropertyOptional({ example: '1,3,2' })
  @IsOptional()
  @IsString()
  category_raw_material_forms?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  category_status?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  sector?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(SEO_META_TITLE_MAX)
  meta_title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(SEO_META_DESCRIPTION_MAX)
  meta_description?: string;

  @ApiPropertyOptional({ description: 'Comma-separated keywords' })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value),
  )
  @IsString()
  meta_keywords?: string;
}
