import { ConflictException } from '@nestjs/common';
import { WebsiteService } from './website.service';

describe('WebsiteService.submitEventRegistration', () => {
  const recaptchaService = {
    assertRecaptchaToken: jest.fn().mockResolvedValue(undefined),
  };
  const emailService = {
    sendInBackground: jest.fn((fn) => fn()),
    sendEventRegistrationConfirmationEmail: jest
      .fn()
      .mockResolvedValue(undefined),
  };
  const adminSystemNotification = {
    createFeedNotification: jest.fn().mockResolvedValue(undefined),
  };

  const counterModel = {
    findOneAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({ seq: 42 }),
    }),
  };

  const savedDoc = {
    _id: { toString: () => 'reg-id-1' },
    createdAt: new Date('2026-10-26T10:00:00.000Z'),
  };

  let eventRegistrationModel: any;
  let service: WebsiteService;

  beforeEach(() => {
    jest.clearAllMocks();
    eventRegistrationModel = jest.fn().mockImplementation((payload) => ({
      ...payload,
      save: jest.fn().mockResolvedValue({ ...savedDoc, ...payload }),
    }));

    service = new WebsiteService(
      {} as any,
      {} as any,
      {} as any,
      eventRegistrationModel,
      counterModel as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      emailService as any,
      {} as any,
      adminSystemNotification as any,
      {} as any,
      {} as any,
      {} as any,
      recaptchaService as any,
    );
  });

  const dto = {
    eventSlug: 'greenpro-summit-2026',
    eventTitle: 'GreenPro Summit 2026',
    eventDate: '15 May 2026',
    eventTime: '09:00 AM',
    eventLocation: 'New Delhi',
    fullName: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 98765 43210',
    city: 'Bengaluru',
    organisation: 'Acme',
    attendanceMode: 'in-person' as const,
    participantRole: 'Manufacturer' as const,
    consent: true,
    sourcePath: '/event/greenpro-summit-2026',
  };

  it('saves registration and returns referenceCode without requiring recaptcha', async () => {
    const result = await service.submitEventRegistration(dto as any);
    expect(result.referenceCode).toBe('GP-00042');
    expect(result.id).toBe('reg-id-1');
    expect(recaptchaService.assertRecaptchaToken).not.toHaveBeenCalled();
    expect(
      emailService.sendEventRegistrationConfirmationEmail,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'priya@example.com',
        referenceCode: 'GP-00042',
      }),
    );
    expect(adminSystemNotification.createFeedNotification).toHaveBeenCalled();
  });

  it('verifies recaptcha when a token is provided', async () => {
    await service.submitEventRegistration({
      ...dto,
      recaptchaToken: '03AFcWeA...',
    } as any);
    expect(recaptchaService.assertRecaptchaToken).toHaveBeenCalledWith(
      '03AFcWeA...',
    );
  });

  it('maps duplicate key to 409 Conflict', async () => {
    eventRegistrationModel.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue({ code: 11000 }),
    }));

    await expect(
      service.submitEventRegistration(dto as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
