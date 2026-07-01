import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RbacService } from './rbac.service';

describe('RbacService', () => {
  const roleModel: any = {
    findOne: jest.fn(),
    create: jest.fn(),
  };
  const mappingModel: any = {
    findOneAndUpdate: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(0),
    }),
  };
  const vendorUserModel: any = {
    findOne: jest.fn(),
    findById: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({ type: 'staff' }),
        }),
      }),
    }),
  };
  const vendorUsersService: any = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };
  const emailService: any = {
    sendStaffCredentialsEmail: jest.fn(),
  };
  const configService: any = {
    get: jest.fn().mockReturnValue('120'),
  };
  const redisService: any = {
    buildKey: jest.fn().mockReturnValue('rbac:test:*'),
    deleteByPattern: jest.fn().mockResolvedValue(0),
    get: jest.fn(),
    set: jest.fn().mockResolvedValue('OK'),
  };

  const service = new RbacService(
    roleModel,
    mappingModel,
    vendorUserModel,
    vendorUsersService,
    emailService,
    configService,
    redisService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('stores minimal permissions: aliases, dedupe, and parent drops implied children', async () => {
    roleModel.create.mockResolvedValue({ _id: 'new' });
    await service.createRole('507f1f77bcf86cd799439012', {
      name: 'Test role',
      permissions: [
        'contacts.view',
        'inquiries:view',
        'products:view',
        'products:certified:view',
      ],
    });
    expect(roleModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        permissions: ['inquiries:view', 'products:view'],
      }),
    );
  });

  it('effectivePermissionsFromRaw expands parent grants to known child keys', () => {
    const eff = service.effectivePermissionsFromRaw(['products:view']);
    expect(eff).toContain('products:certified:view');
    expect(eff).toContain('products:uncertified:view');
    expect(eff).not.toContain('products:add');
  });

  it('getStaffPermissions unions normalized grants from every active mapped role', async () => {
    redisService.get.mockResolvedValue(null);
    const execMappings = jest.fn().mockResolvedValue([
      { roleId: { permissions: ['dashboard:view', 'products:view'], status: 1 } },
      { roleId: { permissions: ['inquiries:view'], status: 1 } },
    ]);
    mappingModel.find.mockReturnValue({
      populate: () => ({
        lean: () => ({ exec: execMappings }),
      }),
    });

    const uid = '507f1f77bcf86cd799439099';
    const grants = await service.getStaffPermissions(undefined, uid);
    expect(grants).toContain('products:view');
    expect(grants).toContain('inquiries:view');
    expect(mappingModel.find).toHaveBeenCalled();
  });

  it('rejects role assignment when staff user is not found', async () => {
    vendorUserModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    roleModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue({ _id: 'r1', status: 1 }),
    });

    await expect(
      service.assignRole(undefined, {
        vendorUserId: '507f1f77bcf86cd799439013',
        roleId: '507f1f77bcf86cd799439014',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('sends credentials email when staff is created', async () => {
    vendorUsersService.findByEmail.mockResolvedValue(null);
    vendorUsersService.create.mockResolvedValue({ _id: 'staff1' });
    emailService.sendStaffCredentialsEmail.mockResolvedValue(undefined);

    await service.createStaff(undefined, {
      name: 'Staff User',
      email: 'staff@example.com',
      phone: '9999999999',
      password: 'Pass@123',
    });

    expect(vendorUsersService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'staff',
        email: 'staff@example.com',
      }),
    );
    expect(emailService.sendStaffCredentialsEmail).toHaveBeenCalledWith(
      'staff@example.com',
      'Pass@123',
      'Staff User',
    );
  });
});

