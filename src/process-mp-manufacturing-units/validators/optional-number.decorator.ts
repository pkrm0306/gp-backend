import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { parseOptionalDecimalNumber } from '../../common/utils/parse-optional-number.util';

/** Optional numeric field (decimals allowed; any finite number when provided). */
export function IsOptionalNumber(): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => parseOptionalDecimalNumber(value) ?? value),
    IsOptional(),
    IsNumber({ allowNaN: false, allowInfinity: false }),
  );
}
