import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DOCUMENT_PROCESS_TYPE_VALUES } from '../constants/document-version.constants';

export class DocumentStreamQueryDto {
  @ApiProperty({ example: 'URN-20260305124230' })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiPropertyOptional({ enum: DOCUMENT_PROCESS_TYPE_VALUES, default: 'initial' })
  @IsOptional()
  @IsIn([...DOCUMENT_PROCESS_TYPE_VALUES])
  processType?: 'initial' | 'renewal';

  @ApiPropertyOptional({ description: 'Renewal cycle ObjectId when processType is renewal' })
  @IsOptional()
  @IsString()
  renewalCycleId?: string;

  @ApiProperty({ example: 'product_design' })
  @IsString()
  @IsNotEmpty()
  sectionKey: string;

  @ApiPropertyOptional({ example: 'supporting_documents' })
  @IsOptional()
  @IsString()
  subsectionKey?: string;

  @ApiProperty({ example: '1001', description: 'Logical slot key for the document stream' })
  @IsString()
  @IsNotEmpty()
  slotKey: string;
}
