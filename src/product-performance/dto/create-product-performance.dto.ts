import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsIn,
} from 'class-validator';

export class CreateProductPerformanceDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({
    description: 'EOI number',
    example: 'EOI-20260305124230',
    required: false,
  })
  @IsString()
  @IsOptional()
  eoiNo?: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Solar Panel 100W',
    required: false,
  })
  @IsString()
  @IsOptional()
  productName?: string;

  @ApiProperty({
    description:
      'Test report display name (required if uploading testReportFile). This is NOT the stored filename; it is a user-provided label.',
    example: 'IEC Test Report - March 2026',
    required: false,
  })
  @IsString()
  @IsOptional()
  testReportFileName?: string;

  @ApiProperty({
    description: 'Renewal type (0=Not Renewed, >0 = Renewed no of times)',
    example: 0,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  renewalType?: number;

  @ApiProperty({
    description: 'Product performance status (0=Pending, 1=Completed)',
    example: 0,
    required: false,
    enum: [0, 1],
  })
  @IsOptional()
  @IsNumber()
  @IsIn([0, 1])
  productPerformanceStatus?: number;
}
