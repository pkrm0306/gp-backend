import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateRawMaterialsAdditivesDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  urnNo: string;

  @ApiProperty({
    description: 'Unit name',
    example: 'Manufacturing Unit - A',
  })
  @IsString()
  @IsNotEmpty()
  unitName: string;

  @ApiProperty({ example: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  year1: number;

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
  @Type(() => Number)
  @IsInt()
  @Min(0)
  year1c: number;

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
    description: 'PSC text value',
    example: 'PSC description',
  })
  @IsString()
  @IsNotEmpty()
  psc: string;

  @ApiProperty({
    description: 'COC text value',
    example: 'COC description',
  })
  @IsString()
  @IsNotEmpty()
  coc: string;

  @ApiProperty({
    description: 'Percent COC text value',
    example: '15%',
  })
  @IsString()
  @IsNotEmpty()
  percentcoc: string;
}
