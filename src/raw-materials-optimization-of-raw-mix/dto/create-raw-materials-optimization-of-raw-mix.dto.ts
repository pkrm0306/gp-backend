import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class OptimizationOfRawMixUnitDto {
  @ApiProperty({
    description: 'Unit name',
    example: 'Unit A',
  })
  @IsString()
  @IsNotEmpty()
  unitName: string;

  @ApiProperty({ example: 2026 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  year: number;

  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  yeardata1: number;

  @ApiProperty({ example: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  yeardata2: number;

  @ApiProperty({ example: 30 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  yeardata3: number;
}

export class CreateRawMaterialsOptimizationOfRawMixDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  urnNo: string;

  @ApiProperty({
    description: 'Display name for uploaded supporting file',
    example: 'Raw Mix Optimization Supporting Document - 2026',
    required: false,
  })
  @IsOptional()
  @IsString()
  optimizationOfRawMixFileName?: string;

  @ApiProperty({
    type: [OptimizationOfRawMixUnitDto],
    description: 'Manufacturing unit rows to replace in one request for this URN',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OptimizationOfRawMixUnitDto)
  units: OptimizationOfRawMixUnitDto[];
}
