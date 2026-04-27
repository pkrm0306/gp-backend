import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class EditEventDto {
  @ApiProperty({
    description: 'Event identifier (MongoDB _id OR numeric eventId)',
    examples: ['661f4b9f9c2a1b2c3d4e5f60', '12'],
  })
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  id: string;

  @ApiPropertyOptional({ example: 'Green Summit 2026' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    const s = String(value).trim();
    return s === '' ? undefined : s;
  })
  @Length(2, 120)
  eventName?: string;

  @ApiPropertyOptional({
    example: '2026-04-08',
    description: 'Event date (ISO date string or ISO datetime).',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    const s = String(value).trim();
    return s === '' ? undefined : s;
  })
  eventDate?: string;

  @ApiPropertyOptional({ example: '10:00 AM' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    const s = String(value).trim();
    return s === '' ? undefined : s;
  })
  eventStartTime?: string;

  @ApiPropertyOptional({ example: '05:00 PM' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    const s = String(value).trim();
    return s === '' ? undefined : s;
  })
  eventEndTime?: string;

  @ApiPropertyOptional({ example: 'Chennai' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    const s = String(value).trim();
    return s === '' ? undefined : s;
  })
  eventLocation?: string;

  @ApiPropertyOptional({ example: '<p>Eco-labelled products summit</p>' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    const s = String(value).trim();
    return s === '' ? undefined : s;
  })
  eventDescription?: string;

  @ApiPropertyOptional({ example: 'Priya' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    const s = String(value).trim();
    return s === '' ? undefined : s;
  })
  contactPersonName?: string;

  @ApiPropertyOptional({ example: 'Manager' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    const s = String(value).trim();
    return s === '' ? undefined : s;
  })
  contactPersonDesignation?: string;

  @ApiPropertyOptional({ example: 'priya@example.com' })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    const s = String(value).trim().toLowerCase();
    return s === '' ? undefined : s;
  })
  contactPersonEmail?: string;

  @ApiPropertyOptional({ example: '9876543210' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    const s = String(value).trim();
    return s === '' ? undefined : s;
  })
  contactPersonPhone?: string;
}
