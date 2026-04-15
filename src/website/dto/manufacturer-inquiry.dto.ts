import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class ManufacturerInquiryDto {
  @ApiProperty({ description: 'Manufacturer MongoDB id', example: '661157aa2b2d2b2d2b2d2b2d' })
  @IsMongoId()
  @IsNotEmpty()
  manufacturerId: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  @Length(2, 80)
  name: string;

  @ApiProperty({ example: 'you@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim().toLowerCase())
  email: string;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  @Length(7, 20)
  @Matches(/^[0-9+\-\s()]+$/, { message: 'contact contains invalid characters' })
  contact: string;

  @ApiPropertyOptional({
    example: 'Subject (optional)',
    description: 'Optional subject for the inquiry (can be empty).',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    const s = String(value).trim();
    return s === '' ? undefined : s;
  })
  @Length(0, 200)
  subject?: string;

  @ApiPropertyOptional({
    example: 'I would like more details about your products.',
    description: 'Optional message body (can be empty).',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    const s = String(value).trim();
    return s === '' ? undefined : s;
  })
  @Length(0, 2000)
  message?: string;
}

