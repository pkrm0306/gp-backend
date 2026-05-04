import { SetMetadata } from '@nestjs/common';

export const ALLOW_STAFF_SELF_ROLE_READ_KEY = 'allowStaffSelfRoleRead';
export const AllowStaffSelfRoleRead = () =>
  SetMetadata(ALLOW_STAFF_SELF_ROLE_READ_KEY, true);

