import { LifecycleNotificationService } from './lifecycle-notification.service';
import { NotificationTemplateCode } from './interfaces/notification.types';
import { NotificationChannel } from './interfaces/notification.types';

describe('LifecycleNotificationService', () => {
  const send = jest.fn().mockResolvedValue({ results: [] });
  const sendInBackground = jest.fn();
  const resolveByManufacturerId = jest.fn();
  const createFeedNotification = jest.fn();
  const sendAdminAlertEmailInBackground = jest.fn();

  const service = new LifecycleNotificationService(
    { send, sendInBackground } as any,
    { resolveByManufacturerId } as any,
    {
      createFeedNotification,
      sendAdminAlertEmailInBackground,
    } as any,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    resolveByManufacturerId.mockResolvedValue({
      userId: '507f1f77bcf86cd799439011',
      email: 'vendor@example.com',
      vendorName: 'Acme Vendor',
      companyName: 'Acme Co',
    });
  });

  it('sends email + in-app for URN initial approval', async () => {
    await service.notifyUrnInitialApproved({
      manufacturerId: '507f1f77bcf86cd799439011',
      urnNo: 'URN-1',
    });
    expect(sendInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        type: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        template: NotificationTemplateCode.URN_INITIAL_APPROVED,
      }),
    );
  });

  it('sends email-only for signup (USER_CREATED)', async () => {
    await service.notifyNewVendorRegistered({
      userId: '507f1f77bcf86cd799439011',
      email: 'vendor@example.com',
      name: 'Acme Vendor',
      companyName: 'Acme Co',
      password: 'secret',
      otp: '123456',
    });
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        type: [NotificationChannel.EMAIL],
        template: NotificationTemplateCode.USER_CREATED,
      }),
    );
    expect(createFeedNotification).not.toHaveBeenCalled();
  });

  it('sends email-only for OTP resend', async () => {
    await service.notifyVendorOtpResent({
      userId: '507f1f77bcf86cd799439011',
      email: 'vendor@example.com',
      name: 'Acme Vendor',
      otp: '654321',
      expiresInMinutes: 10,
    });
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        type: [NotificationChannel.EMAIL],
        template: NotificationTemplateCode.OTP_VERIFICATION,
      }),
    );
  });

  it('does not create admin feed on register (only after OTP verify)', async () => {
    await service.notifyNewVendorRegistered({
      userId: '507f1f77bcf86cd799439011',
      email: 'vendor@example.com',
      name: 'Acme Vendor',
      companyName: 'Acme Co',
      password: 'secret',
      otp: '123456',
    });
    expect(createFeedNotification).not.toHaveBeenCalled();
    expect(send).toHaveBeenCalled();
  });

  it('creates single admin feed on registration complete (OTP verified) and dual-channels vendor', async () => {
    await service.notifyVendorRegistrationComplete(
      '507f1f77bcf86cd799439011',
      'vendor@example.com',
      'Acme Co',
    );
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        type: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        template: NotificationTemplateCode.VENDOR_REGISTRATION_COMPLETE,
      }),
    );
    expect(createFeedNotification).toHaveBeenCalledTimes(1);
    expect(createFeedNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Registration',
        message: expect.stringContaining('Acme Co'),
        type: 'success',
        referenceType: 'vendor_registration',
      }),
    );
    expect(sendAdminAlertEmailInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining('Registration Complete'),
      }),
    );
  });

  it('sends vendor + admin alert on submit for review', async () => {
    await service.notifyUrnSubmittedForReview({
      manufacturerId: '507f1f77bcf86cd799439011',
      urnNo: 'URN-1',
    });
    expect(sendInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        type: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        template: NotificationTemplateCode.URN_SUBMITTED_FOR_REVIEW,
      }),
    );
    expect(createFeedNotification).toHaveBeenCalled();
    expect(sendAdminAlertEmailInBackground).toHaveBeenCalled();
  });

  it('still notifies admin when vendor recipient is missing on submit for review', async () => {
    resolveByManufacturerId.mockResolvedValue(null);
    await service.notifyUrnSubmittedForReview({
      manufacturerId: '507f1f77bcf86cd799439011',
      urnNo: 'URN-1',
      manufacturerName: 'Acme Co',
    });
    expect(sendInBackground).not.toHaveBeenCalled();
    expect(createFeedNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining('Acme Co'),
        referenceType: 'urn_submitted_for_review',
      }),
    );
    expect(sendAdminAlertEmailInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining('URN-1'),
      }),
    );
  });

  it('sends vendor email on urn registration rejected', async () => {
    await service.notifyUrnRegistrationRejected({
      manufacturerId: '507f1f77bcf86cd799439011',
      urnNo: 'URN-1',
      productName: 'Widget',
      reason: 'Incomplete documents',
    });
    expect(sendInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        template: NotificationTemplateCode.URN_REGISTRATION_REJECTED,
      }),
    );
  });

  it('sends admin feed + email on manufacturer approved', async () => {
    await service.notifyManufacturerApproved('507f1f77bcf86cd799439011', {
      manufacturerName: 'Acme Co',
      vendorEmail: 'vendor@example.com',
    });
    expect(sendInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        template: NotificationTemplateCode.MANUFACTURER_APPROVED,
      }),
    );
    expect(createFeedNotification).toHaveBeenCalled();
    expect(sendAdminAlertEmailInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining('Manufacturer verified'),
        ccGroups: ['SHEshi'],
      }),
    );
  });

  it('sends admin feed + email on manufacturer inactive', async () => {
    await service.notifyManufacturerInactive('507f1f77bcf86cd799439011');
    expect(sendInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        template: NotificationTemplateCode.MANUFACTURER_INACTIVE,
      }),
    );
    expect(createFeedNotification).toHaveBeenCalled();
    expect(sendAdminAlertEmailInBackground).toHaveBeenCalled();
  });

  it('sends admin-only on manufacturer rejected', async () => {
    await service.notifyManufacturerRejected('Rejected Co', '507f1f77bcf86cd799439011');
    expect(sendInBackground).not.toHaveBeenCalled();
    expect(createFeedNotification).toHaveBeenCalled();
    expect(sendAdminAlertEmailInBackground).toHaveBeenCalled();
  });

  it('sends vendor email on payment proposal ready', async () => {
    await service.notifyPaymentProposalReady({
      manufacturerId: '507f1f77bcf86cd799439011',
      urnNo: 'URN-1',
      paymentId: 42,
      paymentType: 'registration',
      quoteTotal: 1000,
    });
    expect(sendInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        template: NotificationTemplateCode.PAYMENT_PROPOSAL_READY,
        payload: expect.objectContaining({ paymentTypeLabel: 'Registration fee' }),
      }),
    );
  });

  it('sends vendor + admin on product certified', async () => {
    await service.notifyProductCertified({
      manufacturerId: '507f1f77bcf86cd799439011',
      urnNo: 'URN-1',
      productName: 'Widget',
    });
    expect(sendInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        template: NotificationTemplateCode.PRODUCT_APPROVED,
      }),
    );
    expect(createFeedNotification).toHaveBeenCalled();
    expect(sendAdminAlertEmailInBackground).toHaveBeenCalled();
  });

  it('sends vendor + admin on product rejected', async () => {
    await service.notifyProductRejected({
      manufacturerId: '507f1f77bcf86cd799439011',
      urnNo: 'URN-1',
      productName: 'Widget',
    });
    expect(sendInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        template: NotificationTemplateCode.PRODUCT_REJECTED,
      }),
    );
    expect(createFeedNotification).toHaveBeenCalled();
    expect(sendAdminAlertEmailInBackground).toHaveBeenCalled();
  });

  it('sends admin feed + email on document uploaded with team lead CC', async () => {
    await service.notifyDocumentUploaded({
      manufacturerId: '507f1f77bcf86cd799439011',
      urnNo: 'URN-1',
    });
    expect(createFeedNotification).toHaveBeenCalled();
    expect(sendAdminAlertEmailInBackground).toHaveBeenCalledWith(
      expect.objectContaining({ ccGroups: ['TEAM_LEADS'] }),
    );
  });

  it('sends vendor + admin on certification payment approved', async () => {
    await service.notifyCertificationPaymentApproved({
      manufacturerId: '507f1f77bcf86cd799439011',
      urnNo: 'URN-1',
      paymentId: 9,
    });
    expect(sendInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        template: NotificationTemplateCode.CERTIFICATION_PAYMENT_APPROVED,
      }),
    );
    expect(createFeedNotification).toHaveBeenCalled();
    expect(sendAdminAlertEmailInBackground).toHaveBeenCalledWith(
      expect.objectContaining({ ccGroups: ['TEAM_LEADS'] }),
    );
  });

  it('sends vendor + admin on product enquiry with sheshi CC', async () => {
    await service.notifyProductEnquiry({
      manufacturerId: '507f1f77bcf86cd799439011',
      manufacturerName: 'Acme Co',
      vendorEmail: 'vendor@example.com',
      visitorName: 'Jane',
      visitorEmail: 'jane@example.com',
      visitorPhone: '+911234567890',
      visitorMessage: 'Interested',
    });
    expect(sendInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        template: NotificationTemplateCode.PRODUCT_ENQUIRY_VENDOR,
      }),
    );
    expect(createFeedNotification).toHaveBeenCalled();
    expect(sendAdminAlertEmailInBackground).toHaveBeenCalledWith(
      expect.objectContaining({ ccGroups: ['SHEshi'] }),
    );
  });

  it('sends vendor email on URN merge', async () => {
    await service.notifyUrnMerged({
      manufacturerId: '507f1f77bcf86cd799439011',
      sourceUrnNo: 'URN-A',
      targetUrnNo: 'URN-B',
      movedCount: 3,
    });
    expect(sendInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        template: NotificationTemplateCode.URN_MERGED,
      }),
    );
    expect(createFeedNotification).toHaveBeenCalled();
    expect(sendAdminAlertEmailInBackground).toHaveBeenCalledWith(
      expect.objectContaining({ ccGroups: ['TEAM_LEADS'] }),
    );
  });

  it('sends vendor + admin on renewal submitted', async () => {
    await service.notifyRenewalSubmitted({
      manufacturerId: '507f1f77bcf86cd799439011',
      urnNo: 'URN-1',
    });
    expect(sendInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        template: NotificationTemplateCode.RENEWAL_SUBMITTED,
      }),
    );
    expect(createFeedNotification).toHaveBeenCalled();
    expect(sendAdminAlertEmailInBackground).toHaveBeenCalled();
  });

  it('sends vendor + admin on renewal decision', async () => {
    await service.notifyRenewalDecision({
      manufacturerId: '507f1f77bcf86cd799439011',
      urnNo: 'URN-1',
      decision: 'sent_back',
    });
    expect(sendInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        template: NotificationTemplateCode.RENEWAL_DECISION,
      }),
    );
    expect(createFeedNotification).toHaveBeenCalled();
    expect(sendAdminAlertEmailInBackground).toHaveBeenCalled();
  });

  it('sends vendor + admin on renewal completed', async () => {
    await service.notifyRenewalCompleted({
      manufacturerId: '507f1f77bcf86cd799439011',
      urnNo: 'URN-1',
    });
    expect(sendInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        template: NotificationTemplateCode.RENEWAL_COMPLETED,
      }),
    );
    expect(createFeedNotification).toHaveBeenCalled();
    expect(sendAdminAlertEmailInBackground).toHaveBeenCalled();
  });

  it('creates admin feed only for 60-day expiry reminder', async () => {
    await service.notifyCertificationExpiryAdmin({
      manufacturerName: 'Acme Co',
      urnNo: 'URN-1',
      eoiNo: 'EOI-1',
      stage: '60-day',
      includeAdminEmail: false,
    });
    expect(createFeedNotification).toHaveBeenCalled();
    expect(sendAdminAlertEmailInBackground).not.toHaveBeenCalled();
  });

  it('creates admin feed + email for weekly expiry reminder', async () => {
    await service.notifyCertificationExpiryAdmin({
      manufacturerName: 'Acme Co',
      urnNo: 'URN-1',
      eoiNo: 'EOI-1',
      stage: 'weekly',
      includeAdminEmail: true,
    });
    expect(createFeedNotification).toHaveBeenCalled();
    expect(sendAdminAlertEmailInBackground).toHaveBeenCalledWith(
      expect.objectContaining({ ccGroups: ['SHEshi'] }),
    );
  });

  it('creates admin feed + email when vendor requests product name change', async () => {
    await service.notifyProductNameChangeRequested({
      manufacturerId: '507f1f77bcf86cd799439011',
      requestId: '66545c2f3d4f04cc8ec2ab99',
      urnNo: 'URN-20260527122016',
      eoiNo: 'GPPM1003016',
      currentName: 'Old Product',
      requestedName: 'New Product',
      reason: 'Brand naming correction',
      manufacturerName: 'Acme Co',
    });
    expect(createFeedNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Product Name Change Request — Acme Co',
        message: expect.stringContaining('Old Product'),
        type: 'info',
        referenceType: 'product_name_change_request',
        referenceId: '66545c2f3d4f04cc8ec2ab99',
        actorName: 'Acme Co',
      }),
    );
    expect(sendAdminAlertEmailInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining('Product Name Change Request'),
        html: expect.stringContaining('Brand naming correction'),
        text: expect.stringContaining('New Product'),
        ccGroups: ['SHEshi'],
      }),
    );
  });

  it('notifies admin on password reset with sheshi CC', async () => {
    await service.notifyPasswordResetAdmin({
      email: 'vendor@example.com',
      portal: 'vendor',
      userId: '507f1f77bcf86cd799439011',
    });
    expect(createFeedNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Password Reset',
        referenceType: 'password_reset',
      }),
    );
    expect(sendAdminAlertEmailInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining('Password Reset'),
        ccGroups: ['SHEshi'],
      }),
    );
  });
});
