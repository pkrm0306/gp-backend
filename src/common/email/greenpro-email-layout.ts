import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import type { Attachment } from 'nodemailer/lib/mailer';

/** Inline CID ids used in the branded shell (must match attachment cid). */
export const GREENPRO_EMAIL_CIDS = {
  logo: 'greenpro-logo',
  pageHeader: 'greenpro-page-header',
  socialFb: 'greenpro-social-fb',
  socialTw: 'greenpro-social-t',
  socialIn: 'greenpro-social-in',
} as const;

const ASSET_DIR = join(process.cwd(), 'public', 'email_template_img');

export const GREENPRO_EMAIL_ASSET_PATHS = {
  logo: join(ASSET_DIR, 'logo.png'),
  pageHeader: join(ASSET_DIR, 'page-header.png'),
  socialFb: join(ASSET_DIR, 'social_fb.png'),
  socialTw: join(ASSET_DIR, 'social_t.png'),
  socialIn: join(ASSET_DIR, 'social_in.png'),
} as const;

/** Peach highlight used for key terms (GreenPro, OTP, etc.). */
export const GREENPRO_HIGHLIGHT_STYLE =
  'background-color:#ffe5b4;padding:2px 6px;border-radius:2px;';

const DEFAULT_CONTACT_EMAIL = 'greenpro@cii.in';

export type GreenProEmailLayoutOptions = {
  subject?: string;
  /** Trusted HTML body fragment (no full document). */
  bodyHtml: string;
  contactEmail?: string;
  year?: number;
  aboutUrl?: string;
  contactUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  /**
   * When true (default), append standard contact + regards lines under bodyHtml.
   * Set false when the body already includes its own sign-off chrome.
   */
  includeStandardSignOff?: boolean;
};

