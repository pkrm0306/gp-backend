import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import {
  EVENT_FORMATS,
  EventFormat,
} from '../../events/schemas/event.schema';
import { normalizeEventFormatInput } from '../../events/utils/event-detail-sections.util';

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
    description: 'Event start date (ISO YYYY-MM-DD or DD-MM-YYYY).',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => emptyToUndefined(value))
  eventStartDate?: string;

  @ApiPropertyOptional({
    example: '2026-04-10',
    description: 'Event end date (ISO YYYY-MM-DD or DD-MM-YYYY).',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => emptyToUndefined(value))
  eventEndDate?: string;

  @ApiPropertyOptional({
    example: '2026-04-08',
    description: 'Legacy alias of eventStartDate.',
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

  @ApiPropertyOptional({
    enum: EVENT_FORMATS,
    isArray: true,
    example: ['inperson', 'online'],
    description:
      'Event format checkbox multiselect: inperson and/or online. Send as JSON array, repeated form fields, or comma-separated.',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeEventFormatInput(value))
  @IsArray()
  @ArrayUnique()
  @IsIn([...EVENT_FORMATS], { each: true })
  format?: EventFormat[];

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
}
