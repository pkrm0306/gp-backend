import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import {
  Product,
  ProductDocument,
} from '../../product-registration/schemas/product.schema';
import {
  RenewalCycle,
  RenewalCycleDocument,
  RenewalCycleStatus,
} from '../../renew/schemas/renewal-cycle.schema';
import { EmailService } from '../../common/services/email.service';
import { computeGraceEndDate } from '../../product-registration/helpers/certification-dates.util';
import {
  PRODUCT_STATUS_CERTIFIED,
  PRODUCT_STATUS_DISCONTINUED,
} from '../../renew/constants/product-status.constants';
import {
  CronEmailLog,
  CronEmailLogDocument,
  CronJobType,
} from '../schemas/cron-email-log.schema';
import {
  calendarDaysBetween,
  isSameCalendarDayInTimeZone,
  todayIsoInTimeZone,
  toIsoDateInTimeZone,
  yearMonthsAgoInTimeZone,
} from '../utils/cron-date.util';
import { CertificationExpiryQueryService } from './certification-expiry-query.service';
import { CertificationExpiryTemplateService } from './certification-expiry-template.service';
import { LifecycleNotificationService } from '../../notifications/lifecycle-notification.service';
import {
  parseEmailList,
  resolveCcGroups,
} from '../../notifications/utils/notification-recipient-groups.util';
import {
  CronJobRunResult,
  DeactivationBatchItem,
  EligibleExpiryProduct,
} from './certification-expiry.types';
import { AuditLogService } from '../../audit-log/audit-log.service';
import { AUDIT_ACTION } from '../../audit-log/audit-actions';
import {
  AUDIT_ACTION_TYPE,
  AUDIT_MODULE,
} from '../../audit-log/audit-friendlies';
import type { CreateAuditLogDto } from '../../audit-log/dto/create-audit-log.dto';

const DEACTIVATION_EMAIL_CONCURRENCY = 5;
const DEACTIVATION_MAIL_ROUTE =
  '/api/cron/certification-expiry/deactivation-mail';
const CRON_ACTOR_USER_ID = 'system:cron:certification-expiry';
const CRON_PERFORMED_BY = {
  user_id: CRON_ACTOR_USER_ID,
  name: 'System',
} as const;
const CRON_ACTOR = {
  user_id: CRON_ACTOR_USER_ID,
  role: 'system',
} as const;

@Injectable()
export class CertificationExpiryService {
  private readonly logger = new Logger(CertificationExpiryService.name);

  constructor(
    private readonly queryService: CertificationExpiryQueryService,
    private readonly templateService: CertificationExpiryTemplateService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(RenewalCycle.name)
    private readonly renewalCycleModel: Model<RenewalCycleDocument>,
    @InjectModel(CronEmailLog.name)
    private readonly cronEmailLogModel: Model<CronEmailLogDocument>,
    private readonly lifecycleNotification: LifecycleNotificationService,
    private readonly auditLogService: AuditLogService,
  ) {}

  private notifyExpiryAdmin(
    product: EligibleExpiryProduct,
    stage: '60-day' | 'weekly' | 'deactivation',
    includeAdminEmail: boolean,
  ): void {
    const manufacturerName = String(
      product.manufacturerName ?? product.vendorName ?? 'Manufacturer',
    ).trim();
    this.lifecycleNotification
      .notifyCertificationExpiryAdmin({
        manufacturerName,
        urnNo: product.urnNo,
        eoiNo: product.eoiNo,
        stage,
        productId: product.productId,
        includeAdminEmail,
      })
      .catch((err) =>
        this.logger.warn(
          `[${stage}] Admin expiry notification failed for product ${product.productId}: ${(err as Error).message}`,
        ),
      );
  }

  async runBefore2Month(asOf = new Date()): Promise<CronJobRunResult> {
    return this.runJob('before2month', asOf, async (products, todayIso, result) => {
      const year = Number(todayIso.slice(0, 4));
      const vendorCc = this.resolveExpiryVendorCc();

      for (const product of products) {
        if (!product.firstNotifyDate) {
          result.skipped += 1;
          continue;
        }
        if (!isSameCalendarDayInTimeZone(product.firstNotifyDate, asOf)) {
          result.skipped += 1;
          continue;
        }
        const html = await this.templateService.renderCertificationExpiryEmail(
          product,
          { includeYear: true, year },
        );
        await this.processProductEmail(product, {
          jobType: 'before2month',
          notifyDate: todayIso,
          subject: `GreenPro — Expiry reminder (${product.eoiNo || product.urnNo})`,
          html,
          vendorCc,
          result,
        });
      }
    });
  }

