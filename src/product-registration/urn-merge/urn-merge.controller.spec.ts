import { GUARDS_METADATA } from '@nestjs/common/constants';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { PERMISSIONS_KEY } from '../../common/decorators/permissions.decorator';
import { PRODUCTS_UPDATE_ANY } from '../../common/constants/permissions.constants';
import { UrnMergeController } from './urn-merge.controller';

describe('UrnMergeController auth metadata', () => {
  it('enforces JwtAuthGuard + PermissionsGuard', () => {
    const guards = Reflect.getMetadata(GUARDS_METADATA, UrnMergeController) as unknown[];
    expect(guards).toEqual(expect.arrayContaining([JwtAuthGuard, PermissionsGuard]));
  });

  it('requires PRODUCTS_UPDATE_ANY (any-match) on execute', () => {
    const permissions = Reflect.getMetadata(
      PERMISSIONS_KEY,
      UrnMergeController.prototype.execute,
    ) as string[];
    expect(permissions).toEqual([...PRODUCTS_UPDATE_ANY]);
  });
});
