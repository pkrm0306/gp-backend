import { Injectable, Logger } from '@nestjs/common';
import { NotificationHelper } from './notification.helper';
import {
  NotificationChannel,
  NotificationTemplateCode,
} from './interfaces/notification.types';
import { NotificationRecipientService } from './helpers/notification-recipient.service';
import { AdminSystemNotificationService } from './helpers/admin-system-notification.service';
import {
  AdminNotificationMessages,
  resolveManufacturerDisplayName,
} from './helpers/admin-notification-messages';
import { NotificationCcGroup } from './utils/notification-recipient-groups.util';

@Injectable()
export class LifecycleNotificationService {
  private readonly logger = new Logger(LifecycleNotificationService.name);

  constructor(
    private readonly notificationHelper: NotificationHelper,
    private readonly recipientService: NotificationRecipientService,
    private readonly adminSystemNotification: AdminSystemNotificationService,
  ) {}

  private manufacturerLabelFromRecipient(
    recipient: {
      companyName?: string;
      vendorName?: string;
      email?: string;
    } | null,
    fallback?: string,
  ): string {
    return (
      resolveManufacturerDisplayName({
        manufacturerName: recipient?.companyName,
        companyName: recipient?.companyName,
        contactName: recipient?.vendorName,
        email: recipient?.email,
      }) ||
      fallback ||
      'Manufacturer'
    );
  }

