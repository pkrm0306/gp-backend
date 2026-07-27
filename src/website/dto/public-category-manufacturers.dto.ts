import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';

export class PublicCategoryManufacturersDto {
  @ApiPropertyOptional({
    description:
      'Category MongoDB `_id` (24-char hex) or numeric `category_id` from GET /categories. Ignored when `categorySlug` is provided.',
    example: '6996ddcf14999ba875c7d691',
  })
  @ValidateIf(
    (o: PublicCategoryManufacturersDto) =>
      !String(o.categorySlug ?? '').trim(),
  )
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?:[0-9a-fA-F]{24}|\d+)$/, {
    message: 'categoryId must be a mongodb id or numeric category_id',
  })
  categoryId?: string;

  @ApiPropertyOptional({
    description:
      'Unique category slug (preferred for SEO URLs). Takes precedence over `categoryId`.',
    example: 'cement',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'categorySlug must be lowercase kebab-case',
  })
  categorySlug?: string;
}
