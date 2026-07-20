import { GUARDS_METADATA } from '@nestjs/common/constants';
import { AdminProductsController } from './admin-products.controller';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { PERMISSIONS_KEY } from '../common/decorators/permissions.decorator';
import { PERMISSIONS_MATCH_MODE_KEY } from '../common/decorators/any-permissions.decorator';
import {
  PRODUCTS_UPDATE_ANY,
  PRODUCTS_VIEW_ANY,
} from '../common/constants/permissions.constants';

describe('AdminProductsController renew-validity auth metadata', () => {
  it('enforces JwtAuthGuard + PermissionsGuard at controller level', () => {
    const guards = Reflect.getMetadata(
      GUARDS_METADATA,
      AdminProductsController,
    ) as any[];
    expect(guards).toBeDefined();
    expect(guards).toEqual(expect.arrayContaining([JwtAuthGuard, PermissionsGuard]));
  });

  it('requires PRODUCTS_UPDATE_ANY (any-match) on renew-validity endpoint', () => {
    const handler = AdminProductsController.prototype.adminRenewValidity;
    const permissions = Reflect.getMetadata(PERMISSIONS_KEY, handler) as string[];
    const mode = Reflect.getMetadata(PERMISSIONS_MATCH_MODE_KEY, handler);
    expect(mode).toBe('any');
    expect(permissions).toEqual([...PRODUCTS_UPDATE_ANY]);
  });

  it('requires PRODUCTS_VIEW_ANY (any-match) on list endpoint', () => {
    const handler = AdminProductsController.prototype.list;
    const permissions = Reflect.getMetadata(PERMISSIONS_KEY, handler) as string[];
    const mode = Reflect.getMetadata(PERMISSIONS_MATCH_MODE_KEY, handler);
    expect(mode).toBe('any');
    expect(permissions).toEqual([...PRODUCTS_VIEW_ANY]);
    expect(permissions).toContain('products:uncertified:view');
    expect(permissions).toContain('products:view');
  });
});
