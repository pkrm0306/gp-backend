import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { PROCESS_TAB_REVIEW_KEYS } from '../constants/urn-tab-review.constants';

/** One process tab or raw-material step in vendor resubmit guidance. */
export interface VendorUrnTabReviewSlotDto {
  tabKey: string;
  stepId: number | null;
  label: string;
  reviewStatus: number;
  rejectionRemarks: string | null;
  canSaveAndNext: boolean;
}

export class PatchUrnTabReviewDto {
  @ApiProperty({ example: 'URN-20260326162423' })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({
    example: 'raw-materials',
    description:
      'Process tab key or `raw-materials`. Process keys: ' +
      PROCESS_TAB_REVIEW_KEYS.join(', '),
  })
  @IsString()
  @IsNotEmpty()
  tabKey: string;

  @ApiPropertyOptional({
    example: 7,
    description:
      'Required for `raw-materials` (1–15). Omit or null for process tabs.',
  })
  @ValidateIf((o) => o.tabKey === 'raw-materials')
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(15)
  stepId?: number;

  @ApiProperty({ enum: ['approved', 'rejected'] })
  @IsString()
  @IsIn(['approved', 'rejected'])
  decision: 'approved' | 'rejected';

  @ApiPropertyOptional({
    description: 'Required when decision is rejected',
  })
  @ValidateIf((o) => o.decision === 'rejected')
  @IsString()
  @IsNotEmpty()
  rejectionRemarks?: string;

  @ApiPropertyOptional({
    description: 'Active renewal cycle id (required for renewal URNs)',
    example: '6a1edd713ec5008b997aca94',
  })
  @IsOptional()
  @IsString()
  renewalCycleId?: string;
}
