import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
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

  @ApiPropertyOptional({
    enum: ['admin', 'vendor'],
    description:
      'When **admin**, unknown emails return **400** **Email id is not registered**. For **vendor** (or inferred non-admin), unknown emails return **400** **User not registered**.',
  })
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'vendor'])
  portal?: 'admin' | 'vendor';
}
