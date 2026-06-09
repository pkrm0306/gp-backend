import { Injectable } from '@nestjs/common';
import { createHash, randomUUID } from 'crypto';
import { Request } from 'express';
import { AUDIT_ACTION } from './audit-actions';
import { AuditRouteMetadata } from './decorators/audit.decorator';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditRouteMapper, buildPerformedBy } from './audit-route-map';
import { AUDIT_ACTION_TYPE, AUDIT_MODULE } from './audit-friendlies';
import {
  AuditPrimitiveSnapshot,
  AuditValueTransformer,
} from './audit-value-transformer.service';

type AuditActor = {
  user_id?: string;
  role?: string;
  vendor_id?: string;
  manufacturer_id?: string;
};

type AuditResource = {
  type?: string;
  id?: string;
  urn_no?: string;
};

type AuditBusinessEventSummary = {
  auditEventId?: string;
  module?: string;
  action_type?: string;
  entity_name?: string;
  description?: string;
  new_values?: AuditPrimitiveSnapshot;
  resource?: AuditResource;
  metadata?: Record<string, unknown>;
};

export type AuditableRequest = Request & {
  auditCorrelationId?: string;
  auditEventId?: string;
  __auditOldValues?: AuditPrimitiveSnapshot;
  __auditNewValues?: AuditPrimitiveSnapshot;
  __auditResponseBody?: unknown;
};

@Injectable()
export class AuditEntryFactory {
  constructor(
    private readonly routeMapper: AuditRouteMapper,
    private readonly valueTransformer: AuditValueTransformer,
  ) {}

  newCorrelationId(req: Request): string {
    const incoming = req.headers['x-request-id'];
    if (typeof incoming === 'string' && incoming.trim()) {
      return incoming.trim().slice(0, 128);
    }
    if (Array.isArray(incoming) && incoming[0]) {
      return String(incoming[0]).trim().slice(0, 128);
    }
    return randomUUID();
  }

  newAuditEventId(): string {
    return randomUUID();
  }

  normalizePath(url: string): string {
    const noQuery = url.replace(/\?.*$/, '');
    return (noQuery.replace(/\/+$/, '') || '/').toLowerCase();
  }

  shouldAudit(method: string, pathNorm: string): boolean {
    if (
      !new Set(['POST', 'PUT', 'PATCH', 'DELETE']).has(method.toUpperCase())
    ) {
      return false;
    }
    return !this.shouldSkipAuditRoute(method, pathNorm);
  }

  shouldRecordHttpAudit(params: {
    req: AuditableRequest;
    method: string;
    pathNorm: string;
    outcome: 'success' | 'failure';
  }): boolean {
    if (params.outcome !== 'success') {
      return true;
    }
    const bulk = this.rawMaterialsBulkRow(
      params.method,
      params.pathNorm,
      params.req,
    );
    if (bulk && !bulk.isFinalRow) {
      return false;
    }
    return !this.isExplicitNoopStatusChange(params.req);
  }

