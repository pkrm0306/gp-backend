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
import { randomUUID } from 'crypto';
import { AuditLogService } from './audit-log.service';
import { AUDIT_ACTION } from './audit-actions';
import {
  AUDIT_METADATA_KEY,
  AuditRouteMetadata,
} from './decorators/audit.decorator';
import { AUDIT_SENSITIVE_BODY_KEYS } from './audit-privacy';
import { buildPerformedBy, mapFriendlyAudit } from './audit-route-map';

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const NON_ACTIONABLE_AUDIT_ROUTES: Array<{ method: string; regex: RegExp }> = [
  // Triggered automatically by client token refresh on page reload/navigation.
  { method: 'POST', regex: /^\/auth\/refresh$/i },
];

function normalizePath(url: string): string {
  const noQuery = url.replace(/\?.*$/, '');
  return (noQuery.replace(/\/+$/, '') || '/').toLowerCase();
}

function clientIp(req: Request): string | undefined {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.trim()) {
    return xff.split(',')[0].trim();
  }
  if (Array.isArray(xff) && xff[0]) {
    return String(xff[0]).split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress;
}

function truncateUa(ua: string | undefined, max = 256): string | undefined {
  if (!ua) {
    return undefined;
  }
  return ua.length <= max ? ua : ua.slice(0, max);
}

function safeBodyFieldKeys(req: Request): string[] | undefined {
  const b = req.body;
  if (!b || typeof b !== 'object' || Array.isArray(b)) {
    return undefined;
  }
  return Object.keys(b as Record<string, unknown>).filter(
    (k) => !AUDIT_SENSITIVE_BODY_KEYS.has(k),
  );
}

function resolveAction(method: string, pathNorm: string): string {
  const m = method.toUpperCase();
  if (m === 'POST' && pathNorm.endsWith('/auth/login')) {
    return AUDIT_ACTION.AUTH_LOGIN;
  }
  if (m === 'POST' && pathNorm.endsWith('/auth/refresh')) {
    return AUDIT_ACTION.AUTH_REFRESH;
  }
  if (m === 'POST' && pathNorm.endsWith('/auth/register-vendor')) {
    return AUDIT_ACTION.AUTH_REGISTER_VENDOR;
  }
  if (m === 'POST' && pathNorm.endsWith('/auth/verify-otp')) {
    return AUDIT_ACTION.AUTH_VERIFY_OTP;
  }
  if (m === 'POST' && pathNorm.endsWith('/auth/forgot-password')) {
    return AUDIT_ACTION.AUTH_FORGOT_PASSWORD;
  }
  if (m === 'POST' && pathNorm.endsWith('/payments')) {
    return AUDIT_ACTION.PAYMENT_CREATED;
  }
  if (m === 'PATCH' && /^\/payments\/[^/]+$/i.test(pathNorm)) {
    return AUDIT_ACTION.PAYMENT_UPDATED;
  }
  if (m === 'PATCH' && pathNorm.endsWith('/api/admin/products/urn-status')) {
    return AUDIT_ACTION.PRODUCT_URN_STATUS_UPDATED;
  }
  if (m === 'POST' && pathNorm.endsWith('/activity-log')) {
    return AUDIT_ACTION.ACTIVITY_LOG_CREATED;
  }
  return AUDIT_ACTION.HTTP_MUTATION;
}

function shouldSkipAuditRoute(method: string, pathNorm: string): boolean {
  const m = method.toUpperCase();
  return NON_ACTIONABLE_AUDIT_ROUTES.some(
    (route) => route.method === m && route.regex.test(pathNorm),
  );
}

function inferResource(
  method: string,
  pathNorm: string,
  req: Request,
): { type?: string; id?: string; urn_no?: string } | undefined {
  const pay = pathNorm.match(/^\/payments\/([^/]+)$/);
  if (pay) {
    const urn = decodeURIComponent(pay[1]);
    return { type: 'Payment', id: urn, urn_no: urn };
  }
  if (
    method.toUpperCase() === 'PATCH' &&
    pathNorm.endsWith('/api/admin/products/urn-status')
  ) {
    const urn =
      typeof (req.body as { urnNo?: string })?.urnNo === 'string'
        ? (req.body as { urnNo: string }).urnNo.trim()
        : undefined;
    if (urn) {
      return { type: 'Product', id: urn, urn_no: urn };
    }
  }
  if (method.toUpperCase() === 'POST' && pathNorm.endsWith('/activity-log')) {
    const body = req.body as { urn_no?: string };
    const urn =
      typeof body?.urn_no === 'string' ? body.urn_no.trim() : undefined;
    if (urn) {
      return { type: 'ActivityLog', urn_no: urn };
    }
  }
  return undefined;
}

