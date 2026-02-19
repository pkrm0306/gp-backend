import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsIn } from 'class-validator';

export class UpdatePartnerStatusDto {
  @ApiProperty({ description: 'Partner ID' })
  @IsString()
  @IsNotEmpty()
  partnerId: string;

  @ApiProperty({ description: 'Current status (0 or 1)', enum: [0, 1] })
  @IsNumber()
  @IsIn([0, 1])
  currentStatus: number;
}
