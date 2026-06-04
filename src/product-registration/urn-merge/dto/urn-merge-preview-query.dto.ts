import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UrnMergePreviewQueryDto {
  @ApiProperty({ example: 'URN-20260301120000' })
  @IsString()
  @IsNotEmpty()
  sourceUrnNo: string;

  @ApiProperty({ example: 'URN-20250115100000' })
  @IsString()
  @IsNotEmpty()
  targetUrnNo: string;
}
