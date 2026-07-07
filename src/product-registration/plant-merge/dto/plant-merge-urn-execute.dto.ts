import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PlantMergeUrnExecutePairDto {
  @ApiProperty({ example: 'GPCEM002' })
  @IsString()
  @IsNotEmpty()
  sourceEoiNo: string;

  @ApiProperty({ example: 'URN-20250115100000' })
  @IsString()
  @IsNotEmpty()
  targetUrnNo: string;

  @ApiProperty({ example: 'GPCEM001' })
  @IsString()
  @IsNotEmpty()
  targetEoiNo: string;
}

export class PlantMergeUrnExecuteDto {
  @ApiProperty({ example: 'URN-20260301120000' })
  @IsString()
  @IsNotEmpty()
  sourceUrnNo: string;

  @ApiPropertyOptional({
    description:
      'Explicit source/target EOI pairs. When omitted, all READY preview matches are executed.',
    type: [PlantMergeUrnExecutePairDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlantMergeUrnExecutePairDto)
  pairs?: PlantMergeUrnExecutePairDto[];
}
