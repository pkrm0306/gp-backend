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

  it('sends email-only for URN initial approval', async () => {
    await service.notifyUrnInitialApproved({
      manufacturerId: '507f1f77bcf86cd799439011',
      urnNo: 'URN-1',
    });
    expect(sendInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        type: [NotificationChannel.EMAIL],
        template: NotificationTemplateCode.URN_INITIAL_APPROVED,
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

  it('creates single admin feed on registration complete (OTP verified)', async () => {
    await service.notifyVendorRegistrationComplete(
      '507f1f77bcf86cd799439011',
      'vendor@example.com',
      'Acme Co',
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
  });

  it('sends vendor + admin alert on submit for review', async () => {
    await service.notifyUrnSubmittedForReview({
      manufacturerId: '507f1f77bcf86cd799439011',
      urnNo: 'URN-1',
    });
    expect(sendInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        template: NotificationTemplateCode.URN_SUBMITTED_FOR_REVIEW,
      }),
    );
    expect(createFeedNotification).toHaveBeenCalled();
    expect(sendAdminAlertEmailInBackground).toHaveBeenCalled();
  });
});