  async runWeeklyMail(asOf = new Date()): Promise<CronJobRunResult> {
    return this.runJob('weeklyMail', asOf, async (products, todayIso, result) => {
      for (const product of products) {
        if (!product.secondNotifyDate || !product.thirdNotifyDate) {
          result.skipped += 1;
          continue;
        }
        const secondIso = toIsoDateInTimeZone(product.secondNotifyDate);
        const thirdIso = toIsoDateInTimeZone(product.thirdNotifyDate);
        if (!(todayIso > secondIso && todayIso < thirdIso)) {
          result.skipped += 1;
          continue;
        }
        if (calendarDaysBetween(product.secondNotifyDate, asOf) !== 7) {
          result.skipped += 1;
          continue;
        }
        const notifyDate = `${secondIso}-weekly-d7`;
        const html = await this.templateService.renderCertificationExpiryEmail(
          product,
          { includeYear: false },
        );
        await this.processProductEmail(product, {
          jobType: 'weeklyMail',
          notifyDate,
          subject: `GreenPro — Weekly expiry reminder (${product.eoiNo || product.urnNo})`,
          html,
          result,
        });
      }
    });
  }

  async runDeactivationMail(asOf = new Date()): Promise<CronJobRunResult> {
    return this.runJob(
      'deactivationMail',
      asOf,
      async (products, todayIso, result) => {
        const startedAt = Date.now();
        const regYear = yearMonthsAgoInTimeZone(24);
        const currentYear = Number(todayIso.slice(0, 4));

        const toDeactivate = await this.planDeactivationBatch(
          products,
          todayIso,
          result,
        );
        result.planned = toDeactivate.length;

        if (toDeactivate.length === 0) {
          result.durationMs = Date.now() - startedAt;
          return;
        }

        result.processed = toDeactivate.length;
        const productIds = toDeactivate.map((item) => item.product.productId);
        const now = new Date();

        const updateResult = await this.productModel.updateMany(
          {
            productId: { $in: productIds },
            productStatus: PRODUCT_STATUS_CERTIFIED,
          },
          {
            $set: {
              productStatus: PRODUCT_STATUS_DISCONTINUED,
              updatedDate: now,
            },
          },
        );

        result.matchedCount = updateResult.matchedCount ?? 0;
        result.modifiedCount = updateResult.modifiedCount ?? 0;
        result.deactivated = result.modifiedCount;

        if ((result.modifiedCount ?? 0) > 0) {
          await this.writeDeactivationSuccessAudits(toDeactivate, now);
        }

        await this.sendDeactivationNotifications(
          toDeactivate,
          { regYear, currentYear },
          result,
        );

        result.durationMs = Date.now() - startedAt;
      },
      (date) => this.queryService.getDeactivationEligibleProducts(date),
    );
  }

  /** Phase 1 — eligibility + idempotency in memory; no product status writes. */
  async planDeactivationBatch(
    products: EligibleExpiryProduct[],
    todayIso: string,
    result: CronJobRunResult,
  ): Promise<DeactivationBatchItem[]> {
    const candidates: DeactivationBatchItem[] = [];

    for (const product of products) {
      if (!product.validtillDate) {
        result.skipped += 1;
        continue;
      }
      const graceEndIso = toIsoDateInTimeZone(
        computeGraceEndDate(product.validtillDate),
      );
      if (graceEndIso > todayIso) {
        result.skipped += 1;
        continue;
      }
      candidates.push({
        product,
        notifyDate: `deactivate-${graceEndIso}`,
      });
    }

    if (candidates.length === 0) {
      return [];
    }

    const productIds = candidates.map((item) => item.product.productId);
    const notifyDates = [...new Set(candidates.map((item) => item.notifyDate))];

    const [existingLogs, statusRows] = await Promise.all([
      this.cronEmailLogModel
        .find({
          jobType: 'deactivationMail',
          productId: { $in: productIds },
          notifyDate: { $in: notifyDates },
        })
        .select('productId notifyDate')
        .lean()
        .exec(),
      this.productModel
        .find({ productId: { $in: productIds } })
        .select('productId productStatus')
        .lean()
        .exec(),
    ]);

    const loggedKeys = new Set(
      existingLogs.map((row) => `${row.productId}:${row.notifyDate}`),
    );
    const statusByProductId = new Map(
      statusRows.map((row) => [Number(row.productId), Number(row.productStatus)]),
    );

    const toDeactivate: DeactivationBatchItem[] = [];
    for (const item of candidates) {
      const logKey = `${item.product.productId}:${item.notifyDate}`;
      if (
        loggedKeys.has(logKey) &&
        statusByProductId.get(item.product.productId) ===
          PRODUCT_STATUS_DISCONTINUED
      ) {
        result.skipped += 1;
        continue;
      }
      toDeactivate.push(item);
    }

    return toDeactivate;
  }

