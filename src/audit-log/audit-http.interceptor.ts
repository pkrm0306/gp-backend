import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AuditLogService } from './audit-log.service';
import {
  AUDIT_METADATA_KEY,
  AuditRouteMetadata,
} from './decorators/audit.decorator';
import { AuditEntryFactory, AuditableRequest } from './audit-entry.factory';

@Injectable()
export class AuditHttpInterceptor implements NestInterceptor {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly reflector: Reflector,
    private readonly auditEntryFactory: AuditEntryFactory,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();
    const method = (req.method || 'GET').toUpperCase();

    // Use the resolved URL (real param values), not the route template (`:urnNo`).
    const resolvedPath =
      (req.originalUrl || req.url || '/').split('?')[0] || '/';
    const pathNorm = this.auditEntryFactory.normalizePath(resolvedPath);
    if (!this.auditEntryFactory.shouldAudit(method, pathNorm)) {
      return next.handle();
    }

    const started = Date.now();
    const auditReq = req as AuditableRequest;
    const correlationId = this.auditEntryFactory.newCorrelationId(req);
    auditReq.auditCorrelationId = correlationId;
    auditReq.auditEventId = this.auditEntryFactory.newAuditEventId();
    res.setHeader('X-Request-Id', correlationId);

    const auditMeta = this.reflector.getAllAndOverride<AuditRouteMetadata>(
      AUDIT_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      tap((responseBody: unknown) => {
        auditReq.__auditResponseBody = responseBody;
        (
          req as { __auditOutcome?: string; __auditStatus?: number }
        ).__auditOutcome = 'success';
        (
          req as { __auditOutcome?: string; __auditStatus?: number }
        ).__auditStatus = res.statusCode || 200;
      }),
      catchError((err: unknown) => {
        const status =
          err instanceof HttpException
            ? err.getStatus()
            : typeof (err as { status?: number })?.status === 'number'
              ? (err as { status: number }).status
              : 500;
        const r = req as {
          __auditOutcome?: string;
          __auditStatus?: number;
          __auditErr?: string;
        };
        r.__auditOutcome = 'failure';
        r.__auditStatus = status;
        r.__auditErr =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
              ? err
              : undefined;
        return throwError(() => err);
      }),
      finalize(() => {
        const r = req as {
          __auditOutcome?: string;
          __auditStatus?: number;
          __auditErr?: string;
        };
        const outcome: 'success' | 'failure' =
          r.__auditOutcome === 'failure' ? 'failure' : 'success';
        const statusCode = r.__auditStatus ?? res.statusCode ?? 500;
        if (
          !this.auditEntryFactory.shouldRecordHttpAudit({
            req: auditReq,
            method,
            pathNorm,
            outcome,
          })
        ) {
          return;
        }
        void this.auditLogService.record(
          this.auditEntryFactory.create({
            req: auditReq,
            method,
            resolvedPath,
            pathNorm,
            outcome,
            statusCode,
            startedAt: started,
            errorMessage: r.__auditErr,
            auditMeta,
          }),
        );
      }),
    );
  }
}
