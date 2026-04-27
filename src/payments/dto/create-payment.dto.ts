import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260303142815',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({
    description: 'Quote amount (mandatory)',
    example: 10000.0,
    required: true,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  quoteAmount: number;

  @ApiProperty({
    description: 'GST amount (mandatory)',
    example: 1800.0,
    required: true,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  quoteGstAmount: number;

  @ApiProperty({
    description: 'TDS amount (mandatory)',
    example: 1000,
    required: true,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  quoteTdsAmount: number;

  @ApiProperty({
    description: 'Total amount (mandatory)',
    example: 10800.0,
    required: true,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  quoteTotal: number;

  @ApiPropertyOptional({
    description: 'Admin GST number',
    example: '29ABCDE1234F1Z5',
  })
  @IsOptional()
  @IsString()
  adminGstNo?: string;

  @ApiPropertyOptional({
    description: 'Vendor GST number',
    example: '27ABCDE1234F1Z5',
  })
  @IsOptional()
  @IsString()
  vendorGstNo?: string;

  @ApiProperty({
    description: 'Payment type',
    example: 'registration',
    enum: ['registration', 'certification', 'renew'],
    required: false,
    default: 'registration',
  })
  @IsOptional()
  @IsEnum(['registration', 'certification', 'renew'])
  paymentType?: string;

  @ApiProperty({
    description: 'Payment mode',
    example: 'online',
    enum: ['online', 'cheque_or_dd', 'neft_or_rtgs'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['online', 'cheque_or_dd', 'neft_or_rtgs'])
  paymentMode?: string;

  @ApiProperty({
    description: 'Online payment ID',
    example: 0,
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  onlinePaymentId?: number;

  @ApiProperty({
    description: 'Payment reference number',
    example: 'REF123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentReferenceNo?: string;

  @ApiProperty({
    description: 'Payment cheque date',
    example: '2026-03-15',
    required: false,
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsDateString()
  paymentChequeDate?: string;

  @ApiProperty({
    description: 'Products to be certified (JSON string)',
    example: '["product1", "product2"]',
    required: false,
  })
  @IsOptional()
  @IsString()
  productsToBeCertified?: string;
}
