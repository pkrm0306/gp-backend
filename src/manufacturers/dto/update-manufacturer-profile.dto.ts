import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, MaxLength } from 'class-validator';

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

  @ApiPropertyOptional({
    description:
      '**GST certificate PDF** as a public URL path (e.g. `/uploads/manufacturers/vendor-gst-….pdf`) or absolute `https://…` URL. ' +
      'If you send a plain GSTIN (no leading `/` or `http`), it is treated as **gstNumber** for backward compatibility. ' +
      'Prefer **gstNumber** for GSTIN and **gst** for the PDF path.',
    example: '/uploads/manufacturers/vendor-gst-123.pdf',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  gst?: string;

  @ApiPropertyOptional({
    description:
      'GST identification number (GSTIN). Use this when updating the tax id; use **gst** for the PDF document URL.',
    example: '29AABCU9603R1ZM',
  })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  gstNumber?: string;

  @ApiPropertyOptional({
    description:
      'Company logo image URL path (e.g. `/uploads/manufacturers/company-logo-….png`).',
    example: '/uploads/manufacturers/company-logo-456.png',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  companyLogo?: string;

  @ApiPropertyOptional({
    description:
      'PAN card document as a public URL path (PDF or JPEG), e.g. `/uploads/manufacturers/...` or `https://…`.',
    example: '/uploads/manufacturers/1730000000000_pan.jpg',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  pan?: string;

  @ApiProperty({ description: 'Email address', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Mobile number', required: false })
  @IsOptional()
  @IsString()
  mobile?: string;
}
