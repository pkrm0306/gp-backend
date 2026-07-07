import { GUARDS_METADATA } from '@nestjs/common/constants';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { PERMISSIONS_KEY } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../common/constants/permissions.constants';
import { PlantMergeController } from './plant-merge.controller';

describe('PlantMergeController auth metadata', () => {
  it('enforces JwtAuthGuard + PermissionsGuard', () => {
    const guards = Reflect.getMetadata(GUARDS_METADATA, PlantMergeController) as unknown[];
    expect(guards).toEqual(expect.arrayContaining([JwtAuthGuard, PermissionsGuard]));
  });

  it('requires PRODUCTS_UPDATE on validate', () => {
    const permissions = Reflect.getMetadata(
      PERMISSIONS_KEY,
      PlantMergeController.prototype.validate,
    ) as string[];
    expect(permissions).toEqual([PERMISSIONS.PRODUCTS_UPDATE]);
  });

  it('requires PRODUCTS_UPDATE on execute', () => {
    const permissions = Reflect.getMetadata(
      PERMISSIONS_KEY,
      PlantMergeController.prototype.execute,
    ) as string[];
    expect(permissions).toEqual([PERMISSIONS.PRODUCTS_UPDATE]);
  });

  it('requires PRODUCTS_UPDATE on urnExecute', () => {
    const permissions = Reflect.getMetadata(
      PERMISSIONS_KEY,
      PlantMergeController.prototype.urnExecute,
    ) as string[];
    expect(permissions).toEqual([PERMISSIONS.PRODUCTS_UPDATE]);
  });
});
