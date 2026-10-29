import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  Equals,
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import {
  EVENT_ATTENDANCE_MODES,
  EVENT_PARTICIPANT_ROLES,
} from '../../events/schemas/event-registration.schema';

function toOptionalBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  const normalized = String(value).trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  return undefined;
}

function toStringArray(value: unknown): string[] | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (Array.isArray(value)) {
    return value.map((v) => String(v ?? '').trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((v) => String(v ?? '').trim()).filter(Boolean);
      }
    } catch {
      // comma-separated fallback
    }
    return trimmed
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return undefined;
}

export class EventRegistrationSubmitDto {
  @ApiProperty({ example: 'greenpro-summit-2026' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @Transform(({ value }) => String(value ?? '').trim())
  eventSlug: string;

  @ApiProperty({ example: 'GreenPro Summit 2026' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  @Transform(({ value }) => String(value ?? '').trim())
  eventTitle: string;

  @ApiPropertyOptional({ example: '15 May 2026' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => String(value ?? '').trim())
  eventDate?: string;

  @ApiPropertyOptional({ example: '09:00 AM – 05:00 PM' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => String(value ?? '').trim())
  eventTime?: string;

  @ApiPropertyOptional({ example: 'India Habitat Centre, New Delhi' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  @Transform(({ value }) => String(value ?? '').trim())
  eventLocation?: string;

  @ApiProperty({ example: 'Priya Sharma' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @Transform(({ value }) => String(value ?? '').trim())
  fullName: string;

  @ApiProperty({ example: 'priya@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim().toLowerCase())
  email: string;

  @ApiProperty({
    example: '+91 98765 43210',
    description: 'Phone in format "+91 XXXXX XXXXX"',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+91\s\d{5}\s\d{5}$/, {
    message: 'phone must match format "+91 XXXXX XXXXX"',
  })
  @Transform(({ value }) => String(value ?? '').trim())
  phone: string;

  @ApiProperty({ example: 'Bengaluru' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  @Transform(({ value }) => String(value ?? '').trim())
  city: string;

  @ApiProperty({ example: 'Acme Building Materials' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @Transform(({ value }) => String(value ?? '').trim())
  organisation: string;

  @ApiPropertyOptional({ example: 'Sustainability Lead' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Transform(({ value }) => String(value ?? '').trim())
  designation?: string;

  @ApiProperty({ enum: EVENT_ATTENDANCE_MODES, example: 'in-person' })
  @IsString()
  @IsIn([...EVENT_ATTENDANCE_MODES])
  attendanceMode: (typeof EVENT_ATTENDANCE_MODES)[number];

  @ApiProperty({
    enum: EVENT_PARTICIPANT_ROLES,
    example: 'Manufacturer',
  })
  @IsString()
  @IsIn([...EVENT_PARTICIPANT_ROLES])
  participantRole: (typeof EVENT_PARTICIPANT_ROLES)[number];

  @ApiPropertyOptional({
    type: [String],
    example: ['Low carbon materials', 'Green public procurement'],
  })
  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(200, { each: true })
  sessionsOfInterest?: string[];

  @ApiPropertyOptional({
    example: 'Wheelchair access preferred',
    maxLength: 300,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  @Transform(({ value }) => String(value ?? '').trim())
  accessibilityOrDietaryNotes?: string;

  @ApiProperty({
    example: true,
    description: 'Must be true to submit registration',
  })
  @Transform(({ value }) => toOptionalBoolean(value))
  @IsBoolean()
  @Equals(true, { message: 'consent must be true' })
  consent: boolean;

  @ApiPropertyOptional({ example: '/event/greenpro-summit-2026' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => String(value ?? '').trim())
  sourcePath?: string;

  @ApiPropertyOptional({
    description: 'Google reCAPTCHA v2 response token from the website widget.',
    example: '03AFcWeA...',
  })
  @IsOptional()
  @IsString()
  recaptchaToken?: string;

  @ApiPropertyOptional({
    description: 'Legacy alias of `recaptchaToken`.',
  })
  @IsOptional()
  @IsString()
  captchaToken?: string;
}
