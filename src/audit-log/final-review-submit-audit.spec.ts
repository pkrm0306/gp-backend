import {
  AuditEntryFactory,
  type AuditableRequest,
} from './audit-entry.factory';
import { AuditRouteMapper } from './audit-route-map';
import { AuditStatusResolver } from './audit-status-resolver.service';
import { AuditValueTransformer } from './audit-value-transformer.service';
import { AuditPayloadPresenter } from './audit-payload-presenter.service';
import { AuditLookupResolver } from './audit-lookup-resolver.service';
import {
  filterAuditResponseFields,
  filterAuditResponseMetadata,
  isFinalReviewSubmitAudit,
} from './audit-response-suppressed-fields';
import { formatAuditDisplayDateTime } from './audit-date.util';
import { RENEWAL_URN_STATUS } from '../renew/constants/renewal-urn-status.constants';
import { AUDIT_ACTION } from './audit-actions';
import { resolveAuditPresentationPolicy } from './audit-presentation-policy';

/**
 * Regression: Submit for Final Review audits must store a slim business
 * snapshot and present human-readable statuses/dates without envelope noise.
 */
describe('Submit for Final Review audit', () => {
  const factory = (() => {
    const statusResolver = new AuditStatusResolver();
    const valueTransformer = new AuditValueTransformer(statusResolver);
    return new AuditEntryFactory(
      new AuditRouteMapper(valueTransformer),
      valueTransformer,
    );
  })();

  function request(params: {
    method: string;
    originalUrl: string;
    body?: Record<string, unknown>;
    response?: unknown;
  }): AuditableRequest {
    const req = {
      method: params.method,
      originalUrl: params.originalUrl,
      url: params.originalUrl,
      body: params.body ?? {},
      query: {},
      headers: {},
      socket: {},
    } as AuditableRequest;
    if (params.response !== undefined) {
      req.__auditResponseBody = params.response;
    }
    return req;
  }

  describe('write-time business summary', () => {
    it('records certification submit for final review (urnStatus 6) without envelope fields', () => {
      const entry = factory.create({
        req: request({
          method: 'PATCH',
          originalUrl: '/api/admin/products/urn-status',
          body: {
            urnNo: 'URN-FINAL-1',
            updateStatusType: 'urn_status',
            updateStatusTo: 6,
          },
          response: {
            success: true,
            message: 'URN status updated',
            data: { urnNo: 'URN-FINAL-1', urnStatus: 6 },
          },
        }),
        method: 'PATCH',
        resolvedPath: '/api/admin/products/urn-status',
        pathNorm: factory.normalizePath('/api/admin/products/urn-status'),
        outcome: 'success',
        statusCode: 200,
        startedAt: Date.now(),
      });

      expect(entry.action).toBe(AUDIT_ACTION.PRODUCT_URN_STATUS_UPDATED);
      expect(entry.description).toBe('Submitted for final review');
      expect(entry.action_type).toBe('update');
      expect(entry.metadata).toMatchObject({
        business_event_type: 'final_review_submit',
        final_review_workflow: 'certification',
        consolidated: true,
      });
      expect(String(entry.metadata?.audit_event_id)).toMatch(
        /^final-review-submit:certification:/,
      );
      expect(entry.new_values).toEqual({
        urnNo: 'URN-FINAL-1',
        workflow: 'certification',
        urnStatus: 6,
      });
      expect(entry.new_values).not.toHaveProperty('success');
      expect(entry.new_values).not.toHaveProperty('message');
      expect(entry.new_values).not.toHaveProperty('updateStatusType');
      expect(entry.new_values).not.toHaveProperty('updateStatusTo');
      expect(entry.new_values).not.toHaveProperty('renewalCycleId');
    });

    it('records renewal submit for final review with certificate dates', () => {
      const entry = factory.create({
        req: request({
          method: 'PATCH',
          originalUrl: '/renew/urn-status',
          body: {
            urnNo: 'URN-RENEW-FINAL',
            updateStatusType: 'urn_status',
            updateStatusTo: RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING,
            renewalCycleId: 'cycle-final-1',
          },
          response: {
            success: true,
            message: 'Renewal completed — final review approved',
            urnNo: 'URN-RENEW-FINAL',
            renewalCycleId: 'cycle-final-1',
            urnStatus: RENEWAL_URN_STATUS.COMPLETED,
            productRenewStatus: 2,
            renewedDate: '2026-07-15T00:00:00.000Z',
            validtillDate: '2027-07-15T00:00:00.000Z',
          },
        }),
        method: 'PATCH',
        resolvedPath: '/renew/urn-status',
        pathNorm: factory.normalizePath('/renew/urn-status'),
        outcome: 'success',
        statusCode: 200,
        startedAt: Date.now(),
      });

      expect(entry.description).toBe('Submitted for final review');
      expect(entry.metadata).toMatchObject({
        business_event_type: 'final_review_submit',
        final_review_workflow: 'renewal',
      });
      expect(entry.new_values).toEqual({
        urnNo: 'URN-RENEW-FINAL',
        workflow: 'renewal',
        urnStatus: RENEWAL_URN_STATUS.COMPLETED,
        productRenewStatus: 2,
        renewedDate: '2026-07-15T00:00:00.000Z',
        validtillDate: '2027-07-15T00:00:00.000Z',
      });
      expect(entry.new_values).not.toHaveProperty('renewalCycleId');
      expect(entry.new_values).not.toHaveProperty('renewCycleNo');
      expect(entry.new_values).not.toHaveProperty('message');
    });

    it('does not treat non-final-review urn-status transitions as final review', () => {
      const entry = factory.create({
        req: request({
          method: 'PATCH',
          originalUrl: '/api/admin/products/urn-status',
          body: {
            urnNo: 'URN-1',
            updateStatusType: 'urn_status',
            updateStatusTo: 5,
          },
          response: { urnNo: 'URN-1', urnStatus: 5 },
        }),
        method: 'PATCH',
        resolvedPath: '/api/admin/products/urn-status',
        pathNorm: '/api/admin/products/urn-status',
        outcome: 'success',
        statusCode: 200,
        startedAt: Date.now(),
      });

      expect(entry.description).toBe(
        'Certification / URN sent back to vendor',
      );
      expect(entry.metadata?.business_event_type).toBeUndefined();
    });
  });

  describe('response presentation', () => {
    const presenter = new AuditPayloadPresenter(
      {
        collectValues: () => new Map(),
        onlyModels: () => new Map(),
        resolveLookupLabels: async () => new Map(),
        resolveLabel: () => undefined,
      } as unknown as AuditLookupResolver,
      new AuditValueTransformer(new AuditStatusResolver()),
    );

    it('detects final review submit audits', () => {
      expect(
        isFinalReviewSubmitAudit({
          description: 'Submitted for final review',
          metadata: { business_event_type: 'final_review_submit' },
        }),
      ).toBe(true);
      expect(
        resolveAuditPresentationPolicy({
          description: 'Submitted for final review',
          metadata: { business_event_type: 'final_review_submit' },
        })?.id,
      ).toBe('final_review_submit');
    });

    it('filters internal fields and formats statuses + dates', async () => {
      const presented = await presenter.presentOne({
        action: AUDIT_ACTION.PRODUCT_URN_STATUS_UPDATED,
        outcome: 'success',
        module: 'certification',
        description: 'Submitted for final review',
        route: '/renew/urn-status',
        old_values: {
          urnNo: 'URN-RENEW-FINAL',
          previousUrnStatus: 15,
          renewalCycleId: 'cycle-1',
        },
        new_values: {
          urnNo: 'URN-RENEW-FINAL',
          workflow: 'renewal',
          urnStatus: 11,
          productRenewStatus: 2,
          renewedDate: '2026-07-15T00:00:00.000Z',
          validtillDate: '2027-07-15T00:00:00.000Z',
          success: true,
          message: 'Renewal completed — final review approved',
          renewalCycleId: 'cycle-1',
          updateStatusTo: 17,
        },
        metadata: {
          business_event_type: 'final_review_submit',
          final_review_workflow: 'renewal',
          duration_ms: 22,
          body_fields: ['urnNo', 'updateStatusTo', 'renewalCycleId'],
        },
      });

      expect(presented?.old_values).toEqual({
        urnNo: 'URN-RENEW-FINAL',
        previousUrnStatus: 'Check Process Forms',
      });
      expect(presented?.new_values).toEqual({
        urnNo: 'URN-RENEW-FINAL',
        workflow: 'Renewal',
        urnStatus: 'Renewal Completed',
        productRenewStatus: 'Renewed',
        renewedDate: formatAuditDisplayDateTime('2026-07-15T00:00:00.000Z'),
        validtillDate: formatAuditDisplayDateTime('2027-07-15T00:00:00.000Z'),
      });
      expect(Object.keys(presented?.new_values ?? {})).toEqual([
        'urnNo',
        'workflow',
        'urnStatus',
        'productRenewStatus',
        'renewedDate',
        'validtillDate',
      ]);
      expect(presented?.metadata).toBeUndefined();
    });

    it('presents certification final-review snapshot with business fields only', async () => {
      const presented = await presenter.presentOne({
        action: AUDIT_ACTION.PRODUCT_URN_STATUS_UPDATED,
        outcome: 'success',
        description: 'Submitted for final review',
        route: '/api/admin/products/urn-status',
        new_values: {
          urnNo: 'URN-FINAL-1',
          workflow: 'certification',
          urnStatus: 6,
          updateStatusType: 'urn_status',
          success: true,
        },
        metadata: { business_event_type: 'final_review_submit' },
      });

      expect(presented?.new_values).toEqual({
        urnNo: 'URN-FINAL-1',
        workflow: 'Certification',
        urnStatus: 'Final Verification Pending',
      });
    });

    it('hides envelope and internal keys via shared filter helpers', () => {
      const ctx = {
        description: 'Submitted for final review',
        metadata: { business_event_type: 'final_review_submit' },
      };
      expect(
        filterAuditResponseFields(
          {
            urnNo: 'URN-1',
            workflow: 'certification',
            urnStatus: 'Final Verification Pending',
            success: true,
            message: 'ok',
            updateStatusTo: 6,
            renewalCycleId: 'x',
          },
          ctx,
        ),
      ).toEqual({
        urnNo: 'URN-1',
        workflow: 'certification',
        urnStatus: 'Final Verification Pending',
      });
      expect(filterAuditResponseMetadata(ctx.metadata, ctx)).toBeUndefined();
    });
  });
});
