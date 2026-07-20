import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import {
  ContactMessage,
  ContactMessageDocument,
} from '../../website/schemas/contact-message.schema';
import { EmailService } from '../../common/services/email.service';
import {
  resolveAdminAlertTo,
  resolveAlwaysAdminCc,
} from '../../notifications/utils/notification-recipient-groups.util';
import { CRON_TIMEZONE, toIsoDateInTimeZone } from '../utils/cron-date.util';

/** Enquiries older than this many days are eligible for reminder. */
export const INQUIRY_REMINDER_AGE_DAYS = 3;

export type InquiryReminderRunResult = {
  jobType: 'inquiry-reminder';
  asOf: string;
  cutoffCreatedAt: string;
  eligibleCount: number;
  contactCount: number;
  productCount: number;
  emailSent: boolean;
  markedReminded: number;
  skippedReason?: string;
};

@Injectable()
export class InquiryReminderService {
  private readonly logger = new Logger(InquiryReminderService.name);

  constructor(
    @InjectModel(ContactMessage.name)
    private readonly contactMessageModel: Model<ContactMessageDocument>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Finds unacknowledged enquiries created ≥ 3 days ago that have not been reminded,
   * emails the admin with counts, then marks those rows as reminded.
   */
  async runReminder(asOf = new Date()): Promise<InquiryReminderRunResult> {
    const asOfIso = toIsoDateInTimeZone(asOf, CRON_TIMEZONE);
    const cutoffCreatedAt = new Date(
      asOf.getTime() - INQUIRY_REMINDER_AGE_DAYS * 86_400_000,
    );

    const baseResult: InquiryReminderRunResult = {
      jobType: 'inquiry-reminder',
      asOf: asOfIso,
      cutoffCreatedAt: cutoffCreatedAt.toISOString(),
      eligibleCount: 0,
      contactCount: 0,
      productCount: 0,
      emailSent: false,
      markedReminded: 0,
    };

    const eligibleFilter = {
      createdAt: { $lte: cutoffCreatedAt },
      $and: [
        {
          $or: [
            { isAcknowledged: false },
            { isAcknowledged: { $exists: false } },
            { isAcknowledged: null },
          ],
        },
        {
          $or: [
            { isReminded: false },
            { isReminded: { $exists: false } },
            { isReminded: null },
          ],
        },
      ],
    };

    const rows = await this.contactMessageModel
      .find(eligibleFilter)
      .select('_id inquiryType')
      .lean()
      .exec();

    const ids = (rows ?? []).map((r) => r._id);
    let contactCount = 0;
    let productCount = 0;
    for (const r of rows ?? []) {
      const type = String(
        (r as { inquiryType?: string }).inquiryType ?? 'contact',
      )
        .trim()
        .toLowerCase();
      if (type === 'product') productCount += 1;
      else contactCount += 1;
    }

    baseResult.eligibleCount = ids.length;
    baseResult.contactCount = contactCount;
    baseResult.productCount = productCount;

    if (ids.length === 0) {
      baseResult.skippedReason = 'No eligible unacknowledged enquiries';
      this.logger.log(
        `[inquiry-reminder] No eligible enquiries (cutoff ${cutoffCreatedAt.toISOString()})`,
      );
      return baseResult;
    }

    const adminTo = resolveAdminAlertTo(this.configService);
    if (!adminTo) {
      baseResult.skippedReason = 'Admin alert email is not configured';
      this.logger.warn('[inquiry-reminder] No admin To address configured');
      return baseResult;
    }

    const adminPortalBase =
      this.configService.get<string>('ADMIN_PORTAL_URL')?.trim() ||
      this.configService.get<string>('APP_BASE_URL')?.trim() ||
      '';

    const subject = `GreenPro — ${ids.length} unacknowledged enquir${ids.length === 1 ? 'y' : 'ies'} pending`;
    const htmlBody = this.buildEmailHtml({
      total: ids.length,
      contactCount,
      productCount,
      asOfIso,
      adminPortalBase,
    });
    const textBody = this.buildEmailText({
      total: ids.length,
      contactCount,
      productCount,
      asOfIso,
      adminPortalBase,
    });

    const cc = resolveAlwaysAdminCc(this.configService).filter(
      (email) => email.toLowerCase() !== adminTo.toLowerCase(),
    );

    let delivered = false;
    try {
      delivered = await this.emailService.sendEmail(
        adminTo,
        subject,
        htmlBody,
        textBody,
        {
          cc: cc.length ? cc : undefined,
          skipAdminCc: true,
        },
      );
    } catch (err) {
      this.logger.error(
        `[inquiry-reminder] Failed to send admin email: ${(err as Error)?.message || err}`,
      );
      baseResult.skippedReason =
        'Email send failed; enquiries were not marked reminded';
      return baseResult;
    }

    if (!delivered) {
      baseResult.skippedReason =
        'Email send failed; enquiries were not marked reminded';
      this.logger.warn('[inquiry-reminder] EmailService returned false');
      return baseResult;
    }

    baseResult.emailSent = true;

    const remindedAt = new Date();
    const updateRes = await this.contactMessageModel
      .updateMany(
        { _id: { $in: ids } },
        {
          $set: {
            isReminded: true,
            remindedAt,
          },
        },
      )
      .exec();

    baseResult.markedReminded = Number(updateRes.modifiedCount ?? 0);
    this.logger.log(
      `[inquiry-reminder] Sent reminder for ${ids.length} enquiries (contact=${contactCount}, product=${productCount}); marked ${baseResult.markedReminded}`,
    );
    return baseResult;
  }

  private buildEmailHtml(params: {
    total: number;
    contactCount: number;
    productCount: number;
    asOfIso: string;
    adminPortalBase: string;
  }): string {
    const contactsUrl = params.adminPortalBase
      ? `${params.adminPortalBase.replace(/\/$/, '')}/dashboard/contacts`
      : '';
    const productsUrl = params.adminPortalBase
      ? `${params.adminPortalBase.replace(/\/$/, '')}/dashboard/product-inquiries`
      : '';

    const linksHtml =
      contactsUrl || productsUrl
        ? `<p>
            ${contactsUrl ? `<a href="${contactsUrl}" style="color:#16a34a;">Open Contact Enquiries</a>` : ''}
            ${contactsUrl && productsUrl ? ' · ' : ''}
            ${productsUrl ? `<a href="${productsUrl}" style="color:#16a34a;">Open Product Enquiries</a>` : ''}
          </p>`
        : '';

    return `
      <p>Hello Admin,</p>
      <p>
        There ${params.total === 1 ? 'is' : 'are'}
        <strong>${params.total}</strong> unacknowledged enquir${params.total === 1 ? 'y' : 'ies'}
        that ${params.total === 1 ? 'was' : 'were'} submitted at least
        <strong>${INQUIRY_REMINDER_AGE_DAYS} days</strong> ago and ${params.total === 1 ? 'has' : 'have'} not been reminded yet.
      </p>
      <div style="background:#f9fafb; padding:16px; border-radius:8px; border-left:4px solid #16a34a; margin:16px 0;">
        <p style="margin:5px 0;"><strong>Total pending:</strong> ${params.total}</p>
        <p style="margin:5px 0;"><strong>Contact enquiries:</strong> ${params.contactCount}</p>
        <p style="margin:5px 0;"><strong>Product enquiries:</strong> ${params.productCount}</p>
        <p style="margin:5px 0;"><strong>As of (IST):</strong> ${params.asOfIso}</p>
      </div>
      ${linksHtml}
      <p>Please review and acknowledge these enquiries in the admin portal.</p>
      <p>Best regards,<br>The GreenPro System</p>
    `;
  }

  private buildEmailText(params: {
    total: number;
    contactCount: number;
    productCount: number;
    asOfIso: string;
    adminPortalBase: string;
  }): string {
    const contactsUrl = params.adminPortalBase
      ? `${params.adminPortalBase.replace(/\/$/, '')}/dashboard/contacts`
      : '';
    const productsUrl = params.adminPortalBase
      ? `${params.adminPortalBase.replace(/\/$/, '')}/dashboard/product-inquiries`
      : '';

    return `
Hello Admin,

There ${params.total === 1 ? 'is' : 'are'} ${params.total} unacknowledged enquir${params.total === 1 ? 'y' : 'ies'} submitted at least ${INQUIRY_REMINDER_AGE_DAYS} days ago that ${params.total === 1 ? 'has' : 'have'} not been reminded yet.

Total pending: ${params.total}
Contact enquiries: ${params.contactCount}
Product enquiries: ${params.productCount}
As of (IST): ${params.asOfIso}
${contactsUrl ? `\nContact Enquiries: ${contactsUrl}` : ''}
${productsUrl ? `\nProduct Enquiries: ${productsUrl}` : ''}

Please review and acknowledge these enquiries in the admin portal.

Best regards,
The GreenPro System
    `.trim();
  }
}