  /** Phase 3 — vendor email + cron log after bulk status commit. */
  private async sendDeactivationNotifications(
    batch: DeactivationBatchItem[],
    templateVars: { regYear: number; currentYear: number },
    result: CronJobRunResult,
  ): Promise<void> {
    await this.mapWithConcurrency(
      batch,
      DEACTIVATION_EMAIL_CONCURRENCY,
      async (item) => {
        const { product, notifyDate } = item;
        try {
          const html = await this.templateService.renderDeactivationEmail(
            product,
            {
              productRegistrationYear: templateVars.regYear,
              currentYear: templateVars.currentYear,
            },
          );
          await this.sendVendorEmail(
            product,
            `GreenPro — Product deactivated (${product.eoiNo || product.urnNo})`,
            html,
          );
          await this.writeLog(product, 'deactivationMail', notifyDate);
          result.sent += 1;
          this.notifyExpiryAdmin(product, 'deactivation', true);
          this.lifecycleNotification.notifyVendorCertificationExpiryInApp({
            manufacturerId: String(product.vendorId),
            productName: String(
              product.productName ?? product.eoiNo ?? product.urnNo,
            ),
            eoiNo: String(product.eoiNo ?? ''),
            reminderStage: 'Product deactivated due to certification expiry',
            vendorEmail: product.vendorEmail,
            manufacturerName: String(
              product.manufacturerName ?? product.vendorName ?? '',
            ),
          });
        } catch (error) {
          result.failed += 1;
          result.errors.push(this.errorEntry(product, error));
          await this.writeDeactivationMailFailureAudit(
            product,
            notifyDate,
            error,
          );
        }
      },
    );
  }

  private deactivationAuditEventId(
    productId: number,
    notifyDate: string,
  ): string {
    return `certification-expiry:deactivation:${productId}:${notifyDate}`;
  }

  private async writeDeactivationSuccessAudits(
    batch: DeactivationBatchItem[],
    occurredAt: Date,
  ): Promise<void> {
    if (!batch.length) {
      return;
    }
    const entries: CreateAuditLogDto[] = batch.map(({ product, notifyDate }) =>
      this.buildDeactivationAuditEntry({
        product,
        notifyDate,
        occurredAt,
        outcome: 'success',
        description:
          'Product deactivated due to certification expiry (deactivation mail job)',
        businessOutcome: 'product_deactivated',
        statusCode: 200,
      }),
    );
    await this.auditLogService.recordMany(entries);
  }

  private async writeDeactivationMailFailureAudit(
    product: EligibleExpiryProduct,
    notifyDate: string,
    error: unknown,
  ): Promise<void> {
    const message = error instanceof Error ? error.message : String(error);
    await this.auditLogService.record(
      this.buildDeactivationAuditEntry({
        product,
        notifyDate,
        occurredAt: new Date(),
        outcome: 'failure',
        description:
          'Deactivation mail failed after product status was discontinued',
        businessOutcome: 'deactivation_mail_failed',
        statusCode: 500,
        errorMessage: message,
        // Unique per attempt so mail retries remain auditable without
        // colliding with the deterministic deactivation success event id.
        auditEventId: `certification-expiry:deactivation-mail-failure:${product.productId}:${notifyDate}:${Date.now()}`,
      }),
    );
  }

