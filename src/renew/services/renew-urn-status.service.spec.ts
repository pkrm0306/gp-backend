import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { RenewUrnStatusService } from './renew-urn-status.service';
import { Product } from '../../product-registration/schemas/product.schema';
import { RenewalCycle } from '../schemas/renewal-cycle.schema';
import { PaymentDetails } from '../../payments/schemas/payment-details.schema';
import { ProcessRenewManufacturing } from '../schemas/process-renew-manufacturing.schema';
import { ProcessRenewWasteManagement } from '../schemas/process-renew-waste-management.schema';
import { ProcessRenewInnovation } from '../schemas/process-renew-innovation.schema';
import { ProcessRenewProductPerformance } from '../schemas/process-renew-product-performance.schema';
import { ActivityLogService } from '../../activity-log/activity-log.service';
import { RenewalOrchestrationService } from './renewal-orchestration.service';
import { RenewUrnTabReviewService } from './renew-urn-tab-review.service';
import {
  PRODUCT_RENEW_STATUS,
  RENEWAL_URN_STATUS,
} from '../constants/renewal-urn-status.constants';

describe('RenewUrnStatusService — submit for final review (17)', () => {
  let service: RenewUrnStatusService;
  const completeRenewal = jest.fn();

  const cycleId = '6a1edd713ec5008b997aca94';
  const urnNo = 'URN-20260528142848';

  beforeEach(async () => {
    completeRenewal.mockReset();
    completeRenewal.mockResolvedValue({
      urnNo,
      renewalCycleId: cycleId,
      renewCycleNo: 1,
      urnStatus: RENEWAL_URN_STATUS.COMPLETED,
      productRenewStatus: PRODUCT_RENEW_STATUS.RENEWED,
      renewedDate: new Date('2026-06-02'),
      validtillDate: new Date('2028-12-31'),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RenewUrnStatusService,
        {
          provide: getModelToken(Product.name),
          useValue: {
            findOne: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                lean: jest.fn().mockReturnValue({
                  exec: jest.fn().mockResolvedValue({
                    urnStatus: RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS,
                    productRenewStatus: PRODUCT_RENEW_STATUS.IN_PROGRESS,
                    vendorId: 'v1',
                    manufacturerId: 'm1',
                  }),
                }),
              }),
            }),
            updateMany: jest.fn(),
          },
        },
        {
          provide: getModelToken(RenewalCycle.name),
          useValue: {
            findById: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue({ _id: cycleId, urnNo }),
            }),
            findOne: jest.fn().mockReturnValue({
              sort: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue({ _id: cycleId, urnNo }),
              }),
            }),
          },
        },
        { provide: getModelToken(PaymentDetails.name), useValue: {} },
        { provide: getModelToken(ProcessRenewManufacturing.name), useValue: {} },
        { provide: getModelToken(ProcessRenewWasteManagement.name), useValue: {} },
        { provide: getModelToken(ProcessRenewInnovation.name), useValue: {} },
        { provide: getModelToken(ProcessRenewProductPerformance.name), useValue: {} },
        {
          provide: getConnectionToken(),
          useValue: { startSession: jest.fn() },
        },
        { provide: ActivityLogService, useValue: { logActivity: jest.fn() } },
        {
          provide: RenewalOrchestrationService,
          useValue: { completeRenewal },
        },
        {
          provide: RenewUrnTabReviewService,
          useValue: {
            assertAdminQuickViewTransitionAllowed: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get(RenewUrnStatusService);
  });

  it('completes renewal on admin 15→17 without persisting urn_status 17', async () => {
    const result = await service.updateRenewUrnStatus(
      {
        urnNo,
        renewalCycleId: cycleId,
        updateStatusType: 'urn_status',
        updateStatusTo: RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING,
      },
      { actor: 'admin', userId: 'admin-1' },
    );

    expect(completeRenewal).toHaveBeenCalledWith(urnNo, 'admin-1', cycleId);
    const productModel = (service as unknown as { productModel: { updateMany: jest.Mock } })
      .productModel;
    expect(productModel.updateMany).not.toHaveBeenCalled();
    expect(result.urnStatus).toBe(RENEWAL_URN_STATUS.COMPLETED);
    expect(result.productRenewStatus).toBe(PRODUCT_RENEW_STATUS.RENEWED);
    expect(result.renewalCycleId).toBe(cycleId);
    expect(result.message).toContain('Renewal completed');
  });

  it('requires renewalCycleId for completion', async () => {
    await expect(
      service.updateRenewUrnStatus(
        {
          urnNo,
          updateStatusType: 'urn_status',
          updateStatusTo: RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING,
        },
        { actor: 'admin', userId: 'admin-1' },
      ),
    ).rejects.toThrow(/renewalCycleId is required/);
  });
});
