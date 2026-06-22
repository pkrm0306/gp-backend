import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty({
    example: 'vendor@example.com',
    description:
      'Email used during vendor registration. Must belong to an unverified vendor account.',
  })
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
}
