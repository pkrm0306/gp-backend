import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UrnMergeExecuteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sourceUrnNo: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  targetUrnNo: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  moveAllCertifiedEois?: boolean;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  productIds?: number[];

  @ApiPropertyOptional({ default: 'fill_gaps_keep_target' })
  @IsOptional()
  @IsString()
  urnLevelStrategy?: string;
}
