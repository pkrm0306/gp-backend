import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class NewsletterSubscribeDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: false,
    description: 'Checkbox: Green Products',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  greenProducts?: boolean;

  @ApiProperty({
    required: false,
    description: 'Checkbox: Events',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  events?: boolean;

  @ApiProperty({
    required: false,
    description:
      'Captcha text user typed (backend does not validate image captcha)',
    example: 'n7cUb',
  })
  @IsOptional()
  @IsString()
  captcha?: string;
}
