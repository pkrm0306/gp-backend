import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { EventBrochureItemDto } from './event-brochure-item.dto';

export class CreateEventDto {
  @ApiProperty({ example: 'Green Summit 2026' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  @Length(2, 120)
  eventName: string;

  @ApiProperty({
    example: '2026-04-08',
    description: 'Event start date (ISO YYYY-MM-DD or DD-MM-YYYY).',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  eventStartDate: string;

  @ApiProperty({
    example: '2026-04-10',
    description: 'Event end date (ISO YYYY-MM-DD or DD-MM-YYYY).',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  eventEndDate: string;

  @ApiPropertyOptional({
    example: '2026-04-08',
    description: 'Legacy alias of eventStartDate.',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim(),
  )
  eventDate?: string;

  @ApiPropertyOptional({ example: '10:00 AM' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim(),
  )
  eventStartTime?: string;

  @ApiPropertyOptional({ example: '05:00 PM' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim(),
  )
  eventEndTime?: string;

  @ApiPropertyOptional({ example: 'Chennai' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim(),
  )
  eventLocation?: string;

  @ApiPropertyOptional({ example: '<p>Eco-labelled products summit</p>' })
  @IsOptional()
  @IsString()
  eventDescription?: string;

  @ApiPropertyOptional({ example: 'Priya' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim(),
  )
  contactPersonName?: string;

  @ApiPropertyOptional({ example: 'Manager' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim(),
  )
  contactPersonDesignation?: string;

  @ApiPropertyOptional({ example: 'priya@example.com' })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) =>
    value === undefined || value === null
      ? undefined
      : String(value).trim().toLowerCase(),
  )
  contactPersonEmail?: string;

  @ApiPropertyOptional({ example: '9876543210' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim(),
  )
  contactPersonPhone?: string;

  @ApiPropertyOptional({
    example:
      'https://cam.mycii.in/OR/OnlineRegistrationLogin.html?EventId=E000069218',
    description: 'External registration link for the event',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim(),
  )
  registrationLink?: string;

  @ApiPropertyOptional({
    example:
      'https://www.linkedin.com/posts/cii-greenpro-ecolabelling_greenpro-summit-2025-brochure-03062025-activity-7335663123154014208-2ScV',
    description: 'Legacy single brochure link (prefer brochures[]).',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim(),
  )
  brochureLink?: string;

  @ApiPropertyOptional({
    description:
      'Brochure cards for the event. Each item requires heading and link. ' +
      'Multipart forms may send this as a JSON string.',
    type: [EventBrochureItemDto],
    example: [
      {
        heading: 'GreenPro Summit Brochure',
        link: 'https://example.com/brochure.pdf',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventBrochureItemDto)
  brochures?: EventBrochureItemDto[];
}
