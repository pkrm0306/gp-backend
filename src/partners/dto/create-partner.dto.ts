import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Allow,
  IsString,
  IsEmail,
  IsNotEmpty,
  IsIn,
  IsOptional,
  MinLength,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

function resolvePartnerCreateStatus(value: unknown): 0 | 1 | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value ? 1 : 0;
  const raw = String(value).trim().toLowerCase();
  if (raw === '1' || raw === 'active' || raw === 'true') return 1;
  if (raw === '0' || raw === 'inactive' || raw === 'false') return 0;
  const n = Number(raw);
  if (n === 1) return 1;
  if (n === 0) return 0;
  return undefined;
}

export class CreatePartnerDto {
  @ApiProperty({ description: 'Partner / team member name' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  name: string;

  @ApiProperty({ description: 'Email address (used as username)' })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) =>
    String(value ?? '')
      .trim()
      .toLowerCase(),
  )
  email: string;

  @ApiPropertyOptional({
    example: '+91',
    description:
      'Country dial code from the phone selector (e.g. +91). Required when mobile/phone is local digits without +.',
  })
  @ValidateIf((dto: CreatePartnerDto) => {
    const raw = String(dto.phone ?? dto.mobile ?? '').trim();
    return raw.length > 0 && !raw.startsWith('+');
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

  @ApiPropertyOptional({
    description: 'Phone number (full international or local digits with countryCode)',
  })
  @ValidateIf((dto: CreatePartnerDto) => !dto.mobile?.trim())
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Mobile number (vendor UI field; alias for phone)',
  })
  @ValidateIf((dto: CreatePartnerDto) => !dto.phone?.trim())
  @IsString()
  @IsNotEmpty()
  mobile?: string;

  @ApiProperty({ description: 'Password (min 6 characters)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Must match password' })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  /**
   * Portal access status. Defaults to **1 (active)** so contact persons / team members
   * can sign in immediately. Use **0** to create already inactive (no portal login).
   * Also accepts `active` / `inactive` and the alias `currentStatus`.
   */
  @ApiPropertyOptional({
    enum: [0, 1, 'active', 'inactive'],
    default: 1,
    description:
      '1/active (default) = portal access enabled; 0/inactive = created but cannot log in until activated.',
  })
  @IsOptional()
  @Transform(({ value, obj }) => {
    const fromStatus = resolvePartnerCreateStatus(value);
    if (fromStatus !== undefined) return fromStatus;
    return resolvePartnerCreateStatus(obj?.currentStatus);
  })
  @IsIn([0, 1])
  status?: 0 | 1;

  /** Alias for `status` (vendor UI). Whitelisted so forbidNonWhitelisted does not reject create. */
  @Allow()
  currentStatus?: number | string | boolean;

  /** Optional vendor UI hint; ignored by API (password still required in body). */
  @Allow()
  autoGeneratePassword?: boolean | string;
}
