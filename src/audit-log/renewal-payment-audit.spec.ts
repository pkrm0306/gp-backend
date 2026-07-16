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
import { RENEWAL_URN_STATUS } from '../renew/constants/renewal-urn-status.constants';

/**
 * Regression: Renewal Payment workflow must emit exactly one audit row per
 * business decision (approve/reject), even when clients call both
 * PATCH /payments and PATCH /renew/urn-status.
 */
describe('Renewal payment audit consolidation', () => {
  const factory = auditEntryFactory();

  describe('AuditEntryFactory — successful payment decision', () => {
    it('uses one deterministic audit_event_id for renew payment approve via /payments', () => {
      const req = request({
        method: 'PATCH',
        originalUrl: '/payments/URN-RENEW-1',
        body: {
          paymentType: 'renew',
          paymentStatus: 2,
          renewalCycleId: 'cycle-abc',
        },
      });
      req.auditEventId = 'uuid-should-be-overridden';

      const entry = factory.create({
        req,
        method: 'PATCH',
        resolvedPath: '/payments/URN-RENEW-1',
        pathNorm: factory.normalizePath('/payments/URN-RENEW-1'),
        outcome: 'success',
        statusCode: 200,
        startedAt: Date.now(),
      });

      expect(entry.action).toBe(AUDIT_ACTION.PAYMENT_UPDATED);
      expect(entry.outcome).toBe('success');
      expect(entry.description).toBe('Renewal payment approved');
      expect(entry.action_type).toBe('approve');
      expect(entry.module).toBe('payment');
      expect(String(entry.metadata?.audit_event_id)).toMatch(
        /^renewal-payment:approve:/,
      );
      expect(entry.metadata).toMatchObject({
        business_event_type: 'renewal_payment_decision',
        consolidated: true,
        renewal_payment_decision: 'approve',
      });
    });

    it('shares the same audit_event_id for /payments approve and /renew/urn-status 13→14', () => {
      const cycleId = '6a1edd713ec5008b997aca94';
      const urn = 'URN-RENEW-SHARED';

      const paymentEntry = factory.create({
        req: request({
          method: 'PATCH',
          originalUrl: `/payments/${urn}`,
          body: {
            paymentType: 'renew',
            paymentStatus: 2,
            renewalCycleId: cycleId,
          },
        }),
        method: 'PATCH',
        resolvedPath: `/payments/${urn}`,
        pathNorm: factory.normalizePath(`/payments/${urn}`),
        outcome: 'success',
        statusCode: 200,
        startedAt: Date.now(),
      });

      const urnStatusEntry = factory.create({
        req: request({
          method: 'PATCH',
          originalUrl: '/renew/urn-status',
          body: {
            urnNo: urn,
            renewalCycleId: cycleId,
            updateStatusType: 'urn_status',
            updateStatusTo: RENEWAL_URN_STATUS.PAYMENT_APPROVED,
          },
        }),
        method: 'PATCH',
        resolvedPath: '/renew/urn-status',
        pathNorm: factory.normalizePath('/renew/urn-status'),
        outcome: 'success',
        statusCode: 200,
        startedAt: Date.now(),
      });

      expect(paymentEntry.metadata?.audit_event_id).toBe(
        urnStatusEntry.metadata?.audit_event_id,
      );
      expect(paymentEntry.metadata?.audit_event_id).toEqual(
        expect.stringMatching(/^renewal-payment:approve:/),
      );
    });

    it('uses a distinct deterministic id for renew payment reject', () => {
      const approve = factory.create({
        req: request({
          method: 'PATCH',
          originalUrl: '/payments/URN-1',
          body: {
            paymentType: 'renew',
            paymentStatus: 2,
            renewalCycleId: 'cycle-1',
          },
        }),
        method: 'PATCH',
        resolvedPath: '/payments/URN-1',
        pathNorm: '/payments/urn-1',
        outcome: 'success',
        statusCode: 200,
        startedAt: Date.now(),
      });

      const reject = factory.create({
        req: request({
          method: 'PATCH',
          originalUrl: '/payments/URN-1',
          body: {
            paymentType: 'renew',
            paymentStatus: 3,
            renewalCycleId: 'cycle-1',
            paymentRejectionRemarks: 'Incomplete proof',
          },
        }),
        method: 'PATCH',
        resolvedPath: '/payments/URN-1',
        pathNorm: '/payments/urn-1',
        outcome: 'success',
        statusCode: 200,
        startedAt: Date.now(),
      });

      expect(reject.description).toBe('Renewal payment rejected');
      expect(reject.action_type).toBe('reject');
      expect(reject.new_values).toMatchObject({
        paymentType: 'renew',
        paymentStatus: 3,
        paymentRejectionRemarks: 'Incomplete proof',
      });
      expect(String(reject.metadata?.audit_event_id)).toMatch(
        /^renewal-payment:reject:/,
      );
      expect(reject.metadata?.audit_event_id).not.toBe(
        approve.metadata?.audit_event_id,
      );
    });

    it('does not consolidate non-renew payment updates', () => {
      const req = request({
        method: 'PATCH',
        originalUrl: '/payments/URN-1',
        body: { paymentType: 'registration', paymentStatus: 2 },
      });
      req.auditEventId = 'per-request-uuid';

      const entry = factory.create({
        req,
        method: 'PATCH',
        resolvedPath: '/payments/URN-1',
        pathNorm: '/payments/urn-1',
        outcome: 'success',
        statusCode: 200,
        startedAt: Date.now(),
      });

      expect(entry.metadata?.audit_event_id).toBe('per-request-uuid');
      expect(entry.metadata?.business_event_type).toBeUndefined();
    });
  });

  describe('failed payment + retry', () => {
    it('keeps a unique failure audit_event_id so a later success can still insert', () => {
      const failReq = request({
        method: 'PATCH',
        originalUrl: '/payments/URN-RETRY',
        body: {
          paymentType: 'renew',
          paymentStatus: 2,
          renewalCycleId: 'cycle-retry',
        },
      });
      failReq.auditEventId = 'failure-uuid-1';

      const failure = factory.create({
        req: failReq,
        method: 'PATCH',
        resolvedPath: '/payments/URN-RETRY',
        pathNorm: '/payments/urn-retry',
        outcome: 'failure',
        statusCode: 400,
        startedAt: Date.now(),
        errorMessage: 'Renewal payment record not found',
      });

      const success = factory.create({
        req: request({
          method: 'PATCH',
          originalUrl: '/payments/URN-RETRY',
          body: {
            paymentType: 'renew',
            paymentStatus: 2,
            renewalCycleId: 'cycle-retry',
          },
        }),
        method: 'PATCH',
        resolvedPath: '/payments/URN-RETRY',
        pathNorm: '/payments/urn-retry',
        outcome: 'success',
        statusCode: 200,
        startedAt: Date.now(),
      });

      expect(failure.outcome).toBe('failure');
      expect(failure.metadata?.audit_event_id).toBe('failure-uuid-1');
      expect(String(success.metadata?.audit_event_id)).toMatch(
        /^renewal-payment:approve:/,
      );
      expect(success.metadata?.audit_event_id).not.toBe(
        failure.metadata?.audit_event_id,
      );
    });
  });

  describe('noop / unchanged renew urn-status', () => {
    it('skips audit when renewal URN status is already at the requested value', () => {
      const req = request({
        method: 'PATCH',
        originalUrl: '/renew/urn-status',
        body: {
          urnNo: 'URN-1',
          renewalCycleId: 'cycle-1',
          updateStatusTo: RENEWAL_URN_STATUS.PAYMENT_APPROVED,
        },
      });
      req.__auditResponseBody = {
        success: true,
        urnNo: 'URN-1',
        urnStatus: RENEWAL_URN_STATUS.PAYMENT_APPROVED,
        message: 'URN status unchanged',
      };

      expect(
        factory.shouldRecordHttpAudit({
          req,
          method: 'PATCH',
          pathNorm: factory.normalizePath('/renew/urn-status'),
          outcome: 'success',
        }),
      ).toBe(false);
    });

    it('still records a real renew payment failure', () => {
      const req = request({
        method: 'PATCH',
        originalUrl: '/payments/URN-1',
        body: {
          paymentType: 'renew',
          paymentStatus: 2,
          renewalCycleId: 'cycle-1',
        },
      });

      expect(
        factory.shouldRecordHttpAudit({
          req,
          method: 'PATCH',
          pathNorm: '/payments/urn-1',
          outcome: 'failure',
        }),
      ).toBe(true);
    });
  });

  describe('AuditHttpInterceptor — one record per mutation', () => {
    it('records exactly one success audit for renew payment approve', async () => {
      const record = jest.fn().mockResolvedValue(undefined);
      const interceptor = new AuditHttpInterceptor(
        { record } as never,
        new Reflector(),
        factory,
      );
      const req = {
        method: 'PATCH',
        originalUrl: '/payments/URN-RENEW-1',
        url: '/payments/URN-RENEW-1',
        body: {
          paymentType: 'renew',
          paymentStatus: 2,
          renewalCycleId: 'cycle-1',
        },
        headers: { 'x-request-id': 'req-renew-ok' },
        ip: '127.0.0.1',
        socket: {},
      };
      const res = { statusCode: 200, setHeader: jest.fn() };
      const next: CallHandler = {
        handle: () => of({ success: true, paymentStatus: 2 }),
      };

      await lastValueFrom(interceptor.intercept(httpContext(req, res), next));

      expect(record).toHaveBeenCalledTimes(1);
      expect(record.mock.calls[0][0]).toMatchObject({
        outcome: 'success',
        description: 'Renewal payment approved',
        metadata: {
          business_event_type: 'renewal_payment_decision',
          consolidated: true,
        },
      });
    });

    it('records exactly one failure audit when renew payment approve fails', async () => {
      const record = jest.fn().mockResolvedValue(undefined);
      const interceptor = new AuditHttpInterceptor(
        { record } as never,
        new Reflector(),
        factory,
      );
      const req = {
        method: 'PATCH',
        originalUrl: '/payments/URN-RENEW-1',
        url: '/payments/URN-RENEW-1',
        body: {
          paymentType: 'renew',
          paymentStatus: 2,
          renewalCycleId: 'cycle-1',
        },
        headers: {},
        ip: '127.0.0.1',
        socket: {},
      };
      const res = { statusCode: 400, setHeader: jest.fn() };
      const next: CallHandler = {
        handle: () =>
          throwError(() => new BadRequestException('Cannot approve payment')),
      };

      await expect(
        lastValueFrom(interceptor.intercept(httpContext(req, res), next)),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(record).toHaveBeenCalledTimes(1);
      expect(record.mock.calls[0][0]).toMatchObject({
        outcome: 'failure',
        action: AUDIT_ACTION.PAYMENT_UPDATED,
      });
      expect(record.mock.calls[0][0].metadata.audit_event_id).toEqual(
        expect.any(String),
      );
      expect(record.mock.calls[0][0].metadata.business_event_type).toBeUndefined();
    });

    it('does not audit a noop renew urn-status after payment already approved', async () => {
      const record = jest.fn().mockResolvedValue(undefined);
      const interceptor = new AuditHttpInterceptor(
        { record } as never,
        new Reflector(),
        factory,
      );
      const req = {
        method: 'PATCH',
        originalUrl: '/renew/urn-status',
        url: '/renew/urn-status',
        body: {
          urnNo: 'URN-RENEW-1',
          renewalCycleId: 'cycle-1',
          updateStatusTo: RENEWAL_URN_STATUS.PAYMENT_APPROVED,
        },
        headers: {},
        ip: '127.0.0.1',
        socket: {},
      };
      const res = { statusCode: 200, setHeader: jest.fn() };
      const next: CallHandler = {
        handle: () =>
          of({
            success: true,
            message: 'URN status unchanged',
            urnStatus: RENEWAL_URN_STATUS.PAYMENT_APPROVED,
          }),
      };

      await lastValueFrom(interceptor.intercept(httpContext(req, res), next));

      expect(record).not.toHaveBeenCalled();
    });
  });

  describe('concurrent duplicate suppress', () => {
    it('skips the second insert when audit_event_id already exists (concurrent dual calls)', async () => {
      const createMock = jest
        .fn()
        .mockResolvedValueOnce({})
        .mockRejectedValueOnce({ code: 11000, message: 'E11000 duplicate key' });

      const service = new AuditLogService(
        { create: createMock } as never,
        new AuditValueTransformer(new AuditStatusResolver()),
        { presentMany: jest.fn(), presentOne: jest.fn() } as never,
      );

      const eventId = 'renewal-payment:approve:abc123';
      const entry = {
        action: AUDIT_ACTION.PAYMENT_UPDATED,
        outcome: 'success' as const,
        description: 'Renewal payment approved',
        metadata: { audit_event_id: eventId },
      };

      await service.record(entry);
      await service.record(entry);

      expect(createMock).toHaveBeenCalledTimes(2);
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
