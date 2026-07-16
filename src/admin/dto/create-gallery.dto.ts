import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { GALLERY_TYPES } from '../../gallery/schemas/gallery.schema';

export class CreateGalleryDto {
  @ApiProperty({ example: 'Green Summit 2026' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  @Length(2, 120)
  eventName: string;

  @ApiProperty({
    example: '2026-04-08',
    description: 'Gallery date (ISO YYYY-MM-DD or DD-MM-YYYY).',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  eventDate: string;

  @ApiProperty({
    example: 'Training & Workshops',
    enum: GALLERY_TYPES,
    description:
      'Gallery tab/type for add form dropdown. Only Training & Workshops, Site Visits, Recognition.',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  @IsIn([...GALLERY_TYPES], {
    message:
      'galleryType must be one of: Training & Workshops, Site Visits, Recognition',
  })
  galleryType: (typeof GALLERY_TYPES)[number];

  @ApiPropertyOptional({ example: '<p>Gallery description</p>' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim(),
  )
  eventDescription?: string;
}
