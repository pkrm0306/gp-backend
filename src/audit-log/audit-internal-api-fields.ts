/**
 * Centralized detection of internal API envelope / transport fields.
 *
 * Applied on audit *response* shaping (storage unchanged). Exact keys cover
 * known Nest/Express envelopes; patterns catch common future variants
 * (http*, *StatusCode, isSuccess, etc.) across all audit modules.
 */

import { normalizeAuditFieldKey } from './audit-ignore-fields';

function normalizeInternalFieldKey(key: string): string {
  return normalizeAuditFieldKey(key).replace(/[-_\s]/g, '');
}

/**
 * Exact API envelope / response-flag keys that are never business detail.
 */
export const AUDIT_INTERNAL_API_ENVELOPE_KEYS = [
  'success',
  'ok',
  'fail',
  'failed',
  'failure',
  'message',
  'msg',
  'meta',
  'metadata',
  'data',
  'error',
  'errors',
  'errorcode',
  'errcode',
  'statuscode',
  'statustext',
  'statusmessage',
  'httpstatus',
  'httpstatuscode',
  'httpmethod',
  'headers',
  'header',
  'stack',
  'stacktrace',
  'traceid',
  'spanid',
  'requestid',
  'correlationid',
  'timestamp',
  'timestamps',
  'ispermitted',
  'isauthorized',
  'authenticated',
] as const;

/**
 * Patterns for common transport / envelope variants.
 * Keep narrow enough to avoid business keys like paymentStatus / urnStatus / status.
 */
const AUDIT_INTERNAL_API_ENVELOPE_PATTERNS: readonly RegExp[] = [
  /^http(status|statuscode|method|header|headers)$/,
  /^(api|response|request)(status|code|message|meta|metadata|header|headers)$/,
  /^(is)?success(ful)?$/,
  /^is(ok|error|failure|failed)$/,
  /^(statuscode|statustext|statusmessage|httpmethod)$/,
  /^(request|response)(id|ids)$/,
  /^(trace|span|correlation)id$/,
  /^stack(trace)?$/,
];

const AUDIT_INTERNAL_API_ENVELOPE_KEY_SET = new Set(
  AUDIT_INTERNAL_API_ENVELOPE_KEYS.map(normalizeInternalFieldKey),
);

/**
 * True when a snapshot/metadata key is API transport noise rather than
 * business audit detail.
 */
export function isInternalApiEnvelopeField(key: string): boolean {
  const normalized = normalizeInternalFieldKey(key);
  if (!normalized) {
    return false;
  }
  if (AUDIT_INTERNAL_API_ENVELOPE_KEY_SET.has(normalized)) {
    return true;
  }
  return AUDIT_INTERNAL_API_ENVELOPE_PATTERNS.some((pattern) =>
    pattern.test(normalized),
  );
}
