import { BadRequestException } from '@nestjs/common';

export type SpocFieldIssue = {
  field: string;
  message: string;
};

/**
 * Throw a BadRequestException shaped for HttpExceptionFilter
 * (`code`, `message`, `fieldErrors`, `issues`) — same pattern as admin field validation.
 */
export function throwSpocValidationError(
  message: string,
  fieldErrors: Record<string, string>,
): never {
  const issues: SpocFieldIssue[] = Object.entries(fieldErrors).map(
    ([field, msg]) => ({ field, message: msg }),
  );
  throw new BadRequestException({
    statusCode: 400,
    error: 'Bad Request',
    code: 'VALIDATION_ERROR',
    message,
    fieldErrors,
    issues,
  });
}
