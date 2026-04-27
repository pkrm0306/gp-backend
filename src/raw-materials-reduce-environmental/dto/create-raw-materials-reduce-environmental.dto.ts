import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class ReduceEnvironmentalUnitDto {
  @ApiProperty({
    description: 'Location',
    example: 'Mine site location details',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    description: 'Enhancement of mines life',
    example: 'Measures for enhancement of mines life',
  })
  @IsString()
  @IsNotEmpty()
  enhancementOfMinesLife: string;

  @ApiProperty({
    description: 'Topsoil conservation',
    example: 'Topsoil conservation measures',
  })
  @IsString()
  @IsNotEmpty()
  topsoilConservation: string;

  @ApiProperty({
    description: 'Water table management',
    example: 'Water table management measures',
  })
  @IsString()
  @IsNotEmpty()
  waterTableManagement: string;

  @ApiProperty({
    description: 'Restoration of spent mines',
    example: 'Restoration plan details',
  })
  @IsString()
  @IsNotEmpty()
  restorationOfSpentMines: string;

  @ApiProperty({
    description: 'Green belt development and biodiversity',
    example: 'Green belt development and biodiversity initiatives',
  })
  @IsString()
  @IsNotEmpty()
  greenBeltDevelopmentAndBioDiversity: string;
}

export class CreateRawMaterialsReduceEnvironmentalDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  urnNo: string;

  @ApiProperty({
    type: [ReduceEnvironmentalUnitDto],
    description:
      'Rows to replace for this URN. If provided, all existing rows are replaced with this array.',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReduceEnvironmentalUnitDto)
  units?: ReduceEnvironmentalUnitDto[];

  @ApiProperty({
    description: 'Location (legacy single-row mode)',
    example: 'Mine site location details',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: 'Enhancement of mines life (legacy single-row mode)',
    example: 'Measures for enhancement of mines life',
    required: false,
  })
  @IsString()
  @IsOptional()
  enhancementOfMinesLife?: string;

  @ApiProperty({
    description: 'Topsoil conservation (legacy single-row mode)',
    example: 'Topsoil conservation measures',
    required: false,
  })
  @IsString()
  @IsOptional()
  topsoilConservation?: string;

  @ApiProperty({
    description: 'Water table management (legacy single-row mode)',
    example: 'Water table management measures',
    required: false,
  })
  @IsString()
  @IsOptional()
  waterTableManagement?: string;

  @ApiProperty({
    description: 'Restoration of spent mines (legacy single-row mode)',
    example: 'Restoration plan details',
    required: false,
  })
  @IsString()
  @IsOptional()
  restorationOfSpentMines?: string;

  @ApiProperty({
    description: 'Green belt development and biodiversity (legacy single-row mode)',
    example: 'Green belt development and biodiversity initiatives',
    required: false,
  })
  @IsString()
  @IsOptional()
  greenBeltDevelopmentAndBioDiversity?: string;

  @ApiProperty({
    description: 'Display name for uploaded supporting file',
    example: 'Reduce Environmental Supporting Document - 2026',
    required: false,
  })
  @IsString()
  @IsOptional()
  reduceEnvironmentalFileName?: string;
}
