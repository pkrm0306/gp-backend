import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

/** New auto format or legacy admin-entered ids (3–5 letter prefix). */
const GP_INTERNAL_ID_PATTERN =
  /^(GP[A-Z]{2}-(?:[1-9]\d{3}|\d{3})|[A-Z]{3,5}-\d{3})$/i;

export class UpdateManufacturerDto {
  @ApiProperty({ description: 'Manufacturer / company display name' })
  @IsString()
  @IsNotEmpty()
  manufacturerName: string;

  @ApiPropertyOptional({
    description:
      'Ignored for **unverified** manufacturers (server-generated). Optional for verified updates (legacy or GP<INI>-### format).',
    example: 'GPGP-001',
  })
  @Transform(({ value }) =>
    value === '' || value === null || value === undefined
      ? undefined
      : String(value).trim(),
  )
  @IsOptional()
  @IsString()
  @Matches(GP_INTERNAL_ID_PATTERN, {
    message:
      'gpInternalId must match GP<INITIAL>-### (001–999) or #### (1000–9999), or legacy ABC-### / ABCDE-###',
  })
  gpInternalId?: string;

  @ApiPropertyOptional({
    description:
      'Ignored for **unverified** manufacturers (server-generated). Optional for verified updates.',
    example: 'GP',
  })
  @Transform(({ value }) =>
    value === '' || value === null || value === undefined
      ? undefined
      : String(value).trim(),
  )
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z]{2}$/, {
    message: 'manufacturerInitial must be exactly 2 letters when provided',
  })
  manufacturerInitial?: string;
}
