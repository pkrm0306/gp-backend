import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PlantMergePreviewQueryDto {
  @ApiProperty({ description: 'MongoDB product _id' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'MongoDB _id of surviving plant' })
  @IsString()
  @IsNotEmpty()
  targetPlantId: string;

  @ApiProperty({
    description: 'Comma-separated MongoDB _ids of plants to absorb',
    example: '64abc...,64def...',
  })
  @IsString()
  @IsNotEmpty()
  sourcePlantIds: string;
}
