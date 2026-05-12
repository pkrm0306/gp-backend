import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';

export class ContactSubmitDto {
  @ApiProperty({ required: false, example: 'John Doe' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, example: 'you@example.com' })
  @IsOptional()
  @ValidateIf((_, value) => String(value ?? '').trim() !== '')
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: '9876543210',
    description:
      'Phone number as text. Preferred key is `phoneNumber`, but `phone` is also accepted for backward compatibility.',
  })
  @ValidateIf((o) => o.phoneNumber !== undefined || o.phone === undefined)
  @IsOptional()
  @IsString()
  @Matches(/^[0-9+\-\s()]+$/, {
    message: 'phoneNumber contains invalid characters',
  })
  phoneNumber?: string;

  @ApiProperty({
    required: false,
    example: '9876543210',
    description:
      'Alias for `phoneNumber` (accepted so older frontends sending `phone` do not fail validation).',
  })
  @ValidateIf((o) => o.phone !== undefined || o.phoneNumber === undefined)
  @IsOptional()
  @IsString()
  @Matches(/^[0-9+\-\s()]+$/, {
    message: 'phone contains invalid characters',
  })
  phone?: string;

  @ApiProperty({ required: false, example: 'Subject of your query' })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ required: false, example: 'Your message...' })
  @IsOptional()
  @IsString()
  message?: string;
}
