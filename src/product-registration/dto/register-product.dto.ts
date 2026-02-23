import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PlantDto } from './plant.dto';

export class RegisterProductDto {
  @ApiProperty({ description: 'Manufacturer ID', example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  manufacturerId: string;

  @ApiProperty({ description: 'Vendor ID', example: '507f1f77bcf86cd799439012' })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  vendorId: string;

  @ApiProperty({ description: 'Category ID', example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  categoryId: string;

  @ApiProperty({ description: 'Product name', example: 'Solar Panel 100W' })
  @IsString()
  @IsNotEmpty()
  productName: string;

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

  @ApiProperty({
    description: 'Plants array',
    type: [PlantDto],
    example: [
      {
        plantName: 'Plant A',
        plantLocation: 'Industrial Area',
        countryId: '507f1f77bcf86cd799439013',
        stateId: '6996dcda14999ba875c7d646',
        city: 'Mumbai',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlantDto)
  @IsNotEmpty()
  plants: PlantDto[];
}

export class BulkRegisterProductDto {
  @ApiProperty({
    description: 'Array of products to register',
    type: [RegisterProductDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RegisterProductDto)
  @IsNotEmpty()
  products: RegisterProductDto[];
}
