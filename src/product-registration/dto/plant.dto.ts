import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class PlantDto {
  @ApiProperty({ description: 'Plant name', example: 'Plant A' })
  @IsString()
  @IsNotEmpty()
  plantName: string;

  @ApiProperty({ description: 'Plant location', example: 'Industrial Area' })
  @IsString()
  @IsNotEmpty()
  plantLocation: string;

  @ApiProperty({ description: 'Country ID', example: '507f1f77bcf86cd799439013' })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  countryId: string;

  @ApiProperty({ description: 'State ID', example: '6996dcda14999ba875c7d646' })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  stateId: string;

  @ApiProperty({ description: 'City', example: 'Mumbai' })
  @IsString()
  @IsNotEmpty()
  city: string;
}
