import {
  RENEWAL_PAYMENT_FIELD_ORDER,
  EXPIRED_TO_CERTIFIED_FIELD_ORDER,
  applyAuditValueAllowlist,
  isPolicyValueAllowed,
  orderAuditSnapshotFields,
  presentAuditMetadataFields,
  presentAuditSnapshotFields,
  resolveAuditPresentationPolicy,
} from './audit-presentation-policy';
import { AUDIT_ACTION } from './audit-actions';

describe('audit-presentation-policy', () => {
  const isGloballySuppressed = (key: string) =>
    /^(renewalcycleid|paymentid|vendorid)$/i.test(
      key.replace(/[-_\s]/g, ''),
    );

  describe('resolveAuditPresentationPolicy', () => {
    it('resolves renewal payment decision by metadata', () => {
      const policy = resolveAuditPresentationPolicy({
        description: 'Renewal payment approved',
        metadata: { business_event_type: 'renewal_payment_decision' },
      });
      expect(policy?.id).toBe('renewal_payment');
      expect(policy?.fieldOrder).toEqual([...RENEWAL_PAYMENT_FIELD_ORDER]);
    });

    it('resolves renewal payment decision by description alone', () => {
      expect(
        resolveAuditPresentationPolicy({
          description: 'Renewal payment rejected',
        })?.id,
      ).toBe('renewal_payment');
    });

    it('resolves expired→certified by action', () => {
      expect(
        resolveAuditPresentationPolicy({
          action: AUDIT_ACTION.EXPIRED_REACTIVATE_PRODUCT,
          description: 'Expired product reactivated to certified',
        })?.id,
      ).toBe('expired_to_certified');
    });

    it('resolves certification fee by business_event_type', () => {
      expect(
        resolveAuditPresentationPolicy({
          metadata: { business_event_type: 'certification_fee' },
        })?.id,
      ).toBe('certification_fee');
    });

    it('returns undefined for unmatched audits', () => {
      expect(
        resolveAuditPresentationPolicy({
          description: 'Payment record updated',
          action: AUDIT_ACTION.PAYMENT_UPDATED,
        }),
      ).toBeUndefined();
    });
  });

  describe('orderAuditSnapshotFields', () => {
    it('orders renewal fields consistently regardless of input key order', () => {
      const ordered = orderAuditSnapshotFields(
        {
          paymentRejectionRemarks: 'Missing invoice',
          paymentStatus: 'Payment Rejected',
          urnStatus: 'Renewal Payment Rejected',
          urnNo: 'URN-1',
          paymentType: 'Renewal',
        },
        RENEWAL_PAYMENT_FIELD_ORDER,
      );

      expect(Object.keys(ordered ?? {})).toEqual([
        'urnNo',
        'paymentType',
        'paymentStatus',
        'paymentRejectionRemarks',
        'urnStatus',
      ]);
    });

    it('appends unknown keys after declared order', () => {
      const ordered = orderAuditSnapshotFields(
        {
          customNote: 'extra',
          eoiNo: 'EOI-1',
          urnNo: 'URN-1',
        },
        EXPIRED_TO_CERTIFIED_FIELD_ORDER,
      );

      expect(Object.keys(ordered ?? {})).toEqual([
        'urnNo',
        'eoiNo',
        'customNote',
      ]);
    });

    it('returns source object when fieldOrder is empty', () => {
      const values = { b: 1, a: 2 };
      expect(orderAuditSnapshotFields(values, [])).toBe(values);
    });
  });

  describe('presentAuditSnapshotFields — renewal', () => {
    const renewalCtx = {
      description: 'Renewal payment approved',
      metadata: { business_event_type: 'renewal_payment_decision' },
    };

    it('allowlists, drops internals, and orders approve payloads', () => {
      const result = presentAuditSnapshotFields(
        {
          paymentStatus: 'Payment Approve',
          renewalCycleId: 'cycle-1',
          paymentId: 9,
          urnStatus: 'Renewal Payment Approved',
          vendorId: 'v-1',
          urnNo: 'URN-RENEW-1',
          paymentType: 'Renewal',
          quoteTotal: 1000,
        },
        renewalCtx,
        isGloballySuppressed,
      );

      expect(result).toEqual({
        urnNo: 'URN-RENEW-1',
        paymentType: 'Renewal',
        paymentStatus: 'Payment Approve',
        urnStatus: 'Renewal Payment Approved',
      });
      expect(Object.keys(result ?? {})).toEqual([
        'urnNo',
        'paymentType',
        'paymentStatus',
        'urnStatus',
      ]);
    });

    it('keeps rejection remarks in canonical order', () => {
      const result = presentAuditSnapshotFields(
        {
          adminPaymentRejectionRemarks: 'Admin note',
          renewalCycleId: 'cycle-1',
          paymentRejectionRemarks: 'Incomplete proof',
          paymentType: 'Renewal',
          urnNo: 'URN-1',
          paymentStatus: 'Payment Rejected',
        },
        {
          description: 'Renewal payment rejected',
          metadata: {
            business_event_type: 'renewal_payment_decision',
            renewal_payment_decision: 'reject',
          },
        },
        isGloballySuppressed,
      );

      expect(Object.keys(result ?? {})).toEqual([
        'urnNo',
        'paymentType',
        'paymentStatus',
        'paymentRejectionRemarks',
        'adminPaymentRejectionRemarks',
      ]);
      expect(result).toMatchObject({
        paymentRejectionRemarks: 'Incomplete proof',
        adminPaymentRejectionRemarks: 'Admin note',
      });
    });
  });

  describe('presentAuditSnapshotFields — expired→certified', () => {
    it('filters and orders status-transition fields', () => {
      const result = presentAuditSnapshotFields(
        {
          validtillDate: '2027-07-15',
          message: 'ok',
          toStatus: 'Certified',
          urnNo: 'URN-EXP',
          productStatus: 'Certified',
          eoiNo: 'EOI-1',
          fromStatus: 'Expired',
        },
        {
          action: AUDIT_ACTION.EXPIRED_REACTIVATE_PRODUCT,
          description: 'Expired product reactivated to certified',
        },
        () => false,
      );

      expect(Object.keys(result ?? {})).toEqual([
        'urnNo',
        'eoiNo',
        'fromStatus',
        'productStatus',
        'toStatus',
        'validtillDate',
      ]);
      expect(result).not.toHaveProperty('message');
    });
  });

  describe('presentAuditMetadataFields', () => {
    it('allowlists only error_message for renewal', () => {
      expect(
        presentAuditMetadataFields(
          {
            business_event_type: 'renewal_payment_decision',
            consolidated: true,
            duration_ms: 12,
            error_message: 'Cannot approve',
            audit_event_id: 'x',
          },
          {
            description: 'Renewal payment approved',
            metadata: { business_event_type: 'renewal_payment_decision' },
          },
          () => true,
        ),
      ).toEqual({ error_message: 'Cannot approve' });
    });

    it('strips global denylist keys when no policy matches', () => {
      expect(
        presentAuditMetadataFields(
          {
            duration_ms: 12,
            body_fields: ['a'],
            audit_event_id: 'keep-me',
            note: 'visible',
          },
          { description: 'Generic update' },
          (key) => key === 'durationms' || key === 'bodyfields',
        ),
      ).toEqual({
        audit_event_id: 'keep-me',
        note: 'visible',
      });
    });
  });

  describe('helpers', () => {
    it('isPolicyValueAllowed respects valueKeys', () => {
      const policy = resolveAuditPresentationPolicy({
        metadata: { business_event_type: 'renewal_payment_decision' },
      });
      expect(policy).toBeDefined();
      expect(
        isPolicyValueAllowed(policy!, 'paymentStatus', {
          metadata: { business_event_type: 'renewal_payment_decision' },
        }),
      ).toBe(true);
      expect(
        isPolicyValueAllowed(policy!, 'quoteTotal', {
          metadata: { business_event_type: 'renewal_payment_decision' },
        }),
      ).toBe(false);
    });

    it('applyAuditValueAllowlist skips globally suppressed keys', () => {
      expect(
        applyAuditValueAllowlist(
          { urnNo: 'U1', paymentId: 1, paymentType: 'renew' },
          (key) => key === 'urnNo' || key === 'paymentType' || key === 'paymentId',
          (key) => key === 'paymentId',
        ),
      ).toEqual({ urnNo: 'U1', paymentType: 'renew' });
    });
  });
});