function mergeResource(
  base: { type?: string; id?: string; urn_no?: string } | undefined,
  meta: AuditRouteMetadata | undefined,
  req: Request,
): { type?: string; id?: string; urn_no?: string } | undefined {
  const out = { ...base };
  if (!meta) {
    return Object.keys(out).length ? out : undefined;
  }
  if (meta.resource_type) {
    out.type = meta.resource_type;
  }
  if (meta.resource_param && req.params?.[meta.resource_param]) {
    out.id = String(req.params[meta.resource_param]);
  }
  if (meta.urn_param && req.params?.[meta.urn_param]) {
    out.urn_no = String(req.params[meta.urn_param]);
  }
  return Object.values(out).some((v) => v !== undefined) ? out : undefined;
}

function truncateMessage(
  msg: string | undefined,
  max = 400,
): string | undefined {
  if (!msg) {
    return undefined;
  }
  const s = String(msg);
  return s.length <= max ? s : s.slice(0, max);
}

@Injectable()
export class AuditHttpInterceptor implements NestInterceptor {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();
    const method = (req.method || 'GET').toUpperCase();

    if (!MUTATING.has(method)) {
      return next.handle();
    }

    const started = Date.now();
    let correlationId = req.headers['x-request-id'];
    if (typeof correlationId === 'string' && correlationId.trim()) {
      correlationId = correlationId.trim().slice(0, 128);
    } else if (Array.isArray(correlationId) && correlationId[0]) {
      correlationId = String(correlationId[0]).trim().slice(0, 128);
    } else {
      correlationId = randomUUID();
    }
    (req as Request & { auditCorrelationId?: string }).auditCorrelationId =
      correlationId;
    res.setHeader('X-Request-Id', correlationId);

    // Use the resolved URL (real param values), not the route template (`:urnNo`).
    const resolvedPath =
      (req.originalUrl || req.url || '/').split('?')[0] || '/';
    const pathNorm = normalizePath(resolvedPath);
    if (shouldSkipAuditRoute(method, pathNorm)) {
      return next.handle();
    }

    const auditMeta = this.reflector.getAllAndOverride<AuditRouteMetadata>(
      AUDIT_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      tap(() => {
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
        const outcome = r.__auditOutcome === 'failure' ? 'failure' : 'success';
        const statusCode = r.__auditStatus ?? res.statusCode ?? 500;
        const action = auditMeta?.action ?? resolveAction(method, pathNorm);
        const inferred = inferResource(method, pathNorm, req);
        const resource = mergeResource(inferred, auditMeta, req);
        const user = (req as Request & { user?: Record<string, unknown> }).user;
        const actor =
          user && typeof user === 'object'
            ? {
                user_id:
                  user['userId'] !== undefined
                    ? String(user['userId'])
                    : undefined,
                role:
                  user['role'] !== undefined ? String(user['role']) : undefined,
                vendor_id:
                  user['vendorId'] !== undefined
                    ? String(user['vendorId'])
                    : undefined,
                manufacturer_id:
                  user['manufacturerId'] !== undefined
                    ? String(user['manufacturerId'])
                    : undefined,
              }
            : undefined;

        const friendly = mapFriendlyAudit(method, pathNorm, req, outcome);
        const bodyRecord =
          req.body && typeof req.body === 'object' && !Array.isArray(req.body)
            ? (req.body as Record<string, unknown>)
            : undefined;
        const performed_by = buildPerformedBy(
          user,
          actor,
          pathNorm,
          bodyRecord,
        );

        const bodyFields = safeBodyFieldKeys(req);
        const metadata: Record<string, unknown> = {
          duration_ms: Date.now() - started,
        };
        if (bodyFields?.length) {
          metadata.body_fields = bodyFields;
        }
        if (outcome === 'failure') {
          const em = truncateMessage(r.__auditErr);
          if (em) {
            metadata.error_message = em;
          }
        }

        void this.auditLogService.record({
          action,
          outcome,
          module: friendly.module,
          action_type: friendly.action_type,
          entity_name: friendly.entity_name,
          description: friendly.description,
          performed_by,
          old_values: friendly.old_values,
          new_values: friendly.new_values,
          http_method: method,
          route: resolvedPath,
          status_code: statusCode,
          actor:
            actor && Object.values(actor).some((v) => v) ? actor : undefined,
          resource,
          request: {
            correlation_id: correlationId,
            ip: clientIp(req),
            user_agent: truncateUa(
              req.headers['user-agent'] as string | undefined,
            ),
          },
          metadata,
        });
      }),
    );
  }
}
