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

export class RapidlyRenewableUnitDto {
  @ApiProperty({
    description: 'Unit name',
    example: 'Test Unit 1',
  })
  @IsString()
  @IsNotEmpty()
  unitName: string;

  @ApiProperty({ example: 2024 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  year: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  unit1: number;

  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  yeardata1: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  unit2: number;

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  yeardata2: number;
}

export class CreateRawMaterialsRapidlyRenewableMaterialsDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  urnNo: string;

  @ApiProperty({
    description: 'Vendor ID from client payload (accepted but not used for authorization)',
    example: '66f1abcdef1234567890abcd',
    required: false,
  })
  @IsOptional()
  @IsString()
  vendorId?: string;

  @ApiProperty({
    description: 'Display name for uploaded supporting file',
    example: 'Rapidly Renewable Supporting Document - 2026',
    required: false,
  })
  @IsOptional()
  @IsString()
  rapidlyRenewableFileName?: string;

  @ApiProperty({
    type: [RapidlyRenewableUnitDto],
    description: 'Rapidly renewable materials rows for the URN',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RapidlyRenewableUnitDto)
  units: RapidlyRenewableUnitDto[];
}
