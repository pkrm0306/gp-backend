import { SetMetadata } from '@nestjs/common';

/** Self-service routes (profile, password, notifications) — auth only, no RBAC permission check. */
export const ALLOW_AUTHENTICATED_ADMIN_PORTAL_USER_KEY =
  'allowAuthenticatedAdminPortalUser';
export const AllowAuthenticatedAdminPortalUser = () =>
  SetMetadata(ALLOW_AUTHENTICATED_ADMIN_PORTAL_USER_KEY, true);