export function escapeEmailHtml(input: string): string {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** Wrap plain text in the soft peach highlight span. */
export function highlightTerm(text: string): string {
  return `<span style="${GREENPRO_HIGHLIGHT_STYLE}">${escapeEmailHtml(text)}</span>`;
}

/**
 * Case-insensitive highlight of whole-word-ish tokens inside already-escaped
 * or trusted HTML text nodes. Prefer highlightTerm for dynamic values.
 */
export function highlightHtml(html: string, terms: string[]): string {
  let out = String(html ?? '');
  for (const term of terms) {
    const t = String(term ?? '').trim();
    if (!t) continue;
    const re = new RegExp(
      `(?<![\\w@])(${escapeRegExp(t)})(?![\\w])`,
      'gi',
    );
    out = out.replace(re, `<span style="${GREENPRO_HIGHLIGHT_STYLE}">$1</span>`);
  }
  return out;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readAssetBuffer(path: string): Buffer | null {
  try {
    if (!existsSync(path)) return null;
    return readFileSync(path);
  } catch {
    return null;
  }
}

/**
 * Nodemailer inline attachments for the branded shell.
 * Missing files are skipped (layout still sends; image cells may be empty).
 */
export function getGreenProEmailInlineAttachments(): Attachment[] {
  const specs: Array<{
    cid: string;
    filename: string;
    path: string;
  }> = [
    {
      cid: GREENPRO_EMAIL_CIDS.logo,
      filename: 'logo.png',
      path: GREENPRO_EMAIL_ASSET_PATHS.logo,
    },
    {
      cid: GREENPRO_EMAIL_CIDS.pageHeader,
      filename: 'page-header.png',
      path: GREENPRO_EMAIL_ASSET_PATHS.pageHeader,
    },
    {
      cid: GREENPRO_EMAIL_CIDS.socialFb,
      filename: 'social_fb.png',
      path: GREENPRO_EMAIL_ASSET_PATHS.socialFb,
    },
    {
      cid: GREENPRO_EMAIL_CIDS.socialTw,
      filename: 'social_t.png',
      path: GREENPRO_EMAIL_ASSET_PATHS.socialTw,
    },
    {
      cid: GREENPRO_EMAIL_CIDS.socialIn,
      filename: 'social_in.png',
      path: GREENPRO_EMAIL_ASSET_PATHS.socialIn,
    },
  ];

  const attachments: Attachment[] = [];
  for (const spec of specs) {
    const content = readAssetBuffer(spec.path);
    if (!content) continue;
    attachments.push({
      filename: spec.filename,
      content,
      cid: spec.cid,
      contentType: 'image/png',
      contentDisposition: 'inline',
    });
  }
  return attachments;
}

/** Merge caller attachments with layout CIDs; layout wins on cid collision. */
export function mergeGreenProEmailAttachments(
  explicit?: Attachment[] | null,
): Attachment[] {
  const layout = getGreenProEmailInlineAttachments();
  const layoutCids = new Set(
    layout.map((a) => String(a.cid ?? '').toLowerCase()).filter(Boolean),
  );
  const extra = (explicit ?? []).filter((a) => {
    const cid = String(a.cid ?? '').toLowerCase();
    return !cid || !layoutCids.has(cid);
  });
  return [...layout, ...extra];
}

function navLink(label: string, href?: string): string {
  const text = escapeEmailHtml(label);
  const url = String(href ?? '').trim();
  if (!url) {
    return `<span style="color:#6b7280;font-size:12px;letter-spacing:0.08em;font-family:Arial,Helvetica,sans-serif;">${text}</span>`;
  }
  return `<a href="${escapeEmailHtml(url)}" style="color:#6b7280;font-size:12px;letter-spacing:0.08em;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">${text}</a>`;
}

function socialIcon(
  cid: string,
  href: string | undefined,
  alt: string,
): string {
  const img = `<img src="cid:${cid}" alt="${escapeEmailHtml(alt)}" width="28" height="28" style="display:inline-block;width:28px;height:28px;border:0;" />`;
  const url = String(href ?? '').trim() || '#';
  return `<a href="${escapeEmailHtml(url)}" style="display:inline-block;margin:0 10px;text-decoration:none;">${img}</a>`;
}

/**
 * Full branded HTML document. bodyHtml is injected into the middle slot.
 */
export function buildGreenProEmailHtml(
  options: GreenProEmailLayoutOptions,
): string {
  const title = escapeEmailHtml(options.subject || 'GreenPro Notification');
  const year = options.year ?? new Date().getFullYear();
  const contactEmail =
    String(options.contactEmail ?? '').trim() || DEFAULT_CONTACT_EMAIL;
  const includeSignOff = options.includeStandardSignOff !== false;

  const about = navLink('ABOUT', options.aboutUrl);
  const contact = navLink('CONTACT', options.contactUrl || options.aboutUrl);

  const signOffHtml = includeSignOff
    ? `
      <p style="margin:20px 0 8px;font-size:15px;line-height:1.6;color:#111827;font-family:Arial,Helvetica,sans-serif;">
        Contact ${highlightTerm('GreenPro')} at:
        <a href="mailto:${escapeEmailHtml(contactEmail)}" style="color:#2563eb;text-decoration:underline;">${escapeEmailHtml(contactEmail)}</a>
      </p>
      <p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:#111827;font-family:Arial,Helvetica,sans-serif;">
        Regards,<br/>
        ${highlightTerm('GreenPro')}
      </p>`
    : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f3f4f6;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:640px;background:#ffffff;border:1px solid #e5e7eb;">
          <!-- Top green rule -->
          <tr>
            <td style="height:4px;line-height:4px;font-size:0;background:#16a34a;">&nbsp;</td>
          </tr>
          <!-- Logo + ABOUT | CONTACT -->
          <tr>
            <td style="padding:16px 20px 8px 20px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="left" valign="middle" style="width:50%;">
                    <img src="cid:${GREENPRO_EMAIL_CIDS.logo}" alt="GreenPro" width="88" style="display:block;width:88px;max-width:88px;height:auto;border:0;" />
                  </td>
                  <td align="right" valign="middle" style="width:50%;">
                    ${about}
                    <span style="color:#9ca3af;font-size:12px;padding:0 6px;font-family:Arial,Helvetica,sans-serif;">|</span>
                    ${contact}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Brand banner -->
          <tr>
            <td style="padding:8px 0 0 0;">
              <img src="cid:${GREENPRO_EMAIL_CIDS.pageHeader}" alt="GreenPro — IGBC · GreenCo · CII" width="640" style="display:block;width:100%;max-width:640px;height:auto;border:0;" />
            </td>
          </tr>
          <!-- Body slot -->
          <tr>
            <td style="padding:28px 28px 8px 28px;font-size:15px;line-height:1.7;color:#111827;font-family:Arial,Helvetica,sans-serif;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.5;color:#4ade80;font-family:Arial,Helvetica,sans-serif;">
                Greeting from ${highlightTerm('GreenPro')},
              </p>
              ${options.bodyHtml}
              ${signOffHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#16a34a;padding:22px 16px;text-align:center;">
              <div style="margin:0 0 14px 0;">
                ${socialIcon(GREENPRO_EMAIL_CIDS.socialFb, options.facebookUrl, 'Facebook')}
                ${socialIcon(GREENPRO_EMAIL_CIDS.socialTw, options.twitterUrl, 'Twitter')}
                ${socialIcon(GREENPRO_EMAIL_CIDS.socialIn, options.linkedinUrl, 'LinkedIn')}
              </div>
              <p style="margin:0;font-size:12px;line-height:1.5;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
                &copy; Copyright ${year} ${highlightTerm('GreenPro')}. All rights Reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
