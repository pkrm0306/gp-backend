import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Manufacturer inquiry POST body — visitor fields from the public form.
 * reCAPTCHA is **not required** for this endpoint (optional widget on the UI only).
 * Manufacturer can be provided via body/query `manufacturerId`.
 */
export class ManufacturerInquiryDto {
  @ApiProperty({
    required: false,
    example: '680c9ccbe5fce6d879ec4aa1',
    description:
      'Manufacturer id (Mongo ObjectId). Preferred in body for API clients.',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => String(value ?? '').trim())
  manufacturerId?: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  @Length(2, 80)
  name: string;

  @ApiProperty({ example: 'you@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) =>
    String(value ?? '')
      .trim()
      .toLowerCase(),
  )
  email: string;

  @ApiProperty({
    example: '+91',
    description:
      'Country dial code from the phone selector (e.g. `+91`, `91`). Required when `phoneNumber` is local digits without a leading `+`.',
  })
  @ValidateIf((o) => {
    const p = String(o.phoneNumber ?? o.phone ?? o.contact ?? '').trim();
    return p.length > 0 && !p.startsWith('+');
  })
  @IsString()
  @IsNotEmpty({ message: 'countryCode is required for local phone numbers' })
  @Transform(({ value, obj }) =>
    String(value ?? obj?.country_code ?? obj?.dialCode ?? '').trim(),
  )
  @Matches(/^\+?[0-9]{1,4}$/, {
    message: 'countryCode must be a valid dial code (1–4 digits, optional +)',
  })
  countryCode?: string;

  @Allow()
  country_code?: string;

  @Allow()
  dialCode?: string;

  @Allow()
  dial_code?: string;

  @ApiProperty({
    example: '9876543210',
    description:
      'Local phone number (without country code) or full international number starting with `+`. Aliases: `phone`, `contact`.',
  })
  @ValidateIf(
    (o) =>
      o.phoneNumber !== undefined ||
      (o.phone === undefined && o.contact === undefined),
  )
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  @Length(6, 15)
  @Matches(/^[0-9+\-\s()]+$/, {
    message: 'phoneNumber contains invalid characters',
  })
  phoneNumber?: string;

  @ApiProperty({
    required: false,
    example: '9876543210',
    description: 'Alias for `phoneNumber`.',
  })
  @ValidateIf(
    (o) =>
      o.phone !== undefined ||
      (o.phoneNumber === undefined && o.contact === undefined),
  )
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  @Length(6, 15)
  @Matches(/^[0-9+\-\s()]+$/, {
    message: 'phone contains invalid characters',
  })
  phone?: string;

  @ApiProperty({
    required: false,
    example: '9876543210',
    description: 'Deprecated alias for `phoneNumber`.',
  })
  @ValidateIf(
    (o) =>
      o.contact !== undefined ||
      (o.phoneNumber === undefined && o.phone === undefined),
  )
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  @Length(6, 15)
  @Matches(/^[0-9+\-\s()]+$/, {
    message: 'contact contains invalid characters',
  })
  contact?: string;

  @ApiProperty({
    required: false,
    example: 'I would like more details about your products.',
    description:
      'Optional visitor message. The public manufacturer inquiry form does not collect this field.',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    const trimmed = String(value ?? '').trim();
    return trimmed === '' ? undefined : trimmed;
  })
  @ValidateIf((_, value) => value !== undefined)
  @Length(5, 2000)
  message?: string;

  @ApiProperty({
    required: false,
    example: 'Inquiry regarding your catalog',
    description: 'Optional custom subject line for customer email.',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => String(value ?? '').trim())
  @Length(3, 200)
  subject?: string;

  /** Ignored by API — allowed so frontends may send widget tokens without failing validation. */
  @Allow()
  captchaToken?: string;

  @Allow()
  recaptchaToken?: string;

  @Allow()
  gRecaptchaResponse?: string;

  @Allow()
  'g-recaptcha-response'?: string;

  @ApiProperty({ required: false, description: 'Mongo product id from product detail page.' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => String(value ?? '').trim())
  productId?: string;

  @ApiProperty({ required: false, description: 'Category id from product detail page.' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => String(value ?? '').trim())
  categoryId?: string;

  @ApiProperty({ required: false, description: 'Product URN number.' })
  @IsOptional()
  @IsString()
  @Transform(({ value, obj }) =>
    String(value ?? obj?.urnNo ?? obj?.urn_no ?? obj?.urnNumber ?? '').trim(),
  )
  urnNumber?: string;

  @Allow()
  urnNo?: string;

  @Allow()
  urn_no?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => String(value ?? '').trim())
  designation?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value, obj }) =>
    String(value ?? obj?.organization ?? obj?.org ?? '').trim(),
  )
  organisation?: string;

  @Allow()
  organization?: string;

  @Allow()
  org?: string;
}