  create(params: {
    req: AuditableRequest;
    method: string;
    resolvedPath: string;
    pathNorm: string;
    outcome: 'success' | 'failure';
    statusCode: number;
    startedAt: number;
    errorMessage?: string;
    auditMeta?: AuditRouteMetadata;
  }): CreateAuditLogDto {
    const {
      req,
      method,
      resolvedPath,
      pathNorm,
      outcome,
      statusCode,
      startedAt,
      errorMessage,
      auditMeta,
    } = params;
    const action = auditMeta?.action ?? this.resolveAction(method, pathNorm);
    const user = (req as Request & { user?: Record<string, unknown> }).user;
    const actor = this.actorFromUser(user);
    const body = this.bodyObj(req);
    const performedBy = buildPerformedBy(user, actor, pathNorm, body);
    const friendly = this.routeMapper.map(method, pathNorm, req, outcome);
    const businessEvent = this.businessEventSummary(
      method,
      pathNorm,
      req,
      outcome,
    );
    const bodySnapshot = this.valueTransformer.safeBodySnapshot(body);
    const responseSnapshot =
      outcome === 'success' && ['PATCH', 'PUT'].includes(method.toUpperCase())
        ? this.valueTransformer.safeResponseSnapshot(req.__auditResponseBody)
        : undefined;
    const fileSnapshot = this.valueTransformer.safeFileSnapshot(req);
    const explicitNewValues = req.__auditNewValues;
    const rawNewValues =
      businessEvent?.new_values ??
      explicitNewValues ??
      responseSnapshot ??
      this.valueTransformer.mergeSnapshots(friendly.new_values, bodySnapshot);
    const newValues = this.valueTransformer.sanitizeSnapshot(rawNewValues);
    const oldValues = this.valueTransformer.sanitizeSnapshot(
      req.__auditOldValues ?? friendly.old_values,
    );
    const metadata: Record<string, unknown> = {
      duration_ms: Date.now() - startedAt,
      audit_event_id:
        businessEvent?.auditEventId ??
        req.auditEventId ??
        this.newAuditEventId(),
    };
    Object.assign(metadata, businessEvent?.metadata);
    const bodyFields = this.valueTransformer.safeBodyFieldKeys(body);
    if (bodyFields.length) {
      metadata.body_fields = bodyFields;
    }
    if (fileSnapshot?.length) {
      metadata.file_uploads = fileSnapshot;
    }
    if (outcome === 'failure') {
      const truncated = this.truncateMessage(errorMessage);
      if (truncated) {
        metadata.error_message = truncated;
      }
    }

    return {
      action,
      outcome,
      module: businessEvent?.module ?? friendly.module,
      action_type: businessEvent?.action_type ?? friendly.action_type,
      entity_name: businessEvent?.entity_name ?? friendly.entity_name,
      description: businessEvent?.description ?? friendly.description,
      performed_by: performedBy,
      old_values: oldValues,
      new_values: newValues,
      http_method: method,
      route: resolvedPath,
      status_code: statusCode,
      actor: actor && Object.values(actor).some((v) => v) ? actor : undefined,
      resource: this.mergeResource(
        businessEvent?.resource ?? this.inferResource(method, pathNorm, req),
        auditMeta,
        req,
      ),
      request: {
        correlation_id: req.auditCorrelationId,
        ip: this.clientIp(req),
        user_agent: this.truncateUa(req.headers['user-agent'] as string),
      },
      changes:
        friendly.old_values || oldValues
          ? this.valueTransformer.buildChanges(oldValues, newValues)
          : undefined,
      metadata,
    };
  }

  private resolveAction(method: string, pathNorm: string): string {
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
    if (
      m === 'PATCH' &&
      (pathNorm.endsWith('/api/admin/products/urn-status') ||
        /\/admin\/urn\/[^/]+\/status$/i.test(pathNorm))
    ) {
      return AUDIT_ACTION.PRODUCT_URN_STATUS_UPDATED;
    }
    if (m === 'POST' && pathNorm.endsWith('/activity-log')) {
      return AUDIT_ACTION.ACTIVITY_LOG_CREATED;
    }
    return AUDIT_ACTION.HTTP_MUTATION;
  }

  private shouldSkipAuditRoute(method: string, pathNorm: string): boolean {
    const m = method.toUpperCase();
    const routes: Array<{ method: string; regex: RegExp }> = [
      { method: 'POST', regex: /^\/auth\/refresh$/i },
      { method: '*', regex: /^\/website(?:\/|$)/i },
    ];
    return routes.some(
      (route) =>
        (route.method === '*' || route.method === m) &&
        route.regex.test(pathNorm),
    );
  }

