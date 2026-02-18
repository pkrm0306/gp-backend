import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ description: 'Company name (updates manufacturerName)', required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ description: 'Vendor name (updates vendorName)', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Designation (updates vendorDesignation)', required: false })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiProperty({ description: 'GST number (updates vendorGst)', required: false })
  @IsOptional()
  @IsString()
  gst?: string;

  @ApiProperty({ description: 'Email address (updates vendorEmail)', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Mobile number (updates vendorPhone)', required: false })
  @IsOptional()
  @IsString()
  mobile?: string;
}
