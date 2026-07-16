import { CallHandler, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { lastValueFrom, of, throwError } from 'rxjs';
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
  filterAuditResponseFields,
  isCertificationFeeAudit,
} from './audit-response-suppressed-fields';

/**
 * Regression: Multi-product certification fee workflow must emit accurate
 * business audits for partial rejection and payment success — not raw payload
 * dumps — and preserve chronological append-only history.
 */
describe('Certification fee / partial rejection audit', () => {
  const factory = auditEntryFactory();

  describe('partial rejection on certification fee assign (POST /payments)', () => {
    it('records only affected products with before/after state and a business message', () => {
      const req = request({
        method: 'POST',
        originalUrl: '/payments',
        body: {
          urnNo: 'URN-MULTI-1',
          paymentType: 'certification',
          productsToBeCertified: '[101,102]',
          quoteAmount: 50000,
          quoteGstAmount: 9000,
          quoteTotal: 59000,
          adminGstNo: 'GST-ADMIN',
          vendorGstNo: 'GST-VENDOR',
          paymentMode: 'NEFT',
        },
      });
      req.__auditResponseBody = {
        data: {
          urnNo: 'URN-MULTI-1',
          paymentType: 'certification',
          paymentStatus: 0,
          productsToBeCertified: '[101,102]',
          selectedProductIds: [101, 102],
          rejectedProductIds: [103],
          quoteAmount: 50000,
          proposalFile: '/uploads/proposal.pdf',
        },
      };
      req.auditEventId = 'uuid-should-be-overridden';

      const entry = factory.create({
        req,
        method: 'POST',
        resolvedPath: '/payments',
        pathNorm: factory.normalizePath('/payments'),
        outcome: 'success',
        statusCode: 201,
        startedAt: Date.now(),
      });

      expect(entry.action).toBe(AUDIT_ACTION.PAYMENT_CREATED);
      expect(entry.outcome).toBe('success');
      expect(entry.description).toBe(
        'Certification fee assigned with partial product rejection',
      );
      expect(entry.action_type).toBe('reject');
      expect(entry.module).toBe('payment');
      expect(entry.entity_name).toBe('URN-MULTI-1');
      expect(entry.old_values).toEqual({
        urnNo: 'URN-MULTI-1',
        rejectedProductStatus: null,
      });
      expect(entry.new_values).toEqual({
        urnNo: 'URN-MULTI-1',
        paymentType: 'certification',
        paymentStatus: 0,
        productsToBeCertified: [101, 102],
        selectedProductIds: [101, 102],
        rejectedProductIds: [103],
        rejectedProductStatus: 3,
        rejectionReason: 'Auto-rejected: not selected for certification fee',
      });
      expect(entry.new_values).not.toHaveProperty('quoteAmount');
      expect(entry.new_values).not.toHaveProperty('proposalFile');
      expect(entry.new_values).not.toHaveProperty('adminGstNo');
      expect(String(entry.metadata?.audit_event_id)).toMatch(
        /^certification-fee:assign:/,
      );
      expect(entry.metadata).toMatchObject({
        business_event_type: 'certification_fee',
        certification_fee_event: 'assign',
        partial_rejection: true,
        consolidated: true,
      });
    });

    it('uses a clear assign message when all products are selected (no rejection)', () => {
      const req = request({
        method: 'POST',
        originalUrl: '/payments',
        body: {
          urnNo: 'URN-MULTI-2',
          paymentType: 'certification',
          productsToBeCertified: '[201,202]',
        },
      });
      req.__auditResponseBody = {
        urnNo: 'URN-MULTI-2',
        paymentType: 'certification',
        selectedProductIds: [201, 202],
        rejectedProductIds: [],
        productsToBeCertified: '[201,202]',
      };

      const entry = factory.create({
        req,
        method: 'POST',
        resolvedPath: '/payments',
        pathNorm: factory.normalizePath('/payments'),
        outcome: 'success',
        statusCode: 201,
        startedAt: Date.now(),
      });

      expect(entry.description).toBe('Certification fee assigned');
      expect(entry.action_type).toBe('create');
      expect(entry.new_values).toEqual(
        expect.objectContaining({
          selectedProductIds: [201, 202],
          productsToBeCertified: [201, 202],
        }),
      );
      expect(entry.new_values).not.toHaveProperty('rejectedProductIds');
      expect(entry.new_values).not.toHaveProperty('rejectionReason');
    });

    it('does not consolidate non-certification payment creates', () => {
      const req = request({
        method: 'POST',
        originalUrl: '/payments',
        body: {
          urnNo: 'URN-REG-1',
          paymentType: 'registration',
          quoteAmount: 1000,
        },
      });
      req.auditEventId = 'reg-uuid-1';

      const entry = factory.create({
        req,
        method: 'POST',
        resolvedPath: '/payments',
        pathNorm: factory.normalizePath('/payments'),
        outcome: 'success',
        statusCode: 201,
        startedAt: Date.now(),
      });

      expect(entry.description).toBe('Payment record created');
      expect(entry.metadata?.audit_event_id).toBe('reg-uuid-1');
      expect(entry.metadata?.business_event_type).toBeUndefined();
    });
  });

  describe('certification fee payment success (PATCH /payments/:urn)', () => {
    it('records payment submitted with payment status before/after', () => {
      const req = request({
        method: 'PATCH',
        originalUrl: '/payments/URN-MULTI-1',
        body: {
          paymentType: 'certification',
          paymentStatus: 1,
          productsToBeCertified: '[101,102]',
          paymentMode: 'NEFT',
          paymentReferenceNo: 'REF-999',
        },
      });
      req.__auditResponseBody = {
        data: {
          urnNo: 'URN-MULTI-1',
          paymentType: 'certification',
          paymentStatus: 1,
          productsToBeCertified: '[101,102]',
          quoteTotal: 59000,
          paymentReferenceNo: 'REF-999',
        },
      };

      const entry = factory.create({
        req,
        method: 'PATCH',
        resolvedPath: '/payments/URN-MULTI-1',
        pathNorm: factory.normalizePath('/payments/URN-MULTI-1'),
        outcome: 'success',
        statusCode: 200,
        startedAt: Date.now(),
      });

      expect(entry.action).toBe(AUDIT_ACTION.PAYMENT_UPDATED);
      expect(entry.description).toBe('Certification fee payment submitted');
      expect(entry.action_type).toBe('update');
      expect(entry.old_values).toEqual({
        urnNo: 'URN-MULTI-1',
        paymentType: 'certification',
        paymentStatus: 0,
        productsToBeCertified: [101, 102],
        selectedProductIds: [101, 102],
      });
      expect(entry.new_values).toEqual({
        urnNo: 'URN-MULTI-1',
        paymentType: 'certification',
        paymentStatus: 1,
        productsToBeCertified: [101, 102],
        selectedProductIds: [101, 102],
      });
      expect(entry.new_values).not.toHaveProperty('quoteTotal');
      expect(entry.new_values).not.toHaveProperty('paymentReferenceNo');
      expect(String(entry.metadata?.audit_event_id)).toMatch(
        /^certification-fee:submit:/,
      );
    });

    it('records payment approved with selected products for multi-product URN', () => {
      const req = request({
        method: 'PATCH',
        originalUrl: '/payments/URN-MULTI-1',
        body: {
          paymentType: 'certification',
          paymentStatus: 2,
          productsToBeCertified: '[101,102]',
          urnStatus: 11,
        },
      });

      const entry = factory.create({
        req,
        method: 'PATCH',
        resolvedPath: '/payments/URN-MULTI-1',
        pathNorm: factory.normalizePath('/payments/URN-MULTI-1'),
        outcome: 'success',
        statusCode: 200,
        startedAt: Date.now(),
      });

      expect(entry.description).toBe('Certification fee payment approved');
      expect(entry.action_type).toBe('approve');
      expect(entry.old_values).toEqual(
        expect.objectContaining({
          paymentStatus: 1,
          selectedProductIds: [101, 102],
        }),
      );
      expect(entry.new_values).toEqual(
        expect.objectContaining({
          paymentStatus: 2,
          selectedProductIds: [101, 102],
          urnStatus: 11,
          certifiedProductStatus: 2,
        }),
      );
      expect(String(entry.metadata?.audit_event_id)).toMatch(
        /^certification-fee:approve:/,
      );
    });

    it('keeps a unique failure audit_event_id so a later success can still insert', () => {
      const failureReq = request({
        method: 'PATCH',
        originalUrl: '/payments/URN-MULTI-FAIL',
        body: {
          paymentType: 'certification',
          paymentStatus: 1,
        },
      });
      failureReq.auditEventId = 'failure-uuid-cert-1';

      const failure = factory.create({
        req: failureReq,
        method: 'PATCH',
        resolvedPath: '/payments/URN-MULTI-FAIL',
        pathNorm: factory.normalizePath('/payments/URN-MULTI-FAIL'),
        outcome: 'failure',
        statusCode: 400,
        startedAt: Date.now(),
        errorMessage: 'Invalid payment',
      });

      const successReq = request({
        method: 'PATCH',
        originalUrl: '/payments/URN-MULTI-FAIL',
        body: {
          paymentType: 'certification',
          paymentStatus: 1,
          productsToBeCertified: '[9]',
        },
      });
      successReq.auditEventId = 'should-be-overridden';

      const success = factory.create({
        req: successReq,
        method: 'PATCH',
        resolvedPath: '/payments/URN-MULTI-FAIL',
        pathNorm: factory.normalizePath('/payments/URN-MULTI-FAIL'),
        outcome: 'success',
        statusCode: 200,
        startedAt: Date.now(),
      });

      expect(failure.metadata?.audit_event_id).toBe('failure-uuid-cert-1');
      expect(String(success.metadata?.audit_event_id)).toMatch(
        /^certification-fee:submit:/,
      );
      expect(success.metadata?.audit_event_id).not.toBe(
        failure.metadata?.audit_event_id,
      );
    });
  });

  describe('response field policy', () => {
    it('filters certification fee snapshots to business product fields only', () => {
      const ctx = {
        action: AUDIT_ACTION.PAYMENT_CREATED,
        module: 'payment',
        description:
          'Certification fee assigned with partial product rejection',
        metadata: {
          business_event_type: 'certification_fee',
          certification_fee_event: 'assign',
        },
      };
      expect(isCertificationFeeAudit(ctx)).toBe(true);
      expect(
        filterAuditResponseFields(
          {
            urnNo: 'URN-1',
            selectedProductIds: [101],
            rejectedProductIds: [103],
            quoteAmount: 50000,
            proposalFile: '/x.pdf',
            paymentId: 'pay-1',
            duration_ms: 12,
          },
          ctx,
        ),
      ).toEqual({
        urnNo: 'URN-1',
        selectedProductIds: [101],
        rejectedProductIds: [103],
      });
    });
  });

  describe('AuditHttpInterceptor chronological append', () => {
    it('records partial-rejection assign then payment success as separate append-only rows', async () => {
      const record = jest.fn().mockResolvedValue(undefined);
      const interceptor = new AuditHttpInterceptor(
        { record } as unknown as AuditLogService,
        new Reflector(),
        factory,
      );

      const assignReq = request({
        method: 'POST',
        originalUrl: '/payments',
        body: {
          urnNo: 'URN-CHRONO-1',
          paymentType: 'certification',
          productsToBeCertified: '[1,2]',
        },
      });
      const assignRes = { statusCode: 201, setHeader: jest.fn() };
      await lastValueFrom(
        interceptor.intercept(
          httpContext(assignReq, assignRes),
          {
            handle: () =>
              of({
                selectedProductIds: [1, 2],
                rejectedProductIds: [3],
                paymentType: 'certification',
                urnNo: 'URN-CHRONO-1',
                productsToBeCertified: '[1,2]',
              }),
          } as CallHandler,
        ),
      );

      const payReq = request({
        method: 'PATCH',
        originalUrl: '/payments/URN-CHRONO-1',
        body: {
          paymentType: 'certification',
          paymentStatus: 1,
          productsToBeCertified: '[1,2]',
        },
      });
      const payRes = { statusCode: 200, setHeader: jest.fn() };
      await lastValueFrom(
        interceptor.intercept(
          httpContext(payReq, payRes),
          {
            handle: () =>
              of({
                urnNo: 'URN-CHRONO-1',
                paymentType: 'certification',
                paymentStatus: 1,
                productsToBeCertified: '[1,2]',
              }),
          } as CallHandler,
        ),
      );

      expect(record).toHaveBeenCalledTimes(2);
      expect(record.mock.calls[0][0].description).toBe(
        'Certification fee assigned with partial product rejection',
      );
      expect(record.mock.calls[1][0].description).toBe(
        'Certification fee payment submitted',
      );
      expect(record.mock.calls[0][0].metadata.audit_event_id).not.toBe(
        record.mock.calls[1][0].metadata.audit_event_id,
      );
    });

    it('still records a failure entry without blocking a later success', async () => {
      const record = jest.fn().mockResolvedValue(undefined);
      const interceptor = new AuditHttpInterceptor(
        { record } as unknown as AuditLogService,
        new Reflector(),
        factory,
      );

      const failReq = request({
        method: 'PATCH',
        originalUrl: '/payments/URN-CHRONO-2',
        body: { paymentType: 'certification', paymentStatus: 1 },
      });
      failReq.auditEventId = 'chrono-fail-uuid';
      const failRes = { statusCode: 400, setHeader: jest.fn() };
      await expect(
        lastValueFrom(
          interceptor.intercept(
            httpContext(failReq, failRes),
            {
              handle: () =>
                throwError(() => new BadRequestException('invalid')),
            } as CallHandler,
          ),
        ),
      ).rejects.toBeInstanceOf(BadRequestException);

      const okReq = request({
        method: 'PATCH',
        originalUrl: '/payments/URN-CHRONO-2',
        body: {
          paymentType: 'certification',
          paymentStatus: 1,
          productsToBeCertified: '[5]',
        },
      });
      const okRes = { statusCode: 200, setHeader: jest.fn() };
      await lastValueFrom(
        interceptor.intercept(
          httpContext(okReq, okRes),
          { handle: () => of({ paymentStatus: 1 }) } as CallHandler,
        ),
      );

      expect(record).toHaveBeenCalledTimes(2);
      expect(record.mock.calls[0][0].outcome).toBe('failure');
      expect(record.mock.calls[1][0].outcome).toBe('success');
      expect(record.mock.calls[1][0].description).toBe(
        'Certification fee payment submitted',
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
