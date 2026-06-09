import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { lastValueFrom, of } from 'rxjs';
import { AuditEntryFactory } from './audit-entry.factory';
import { AuditHttpInterceptor } from './audit-http.interceptor';
import { AuditRouteMapper } from './audit-route-map';
import { AuditStatusResolver } from './audit-status-resolver.service';
import { AuditValueTransformer } from './audit-value-transformer.service';

describe('AuditHttpInterceptor integration', () => {
  it('records one centralized audit entry after a successful mutation', async () => {
    const record = jest.fn().mockResolvedValue(undefined);
    const interceptor = new AuditHttpInterceptor(
      { record } as never,
      new Reflector(),
      auditEntryFactory(),
    );
    const req = {
      method: 'POST',
      originalUrl: '/payments',
      url: '/payments',
      body: { urn_no: 'URN-1', paymentStatus: 0 },
      headers: { 'x-request-id': 'request-1' },
      ip: '127.0.0.1',
      socket: {},
    };
    const res = {
      statusCode: 201,
      setHeader: jest.fn(),
    };
    const context = httpContext(req, res);
    const next: CallHandler = { handle: () => of({ ok: true }) };

    await lastValueFrom(interceptor.intercept(context, next));

    expect(record).toHaveBeenCalledTimes(1);
    expect(record.mock.calls[0][0]).toMatchObject({
      action: 'PAYMENT_CREATED',
      outcome: 'success',
      module: 'payment',
      action_type: 'create',
      entity_name: 'URN-1',
      http_method: 'POST',
      route: '/payments',
      status_code: 201,
      request: { correlation_id: 'request-1' },
    });
    expect(record.mock.calls[0][0].metadata.audit_event_id).toEqual(
      expect.any(String),
    );
    expect(res.setHeader).toHaveBeenCalledWith('X-Request-Id', 'request-1');
  });

  it('does not record non-mutating requests', async () => {
    const record = jest.fn().mockResolvedValue(undefined);
    const interceptor = new AuditHttpInterceptor(
      { record } as never,
      new Reflector(),
      auditEntryFactory(),
    );
    const req = {
      method: 'GET',
      originalUrl: '/payments',
      url: '/payments',
      headers: {},
      socket: {},
    };
    const res = {
      statusCode: 200,
      setHeader: jest.fn(),
    };

    await lastValueFrom(
      interceptor.intercept(httpContext(req, res), { handle: () => of({}) }),
    );

    expect(record).not.toHaveBeenCalled();
    expect(res.setHeader).not.toHaveBeenCalled();
  });

  it('skips non-final rows in legacy raw-materials bulk uploads', async () => {
    const record = jest.fn().mockResolvedValue(undefined);
    const interceptor = new AuditHttpInterceptor(
      { record } as never,
      new Reflector(),
      auditEntryFactory(),
    );
    const req = {
      method: 'POST',
      originalUrl: '/raw-materials-hazardous-products',
      url: '/raw-materials-hazardous-products',
      body: {
        urnNo: 'URN-1',
        rowIndex: '0',
        totalRows: '3',
        productsName: 'Paint',
      },
      headers: { 'x-request-id': 'request-bulk-row-0' },
      ip: '127.0.0.1',
      socket: {},
    };
    const res = {
      statusCode: 201,
      setHeader: jest.fn(),
    };

    await lastValueFrom(
      interceptor.intercept(httpContext(req, res), {
        handle: () => of({ success: true }),
      }),
    );

    expect(record).not.toHaveBeenCalled();
  });

  it('records one summary entry for the final row in a legacy raw-materials bulk upload', async () => {
    const record = jest.fn().mockResolvedValue(undefined);
    const interceptor = new AuditHttpInterceptor(
      { record } as never,
      new Reflector(),
      auditEntryFactory(),
    );
    const req = {
      method: 'POST',
      originalUrl: '/raw-materials-hazardous-products',
      url: '/raw-materials-hazardous-products',
      body: {
        urnNo: 'URN-1',
        rowIndex: '2',
        totalRows: '3',
        productsName: 'Adhesive',
      },
      headers: { 'x-request-id': 'request-bulk-row-2' },
      ip: '127.0.0.1',
      socket: {},
    };
    const res = {
      statusCode: 201,
      setHeader: jest.fn(),
    };

    await lastValueFrom(
      interceptor.intercept(httpContext(req, res), {
        handle: () => of({ success: true }),
      }),
    );

    expect(record).toHaveBeenCalledTimes(1);
    expect(record.mock.calls[0][0]).toMatchObject({
      module: 'raw_materials',
      description: 'Raw materials hazardous products bulk upload completed',
      new_values: {
        urnNo: 'URN-1',
        operation: 'bulk_upload',
        completedRows: 3,
        totalRows: 3,
      },
      metadata: {
        business_event_type: 'raw_materials_hazardous_products_bulk_upload',
        consolidated: true,
      },
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
