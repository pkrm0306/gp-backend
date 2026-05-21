import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsIn,
} from 'class-validator';
import type { InnovationDocumentTag } from '../utils/innovation-document-tag.util';

export class CreateProcessInnovationDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({
    description: 'Innovation implementation details (text)',
    example: 'Innovation implementation details',
    required: false,
  })
  @IsString()
  @IsOptional()
  innovationImplementationDetails?: string;

  @ApiProperty({
    description: 'Process innovation status (0=Pending, 1=Completed)',
    example: 0,
    required: false,
    enum: [0, 1],
  })
  @IsOptional()
  @IsNumber()
  @IsIn([0, 1])
  processInnovationStatus?: number;

  @ApiProperty({
    description:
      'Innovation implementation documents display name (required if uploading innovationImplementationDocumentsFile)',
    example: 'Innovation Implementation Documents - March 2026',
    required: false,
  })
  @IsString()
  @IsOptional()
  innovationImplementationDocumentsFileName?: string;

  /**
   * Set by the controller after parsing multipart field `innovationDocumentTags`
   * (JSON string or comma-separated), one value per file in upload order.
   */
  @ApiPropertyOptional({
    description:
      'Per-file tag: tech | process | social (same order as files). Set from body `innovationDocumentTags` JSON string.',
    isArray: true,
    enum: ['tech', 'process', 'social'],
  })
  innovationDocumentTags?: InnovationDocumentTag[];
}
