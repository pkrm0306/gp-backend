import { existsSync } from 'fs';
import {
  GREENPRO_EMAIL_ASSET_PATHS,
  GREENPRO_EMAIL_CIDS,
  buildGreenProEmailHtml,
  getGreenProEmailInlineAttachments,
  highlightTerm,
  mergeGreenProEmailAttachments,
} from './greenpro-email-layout';

describe('greenpro-email-layout', () => {
  it('builds branded HTML with logo, page-header, social CIDs, body, and year', () => {
    const year = 2026;
    const html = buildGreenProEmailHtml({
      subject: 'Test Subject',
      bodyHtml: '<p>Middle body content</p>',
      year,
      aboutUrl: 'https://example.com/about',
      contactUrl: 'https://example.com/contact',
    });

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain(`cid:${GREENPRO_EMAIL_CIDS.logo}`);
    expect(html).toContain(`cid:${GREENPRO_EMAIL_CIDS.pageHeader}`);
    expect(html).toContain(`cid:${GREENPRO_EMAIL_CIDS.socialFb}`);
    expect(html).toContain(`cid:${GREENPRO_EMAIL_CIDS.socialTw}`);
    expect(html).toContain(`cid:${GREENPRO_EMAIL_CIDS.socialIn}`);
    expect(html).toContain('Middle body content');
    expect(html).toContain('Greeting from');
    expect(html).toContain('ABOUT');
    expect(html).toContain('CONTACT');
    expect(html).toContain(`Copyright ${year}`);
    expect(html).toContain('mailto:greenpro@cii.in');
  });

  it('highlightTerm wraps text in peach highlight span', () => {
    expect(highlightTerm('OTP')).toContain('OTP');
    expect(highlightTerm('OTP')).toContain('background-color:#ffe5b4');
    expect(highlightTerm('<script>')).not.toContain('<script>');
  });

  it('loads inline attachments from public/email_template_img when files exist', () => {
    const attachments = getGreenProEmailInlineAttachments();
    const expectedFiles = Object.values(GREENPRO_EMAIL_ASSET_PATHS).filter(
      (path) => existsSync(path),
    );
    expect(attachments.length).toBe(expectedFiles.length);
    expect(attachments.every((a) => a.contentDisposition === 'inline')).toBe(
      true,
    );
    expect(attachments.map((a) => a.cid)).toEqual(
      expect.arrayContaining([
        GREENPRO_EMAIL_CIDS.logo,
        GREENPRO_EMAIL_CIDS.pageHeader,
      ]),
    );
  });

  it('mergeGreenProEmailAttachments keeps extra CIDs and dedupes layout CIDs', () => {
    const merged = mergeGreenProEmailAttachments([
      {
        filename: 'product.png',
        content: Buffer.from('x'),
        cid: 'greenpro-product-share-image',
        contentDisposition: 'inline',
      },
      {
        filename: 'logo-override.png',
        content: Buffer.from('y'),
        cid: GREENPRO_EMAIL_CIDS.logo,
        contentDisposition: 'inline',
      },
    ]);
    const logoHits = merged.filter((a) => a.cid === GREENPRO_EMAIL_CIDS.logo);
    expect(logoHits).toHaveLength(1);
    expect(logoHits[0].filename).toBe('logo.png');
    expect(
      merged.some((a) => a.cid === 'greenpro-product-share-image'),
    ).toBe(true);
  });
});
