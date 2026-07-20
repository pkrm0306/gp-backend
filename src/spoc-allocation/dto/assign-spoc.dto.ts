import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

/** Body for first-time SPOC assignment — `POST /spoc-allocation`. */
export class AssignSpocDto {
  @ApiProperty({ description: 'Business product id (`products.productId`)' })
  @Type(() => Number)
  @IsInt({ message: 'productId must be an integer' })
  @Min(1, { message: 'productId must be at least 1' })
  productId: number;

  @ApiPropertyOptional({
    description: 'URN number (defaults to product.urnNo when omitted)',
  })
  @IsOptional()
  @IsString({ message: 'urn must be a string' })
  @MinLength(1, { message: 'urn must not be empty' })
  urn?: string;

  @ApiPropertyOptional({
    description:
      'Vendor / manufacturer Mongo id (defaults to product.manufacturerId / vendorId)',
  })
  @IsOptional()
  @IsMongoId({ message: 'vendorId must be a valid MongoDB ObjectId' })
  vendorId?: string;

  @ApiProperty({ description: 'Active GreenPro team member Mongo id' })
  @IsMongoId({ message: 'spocId must be a valid MongoDB ObjectId' })
  spocId: string;

  @ApiPropertyOptional({ description: 'Optional remarks stored on history' })
  @IsOptional()
  @IsString({ message: 'remarks must be a string' })
  @MaxLength(500, { message: 'remarks must be at most 500 characters' })
  remarks?: string;
}

/**
 * Body for reassignment — `PUT /spoc-allocation/:productId`.
 * `productId` comes from the path param.
 */
export class ReassignSpocDto {
  @ApiProperty({ description: 'New active GreenPro team member Mongo id' })
  @IsMongoId({ message: 'spocId must be a valid MongoDB ObjectId' })
  spocId: string;

  @ApiPropertyOptional({ description: 'Optional remarks stored on history' })
  @IsOptional()
  @IsString({ message: 'remarks must be a string' })
  @MaxLength(500, { message: 'remarks must be at most 500 characters' })
  remarks?: string;
}

/** Service-layer reassign input (path productId + body). */
export type ReassignSpocInput = ReassignSpocDto & { productId: number };
