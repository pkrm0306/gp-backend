import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { PRODUCT_STATUS_CERTIFIED } from '../renew/constants/product-status.constants';
import { SpocAllocationEmailService } from './email/spoc-allocation-email.service';
import { SpocAllocationRepository } from './repository/spoc-allocation.repository';
import { SpocAllocationService } from './service/spoc-allocation.service';

describe('SpocAllocationService regression', () => {
  let service: SpocAllocationService;

  const actorId = '507f1f77bcf86cd799439011';
  const spocId = '507f1f77bcf86cd799439022';
  const otherSpocId = '507f1f77bcf86cd799439033';
  const vendorId = '507f1f77bcf86cd799439044';
  const productId = 1001;

  const activeSpoc = {
    _id: new Types.ObjectId(spocId),
    name: 'Alex Spoc',
    email: 'alex@greenpro.test',
    phone: '999',
    designation: 'Analyst',
    status: 1,
    type: 'staff',
  };

  const otherSpoc = {
    _id: new Types.ObjectId(otherSpocId),
    name: 'Blake Spoc',
    email: 'blake@greenpro.test',
    phone: '888',
    designation: 'Lead',
    status: 1,
    type: 'staff',
  };

  const pendingProduct = {
    productId,
    urnNo: 'URN-1001',
    productName: 'Eco Tile',
    manufacturerId: new Types.ObjectId(vendorId),
    vendorId: new Types.ObjectId(vendorId),
    productStatus: 0,
  };

  const repository = {
    listActiveStaffMembers: jest.fn(),
    findTeamMemberById: jest.fn(),
    findStaffNamesByIds: jest.fn(),
    findAssignableProduct: jest.fn(),
    findManufacturerName: jest.fn(),
    findActiveAllocationByProductId: jest.fn(),
    findActiveAllocationSummary: jest.fn(),
    findActiveAllocationsByProductIds: jest.fn(),
    createAllocation: jest.fn(),
    createHistory: jest.fn(),
    claimHistoryEmailSlot: jest.fn(),
  };

  const spocEmail = {
    notifyAfterSuccess: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    repository.findManufacturerName.mockResolvedValue({
      manufacturerName: 'Acme Vendor',
      vendor_name: 'Acme Vendor',
    });
    repository.createHistory.mockImplementation(async (doc: Record<string, unknown>) => ({
      _id: new Types.ObjectId(),
      ...doc,
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpocAllocationService,
        { provide: SpocAllocationRepository, useValue: repository },
        { provide: SpocAllocationEmailService, useValue: spocEmail },
      ],
    }).compile();

    service = module.get(SpocAllocationService);
  });

  describe('validations', () => {
    it('rejects inactive team members', async () => {
      repository.findAssignableProduct.mockResolvedValue(pendingProduct);
      repository.findActiveAllocationSummary.mockResolvedValue(null);
      repository.findTeamMemberById.mockResolvedValue({ ...activeSpoc, status: 0 });

      await expect(
        service.assign({ productId, spocId }, actorId),
      ).rejects.toMatchObject({
        response: expect.objectContaining({
          code: 'VALIDATION_ERROR',
          fieldErrors: expect.objectContaining({
            spocId: expect.stringMatching(/active team members/i),
          }),
        }),
      });
      expect(repository.createAllocation).not.toHaveBeenCalled();
      expect(spocEmail.notifyAfterSuccess).not.toHaveBeenCalled();
    });

    it('rejects Certified products', async () => {
      repository.findAssignableProduct.mockResolvedValue({
        ...pendingProduct,
        productStatus: PRODUCT_STATUS_CERTIFIED,
      });

      await expect(
        service.assign({ productId, spocId }, actorId),
      ).rejects.toMatchObject({
        response: expect.objectContaining({
          code: 'VALIDATION_ERROR',
          message: 'Product must not be Certified',
        }),
      });
      expect(repository.createAllocation).not.toHaveBeenCalled();
    });

    it('rejects assigning the same SPOC again on reassign', async () => {
      repository.findAssignableProduct.mockResolvedValue(pendingProduct);
      repository.findActiveAllocationByProductId.mockResolvedValue({
        _id: new Types.ObjectId(),
        productId,
        urn: 'URN-1001',
        vendorId: new Types.ObjectId(vendorId),
        spocId: new Types.ObjectId(spocId),
        save: jest.fn(),
        toObject: jest.fn(),
      });
      repository.findTeamMemberById.mockResolvedValue(activeSpoc);

      await expect(
        service.reassign({ productId, spocId }, actorId),
      ).rejects.toMatchObject({
        response: expect.objectContaining({
          code: 'VALIDATION_ERROR',
          fieldErrors: expect.objectContaining({
            spocId: 'This SPOC is already assigned to this product',
          }),
        }),
      });
      expect(spocEmail.notifyAfterSuccess).not.toHaveBeenCalled();
    });
  });

  describe('assignment', () => {
    it('saves allocation, writes history, and triggers email', async () => {
      repository.findAssignableProduct.mockResolvedValue(pendingProduct);
      repository.findActiveAllocationSummary.mockResolvedValue(null);
      repository.findTeamMemberById.mockResolvedValue(activeSpoc);

      const createdId = new Types.ObjectId();
      repository.createAllocation.mockResolvedValue({
        _id: createdId,
        productId,
        urn: 'URN-1001',
        vendorId: new Types.ObjectId(vendorId),
        spocId: new Types.ObjectId(spocId),
        assignedBy: new Types.ObjectId(actorId),
        isActive: true,
        toObject: () => ({
          _id: createdId,
          productId,
          urn: 'URN-1001',
          vendorId: new Types.ObjectId(vendorId),
          spocId: new Types.ObjectId(spocId),
          assignedBy: new Types.ObjectId(actorId),
          isActive: true,
        }),
      });

      const result = await service.assign(
        { productId, spocId, urn: 'URN-1001' },
        actorId,
      );

      expect(repository.createAllocation).toHaveBeenCalled();
      expect(repository.createHistory).toHaveBeenCalledWith(
        expect.objectContaining({
          allocationId: createdId,
          previousSpoc: null,
        }),
      );
      expect(spocEmail.notifyAfterSuccess).toHaveBeenCalledWith(
        expect.objectContaining({
          kind: 'assign',
          urn: 'URN-1001',
          productName: 'Eco Tile',
          vendorName: 'Acme Vendor',
        }),
      );
      expect(result.spoc?.name).toBe('Alex Spoc');
    });

    it('does not email when product already has active SPOC (conflict)', async () => {
      repository.findAssignableProduct.mockResolvedValue(pendingProduct);
      repository.findActiveAllocationSummary.mockResolvedValue({
        _id: new Types.ObjectId(),
        spocId: new Types.ObjectId(otherSpocId),
      });

      await expect(
        service.assign({ productId, spocId }, actorId),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(repository.createAllocation).not.toHaveBeenCalled();
      expect(spocEmail.notifyAfterSuccess).not.toHaveBeenCalled();
    });
  });

  describe('reassignment', () => {
    it('updates allocation, writes history, and triggers email', async () => {
      repository.findAssignableProduct.mockResolvedValue(pendingProduct);
      const save = jest.fn().mockResolvedValue(undefined);
      const allocationDoc = {
        _id: new Types.ObjectId(),
        productId,
        urn: 'URN-1001',
        vendorId: new Types.ObjectId(vendorId),
        spocId: new Types.ObjectId(spocId),
        assignedBy: new Types.ObjectId(actorId),
        isActive: true,
        save,
        toObject: () => ({
          _id: new Types.ObjectId(),
          productId,
          urn: 'URN-1001',
          vendorId: new Types.ObjectId(vendorId),
          spocId: new Types.ObjectId(otherSpocId),
          assignedBy: new Types.ObjectId(actorId),
          isActive: true,
        }),
      };
      repository.findActiveAllocationByProductId.mockResolvedValue(allocationDoc);
      repository.findTeamMemberById.mockResolvedValue(otherSpoc);

      const result = await service.reassign(
        { productId, spocId: otherSpocId },
        actorId,
      );

      expect(save).toHaveBeenCalled();
      expect(repository.createHistory).toHaveBeenCalled();
      expect(spocEmail.notifyAfterSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ kind: 'reassign', urn: 'URN-1001' }),
      );
      expect(result.spoc?.name).toBe('Blake Spoc');
    });

    it('returns NotFound when no active allocation exists', async () => {
      repository.findAssignableProduct.mockResolvedValue(pendingProduct);
      repository.findActiveAllocationByProductId.mockResolvedValue(null);

      await expect(
        service.reassign({ productId, spocId: otherSpocId }, actorId),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(spocEmail.notifyAfterSuccess).not.toHaveBeenCalled();
    });
  });

  describe('audit history + email safety', () => {
    it('does not send email when history create fails after allocation create', async () => {
      repository.findAssignableProduct.mockResolvedValue(pendingProduct);
      repository.findActiveAllocationSummary.mockResolvedValue(null);
      repository.findTeamMemberById.mockResolvedValue(activeSpoc);
      repository.createAllocation.mockResolvedValue({
        _id: new Types.ObjectId(),
        toObject: () => ({}),
      });
      repository.createHistory.mockRejectedValue(new Error('history write failed'));

      await expect(
        service.assign({ productId, spocId }, actorId),
      ).rejects.toThrow('history write failed');
      expect(spocEmail.notifyAfterSuccess).not.toHaveBeenCalled();
    });
  });

  describe('isolation smoke', () => {
    it('listActiveTeamMembers only queries staff status=1', async () => {
      repository.listActiveStaffMembers.mockResolvedValue([]);
      await service.listActiveTeamMembers();
      expect(repository.listActiveStaffMembers).toHaveBeenCalled();
    });

    it('lookupAssignedSpocNames returns empty for products without allocation', async () => {
      repository.findActiveAllocationsByProductIds.mockResolvedValue([]);
      const rows = await service.lookupAssignedSpocNames([productId, 9999]);
      expect(rows).toEqual([]);
    });
  });
});
