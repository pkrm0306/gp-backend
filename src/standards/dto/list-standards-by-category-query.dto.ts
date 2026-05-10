import { OmitType } from '@nestjs/swagger';
import { ListStandardsQueryDto } from './list-standards-query.dto';

/** Same as list standards, but **category_id** is fixed by the path — do not send it in the query. */
export class ListStandardsByCategoryQueryDto extends OmitType(
  ListStandardsQueryDto,
  ['category_id'] as const,
) {}
