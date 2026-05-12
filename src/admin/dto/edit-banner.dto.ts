import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class EditBannerDto {
  @ApiPropertyOptional({
    description:
      'Banner image URL/path. Optional if an image file is uploaded.',
    example: '/uploads/banners/banner-123.jpg',
  })
  @IsOptional()
  // NOTE: On edit/view the image already exists in DB; frontend may send ''.
  // So we intentionally avoid strict validation here and treat empty as "not provided".
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    const v = String(value).trim();
    return v === '' ? undefined : v;
  })
  imageUrl?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/promo',
    description: 'Link opened when the banner is clicked (optional)',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim(),
  )
  @Matches(/^https?:\/\/.+/i, {
    message: 'targetUrl must be a full http(s) URL',
  })
  targetUrl?: string;

  @ApiProperty({ example: 'Summer sale', description: 'Banner heading' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  @Length(2, 120)
  heading: string;

  @ApiProperty({
    example: 'Up to 50% off selected items.',
    description: 'Banner description',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  description: string;
}
