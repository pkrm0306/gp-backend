import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PlantMergeValidateDto {
  @ApiProperty({ example: 'URN-20260301120000' })
  @IsString()
  @IsNotEmpty()
  sourceUrnNo: string;

  @ApiProperty({ example: 'URN-20250115100000' })
  @IsString()
  @IsNotEmpty()
  targetUrnNo: string;

  @ApiProperty({ example: 'GPCEM002' })
  @IsString()
  @IsNotEmpty()
  sourceEoiNo: string;

  @ApiProperty({ example: 'GPCEM001' })
  @IsString()
  @IsNotEmpty()
  targetEoiNo: string;
}
