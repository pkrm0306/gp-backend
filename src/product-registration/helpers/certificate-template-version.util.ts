/**
 * Certificate PDF artwork versions.
 *
 * v1 — legacy background (products certified before the cutoff)
 * v2 — Certificate-template.jpg (products certified on/after the cutoff)
 */
export type CertificateTemplateVersion = 1 | 2;

/** Inclusive: certifiedDate >= this instant uses the new template. */
export const CERTIFICATE_TEMPLATE_V2_CUTOFF = new Date(
  '2026-09-22T00:00:00.000Z',
);

export const CERTIFICATE_BACKGROUND_FILES_V1 = [
  'GPAMNS281001 2_page-0001.jpg',
  'cert-bg2.jpg',
  'cert-bg.jpg',
] as const;

export const CERTIFICATE_BACKGROUND_FILES_V2 = [
  'Certificate-template.jpg',
] as const;

export type CertificateTemplateLayout = {
  version: CertificateTemplateVersion;
  backgroundFiles: readonly string[];
  productSize: number;
  eoiSize: number;
  bodySize: number;
  yProduct: number;
  yEoi: number;
  yManu1: number;
  yManu2: number;
  yValid: number;
};

/** Layout tuned for legacy GPAMNS / cert-bg artwork (787×590 pt page). */
export const CERTIFICATE_LAYOUT_V1: CertificateTemplateLayout = {
  version: 1,
  backgroundFiles: CERTIFICATE_BACKGROUND_FILES_V1,
  productSize: 18,
  eoiSize: 15,
  bodySize: 12,
  yProduct: 341.4,
  yEoi: 311.8,
  yManu1: 283.6,
  yManu2: 261.7,
  yValid: 239.7,
};

/**
 * Layout for Certificate-template.jpg — header/signatures are baked into the
 * image; dynamic text sits in the open center band below "hereby certifies that".
 */
export const CERTIFICATE_LAYOUT_V2: CertificateTemplateLayout = {
  version: 2,
  backgroundFiles: CERTIFICATE_BACKGROUND_FILES_V2,
  productSize: 18,
  eoiSize: 15,
  bodySize: 12,
  yProduct: 355,
  yEoi: 325,
  yManu1: 295,
  yManu2: 273,
  yValid: 251,
};

export function resolveCertificateTemplateVersion(
  certifiedDate?: Date | string | null,
): CertificateTemplateVersion {
  if (certifiedDate == null || certifiedDate === '') {
    return 1;
  }
  const d =
    certifiedDate instanceof Date ? certifiedDate : new Date(certifiedDate);
  if (Number.isNaN(d.getTime())) {
    return 1;
  }
  return d.getTime() >= CERTIFICATE_TEMPLATE_V2_CUTOFF.getTime() ? 2 : 1;
}

export function resolveCertificateTemplateLayout(
  certifiedDate?: Date | string | null,
): CertificateTemplateLayout {
  return resolveCertificateTemplateVersion(certifiedDate) === 2
    ? CERTIFICATE_LAYOUT_V2
    : CERTIFICATE_LAYOUT_V1;
}
