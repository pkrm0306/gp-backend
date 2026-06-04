import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { RENEWAL_URN_STATUS_ALLOWED_VALUES } from '../constants/renewal-urn-status.constants';

export class UpdateRenewUrnStatusDto {
  @ApiProperty({ example: 'URN-20260528142848' })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({
    required: false,
    example: '6a1edd713ec5008b997aca94',
    description: 'Active renewal cycle (validated against URN)',
  })
  @IsOptional()
  @IsString()
  renewalCycleId?: string;

  @ApiProperty({ example: 'urn_status', enum: ['urn_status'] })
  @IsString()
  @IsIn(['urn_status'])
  updateStatusType: 'urn_status';

  @ApiProperty({
    example: 15,
    description: 'Renewal urnStatus only: 11, 12, 13, 14, 15, 16, 17',
    enum: RENEWAL_URN_STATUS_ALLOWED_VALUES,
  })
  @IsNumber()
  @IsIn([...RENEWAL_URN_STATUS_ALLOWED_VALUES])
  updateStatusTo: number;
}
