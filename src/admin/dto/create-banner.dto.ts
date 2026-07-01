import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import {
  IsReadableNotEmpty,
  MaxReadableLength,
} from '../../common/validators/readable-text.validator';

export class CreateBannerDto {
  @ApiPropertyOptional({
    example: '/uploads/banners/banner-123.jpg',
    description:
      'Banner image URL/path. Optional when uploading multipart file `image`.',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    const v = String(value).trim();
    return v === '' ? undefined : v;
  })
  @Matches(/^(https?:\/\/.+|\/uploads\/.+)$/i, {
    message: 'imageUrl must be a full http(s) URL or a /uploads/... path',
  })
  imageUrl?: string;

  @ApiProperty({ example: 'Summer sale', description: 'Title of your banner' })
  @IsString()
  @IsReadableNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  title: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Display sequence number for this banner (optional)',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    const raw = String(value).trim();
    if (!raw) return undefined;
    return Number(raw);
  })
  @IsInt()
  @Min(1)
  @Max(9999)
  sequenceNumber: number;

  @ApiPropertyOptional({
    example: 'active',
    description: 'Initial banner status',
    enum: ['active', 'inactive', '1', '0'],
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description:
      'How the image was supplied (informational). On create, the server sets **binary_upload** when multipart `image` is sent, otherwise **manual_url** from `imageUrl`.',
    enum: ['binary_upload', 'manual_url'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['binary_upload', 'manual_url'])
  imageSource?: 'binary_upload' | 'manual_url';

  @ApiProperty({
    example: 'Up to 50% off selected items.',
    description: 'Banner description (max 1000 readable characters)',
  })
  @IsString()
  @IsReadableNotEmpty()
  @MaxReadableLength(1000)
  @Transform(({ value }) => String(value ?? '').trim())
  description: string;

  @ApiPropertyOptional({
    description:
      'Video duration in seconds measured in the admin UI before upload.',
    example: 29.5,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    const n = Number.parseFloat(String(value).trim());
    return Number.isFinite(n) ? n : undefined;
  })
  videoDurationSeconds?: number;
}
