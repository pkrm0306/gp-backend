import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class AdditivesUnitDto {
  @ApiProperty({
    description: 'Unit name',
    example: 'Manufacturing Unit - A',
  })
  @IsString()
  @IsOptional()
  unitName?: string;

  @ApiProperty({ example: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  year1: number;

  @ApiProperty({
    description: 'Optional legacy year field from frontend payload',
    example: 2026,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  year?: number;

  @ApiProperty({ example: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  year1a: number;

  @ApiProperty({ example: 30 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  year1b: number;

  @ApiProperty({ example: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  year1c?: number;

  @ApiProperty({ example: 110 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  year2: number;

  @ApiProperty({ example: 25 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  year2a: number;

  @ApiProperty({ example: 35 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  year2b: number;

  @ApiProperty({ example: 50 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  year2c: number;

  @ApiProperty({ example: 120 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  year3: number;

  @ApiProperty({ example: 30 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  year3a: number;

  @ApiProperty({ example: 40 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  year3b: number;

  @ApiProperty({ example: 50 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  year3c: number;

  @ApiProperty({
    description: 'Optional PPC text value from frontend payload',
    example: 'PPC description',
    required: false,
  })
  @IsOptional()
  @IsString()
  ppc?: string;

  @ApiProperty({
    description: 'PSC text value',
    example: 'PSC description',
  })
  @IsString()
  @IsOptional()
  psc?: string;

  @ApiProperty({
    description: 'COC text value',
    example: 'COC description',
    required: false,
  })
  @IsString()
  @IsOptional()
  coc?: string;

  @ApiProperty({
    description: 'Percent COC text value',
    example: '15%',
    required: false,
  })
  @IsString()
  @IsOptional()
  percentcoc?: string;
}

export class CreateRawMaterialsAdditivesDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  urnNo: string;

  @ApiProperty({
    description: 'Display name for uploaded supporting file',
    example: 'Additives Supporting Document - 2026',
    required: false,
  })
  @IsOptional()
  @IsString()
  additivesFileName?: string;

  @ApiProperty({
    type: [AdditivesUnitDto],
    description: 'Manufacturing unit rows to replace in one request for this URN',
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdditivesUnitDto)
  units?: AdditivesUnitDto[];
}
