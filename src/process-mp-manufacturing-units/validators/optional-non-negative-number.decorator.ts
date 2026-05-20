import { applyDecorators } from '@nestjs/common';
import { IsNumber, IsOptional, Min } from 'class-validator';

/** Optional numeric field that must be zero or positive when provided. */
export function IsOptionalNonNegativeNumber(): PropertyDecorator {
  return applyDecorators(IsOptional(), IsNumber(), Min(0));
}
