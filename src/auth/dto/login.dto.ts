import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class LoginDto {
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
