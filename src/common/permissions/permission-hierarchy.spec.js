"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var permissions_constants_1 = require("../constants/permissions.constants");
var permission_hierarchy_1 = require("./permission-hierarchy");
describe('permission-hierarchy', function () {
    describe('impliesPermission (parent → child, same action)', function () {
        it('allows parent module to imply nested :view permission', function () {
            expect((0, permission_hierarchy_1.impliesPermission)('products:view', 'products:certified:view')).toBe(true);
            expect((0, permission_hierarchy_1.impliesPermission)('products:view', 'products:uncertified:view')).toBe(true);
        });
        it('does not grant sibling branches from a leaf grant', function () {
            expect((0, permission_hierarchy_1.impliesPermission)('products:certified:view', 'products:uncertified:view')).toBe(false);
        });
        it('does not grant unrelated modules', function () {
            expect((0, permission_hierarchy_1.impliesPermission)('products:view', 'events:view')).toBe(false);
        });
        it('does not mix actions (view does not imply add)', function () {
            expect((0, permission_hierarchy_1.impliesPermission)('products:view', 'products:certified:add')).toBe(false);
            expect((0, permission_hierarchy_1.impliesPermission)('products:view', 'products:add')).toBe(false);
        });
        it('matches exact permission', function () {
            expect((0, permission_hierarchy_1.impliesPermission)('products:certified:view', 'products:certified:view')).toBe(true);
        });
    });
    describe('hasEffectivePermission', function () {
        it('resolves parent grant against child requirement', function () {
            expect((0, permission_hierarchy_1.hasEffectivePermission)(['products:view'], 'products:certified:view')).toBe(true);
        });
        it('denies when only sibling leaf is granted', function () {
            expect((0, permission_hierarchy_1.hasEffectivePermission)(['products:certified:view'], 'products:uncertified:view')).toBe(false);
        });
    });
    describe('expandEffectivePermissions', function () {
        it('includes implied known keys when parent is granted', function () {
            var eff = (0, permission_hierarchy_1.expandEffectivePermissions)(['products:view'], permissions_constants_1.ALL_KNOWN_PERMISSION_VALUES);
            expect(eff).toContain('products:view');
            expect(eff).toContain('products:certified:view');
            expect(eff).toContain('products:uncertified:view');
            expect(eff).not.toContain('products:add');
        });
        it('does not expand sibling when only leaf is granted', function () {
            var eff = (0, permission_hierarchy_1.expandEffectivePermissions)(['products:certified:view'], permissions_constants_1.ALL_KNOWN_PERMISSION_VALUES);
            expect(eff).toContain('products:certified:view');
            expect(eff).not.toContain('products:uncertified:view');
        });
    });
    describe('minimizePermissionSet', function () {
        it('strips child when parent grant is present', function () {
            expect((0, permission_hierarchy_1.minimizePermissionSet)(['products:view', 'products:certified:view']).sort()).toEqual(['products:view']);
        });
        it('keeps leaf when parent is absent', function () {
            expect((0, permission_hierarchy_1.minimizePermissionSet)(['products:certified:view']).sort()).toEqual([
                'products:certified:view',
            ]);
        });
    });
});