  private async writeDeactivationJobFailureAudit(
    error: unknown,
  ): Promise<void> {
    const message = error instanceof Error ? error.message : String(error);
    await this.auditLogService.record({
      occurred_at: new Date(),
      action: AUDIT_ACTION.CERTIFICATION_EXPIRY_DEACTIVATION,
      outcome: 'failure',
      module: AUDIT_MODULE.PRODUCT,
      action_type: AUDIT_ACTION_TYPE.UPDATE,
      entity_name: 'deactivationMail',
      description: 'Certification expiry deactivation mail job failed',
      performed_by: { ...CRON_PERFORMED_BY },
      actor: { ...CRON_ACTOR },
      http_method: 'POST',
      route: DEACTIVATION_MAIL_ROUTE,
      status_code: 500,
      metadata: {
        audit_event_id: `certification-expiry:deactivation-job-failure:${Date.now()}`,
        business_event_type: 'certification_expiry_deactivation',
        business_outcome: 'job_failed',
        job_type: 'deactivationMail',
        error_message: message,
      },
    });
  }

  private buildDeactivationAuditEntry(input: {
    product: EligibleExpiryProduct;
    notifyDate: string;
    occurredAt: Date;
    outcome: 'success' | 'failure';
    description: string;
    businessOutcome: string;
    statusCode: number;
    errorMessage?: string;
    auditEventId?: string;
  }): CreateAuditLogDto {
    const { product, notifyDate } = input;
    const validTillIso =
      product.validtillDate != null
        ? new Date(product.validtillDate).toISOString()
        : undefined;
    return {
      occurred_at: input.occurredAt,
      action: AUDIT_ACTION.CERTIFICATION_EXPIRY_DEACTIVATION,
      outcome: input.outcome,
      module: AUDIT_MODULE.PRODUCT,
      action_type: AUDIT_ACTION_TYPE.UPDATE,
      entity_name: String(product.eoiNo || product.urnNo),
      description: input.description,
      performed_by: { ...CRON_PERFORMED_BY },
      actor: { ...CRON_ACTOR },
      resource: {
        type: 'product',
        id: String(product.productId),
        urn_no: product.urnNo,
      },
      old_values: {
        productStatus: PRODUCT_STATUS_CERTIFIED,
        urnNo: product.urnNo,
        eoiNo: product.eoiNo,
      },
      new_values: {
        productStatus: PRODUCT_STATUS_DISCONTINUED,
        urnNo: product.urnNo,
        eoiNo: product.eoiNo,
        ...(validTillIso ? { validtillDate: validTillIso } : {}),
      },
      http_method: 'POST',
      route: DEACTIVATION_MAIL_ROUTE,
      status_code: input.statusCode,
      metadata: {
        audit_event_id:
          input.auditEventId ??
          this.deactivationAuditEventId(product.productId, notifyDate),
        business_event_type: 'certification_expiry_deactivation',
        business_outcome: input.businessOutcome,
        job_type: 'deactivationMail',
        notify_date: notifyDate,
        ...(input.errorMessage ? { error_message: input.errorMessage } : {}),
      },
    };
  }

  private async mapWithConcurrency<T>(
    items: T[],
    concurrency: number,
    worker: (item: T) => Promise<void>,
  ): Promise<void> {
    if (items.length === 0) return;
    let index = 0;
    const limit = Math.max(1, Math.min(concurrency, items.length));
    const runners = Array.from({ length: limit }, async () => {
      while (index < items.length) {
        const current = items[index];
        index += 1;
        await worker(current);
      }
    });
    await Promise.all(runners);
  }

  private async runJob(
    jobType: CronJobType,
    asOf: Date,
    handler: (
      products: EligibleExpiryProduct[],
      todayIso: string,
      result: CronJobRunResult,
    ) => Promise<void>,
    loadProducts: (asOf: Date) => Promise<EligibleExpiryProduct[]> = (date) =>
      this.queryService.getEligibleProducts(date),
  ): Promise<CronJobRunResult> {
    const result: CronJobRunResult = {
      success: true,
      jobType,
      processed: 0,
      sent: 0,
      skipped: 0,
      failed: 0,
      deactivated: 0,
      errors: [],
    };
    try {
      const products = await loadProducts(asOf);
      const todayIso = todayIsoInTimeZone();
      await handler(products, todayIso, result);
      result.success = result.failed === 0;
    } catch (error) {
      result.success = false;
      result.errors.push({
        message: error instanceof Error ? error.message : String(error),
      });
      if (jobType === 'deactivationMail') {
        await this.writeDeactivationJobFailureAudit(error);
      }
    }
    const emailOff =
      String(this.configService.get<string>('EMAIL_DISABLED') ?? 'false').toLowerCase() ===
      'true';
    const extras =
      jobType === 'deactivationMail'
        ? ` planned=${result.planned ?? 0} matched=${result.matchedCount ?? 0} modified=${result.modifiedCount ?? 0} durationMs=${result.durationMs ?? 0}`
        : '';
    this.logger.log(
      `[${jobType}] processed=${result.processed} sent=${result.sent} skipped=${result.skipped} failed=${result.failed} deactivated=${result.deactivated}${extras} emailDisabled=${emailOff}`,
    );
    return result;
  }

