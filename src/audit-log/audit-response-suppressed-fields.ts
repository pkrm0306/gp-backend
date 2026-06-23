import { normalizeAuditFieldKey } from './audit-ignore-fields';

function normalizeSuppressedFieldKey(key: string): string {
  return normalizeAuditFieldKey(key).replace(/[-_\s]/g, '');
}

/**
 * Internal workflow completion flags for selected process tabs.
 * Omitted from audit log API responses only (stored audit rows are unchanged).
 */
const PROCESS_TAB_STATUS_KEY_PATTERN =
  /^process(wastemanagement|manufacturing|lifecycleapproach|innovation)status$/;

export function isAuditResponseSuppressedFieldKey(key: string): boolean {
  const normalized = normalizeSuppressedFieldKey(key);
  if (normalized === 'productstewardshipstatus') {
    return true;
  }
  if (PROCESS_TAB_STATUS_KEY_PATTERN.test(normalized)) {
    return true;
  }

  const labelMatch = normalized.match(
    /^(.+?)status(label|name|display|text)$/,
  );
  if (labelMatch?.[1]) {
    return isAuditResponseSuppressedFieldKey(`${labelMatch[1]}Status`);
  }

  return false;
}

export function omitSuppressedAuditResponseFields(
  values: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!values || typeof values !== 'object' || Array.isArray(values)) {
    return values;
  }
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (isAuditResponseSuppressedFieldKey(key)) {
      continue;
    }
    out[key] = value;
  }
  return Object.keys(out).length ? out : undefined;
}

export function omitSuppressedAuditResponseChanges(
  changes: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
    return changes;
  }
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(changes)) {
    if (isAuditResponseSuppressedFieldKey(key)) {
      continue;
    }
    out[key] = value;
  }
  return Object.keys(out).length ? out : undefined;
}
