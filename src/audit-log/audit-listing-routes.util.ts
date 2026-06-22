/**
 * Read-only listing/search/export routes should not create audit rows.
 * GET list endpoints are already excluded by method; this covers POST list APIs
 * and defensive skips for audit-log read APIs.
 */
export function isListingAuditPath(pathNorm: string): boolean {
  const p = (pathNorm || '/').toLowerCase();

  if (p.startsWith('/admin/audit-log')) {
    return true;
  }

  if (/(?:^|\/)(?:list|listing)(?:\/|$)/.test(p)) {
    return true;
  }

  if (/(?:^|\/)search(?:\/|$)/.test(p)) {
    return true;
  }

  if (/(?:^|\/)export(?:\/|$)/.test(p)) {
    return true;
  }

  if (/(?:^|\/)dropdown(?:\/|$)/.test(p)) {
    return true;
  }

  if (/\/filter-options$/.test(p)) {
    return true;
  }

  return false;
}
