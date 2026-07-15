import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { Manufacturer } from '../manufacturers/schemas/manufacturer.schema';
import { LifecycleNotificationService } from '../notifications/lifecycle-notification.service';
import { GrievancesService } from './grievances.service';
import { Grievance, GrievanceStatus } from './schemas/grievance.schema';

describe('GrievancesService', () => {
  let service: GrievancesService;

  const vendorId = new Types.ObjectId().toString();
  const adminUserId = new Types.ObjectId().toString();
  const grievanceId = new Types.ObjectId().toString();

  const findMock = jest.fn();
  const findOneMock = jest.fn();
  const findByIdMock = jest.fn();
  const countDocumentsMock = jest.fn();
  const saveMock = jest.fn();

  const manufacturerFindMock = jest.fn();

  const lifecycleNotification = {
    notifyGrievanceCreated: jest.fn().mockResolvedValue(undefined),
    notifyGrievanceResponded: jest.fn().mockResolvedValue(undefined),
    notifyGrievanceClosed: jest.fn().mockResolvedValue(undefined),
  };

  const GrievanceModelMock = jest.fn().mockImplementation((data) => {
    const doc = {
      ...data,
      _id: new Types.ObjectId(grievanceId),
      grievanceNo: 'GRV-000001',
      adminResponse: data.adminResponse ?? '',
      status: data.status ?? GrievanceStatus.Pending,
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

  GrievanceModelMock.find = findMock;
  GrievanceModelMock.findOne = findOneMock;
  GrievanceModelMock.findById = findByIdMock;
  GrievanceModelMock.countDocuments = countDocumentsMock;

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
        GrievancesService,
        { provide: getModelToken(Grievance.name), useValue: GrievanceModelMock },
        {
          provide: getModelToken(Manufacturer.name),
          useValue: { find: manufacturerFindMock },
        },
        {
          provide: LifecycleNotificationService,
          useValue: lifecycleNotification,
        },
      ],
    }).compile();

    service = module.get(GrievancesService);
  });

  describe('findAllForVendor', () => {
    it('lists grievances for a valid vendor id', async () => {
      const rows = [{ grievanceNo: 'GRV-000001' }];
      chainFind(rows);

      const result = await service.findAllForVendor(vendorId);

      expect(result).toEqual(rows);
      expect(findMock).toHaveBeenCalledWith({
        vendorId: expect.any(Types.ObjectId),
      });
    });

    it('rejects invalid vendor id', async () => {
      await expect(service.findAllForVendor('bad-id')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('findOneForVendor', () => {
    it('returns grievance owned by vendor', async () => {
      const doc = { _id: grievanceId, subject: 'Data access' };
      chainFindOne(doc);

      await expect(
        service.findOneForVendor(grievanceId, vendorId),
      ).resolves.toEqual(doc);
    });

    it('throws NotFound when grievance missing', async () => {
      chainFindOne(null);

      await expect(
        service.findOneForVendor(grievanceId, vendorId),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('rejects invalid grievance id', async () => {
      await expect(
        service.findOneForVendor('not-an-id', vendorId),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('createForVendor', () => {
    it('creates a Pending grievance and notifies', async () => {
      const saved = await service.createForVendor(vendorId, {
        category: ' Data access ',
        subject: ' Unauthorized processing ',
        description: ' Details under DPDP ',
        attachment: ' uploads/g.pdf ',
      });

      expect(GrievanceModelMock).toHaveBeenCalledWith(
        expect.objectContaining({
          category: 'Data access',
          subject: 'Unauthorized processing',
          description: 'Details under DPDP',
          attachment: 'uploads/g.pdf',
          status: GrievanceStatus.Pending,
        }),
      );
      expect(saved.grievanceNo).toBe('GRV-000001');
      expect(lifecycleNotification.notifyGrievanceCreated).toHaveBeenCalledWith(
        expect.objectContaining({
          manufacturerId: vendorId,
          grievanceNo: 'GRV-000001',
          subject: expect.any(String),
          category: expect.any(String),
        }),
      );
    });

    it('omits attachment when not provided', async () => {
      await service.createForVendor(vendorId, {
        category: 'Privacy',
        subject: 'Subject',
        description: 'Description',
      });

      expect(GrievanceModelMock).toHaveBeenCalledWith(
        expect.not.objectContaining({ attachment: expect.anything() }),
      );
    });
  });

  describe('findAllForAdmin', () => {
    it('returns paginated items with vendor enrichment', async () => {
      const vendorObjectId = new Types.ObjectId(vendorId);
      chainFind([
        {
          _id: new Types.ObjectId(grievanceId),
          vendorId: vendorObjectId,
          subject: 'S1',
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
            manufacturerName: 'Acme Green',
            vendor_name: 'Acme',
          },
        ]),
      });

      const result = await service.findAllForAdmin({
        page: 1,
        limit: 10,
        status: GrievanceStatus.Pending,
      });

      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.items[0].vendorName).toBe('Acme Green');
    });

    it('applies search / category / date filters without throwing', async () => {
      chainFind([]);
      countDocumentsMock.mockReturnValue({
        exec: jest.fn().mockResolvedValue(0),
      });

      const result = await service.findAllForAdmin({
        search: 'GRV-0001',
        category: 'Data access',
        from: '2026-01-01',
        to: '2026-12-31',
        page: 2,
        limit: 5,
      });

      expect(result.page).toBe(2);
      expect(result.limit).toBe(5);
      expect(result.items).toEqual([]);
      expect(findMock).toHaveBeenCalled();
    });
  });

  describe('findOneForAdmin', () => {
    it('returns grievance with vendor details', async () => {
      const vendorObjectId = new Types.ObjectId(vendorId);
      chainFindById(
        {
          _id: new Types.ObjectId(grievanceId),
          vendorId: vendorObjectId,
          subject: 'S1',
        },
        true,
      );
      manufacturerFindMock.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([
          {
            _id: vendorObjectId,
            manufacturerName: 'Vendor Co',
            vendor_email: 'v@example.com',
            vendor_phone: '9999999999',
          },
        ]),
      });

      const result = await service.findOneForAdmin(grievanceId);

      expect(result.vendorName).toBe('Vendor Co');
      expect(result.vendorEmail).toBe('v@example.com');
    });

    it('throws NotFound when missing', async () => {
      chainFindById(null, true);

      await expect(service.findOneForAdmin(grievanceId)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('respondForAdmin', () => {
    const buildDoc = (overrides: Record<string, unknown> = {}) => ({
      _id: new Types.ObjectId(grievanceId),
      vendorId: new Types.ObjectId(vendorId),
      grievanceNo: 'GRV-000001',
      subject: 'Subject',
      category: 'Privacy',
      status: GrievanceStatus.Pending,
      adminResponse: '',
      save: saveMock,
      ...overrides,
    });

    it('submits first response as Responded and notifies', async () => {
      const doc = buildDoc();
      chainFindById(doc);
      saveMock.mockImplementation(async () => doc);

      const saved = await service.respondForAdmin(
        grievanceId,
        {
          adminResponse: 'We have reviewed your request.',
          status: GrievanceStatus.Responded,
        },
        adminUserId,
      );

      expect(saved.status).toBe(GrievanceStatus.Responded);
      expect(saved.adminResponse).toBe('We have reviewed your request.');
      expect(
        lifecycleNotification.notifyGrievanceResponded,
      ).toHaveBeenCalled();
    });

    it('submits first response as Closed and notifies closed', async () => {
      const doc = buildDoc();
      chainFindById(doc);
      saveMock.mockImplementation(async () => {
        doc.status = GrievanceStatus.Closed;
        return doc;
      });

      await service.respondForAdmin(
        grievanceId,
        {
          adminResponse: 'Resolved and closed.',
          status: GrievanceStatus.Closed,
        },
        adminUserId,
      );

      expect(lifecycleNotification.notifyGrievanceClosed).toHaveBeenCalled();
    });

    it('closes an already-responded grievance without changing response', async () => {
      const doc = buildDoc({
        adminResponse: 'Prior response',
        status: GrievanceStatus.Responded,
      });
      chainFindById(doc);
      saveMock.mockImplementation(async () => doc);

      await service.respondForAdmin(
        grievanceId,
        {
          adminResponse: 'Should be ignored',
          status: GrievanceStatus.Closed,
        },
        adminUserId,
      );

      expect(doc.adminResponse).toBe('Prior response');
      expect(doc.status).toBe(GrievanceStatus.Closed);
      expect(lifecycleNotification.notifyGrievanceClosed).toHaveBeenCalled();
    });

    it('rejects empty response on first reply', async () => {
      chainFindById(buildDoc());

      await expect(
        service.respondForAdmin(
          grievanceId,
          { adminResponse: '   ', status: GrievanceStatus.Responded },
          adminUserId,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejects second Responded when response already exists', async () => {
      chainFindById(
        buildDoc({
          adminResponse: 'Already replied',
          status: GrievanceStatus.Responded,
        }),
      );

      await expect(
        service.respondForAdmin(
          grievanceId,
          {
            adminResponse: 'Another reply',
            status: GrievanceStatus.Responded,
          },
          adminUserId,
        ),
      ).rejects.toThrow(/already been submitted/i);
    });

    it('rejects updates on Closed grievances', async () => {
      chainFindById(buildDoc({ status: GrievanceStatus.Closed }));

      await expect(
        service.respondForAdmin(
          grievanceId,
          {
            adminResponse: 'Too late',
            status: GrievanceStatus.Closed,
          },
          adminUserId,
        ),
      ).rejects.toBeInstanceOf(ConflictException);

      await expect(
        service.respondForAdmin(
          grievanceId,
          {
            adminResponse: 'Too late',
            status: GrievanceStatus.Responded,
          },
          adminUserId,
        ),
      ).rejects.toThrow(/closed and cannot be modified/i);
    });

    it('throws NotFound when grievance missing', async () => {
      chainFindById(null);

      await expect(
        service.respondForAdmin(
          grievanceId,
          {
            adminResponse: 'Hello',
            status: GrievanceStatus.Responded,
          },
          adminUserId,
        ),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
