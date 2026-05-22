import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsIn,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TestReportEntryDto } from './test-report-entry.dto';

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

  @ApiProperty({
    description:
      'JSON array — **replaces** all test report rows for this URN (optional; send full list on save). At least one of testReports (non-empty row) or files should be present (vendor enforces in UI). Format: [{"productName":"...","testReportFileName":"..."}]',
    type: [TestReportEntryDto],
    required: false,
    example: [
      {
        productName: 'Solar Panel 100W',
        testReportFileName: 'IEC Test Report - March 2026',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestReportEntryDto)
  testReports?: TestReportEntryDto[];

  /** @deprecated Use testReports[].testReportFileName — kept for single-file legacy submits */
  @ApiProperty({
    description: 'Legacy single test report display name when uploading one file',
    required: false,
  })
  @IsString()
  @IsOptional()
  testReportFileName?: string;

  /** @deprecated Use testReports[].productName */
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productName?: string;

  @ApiProperty({
    description:
      'JSON array of productDocumentId (or _id) values to keep for product performance documents. Omit to keep all on text-only save; [] to clear unlisted.',
    required: false,
    example: '[201,202,203]',
  })
  @IsOptional()
  existingDocumentIds?: string[];
}
