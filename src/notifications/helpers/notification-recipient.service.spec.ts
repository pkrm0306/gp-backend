import { Types } from 'mongoose';
import { NotificationRecipientService } from './notification-recipient.service';

describe('NotificationRecipientService', () => {
  const manufacturerId = new Types.ObjectId().toHexString();
  const userId = new Types.ObjectId();

  let findByIdExec: jest.Mock;
  let findPrimaryLoginUserForManufacturer: jest.Mock;
  let findByEmail: jest.Mock;
  let service: NotificationRecipientService;

  beforeEach(() => {
    findByIdExec = jest.fn();
    findPrimaryLoginUserForManufacturer = jest.fn();
    findByEmail = jest.fn();

    service = new NotificationRecipientService(
      {
        findPrimaryLoginUserForManufacturer,
        findByEmail,
        findById: jest.fn(),
      } as never,
      {
        findById: jest.fn().mockReturnValue({ exec: findByIdExec }),
      } as never,
    );
  });

  it('returns recipient with userId when manufacturer has no email (in-app only)', async () => {
    findByIdExec.mockResolvedValue({
      manufacturerName: 'Acme',
      vendor_name: 'Acme Vendor',
      vendor_email: '',
    });
    findPrimaryLoginUserForManufacturer.mockResolvedValue({
      _id: userId,
      name: 'Vendor User',
      email: '',
    });

    const recipient = await service.resolveByManufacturerId(manufacturerId);

    expect(recipient).toEqual(
      expect.objectContaining({
        userId: userId.toHexString(),
        vendorName: 'Vendor User',
        companyName: 'Acme',
      }),
    );
    expect(recipient?.email).toBeFalsy();
  });

  it('returns email-only recipient when vendor user is missing', async () => {
    findByIdExec.mockResolvedValue({
      manufacturerName: 'Acme',
      vendor_email: 'vendor@example.com',
    });
    findPrimaryLoginUserForManufacturer.mockResolvedValue(null);
    findByEmail.mockResolvedValue(null);

    const recipient = await service.resolveByManufacturerId(manufacturerId);

    expect(recipient).toEqual(
      expect.objectContaining({
        email: 'vendor@example.com',
        companyName: 'Acme',
      }),
    );
    expect(recipient?.userId).toBeUndefined();
  });

  it('returns null when neither email nor userId can be resolved', async () => {
    findByIdExec.mockResolvedValue({
      manufacturerName: 'Acme',
      vendor_email: '',
    });
    findPrimaryLoginUserForManufacturer.mockResolvedValue(null);

    await expect(service.resolveByManufacturerId(manufacturerId)).resolves.toBeNull();
  });
});
