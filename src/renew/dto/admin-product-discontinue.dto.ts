import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { TOGGLEABLE_DISCONTINUE_STATUSES } from '../constants/product-status.constants';

export class ToggleProductStatusBodyDto {
  @ApiProperty({ enum: [2, 4], description: 'Current status must match DB before toggle' })
  @Type(() => Number)
  @IsIn([2, 4])
  currentStatus: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}

export class BulkReactivateProductsBodyDto {
  @ApiProperty({
    type: [String],
    description: 'MongoDB product _id strings',
    example: ['507f1f77bcf86cd799439011'],
  })
  @IsArray()
  @IsMongoId({ each: true })
  productIds: string[];
}
