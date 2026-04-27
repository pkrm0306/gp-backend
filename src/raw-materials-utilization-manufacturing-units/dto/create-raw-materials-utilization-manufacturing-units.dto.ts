import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class UtilizationManufacturingUnitDto {
  @ApiProperty({
    description: 'Unit name',
    example: 'Manufacturing Unit A',
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

export class CreateRawMaterialsUtilizationManufacturingUnitsDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  urnNo: string;

  @ApiProperty({
    type: [UtilizationManufacturingUnitDto],
    description:
      'Manufacturing unit rows to create in one request. Preferred over legacy single-row fields.',
    required: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UtilizationManufacturingUnitDto)
  units: UtilizationManufacturingUnitDto[];
}
