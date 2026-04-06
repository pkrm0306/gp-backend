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

export class ContactSubmitDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 80)
  name: string;

  @ApiProperty({ example: 'you@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '9876543210',
    description:
      'Phone number as text. Preferred key is `phoneNumber`, but `phone` is also accepted for backward compatibility.',
  })
  @ValidateIf((o) => o.phoneNumber !== undefined || o.phone === undefined)
  @IsString()
  @IsNotEmpty()
  @Length(7, 20)
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
  @IsString()
  @IsNotEmpty()
  @Length(7, 20)
  @Matches(/^[0-9+\-\s()]+$/, {
    message: 'phone contains invalid characters',
  })
  phone?: string;

  @ApiProperty({ example: 'Subject of your query' })
  @IsOptional()
  @IsString()
  @Length(2, 120)
  subject?: string;

  @ApiProperty({ example: 'Your message...' })
  @IsString()
  @IsNotEmpty()
  @Length(5, 2000)
  message: string;
}

