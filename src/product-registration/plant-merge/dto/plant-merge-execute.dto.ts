import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class PlantMergeExecuteDto {
  @ApiProperty({ description: 'MongoDB product _id' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'MongoDB _id of surviving plant' })
  @IsString()
  @IsNotEmpty()
  targetPlantId: string;

  @ApiProperty({ type: [String], description: 'MongoDB _ids of plants to absorb' })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  sourcePlantIds: string[];

  @ApiPropertyOptional({ default: 'absorb_soft_delete_source' })
  @IsOptional()
  @IsString()
  mergeStrategy?: string;
}
