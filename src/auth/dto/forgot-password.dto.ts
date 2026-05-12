import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    enum: ['admin', 'vendor'],
    description:
      'When **admin**, unknown emails return **Email id is not registered** instead of a generic message.',
  })
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'vendor'])
  portal?: 'admin' | 'vendor';
}
