import { EmailService } from './email.service';
import {
  GREENPRO_EMAIL_CIDS,
  mergeGreenProEmailAttachments,
} from '../email/greenpro-email-layout';

describe('EmailService branded shell', () => {
  const sendMail = jest.fn().mockResolvedValue({
    messageId: 'test-id',
    accepted: ['vendor@example.com'],
    rejected: [],
    response: '250 OK',
  });

  let service: EmailService;

  beforeEach(() => {
    jest.clearAllMocks();
    const configGet = jest.fn((key: string) => {
      const map: Record<string, string> = {
        EMAIL_DISABLED: 'false',
        SMTP_SERVER_HOST: 'sandbox.smtp.mailtrap.io',
        SMTP_SERVER_PORT: '2525',
        SMTP_SERVER_USER: 'user',
        SMTP_SERVER_PASS: 'pass',
        SMTP_SERVER_FROM: 'noreply@greenpro.com',
        APP_BASE_URL: 'https://greenpro.example',
        EMAIL_LOCAL_PREVIEW: 'false',
      };
      return map[key];
    });

    service = new EmailService({ get: configGet } as any);
    (service as any).transporters = [
      {
        label: 'mailtrap',
        from: 'noreply@greenpro.com',
        transporter: { sendMail },
      },
    ];
  });

  it('wraps body fragments with GreenPro shell and attaches layout CIDs', async () => {
    const ok = await service.sendEmail(
      'vendor@example.com',
      'GreenPro — URN approved',
      '<p>Your registration was approved.</p>',
    );
    expect(ok).toBe(true);
    expect(sendMail).toHaveBeenCalled();
    const mail = sendMail.mock.calls[0][0];
    expect(mail.html).toContain(`cid:${GREENPRO_EMAIL_CIDS.logo}`);
    expect(mail.html).toContain(`cid:${GREENPRO_EMAIL_CIDS.pageHeader}`);
    expect(mail.html).toContain('Your registration was approved.');
    expect(mail.html).toContain('Greeting from');
    const cids = (mail.attachments ?? []).map((a: { cid?: string }) => a.cid);
    expect(cids).toEqual(
      expect.arrayContaining([
        GREENPRO_EMAIL_CIDS.logo,
        GREENPRO_EMAIL_CIDS.pageHeader,
        GREENPRO_EMAIL_CIDS.socialFb,
      ]),
    );
  });

  it('merges product share CID with layout attachments', () => {
    const merged = mergeGreenProEmailAttachments([
      {
        filename: 'product.jpg',
        content: Buffer.from('img'),
        cid: 'greenpro-product-share-image',
        contentDisposition: 'inline',
      },
    ]);
    expect(merged.some((a) => a.cid === 'greenpro-product-share-image')).toBe(
      true,
    );
    expect(merged.some((a) => a.cid === GREENPRO_EMAIL_CIDS.logo)).toBe(true);
  });

  it('rawHtml bypass skips shell wrap and layout attachments', async () => {
    const ok = await service.sendEmail(
      'vendor@example.com',
      'Raw',
      '<html><body><p>Raw only</p></body></html>',
      undefined,
      { rawHtml: true },
    );
    expect(ok).toBe(true);
    const mail = sendMail.mock.calls[0][0];
    expect(mail.html).toBe('<html><body><p>Raw only</p></body></html>');
    expect(mail.attachments).toBeUndefined();
  });
});
