import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/** Body for PATCH /admin/vendor-user/profile (admin + staff own profile). */
export class UpdateVendorUserProfileDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ example: 'Manager', description: 'Job title / designation' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  designation?: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '9876543210',
    description: 'Mobile number (stored as vendor_users.phone)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  mobile: string;
}
