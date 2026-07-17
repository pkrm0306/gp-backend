import { LifecycleNotificationService } from './lifecycle-notification.service';
import { NotificationTemplateCode } from './interfaces/notification.types';
import { NotificationChannel } from './interfaces/notification.types';

describe('LifecycleNotificationService', () => {
  const send = jest.fn().mockResolvedValue({
    results: [{ channel: NotificationChannel.EMAIL, success: true }],
  });
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

  it('sends email + in-app for URN initial approval and notifies admin', async () => {
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
    expect(createFeedNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        referenceType: 'urn_initial_approved',
        ccGroups: ['TEAM_LEADS'],
      }),
    );
  });

  it('queues email-only for signup (USER_CREATED)', async () => {
    await service.notifyNewVendorRegistered({
      userId: '507f1f77bcf86cd799439011',
      email: 'vendor@example.com',
      name: 'Acme Vendor',
      companyName: 'Acme Co',
      password: 'secret',
      otp: '123456',
    });
    expect(sendInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        type: [NotificationChannel.EMAIL],
        template: NotificationTemplateCode.USER_CREATED,
        async: true,
      }),
    );
    expect(send).not.toHaveBeenCalled();
  });

  it('queues email-only for OTP resend', async () => {
    await service.notifyVendorOtpResent({
      userId: '507f1f77bcf86cd799439011',
      email: 'vendor@example.com',
      name: 'Acme Vendor',
      otp: '654321',
      expiresInMinutes: 10,
    });
    expect(sendInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        type: [NotificationChannel.EMAIL],
        template: NotificationTemplateCode.OTP_VERIFICATION,
        async: true,
      }),
    );
    expect(send).not.toHaveBeenCalled();
  });

  it('notifies admin when vendor registers (OTP email queued)', async () => {
    await service.notifyNewVendorRegistered({
      userId: '507f1f77bcf86cd799439011',
      email: 'vendor@example.com',
      name: 'Acme Vendor',
      companyName: 'Acme Co',
      password: 'secret',
      otp: '123456',
    });
    expect(createFeedNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        referenceType: 'vendor_registration_otp',
        ccGroups: ['SHEshi'],
      }),
    );
    expect(sendInBackground).toHaveBeenCalled();
  });

  it('does not throw when registration email is queued asynchronously', async () => {
    await expect(
      service.notifyNewVendorRegistered({
        userId: '507f1f77bcf86cd799439011',
        email: 'vendor@example.com',
        name: 'Acme Vendor',
        companyName: 'Acme Co',
        password: 'secret',
        otp: '123456',
      }),
    ).resolves.toBeUndefined();
    expect(sendInBackground).toHaveBeenCalled();
    expect(createFeedNotification).toHaveBeenCalled();
  });

  it('creates single admin feed on registration complete (OTP verified)', async () => {
    await service.notifyVendorRegistrationComplete(
      '507f1f77bcf86cd799439011',
      'vendor@example.com',
      'Acme Co',
    );
    expect(sendInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        type: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        template: NotificationTemplateCode.VENDOR_REGISTRATION_COMPLETE,
        async: true,
      }),
    );
    expect(send).not.toHaveBeenCalled();
    expect(createFeedNotification).toHaveBeenCalledTimes(1);
    expect(createFeedNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Registration Complete',
        message: expect.stringContaining('Acme Co'),
        type: 'success',
        referenceType: 'vendor_registration',
        emailSubject: expect.stringContaining('Registration Complete'),
        ccGroups: ['SHEshi'],
      }),
    );
    expect(sendAdminAlertEmailInBackground).not.toHaveBeenCalled();
  });

  it('sends admin alert when vendor registers a product', async () => {
    await service.notifyProductRegistered({
      manufacturerId: '507f1f77bcf86cd799439011',
      urnNo: 'URN-1',
      eoiNo: 'GP001',
      productName: 'Widget',
    });
    expect(createFeedNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        referenceType: 'product_registered',
        message: expect.stringContaining('"Widget"'),
        emailSubject: expect.stringContaining('Product registered'),
        emailHtmlExtra: expect.stringContaining('Widget'),
        ccGroups: ['TEAM_LEADS'],
      }),
    );
    expect(createFeedNotification.mock.calls[0][0].emailHtmlExtra).toContain(
      'Vendor registered',
    );
    expect(createFeedNotification.mock.calls[0][0].emailHtmlExtra).toContain(
      'Product name list',
    );
    expect(send).not.toHaveBeenCalled();
  });

  it('sends admin alert with all product names for bulk registration', async () => {
    await service.notifyProductRegistered({
      manufacturerId: '507f1f77bcf86cd799439011',
      urnNo: 'URN-2',
      productNames: ['Widget', 'Gadget', 'Device'],
      eoiNos: ['EOI-1', 'EOI-2', 'EOI-3'],
    });
    expect(createFeedNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        referenceType: 'product_registered',
        title: expect.stringContaining('Products Registered'),
        message: expect.stringMatching(/Widget.*Gadget.*Device/),
        emailSubject: expect.stringContaining('Products registered'),
        emailHtmlExtra: expect.stringMatching(/Widget[\s\S]*Gadget[\s\S]*Device/),
        ccGroups: ['TEAM_LEADS'],
      }),
    );
    expect(createFeedNotification.mock.calls[0][0].emailHtmlExtra).toContain(
      'EOI-2',
    );
    expect(send).not.toHaveBeenCalled();
  });

  it('sends admin-only alert on submit for review', async () => {
    await service.notifyUrnSubmittedForReview({
      manufacturerId: '507f1f77bcf86cd799439011',
      urnNo: 'URN-1',
      productNames: ['Widget', 'Gadget'],
      eoiNos: ['EOI-1', 'EOI-2'],
      manufacturerName: 'Acme Co',
    });
    expect(sendInBackground).not.toHaveBeenCalled();
    expect(createFeedNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        referenceType: 'urn_submitted_for_review',
        emailSubject: expect.stringContaining('Vendor sent URN URN-1 for review'),
        emailHtmlExtra: expect.stringMatching(
          /Vendor sent this URN for review[\s\S]*Widget[\s\S]*Gadget/,
        ),
        ccGroups: ['TEAM_LEADS'],
      }),
    );
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
        emailSubject: expect.stringContaining('URN-1'),
        emailHtmlExtra: expect.stringContaining('Vendor sent this URN for review'),
      }),
    );
  });

  it('sends vendor email only on urn registration rejected', async () => {
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
    expect(createFeedNotification).not.toHaveBeenCalled();
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
    expect(createFeedNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        emailSubject: expect.stringContaining('Manufacturer verified'),
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
    expect(createFeedNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        ccGroups: ['SHEshi'],
      }),
    );
  });

  it('sends vendor email + admin feed on manufacturer rejected', async () => {
    await service.notifyManufacturerRejected(
      'Rejected Co',
      '507f1f77bcf86cd799439011',
      { vendorEmail: 'rejected@example.com' },
    );
    expect(sendInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        type: [NotificationChannel.EMAIL],
        template: NotificationTemplateCode.MANUFACTURER_REJECTED,
        email: 'rejected@example.com',
      }),
    );
    expect(createFeedNotification).toHaveBeenCalled();
  });

  it('skips vendor email on manufacturer rejected when no vendorEmail', async () => {
    await service.notifyManufacturerRejected('Rejected Co', '507f1f77bcf86cd799439011');
    expect(send).not.toHaveBeenCalled();
    expect(createFeedNotification).toHaveBeenCalled();
  });

  it('sends vendor email on plant merged and notifies admin', async () => {
    await service.notifyPlantMerged({
      manufacturerId: '507f1f77bcf86cd799439011',
      urnNo: 'URN-1',
      eoiNo: 'EOI-1',
      productName: 'Widget',
      mergeSummary: '2 plant(s) were merged into "Main Plant".',
    });
    expect(sendInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        template: NotificationTemplateCode.PLANT_MERGED,
      }),
    );
    expect(createFeedNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        referenceType: 'plant_merge',
      }),
    );
  });

  it('sends vendor email on payment proposal ready and notifies admin', async () => {
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
    expect(createFeedNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        referenceType: 'payment_proposal_registration',
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
  });

  it('sends vendor email only on product rejected', async () => {
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
    expect(createFeedNotification).not.toHaveBeenCalled();
  });

  it('sends admin feed + email on document uploaded with team lead CC', async () => {
    await service.notifyDocumentUploaded({
      manufacturerId: '507f1f77bcf86cd799439011',
      urnNo: 'URN-1',
    });
    expect(createFeedNotification).toHaveBeenCalledWith(
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
    expect(createFeedNotification).toHaveBeenCalledWith(
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
    expect(createFeedNotification).toHaveBeenCalledWith(
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
    expect(createFeedNotification).toHaveBeenCalledWith(
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
  });

  it('creates admin feed + email for 60-day expiry reminder', async () => {
    await service.notifyCertificationExpiryAdmin({
      manufacturerName: 'Acme Co',
      urnNo: 'URN-1',
      eoiNo: 'EOI-1',
      stage: '60-day',
      includeAdminEmail: false,
    });
    expect(createFeedNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        referenceType: 'certification_expiry_60-day',
        ccGroups: ['SHEshi'],
      }),
    );
  });

  it('creates admin feed + email for weekly expiry reminder', async () => {
    await service.notifyCertificationExpiryAdmin({
      manufacturerName: 'Acme Co',
      urnNo: 'URN-1',
      eoiNo: 'EOI-1',
      stage: 'weekly',
      includeAdminEmail: true,
    });
    expect(createFeedNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        referenceType: 'certification_expiry_weekly',
        ccGroups: ['SHEshi'],
      }),
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
        emailSubject: expect.stringContaining('Product Name Change Request'),
        emailHtmlExtra: expect.stringContaining('Brand naming correction'),
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
        ccGroups: ['SHEshi'],
      }),
    );
    expect(sendAdminAlertEmailInBackground).not.toHaveBeenCalled();
  });
});
