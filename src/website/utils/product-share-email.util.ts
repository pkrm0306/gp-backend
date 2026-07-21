/**
 * Rich HTML card for product share emails (Outlook / Gmail).
 * Two-column layout matching the product-share email mockup:
 * image left | title, badges, description, meta rows, CTA right.
 */

export type ProductShareEmailCardInput = {
  productName: string;
  manufacturerName?: string;
  /** Display product / EOI code (e.g. GPNE042002) */
  productCode?: string;
  eoiNo?: string;
  categoryName?: string;
  /** Short badge label (e.g. STEEL) — falls back to categoryName */
  categoryBadge?: string;
  validFrom?: string;
  validTo?: string;
  shareUrl?: string;
  imageUrl?: string;
  description?: string;
  /**
   * When set, HTML uses `cid:...` so the image is embedded from the email attachment
   * (works in Outlook without loading remote images).
   */
  embeddedImageCid?: string;
};

function escapeHtml(value: string): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function display(value: unknown, fallback = '—'): string {
  const s = String(value ?? '').trim();
  return s || fallback;
}

/** Small green circular icon (emoji fallback — widely supported in Outlook/Gmail). */
function metaRow(icon: string, label: string, value: string): string {
  return `
<tr>
  <td style="padding:0 0 10px 0;vertical-align:top;width:28px;">
    <span style="display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;border-radius:50%;background:#e8f5ee;color:#0a7d44;font-size:12px;">${icon}</span>
  </td>
  <td style="padding:0 0 10px 8px;vertical-align:top;font-size:14px;line-height:1.4;color:#374151;font-family:Arial,Helvetica,sans-serif;">
    <strong style="color:#111827;">${escapeHtml(label)}:</strong> ${escapeHtml(value)}
  </td>
</tr>`;
}

export function buildProductShareEmailSubject(productName: string): string {
  const name = String(productName ?? '').trim() || 'GreenPro product';
  return `Check out this product – ${name}`;
}

export function buildProductShareEmailText(
  input: ProductShareEmailCardInput,
): string {
  const productName = display(input.productName, 'GreenPro product');
  const productCode = display(input.productCode || input.eoiNo);
  const categoryName = display(input.categoryName);
  const manufacturerName = display(input.manufacturerName);
  const validFrom = display(input.validFrom);
  const validTo = display(input.validTo);
  const shareUrl = String(input.shareUrl ?? '').trim();
  const imageUrl = String(input.imageUrl ?? '').trim();

  return [
    'GreenPro certified product',
    '',
    `Product: ${productName}`,
    `Product ID: ${productCode}`,
    `Category: ${categoryName}`,
    `Manufacturer: ${manufacturerName}`,
    `Valid From: ${validFrom}`,
    `Valid To: ${validTo}`,
    '',
    shareUrl ? `Product link: ${shareUrl}` : '',
    imageUrl ? `Product image: ${imageUrl}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/** Full HTML document — send with EmailService `rawHtml: true` (do not wrap). */
export function buildProductShareEmailHtml(
  input: ProductShareEmailCardInput,
): string {
  const productName = display(input.productName, 'GreenPro product');
  const manufacturerName = display(input.manufacturerName);
  const productCode = display(input.productCode || input.eoiNo);
  const categoryName = display(input.categoryName);
  const categoryBadge = display(
    input.categoryBadge || input.categoryName,
    'PRODUCT',
  ).toUpperCase();
  const validFrom = display(input.validFrom);
  const validTo = display(input.validTo);
  const shareUrl = String(input.shareUrl ?? '').trim();
  const imageUrl = String(input.imageUrl ?? '').trim();
  const embeddedCid = String(input.embeddedImageCid ?? '').trim();
  const description =
    String(input.description ?? '').trim() ||
    'GreenPro certified product built for sustainable performance.';

  const imgSrc = embeddedCid
    ? `cid:${embeddedCid}`
    : imageUrl
      ? escapeHtml(imageUrl)
      : '';

  const imageCell = imgSrc
    ? `<img src="${imgSrc}" alt="${escapeHtml(productName)}" width="260" style="display:block;width:100%;max-width:260px;height:auto;border:0;border-radius:12px;object-fit:cover;" />`
    : `<div style="width:100%;max-width:260px;height:200px;background:#eef2f0;border-radius:12px;"></div>`;

  const cta = shareUrl
    ? `<a href="${escapeHtml(shareUrl)}" style="display:inline-block;padding:12px 22px;border-radius:10px;background:#0a7d44;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;font-family:Arial,Helvetica,sans-serif;">View Product Details</a>`
    : '';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${escapeHtml(productName)}</title>
<!--[if mso]>
<style type="text/css">
body, table, td { font-family: Arial, Helvetica, sans-serif !important; }
</style>
<![endif]-->
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#ffffff;">
<tr>
<td align="center" style="padding:24px 16px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:680px;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;">
<tr>
<td style="padding:20px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
<tr>
<!-- Left: product image -->
<td valign="top" width="280" style="padding:0 16px 0 0;width:280px;">
${imageCell}
</td>
<!-- Right: details -->
<td valign="top" style="padding:0;">
<h1 style="margin:0 0 12px;font-size:26px;line-height:1.25;color:#111827;font-weight:700;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(productName)}</h1>
<p style="margin:0 0 12px;">
<span style="display:inline-block;padding:5px 12px;border-radius:999px;background:#0a7d44;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0.04em;font-family:Arial,Helvetica,sans-serif;">GREENPRO CERTIFIED</span>
<span style="display:inline-block;margin-left:8px;padding:5px 12px;border-radius:999px;background:#eff6ff;color:#1d4ed8;font-size:11px;font-weight:700;letter-spacing:0.04em;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(categoryBadge)}</span>
</p>
<p style="margin:0 0 16px;font-size:14px;line-height:1.55;color:#374151;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(description)}</p>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 18px;">
${metaRow('↻', 'Product ID', productCode)}
${metaRow('🏢', 'Category', categoryName)}
${metaRow('🏭', 'Manufacturer', manufacturerName)}
${metaRow('📅', 'Valid From', validFrom)}
${metaRow('📅', 'Valid To', validTo)}
</table>
${cta}
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;
}
