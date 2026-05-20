import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

/** GP + 2-letter initial: `###` (001–999) or `####` (1000–9999). Legacy non-GP ids: three digits only. */
const GP_INTERNAL_ID_PATTERN =
  /^(GP[A-Z]{2}-(?:[1-9]\d{3}|\d{3})|[A-Z]{3,5}-\d{3})$/i;

export class UpdateManufacturerDto {
  @ApiProperty({ description: 'Manufacturer name' })
  @Transform(({ value, obj }) => value ?? obj?.manufacturer_name)
  @IsString()
  @IsNotEmpty({ message: 'manufacturer_name is required' })
  manufacturerName: string;

  @ApiPropertyOptional({
    description:
      'Ignored when manufacturer is **unverified** (auto-generated). Optional when verified.',
    example: 'GPGP-001',
  })
  @Transform(({ value, obj }) => {
    const raw = value ?? obj?.gp_internal_id;
    if (raw === '' || raw === null || raw === undefined) return undefined;
    return typeof raw === 'string' ? raw.trim() : raw;
  })
  @IsOptional()
  @IsString()
  @Matches(GP_INTERNAL_ID_PATTERN, {
    message:
      'gp_internal_id must match GP<INITIAL>-### (001–999) or GP<INITIAL>-#### (1000–9999), or legacy ABC-###',
  })
  gpInternalId?: string;

  @ApiPropertyOptional()
  @Transform(({ value, obj }) => {
    const raw = value ?? obj?.manufacturer_initial;
    if (raw === '' || raw === null || raw === undefined) return undefined;
    return typeof raw === 'string' ? raw.trim() : raw;
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z]{2}$/, {
    message: 'manufacturer_initial must be exactly 2 letters when provided',
  })
  manufacturerInitial?: string;

  @ApiProperty({
    required: false,
    description: 'Primary contact / vendor display name (not company name).',
  })
  @Transform(({ value, obj }) => {
    const raw =
      value ?? obj?.vendorName ?? obj?.vendor_name ?? obj?.contactName;
    if (raw === '' || raw === null || raw === undefined) return undefined;
    return typeof raw === 'string' ? raw.trim() : raw;
  })
  @IsOptional()
  @IsString()
  vendor_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail({}, { message: 'vendor_email must be a valid email' })
  vendor_email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  vendor_phone?: string;
}
