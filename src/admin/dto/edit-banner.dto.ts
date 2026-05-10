import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  IsReadableNotEmpty,
  MaxReadableLength,
} from '../../common/validators/readable-text.validator';

export class EditBannerDto {
  @ApiPropertyOptional({
    description: 'Banner image URL/path. Optional if file is uploaded.',
    example: '/uploads/banners/banner-123.jpg',
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

  @ApiPropertyOptional({
    example: 'Summer sale',
    description: 'Title of your banner',
  })
  @IsOptional()
  @IsString()
  @IsReadableNotEmpty()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim(),
  )
  @MaxReadableLength(120)
  title?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Display sequence number for this banner',
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
  sequenceNumber?: number;

  @ApiPropertyOptional({
    example: 'active',
    description: 'Banner status',
    enum: ['active', 'inactive', '1', '0'],
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    example: 'Up to 50% off selected items.',
    description: 'Banner description (max 1000 readable characters)',
  })
  @IsOptional()
  @IsString()
  @IsReadableNotEmpty()
  @MaxReadableLength(1000)
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim(),
  )
  description?: string;
}
