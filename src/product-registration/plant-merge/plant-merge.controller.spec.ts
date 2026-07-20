import { GUARDS_METADATA } from '@nestjs/common/constants';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { PERMISSIONS_KEY } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS_MATCH_MODE_KEY } from '../../common/decorators/any-permissions.decorator';
import { PRODUCTS_UPDATE_ANY } from '../../common/constants/permissions.constants';
import { PlantMergeController } from './plant-merge.controller';

describe('PlantMergeController auth metadata', () => {
  it('enforces JwtAuthGuard + PermissionsGuard', () => {
    const guards = Reflect.getMetadata(GUARDS_METADATA, PlantMergeController) as unknown[];
    expect(guards).toEqual(expect.arrayContaining([JwtAuthGuard, PermissionsGuard]));
  });

  it('requires PRODUCTS_UPDATE_ANY (any-match) on validate', () => {
    const permissions = Reflect.getMetadata(
      PERMISSIONS_KEY,
      PlantMergeController.prototype.validate,
    ) as string[];
    const mode = Reflect.getMetadata(
      PERMISSIONS_MATCH_MODE_KEY,
      PlantMergeController.prototype.validate,
    );
    expect(mode).toBe('any');
    expect(permissions).toEqual([...PRODUCTS_UPDATE_ANY]);
  });

  it('requires PRODUCTS_UPDATE_ANY (any-match) on execute', () => {
    const permissions = Reflect.getMetadata(
      PERMISSIONS_KEY,
      PlantMergeController.prototype.execute,
    ) as string[];
    expect(permissions).toEqual([...PRODUCTS_UPDATE_ANY]);
  });

  it('requires PRODUCTS_UPDATE_ANY (any-match) on urnExecute', () => {
    const permissions = Reflect.getMetadata(
      PERMISSIONS_KEY,
      PlantMergeController.prototype.urnExecute,
    ) as string[];
    expect(permissions).toEqual([...PRODUCTS_UPDATE_ANY]);
  });
});
