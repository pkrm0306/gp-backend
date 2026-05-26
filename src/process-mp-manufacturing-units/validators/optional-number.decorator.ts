import { applyDecorators } from '@nestjs/common';
import { IsNumber, IsOptional } from 'class-validator';

/** Optional numeric field (any finite number when provided, including negative). */
export function IsOptionalNumber(): PropertyDecorator {
  return applyDecorators(IsOptional(), IsNumber());
}
