import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class ManufacturerReplyDto {
  @ApiProperty({ description: 'Customer email address', example: 'customer@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim().toLowerCase())
  email: string;

  @ApiProperty({
    description: 'Message from user (original message to show in template)',
    example: 'Hellooo greenproooo',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  @Length(1, 4000)
  userMessage: string;

  @ApiProperty({
    description: 'Your reply message to the customer',
    example: 'Thanks for reaching out. We will get back to you shortly.',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  @Length(1, 4000)
  replyMessage: string;
}