  private businessEventSummary(
    method: string,
    pathNorm: string,
    req: AuditableRequest,
    outcome: 'success' | 'failure',
  ): AuditBusinessEventSummary | undefined {
    if (outcome !== 'success') {
      return undefined;
    }
    return (
      this.rawMaterialsBulkSummary(method, pathNorm, req) ??
      this.vendorProposalSummary(method, pathNorm, req) ??
      this.productContentOrUploadSummary(method, pathNorm, req)
    );
  }

  private rawMaterialsBulkSummary(
    method: string,
    pathNorm: string,
    req: AuditableRequest,
  ): AuditBusinessEventSummary | undefined {
    const bulk = this.rawMaterialsBulkRow(method, pathNorm, req);
    if (!bulk?.isFinalRow) {
      return undefined;
    }
    const body = this.bodyObj(req);
    const urnNo = this.stringField(body, 'urnNo');
    const batchKey =
      this.stringField(body, 'auditBatchId') ??
      this.stringField(body, 'batchId') ??
      this.stringField(body, 'uploadBatchId') ??
      `${urnNo ?? 'unknown'}:${bulk.totalRows}`;
    const auditEventId = `raw-materials-hazardous-products:bulk:${this.hashId(batchKey)}`;
    return {
      auditEventId,
      module: AUDIT_MODULE.RAW_MATERIALS,
      action_type: AUDIT_ACTION_TYPE.UPDATE,
      entity_name: urnNo,
      description: 'Raw materials hazardous products bulk upload completed',
      new_values: {
        urnNo,
        operation: 'bulk_upload',
        completedRows: bulk.totalRows,
        totalRows: bulk.totalRows,
      },
      resource: urnNo
        ? {
            type: 'RawMaterialsHazardousProducts',
            id: urnNo,
            urn_no: urnNo,
          }
        : undefined,
      metadata: {
        business_event_type: 'raw_materials_hazardous_products_bulk_upload',
        consolidated: true,
        row_index: bulk.rowIndex,
        total_rows: bulk.totalRows,
      },
    };
  }

  private vendorProposalSummary(
    method: string,
    pathNorm: string,
    req: AuditableRequest,
  ): AuditBusinessEventSummary | undefined {
    if (
      method.toUpperCase() !== 'PATCH' ||
      !/^\/payments\/[^/]+\/vendor-proposal-approval$/.test(pathNorm)
    ) {
      return undefined;
    }
    const body = this.bodyObj(req);
    const urnNo = pathNorm.split('/').filter(Boolean)[1];
    const status = body?.['vendorProposalApprovalStatus'];
    const statusNum =
      typeof status === 'number'
        ? status
        : typeof status === 'string' && status.trim() !== ''
          ? Number(status)
          : NaN;
    if (statusNum !== 1 && statusNum !== 2) {
      return undefined;
    }
    const paymentType = this.stringField(body, 'paymentType') ?? 'registration';
    const remarks = this.stringField(body, 'proposalRejectionRemarks');
    const decodedUrn = urnNo ? decodeURIComponent(urnNo) : undefined;
    return {
      auditEventId: `proposal-review:${this.hashId(
        `${decodedUrn ?? 'unknown'}:${paymentType}:${statusNum}`,
      )}`,
      module: AUDIT_MODULE.PROPOSAL,
      action_type:
        statusNum === 2 ? AUDIT_ACTION_TYPE.REJECT : AUDIT_ACTION_TYPE.APPROVE,
      entity_name: decodedUrn,
      description:
        statusNum === 2
          ? 'Proposal rejected by vendor'
          : 'Proposal approved by vendor',
      new_values: {
        urnNo: decodedUrn,
        paymentType,
        vendorProposalApprovalStatus: statusNum,
        ...(remarks ? { proposalRejectionRemarks: remarks } : {}),
      },
      resource: decodedUrn
        ? { type: 'Proposal', id: decodedUrn, urn_no: decodedUrn }
        : undefined,
      metadata: {
        business_event_type: 'vendor_proposal_review',
        consolidated: true,
        related_domain_events: ['payment_update', 'activity_timeline_entry'],
      },
    };
  }

