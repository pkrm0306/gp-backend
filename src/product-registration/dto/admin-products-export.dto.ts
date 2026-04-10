import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsOptional } from 'class-validator';
import { AdminListProductsDto } from './admin-list-products.dto';

export class AdminProductsExportDto extends AdminListProductsDto {
  @ApiPropertyOptional({
    description: 'Export file format',
    enum: ['xlsx', 'csv'],
    default: 'xlsx',
  })
  @IsOptional()
  @IsIn(['xlsx', 'csv'])
  format?: 'xlsx' | 'csv' = 'xlsx';

  @ApiPropertyOptional({
    description: 'Sheets to include in xlsx export',
    type: [String],
    example: ['urn_summary', 'eoi_details'],
  })
  @IsOptional()
  @IsArray()
  @IsIn(['urn_summary', 'eoi_details'], { each: true })
  includeSheets?: Array<'urn_summary' | 'eoi_details'>;
}

