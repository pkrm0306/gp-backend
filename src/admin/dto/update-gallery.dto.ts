import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, Length } from 'class-validator';
import { GALLERY_TYPES } from '../../gallery/schemas/gallery.schema';

function emptyToUndefined(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  const s = String(value).trim();
  return s === '' ? undefined : s;
}

export class UpdateGalleryDto {
  @ApiPropertyOptional({ example: 'Green Summit 2026' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => emptyToUndefined(value))
  @Length(2, 120)
  eventName?: string;

  @ApiPropertyOptional({
    example: '2026-04-08',
    description: 'Gallery date (ISO YYYY-MM-DD or DD-MM-YYYY).',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => emptyToUndefined(value))
  eventDate?: string;

  @ApiPropertyOptional({
    example: 'Site Visits',
    enum: GALLERY_TYPES,
    description:
      'Gallery tab/type for edit form dropdown. Only Training & Workshops, Site Visits, Recognition.',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsIn([...GALLERY_TYPES], {
    message:
      'galleryType must be one of: Training & Workshops, Site Visits, Recognition',
  })
  galleryType?: (typeof GALLERY_TYPES)[number];

  @ApiPropertyOptional({ example: '<p>Gallery description</p>' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => emptyToUndefined(value))
  eventDescription?: string;
}
