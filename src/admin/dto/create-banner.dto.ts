import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateBannerDto {
  @ApiPropertyOptional({
    example: '/uploads/banners/banner-123.jpg',
    description:
      'Optional legacy field. When uploading a file, send it as multipart field `image` (binary) instead of `imageUrl`.',
  })
  @IsOptional()
  // We treat empty string as "not provided" so file upload works without sending imageUrl.
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    const v = String(value).trim();
    return v === '' ? undefined : v;
  })
  @Matches(/^(https?:\/\/.+|\/uploads\/.+)$/i, {
    message: 'imageUrl must be a full http(s) URL or a /uploads/... path',
  })
  imageUrl?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/promo',
    description: 'Link opened when the banner is clicked (optional)',
  })
  @IsString()
  @IsOptional()
  @Matches(/^https?:\/\/.+/i, {
    message: 'targetUrl must be a full http(s) URL',
  })
  targetUrl?: string;

  @ApiProperty({ example: 'Summer sale', description: 'Banner heading' })
  @IsString()
  @IsNotEmpty()
  heading: string;

  @ApiProperty({
    example: 'Up to 50% off selected items.',
    description: 'Banner description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
