import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { parseOptionalDecimalNumber } from '../../common/utils/parse-optional-number.util';

/** Optional numeric field (decimals allowed) that must be zero or positive when provided. */
export function IsOptionalNonNegativeNumber(): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => parseOptionalDecimalNumber(value) ?? value),
    IsOptional(),
    IsNumber({ allowNaN: false, allowInfinity: false }),
    Min(0),
  );
}
