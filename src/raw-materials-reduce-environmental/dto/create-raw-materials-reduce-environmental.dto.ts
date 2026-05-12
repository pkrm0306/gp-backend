import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

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