  private async processProductEmail(
    product: EligibleExpiryProduct,
    options: {
      jobType: CronJobType;
      notifyDate: string;
      subject: string;
      html: string;
      vendorCc?: string[];
      result: CronJobRunResult;
    },
  ): Promise<void> {
    const { jobType, notifyDate, subject, html, vendorCc, result } = options;
    const exists = await this.cronEmailLogModel.exists({
      productId: product.productId,
      jobType,
      notifyDate,
    });
    if (exists) {
      result.skipped += 1;
      return;
    }

    const email = String(product.vendorEmail ?? '').trim();
    if (!email) {
      result.skipped += 1;
      result.errors.push({
        productId: product.productId,
        urnNo: product.urnNo,
        message: 'Missing vendor email',
      });
      return;
    }

    result.processed += 1;
    try {
      await this.sendVendorEmail(product, subject, html, vendorCc);
      await this.writeLog(product, jobType, notifyDate);
      result.sent += 1;
      const expiryStage =
        jobType === 'before2month'
          ? '60-day'
          : jobType === 'weeklyMail'
            ? 'weekly'
            : 'deactivation';
      const includeAdminEmail = jobType !== 'before2month';
      this.notifyExpiryAdmin(product, expiryStage, includeAdminEmail);
      this.lifecycleNotification.notifyVendorCertificationExpiryInApp({
        manufacturerId: String(product.vendorId),
        productName: String(product.productName ?? product.eoiNo ?? product.urnNo),
        eoiNo: String(product.eoiNo ?? ''),
        reminderStage:
          expiryStage === '60-day'
            ? '60-day expiry reminder'
            : expiryStage === 'weekly'
              ? 'Weekly expiry reminder'
              : 'Product deactivated due to certification expiry',
        vendorEmail: product.vendorEmail,
        manufacturerName: String(
          product.manufacturerName ?? product.vendorName ?? '',
        ),
      });
    } catch (error) {
      result.failed += 1;
      result.errors.push(this.errorEntry(product, error));
    }
  }

  private async sendVendorEmail(
    product: EligibleExpiryProduct,
    subject: string,
    html: string,
    cc?: string[],
  ): Promise<void> {
    const email = String(product.vendorEmail ?? '').trim();
    if (!email) return;
    const vendorEmail = email.toLowerCase();
    const ccFiltered =
      cc?.filter((addr) => addr.trim().toLowerCase() !== vendorEmail) ?? [];
    await this.emailService.sendEmail(email, subject, html, undefined, {
      rawHtml: true,
      cc: ccFiltered.length ? ccFiltered : undefined,
    });
  }

  private async writeLog(
    product: EligibleExpiryProduct,
    jobType: CronJobType,
    notifyDate: string,
  ): Promise<void> {
    const inProgress = await this.renewalCycleModel
      .findOne({ urnNo: product.urnNo, status: RenewalCycleStatus.IN_PROGRESS })
      .select('_id')
      .lean()
      .exec();

    await this.cronEmailLogModel.create({
      productId: product.productId,
      urnNo: product.urnNo,
      eoiNo: product.eoiNo,
      jobType,
      notifyDate,
      vendorId: product.vendorId,
      renewCycleNo: product.renewCycleNo ?? undefined,
      urnStatus: product.urnStatus,
      productRenewStatus: product.productRenewStatus,
      renewalCycleId: inProgress?._id as Types.ObjectId | undefined,
      sentAt: new Date(),
    });
  }

  private resolveExpiryVendorCc(): string[] {
    const fromGroups = resolveCcGroups(this.configService, ['SHEshi']);
    if (fromGroups.length) {
      return fromGroups;
    }
    const legacy =
      this.configService.get<string>('CRON_EXPIRY_INTERNAL_CC')?.trim() || '';
    return parseEmailList(legacy);
  }

  private errorEntry(
    product: EligibleExpiryProduct | undefined,
    error: unknown,
  ): { productId?: number; urnNo?: string; message: string } {
    return {
      productId: product?.productId,
      urnNo: product?.urnNo,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}
