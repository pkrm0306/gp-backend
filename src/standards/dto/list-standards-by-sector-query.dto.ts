import { OmitType } from '@nestjs/swagger';
import { ListStandardsQueryDto } from './list-standards-query.dto';

/** Same as list standards, but **sector** is fixed by the path — do not send it in the query. */
export class ListStandardsBySectorQueryDto extends OmitType(
  ListStandardsQueryDto,
  ['sector'] as const,
) {}
