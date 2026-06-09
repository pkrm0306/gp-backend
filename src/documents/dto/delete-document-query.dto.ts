import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class DeleteDocumentQueryDto {
  @ApiProperty({
    description: 'URN number associated with the document',
    example: 'URN-20260305124230',
  })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiPropertyOptional({
    description:
      'Section key from the vendor tab. Required when processType is renewal.',
    example: 'process_manufacturing',
  })
  @ValidateIf((o: DeleteDocumentQueryDto) => o.processType === 'renewal')
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  sectionKey?: string;

  @ApiPropertyOptional({
    description: 'Set to `renewal` for renew-cycle documents in all_renew_product_documents',
    example: 'renewal',
  })
  @IsOptional()
  @IsString()
  @IsIn(['renewal'])
  processType?: 'renewal';

  @ApiPropertyOptional({
    description: 'Active renewal cycle id — required when processType is renewal',
    example: '6a26719a22375978fb33e020',
  })
  @ValidateIf((o: DeleteDocumentQueryDto) => o.processType === 'renewal')
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  renewalCycleId?: string;
}
