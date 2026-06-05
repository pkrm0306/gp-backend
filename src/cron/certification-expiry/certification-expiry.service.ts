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
import { PRODUCT_STATUS_DISCONTINUED } from '../../renew/constants/product-status.constants';
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
import { CronJobRunResult, EligibleExpiryProduct } from './certification-expiry.types';

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
  ) {}

  async runBefore2Month(asOf = new Date()): Promise<CronJobRunResult> {
    return this.runJob('before2month', asOf, async (products, todayIso, result) => {
      const year = Number(todayIso.slice(0, 4));
      const internalCc = this.internalCcEmail();

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
          alsoSendTo: internalCc ? [internalCc] : [],
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
      const regYear = yearMonthsAgoInTimeZone(24);
      const currentYear = Number(todayIso.slice(0, 4));

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
        const notifyDate = `deactivate-${graceEndIso}`;
        const already = await this.cronEmailLogModel.exists({
          productId: product.productId,
          jobType: 'deactivationMail',
          notifyDate,
        });
        if (already) {
          result.skipped += 1;
          continue;
        }

        result.processed += 1;
        try {
          const now = new Date();
          await this.productModel.updateOne(
            { productId: product.productId },
            {
              $set: {
                productStatus: PRODUCT_STATUS_DISCONTINUED,
                updatedDate: now,
              },
            },
          );
          result.deactivated += 1;

          const html = await this.templateService.renderDeactivationEmail(product, {
            productRegistrationYear: regYear,
            currentYear,
          });
          await this.sendVendorEmail(
            product,
            `GreenPro — Product deactivated (${product.eoiNo || product.urnNo})`,
            html,
          );
          await this.writeLog(product, 'deactivationMail', notifyDate);
          result.sent += 1;
        } catch (error) {
          result.failed += 1;
          result.errors.push(this.errorEntry(product, error));
        }
      }
    },
      (date) => this.queryService.getDeactivationEligibleProducts(date),
    );
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
    }
    const emailOff =
      String(this.configService.get<string>('EMAIL_DISABLED') ?? 'false').toLowerCase() ===
      'true';
    this.logger.log(
      `[${jobType}] processed=${result.processed} sent=${result.sent} skipped=${result.skipped} failed=${result.failed} deactivated=${result.deactivated} emailDisabled=${emailOff}`,
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
      alsoSendTo?: string[];
      result: CronJobRunResult;
    },
  ): Promise<void> {
    const { jobType, notifyDate, subject, html, alsoSendTo, result } = options;
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
      await this.sendVendorEmail(product, subject, html);
      for (const cc of alsoSendTo ?? []) {
        const ccTrim = cc.trim();
        if (ccTrim) {
          await this.emailService.sendEmail(ccTrim, subject, html, undefined, {
            rawHtml: true,
          });
        }
      }
      await this.writeLog(product, jobType, notifyDate);
      result.sent += 1;
    } catch (error) {
      result.failed += 1;
      result.errors.push(this.errorEntry(product, error));
    }
  }

  private async sendVendorEmail(
    product: EligibleExpiryProduct,
    subject: string,
    html: string,
  ): Promise<void> {
    const email = String(product.vendorEmail ?? '').trim();
    if (!email) return;
    await this.emailService.sendEmail(email, subject, html, undefined, {
      rawHtml: true,
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

  private internalCcEmail(): string {
    return (
      this.configService.get<string>('CRON_EXPIRY_INTERNAL_CC')?.trim() ||
      'sheshikumar.bheemreddy@cii.in'
    );
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
