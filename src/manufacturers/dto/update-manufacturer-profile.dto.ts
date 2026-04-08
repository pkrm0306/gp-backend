import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ description: 'Company name', required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ description: 'Vendor name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Designation', required: false })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiProperty({ description: 'GST number', required: false })
  @IsOptional()
  @IsString()
  gst?: string;

  @ApiProperty({ description: 'Email address', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Mobile number', required: false })
  @IsOptional()
  @IsString()
  mobile?: string;
}
