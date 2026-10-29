import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  EVENT_ATTENDANCE_MODES,
  EVENT_PARTICIPANT_ROLES,
  EVENT_REGISTRATION_STATUSES,
} from '../../events/schemas/event-registration.schema';

export class ListEventRegistrationsQueryDto {
  @ApiPropertyOptional({
    example: 'greenpro',
    description: 'Search eventSlug or eventTitle (case-insensitive)',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim(),
  )
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'greenpro-summit-2026' })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim(),
  )
  @IsString()
  eventSlug?: string;

  @ApiPropertyOptional({ enum: EVENT_ATTENDANCE_MODES })
  @IsOptional()
  @IsString()
  @IsIn([...EVENT_ATTENDANCE_MODES])
  attendanceMode?: (typeof EVENT_ATTENDANCE_MODES)[number];

  @ApiPropertyOptional({ enum: EVENT_PARTICIPANT_ROLES })
  @IsOptional()
  @IsString()
  @IsIn([...EVENT_PARTICIPANT_ROLES])
  participantRole?: (typeof EVENT_PARTICIPANT_ROLES)[number];

  @ApiPropertyOptional({ enum: EVENT_REGISTRATION_STATUSES })
  @IsOptional()
  @IsString()
  @IsIn([...EVENT_REGISTRATION_STATUSES])
  status?: (typeof EVENT_REGISTRATION_STATUSES)[number];

  @ApiPropertyOptional({
    example: '2026-01-01',
    description: 'Filter createdAt >= from (YYYY-MM-DD or ISO date)',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim(),
  )
  @IsString()
  from?: string;

  @ApiPropertyOptional({
    example: '2026-12-31',
    description: 'Filter createdAt <= to (YYYY-MM-DD or ISO date)',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim(),
  )
  @IsString()
  to?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Transform(({ value }) => {
    const n = Number.parseInt(String(value), 10);
    return Number.isFinite(n) ? n : undefined;
  })
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20 })
  @IsOptional()
  @Transform(({ value }) => {
    const n = Number.parseInt(String(value), 10);
    return Number.isFinite(n) ? n : undefined;
  })
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
