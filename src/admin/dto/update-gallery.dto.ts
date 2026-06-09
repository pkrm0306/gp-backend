import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, Length } from 'class-validator';

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

  @ApiPropertyOptional({ example: '<p>Gallery description</p>' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => emptyToUndefined(value))
  eventDescription?: string;
}
