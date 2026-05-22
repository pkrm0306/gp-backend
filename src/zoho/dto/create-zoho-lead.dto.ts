import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateZohoLeadDto {
  @ApiProperty({ example: 'Acme Green Materials Pvt Ltd' })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({ example: 'Rao' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ example: 'Vicky' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'vicky@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiPropertyOptional({ example: 'Portal Registration' })
  @IsOptional()
  @IsString()
  leadSource?: string;

  @ApiPropertyOptional({ example: 'New' })
  @IsOptional()
  @IsString()
  leadStatus?: string;

  @ApiPropertyOptional({ example: 'Hyderabad' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Telangana' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: 'India' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: '65a4c5c861f71f1a6f357b11' })
  @IsOptional()
  @IsString()
  portalUserId?: string;

  @ApiPropertyOptional({ example: '65a4c5c861f71f1a6f357b12' })
  @IsOptional()
  @IsString()
  vendorId?: string;

  @ApiPropertyOptional({
    description: 'Manufacturer MongoDB id for storing Zoho lead mapping.',
    example: '65a4c5c861f71f1a6f357b12',
  })
  @IsOptional()
  @IsString()
  manufacturerId?: string;

  @ApiPropertyOptional({ example: 'Paints and coatings' })
  @IsOptional()
  @IsString()
  productInterest?: string;

  @ApiPropertyOptional({
    description: 'Additional Zoho field API names and values.',
    example: { Lead_Status: 'Not Contacted' },
  })
  @IsOptional()
  @IsObject()
  customFields?: Record<string, unknown>;
}
