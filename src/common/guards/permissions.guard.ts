import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { RbacService } from '../../rbac/rbac.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ALLOW_STAFF_SELF_ROLE_READ_KEY } from '../decorators/allow-staff-self-role-read.decorator';
import {
  hasEffectivePermission,
  wouldExactMatchAllow,
} from '../permissions/permission-hierarchy';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(
    private reflector: Reflector,
    private rbacService: RbacService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as
      | { userId?: string; role?: string; manufacturerId?: string }
      | undefined;
    if (!user?.role) {
      throw new ForbiddenException('Unauthorized portal access');
    }

    if (!['admin', 'staff'].includes(user.role)) {
      throw new ForbiddenException('Only admin portal users can access this API');
    }

    if (user.role === 'admin') {
      return true;
    }

    const allowStaffSelfRoleRead =
      this.reflector.getAllAndOverride<boolean>(ALLOW_STAFF_SELF_ROLE_READ_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || false;
    if (allowStaffSelfRoleRead && user.role === 'staff') {
      return true;
    }

    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    if (requiredPermissions.length === 0) {
      throw new ForbiddenException('No permission mapping found for this API');
    }

    if (!user.userId || !user.manufacturerId) {
      throw new ForbiddenException('Invalid token payload');
    }

    const userPermissions = await this.rbacService.getStaffPermissions(
      user.manufacturerId,
      user.userId,
    );
    const missingPermission = requiredPermissions.find(
      (permission) => !hasEffectivePermission(userPermissions, permission),
    );
    if (missingPermission) {
      const exact = wouldExactMatchAllow(userPermissions, missingPermission);
      const impliedWithoutExact = !exact;
      this.logger.warn(
        `Permission denied: userId=${user.userId} requiredPermission=${missingPermission} rawGrantCount=${userPermissions.length} exactGrantMatch=${exact} impliedByHierarchyWouldNeed=${impliedWithoutExact}`,
      );
      throw new ForbiddenException(`Missing permission: ${missingPermission}`);
    }
    return true;
  }
}

