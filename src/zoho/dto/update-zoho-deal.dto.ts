import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateZohoDealDto {
  @ApiProperty({ example: '6424000000123456' })
  @IsString()
  @IsNotEmpty()
  dealId: string;

  @ApiPropertyOptional({ example: 'Registration Payment Received' })
  @IsOptional()
  @IsString()
  stage?: string;

  @ApiPropertyOptional({ example: 25000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiPropertyOptional({ example: '2026-06-30' })
  @IsOptional()
  @IsDateString()
  closingDate?: string;

  @ApiPropertyOptional({
    description: 'Additional Zoho Deal field API names and values.',
    example: { Verification_Status: 'Approved' },
  })
  @IsOptional()
  @IsObject()
  customFields?: Record<string, unknown>;
}
