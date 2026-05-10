import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

function decodeBasicHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

export function toReadableText(value: unknown): string {
  const raw = String(value ?? '');
  return decodeBasicHtmlEntities(
    raw
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

@ValidatorConstraint({ name: 'isReadableNotEmpty', async: false })
class IsReadableNotEmptyConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return toReadableText(value).length > 0;
  }

  defaultMessage(): string {
    return 'must contain readable text';
  }
}

@ValidatorConstraint({ name: 'maxReadableLength', async: false })
class MaxReadableLengthConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args?: ValidationArguments): boolean {
    const maxLength = Number(args?.constraints?.[0] ?? 0);
    if (value === undefined || value === null) return true;
    return toReadableText(value).length <= maxLength;
  }

  defaultMessage(args?: ValidationArguments): string {
    const maxLength = Number(args?.constraints?.[0] ?? 0);
    return `must be shorter than or equal to ${maxLength} readable characters`;
  }
}

export function IsReadableNotEmpty(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsReadableNotEmptyConstraint,
    });
  };
}

export function MaxReadableLength(
  maxLength: number,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [maxLength],
      validator: MaxReadableLengthConstraint,
    });
  };
}
