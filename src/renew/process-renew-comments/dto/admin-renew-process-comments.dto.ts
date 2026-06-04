import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/** Admin renew process review — one section field per POST. */
export class AdminRenewProcessCommentsDto {
  @ApiProperty({ example: 'URN-20260528142848' })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({ example: '6a1edd713ec5008b997aca94' })
  @IsString()
  @IsNotEmpty()
  renewalCycleId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productPerformance?: string;

  @ApiProperty({ required: false, description: 'Legacy typo — must accept' })
  @IsString()
  @IsOptional()
  manfacturingProcess?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  wasteManagement?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productInnovation?: string;
}
