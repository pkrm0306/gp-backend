import { ALL_KNOWN_PERMISSION_VALUES } from '../constants/permissions.constants';
import {
  expandEffectivePermissions,
  hasEffectivePermission,
  impliesPermission,
  minimizePermissionSet,
} from './permission-hierarchy';

describe('permission-hierarchy', () => {
  describe('impliesPermission (parent → child, same action)', () => {
    it('allows parent module to imply nested :view permission', () => {
      expect(impliesPermission('products:view', 'products:certified:view')).toBe(true);
      expect(impliesPermission('products:view', 'products:uncertified:view')).toBe(true);
    });

    it('does not grant sibling branches from a leaf grant', () => {
      expect(
        impliesPermission('products:certified:view', 'products:uncertified:view'),
      ).toBe(false);
    });

    it('does not grant unrelated modules', () => {
      expect(impliesPermission('products:view', 'events:view')).toBe(false);
    });

    it('does not mix actions (view does not imply add)', () => {
      expect(impliesPermission('products:view', 'products:certified:add')).toBe(false);
      expect(impliesPermission('products:view', 'products:add')).toBe(false);
    });

    it('matches exact permission', () => {
      expect(impliesPermission('products:certified:view', 'products:certified:view')).toBe(
        true,
      );
    });
  });

  describe('hasEffectivePermission', () => {
    it('resolves parent grant against child requirement', () => {
      expect(
        hasEffectivePermission(['products:view'], 'products:certified:view'),
      ).toBe(true);
    });

    it('denies when only sibling leaf is granted', () => {
      expect(
        hasEffectivePermission(['products:certified:view'], 'products:uncertified:view'),
      ).toBe(false);
    });
  });

  describe('expandEffectivePermissions', () => {
    it('includes implied known keys when parent is granted', () => {
      const eff = expandEffectivePermissions(['products:view'], ALL_KNOWN_PERMISSION_VALUES);
      expect(eff).toContain('products:view');
      expect(eff).toContain('products:certified:view');
      expect(eff).toContain('products:uncertified:view');
      expect(eff).not.toContain('products:add');
    });

    it('does not expand sibling when only leaf is granted', () => {
      const eff = expandEffectivePermissions(
        ['products:certified:view'],
        ALL_KNOWN_PERMISSION_VALUES,
      );
      expect(eff).toContain('products:certified:view');
      expect(eff).not.toContain('products:uncertified:view');
    });
  });

  describe('minimizePermissionSet', () => {
    it('strips child when parent grant is present', () => {
      expect(
        minimizePermissionSet(['products:view', 'products:certified:view']).sort(),
      ).toEqual(['products:view']);
    });

    it('keeps leaf when parent is absent', () => {
      expect(minimizePermissionSet(['products:certified:view']).sort()).toEqual([
        'products:certified:view',
      ]);
    });
  });
});
