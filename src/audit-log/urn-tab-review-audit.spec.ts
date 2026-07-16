import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { lastValueFrom, of } from 'rxjs';
import {
  AuditEntryFactory,
  type AuditableRequest,
} from './audit-entry.factory';
import { AuditHttpInterceptor } from './audit-http.interceptor';
import { AuditRouteMapper } from './audit-route-map';
import { AuditStatusResolver } from './audit-status-resolver.service';
import { AuditValueTransformer } from './audit-value-transformer.service';
import { AuditLogService } from './audit-log.service';
import { AUDIT_ACTION } from './audit-actions';
import {
  buildUrnTabReviewAuditValues,
  DOCUMENT_REVIEW_BUSINESS_EVENT,
  formatUrnTabReviewAuditDescription,
  isAllowedDocumentReviewField,
  isDocumentReviewAudit,
  isUrnTabReviewAudit,
  resolveUrnTabReviewSectionLabel,
} from './audit-document-review.util';
import {
  filterAuditResponseFields,
  filterAuditResponseMetadata,
} from './audit-response-suppressed-fields';

/**
 * Regression: Vendor-uploaded document section approve/reject must emit
 * clean business audits — not nested API summary / quickActions blobs.
 */
describe('URN tab review (vendor document approve/reject) audit', () => {
  const factory = auditEntryFactory();

  describe('AuditEntryFactory business summary', () => {
    it('records a clean approve summary for manufacturing process', () => {
      const req = request({
        method: 'PATCH',
        originalUrl: '/api/admin/products/urn-tab-review',
        body: {
          urnNo: 'URN-DOC-1',
          tabKey: 'manufacturing-process',
          decision: 'approved',
        },
      });
      req.__auditResponseBody = {
        success: true,
        data: {
          urnNo: 'URN-DOC-1',
          updatedReview: {
            tabKey: 'manufacturing-process',
            reviewStatus: 1,
            reviewedBy: '507f1f77bcf86cd799439011',
            reviewedAt: '2026-07-15T10:00:00.000Z',
          },
          summary: {
            totalRequired: 10,
            pending: 3,
            approved: 7,
            rejected: 0,
            allReviewed: false,
            allApproved: false,
            hasRejection: false,
          },
          quickActions: {
            disableBoth: true,
            enableResend: false,
            enableSubmitFinal: false,
          },
          activity: null,
        },
      };

      const entry = factory.create({
        req,
        method: 'PATCH',
        resolvedPath: '/api/admin/products/urn-tab-review',
        pathNorm: factory.normalizePath('/api/admin/products/urn-tab-review'),
        outcome: 'success',
        statusCode: 200,
        startedAt: Date.now(),
      });

      expect(entry.action).toBe(AUDIT_ACTION.URN_TAB_REVIEW_DECISION);
      expect(entry.description).toBe('Manufacturing Process approved');
      expect(entry.action_type).toBe('approve');
      expect(entry.module).toBe('certification');
      expect(entry.old_values).toEqual(
        expect.objectContaining({
          reviewStatus: 0,
          decision: 'pending',
          sectionLabel: 'Manufacturing Process',
        }),
      );
      expect(entry.new_values).toEqual({
        urnNo: 'URN-DOC-1',
        tabKey: 'manufacturing-process',
        sectionLabel: 'Manufacturing Process',
        decision: 'approved',
        reviewStatus: 1,
        workflow: 'certification',
      });
      expect(entry.new_values).not.toHaveProperty('summary');
      expect(entry.new_values).not.toHaveProperty('quickActions');
      expect(entry.new_values).not.toHaveProperty('reviewedBy');
      expect(entry.metadata).toMatchObject({
        business_event_type: DOCUMENT_REVIEW_BUSINESS_EVENT.URN_TAB_REVIEW,
        document_review_workflow: 'certification',
        consolidated: true,
      });
      expect(String(entry.metadata?.audit_event_id)).toMatch(
        /^urn-tab-review:approved:/,
      );
    });

    it('records rejection remarks for raw-materials step review', () => {
      const req = request({
        method: 'PATCH',
        originalUrl: '/api/admin/products/urn-tab-review',
        body: {
          urnNo: 'URN-DOC-2',
          tabKey: 'raw-materials',
          stepId: 2,
          decision: 'rejected',
          rejectionRemarks: 'Missing recycled content evidence',
        },
      });

      const entry = factory.create({
        req,
        method: 'PATCH',
        resolvedPath: '/api/admin/products/urn-tab-review',
        pathNorm: factory.normalizePath('/api/admin/products/urn-tab-review'),
        outcome: 'success',
        statusCode: 200,
        startedAt: Date.now(),
      });

      expect(entry.description).toBe('Recycled Content rejected');
      expect(entry.action_type).toBe('reject');
      expect(entry.new_values).toEqual(
        expect.objectContaining({
          tabKey: 'raw-materials',
          stepId: 2,
          sectionLabel: 'Recycled Content',
          decision: 'rejected',
          reviewStatus: 2,
          rejectionRemarks: 'Missing recycled content evidence',
        }),
      );
    });

    it('marks renewal workflow when renewalCycleId is present', () => {
      const req = request({
        method: 'PATCH',
        originalUrl: '/api/admin/products/urn-tab-review',
        body: {
          urnNo: 'URN-RENEW-DOC',
          tabKey: 'waste-management',
          decision: 'approved',
          renewalCycleId: 'cycle-1',
        },
      });

      const entry = factory.create({
        req,
        method: 'PATCH',
        resolvedPath: '/api/admin/products/urn-tab-review',
        pathNorm: factory.normalizePath('/api/admin/products/urn-tab-review'),
        outcome: 'success',
        statusCode: 200,
        startedAt: Date.now(),
      });

      expect(entry.description).toBe('Waste Management approved');
      expect(entry.new_values).toEqual(
        expect.objectContaining({
          workflow: 'renewal',
        }),
      );
      expect(entry.new_values).not.toHaveProperty('renewalCycleId');
      expect(entry.metadata).toMatchObject({
        document_review_workflow: 'renewal',
      });
    });
  });

  describe('centralized payload filtering', () => {
    it('strips framework summary/quickActions from historical noisy rows', () => {
      const ctx = {
        action: AUDIT_ACTION.HTTP_MUTATION,
        module: 'product',
        description: 'Product / process data updated',
        route: '/api/admin/products/urn-tab-review',
        metadata: {
          business_event_type: DOCUMENT_REVIEW_BUSINESS_EVENT.URN_TAB_REVIEW,
          duration_ms: 12,
          body_fields: ['decision', 'tabKey'],
          audit_event_id: 'uuid-1',
        },
      };
      expect(isUrnTabReviewAudit(ctx)).toBe(true);
      expect(isDocumentReviewAudit(ctx)).toBe(true);
      expect(
        filterAuditResponseFields(
          {
            urnNo: 'URN-1',
            tabKey: 'product-design',
            sectionLabel: 'Product Design',
            decision: 'approved',
            reviewStatus: 'Approved',
            summary: { pending: 1 },
            quickActions: { enableResend: true },
            reviewedBy: '507f1f77bcf86cd799439011',
            activity: null,
          },
          ctx,
        ),
      ).toEqual({
        urnNo: 'URN-1',
        tabKey: 'product-design',
        sectionLabel: 'Product Design',
        decision: 'approved',
        reviewStatus: 'Approved',
      });
      // Note: decision / reviewStatus display labels are applied by the transformer.
      expect(isAllowedDocumentReviewField('summary', ctx)).toBe(false);
      expect(isAllowedDocumentReviewField('quickActions', ctx)).toBe(false);
      expect(filterAuditResponseMetadata(ctx.metadata, ctx)).toBeUndefined();
    });

    it('filters vendor proposal review to business fields only', () => {
      const ctx = {
        action: AUDIT_ACTION.PAYMENT_UPDATED,
        module: 'proposal',
        description: 'Proposal approved by vendor',
        route: '/payments/URN-1/vendor-proposal-approval',
        metadata: {
          business_event_type: DOCUMENT_REVIEW_BUSINESS_EVENT.VENDOR_PROPOSAL,
          duration_ms: 9,
        },
      };
      expect(
        filterAuditResponseFields(
          {
            urnNo: 'URN-1',
            paymentType: 'registration',
            vendorProposalApprovalStatus: 'Proposal Approved',
            decision: 'approved',
            quoteTotal: 1000,
            proposalFile: '/x.pdf',
          },
          ctx,
        ),
      ).toEqual({
        urnNo: 'URN-1',
        paymentType: 'registration',
        vendorProposalApprovalStatus: 'Proposal Approved',
        decision: 'approved',
      });
    });
  });

  describe('section label helpers', () => {
    it('resolves process and raw-material section labels for audit copy', () => {
      expect(resolveUrnTabReviewSectionLabel('product-design')).toBe(
        'Product Design',
      );
      expect(resolveUrnTabReviewSectionLabel('raw-materials', 1)).toBe(
        'Elimination of Hazardous Substances',
      );
      expect(formatUrnTabReviewAuditDescription('innovation', 'rejected')).toBe(
        'Innovation rejected',
      );
      const built = buildUrnTabReviewAuditValues({
        urnNo: 'URN-X',
        tabKey: 'product-performance',
        decision: 'approved',
      });
      expect(built.new_values.sectionLabel).toBe('Product Performance');
      expect(built.old_values.reviewStatus).toBe(0);
      expect(built.new_values.reviewStatus).toBe(1);
    });
  });

  describe('AuditHttpInterceptor', () => {
    it('appends approve then reject as distinct chronological rows', async () => {
      const record = jest.fn().mockResolvedValue(undefined);
      const interceptor = new AuditHttpInterceptor(
        { record } as unknown as AuditLogService,
        new Reflector(),
        factory,
      );

      await lastValueFrom(
        interceptor.intercept(
          httpContext(
            request({
              method: 'PATCH',
              originalUrl: '/api/admin/products/urn-tab-review',
              body: {
                urnNo: 'URN-CHRONO',
                tabKey: 'product-design',
                decision: 'approved',
              },
            }),
            { statusCode: 200, setHeader: jest.fn() },
          ),
          { handle: () => of({ urnNo: 'URN-CHRONO' }) } as CallHandler,
        ),
      );

      await lastValueFrom(
        interceptor.intercept(
          httpContext(
            request({
              method: 'PATCH',
              originalUrl: '/api/admin/products/urn-tab-review',
              body: {
                urnNo: 'URN-CHRONO',
                tabKey: 'innovation',
                decision: 'rejected',
                rejectionRemarks: 'Provide evidence',
              },
            }),
            { statusCode: 200, setHeader: jest.fn() },
          ),
          { handle: () => of({ urnNo: 'URN-CHRONO' }) } as CallHandler,
        ),
      );

      expect(record).toHaveBeenCalledTimes(2);
      expect(record.mock.calls[0][0].description).toBe('Product Design approved');
      expect(record.mock.calls[1][0].description).toBe('Innovation rejected');
      expect(record.mock.calls[0][0].metadata.audit_event_id).not.toBe(
        record.mock.calls[1][0].metadata.audit_event_id,
      );
    });
  });
});

function auditEntryFactory(): AuditEntryFactory {
  const statusResolver = new AuditStatusResolver();
  const valueTransformer = new AuditValueTransformer(statusResolver);
  return new AuditEntryFactory(
    new AuditRouteMapper(valueTransformer),
    valueTransformer,
  );
}

function request(params: {
  method: string;
  originalUrl: string;
  body?: Record<string, unknown>;
}): AuditableRequest {
  return {
    method: params.method,
    originalUrl: params.originalUrl,
    url: params.originalUrl,
    body: params.body ?? {},
    headers: {},
    ip: '127.0.0.1',
    socket: {},
  } as AuditableRequest;
}

function httpContext(req: unknown, res: unknown): ExecutionContext {
  class TestController {}
  const handler = () => undefined;
  return {
    getType: () => 'http',
    switchToHttp: () => ({
      getRequest: () => req,
      getResponse: () => res,
    }),
    getHandler: () => handler,
    getClass: () => TestController,
  } as unknown as ExecutionContext;
}
