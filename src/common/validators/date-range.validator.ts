import { BadRequestException } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

export const FROM_DATE_LATER_THAN_TO_MESSAGE =
  'From Date cannot be later than To Date.';

type DateRangeObject = {
  from?: string | null;
  to?: string | null;
};

/** True when either bound is missing, or From <= To (same calendar day allowed). */
export function isFromDateNotLaterThanToDate(
  from?: string | null,
  to?: string | null,
): boolean {
  const fromRaw = String(from ?? '').trim();
  const toRaw = String(to ?? '').trim();
  if (!fromRaw || !toRaw) return true;

  const fromDay = fromRaw.slice(0, 10);
  const toDay = toRaw.slice(0, 10);
  if (
    /^\d{4}-\d{2}-\d{2}$/.test(fromDay) &&
    /^\d{4}-\d{2}-\d{2}$/.test(toDay)
  ) {
    return fromDay <= toDay;
  }

  const fromTime = Date.parse(fromRaw);
  const toTime = Date.parse(toRaw);
  if (Number.isNaN(fromTime) || Number.isNaN(toTime)) return true;
  return fromTime <= toTime;
}

/** Throws BadRequestException when From > To. */
export function assertFromDateNotLaterThanToDate(
  from?: string | null,
  to?: string | null,
): void {
  if (!isFromDateNotLaterThanToDate(from, to)) {
    throw new BadRequestException(FROM_DATE_LATER_THAN_TO_MESSAGE);
  }
}

@ValidatorConstraint({ name: 'isFromDateNotLaterThanToDate', async: false })
export class IsFromDateNotLaterThanToDateConstraint
  implements ValidatorConstraintInterface
{
  validate(_value: unknown, args: ValidationArguments): boolean {
    const obj = args.object as DateRangeObject;
    return isFromDateNotLaterThanToDate(obj.from, obj.to);
  }

  defaultMessage(): string {
    return FROM_DATE_LATER_THAN_TO_MESSAGE;
  }
}

/**
 * Property decorator (typically on `to`): From Date must be <= To Date when both are set.
 */
export function IsFromDateNotLaterThanToDate(
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: {
        message: FROM_DATE_LATER_THAN_TO_MESSAGE,
        ...validationOptions,
      },
      constraints: [],
      validator: IsFromDateNotLaterThanToDateConstraint,
    });
  };
}
