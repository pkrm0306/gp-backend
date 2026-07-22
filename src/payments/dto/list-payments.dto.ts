import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  IsIn,
  Matches,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

function parseOptionalPaymentStatus(raw: unknown): number | undefined {
  if (raw === undefined || raw === null || raw === '') return undefined;
  const s = String(raw).trim().toLowerCase();
  if (s === 'all' || s === 'any') return undefined;
  const n = Number(raw);
  if (Number.isFinite(n) && n >= 0 && n <= 3) return Math.floor(n);
  return undefined;
}

export class ListPaymentsDto {
  @ApiProperty({
    description: 'Page number (default: 1)',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page (default: 50, max: 200)',
    example: 50,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number = 50;

  @ApiProperty({
    description:
      'Global search term (searches in urn_no, payment_reference_no)',
    example: 'URN-20260303142815',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description:
      'Filter by payment status (0=Created, 1=Pending, 2=Completed, 3=Cancelled)',
    example: 0,
    required: false,
    enum: [0, 1, 2, 3],
  })
  @IsOptional()
  @Transform(({ value }) => parseOptionalPaymentStatus(value))
  @IsInt()
  @IsIn([0, 1, 2, 3])
  status?: number;

  @ApiProperty({
    description: 'Filter by payment type',
    example: 'registration',
    required: false,
    enum: ['registration', 'certification', 'renew'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['registration', 'certification', 'renew'])
  paymentType?: string;

  @ApiProperty({
    description:
      'Sort: `asc` | `desc` (by created date), or `field:asc` | `field:desc` (e.g. `createdAt:desc`). ' +
      'Fields: createdAt, updatedAt, paymentId, quoteTotal, urnNo, paymentReferenceNo, paymentStatus, paymentType.',
    example: 'createdAt:desc',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    return String(value).trim();
  })
  @Matches(/^(asc|desc|[\w]+:(asc|desc))$/i, {
    message:
      'sort must be asc, desc, or field:asc|field:desc (e.g. createdAt:desc)',
  })
  sort?: string = 'desc';

  @ApiProperty({
    description:
      'Created-date range start (inclusive). Accepts `YYYY-MM-DD` or ISO datetime. Alias: `fromDate`.',
    example: '2026-01-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value, obj }) => {
    const raw = value ?? obj?.fromDate;
    if (raw === undefined || raw === null || raw === '') return undefined;
    return String(raw).trim();
  })
  from?: string;

  @ApiProperty({
    description:
      'Created-date range end (inclusive). Accepts `YYYY-MM-DD` or ISO datetime. Alias: `toDate`.',
    example: '2026-07-22',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value, obj }) => {
    const raw = value ?? obj?.toDate;
    if (raw === undefined || raw === null || raw === '') return undefined;
    return String(raw).trim();
  })
  to?: string;
}
