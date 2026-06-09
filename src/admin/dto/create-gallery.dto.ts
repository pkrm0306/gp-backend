import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

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

  @ApiPropertyOptional({ example: '<p>Gallery description</p>' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim(),
  )
  eventDescription?: string;
}
