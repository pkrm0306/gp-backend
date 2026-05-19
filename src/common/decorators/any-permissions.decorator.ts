import { applyDecorators, SetMetadata } from '@nestjs/common';
import { PermissionKey } from '../constants/permissions.constants';
import { PERMISSIONS_KEY } from './permissions.decorator';

export const PERMISSIONS_MATCH_MODE_KEY = 'permissions_match_mode';

/** User needs at least one of the listed permissions (OR). */
export const AnyPermissions = (...permissions: PermissionKey[]) =>
  applyDecorators(
    SetMetadata(PERMISSIONS_KEY, permissions),
    SetMetadata(PERMISSIONS_MATCH_MODE_KEY, 'any'),
  );
