import {
  CERTIFICATE_TEMPLATE_V2_CUTOFF,
  resolveCertificateTemplateLayout,
  resolveCertificateTemplateVersion,
} from './certificate-template-version.util';

describe('certificate-template-version.util', () => {
  it('uses v1 when certifiedDate is missing or invalid', () => {
    expect(resolveCertificateTemplateVersion(null)).toBe(1);
    expect(resolveCertificateTemplateVersion(undefined)).toBe(1);
    expect(resolveCertificateTemplateVersion('')).toBe(1);
    expect(resolveCertificateTemplateVersion('not-a-date')).toBe(1);
  });

  it('uses v1 for products certified before the cutoff', () => {
    expect(
      resolveCertificateTemplateVersion(new Date('2026-09-21T23:59:59.999Z')),
    ).toBe(1);
    expect(resolveCertificateTemplateVersion('2025-01-15T10:00:00.000Z')).toBe(
      1,
    );
  });

  it('uses v2 from the cutoff inclusive', () => {
    expect(
      resolveCertificateTemplateVersion(CERTIFICATE_TEMPLATE_V2_CUTOFF),
    ).toBe(2);
    expect(
      resolveCertificateTemplateVersion(new Date('2026-09-22T00:00:00.000Z')),
    ).toBe(2);
    expect(
      resolveCertificateTemplateVersion(new Date('2026-09-22T12:00:00.000Z')),
    ).toBe(2);
  });

  it('returns matching layout metadata', () => {
    expect(resolveCertificateTemplateLayout(null).version).toBe(1);
    expect(
      resolveCertificateTemplateLayout(
        new Date('2026-09-22T00:00:00.000Z'),
      ).backgroundFiles,
    ).toContain('Certificate-template.jpg');
  });
});
