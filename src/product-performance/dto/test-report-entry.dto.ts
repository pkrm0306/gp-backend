import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class TestReportEntryDto {
  @ApiProperty({
    description: 'Product name for this test report row',
    example: 'Solar Panel 100W',
    required: false,
  })
  @IsString()
  @IsOptional()
  productName?: string;

  @ApiProperty({
    description: 'Test report display name (user-provided label)',
    example: 'IEC Test Report - March 2026',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  testReportFileName: string;
}
