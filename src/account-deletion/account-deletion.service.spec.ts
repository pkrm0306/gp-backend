import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { Manufacturer } from '../manufacturers/schemas/manufacturer.schema';
import { LifecycleNotificationService } from '../notifications/lifecycle-notification.service';
import { AccountDeletionService } from './account-deletion.service';
import {
  AccountDeletionRequest,
  AccountDeletionStatus,
} from './schemas/account-deletion-request.schema';

describe('AccountDeletionService', () => {
  let service: AccountDeletionService;

  const vendorId = new Types.ObjectId().toString();
  const adminUserId = new Types.ObjectId().toString();
  const requestId = new Types.ObjectId().toString();

  const findMock = jest.fn();
  const findOneMock = jest.fn();
  const findByIdMock = jest.fn();
  const countDocumentsMock = jest.fn();
  const saveMock = jest.fn();

  const manufacturerFindMock = jest.fn();
  const softDeleteAccountAfterDeletionRequest = jest
    .fn()
    .mockResolvedValue({ _id: vendorId, vendor_status: 0 });

  const lifecycleNotification = {
    notifyAccountDeletionRequested: jest.fn().mockResolvedValue(undefined),
    notifyAccountDeletionApproved: jest.fn().mockResolvedValue(undefined),
    notifyAccountDeletionRejected: jest.fn().mockResolvedValue(undefined),
    notifyAccountDeletionCompleted: jest.fn().mockResolvedValue(undefined),
  };

  const AccountDeletionModelMock = jest.fn().mockImplementation((data) => {
    const doc = {
      ...data,
      _id: new Types.ObjectId(requestId),
      requestNo: 'ADR-000001',
      status: data.status ?? AccountDeletionStatus.Requested,
      save: saveMock,
    };
    saveMock.mockResolvedValue(doc);
    return doc;
  }) as jest.Mock & {
    find: typeof findMock;
    findOne: typeof findOneMock;
    findById: typeof findByIdMock;
    countDocuments: typeof countDocumentsMock;
  };

  AccountDeletionModelMock.find = findMock;
  AccountDeletionModelMock.findOne = findOneMock;
  AccountDeletionModelMock.findById = findByIdMock;
  AccountDeletionModelMock.countDocuments = countDocumentsMock;

  const chainFind = (result: unknown) =>
    findMock.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(result),
    });

  const chainFindOne = (result: unknown) =>
    findOneMock.mockReturnValue({
      exec: jest.fn().mockResolvedValue(result),
    });

  const chainFindById = (result: unknown, lean = false) => {
    if (lean) {
      findByIdMock.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(result),
      });
      return;
    }
    findByIdMock.mockReturnValue({
      exec: jest.fn().mockResolvedValue(result),
    });
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    saveMock.mockReset();
    softDeleteAccountAfterDeletionRequest.mockResolvedValue({
      _id: vendorId,
      vendor_status: 0,
    });
    countDocumentsMock.mockReturnValue({
      exec: jest.fn().mockResolvedValue(0),
    });
    manufacturerFindMock.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountDeletionService,
        {
          provide: getModelToken(AccountDeletionRequest.name),
          useValue: AccountDeletionModelMock,
        },
        {
          provide: getModelToken(Manufacturer.name),
          useValue: { find: manufacturerFindMock },
        },
        {
          provide: ManufacturersService,
          useValue: { softDeleteAccountAfterDeletionRequest },
        },
        {
          provide: LifecycleNotificationService,
          useValue: lifecycleNotification,
        },
      ],
    }).compile();

    service = module.get(AccountDeletionService);
  });

  describe('findAllForVendor', () => {
    it('lists deletion requests for vendor', async () => {
      const rows = [{ requestNo: 'ADR-000001' }];
      chainFind(rows);

      await expect(service.findAllForVendor(vendorId)).resolves.toEqual(rows);
    });

    it('rejects invalid vendor id', async () => {
      await expect(service.findAllForVendor('x')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('findOneForVendor', () => {
    it('returns request owned by vendor', async () => {
      const doc = { _id: requestId, reason: 'Privacy concerns' };
      chainFindOne(doc);

      await expect(
        service.findOneForVendor(requestId, vendorId),
      ).resolves.toEqual(doc);
    });

    it('throws NotFound when missing', async () => {
      chainFindOne(null);

      await expect(
        service.findOneForVendor(requestId, vendorId),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('createForVendor', () => {
    it('creates Requested deletion request and notifies', async () => {
      chainFindOne(null);

      const saved = await service.createForVendor(vendorId, {
        reason: 'Privacy concerns',
        description: ' Optional details ',
        confirmed: true,
      });

      expect(AccountDeletionModelMock).toHaveBeenCalledWith(
        expect.objectContaining({
          reason: 'Privacy concerns',
          description: 'Optional details',
          confirmed: true,
          status: AccountDeletionStatus.Requested,
        }),
      );
      expect(saved.requestNo).toBe('ADR-000001');
      expect(
        lifecycleNotification.notifyAccountDeletionRequested,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          manufacturerId: vendorId,
          requestNo: 'ADR-000001',
        }),
      );
    });

    it('blocks second open request while Requested/Approved exists', async () => {
      chainFindOne({
        requestNo: 'ADR-000001',
        status: AccountDeletionStatus.Requested,
      });

      await expect(
        service.createForVendor(vendorId, {
          reason: 'Duplicate account',
          confirmed: true,
        }),
      ).rejects.toThrow(/already have an open account deletion request/i);
    });
  });

  describe('findAllForAdmin', () => {
    it('returns paginated list with vendor name', async () => {
      const vendorObjectId = new Types.ObjectId(vendorId);
      chainFind([
        {
          _id: new Types.ObjectId(requestId),
          vendorId: vendorObjectId,
          reason: 'Privacy concerns',
        },
      ]);
      countDocumentsMock.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });
      manufacturerFindMock.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([
          {
            _id: vendorObjectId,
            manufacturerName: 'GreenCo',
          },
        ]),
      });

      const result = await service.findAllForAdmin({
        page: 1,
        limit: 10,
        status: AccountDeletionStatus.Requested,
      });

      expect(result.total).toBe(1);
      expect(result.items[0].vendorName).toBe('GreenCo');
    });

    it('supports search, reason, and date filters', async () => {
      chainFind([]);
      countDocumentsMock.mockReturnValue({
        exec: jest.fn().mockResolvedValue(0),
      });

      const result = await service.findAllForAdmin({
        search: 'ADR-0001',
        reason: 'Privacy concerns',
        from: '2026-01-01',
        to: '2026-12-31',
      });

      expect(result.items).toEqual([]);
      expect(findMock).toHaveBeenCalled();
    });
  });

  describe('findOneForAdmin', () => {
    it('returns request with vendor details', async () => {
      const vendorObjectId = new Types.ObjectId(vendorId);
      chainFindById(
        {
          _id: new Types.ObjectId(requestId),
          vendorId: vendorObjectId,
          reason: 'Privacy concerns',
        },
        true,
      );
      manufacturerFindMock.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([
          {
            _id: vendorObjectId,
            manufacturerName: 'GreenCo',
            vendor_email: 'g@example.com',
          },
        ]),
      });

      const result = await service.findOneForAdmin(requestId);
      expect(result.vendorName).toBe('GreenCo');
      expect(result.vendorEmail).toBe('g@example.com');
    });

    it('throws NotFound when missing', async () => {
      chainFindById(null, true);

      await expect(service.findOneForAdmin(requestId)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('reviewForAdmin', () => {
    const buildDoc = (overrides: Record<string, unknown> = {}) => ({
      _id: new Types.ObjectId(requestId),
      vendorId: new Types.ObjectId(vendorId),
      requestNo: 'ADR-000001',
      reason: 'Privacy concerns',
      status: AccountDeletionStatus.Requested,
      adminRemarks: '',
      save: saveMock,
      ...overrides,
    });

    it('approves a Requested item and notifies', async () => {
      const doc = buildDoc();
      chainFindById(doc);
      saveMock.mockImplementation(async () => doc);

      const saved = await service.reviewForAdmin(
        requestId,
        { status: AccountDeletionStatus.Approved, adminRemarks: 'OK' },
        adminUserId,
      );

      expect(saved.status).toBe(AccountDeletionStatus.Approved);
      expect(softDeleteAccountAfterDeletionRequest).not.toHaveBeenCalled();
      expect(
        lifecycleNotification.notifyAccountDeletionApproved,
      ).toHaveBeenCalled();
    });

    it('rejects a Requested item with required remarks', async () => {
      const doc = buildDoc();
      chainFindById(doc);
      saveMock.mockImplementation(async () => doc);

      const saved = await service.reviewForAdmin(
        requestId,
        {
          status: AccountDeletionStatus.Rejected,
          adminRemarks: 'Insufficient justification',
        },
        adminUserId,
      );

      expect(saved.status).toBe(AccountDeletionStatus.Rejected);
      expect(
        lifecycleNotification.notifyAccountDeletionRejected,
      ).toHaveBeenCalled();
    });

    it('requires remarks when rejecting', async () => {
      chainFindById(buildDoc());

      await expect(
        service.reviewForAdmin(
          requestId,
          { status: AccountDeletionStatus.Rejected, adminRemarks: '  ' },
          adminUserId,
        ),
      ).rejects.toThrow(/remarks are required/i);
    });

    it('completes an Approved request with soft-delete outcomes', async () => {
      const doc = buildDoc({ status: AccountDeletionStatus.Approved });
      chainFindById(doc);
      saveMock.mockImplementation(async () => {
        doc.status = AccountDeletionStatus.Completed;
        return doc;
      });

      const saved = await service.reviewForAdmin(
        requestId,
        { status: AccountDeletionStatus.Completed },
        adminUserId,
      );

      expect(softDeleteAccountAfterDeletionRequest).toHaveBeenCalledWith(
        vendorId,
      );
      expect(saved.status).toBe(AccountDeletionStatus.Completed);
      expect(
        lifecycleNotification.notifyAccountDeletionCompleted,
      ).toHaveBeenCalled();
    });

    it('does not complete unless current status is Approved', async () => {
      chainFindById(buildDoc({ status: AccountDeletionStatus.Requested }));

      await expect(
        service.reviewForAdmin(
          requestId,
          { status: AccountDeletionStatus.Completed },
          adminUserId,
        ),
      ).rejects.toThrow(/Only approved requests can be marked Completed/i);
      expect(softDeleteAccountAfterDeletionRequest).not.toHaveBeenCalled();
    });

    it('does not approve unless current status is Requested', async () => {
      chainFindById(buildDoc({ status: AccountDeletionStatus.Approved }));

      await expect(
        service.reviewForAdmin(
          requestId,
          { status: AccountDeletionStatus.Approved },
          adminUserId,
        ),
      ).rejects.toThrow(/Only requests with status Requested can be approved/i);
    });

    it('blocks review of already Rejected requests', async () => {
      chainFindById(buildDoc({ status: AccountDeletionStatus.Rejected }));

      await expect(
        service.reviewForAdmin(
          requestId,
          { status: AccountDeletionStatus.Approved },
          adminUserId,
        ),
      ).rejects.toThrow(/already Rejected/i);
    });

    it('blocks review of already Completed requests', async () => {
      chainFindById(buildDoc({ status: AccountDeletionStatus.Completed }));

      await expect(
        service.reviewForAdmin(
          requestId,
          { status: AccountDeletionStatus.Approved },
          adminUserId,
        ),
      ).rejects.toThrow(/already Completed/i);
    });

    it('throws NotFound when request missing', async () => {
      chainFindById(null);

      await expect(
        service.reviewForAdmin(
          requestId,
          { status: AccountDeletionStatus.Approved },
          adminUserId,
        ),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
