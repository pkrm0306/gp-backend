import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PlantDto } from './plant.dto';

export class AdminAddProductToUrnDto {
  @ApiProperty({ example: 'New solar panel model' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({ example: 'Product description text' })
  @IsString()
  @IsNotEmpty()
  productDetails: string;

  @ApiProperty({ type: [PlantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlantDto)
  @IsNotEmpty()
  plants: PlantDto[];

  @ApiPropertyOptional({
    description: 'Must match URN locked category when provided',
  })
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  productImage?: string;
}
