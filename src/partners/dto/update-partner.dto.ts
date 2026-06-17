import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Allow,
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  MinLength,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePartnerDto {
  @ApiPropertyOptional({ description: 'Partner name' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => String(value ?? '').trim())
  name?: string;

  @ApiPropertyOptional({ description: 'Partner email address' })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) =>
    value == null
      ? value
      : String(value)
          .trim()
          .toLowerCase(),
  )
  email?: string;

  @ApiPropertyOptional({
    example: '+91',
    description: 'Country dial code (required when updating local mobile digits)',
  })
  @ValidateIf((dto: UpdatePartnerDto) => {
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

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Mobile number (alias for phone)' })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiPropertyOptional({
    description: 'New password (only updates when provided)',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    description: 'Required when password is provided; must match password',
  })
  @ValidateIf((dto: UpdatePartnerDto) => Boolean(dto.password?.trim()))
  @IsString()
  @IsNotEmpty()
  confirmPassword?: string;
}
