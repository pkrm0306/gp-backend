import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';

/** Body for batch SPOC name lookup by business product ids. */
export class LookupSpocByProductsDto {
  @ApiProperty({
    description: 'Business product ids (`products.productId`)',
    type: [Number],
    example: [101, 102],
  })
  @IsArray({ message: 'productIds must be an array' })
  @ArrayMinSize(1, { message: 'productIds must contain at least one id' })
  @ArrayMaxSize(500, { message: 'productIds must contain at most 500 ids' })
  @Type(() => Number)
  @IsInt({ each: true, message: 'each productId must be an integer' })
  @Min(1, { each: true, message: 'each productId must be at least 1' })
  productIds: number[];
}
