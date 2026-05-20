import { OmitType } from '@nestjs/swagger';
import { ListStandardsQueryDto } from './list-standards-query.dto';

/** Filters only — export returns all matching rows (no pagination). */
export class ListStandardsExportQueryDto extends OmitType(ListStandardsQueryDto, [
  'page',
  'limit',
] as const) {}
