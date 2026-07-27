import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
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

/**
 * Form fields for multipart POST /addCategory (field `image` is the file, not listed here).
 */
export class CreateCategoryMultipartDto {
  @ApiProperty({ example: 'Wooden Products' })
  @IsString()
  @IsNotEmpty()
  category_name: string;

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

  @ApiPropertyOptional({ example: 1, description: 'Sector id (defaults to 1)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  sector?: number;

  @ApiProperty({ example: 'Wooden Products | CII GreenPro' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(SEO_META_TITLE_MAX)
  meta_title: string;

  @ApiProperty({ example: 'Browse certified wooden products…' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(SEO_META_DESCRIPTION_MAX)
  meta_description: string;

  @ApiPropertyOptional({
    description: 'Comma-separated keywords',
    example: 'wood, greenpro, ecolabel',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value),
  )
  @IsString()
  meta_keywords?: string;
}
