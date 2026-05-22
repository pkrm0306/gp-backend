import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class TestReportEntryDto {
  @ApiProperty({
    description: 'Product name for this test report row (optional)',
    example: 'Solar Panel 100W',
    required: false,
  })
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiProperty({
    description:
      'Test report display name / file label (optional; at least one column per row may be filled)',
    example: 'IEC Test Report - March 2026',
    required: false,
  })
  @IsOptional()
  @IsString()
  testReportFileName?: string;
}
