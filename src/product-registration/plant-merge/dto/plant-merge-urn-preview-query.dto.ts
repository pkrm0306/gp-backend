import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PlantMergeUrnPreviewQueryDto {
  @ApiProperty({ example: 'URN-20260301120000' })
  @IsString()
  @IsNotEmpty()
  sourceUrnNo: string;
}
