import { ApiProperty } from '@nestjs/swagger';
import {
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
 * Manufacturer inquiry POST body — only visitor fields.
 * reCAPTCHA is supplied via `x-recaptcha-token` header.
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
    example: '9876543210',
    description:
      'Prefer `phone`. `contact` is accepted as an older alias.',
  })
  @ValidateIf((o) => o.phone !== undefined || o.contact === undefined)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  @Length(7, 20)
  @Matches(/^[0-9+\-\s()]+$/, {
    message: 'phone contains invalid characters',
  })
  phone?: string;

  @ApiProperty({
    required: false,
    example: '9876543210',
    description: 'Deprecated alias for `phone` (backward compatibility).',
  })
  @ValidateIf((o) => o.contact !== undefined || o.phone === undefined)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  @Length(7, 20)
  @Matches(/^[0-9+\-\s()]+$/, {
    message: 'contact contains invalid characters',
  })
  contact?: string;

  @ApiProperty({
    example: 'I would like more details about your products.',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  @Length(5, 2000)
  message: string;

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
}
