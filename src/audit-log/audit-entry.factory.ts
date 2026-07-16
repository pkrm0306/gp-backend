import { Injectable } from '@nestjs/common';
import { createHash, randomUUID } from 'crypto';
import { Request } from 'express';
import { AUDIT_ACTION } from './audit-actions';
import { AuditRouteMetadata } from './decorators/audit.decorator';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditRouteMapper, buildPerformedBy } from './audit-route-map';
import { AUDIT_ACTION_TYPE, AUDIT_MODULE } from './audit-friendlies';
import { isListingAuditPath } from './audit-listing-routes.util';
import {
  AuditPrimitiveSnapshot,
  AuditValueTransformer,
} from './audit-value-transformer.service';
import { RENEWAL_URN_STATUS } from '../renew/constants/renewal-urn-status.constants';
import {
  buildUrnTabReviewAuditValues,
  DOCUMENT_REVIEW_BUSINESS_EVENT,
  formatUrnTabReviewAuditDescription,
  type DocumentReviewDecision,
} from './audit-document-review.util';

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
  old_values?: AuditPrimitiveSnapshot;
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
    if (this.isRenewUrnStatusNoop(params.req, params.pathNorm)) {
      return false;
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
      outcome === 'success' &&
      this.shouldCaptureResponseSnapshot(method, pathNorm)
        ? this.valueTransformer.safeResponseSnapshot(req.__auditResponseBody)
        : undefined;
    const fileSnapshot = this.valueTransformer.safeFileSnapshot(req);
    const explicitNewValues = req.__auditNewValues;
    const mergedRequestValues = this.valueTransformer.mergeSnapshots(
      friendly.new_values,
      bodySnapshot,
    );
    const rawNewValues = this.resolveNewValuesSnapshot({
      pathNorm,
      businessNewValues: businessEvent?.new_values,
      explicitNewValues,
      responseSnapshot,
      mergedRequestValues,
    });
    const newValues = this.valueTransformer.sanitizeSnapshot(rawNewValues);
    const oldValues = this.valueTransformer.sanitizeSnapshot(
      businessEvent?.old_values ??
        req.__auditOldValues ??
        friendly.old_values,
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
    if (m === 'POST' && pathNorm.endsWith('/auth/resend-otp')) {
      return AUDIT_ACTION.AUTH_RESEND_OTP;
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
    if (m === 'PATCH' && /\/urn-tab-review$/i.test(pathNorm)) {
      return AUDIT_ACTION.URN_TAB_REVIEW_DECISION;
    }
    if (m === 'POST' && pathNorm.endsWith('/activity-log')) {
      return AUDIT_ACTION.ACTIVITY_LOG_CREATED;
    }
    return AUDIT_ACTION.HTTP_MUTATION;
  }

  private shouldSkipAuditRoute(method: string, pathNorm: string): boolean {
    if (isListingAuditPath(pathNorm)) {
      return true;
    }
    const m = method.toUpperCase();
    const routes: Array<{ method: string; regex: RegExp }> = [
      { method: 'POST', regex: /^\/auth\/refresh$/i },
      // Domain audits are written by CertificationExpiryService (avoid duplicate HTTP rows).
      {
        method: 'POST',
        regex: /\/api\/cron\/certification-expiry\/deactivation-mail$/i,
      },
      // Domain audits are written by AdminExpiredReactivateService.
      {
        method: 'PATCH',
        regex: /\/api\/admin\/products\/expired-reactivate\/(?:product|urn)$/i,
      },
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
      this.urnTabReviewSummary(method, pathNorm, req) ??
      this.renewalPaymentSummary(method, pathNorm, req) ??
      this.finalReviewSubmitSummary(method, pathNorm, req) ??
      this.renewalDocumentSummary(method, pathNorm, req) ??
      this.certificationPaymentSummary(method, pathNorm, req) ??
      this.productContentOrUploadSummary(method, pathNorm, req)
    );
  }

  private shouldCaptureResponseSnapshot(
    method: string,
    pathNorm: string,
  ): boolean {
    const m = method.toUpperCase();
    if (m === 'PATCH' || m === 'PUT') {
      return true;
    }
    if (m === 'POST' || m === 'DELETE') {
      return this.isDocumentMutationPath(pathNorm);
    }
    return false;
  }

  private isDocumentMutationPath(pathNorm: string): boolean {
    return (
      /\/renew\/(?:documents|process-)/i.test(pathNorm) ||
      /\/process-(?:manufacturing|waste-management|life-cycle-approach|product-stewardship|innovation)/i.test(
        pathNorm,
      )
    );
  }

  private resolveNewValuesSnapshot(params: {
    pathNorm: string;
    businessNewValues?: Record<string, unknown>;
    explicitNewValues?: Record<string, unknown>;
    responseSnapshot?: Record<string, unknown>;
    mergedRequestValues?: Record<string, unknown>;
  }): Record<string, unknown> | undefined {
    if (params.businessNewValues) {
      return params.businessNewValues;
    }
    if (params.explicitNewValues) {
      return params.explicitNewValues;
    }
    // Document mutations: merge request + response so file names from either side survive.
    if (this.isDocumentMutationPath(params.pathNorm)) {
      return (
        this.valueTransformer.mergeSnapshots(
          params.mergedRequestValues,
          params.responseSnapshot,
        ) ??
        params.responseSnapshot ??
        params.mergedRequestValues
      );
    }
    // Legacy: prefer response over body for general PATCH/PUT.
    return params.responseSnapshot ?? params.mergedRequestValues;
  }

  /**
   * Renewal document delete + product-performance save business summaries.
   */
  private renewalDocumentSummary(
    method: string,
    pathNorm: string,
    req: AuditableRequest,
  ): AuditBusinessEventSummary | undefined {
    const m = method.toUpperCase();
    const response = this.responseRoot(req.__auditResponseBody);
    const body = this.bodyObj(req);
    const query = this.queryObj(req);

    if (m === 'DELETE' && /\/renew\/documents\/[^/]+$/i.test(pathNorm)) {
      const urnNo =
        this.stringField(response, 'urnNo') ??
        this.stringField(query, 'urnNo');
      const sectionKey =
        this.stringField(response, 'sectionKey') ??
        this.stringField(query, 'sectionKey');
      const fileName =
        this.stringField(response, 'fileName') ??
        this.stringField(response, 'documentOriginalName');
      const documentTag = this.stringField(response, 'documentTag');
      const documentId =
        this.numberField(response, 'documentId') ??
        Number(pathNorm.split('/').filter(Boolean).pop());
      return {
        auditEventId: `renewal-document:delete:${this.hashId(
          `${(urnNo || 'unknown').toLowerCase()}:${documentId || 'unknown'}`,
        )}`,
        module: AUDIT_MODULE.DOCUMENT,
        action_type: AUDIT_ACTION_TYPE.DELETE,
        entity_name: urnNo,
        description: 'Renewal document deleted',
        new_values: {
          ...(urnNo ? { urnNo } : {}),
          ...(sectionKey ? { sectionKey } : {}),
          ...(documentTag ? { documentTag } : {}),
          ...(fileName ? { fileName } : {}),
          documentStatus: 'deleted',
        },
        resource: urnNo
          ? { type: 'Document', id: String(documentId || urnNo), urn_no: urnNo }
          : undefined,
        metadata: {
          business_event_type: 'renewal_document',
          renewal_document_event: 'delete',
        },
      };
    }

    if (
      m === 'POST' &&
      /\/renew\/process-product-performance$/i.test(pathNorm)
    ) {
      const urnNo =
        this.stringField(response, 'urnNo') ?? this.stringField(body, 'urnNo');
      const cycleId =
        this.stringField(response, 'renewalCycleId') ??
        this.stringField(body, 'renewalCycleId') ??
        'unknown';
      const files = this.valueTransformer.safeFileSnapshot(req) ?? [];
      const testReports =
        response?.['testReports'] ??
        body?.['testReports'] ??
        body?.['test_reports'];
      const hasUploads = files.length > 0;
      return {
        auditEventId: `renewal-document:product-performance:${this.hashId(
          `${(urnNo || 'unknown').toLowerCase()}:${cycleId.toLowerCase()}:${hasUploads ? 'upload' : 'update'}`,
        )}`,
        module: AUDIT_MODULE.PROCESS,
        action_type: hasUploads
          ? AUDIT_ACTION_TYPE.CREATE
          : AUDIT_ACTION_TYPE.UPDATE,
        entity_name: urnNo,
        description: 'Renewal product performance saved',
        new_values: {
          ...(urnNo ? { urnNo } : {}),
          ...(Array.isArray(testReports) && testReports.length
            ? { testReports }
            : {}),
        },
        resource: urnNo
          ? { type: 'Process', id: urnNo, urn_no: urnNo }
          : undefined,
        metadata: {
          business_event_type: 'renewal_document',
          renewal_document_event: hasUploads ? 'upload' : 'update',
        },
      };
    }

    return undefined;
  }

  private queryObj(
    req: AuditableRequest,
  ): Record<string, unknown> | undefined {
    const q = (req as { query?: unknown }).query;
    if (!q || typeof q !== 'object' || Array.isArray(q)) {
      return undefined;
    }
    return q as Record<string, unknown>;
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
      old_values: {
        urnNo: decodedUrn,
        paymentType,
        vendorProposalApprovalStatus: 0,
        decision: 'pending',
      },
      new_values: {
        urnNo: decodedUrn,
        paymentType,
        vendorProposalApprovalStatus: statusNum,
        decision: statusNum === 2 ? 'rejected' : 'approved',
        ...(remarks ? { proposalRejectionRemarks: remarks } : {}),
      },
      resource: decodedUrn
        ? { type: 'Proposal', id: decodedUrn, urn_no: decodedUrn }
        : undefined,
      metadata: {
        business_event_type: DOCUMENT_REVIEW_BUSINESS_EVENT.VENDOR_PROPOSAL,
        consolidated: true,
        related_domain_events: ['payment_update', 'activity_timeline_entry'],
      },
    };
  }

  /**
   * Admin approve/reject of vendor-uploaded process / raw-material sections
   * (PATCH /api/admin/products/urn-tab-review). Shared by certification + renewal.
   */
  private urnTabReviewSummary(
    method: string,
    pathNorm: string,
    req: AuditableRequest,
  ): AuditBusinessEventSummary | undefined {
    if (
      method.toUpperCase() !== 'PATCH' ||
      !/\/urn-tab-review$/i.test(pathNorm)
    ) {
      return undefined;
    }
    const body = this.bodyObj(req);
    const response = this.responseRoot(req.__auditResponseBody);
    const decisionRaw = (
      this.stringField(body, 'decision') ??
      this.stringField(response, 'decision') ??
      ''
    ).toLowerCase();
    if (decisionRaw !== 'approved' && decisionRaw !== 'rejected') {
      return undefined;
    }
    const decision = decisionRaw as DocumentReviewDecision;
    const urnNo =
      this.stringField(body, 'urnNo') ?? this.stringField(response, 'urnNo');
    const tabKey =
      this.stringField(body, 'tabKey') ??
      this.stringField(response, 'tabKey') ??
      this.stringField(
        (response?.['updatedReview'] as Record<string, unknown> | undefined) ??
          undefined,
        'tabKey',
      );
    if (!tabKey) {
      return undefined;
    }
    const stepId =
      this.numberField(body, 'stepId') ??
      this.numberField(response, 'stepId') ??
      this.numberField(
        (response?.['updatedReview'] as Record<string, unknown> | undefined) ??
          undefined,
        'stepId',
      );
    const rejectionRemarks =
      this.stringField(body, 'rejectionRemarks') ??
      this.stringField(
        (response?.['updatedReview'] as Record<string, unknown> | undefined) ??
          undefined,
        'rejectionRemarks',
      );
    const renewalCycleId =
      this.stringField(body, 'renewalCycleId') ??
      this.stringField(response, 'renewalCycleId');
    const built = buildUrnTabReviewAuditValues({
      urnNo,
      tabKey,
      stepId: stepId ?? null,
      decision,
      rejectionRemarks,
      renewalCycleId,
    });
    const eventKey = [
      (urnNo || 'unknown').toLowerCase(),
      tabKey.toLowerCase(),
      stepId != null ? String(stepId) : '0',
      decision,
      (renewalCycleId || 'cert').toLowerCase(),
    ].join(':');

    return {
      auditEventId: `urn-tab-review:${decision}:${this.hashId(eventKey)}`,
      module: AUDIT_MODULE.CERTIFICATION,
      action_type:
        decision === 'approved'
          ? AUDIT_ACTION_TYPE.APPROVE
          : AUDIT_ACTION_TYPE.REJECT,
      entity_name: urnNo,
      description: formatUrnTabReviewAuditDescription(
        tabKey,
        decision,
        stepId ?? null,
      ),
      old_values: built.old_values,
      new_values: built.new_values,
      resource: urnNo
        ? { type: 'UrnTabReview', id: urnNo, urn_no: urnNo }
        : undefined,
      metadata: {
        business_event_type: DOCUMENT_REVIEW_BUSINESS_EVENT.URN_TAB_REVIEW,
        consolidated: true,
        document_review_workflow: built.workflow,
        related_domain_events: ['urn_tab_review', 'activity_timeline_entry'],
      },
    };
  }

  /**
   * Admin "Submit for Final Review":
   * - Certification: PATCH /api/admin/products/urn-status → updateStatusTo 6
   * - Renewal: PATCH /renew/urn-status → updateStatusTo 17 (may complete to 11)
   */
  private finalReviewSubmitSummary(
    method: string,
    pathNorm: string,
    req: AuditableRequest,
  ): AuditBusinessEventSummary | undefined {
    const m = method.toUpperCase();
    if (m !== 'PATCH') {
      return undefined;
    }
    const body = this.bodyObj(req);
    const response = this.responseRoot(req.__auditResponseBody);
    const typeStr =
      this.stringField(body, 'updateStatusType') ??
      this.stringField(response, 'updateStatusType');
    if (typeStr && typeStr !== 'urn_status') {
      return undefined;
    }
    const targetStatus = this.numberField(body, 'updateStatusTo');

    const isCertFinalReview =
      (pathNorm.endsWith('/api/admin/products/urn-status') ||
        /\/admin\/urn\/[^/]+\/status$/i.test(pathNorm) ||
        pathNorm.endsWith('/products/urn-status')) &&
      targetStatus === 6;

    const isRenewFinalReview =
      /\/renew\/urn-status$/i.test(pathNorm) &&
      targetStatus === RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING;

    if (!isCertFinalReview && !isRenewFinalReview) {
      return undefined;
    }

    const urnNo =
      this.stringField(response, 'urnNo') ??
      this.stringField(body, 'urnNo') ??
      (/\/admin\/urn\/([^/]+)\/status$/i.exec(pathNorm)?.[1]
        ? decodeURIComponent(
            /\/admin\/urn\/([^/]+)\/status$/i.exec(pathNorm)![1],
          )
        : undefined);

    const resultingUrnStatus =
      this.numberField(response, 'urnStatus') ?? targetStatus ?? undefined;
    const previousUrnStatus =
      this.numberField(response, 'previousUrnStatus') ??
      this.numberField(body, 'previousUrnStatus');
    const productRenewStatus = this.numberField(response, 'productRenewStatus');
    const renewedDate =
      this.stringField(response, 'renewedDate') ??
      (response?.['renewedDate'] instanceof Date
        ? (response['renewedDate'] as Date).toISOString()
        : undefined);
    const validtillDate =
      this.stringField(response, 'validtillDate') ??
      (response?.['validtillDate'] instanceof Date
        ? (response['validtillDate'] as Date).toISOString()
        : undefined);

    const workflow = isRenewFinalReview ? 'renewal' : 'certification';
    const urnKey = (urnNo || 'unknown').toLowerCase();
    const auditEventId = `final-review-submit:${workflow}:${this.hashId(
      `${urnKey}:${resultingUrnStatus ?? targetStatus ?? 'unknown'}`,
    )}`;

    return {
      auditEventId,
      module: AUDIT_MODULE.CERTIFICATION,
      action_type: AUDIT_ACTION_TYPE.UPDATE,
      entity_name: urnNo,
      description: 'Submitted for final review',
      old_values: {
        ...(urnNo ? { urnNo } : {}),
        ...(previousUrnStatus != null ? { previousUrnStatus } : {}),
      },
      new_values: {
        ...(urnNo ? { urnNo } : {}),
        workflow,
        ...(resultingUrnStatus != null ? { urnStatus: resultingUrnStatus } : {}),
        ...(productRenewStatus != null ? { productRenewStatus } : {}),
        ...(renewedDate ? { renewedDate } : {}),
        ...(validtillDate ? { validtillDate } : {}),
      },
      resource: urnNo
        ? { type: 'URN', id: urnNo, urn_no: urnNo }
        : undefined,
      metadata: {
        business_event_type: 'final_review_submit',
        final_review_workflow: workflow,
        consolidated: true,
      },
    };
  }

  /**
   * Consolidate renew payment approve/reject across dual HTTP entry points:
   * PATCH /payments/:urn and PATCH /renew/urn-status (13→14).
   * Successes share one deterministic audit_event_id so concurrent/dual calls
   * insert a single row (unique index). Failures keep per-request UUIDs so
   * a later successful retry still records.
   */
  private renewalPaymentSummary(
    method: string,
    pathNorm: string,
    req: AuditableRequest,
  ): AuditBusinessEventSummary | undefined {
    const m = method.toUpperCase();
    const body = this.bodyObj(req);

    if (m === 'PATCH' && /^\/payments\/[^/]+$/i.test(pathNorm)) {
      const paymentType = (
        this.stringField(body, 'paymentType') ??
        this.stringField(body, 'payment_type') ??
        ''
      ).toLowerCase();
      if (paymentType !== 'renew') {
        return undefined;
      }
      const paymentStatus = this.numberField(body, 'paymentStatus');
      if (paymentStatus !== 2 && paymentStatus !== 3) {
        return undefined;
      }
      const urnSegment = pathNorm.split('/').filter(Boolean)[1];
      const urnNo = urnSegment ? decodeURIComponent(urnSegment) : undefined;
      const cycleId =
        this.stringField(body, 'renewalCycleId') ??
        this.stringField(body, 'renewal_cycle_id') ??
        'unknown';
      const decision = paymentStatus === 2 ? 'approve' : 'reject';
      const remarks =
        decision === 'reject'
          ? this.stringField(body, 'paymentRejectionRemarks') ??
            this.stringField(body, 'adminPaymentRejectionRemarks')
          : undefined;
      return this.buildRenewalPaymentAuditSummary({
        urnNo,
        cycleId,
        decision,
        paymentStatus,
        remarks,
        source: 'payments_patch',
      });
    }

    if (m === 'PATCH' && /\/renew\/urn-status$/i.test(pathNorm)) {
      const targetStatus = this.numberField(body, 'updateStatusTo');
      if (targetStatus !== RENEWAL_URN_STATUS.PAYMENT_APPROVED) {
        return undefined;
      }
      const urnNo = this.stringField(body, 'urnNo');
      const cycleId = this.stringField(body, 'renewalCycleId') ?? 'unknown';
      return this.buildRenewalPaymentAuditSummary({
        urnNo,
        cycleId,
        decision: 'approve',
        paymentStatus: 2,
        urnStatus: RENEWAL_URN_STATUS.PAYMENT_APPROVED,
        source: 'renew_urn_status',
      });
    }

    return undefined;
  }

  private buildRenewalPaymentAuditSummary(params: {
    urnNo?: string;
    cycleId: string;
    decision: 'approve' | 'reject';
    paymentStatus: number;
    urnStatus?: number;
    remarks?: string;
    source: 'payments_patch' | 'renew_urn_status';
  }): AuditBusinessEventSummary {
    const urnDisplay = params.urnNo?.trim() || undefined;
    // Normalize so /payments/:urn (path-normalized) and body.urnNo hash identically.
    const urnKey = (urnDisplay || 'unknown').toLowerCase();
    const cycleKey = params.cycleId.trim().toLowerCase() || 'unknown';
    const auditEventId = `renewal-payment:${params.decision}:${this.hashId(
      `${urnKey}:${cycleKey}:${params.decision}`,
    )}`;
    const remarks = params.remarks?.trim() || undefined;
    return {
      auditEventId,
      module: AUDIT_MODULE.PAYMENT,
      action_type:
        params.decision === 'approve'
          ? AUDIT_ACTION_TYPE.APPROVE
          : AUDIT_ACTION_TYPE.REJECT,
      entity_name: urnDisplay,
      description:
        params.decision === 'approve'
          ? 'Renewal payment approved'
          : 'Renewal payment rejected',
      new_values: {
        urnNo: urnDisplay,
        paymentType: 'renew',
        paymentStatus: params.paymentStatus,
        renewalCycleId: params.cycleId,
        ...(params.urnStatus != null ? { urnStatus: params.urnStatus } : {}),
        ...(params.decision === 'reject' && remarks
          ? { paymentRejectionRemarks: remarks }
          : {}),
      },
      resource: urnDisplay
        ? { type: 'Payment', id: urnDisplay, urn_no: urnDisplay }
        : undefined,
      metadata: {
        business_event_type: 'renewal_payment_decision',
        consolidated: true,
        renewal_payment_decision: params.decision,
        audit_source: params.source,
        related_domain_events: [
          'payment_update',
          'renew_urn_status',
          'renewal_orchestration',
        ],
      },
    };
  }

  /**
   * Certification fee assign / pay / approve / reject for multi-product URNs.
   * Prefer allowlisted business snapshots (selected/rejected product IDs) over
   * raw payment body/response payloads.
   */
  private certificationPaymentSummary(
    method: string,
    pathNorm: string,
    req: AuditableRequest,
  ): AuditBusinessEventSummary | undefined {
    const m = method.toUpperCase();
    const body = this.bodyObj(req);
    const response = this.responseRoot(req.__auditResponseBody);

    if (m === 'POST' && pathNorm.endsWith('/payments')) {
      const paymentType = (
        this.stringField(body, 'paymentType') ??
        this.stringField(response, 'paymentType') ??
        ''
      ).toLowerCase();
      if (paymentType !== 'certification') {
        return undefined;
      }
      return this.buildCertificationFeeAssignSummary({ body, response });
    }

    if (m === 'PATCH' && /^\/payments\/[^/]+$/i.test(pathNorm)) {
      const paymentType = (
        this.stringField(body, 'paymentType') ??
        this.stringField(body, 'payment_type') ??
        ''
      ).toLowerCase();
      if (paymentType !== 'certification') {
        return undefined;
      }
      const paymentStatus =
        this.numberField(body, 'paymentStatus') ??
        this.numberField(response, 'paymentStatus');
      if (
        paymentStatus !== 1 &&
        paymentStatus !== 2 &&
        paymentStatus !== 3
      ) {
        return undefined;
      }
      const urnSegment = pathNorm.split('/').filter(Boolean)[1];
      const urnNo =
        this.stringField(body, 'urnNo') ??
        this.stringField(response, 'urnNo') ??
        (urnSegment ? decodeURIComponent(urnSegment) : undefined);
      return this.buildCertificationFeePaymentSummary({
        urnNo,
        paymentStatus,
        body,
        response,
      });
    }

    return undefined;
  }

  private buildCertificationFeeAssignSummary(params: {
    body?: Record<string, unknown>;
    response?: Record<string, unknown>;
  }): AuditBusinessEventSummary {
    const { body, response } = params;
    const urnNo =
      this.stringField(body, 'urnNo') ?? this.stringField(response, 'urnNo');
    const productsToBeCertified =
      this.stringField(body, 'productsToBeCertified') ??
      this.stringField(response, 'productsToBeCertified');
    const selectedProductIds = this.productIdList(
      response?.['selectedProductIds'] ?? body?.['selectedProductIds'],
      productsToBeCertified,
    );
    const rejectedProductIds = this.productIdList(
      response?.['rejectedProductIds'] ?? body?.['rejectedProductIds'],
    );
    const hasPartialReject = rejectedProductIds.length > 0;
    const urnKey = (urnNo || 'unknown').toLowerCase();
    const selectionKey =
      selectedProductIds.length > 0
        ? selectedProductIds.slice().sort((a, b) => a - b).join(',')
        : (productsToBeCertified ?? 'unknown');
    const auditEventId = `certification-fee:assign:${this.hashId(
      `${urnKey}:${selectionKey}`,
    )}`;

    return {
      auditEventId,
      module: AUDIT_MODULE.PAYMENT,
      action_type: hasPartialReject
        ? AUDIT_ACTION_TYPE.REJECT
        : AUDIT_ACTION_TYPE.CREATE,
      entity_name: urnNo,
      description: hasPartialReject
        ? 'Certification fee assigned with partial product rejection'
        : 'Certification fee assigned',
      old_values: {
        urnNo,
        ...(hasPartialReject
          ? { rejectedProductStatus: null }
          : {}),
      },
      new_values: {
        urnNo,
        paymentType: 'certification',
        paymentStatus: 0,
        ...(productsToBeCertified
          ? { productsToBeCertified }
          : selectedProductIds.length
            ? { productsToBeCertified: JSON.stringify(selectedProductIds) }
            : {}),
        ...(selectedProductIds.length
          ? { selectedProductIds }
          : {}),
        ...(rejectedProductIds.length
          ? { rejectedProductIds }
          : {}),
        ...(hasPartialReject
          ? {
              rejectedProductStatus: 3,
              rejectionReason:
                'Auto-rejected: not selected for certification fee',
            }
          : {}),
      },
      resource: urnNo
        ? { type: 'Payment', id: urnNo, urn_no: urnNo }
        : undefined,
      metadata: {
        business_event_type: 'certification_fee',
        certification_fee_event: 'assign',
        consolidated: true,
        partial_rejection: hasPartialReject,
        related_domain_events: hasPartialReject
          ? ['payment_create', 'product_partial_reject']
          : ['payment_create'],
      },
    };
  }

  private buildCertificationFeePaymentSummary(params: {
    urnNo?: string;
    paymentStatus: number;
    body?: Record<string, unknown>;
    response?: Record<string, unknown>;
  }): AuditBusinessEventSummary {
    const { urnNo, paymentStatus, body, response } = params;
    const event =
      paymentStatus === 1
        ? 'submit'
        : paymentStatus === 2
          ? 'approve'
          : 'reject';
    const previousPaymentStatus =
      this.numberField(response, 'previousPaymentStatus') ??
      (paymentStatus === 1
        ? 0
        : paymentStatus === 2 || paymentStatus === 3
          ? 1
          : undefined);
    const productsToBeCertified =
      this.stringField(body, 'productsToBeCertified') ??
      this.stringField(response, 'productsToBeCertified');
    const selectedProductIds = this.productIdList(
      response?.['selectedProductIds'] ?? body?.['selectedProductIds'],
      productsToBeCertified,
    );
    const rejectedProductIds = this.productIdList(
      response?.['rejectedProductIds'] ?? body?.['rejectedProductIds'],
    );
    const remarks =
      this.stringField(body, 'paymentRejectionRemarks') ??
      this.stringField(body, 'adminPaymentRejectionRemarks') ??
      this.stringField(response, 'paymentRejectionRemarks') ??
      this.stringField(response, 'adminPaymentRejectionRemarks');
    const urnStatus =
      this.numberField(body, 'urnStatus') ??
      this.numberField(response, 'urnStatus');
    const urnKey = (urnNo || 'unknown').toLowerCase();
    const auditEventId = `certification-fee:${event}:${this.hashId(urnKey)}`;

    const description =
      event === 'submit'
        ? 'Certification fee payment submitted'
        : event === 'approve'
          ? 'Certification fee payment approved'
          : 'Certification fee payment rejected';

    return {
      auditEventId,
      module: AUDIT_MODULE.PAYMENT,
      action_type:
        event === 'approve'
          ? AUDIT_ACTION_TYPE.APPROVE
          : event === 'reject'
            ? AUDIT_ACTION_TYPE.REJECT
            : AUDIT_ACTION_TYPE.UPDATE,
      entity_name: urnNo,
      description,
      old_values: {
        urnNo,
        paymentType: 'certification',
        ...(previousPaymentStatus != null
          ? { paymentStatus: previousPaymentStatus }
          : {}),
        ...(productsToBeCertified ? { productsToBeCertified } : {}),
        ...(selectedProductIds.length ? { selectedProductIds } : {}),
      },
      new_values: {
        urnNo,
        paymentType: 'certification',
        paymentStatus,
        ...(productsToBeCertified ? { productsToBeCertified } : {}),
        ...(selectedProductIds.length ? { selectedProductIds } : {}),
        ...(rejectedProductIds.length ? { rejectedProductIds } : {}),
        ...(urnStatus != null ? { urnStatus } : {}),
        ...(remarks ? { paymentRejectionRemarks: remarks } : {}),
        ...(event === 'approve' ? { certifiedProductStatus: 2 } : {}),
      },
      resource: urnNo
        ? { type: 'Payment', id: urnNo, urn_no: urnNo }
        : undefined,
      metadata: {
        business_event_type: 'certification_fee',
        certification_fee_event: event,
        consolidated: true,
        related_domain_events:
          event === 'approve'
            ? ['payment_update', 'certification_approval']
            : ['payment_update'],
      },
    };
  }

  /** Parse numeric product ids from arrays, JSON strings, or comma lists. */
  private productIdList(
    value: unknown,
    productsToBeCertifiedFallback?: string,
  ): number[] {
    const fromValue = this.coerceProductIdList(value);
    if (fromValue.length) {
      return fromValue;
    }
    if (productsToBeCertifiedFallback) {
      return this.coerceProductIdList(productsToBeCertifiedFallback);
    }
    return [];
  }

  private coerceProductIdList(value: unknown): number[] {
    if (value == null || value === '') {
      return [];
    }
    if (Array.isArray(value)) {
      return [
        ...new Set(
          value
            .map((item) => Number(item))
            .filter((id) => Number.isInteger(id) && id > 0),
        ),
      ];
    }
    if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
      return [value];
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        return [];
      }
      try {
        const parsed = JSON.parse(trimmed) as unknown;
        if (Array.isArray(parsed) || typeof parsed === 'number') {
          return this.coerceProductIdList(parsed);
        }
      } catch {
        // fall through to comma split
      }
      return [
        ...new Set(
          trimmed
            .split(/[,\s]+/)
            .map((part) => Number(part.trim()))
            .filter((id) => Number.isInteger(id) && id > 0),
        ),
      ];
    }
    return [];
  }

  /** No-op renew status responses must not create a second audit for the same payment decision. */
  private isRenewUrnStatusNoop(
    req: AuditableRequest,
    pathNorm: string,
  ): boolean {
    if (!/\/renew\/urn-status$/i.test(pathNorm)) {
      return false;
    }
    const response = this.responseRoot(req.__auditResponseBody);
    if (!response) {
      return false;
    }
    const message = String(response['message'] ?? '').toLowerCase();
    return message.includes('unchanged') || message.includes('already');
  }

  private responseRoot(
    body: unknown,
  ): Record<string, unknown> | undefined {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return undefined;
    }
    const root = body as Record<string, unknown>;
    const nested = root['data'];
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
      return nested as Record<string, unknown>;
    }
    return root;
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
