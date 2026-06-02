import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { SUMMIT_UPLOAD_TYPES } from '../constants/summit.constants';

export class SummitUploadQueryDto {
  @ApiProperty({ enum: SUMMIT_UPLOAD_TYPES })
  @IsIn([...SUMMIT_UPLOAD_TYPES])
  type: (typeof SUMMIT_UPLOAD_TYPES)[number];

  @ApiPropertyOptional({ description: 'Client item id (banner/speaker/sponsor/pdf row)' })
  @IsOptional()
  @IsString()
  itemId?: string;
}
