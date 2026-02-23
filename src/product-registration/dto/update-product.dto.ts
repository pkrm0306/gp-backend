import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
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
}
