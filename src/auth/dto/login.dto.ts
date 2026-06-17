import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsIn,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { normalizeLoginEmail } from '../../vendor-users/utils/vendor-login-email.util';

export class LoginDto {
  @ApiPropertyOptional({
    example: 'user@example.com',
    description:
      'Login email. If omitted, **username** is used (vendor team member forms often label this field as username).',
  })
  @ValidateIf((dto: LoginDto) => !String(dto.username ?? '').trim())
  @Transform(({ value }) => {
    if (value === null || value === undefined) {
      return value;
    }
    if (Array.isArray(value)) {
      return normalizeLoginEmail(value[0]);
    }
    return normalizeLoginEmail(value);
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'email must be a valid email address' })
  email?: string;

  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'Alias for **email** when the client sends `username` instead.',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined) {
      return value;
    }
    if (Array.isArray(value)) {
      return normalizeLoginEmail(value[0]);
    }
    return normalizeLoginEmail(value);
  })
  @IsString()
  @ValidateIf((dto: LoginDto) => !String(dto.email ?? '').trim())
  @IsNotEmpty()
  @IsEmail({}, { message: 'username must be a valid email address' })
  username?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({
    enum: ['admin', 'vendor'],
    description:
      'Portal context for login. admin portal allows admin/staff only; vendor portal allows vendor/partner only.',
  })
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'vendor'])
  portal?: 'admin' | 'vendor';
}
