import { GUARDS_METADATA } from '@nestjs/common/constants';
import { AdminProductsController } from './admin-products.controller';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { PERMISSIONS_KEY } from '../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../common/constants/permissions.constants';

describe('AdminProductsController renew-validity auth metadata', () => {
  it('enforces JwtAuthGuard + PermissionsGuard at controller level', () => {
    const guards = Reflect.getMetadata(
      GUARDS_METADATA,
      AdminProductsController,
    ) as any[];
    expect(guards).toBeDefined();
    expect(guards).toEqual(expect.arrayContaining([JwtAuthGuard, PermissionsGuard]));
  });

  it('requires PRODUCTS_UPDATE permission on renew-validity endpoint', () => {
    const handler = AdminProductsController.prototype.adminRenewValidity;
    const permissions = Reflect.getMetadata(PERMISSIONS_KEY, handler) as string[];
    expect(permissions).toEqual([PERMISSIONS.PRODUCTS_UPDATE]);
  });
});

