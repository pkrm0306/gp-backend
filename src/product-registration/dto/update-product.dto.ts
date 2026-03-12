import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Solar Panel 100W Updated', required: false })
  @IsString()
  @IsOptional()
  productName?: string;

  @ApiProperty({ description: 'Product image URL', required: false })
  @IsString()
  @IsOptional()
  productImage?: string;

  @ApiProperty({ description: 'Product details', required: false })
  @IsString()
  @IsOptional()
  productDetails?: string;

  @ApiProperty({ description: 'Product type', example: 0, required: false })
  @IsNumber()
  @IsOptional()
  productType?: number;

  @ApiProperty({ description: 'Product status', example: 0, required: false })
  @IsNumber()
  @IsOptional()
  productStatus?: number;

  @ApiProperty({ description: 'Product renew status', example: 0, required: false })
  @IsNumber()
  @IsOptional()
  productRenewStatus?: number;

  @ApiProperty({ description: 'URN status', example: 0, required: false })
  @IsNumber()
  @IsOptional()
  urnStatus?: number;

  @ApiProperty({ description: 'Assessment report URL', required: false })
  @IsString()
  @IsOptional()
  assessmentReportUrl?: string;

  @ApiProperty({ description: 'Rejected details', required: false })
  @IsString()
  @IsOptional()
  rejectedDetails?: string;

  @ApiProperty({ description: 'Certified date', required: false, type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  certifiedDate?: string;

  @ApiProperty({ description: 'Valid till date', required: false, type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  validtillDate?: string;

  @ApiProperty({ description: 'First notify date', required: false, type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  firstNotifyDate?: string;

  @ApiProperty({ description: 'Second notify date', required: false, type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  secondNotifyDate?: string;

  @ApiProperty({ description: 'Third notify date', required: false, type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  thirdNotifyDate?: string;

  @ApiProperty({ description: 'Renewed date', required: false, type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  renewedDate?: string;
}