  private rawMaterialsBulkRow(
    method: string,
    pathNorm: string,
    req: AuditableRequest,
  ): { rowIndex: number; totalRows: number; isFinalRow: boolean } | undefined {
    if (
      method.toUpperCase() !== 'POST' ||
      pathNorm !== '/raw-materials-hazardous-products'
    ) {
      return undefined;
    }
    const body = this.bodyObj(req);
    const rowIndex = this.numberField(body, 'rowIndex');
    const totalRows = this.numberField(body, 'totalRows');
    if (
      rowIndex === undefined ||
      totalRows === undefined ||
      totalRows <= 1 ||
      rowIndex < 0 ||
      rowIndex >= totalRows
    ) {
      return undefined;
    }
    return {
      rowIndex,
      totalRows,
      isFinalRow: rowIndex === totalRows - 1,
    };
  }

  private productContentOrUploadSummary(
    method: string,
    pathNorm: string,
    req: AuditableRequest,
  ): AuditBusinessEventSummary | undefined {
    const methodUpper = method.toUpperCase();
    if (!['PATCH', 'PUT'].includes(methodUpper)) {
      return undefined;
    }
    if (this.isStatusRoute(pathNorm)) {
      return undefined;
    }
    if (!this.isProductContentOrUploadRoute(pathNorm)) {
      return undefined;
    }

    const body = this.bodyObj(req);
    const fileSnapshot = this.valueTransformer.safeFileSnapshot(req);
    const uploadEvent = Boolean(fileSnapshot?.length);
    const newValues = this.productContentSnapshot(body);
    const entityName =
      this.stringField(body, 'urnNo') ??
      this.stringField(body, 'eoiNo') ??
      this.pathEntityId(pathNorm);

    return {
      module: AUDIT_MODULE.PRODUCT,
      action_type: AUDIT_ACTION_TYPE.UPDATE,
      entity_name: entityName,
      description: uploadEvent
        ? 'Product document uploaded'
        : 'Product content saved',
      new_values: newValues,
      resource: entityName
        ? {
            type: uploadEvent ? 'ProductDocument' : 'Product',
            id: entityName,
            urn_no: this.stringField(body, 'urnNo'),
          }
        : undefined,
      metadata: {
        business_event_type: uploadEvent
          ? 'product_document_upload'
          : 'product_content_save',
        content_event: true,
      },
    };
  }

  private productContentSnapshot(
    body: Record<string, unknown> | undefined,
  ): AuditPrimitiveSnapshot | undefined {
    const snapshot = this.valueTransformer.safeBodySnapshot(body);
    if (!snapshot) {
      return undefined;
    }
    const statusKeys = new Set([
      'productStatus',
      'productRenewStatus',
      'urnStatus',
      'updateStatusType',
      'updateStatusTo',
    ]);
    for (const key of statusKeys) {
      delete snapshot[key];
    }
    return Object.keys(snapshot).length ? snapshot : undefined;
  }

  private isProductContentOrUploadRoute(pathNorm: string): boolean {
    return (
      /^\/product-registration\/[^/]+$/.test(pathNorm) ||
      /^\/api\/admin\/products\/certified\/[^/]+(?:\/passport)?$/.test(
        pathNorm,
      ) ||
      /^\/products\/certified\/[^/]+$/.test(pathNorm)
    );
  }

  private isExplicitNoopStatusChange(req: AuditableRequest): boolean {
    const oldValues = req.__auditOldValues;
    const newValues = req.__auditNewValues;
    if (!oldValues || !newValues) {
      return false;
    }
    const keys = ['updateStatusTo', 'urnStatus', 'productStatus'];
    return keys.some(
      (key) =>
        oldValues[key] !== undefined &&
        newValues[key] !== undefined &&
        String(oldValues[key]) === String(newValues[key]),
    );
  }

