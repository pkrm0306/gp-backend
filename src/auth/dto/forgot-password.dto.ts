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
      'When **admin**, unknown emails return **400** **Email id is not registered**. For **vendor** (or inferred non-admin), unknown emails return **400** **User not registered**.',
  })
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'vendor'])
  portal?: 'admin' | 'vendor';
}
