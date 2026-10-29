import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { EVENT_REGISTRATION_STATUSES } from '../../events/schemas/event-registration.schema';

export class UpdateEventRegistrationDto {
  @ApiPropertyOptional({
    enum: EVENT_REGISTRATION_STATUSES,
    example: 'confirmed',
  })
  @IsOptional()
  @IsString()
  @IsIn([...EVENT_REGISTRATION_STATUSES])
  status?: (typeof EVENT_REGISTRATION_STATUSES)[number];

  @ApiPropertyOptional({
    example: 'Confirmed seat for morning session',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim(),
  )
  adminNotes?: string;
}
