import {
  AUDIT_INTERNAL_API_ENVELOPE_KEYS,
  isInternalApiEnvelopeField,
} from './audit-internal-api-fields';
import {
  filterAuditResponseChanges,
  filterAuditResponseFields,
  filterAuditResponseMetadata,
  isAuditResponseSuppressedFieldKey,
} from './audit-response-suppressed-fields';

describe('audit-internal-api-fields', () => {
  it('flags known API envelope and response-flag keys', () => {
    for (const key of [
      'success',
      'ok',
      'message',
      'meta',
      'data',
      'errors',
      'statusCode',
      'status_code',
      'httpStatus',
      'http_method',
      'headers',
      'stackTrace',
      'traceId',
      'isSuccess',
      'isSuccessful',
      'apiStatus',
      'responseCode',
      'requestId',
    ]) {
      expect(isInternalApiEnvelopeField(key)).toBe(true);
    }
  });

  it('does not flag meaningful business fields', () => {
    for (const key of [
      'urnNo',
      'paymentStatus',
      'urnStatus',
      'productStatus',
      'status',
      'rejectionRemarks',
      'portableWaterDemand',
      'uploadedDocuments',
      'category_name',
    ]) {
      expect(isInternalApiEnvelopeField(key)).toBe(false);
    }
  });

  it('exports a stable exact-key catalog used by response filtering', () => {
    expect(AUDIT_INTERNAL_API_ENVELOPE_KEYS).toEqual(
      expect.arrayContaining(['success', 'message', 'meta', 'statuscode']),
    );
  });
});

describe('Internal API envelope response filtering', () => {
  const genericCtx = {
    action: 'HTTP_MUTATION',
    module: 'other',
    description: 'Resource updated',
    route: '/api/some-module',
  };

  it('strips success / message / meta / HTTP metadata from unmatched audit snapshots', () => {
    expect(
      filterAuditResponseFields(
        {
          urnNo: 'URN-1',
          paymentStatus: 2,
          success: true,
          message: 'Saved successfully',
          meta: { filesUploaded: 1 },
          statusCode: 200,
          httpStatus: 200,
          headers: { 'content-type': 'application/json' },
          isSuccess: true,
          data: { nested: true },
        },
        genericCtx,
      ),
    ).toEqual({
      urnNo: 'URN-1',
      paymentStatus: 2,
    });
  });

  it('strips the same envelope noise from change pairs', () => {
    expect(
      filterAuditResponseChanges(
        {
          paymentStatus: { before: 1, after: 2 },
          success: { before: false, after: true },
          message: { before: null, after: 'ok' },
          statusCode: { before: 200, after: 200 },
        },
        genericCtx,
      ),
    ).toEqual({
      paymentStatus: { before: 1, after: 2 },
    });
  });

  it('strips envelope keys from unmatched metadata while keeping audit_event_id', () => {
    expect(
      filterAuditResponseMetadata(
        {
          audit_event_id: 'event-1',
          duration_ms: 40,
          success: true,
          message: 'done',
          meta: { page: 1 },
          statusCode: 200,
          http_method: 'POST',
        },
        genericCtx,
      ),
    ).toEqual({
      audit_event_id: 'event-1',
    });
  });

  it('automatically suppresses future http* / isSuccess* variants via patterns', () => {
    expect(isAuditResponseSuppressedFieldKey('httpStatusCode')).toBe(true);
    expect(isAuditResponseSuppressedFieldKey('responseMessage')).toBe(true);
    expect(isAuditResponseSuppressedFieldKey('apiMetadata')).toBe(true);
    expect(isAuditResponseSuppressedFieldKey('isOk')).toBe(true);
    expect(isAuditResponseSuppressedFieldKey('paymentStatus')).toBe(false);
    expect(isAuditResponseSuppressedFieldKey('status')).toBe(false);
  });

  it('keeps business status keys while hiding envelope flags', () => {
    expect(isAuditResponseSuppressedFieldKey('success')).toBe(true);
    expect(isAuditResponseSuppressedFieldKey('message')).toBe(true);
    expect(isAuditResponseSuppressedFieldKey('status')).toBe(false);
    expect(isAuditResponseSuppressedFieldKey('urnStatus')).toBe(false);
  });
});
