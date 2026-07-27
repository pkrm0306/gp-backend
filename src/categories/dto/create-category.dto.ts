import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import {
  SEO_META_DESCRIPTION_MAX,
  SEO_META_TITLE_MAX,
} from '../../common/constants/seo-meta.constants';

/** category_id is assigned only by the server — do not send it in the body */
export class CreateCategoryDto {
  @ApiProperty({ example: 'Architectural Products' })
  @IsString()
  @IsNotEmpty()
  category_name: string;

  @ApiPropertyOptional({ example: '1577959974Architectural_Products.jpg' })
  @IsOptional()
  @IsString()
  category_image?: string;

  @ApiPropertyOptional({
    example: '1,3,2',
    description: 'Comma-separated raw material form ids',
  })
  @IsOptional()
  @IsString()
  category_raw_material_forms?: string;

  @ApiPropertyOptional({ example: 1, description: '1 = active (default)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  category_status?: number;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Sector id (defaults to 1 if omitted)',
  })
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

  @ApiPropertyOptional({ description: 'Comma-separated or already-parsed keywords' })
  @IsOptional()
  meta_keywords?: string | string[];
}
