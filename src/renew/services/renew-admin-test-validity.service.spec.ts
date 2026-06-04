import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { RenewAdminTestValidityService } from './renew-admin-test-validity.service';
import { Product } from '../../product-registration/schemas/product.schema';
import { RenewalCycleService } from './renewal-cycle.service';
import { ActivityLogService } from '../../activity-log/activity-log.service';
import {
  PRODUCT_RENEW_STATUS,
  RENEWAL_URN_STATUS,
} from '../constants/renewal-urn-status.constants';
import { RenewalCycleStatus } from '../schemas/renewal-cycle.schema';

describe('RenewAdminTestValidityService', () => {
  let service: RenewAdminTestValidityService;
  const closeInProgressAndCreateNextCycle = jest.fn();
  const logActivity = jest.fn();

  const urnNo = 'URN-20260528142848';
  const vendorId = new Types.ObjectId();
  const manufacturerId = new Types.ObjectId();
  const newCycleId = new Types.ObjectId();

  let countDocuments: jest.Mock;
  let updateMany: jest.Mock;
  let findOneLean: jest.Mock;

  beforeEach(async () => {
    closeInProgressAndCreateNextCycle.mockReset();
    logActivity.mockReset().mockResolvedValue(undefined);
    closeInProgressAndCreateNextCycle.mockResolvedValue({
      _id: newCycleId,
      cycleNo: 2,
      status: RenewalCycleStatus.IN_PROGRESS,
      paymentId: null,
    });

    countDocuments = jest.fn().mockResolvedValue(1);
    updateMany = jest.fn().mockResolvedValue({ modifiedCount: 1 });
    findOneLean = jest
      .fn()
      .mockResolvedValueOnce({
        vendorId,
        manufacturerId,
      })
      .mockResolvedValue({
        urnStatus: RENEWAL_URN_STATUS.PAYMENT_PENDING,
        productRenewStatus: PRODUCT_RENEW_STATUS.NOT_RENEWED,
        renewCycleNo: 2,
      });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RenewAdminTestValidityService,
        {
          provide: getModelToken(Product.name),
          useValue: {
            countDocuments,
            updateMany,
            findOne: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                lean: jest.fn().mockReturnValue({
                  exec: findOneLean,
                }),
              }),
            }),
          },
        },
        {
          provide: getConnectionToken(),
          useValue: {
            startSession: jest.fn().mockResolvedValue({
              startTransaction: jest.fn(() => {
                throw new Error(
                  'Transaction numbers are only allowed on a replica set member or mongos',
                );
              }),
              commitTransaction: jest.fn(),
              abortTransaction: jest.fn().mockResolvedValue(undefined),
              endSession: jest.fn(),
            }),
          },
        },
        {
          provide: RenewalCycleService,
          useValue: { closeInProgressAndCreateNextCycle },
        },
        {
          provide: ActivityLogService,
          useValue: { logActivity },
        },
      ],
    }).compile();

    service = module.get(RenewAdminTestValidityService);
  });

  it('starts a new cycle, sets urn_status 12 and product_renew_status 0', async () => {
    const result = await service.applyTestValidity(
      {
        urnNo,
        validTillDate: '2026-03-01',
        startNewRenewalCycle: true,
      },
      String(new Types.ObjectId()),
    );

    expect(closeInProgressAndCreateNextCycle).toHaveBeenCalledWith(
      expect.objectContaining({
        urnNo,
        urnStatusAtStart: RENEWAL_URN_STATUS.PAYMENT_PENDING,
      }),
    );

    expect(updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ urnNo }),
      expect.objectContaining({
        $set: expect.objectContaining({
          urnStatus: RENEWAL_URN_STATUS.PAYMENT_PENDING,
          productRenewStatus: PRODUCT_RENEW_STATUS.NOT_RENEWED,
          renewCycleNo: 2,
        }),
        $unset: { renewedDate: '' },
      }),
      expect.any(Object),
    );

    expect(result.success).toBe(true);
    expect(result.urnStatus).toBe(12);
    expect(result.productRenewStatus).toBe(0);
    expect(result.renewCycleNo).toBe(2);
    expect(result.renewContext).toMatchObject({
      renewalCycleId: String(newCycleId),
      urnStatus: 12,
      productRenewStatus: 0,
      activeRenewalCycle: {
        id: String(newCycleId),
        cycleNo: 2,
        status: RenewalCycleStatus.IN_PROGRESS,
      },
    });
    expect(logActivity).toHaveBeenCalledWith(
      expect.objectContaining({ activity: 'Test renewal cycle started' }),
    );
  });

  it('rejects when startNewRenewalCycle is false', async () => {
    await expect(
      service.applyTestValidity(
        { urnNo, validTillDate: '2026-03-01', startNewRenewalCycle: false },
        'admin-id',
      ),
    ).rejects.toThrow(BadRequestException);
    expect(closeInProgressAndCreateNextCycle).not.toHaveBeenCalled();
  });
});
