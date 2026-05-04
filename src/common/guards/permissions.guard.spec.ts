import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsGuard } from './permissions.guard';
import { RbacService } from '../../rbac/rbac.service';

describe('PermissionsGuard', () => {
  const reflector = {
    getAllAndOverride: jest.fn(),
  } as unknown as Reflector;
  const rbacService = {
    getStaffPermissions: jest.fn(),
  } as unknown as RbacService;
  const guard = new PermissionsGuard(reflector, rbacService);

  const makeContext = (user: any) =>
    ({
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({ getRequest: () => ({ user }) }),
    }) as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows admin full access', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValueOnce(false);
    const ok = await guard.canActivate(makeContext({ role: 'admin' }));
    expect(ok).toBe(true);
  });

  it('blocks vendor from admin portal', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValueOnce(false);
    await expect(
      guard.canActivate(makeContext({ role: 'vendor' })),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('allows staff with required permission', async () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(['products:view']);
    (rbacService.getStaffPermissions as jest.Mock).mockResolvedValue([
      'products:view',
      'products:update',
    ]);

    const ok = await guard.canActivate(
      makeContext({
        role: 'staff',
        userId: '507f1f77bcf86cd799439011',
        manufacturerId: '507f1f77bcf86cd799439012',
      }),
    );
    expect(ok).toBe(true);
  });

  it('denies staff without required permission', async () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(['products:delete']);
    (rbacService.getStaffPermissions as jest.Mock).mockResolvedValue([
      'products:view',
    ]);

    await expect(
      guard.canActivate(
        makeContext({
          role: 'staff',
          userId: '507f1f77bcf86cd799439011',
          manufacturerId: '507f1f77bcf86cd799439012',
        }),
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('allows staff when parent permission implies nested route permission', async () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(['products:certified:view']);
    (rbacService.getStaffPermissions as jest.Mock).mockResolvedValue(['products:view']);

    const ok = await guard.canActivate(
      makeContext({
        role: 'staff',
        userId: '507f1f77bcf86cd799439011',
        manufacturerId: '507f1f77bcf86cd799439012',
      }),
    );
    expect(ok).toBe(true);
  });

  it('denies staff when only sibling nested permission is granted', async () => {
    (reflector.getAllAndOverride as jest.Mock)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(['products:uncertified:view']);
    (rbacService.getStaffPermissions as jest.Mock).mockResolvedValue([
      'products:certified:view',
    ]);

    await expect(
      guard.canActivate(
        makeContext({
          role: 'staff',
          userId: '507f1f77bcf86cd799439011',
          manufacturerId: '507f1f77bcf86cd799439012',
        }),
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});

