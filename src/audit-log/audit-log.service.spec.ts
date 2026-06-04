import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AuditLogService } from './audit-log.service';
import { AUDIT_ACTION } from './audit-actions';
import { AuditLog } from './schemas/audit-log.schema';
import { Category } from '../categories/schemas/category.schema';
import { Sector } from '../sectors/schemas/sector.schema';
import { Manufacturer } from '../manufacturers/schemas/manufacturer.schema';
import { Country } from '../countries/schemas/country.schema';
import { State } from '../states/schemas/state.schema';
import { Standard } from '../standards/schemas/standard.schema';
import { Product } from '../product-registration/schemas/product.schema';
import { Role } from '../rbac/schemas/role.schema';
import { VendorUser } from '../vendor-users/schemas/vendor-user.schema';

describe('AuditLogService', () => {
  let service: AuditLogService;
  const createMock = jest.fn().mockResolvedValue({ _id: 'x' });
  const execMock = jest.fn().mockResolvedValue([]);
  const countDocumentsMock = jest.fn().mockReturnValue({ exec: execMock });
  const auditFindExecMock = jest.fn();
  const auditFindMock = jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: auditFindExecMock,
  });
  const lookupModelMock = {
    find: jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
    }),
  };

  beforeEach(async () => {
    createMock.mockClear();
    execMock.mockClear();
    countDocumentsMock.mockClear();
    auditFindMock.mockClear();
    auditFindExecMock.mockReset();
    auditFindExecMock.mockResolvedValue([]);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogService,
        {
          provide: getModelToken(AuditLog.name),
          useValue: {
            create: createMock,
            find: auditFindMock,
            countDocuments: countDocumentsMock,
          },
        },
        { provide: getModelToken(Category.name), useValue: lookupModelMock },
        { provide: getModelToken(Sector.name), useValue: lookupModelMock },
        { provide: getModelToken(Manufacturer.name), useValue: lookupModelMock },
        { provide: getModelToken(Country.name), useValue: lookupModelMock },
        { provide: getModelToken(State.name), useValue: lookupModelMock },
        { provide: getModelToken(Standard.name), useValue: lookupModelMock },
        { provide: getModelToken(Product.name), useValue: lookupModelMock },
        { provide: getModelToken(Role.name), useValue: lookupModelMock },
        { provide: getModelToken(VendorUser.name), useValue: lookupModelMock },
      ],
    }).compile();

    service = module.get<AuditLogService>(AuditLogService);
  });

  it('inserts audit document on record()', async () => {
    await service.record({
      action: AUDIT_ACTION.HTTP_MUTATION,
      outcome: 'success',
      http_method: 'POST',
      route: '/test',
      status_code: 200,
    });
    expect(createMock).toHaveBeenCalledTimes(1);
    expect(createMock.mock.calls[0][0].action).toBe(AUDIT_ACTION.HTTP_MUTATION);
  });

  it('does not throw when create fails', async () => {
    createMock.mockRejectedValueOnce(new Error('db down'));
    await expect(
      service.record({
        action: AUDIT_ACTION.AUTH_LOGIN,
        outcome: 'failure',
      }),
    ).resolves.toBeUndefined();
  });

  it('maps updateStatusTo to a display label in list new_values', async () => {
    auditFindExecMock.mockResolvedValueOnce([
      {
        action: AUDIT_ACTION.PRODUCT_URN_STATUS_UPDATED,
        outcome: 'success',
        new_values: { updateStatusTo: 11 },
      },
    ]);
    execMock.mockResolvedValueOnce(1);

    const result = await service.list({});

    expect(result.items[0].new_values).toEqual({
      updateStatusTo: 'Certification Fee Approved',
    });
  });
});
