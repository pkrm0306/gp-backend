import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { NotificationTemplateCode } from '../notifications/interfaces/notification.types';
import { NOTIFICATION_TEMPLATES } from '../notifications/templates/notification-templates';
import { PaymentsService } from './payments.service';

describe('PaymentsService notification wiring', () => {
  it('registers PAYMENT_REJECTED template used on admin reject', () => {
    expect(NOTIFICATION_TEMPLATES[NotificationTemplateCode.PAYMENT_REJECTED]).toBeDefined();
    expect(
      NOTIFICATION_TEMPLATES[NotificationTemplateCode.PAYMENT_REJECTED].inApp?.title,
    ).toBe('Payment rejected');
  });

  it('registers PAYMENT_APPROVED template used on registration fee approve', () => {
    expect(NOTIFICATION_TEMPLATES[NotificationTemplateCode.PAYMENT_APPROVED]).toBeDefined();
    expect(
      NOTIFICATION_TEMPLATES[NotificationTemplateCode.PAYMENT_APPROVED].inApp?.content,
    ).toContain('You may proceed to the next stage');
  });

  it('registers PLANT_MERGED in-app template for vendor notifications', () => {
    expect(NOTIFICATION_TEMPLATES[NotificationTemplateCode.PLANT_MERGED].inApp).toEqual(
      expect.objectContaining({
        title: 'Plant merge completed',
        notifyType: 'PLANT_MERGED',
      }),
    );
  });

  it('tryNotifyCertificationFeeAutoRejected notifies PRODUCT_REJECTED per product', async () => {
    const notifyProductRejected = jest.fn().mockResolvedValue(undefined);
    const manufacturerId = new Types.ObjectId();

    const service = Object.create(PaymentsService.prototype) as any;
    service.lifecycleNotification = { notifyProductRejected };

    service.tryNotifyCertificationFeeAutoRejected('URN-1', [
      {
        manufacturerId,
        productName: 'Widget A',
        productId: 11,
      },
      {
        manufacturerId,
        productName: 'Widget B',
        productId: 12,
        eoiNo: 'EOI-12',
      },
    ]);

    await new Promise((r) => setImmediate(r));

    expect(notifyProductRejected).toHaveBeenCalledTimes(2);
    expect(notifyProductRejected).toHaveBeenCalledWith(
      expect.objectContaining({
        manufacturerId: manufacturerId.toString(),
        urnNo: 'URN-1',
        productName: 'Widget A',
        reason: 'Auto-rejected: not selected for certification fee',
      }),
    );
    expect(notifyProductRejected).toHaveBeenCalledWith(
      expect.objectContaining({
        productName: 'Widget B',
      }),
    );
  });

  it('no longer sends URN_INITIAL_APPROVED from payment proposal helpers', () => {
    expect(
      (PaymentsService.prototype as unknown as Record<string, unknown>)
        .tryNotifyUrnRegistrationApproved,
    ).toBeUndefined();
    expect(
      typeof (PaymentsService.prototype as unknown as Record<string, unknown>)
        .tryNotifyPaymentProposalReady,
    ).toBe('function');
  });

  it('tryNotifyPaymentProposalReady calls PAYMENT_PROPOSAL_READY only (not URN_INITIAL_APPROVED)', async () => {
    const notifyPaymentProposalReady = jest.fn().mockResolvedValue(undefined);
    const notifyUrnInitialApproved = jest.fn().mockResolvedValue(undefined);
    const manufacturerId = new Types.ObjectId();
    const vendorObjectId = new Types.ObjectId();

    const service = Object.create(PaymentsService.prototype) as any;
    service.findUrnProductForOrg = jest.fn().mockResolvedValue({
      manufacturerId,
    });
    service.manufacturerModel = {
      findById: jest.fn().mockReturnValue({
        select: () => ({
          lean: () => ({
            exec: async () => ({
              manufacturerName: 'Acme',
              vendor_email: 'vendor@example.com',
            }),
          }),
        }),
      }),
    };
    service.lifecycleNotification = {
      notifyPaymentProposalReady,
      notifyUrnInitialApproved,
      notifyRegistrationPaymentRejected: jest.fn(),
    };

    service.tryNotifyPaymentProposalReady(
      'URN-1',
      vendorObjectId,
      99,
      'registration',
      1000,
    );

    await new Promise((r) => setImmediate(r));

    expect(notifyPaymentProposalReady).toHaveBeenCalledWith(
      expect.objectContaining({
        manufacturerId: manufacturerId.toString(),
        urnNo: 'URN-1',
        paymentId: 99,
        paymentType: 'registration',
      }),
    );
    expect(notifyUrnInitialApproved).not.toHaveBeenCalled();
  });

  it('applyPaymentStatusUpdate marks adminRejectedPayment for paymentStatus 3', () => {
    const service = Object.create(PaymentsService.prototype) as any;
    service.isAdminPortalRole = () => true;

    const updateData: Record<string, unknown> = {};
    const result = service.applyPaymentStatusUpdate(
      updateData,
      {
        paymentStatus: 3,
        paymentRejectionRemarks: 'Invalid proof',
      },
      { paymentStatus: 1 },
      'admin',
    );

    expect(result.adminRejectedPayment).toBe(true);
    expect(result.adminApprovedPayment).toBe(false);
    expect(result.paymentRejectionRemarks).toBe('Invalid proof');
    expect(updateData.paymentStatus).toBe(3);
  });

  it('applyPaymentStatusUpdate rejects non-admin reject attempts', () => {
    const service = Object.create(PaymentsService.prototype) as any;
    service.isAdminPortalRole = () => false;

    expect(() =>
      service.applyPaymentStatusUpdate(
        {},
        { paymentStatus: 3, paymentRejectionRemarks: 'x' },
        { paymentStatus: 1 },
        'vendor',
      ),
    ).toThrow(ForbiddenException);
  });

  it('applyPaymentStatusUpdate requires remarks on reject', () => {
    const service = Object.create(PaymentsService.prototype) as any;
    service.isAdminPortalRole = () => true;

    expect(() =>
      service.applyPaymentStatusUpdate(
        {},
        { paymentStatus: 3 },
        { paymentStatus: 1 },
        'admin',
      ),
    ).toThrow(BadRequestException);
  });
});
