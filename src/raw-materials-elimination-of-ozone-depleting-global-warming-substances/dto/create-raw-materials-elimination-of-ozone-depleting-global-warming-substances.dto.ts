import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRawMaterialsEliminationOfOzoneDepletingGlobalWarmingSubstancesDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  urnNo: string;

  @ApiProperty({
    description: 'Optional display name for uploaded document',
    example: 'Absence of Ozone Depleting Test Report - 2026',
    required: false,
  })
  @IsString()
  @IsOptional()
  ozoneReportFileName?: string;
}

