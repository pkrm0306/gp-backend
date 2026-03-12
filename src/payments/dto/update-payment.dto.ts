import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsEnum,
  IsDateString,
  IsInt,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePaymentDto {
  @ApiProperty({
    description: 'URN number (optional: only needed if you want to change the URN on the payment record)',
    example: 'URN-20260305124230',
    required: false,
  })
  @IsOptional()
  @IsString()
  urnNo?: string;

  @ApiProperty({ description: 'Quote amount', example: 10000.0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quoteAmount?: number;

  @ApiProperty({ description: 'GST amount', example: 1800.0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quoteGstAmount?: number;

  @ApiProperty({ description: 'TDS amount', example: 1000.0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quoteTdsAmount?: number;

  @ApiProperty({ description: 'Total amount', example: 10800.0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quoteTotal?: number;

  @ApiProperty({ description: 'Admin GST number', example: '29ABCDE1234F1Z9', required: false })
  @IsOptional()
  @IsString()
  adminGstNo?: string;

  @ApiProperty({ description: 'Vendor GST number', example: '27ABCDE1234F1Z9', required: false })
  @IsOptional()
  @IsString()
  vendorGstNo?: string;

  @ApiProperty({
    description: 'Payment type',
    example: 'registration',
    required: false,
    enum: ['registration', 'certification', 'renew'],
  })
  @IsOptional()
  @IsEnum(['registration', 'certification', 'renew'])
  paymentType?: string;

  @ApiProperty({
    description: 'Payment mode',
    example: 'cheque_or_dd',
    required: false,
    enum: ['online', 'cheque_or_dd', 'neft_or_rtgs'],
  })
  @IsOptional()
  @IsEnum(['online', 'cheque_or_dd', 'neft_or_rtgs'])
  paymentMode?: string;

  @ApiProperty({ description: 'Online payment ID', example: 0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  onlinePaymentId?: number;

  @ApiProperty({ description: 'Payment reference number', example: 'REF123456', required: false })
  @IsOptional()
  @IsString()
  paymentReferenceNo?: string;

  @ApiProperty({
    description: 'Payment cheque date (ISO date-time)',
    example: '2026-03-06T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  paymentChequeDate?: string;

  @ApiProperty({
    description: 'Products to be certified (JSON string)',
    example: '["product1","product2"]',
    required: false,
  })
  @IsOptional()
  @IsString()
  productsToBeCertified?: string;

  @ApiProperty({
    description: 'Payment status (0=Created, 1=Pending, 2=Completed, 3=Cancelled)',
    example: 0,
    required: false,
    enum: [0, 1, 2, 3],
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([0, 1, 2, 3])
  paymentStatus?: number;

  @ApiProperty({
    description:
      'URN status to set on products table (when provided, updates products.urnStatus for this URN + logs activity)',
    example: 1,
    required: false,
    enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  urnStatus?: number;
}

