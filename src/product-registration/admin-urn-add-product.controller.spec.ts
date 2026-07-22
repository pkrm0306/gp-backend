import { PERMISSIONS_KEY } from '../common/decorators/permissions.decorator';
import { PERMISSIONS_MATCH_MODE_KEY } from '../common/decorators/any-permissions.decorator';
import {
  PERMISSIONS,
  PRODUCTS_ADD_ANY,
} from '../common/constants/permissions.constants';
import { AdminUrnAddProductController } from './admin-urn-add-product.controller';

function getHandlerPermissionMetadata(method: (...args: unknown[]) => unknown) {
  return {
    permissions: Reflect.getMetadata(PERMISSIONS_KEY, method) as
      | string[]
      | undefined,
    matchMode: Reflect.getMetadata(PERMISSIONS_MATCH_MODE_KEY, method) as
      | 'any'
      | 'all'
      | undefined,
  };
}

describe('AdminUrnAddProductController permission metadata', () => {
  it('requires PRODUCTS_ADD_ANY on getAddProductContext', () => {
    const { permissions, matchMode } = getHandlerPermissionMetadata(
      AdminUrnAddProductController.prototype.getAddProductContext,
    );
    expect(permissions).toEqual(expect.arrayContaining([...PRODUCTS_ADD_ANY]));
    expect(matchMode).toBe('any');
  });

  it('requires PRODUCTS_ADD_ANY on addProductToUrn', () => {
    const { permissions, matchMode } = getHandlerPermissionMetadata(
      AdminUrnAddProductController.prototype.addProductToUrn,
    );
    expect(permissions).toEqual(
      expect.arrayContaining([
        PERMISSIONS.PRODUCTS_ADD,
        PERMISSIONS.PRODUCTS_UNCERTIFIED_ADD,
      ]),
    );
    expect(matchMode).toBe('any');
  });
});
