import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

/** New auto format or legacy admin-entered ids (3–5 letter prefix). */
const GP_INTERNAL_ID_PATTERN =
  /^(GPSC-(?:[1-9]\d{3}|\d{3})|[A-Z]{3,5}-\d{3})$/i;

export class UpdateManufacturerDto {
  @ApiProperty({ description: 'Manufacturer / company display name' })
  @IsString()
  @IsNotEmpty()
  manufacturerName: string;

  @ApiPropertyOptional({
    description:
      'Ignored for **unverified** manufacturers (server-generated). Optional for verified updates (legacy or GPSC-### format).',
    example: 'GPSC-000',
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
      'gpInternalId must match GPSC-### (000–999) or GPSC-#### (1000–9999), or legacy ABC-### / ABCDE-###',
  })
  gpInternalId?: string;

  @ApiPropertyOptional({
    description:
      'Ignored for **unverified** manufacturers (server-generated 3-letter code from the company name). Optional for verified updates. New values should be 3 letters; 2 letters still accepted for legacy rows.',
    example: 'MTL',
  })
  @Transform(({ value }) =>
    value === '' || value === null || value === undefined
      ? undefined
      : String(value).trim(),
  )
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z]{2,3}$/, {
    message:
      'manufacturerInitial must be 2 or 3 letters when provided (3 preferred for new manufacturers)',
  })
  manufacturerInitial?: string;
}
