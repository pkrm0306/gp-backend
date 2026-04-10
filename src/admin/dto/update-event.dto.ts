import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

function emptyToUndefined(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  const s = String(value).trim();
  return s === '' ? undefined : s;
}

export class UpdateEventDto {
  @ApiPropertyOptional({ example: 'Green Summit 2026' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => emptyToUndefined(value))
  @Length(2, 120)
  eventName?: string;

  @ApiPropertyOptional({
    example: '2026-04-08',
    description: 'Event date (ISO date string or ISO datetime).',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => emptyToUndefined(value))
  eventDate?: string;

  @ApiPropertyOptional({ example: '10:00 AM' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => emptyToUndefined(value))
  eventStartTime?: string;

  @ApiPropertyOptional({ example: '05:00 PM' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => emptyToUndefined(value))
  eventEndTime?: string;

  @ApiPropertyOptional({ example: 'Chennai' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => emptyToUndefined(value))
  eventLocation?: string;

  @ApiPropertyOptional({ example: '<p>Eco-labelled products summit</p>' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => emptyToUndefined(value))
  eventDescription?: string;

  @ApiPropertyOptional({ example: 'Priya' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => emptyToUndefined(value))
  contactPersonName?: string;

  @ApiPropertyOptional({ example: 'Manager' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => emptyToUndefined(value))
  contactPersonDesignation?: string;

  @ApiPropertyOptional({ example: 'priya@example.com' })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => {
    const s = emptyToUndefined(value);
    return s ? s.toLowerCase() : undefined;
  })
  contactPersonEmail?: string;

  @ApiPropertyOptional({ example: '9876543210' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => emptyToUndefined(value))
  contactPersonPhone?: string;

  @ApiPropertyOptional({
    example:
      'https://cam.mycii.in/OR/OnlineRegistrationLogin.html?EventId=E000069218',
    description: 'External registration link for the event',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => emptyToUndefined(value))
  registrationLink?: string;

  @ApiPropertyOptional({
    example:
      'https://www.linkedin.com/posts/cii-greenpro-ecolabelling_greenpro-summit-2025-brochure-03062025-activity-7335663123154014208-2ScV',
    description: 'Brochure link for the event',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => emptyToUndefined(value))
  brochureLink?: string;
}

