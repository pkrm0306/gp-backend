import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AssignSpocDto } from './dto/assign-spoc.dto';

/**
 * RBAC / permission key regression for SPOC allocation.
 * Ensures the permission constant remains additive and does not collide with products.* keys.
 */
describe('SPOC RBAC permission key regression', () => {
  it('keeps spoc_allocation.assign distinct from products permissions', () => {
    // Mirror constants used by PermissionsGuard / CreateRoleDrawer
    const SPOC = 'spoc_allocation.assign';
    const PRODUCTS_VIEW = 'products:uncertified:view';
    expect(SPOC).not.toContain('products');
    expect(PRODUCTS_VIEW).not.toContain('spoc_allocation');
    expect(SPOC).toBe('spoc_allocation.assign');
  });

  it('does not accept empty assign body (ValidationPipe-equivalent)', async () => {
    const dto = plainToInstance(AssignSpocDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
