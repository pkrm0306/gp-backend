import { BadRequestException } from '@nestjs/common';
import { ADMIN_MOBILE_UNAVAILABLE_MESSAGE } from '../common/services/global-phone-uniqueness.service';

export type AdminFieldIssue = {
  field: string;
  message: string;
};

/** Inline form issue for duplicate team-member mobile (admin CMS). */
export function throwTeamMemberMobileDuplicateIssue(): never {
  const message = ADMIN_MOBILE_UNAVAILABLE_MESSAGE;
  throw new BadRequestException({
    code: 'VALIDATION_ERROR',
    message,
    fieldErrors: { mobile: message },
    issues: [{ field: 'mobile', message }] satisfies AdminFieldIssue[],
  });
}