  private escapeHtml(input: string): string {
    return String(input ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private async notifyAdminFeedAndEmail(input: {
    copy: { title: string; message: string; actorName: string };
    referenceType: string;
    referenceId?: string;
    type?: string;
    source?: string;
    emailSubject?: string;
    emailHtmlExtra?: string;
    ccGroups?: NotificationCcGroup[];
  }): Promise<void> {
    await this.adminSystemNotification.createFeedNotification({
      title: input.copy.title,
      message: input.copy.message,
      type: input.type ?? 'info',
      source: input.source ?? 'manufacturer',
      referenceType: input.referenceType,
      referenceId: input.referenceId,
      actorName: input.copy.actorName,
      emailSubject: input.emailSubject ?? `GreenPro — ${input.copy.title}`,
      emailHtmlExtra: input.emailHtmlExtra ?? `<p>${input.copy.message}</p>`,
      ccGroups: input.ccGroups,
    });
  }

  /** Email + in-app when `userId` is present. Sign-up/OTP must not use this helper. */
  private vendorNotifyChannels(userId?: string): NotificationChannel[] {
    return userId?.trim()
      ? [NotificationChannel.EMAIL, NotificationChannel.IN_APP]
      : [NotificationChannel.EMAIL];
  }

  private sendVendorNotificationInBackground(
    recipient: {
      userId?: string;
      email?: string;
      companyName?: string;
      vendorName?: string;
    } | null,
    template: NotificationTemplateCode,
    payload: Record<string, unknown>,
    logContext?: string,
  ): void {
    const email = recipient?.email?.trim();
    const userId = recipient?.userId?.trim();
    if (!email && !userId) {
      if (logContext) {
        this.logger.warn(
          `[sendVendorNotificationInBackground] Skipping ${template} — no vendor email/userId (${logContext})`,
        );
      }
      return;
    }
    if (!email) {
      if (logContext) {
        this.logger.warn(
          `[sendVendorNotificationInBackground] ${template} — email missing; sending in-app only (${logContext})`,
        );
      }
    }
    const manufacturerName = this.manufacturerLabelFromRecipient(recipient);
    this.notificationHelper
      .send({
        type: this.vendorNotifyChannels(userId),
        template,
        userId,
        email,
        payload: { manufacturerName, vendorName: manufacturerName, ...payload },
      })
      .then((result) => {
        const failed = result.results.filter((r) => !r.success && !r.skipped);
        if (failed.length > 0) {
          this.logger.warn(
            `[sendVendorEmailInBackground] ${template} SMTP failed for ${email}` +
              (logContext ? ` (${logContext})` : '') +
              `: ${failed.map((f) => f.error).join('; ')}`,
          );
        } else {
          this.logger.log(
            `[sendVendorEmailInBackground] ${template} sent via SMTP to ${email}` +
              (logContext ? ` (${logContext})` : ''),
          );
        }
      })
      .catch((error) => {
        this.logger.warn(
          `[sendVendorEmailInBackground] ${template} failed for ${email}` +
            (logContext ? ` (${logContext})` : '') +
            `: ${(error as Error)?.message || error}`,
        );
      });
  }

  /** Welcome email only. Admin bell feed is created after OTP verify. */
  async notifyNewVendorRegistered(params: {
    userId: string;
    email: string;
    name: string;
    companyName: string;
    password: string;
    otp: string;
  }): Promise<void> {
    const manufacturerName = resolveManufacturerDisplayName({
      manufacturerName: params.companyName,
      companyName: params.companyName,
      contactName: params.name,
      email: params.email,
    });

    const notifyResult = await this.notificationHelper.send({
      type: [NotificationChannel.EMAIL],
      template: NotificationTemplateCode.USER_CREATED,
      userId: params.userId,
      email: params.email,
      payload: {
        name: params.name,
        manufacturerName,
        email: params.email,
        password: params.password,
        otp: params.otp,
      },
    });

    const emailResult = notifyResult.results.find(
      (r) => r.channel === NotificationChannel.EMAIL,
    );
    if (emailResult?.success) {
      this.logger.log(
        `[notifyNewVendorRegistered] email ok for ${params.email}`,
      );
      await this.notifyAdminFeedAndEmail({
        copy: AdminNotificationMessages.vendorRegistrationOtpSent(
          manufacturerName,
          params.email,
        ),
        referenceType: 'vendor_registration_otp',
        referenceId: params.userId,
        type: 'info',
        emailSubject: `GreenPro — Vendor registration OTP sent — ${manufacturerName}`,
        emailHtmlExtra: `<p>Registration OTP email was sent to <strong>${this.escapeHtml(params.email)}</strong> for <strong>${this.escapeHtml(manufacturerName)}</strong>.</p>`,
        ccGroups: ['SHEshi'],
      });
      return;
    }

    const error =
      emailResult?.error ||
      notifyResult.results.map((r) => r.error).filter(Boolean).join('; ') ||
      'Registration welcome email failed';
    this.logger.error(
      `[notifyNewVendorRegistered] email failed for ${params.email}: ${error}`,
    );
    // Surface failure so /auth/register-vendor can log + user can use Resend OTP.
    throw new Error(error);
  }

  async notifyVendorOtpResent(params: {
    userId: string;
    email: string;
    name: string;
    otp: string;
    expiresInMinutes: number;
  }): Promise<void> {
    const notifyResult = await this.notificationHelper.send({
      type: [NotificationChannel.EMAIL],
      template: NotificationTemplateCode.OTP_VERIFICATION,
      userId: params.userId,
      email: params.email,
      payload: {
        name: params.name,
        otp: params.otp,
        expiresInMinutes: params.expiresInMinutes,
      },
    });

    for (const r of notifyResult.results) {
      if (r.success) {
        this.logger.log(
          `[notifyVendorOtpResent] ${r.channel} ok for ${params.email}`,
        );
      } else if (!r.skipped) {
        this.logger.warn(
          `[notifyVendorOtpResent] ${r.channel} failed for ${params.email}: ${r.error}`,
        );
        throw new Error(r.error || 'OTP email send failed');
      }
    }

    const manufacturerName = resolveManufacturerDisplayName({
      contactName: params.name,
      email: params.email,
    });
    await this.notifyAdminFeedAndEmail({
      copy: AdminNotificationMessages.vendorOtpResent(
        manufacturerName,
        params.email,
      ),
      referenceType: 'vendor_otp_resent',
      referenceId: params.userId,
      type: 'info',
      emailSubject: `GreenPro — Vendor OTP resent — ${manufacturerName}`,
      emailHtmlExtra: `<p>Verification OTP was resent to <strong>${this.escapeHtml(params.email)}</strong> for <strong>${this.escapeHtml(manufacturerName)}</strong>.</p>`,
      ccGroups: ['SHEshi'],
    });
  }

  async notifyVendorRegistrationComplete(
    userId: string,
    email: string,
    manufacturerName: string,
  ): Promise<void> {
    const label = resolveManufacturerDisplayName({ manufacturerName, email });

    const notifyResult = await this.notificationHelper.send({
      type: this.vendorNotifyChannels(userId),
      template: NotificationTemplateCode.VENDOR_REGISTRATION_COMPLETE,
      userId,
      email,
      payload: { manufacturerName: label, vendorName: label, email },
    });

    for (const r of notifyResult.results) {
      if (r.success) {
        this.logger.log(
          `[notifyVendorRegistrationComplete] ${r.channel} ok for ${email}`,
        );
      } else if (!r.skipped) {
        this.logger.warn(
          `[notifyVendorRegistrationComplete] ${r.channel} failed for ${email}: ${r.error}`,
        );
      }
    }

    const completeCopy = AdminNotificationMessages.registrationComplete(label);
    await this.notifyAdminFeedAndEmail({
      copy: completeCopy,
      referenceType: 'vendor_registration',
      referenceId: userId,
      type: 'success',
      emailSubject: `GreenPro — ${completeCopy.title}`,
      emailHtmlExtra: `<p>${this.escapeHtml(completeCopy.message)}</p>`,
      ccGroups: ['SHEshi'],
    });
  }

  async notifyDocumentUploaded(params: {
    manufacturerId: string;
    urnNo?: string;
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    const manufacturerName = this.manufacturerLabelFromRecipient(recipient);
    const copy = AdminNotificationMessages.documentUploaded(manufacturerName);
    await this.notifyAdminFeedAndEmail({
      copy,
      referenceType: 'document_uploaded',
      referenceId: params.urnNo || params.manufacturerId,
      type: 'info',
      ccGroups: ['TEAM_LEADS'],
    });
  }

  async notifyUrnInitialApproved(params: {
    manufacturerId: string;
    urnNo: string;
    productName?: string;
    approvedBy?: string;
    vendorEmail?: string;
    manufacturerName?: string;
  }): Promise<void> {
    let recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    if (!recipient?.email && params.vendorEmail?.trim()) {
      recipient = {
        email: params.vendorEmail.trim().toLowerCase(),
        companyName: params.manufacturerName,
        vendorName: params.manufacturerName,
      };
    }
    const manufacturerName =
      params.manufacturerName ??
      this.manufacturerLabelFromRecipient(recipient);
    const productName = params.productName ?? params.urnNo;
    this.sendVendorNotificationInBackground(
      recipient,
      NotificationTemplateCode.URN_INITIAL_APPROVED,
      {
        urnNo: params.urnNo,
        productName,
        approvedBy: params.approvedBy ?? 'GreenPro Admin',
      },
      `notifyUrnInitialApproved manufacturerId=${params.manufacturerId} urn=${params.urnNo}`,
    );
    await this.notifyAdminFeedAndEmail({
      copy: AdminNotificationMessages.urnInitialApproved(
        manufacturerName,
        params.urnNo,
        productName,
      ),
      referenceType: 'urn_initial_approved',
      referenceId: params.urnNo,
      type: 'success',
      ccGroups: ['TEAM_LEADS'],
    });
  }

  async notifyUrnRegistrationRejected(params: {
    manufacturerId: string;
    urnNo: string;
    productName?: string;
    reason?: string;
    rejectedBy?: string;
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    const reason =
      String(params.reason ?? '').trim() ||
      'Your registration was not approved at the initial review stage.';
    const productName = params.productName ?? params.urnNo;
    this.sendVendorNotificationInBackground(
      recipient,
      NotificationTemplateCode.URN_REGISTRATION_REJECTED,
      {
        urnNo: params.urnNo,
        productName,
        reason,
        rejectedBy: params.rejectedBy ?? 'GreenPro Admin',
      },
      `notifyUrnRegistrationRejected manufacturerId=${params.manufacturerId} urn=${params.urnNo}`,
    );
  }

  async notifyProductRegistered(params: {
    manufacturerId: string;
    urnNo: string;
    productName?: string;
    productNames?: string[];
    /** Optional EOI numbers aligned with productNames (bulk). */
    eoiNos?: string[];
    eoiNo?: string;
    manufacturerName?: string;
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    const manufacturerName =
      params.manufacturerName ??
      this.manufacturerLabelFromRecipient(recipient);
    const productNames = (
      params.productNames?.length
        ? params.productNames
        : params.productName
          ? [params.productName]
          : []
    )
      .map((n) => String(n ?? '').trim())
      .filter(Boolean);
    const eoiNos = (params.eoiNos ?? [])
      .map((n) => String(n ?? '').trim())
      .filter(Boolean);
    const copy = AdminNotificationMessages.productRegistered(
      manufacturerName,
      params.urnNo,
      productNames,
      params.eoiNo,
    );

    const productRowsHtml =
      productNames.length === 0
        ? '<p><em>No product names were provided.</em></p>'
        : `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse; margin:12px 0;">
            <thead>
              <tr>
                <th align="left" style="padding:8px 10px; background:#f3f4f6; border:1px solid #e5e7eb;">#</th>
                <th align="left" style="padding:8px 10px; background:#f3f4f6; border:1px solid #e5e7eb;">Product name</th>
                <th align="left" style="padding:8px 10px; background:#f3f4f6; border:1px solid #e5e7eb;">EOI</th>
              </tr>
            </thead>
            <tbody>
              ${productNames
                .map((name, index) => {
                  const eoi =
                    eoiNos[index] ||
                    (productNames.length === 1 ? params.eoiNo?.trim() || '—' : '—');
                  return `<tr>
                    <td style="padding:8px 10px; border:1px solid #e5e7eb;">${index + 1}</td>
                    <td style="padding:8px 10px; border:1px solid #e5e7eb;">${this.escapeHtml(name)}</td>
                    <td style="padding:8px 10px; border:1px solid #e5e7eb;">${this.escapeHtml(eoi || '—')}</td>
                  </tr>`;
                })
                .join('')}
            </tbody>
          </table>`;

    const subjectNoun =
      productNames.length > 1 ? 'Products registered' : 'Product registered';
    await this.notifyAdminFeedAndEmail({
      copy,
      referenceType: 'product_registered',
      referenceId: params.urnNo,
      type: 'info',
      emailSubject: `GreenPro — ${subjectNoun} by ${manufacturerName}`,
      emailHtmlExtra: `
        <p><strong>Vendor registered</strong> — please review the new product registration in the admin portal.</p>
        <p><strong>Vendor / Manufacturer:</strong> ${this.escapeHtml(manufacturerName)}</p>
        <p><strong>URN:</strong> ${this.escapeHtml(params.urnNo)}</p>
        <p><strong>Product count:</strong> ${productNames.length || 1}</p>
        <p><strong>Product name list:</strong></p>
        ${productRowsHtml}
      `,
      ccGroups: ['TEAM_LEADS'],
    });
  }

  async notifyUrnSubmittedForReview(params: {
    manufacturerId: string;
    urnNo: string;
    productName?: string;
    productNames?: string[];
    eoiNos?: string[];
    manufacturerName?: string;
    vendorEmail?: string;
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    const manufacturerName =
      params.manufacturerName ??
      this.manufacturerLabelFromRecipient(recipient) ??
      'Manufacturer';

    const productNames = (
      params.productNames?.length
        ? params.productNames
        : params.productName
          ? [params.productName]
          : []
    )
      .map((n) => String(n ?? '').trim())
      .filter(Boolean);
    const eoiNos = (params.eoiNos ?? [])
      .map((n) => String(n ?? '').trim())
      .filter(Boolean);

    const copy = AdminNotificationMessages.urnSubmittedForReview(
      manufacturerName,
      params.urnNo,
      productNames,
    );

    const productRowsHtml =
      productNames.length === 0
        ? '<p><em>No product names were listed on this URN.</em></p>'
        : `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse; margin:12px 0;">
            <thead>
              <tr>
                <th align="left" style="padding:8px 10px; background:#f3f4f6; border:1px solid #e5e7eb;">#</th>
                <th align="left" style="padding:8px 10px; background:#f3f4f6; border:1px solid #e5e7eb;">Product name</th>
                <th align="left" style="padding:8px 10px; background:#f3f4f6; border:1px solid #e5e7eb;">EOI</th>
              </tr>
            </thead>
            <tbody>
              ${productNames
                .map((name, index) => {
                  const eoi = eoiNos[index] || '—';
                  return `<tr>
                    <td style="padding:8px 10px; border:1px solid #e5e7eb;">${index + 1}</td>
                    <td style="padding:8px 10px; border:1px solid #e5e7eb;">${this.escapeHtml(name)}</td>
                    <td style="padding:8px 10px; border:1px solid #e5e7eb;">${this.escapeHtml(eoi)}</td>
                  </tr>`;
                })
                .join('')}
            </tbody>
          </table>`;

    // Admin-only: vendor already knows they submitted; alert ops with URN details.
    await this.notifyAdminFeedAndEmail({
      copy,
      referenceType: 'urn_submitted_for_review',
      referenceId: params.urnNo,
      type: 'info',
      emailSubject: `GreenPro — Vendor sent URN ${params.urnNo} for review`,
      emailHtmlExtra: `
        <p><strong>Vendor sent this URN for review.</strong></p>
        <p>Please open the admin portal and review the submitted URN details.</p>
        <p><strong>Vendor / Manufacturer:</strong> ${this.escapeHtml(manufacturerName)}</p>
        <p><strong>URN:</strong> ${this.escapeHtml(params.urnNo)}</p>
        <p><strong>Product count:</strong> ${productNames.length || 0}</p>
        <p><strong>Products under this URN:</strong></p>
        ${productRowsHtml}
      `,
      ccGroups: ['TEAM_LEADS'],
    });
  }

  async notifyCertificationPaymentSubmitted(params: {
    manufacturerId: string;
    urnNo: string;
    paymentId: number | string;
    quoteTotal?: number | string;
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    if (!recipient?.email && !recipient?.userId) {
      return;
    }
    const manufacturerName = this.manufacturerLabelFromRecipient(recipient);

    this.notificationHelper.sendInBackground({
      type: this.vendorNotifyChannels(recipient.userId),
      template: NotificationTemplateCode.CERTIFICATION_PAYMENT_SUBMITTED,
      userId: recipient.userId,
      email: recipient.email,
      payload: {
        urnNo: params.urnNo,
        paymentId: String(params.paymentId),
        quoteTotal: String(params.quoteTotal ?? ''),
        manufacturerName,
        vendorName: manufacturerName,
      },
      async: true,
    });

    const copy =
      AdminNotificationMessages.certificationFeeSubmitted(manufacturerName);
    await this.notifyAdminFeedAndEmail({
      copy,
      referenceType: 'certification_payment_submitted',
      referenceId: String(params.paymentId),
      type: 'info',
      emailHtmlExtra: `<p>${this.escapeHtml(copy.message)}</p><p>URN: <strong>${this.escapeHtml(params.urnNo)}</strong></p>`,
      ccGroups: ['TEAM_LEADS'],
    });
  }

  async notifyCertificationPaymentApproved(params: {
    manufacturerId: string;
    urnNo: string;
    paymentId: number | string;
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    if (!recipient?.email && !recipient?.userId) {
      return;
    }
    const manufacturerName = this.manufacturerLabelFromRecipient(recipient);
    this.sendVendorNotificationInBackground(
      recipient,
      NotificationTemplateCode.CERTIFICATION_PAYMENT_APPROVED,
      {
        urnNo: params.urnNo,
        paymentId: String(params.paymentId),
      },
    );

    const copy = AdminNotificationMessages.certificationFeeApproved(
      manufacturerName,
      params.urnNo,
    );
    await this.notifyAdminFeedAndEmail({
      copy,
      referenceType: 'certification_payment_approved',
      referenceId: String(params.paymentId),
      type: 'success',
      ccGroups: ['TEAM_LEADS'],
    });
  }

  async notifyManufacturerApproved(
    manufacturerId: string,
    context?: { manufacturerName?: string; vendorEmail?: string },
  ): Promise<void> {
    let recipient =
      await this.recipientService.resolveByManufacturerId(manufacturerId);
    if (!recipient?.email && !recipient?.userId && context?.vendorEmail) {
      recipient = {
        email: context.vendorEmail.trim().toLowerCase(),
        companyName: context.manufacturerName,
        vendorName: context.manufacturerName,
      };
    }
    const name =
      this.manufacturerLabelFromRecipient(recipient) ||
      context?.manufacturerName ||
      'Manufacturer';
    this.sendVendorNotificationInBackground(
      recipient,
      NotificationTemplateCode.MANUFACTURER_APPROVED,
      {},
    );
    await this.notifyAdminFeedAndEmail({
      copy: AdminNotificationMessages.manufacturerApproved(name),
      referenceType: 'manufacturer_approved',
      referenceId: manufacturerId,
      type: 'success',
      emailSubject: `GreenPro — Manufacturer verified — ${name}`,
      emailHtmlExtra: `<p><strong>${name}</strong> has been verified and activated on the GreenPro portal.</p>`,
      ccGroups: ['SHEshi'],
    });
  }

  async notifyManufacturerInactive(manufacturerId: string): Promise<void> {
    const recipient =
      await this.recipientService.resolveByManufacturerId(manufacturerId);
    const name = this.manufacturerLabelFromRecipient(recipient);
    this.sendVendorNotificationInBackground(
      recipient,
      NotificationTemplateCode.MANUFACTURER_INACTIVE,
      {},
    );
    await this.notifyAdminFeedAndEmail({
      copy: AdminNotificationMessages.manufacturerInactive(name),
      referenceType: 'manufacturer_inactive',
      referenceId: manufacturerId,
      type: 'warning',
      ccGroups: ['SHEshi'],
    });
  }

  async notifyManufacturerRejected(
    manufacturerName: string,
    manufacturerId?: string,
    options?: { vendorEmail?: string },
  ): Promise<void> {
    const label = manufacturerName?.trim() || 'Manufacturer';
    const vendorEmail = options?.vendorEmail?.trim().toLowerCase();
    if (vendorEmail) {
      this.sendVendorNotificationInBackground(
        {
          email: vendorEmail,
          companyName: label,
          vendorName: label,
        },
        NotificationTemplateCode.MANUFACTURER_REJECTED,
        { manufacturerName: label },
        `notifyManufacturerRejected manufacturerId=${manufacturerId ?? ''}`,
      );
    } else {
      this.logger.warn(
        `[notifyManufacturerRejected] Skipping vendor email — no vendorEmail for manufacturerId=${manufacturerId ?? ''}`,
      );
    }
    await this.notifyAdminFeedAndEmail({
      copy: AdminNotificationMessages.manufacturerRejected(label),
      referenceType: 'manufacturer_rejected',
      referenceId: manufacturerId,
      type: 'warning',
      ccGroups: ['SHEshi'],
    });
  }

  async notifyPaymentProposalReady(params: {
    manufacturerId: string;
    urnNo: string;
    paymentId: number | string;
    paymentType: 'registration' | 'certification' | 'renew';
    quoteTotal?: number | string;
    vendorEmail?: string;
    manufacturerName?: string;
  }): Promise<void> {
    let recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    if (!recipient?.email && params.vendorEmail) {
      recipient = {
        email: params.vendorEmail.trim().toLowerCase(),
        companyName: params.manufacturerName,
        vendorName: params.manufacturerName,
      };
    }
    const paymentTypeLabel =
      params.paymentType === 'certification'
        ? 'Certification fee'
        : params.paymentType === 'renew'
          ? 'Renewal fee'
          : 'Registration fee';
    const manufacturerName =
      params.manufacturerName ??
      this.manufacturerLabelFromRecipient(recipient);
    this.sendVendorNotificationInBackground(
      recipient,
      NotificationTemplateCode.PAYMENT_PROPOSAL_READY,
      {
        urnNo: params.urnNo,
        paymentId: String(params.paymentId),
        paymentTypeLabel,
        quoteTotal: String(params.quoteTotal ?? ''),
      },
      `notifyPaymentProposalReady manufacturerId=${params.manufacturerId} urn=${params.urnNo}`,
    );
    await this.notifyAdminFeedAndEmail({
      copy: AdminNotificationMessages.paymentProposalReady(
        manufacturerName,
        params.urnNo,
        paymentTypeLabel,
        String(params.paymentId),
      ),
      referenceType: `payment_proposal_${params.paymentType}`,
      referenceId: String(params.paymentId),
      type: 'info',
      ccGroups: ['TEAM_LEADS'],
    });
  }

  async notifyProductCertified(params: {
    manufacturerId: string;
    urnNo: string;
    productName: string;
    approvedBy?: string;
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    const manufacturerName = this.manufacturerLabelFromRecipient(recipient);
    this.sendVendorNotificationInBackground(
      recipient,
      NotificationTemplateCode.PRODUCT_APPROVED,
      {
        urnNo: params.urnNo,
        productName: params.productName,
        approvedBy: params.approvedBy ?? 'GreenPro Admin',
      },
    );
    await this.notifyAdminFeedAndEmail({
      copy: AdminNotificationMessages.productCertified(
        manufacturerName,
        params.urnNo,
        params.productName,
      ),
      referenceType: 'product_certified',
      referenceId: params.urnNo,
      type: 'success',
      ccGroups: ['TEAM_LEADS'],
    });
  }

  async notifyProductRejected(params: {
    manufacturerId: string;
    urnNo: string;
    productName: string;
    reason?: string;
    rejectedBy?: string;
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    this.sendVendorNotificationInBackground(
      recipient,
      NotificationTemplateCode.PRODUCT_REJECTED,
      {
        urnNo: params.urnNo,
        productName: params.productName,
        reason: params.reason ?? 'Not approved',
        rejectedBy: params.rejectedBy ?? 'GreenPro Admin',
      },
      `notifyProductRejected manufacturerId=${params.manufacturerId} urn=${params.urnNo}`,
    );
  }

  async notifyProductNameChangeDecision(params: {
    manufacturerId: string;
    requestId?: string;
    email?: string;
    urnNo: string;
    eoiNo?: string;
    currentName: string;
    requestedName: string;
    decision: 'approved' | 'rejected';
    manufacturerName?: string;
    remarks?: string;
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    const manufacturerName =
      params.manufacturerName ||
      this.manufacturerLabelFromRecipient(recipient);
    const email = params.email?.trim() || recipient?.email;
    const userId = recipient?.userId;
    if (email || userId) {
      const decisionLabel =
        params.decision === 'approved' ? 'Approved' : 'Rejected';
      const decisionDetail =
        params.decision === 'approved'
          ? `Updated Product Name: ${params.requestedName}`
          : `Product Name (unchanged): ${params.currentName}`;
      const remarksBlock =
        params.decision === 'rejected' && params.remarks?.trim()
          ? `Admin Remarks: ${params.remarks.trim()}`
          : '';
      this.notificationHelper.sendInBackground({
        type: this.vendorNotifyChannels(userId),
        template: NotificationTemplateCode.PRODUCT_NAME_CHANGE_DECISION,
        userId,
        email,
        payload: {
          manufacturerName,
          urnNo: params.urnNo,
          eoiNo: params.eoiNo ?? '',
          currentName: params.currentName,
          requestedName: params.requestedName,
          decisionLabel,
          decisionDetail,
          remarksBlock,
        },
        async: true,
      });
    }
    const copy = AdminNotificationMessages.productNameChangeDecision(
      manufacturerName,
      params.urnNo,
      params.currentName,
      params.requestedName,
      params.decision,
    );
    const remarksLine = params.remarks?.trim()
      ? `<p><strong>Remarks:</strong> ${this.escapeHtml(params.remarks.trim())}</p>`
      : '';
    const eoiLine = params.eoiNo?.trim()
      ? `<p><strong>EOI:</strong> ${this.escapeHtml(params.eoiNo.trim())}</p>`
      : '';
    await this.notifyAdminFeedAndEmail({
      copy,
      referenceType: 'product_name_change_decision',
      referenceId: params.requestId ?? params.urnNo,
      type: params.decision === 'approved' ? 'success' : 'warning',
      emailSubject: `GreenPro — ${copy.title}`,
      emailHtmlExtra: `
        <p>${this.escapeHtml(copy.message)}</p>
        ${eoiLine}
        <p><strong>Decision:</strong> ${params.decision}</p>
        ${remarksLine}
      `,
      ccGroups: ['SHEshi'],
    });
  }

  async notifyProductNameChangeRequested(params: {
    manufacturerId: string;
    requestId: string;
    urnNo: string;
    eoiNo?: string;
    currentName: string;
    requestedName: string;
    reason?: string;
    manufacturerName?: string;
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    const manufacturerName =
      params.manufacturerName ||
      this.manufacturerLabelFromRecipient(recipient);
    const copy = AdminNotificationMessages.productNameChangeRequested(
      manufacturerName,
      params.urnNo,
      params.currentName,
      params.requestedName,
      params.reason,
    );
    const eoiLine = params.eoiNo?.trim()
      ? `<p><strong>EOI:</strong> ${this.escapeHtml(params.eoiNo.trim())}</p>`
      : '';
    const reasonLine = params.reason?.trim()
      ? `<p><strong>Reason:</strong> ${this.escapeHtml(params.reason.trim())}</p>`
      : '';
    await this.notifyAdminFeedAndEmail({
      copy,
      referenceType: 'product_name_change_request',
      referenceId: params.requestId,
      type: 'info',
      emailSubject: `GreenPro — Product Name Change Request from ${manufacturerName}`,
      emailHtmlExtra: `
        <p>${this.escapeHtml(copy.message)}</p>
        ${eoiLine}
        <p><strong>Current name:</strong> ${this.escapeHtml(params.currentName)}</p>
        <p><strong>Requested name:</strong> ${this.escapeHtml(params.requestedName)}</p>
        ${reasonLine}
        <p>Please review this request in the admin portal.</p>
      `,
      ccGroups: ['SHEshi'],
    });
  }

  async notifyProductEnquiry(params: {
    manufacturerId: string;
    manufacturerName: string;
    vendorEmail: string;
    visitorName: string;
    visitorEmail: string;
    visitorPhone: string;
    visitorMessage?: string;
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    const manufacturerName =
      params.manufacturerName ||
      this.manufacturerLabelFromRecipient(recipient);
    const email = params.vendorEmail || recipient?.email;
    if (email) {
      this.notificationHelper.sendInBackground({
        type: this.vendorNotifyChannels(recipient?.userId),
        template: NotificationTemplateCode.PRODUCT_ENQUIRY_VENDOR,
        userId: recipient?.userId,
        email,
        payload: {
          manufacturerName,
          visitorName: params.visitorName,
          visitorEmail: params.visitorEmail,
          visitorPhone: params.visitorPhone,
          visitorMessage: params.visitorMessage ?? '',
        },
        async: true,
      });
    }
    const copy = AdminNotificationMessages.productEnquiry(
      manufacturerName,
      params.visitorName,
    );
    await this.notifyAdminFeedAndEmail({
      copy,
      referenceType: 'manufacturer_inquiry',
      referenceId: params.manufacturerId,
      source: 'website',
      type: 'info',
      emailHtmlExtra: `<p>${copy.message}</p><p>From: ${params.visitorName} (${params.visitorEmail})</p>`,
      ccGroups: ['SHEshi'],
    });
  }

  async notifyCertificationExpiryAdmin(params: {
    manufacturerName: string;
    urnNo: string;
    eoiNo: string;
    stage: '60-day' | 'weekly' | 'deactivation';
    productId?: number;
    includeAdminEmail?: boolean;
  }): Promise<void> {
    const stageLabel =
      params.stage === '60-day'
        ? '60-day expiry'
        : params.stage === 'weekly'
          ? 'Weekly expiry'
          : 'Deactivation';
    const copy = AdminNotificationMessages.certificationExpiryReminder(
      params.manufacturerName,
      params.urnNo,
      params.eoiNo,
      stageLabel,
    );
    await this.notifyAdminFeedAndEmail({
      copy,
      referenceType: `certification_expiry_${params.stage}`,
      referenceId: params.productId
        ? String(params.productId)
        : params.urnNo,
      type: params.stage === 'deactivation' ? 'warning' : 'info',
      ccGroups: ['SHEshi'],
    });
  }

  async notifyPasswordResetAdmin(params: {
    email: string;
    portal?: 'admin' | 'vendor';
    userId?: string;
  }): Promise<void> {
    const copy = AdminNotificationMessages.passwordReset(
      params.email,
      params.portal,
    );
    await this.notifyAdminFeedAndEmail({
      copy,
      referenceType: 'password_reset',
      referenceId: params.userId,
      source: params.portal === 'admin' ? 'admin' : 'manufacturer',
      type: 'info',
      emailSubject: `GreenPro — ${copy.title}`,
      emailHtmlExtra: `<p>${this.escapeHtml(copy.message)}</p>`,
      ccGroups: ['SHEshi'],
    });
  }

  async notifyUrnMerged(params: {
    manufacturerId: string;
    sourceUrnNo: string;
    targetUrnNo: string;
    movedCount: number;
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    const manufacturerName = this.manufacturerLabelFromRecipient(recipient);
    this.sendVendorNotificationInBackground(recipient, NotificationTemplateCode.URN_MERGED, {
      sourceUrnNo: params.sourceUrnNo,
      targetUrnNo: params.targetUrnNo,
      movedCount: String(params.movedCount),
    });
    await this.notifyAdminFeedAndEmail({
      copy: AdminNotificationMessages.urnMerged(
        manufacturerName,
        params.sourceUrnNo,
        params.targetUrnNo,
        params.movedCount,
      ),
      referenceType: 'urn_merge',
      referenceId: params.targetUrnNo,
      type: 'info',
      ccGroups: ['TEAM_LEADS'],
    });
  }

  async notifyPlantMerged(params: {
    manufacturerId: string;
    urnNo: string;
    eoiNo?: string;
    productName?: string;
    mergeSummary: string;
    vendorEmail?: string;
    manufacturerName?: string;
  }): Promise<void> {
    let recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    if (!recipient?.email && params.vendorEmail?.trim()) {
      recipient = {
        email: params.vendorEmail.trim().toLowerCase(),
        companyName: params.manufacturerName,
        vendorName: params.manufacturerName,
      };
    }
    const eoiNo = params.eoiNo?.trim() ?? '';
    this.sendVendorNotificationInBackground(
      recipient,
      NotificationTemplateCode.PLANT_MERGED,
      {
        urnNo: params.urnNo,
        eoiNo,
        eoiSuffix: eoiNo ? ` (EOI ${eoiNo})` : '',
        productName: params.productName ?? params.urnNo,
        mergeSummary: params.mergeSummary,
      },
      `notifyPlantMerged manufacturerId=${params.manufacturerId} urn=${params.urnNo}`,
    );
    const manufacturerName =
      params.manufacturerName ??
      this.manufacturerLabelFromRecipient(recipient);
    await this.notifyAdminFeedAndEmail({
      copy: AdminNotificationMessages.plantMerged(
        manufacturerName,
        params.urnNo,
        params.mergeSummary,
      ),
      referenceType: 'plant_merge',
      referenceId: params.urnNo,
      type: 'info',
      ccGroups: ['TEAM_LEADS'],
    });
  }

  async notifyRenewalSubmitted(params: {
    manufacturerId: string;
    urnNo: string;
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    const manufacturerName = this.manufacturerLabelFromRecipient(recipient);
    this.sendVendorNotificationInBackground(
      recipient,
      NotificationTemplateCode.RENEWAL_SUBMITTED,
      { urnNo: params.urnNo },
    );
    await this.notifyAdminFeedAndEmail({
      copy: AdminNotificationMessages.renewalSubmitted(
        manufacturerName,
        params.urnNo,
      ),
      referenceType: 'renewal_submitted',
      referenceId: params.urnNo,
      type: 'info',
      ccGroups: ['TEAM_LEADS'],
    });
  }

  async notifyRenewalDecision(params: {
    manufacturerId: string;
    urnNo: string;
    decision: 'approved' | 'sent_back';
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    const manufacturerName = this.manufacturerLabelFromRecipient(recipient);
    const decisionMessage =
      params.decision === 'approved'
        ? 'Your renewal has been approved for final review.'
        : 'Your renewal forms were sent back for corrections. Please update and resubmit.';
    this.sendVendorNotificationInBackground(
      recipient,
      NotificationTemplateCode.RENEWAL_DECISION,
      { urnNo: params.urnNo, decisionMessage },
    );
    await this.notifyAdminFeedAndEmail({
      copy: AdminNotificationMessages.renewalDecision(
        manufacturerName,
        params.urnNo,
        params.decision,
      ),
      referenceType: 'renewal_decision',
      referenceId: params.urnNo,
      type: params.decision === 'approved' ? 'success' : 'warning',
      ccGroups: ['TEAM_LEADS'],
    });
  }

  async notifyRenewalCompleted(params: {
    manufacturerId: string;
    urnNo: string;
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    const manufacturerName = this.manufacturerLabelFromRecipient(recipient);
    this.sendVendorNotificationInBackground(
      recipient,
      NotificationTemplateCode.RENEWAL_COMPLETED,
      { urnNo: params.urnNo },
    );
    await this.notifyAdminFeedAndEmail({
      copy: AdminNotificationMessages.renewalCompleted(
        manufacturerName,
        params.urnNo,
      ),
      referenceType: 'renewal_completed',
      referenceId: params.urnNo,
      type: 'success',
      ccGroups: ['TEAM_LEADS'],
    });
  }

  /**
   * In-app only for certification expiry emails that use custom HTML via cron.
   * Cron still owns the email body; this creates the matching vendor bell row.
   */
  notifyVendorCertificationExpiryInApp(params: {
    manufacturerId: string;
    productName: string;
    eoiNo: string;
    reminderStage: string;
    vendorEmail?: string;
    manufacturerName?: string;
  }): void {
    void this.recipientService
      .resolveByManufacturerId(params.manufacturerId)
      .then((recipient) => {
        const userId = recipient?.userId?.trim();
        if (!userId) {
          this.logger.warn(
            `[notifyVendorCertificationExpiryInApp] Skipping — no userId for manufacturer=${params.manufacturerId}`,
          );
          return;
        }
        const manufacturerName =
          params.manufacturerName ||
          this.manufacturerLabelFromRecipient(recipient);
        this.notificationHelper.sendInBackground({
          type: [NotificationChannel.IN_APP],
          template: NotificationTemplateCode.CERTIFICATION_EXPIRY_REMINDER,
          userId,
          email: recipient?.email ?? params.vendorEmail,
          payload: {
            manufacturerName,
            productName: params.productName,
            eoiNo: params.eoiNo,
            reminderStage: params.reminderStage,
          },
          async: true,
        });
      })
      .catch((err) =>
        this.logger.warn(
          `[notifyVendorCertificationExpiryInApp] failed: ${(err as Error).message}`,
        ),
      );
  }

  async notifyGrievanceCreated(params: {
    manufacturerId: string;
    grievanceId: string;
    grievanceNo: string;
    subject: string;
    category?: string;
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    const manufacturerName = this.manufacturerLabelFromRecipient(recipient);
    const copy = AdminNotificationMessages.grievanceCreated(
      manufacturerName,
      params.grievanceNo,
      params.subject,
      params.category,
    );
    await this.notifyAdminFeedAndEmail({
      copy,
      referenceType: 'grievance',
      referenceId: params.grievanceId,
      type: 'info',
      source: 'manufacturer',
      emailSubject: `GreenPro — Grievance ${params.grievanceNo} from ${manufacturerName}`,
      emailHtmlExtra: `
        <p>${this.escapeHtml(copy.message)}</p>
        <p><strong>Grievance No:</strong> ${this.escapeHtml(params.grievanceNo)}</p>
        <p><strong>Subject:</strong> ${this.escapeHtml(params.subject)}</p>
        ${
          params.category?.trim()
            ? `<p><strong>Category:</strong> ${this.escapeHtml(params.category.trim())}</p>`
            : ''
        }
        <p>Please review this grievance in the admin portal.</p>
      `,
    });
  }

  /** Vendor notification when admin saves a response. */
  async notifyGrievanceResponded(params: {
    manufacturerId: string;
    grievanceNo: string;
    subject: string;
    category?: string;
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    this.sendVendorNotificationInBackground(
      recipient,
      NotificationTemplateCode.GRIEVANCE_RESPONDED,
      {
        grievanceNo: params.grievanceNo,
        subject: params.subject,
        category: params.category?.trim() || '—',
      },
      `grievance=${params.grievanceNo}`,
    );
  }

  /** Vendor notification when a grievance is closed. */
  async notifyGrievanceClosed(params: {
    manufacturerId: string;
    grievanceNo: string;
    subject: string;
    category?: string;
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    this.sendVendorNotificationInBackground(
      recipient,
      NotificationTemplateCode.GRIEVANCE_CLOSED,
      {
        grievanceNo: params.grievanceNo,
        subject: params.subject,
        category: params.category?.trim() || '—',
      },
      `grievance=${params.grievanceNo}`,
    );
  }

  /** Admin feed when a vendor submits an account deletion request. */
  async notifyAccountDeletionRequested(params: {
    manufacturerId: string;
    requestId: string;
    requestNo: string;
    reason: string;
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    const manufacturerName = this.manufacturerLabelFromRecipient(recipient);
    const copy = AdminNotificationMessages.accountDeletionRequested(
      manufacturerName,
      params.requestNo,
      params.reason,
    );
    await this.notifyAdminFeedAndEmail({
      copy,
      referenceType: 'account_deletion',
      referenceId: params.requestId,
      type: 'info',
      source: 'manufacturer',
      emailSubject: `GreenPro — Account deletion ${params.requestNo} from ${manufacturerName}`,
      emailHtmlExtra: `
        <p>${this.escapeHtml(copy.message)}</p>
        <p><strong>Request No:</strong> ${this.escapeHtml(params.requestNo)}</p>
        <p><strong>Reason:</strong> ${this.escapeHtml(params.reason)}</p>
        <p>Please review this request in the admin portal. Do not permanently delete accounts from this workflow alone.</p>
      `,
    });
  }

  async notifyAccountDeletionApproved(params: {
    manufacturerId: string;
    requestNo: string;
    reason: string;
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    this.sendVendorNotificationInBackground(
      recipient,
      NotificationTemplateCode.ACCOUNT_DELETION_APPROVED,
      {
        requestNo: params.requestNo,
        reason: params.reason,
      },
      `accountDeletion=${params.requestNo}`,
    );
  }

  async notifyAccountDeletionRejected(params: {
    manufacturerId: string;
    requestNo: string;
    reason: string;
    adminRemarks?: string;
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    this.sendVendorNotificationInBackground(
      recipient,
      NotificationTemplateCode.ACCOUNT_DELETION_REJECTED,
      {
        requestNo: params.requestNo,
        reason: params.reason,
        adminRemarks: params.adminRemarks?.trim() || '—',
      },
      `accountDeletion=${params.requestNo}`,
    );
  }

  async notifyAccountDeletionCompleted(params: {
    manufacturerId: string;
    requestNo: string;
    reason: string;
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    this.sendVendorNotificationInBackground(
      recipient,
      NotificationTemplateCode.ACCOUNT_DELETION_COMPLETED,
      {
        requestNo: params.requestNo,
        reason: params.reason,
      },
      `accountDeletion=${params.requestNo}`,
    );
  }
}
