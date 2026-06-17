import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Allow,
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

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
}
