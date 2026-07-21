import { PATH_METADATA } from '@nestjs/common/constants';
import { PERMISSIONS_KEY } from '../common/decorators/permissions.decorator';
import { PERMISSIONS_MATCH_MODE_KEY } from '../common/decorators/any-permissions.decorator';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';
import { ALLOW_STAFF_SELF_ROLE_READ_KEY } from '../common/decorators/allow-staff-self-role-read.decorator';
import { PERMISSIONS } from '../common/constants/permissions.constants';
import { AdminController } from './admin.controller';

function getHandlerPermissionMetadata(method: (...args: unknown[]) => unknown) {
  return {
    permissions: Reflect.getMetadata(PERMISSIONS_KEY, method) as
      | string[]
      | undefined,
    matchMode: Reflect.getMetadata(PERMISSIONS_MATCH_MODE_KEY, method) as
      | 'any'
      | 'all'
      | undefined,
    isPublic: Reflect.getMetadata(IS_PUBLIC_KEY, method) as boolean | undefined,
    allowStaffSelfRoleRead: Reflect.getMetadata(
      ALLOW_STAFF_SELF_ROLE_READ_KEY,
      method,
    ) as boolean | undefined,
  };
}

describe('AdminController Team Member permission metadata', () => {
  it('requires TEAM_MEMBERS_VIEW or TEAM_MEMBERS_UPDATE on getTeamMemberById', () => {
    const { permissions, matchMode } = getHandlerPermissionMetadata(
      AdminController.prototype.getTeamMemberById,
    );
    expect(permissions).toEqual(
      expect.arrayContaining([
        PERMISSIONS.TEAM_MEMBERS_VIEW,
        PERMISSIONS.TEAM_MEMBERS_UPDATE,
      ]),
    );
    expect(matchMode).toBe('any');
  });

  it('requires TEAM_MEMBERS_VIEW on team member search routes', () => {
    for (const method of [
      AdminController.prototype.searchTeamMembersByName,
      AdminController.prototype.searchTeamMembersByEmail,
      AdminController.prototype.searchTeamMembers,
    ]) {
      const { permissions } = getHandlerPermissionMetadata(method);
      expect(permissions).toEqual([PERMISSIONS.TEAM_MEMBERS_VIEW]);
    }
  });

  it('requires TEAM_MEMBERS_STATUS on updateTeamMemberStatus', () => {
    const { permissions } = getHandlerPermissionMetadata(
      AdminController.prototype.updateTeamMemberStatus,
    );
    expect(permissions).toEqual([PERMISSIONS.TEAM_MEMBERS_STATUS]);
  });
});

describe('AdminController manufacturer permission metadata', () => {
  it('requires manufacturer update permissions on updateManufacturer', () => {
    const { permissions, matchMode } = getHandlerPermissionMetadata(
      AdminController.prototype.updateManufacturer,
    );
    expect(permissions).toEqual(
      expect.arrayContaining([
        PERMISSIONS.MANUFACTURERS_UPDATE,
        PERMISSIONS.MANUFACTURERS_VERIFIED_UPDATE,
        PERMISSIONS.MANUFACTURERS_UNVERIFIED_UPDATE,
      ]),
    );
    expect(matchMode).toBe('any');
  });

  it('requires manufacturer status permissions on status toggles', () => {
    for (const method of [
      AdminController.prototype.updateManufacturerStatus,
      AdminController.prototype.updateVendorStatus,
    ]) {
      const { permissions, matchMode } = getHandlerPermissionMetadata(method);
      expect(permissions).toEqual(
        expect.arrayContaining([
          PERMISSIONS.MANUFACTURERS_STATUS,
          PERMISSIONS.MANUFACTURERS_VERIFIED_STATUS,
          PERMISSIONS.MANUFACTURERS_UNVERIFIED_STATUS,
        ]),
      );
      expect(matchMode).toBe('any');
    }
  });

  it('requires INQUIRIES_REPLY on replyToCustomer', () => {
    const { permissions } = getHandlerPermissionMetadata(
      AdminController.prototype.replyToCustomer,
    );
    expect(permissions).toEqual([PERMISSIONS.INQUIRIES_REPLY]);
  });
});

describe('AdminController route permission coverage', () => {
  it('maps every HTTP handler to permissions, AnyPermissions, or Public', () => {
    const prototype = AdminController.prototype as unknown as Record<
      string,
      unknown
    >;
    const unmapped: string[] = [];

    for (const key of Object.getOwnPropertyNames(prototype)) {
      if (key === 'constructor' || typeof prototype[key] !== 'function') {
        continue;
      }

      const method = prototype[key] as (...args: unknown[]) => unknown;
      const routePath = Reflect.getMetadata(PATH_METADATA, method);
      if (routePath === undefined) {
        continue;
      }

      const { permissions, isPublic, allowStaffSelfRoleRead } =
        getHandlerPermissionMetadata(method);

      const hasPermissions = Array.isArray(permissions) && permissions.length > 0;

      if (!hasPermissions && !isPublic && !allowStaffSelfRoleRead) {
        unmapped.push(key);
      }
    }

    expect(unmapped).toEqual([]);
  });
});
