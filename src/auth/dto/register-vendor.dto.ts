import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class RegisterVendorDto {
  @ApiProperty({
    description: 'Primary contact / account holder display name.',
    example: 'Jane Doe',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({
    description:
      'Company size band (free text or app-defined value, e.g. "1-10", "11-50", "201+").',
    example: '11-50',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  companySize: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiProperty({ example: 'niharika@gmail.com' })
  @Transform(({ value }) => {
    if (value === null || value === undefined) {
      return value;
    }
    if (Array.isArray(value)) {
      return String(value[0] ?? '').trim().toLowerCase();
    }
    return String(value).trim().toLowerCase();
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  @ApiProperty()
  @Transform(({ value }) => {
    if (value === null || value === undefined) {
      return value;
    }
    if (Array.isArray(value)) {
      return String(value[0] ?? '').trim();
    }
    return String(value).trim();
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({
    example: '+91',
    description:
      'Optional country dial code. If `phone` is local digits, backend prefixes this code (e.g. +91 + 9848447383 => +919848447383).',
  })
  @IsString()
  @IsOptional()
  countryCode?: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  captchaToken?: string;
}