  private isStatusRoute(pathNorm: string): boolean {
    return (
      pathNorm.endsWith('/api/admin/products/urn-status') ||
      /\/admin\/urn\/[^/]+\/status$/i.test(pathNorm) ||
      pathNorm.endsWith('/products/urn-status')
    );
  }

  private stringField(
    body: Record<string, unknown> | undefined,
    key: string,
  ): string | undefined {
    const value = body?.[key];
    if (typeof value !== 'string') {
      return undefined;
    }
    const trimmed = value.trim();
    return trimmed || undefined;
  }

  private numberField(
    body: Record<string, unknown> | undefined,
    key: string,
  ): number | undefined {
    const value = body?.[key];
    const num =
      typeof value === 'number'
        ? value
        : typeof value === 'string' && value.trim() !== ''
          ? Number(value)
          : NaN;
    return Number.isInteger(num) ? num : undefined;
  }

  private hashId(value: string): string {
    return createHash('sha256').update(value).digest('hex').slice(0, 24);
  }

  private pathEntityId(pathNorm: string): string | undefined {
    const parts = pathNorm.split('/').filter(Boolean);
    const last = parts.at(-1);
    if (!last || last === 'passport') {
      return parts.at(-2);
    }
    return decodeURIComponent(last);
  }

  private inferResource(
    method: string,
    pathNorm: string,
    req: Request,
  ): AuditResource | undefined {
    const pay = pathNorm.match(/^\/payments\/([^/]+)$/);
    if (pay) {
      const urn = decodeURIComponent(pay[1]);
      return { type: 'Payment', id: urn, urn_no: urn };
    }
    if (
      method.toUpperCase() === 'PATCH' &&
      (pathNorm.endsWith('/api/admin/products/urn-status') ||
        /\/admin\/urn\/([^/]+)\/status$/i.test(pathNorm))
    ) {
      const urnFromPath = pathNorm.match(
        /\/admin\/urn\/([^/]+)\/status$/i,
      )?.[1];
      const urn =
        (urnFromPath ? decodeURIComponent(urnFromPath) : undefined) ||
        (typeof (req.body as { urnNo?: string })?.urnNo === 'string'
          ? (req.body as { urnNo: string }).urnNo.trim()
          : undefined);
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

  private mergeResource(
    base: AuditResource | undefined,
    meta: AuditRouteMetadata | undefined,
    req: Request,
  ): AuditResource | undefined {
    const out = { ...(base ?? {}) };
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

  private actorFromUser(
    user: Record<string, unknown> | undefined,
  ): AuditActor | undefined {
    if (!user || typeof user !== 'object') {
      return undefined;
    }
    return {
      user_id:
        user['userId'] !== undefined ? String(user['userId']) : undefined,
      role: user['role'] !== undefined ? String(user['role']) : undefined,
      vendor_id:
        user['vendorId'] !== undefined ? String(user['vendorId']) : undefined,
      manufacturer_id:
        user['manufacturerId'] !== undefined
          ? String(user['manufacturerId'])
          : undefined,
    };
  }

  private bodyObj(req: Request): Record<string, unknown> | undefined {
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return undefined;
    }
    return body as Record<string, unknown>;
  }

  private clientIp(req: Request): string | undefined {
    const xff = req.headers['x-forwarded-for'];
    if (typeof xff === 'string' && xff.trim()) {
      return xff.split(',')[0].trim();
    }
    if (Array.isArray(xff) && xff[0]) {
      return String(xff[0]).split(',')[0].trim();
    }
    return req.ip || req.socket?.remoteAddress;
  }

  private truncateUa(ua: string | undefined, max = 256): string | undefined {
    if (!ua) {
      return undefined;
    }
    return ua.length <= max ? ua : ua.slice(0, max);
  }

  private truncateMessage(
    msg: string | undefined,
    max = 400,
  ): string | undefined {
    if (!msg) {
      return undefined;
    }
    const value = String(msg);
    return value.length <= max ? value : value.slice(0, max);
  }
}
