import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  PRODUCT_STATUS_CERTIFIED,
  PRODUCT_STATUS_PENDING,
} from '../../renew/constants/product-status.constants';

export const REJECTED_RESTORE_TARGET_STATUSES = [
  PRODUCT_STATUS_PENDING,
  PRODUCT_STATUS_CERTIFIED,
] as const;

export type RejectedRestoreTargetStatus =
  (typeof REJECTED_RESTORE_TARGET_STATUSES)[number];

export class AdminRejectedRestoreProductDto {
  @ApiProperty({ example: 'URN-20260428123027' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  urnNo: string;

  @ApiProperty({
    description: 'MongoDB _id or numeric productId from admin list',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  productId: string;

  @ApiPropertyOptional({ example: 'GPPMI003803' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  eoiNo?: string;

  @ApiProperty({
    description: '0 = Un-certified (Pending), 2 = Certified',
    enum: REJECTED_RESTORE_TARGET_STATUSES,
    example: 0,
  })
  @IsIn([...REJECTED_RESTORE_TARGET_STATUSES])
  targetStatus: RejectedRestoreTargetStatus;
}

export class AdminRejectedRestoreUrnDto {
  @ApiProperty({ example: 'URN-20260428123027' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  urnNo: string;

  @ApiProperty({
    description: '0 = Un-certified (Pending), 2 = Certified',
    enum: REJECTED_RESTORE_TARGET_STATUSES,
    example: 2,
  })
  @IsIn([...REJECTED_RESTORE_TARGET_STATUSES])
  targetStatus: RejectedRestoreTargetStatus;
}
