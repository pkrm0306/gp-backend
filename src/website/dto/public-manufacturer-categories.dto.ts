import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';

export class PublicManufacturerCategoriesDto {
  @ApiPropertyOptional({
    description:
      'Manufacturer MongoDB `_id`. Ignored when `manufacturerSlug` is provided.',
    example: '699562589f4eabba1869abbe',
  })
  @ValidateIf(
    (o: PublicManufacturerCategoriesDto) =>
      !String(o.manufacturerSlug ?? '').trim(),
  )
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  manufacturerId?: string;

  @ApiPropertyOptional({
    description:
      'Unique manufacturer slug (preferred for SEO URLs). Takes precedence over `manufacturerId`.',
    example: 'asian-paints',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'manufacturerSlug must be lowercase kebab-case',
  })
  manufacturerSlug?: string;
}
