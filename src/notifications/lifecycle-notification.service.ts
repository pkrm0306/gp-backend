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
  }): Promise<void> {
    await this.adminSystemNotification.createFeedNotification({
      title: input.copy.title,
      message: input.copy.message,
      type: input.type ?? 'info',
      source: input.source ?? 'manufacturer',
      referenceType: input.referenceType,
      referenceId: input.referenceId,
      actorName: input.copy.actorName,
    });
    this.adminSystemNotification.sendAdminAlertEmailInBackground({
      subject: input.emailSubject ?? `GreenPro — ${input.copy.title}`,
      html: input.emailHtmlExtra ?? `<p>${input.copy.message}</p>`,
      text: input.copy.message,
    });
  }

  private sendVendorEmailInBackground(
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
    if (!email) {
      if (logContext) {
        this.logger.warn(
          `[sendVendorEmailInBackground] Skipping ${template} — no vendor email (${logContext})`,
        );
      }
      return;
    }
    const manufacturerName = this.manufacturerLabelFromRecipient(recipient);
    this.notificationHelper.sendInBackground({
      type: [NotificationChannel.EMAIL],
      template,
      userId: recipient?.userId,
      email,
      payload: { manufacturerName, vendorName: manufacturerName, ...payload },
      async: true,
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

    for (const r of notifyResult.results) {
      if (r.success) {
        this.logger.log(
          `[notifyNewVendorRegistered] ${r.channel} ok for ${params.email}` +
            (r.metadata?.notificationId
              ? ` (in-app id=${r.metadata.notificationId})`
              : ''),
        );
      } else if (!r.skipped) {
        this.logger.warn(
          `[notifyNewVendorRegistered] ${r.channel} failed for ${params.email}: ${r.error}`,
        );
      }
    }
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
  }

  async notifyVendorRegistrationComplete(
    userId: string,
    email: string,
    manufacturerName: string,
  ): Promise<void> {
    const label = resolveManufacturerDisplayName({ manufacturerName, email });

    const notifyResult = await this.notificationHelper.send({
      type: [NotificationChannel.EMAIL],
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

    const copy = AdminNotificationMessages.newRegistration(label);
    await this.adminSystemNotification.createFeedNotification({
      title: copy.title,
      message: copy.message,
      type: 'success',
      source: 'manufacturer',
      referenceType: 'vendor_registration',
      referenceId: userId,
      actorName: copy.actorName,
    });

    const completeCopy = AdminNotificationMessages.registrationComplete(label);
    this.adminSystemNotification.sendAdminAlertEmailInBackground({
      subject: `GreenPro — ${completeCopy.title}`,
      html: `<p>${completeCopy.message}</p>`,
      text: completeCopy.message,
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
    this.sendVendorEmailInBackground(
      recipient,
      NotificationTemplateCode.URN_INITIAL_APPROVED,
      {
        urnNo: params.urnNo,
        productName: params.productName ?? params.urnNo,
        approvedBy: params.approvedBy ?? 'GreenPro Admin',
      },
      `notifyUrnInitialApproved manufacturerId=${params.manufacturerId} urn=${params.urnNo}`,
    );
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
    const manufacturerName = this.manufacturerLabelFromRecipient(recipient);
    const reason =
      String(params.reason ?? '').trim() ||
      'Your registration was not approved at the initial review stage.';
    this.sendVendorEmailInBackground(
      recipient,
      NotificationTemplateCode.URN_REGISTRATION_REJECTED,
      {
        urnNo: params.urnNo,
        productName: params.productName ?? params.urnNo,
        reason,
        rejectedBy: params.rejectedBy ?? 'GreenPro Admin',
      },
    );
  }

  async notifyUrnSubmittedForReview(params: {
    manufacturerId: string;
    urnNo: string;
    productName?: string;
    manufacturerName?: string;
    vendorEmail?: string;
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
      this.manufacturerLabelFromRecipient(recipient) ??
      'Manufacturer';

    if (recipient?.email || recipient?.userId) {
      this.notificationHelper.sendInBackground({
        type: [NotificationChannel.EMAIL],
        template: NotificationTemplateCode.URN_SUBMITTED_FOR_REVIEW,
        userId: recipient.userId,
        email: recipient.email,
        payload: {
          urnNo: params.urnNo,
          productName: params.productName ?? params.urnNo,
          manufacturerName,
          vendorName: manufacturerName,
        },
        async: true,
      });
    } else {
      this.logger.warn(
        `[notifyUrnSubmittedForReview] Skipping vendor email — no recipient for urn=${params.urnNo}`,
      );
    }

    const copy = AdminNotificationMessages.urnSubmittedForReview(
      manufacturerName,
      params.urnNo,
    );
    await this.notifyAdminFeedAndEmail({
      copy,
      referenceType: 'urn_submitted_for_review',
      referenceId: params.urnNo,
      type: 'info',
      emailSubject: `GreenPro — URN ${params.urnNo} submitted for review`,
      emailHtmlExtra: `<p><strong>${manufacturerName}</strong> submitted URN <strong>${params.urnNo}</strong> for review.</p>`,
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
      type: [NotificationChannel.EMAIL],
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
    await this.adminSystemNotification.createFeedNotification({
      title: copy.title,
      message: copy.message,
      type: 'info',
      source: 'manufacturer',
      referenceType: 'certification_payment_submitted',
      referenceId: String(params.paymentId),
      actorName: copy.actorName,
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
    this.sendVendorEmailInBackground(
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
    this.sendVendorEmailInBackground(
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
    });
  }

  async notifyManufacturerInactive(manufacturerId: string): Promise<void> {
    const recipient =
      await this.recipientService.resolveByManufacturerId(manufacturerId);
    const name = this.manufacturerLabelFromRecipient(recipient);
    this.sendVendorEmailInBackground(
      recipient,
      NotificationTemplateCode.MANUFACTURER_INACTIVE,
      {},
    );
    await this.notifyAdminFeedAndEmail({
      copy: AdminNotificationMessages.manufacturerInactive(name),
      referenceType: 'manufacturer_inactive',
      referenceId: manufacturerId,
      type: 'warning',
    });
  }

  async notifyManufacturerRejected(
    manufacturerName: string,
    manufacturerId?: string,
  ): Promise<void> {
    await this.notifyAdminFeedAndEmail({
      copy: AdminNotificationMessages.manufacturerRejected(manufacturerName),
      referenceType: 'manufacturer_rejected',
      referenceId: manufacturerId,
      type: 'warning',
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
    this.sendVendorEmailInBackground(
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
    this.sendVendorEmailInBackground(
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
    const manufacturerName = this.manufacturerLabelFromRecipient(recipient);
    this.sendVendorEmailInBackground(
      recipient,
      NotificationTemplateCode.PRODUCT_REJECTED,
      {
        urnNo: params.urnNo,
        productName: params.productName,
        reason: params.reason ?? 'Not approved',
        rejectedBy: params.rejectedBy ?? 'GreenPro Admin',
      },
    );
    await this.notifyAdminFeedAndEmail({
      copy: AdminNotificationMessages.productRejected(
        manufacturerName,
        params.urnNo,
        params.productName,
      ),
      referenceType: 'product_rejected',
      referenceId: params.urnNo,
      type: 'warning',
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
        type: [NotificationChannel.EMAIL],
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
    await this.adminSystemNotification.createFeedNotification({
      title: copy.title,
      message: copy.message,
      type: params.stage === 'deactivation' ? 'warning' : 'info',
      source: 'manufacturer',
      referenceType: `certification_expiry_${params.stage}`,
      referenceId: params.productId
        ? String(params.productId)
        : params.urnNo,
      actorName: copy.actorName,
    });
    if (params.includeAdminEmail !== false) {
      this.adminSystemNotification.sendAdminAlertEmailInBackground({
        subject: `GreenPro — ${copy.title}`,
        html: `<p>${copy.message}</p>`,
        text: copy.message,
      });
    }
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
    this.sendVendorEmailInBackground(recipient, NotificationTemplateCode.URN_MERGED, {
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
    });
  }

  /** Plant merge notifications — hook when plant merge API ships. */
  notifyPlantMergedStub(params: { manufacturerId: string; urnNo?: string }): void {
    this.logger.debug(
      `[notifyPlantMergedStub] Plant merge notification not wired yet manufacturerId=${params.manufacturerId} urnNo=${params.urnNo ?? ''}`,
    );
  }

  async notifyRenewalSubmitted(params: {
    manufacturerId: string;
    urnNo: string;
  }): Promise<void> {
    const recipient = await this.recipientService.resolveByManufacturerId(
      params.manufacturerId,
    );
    const manufacturerName = this.manufacturerLabelFromRecipient(recipient);
    this.sendVendorEmailInBackground(
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
    this.sendVendorEmailInBackground(
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
    this.sendVendorEmailInBackground(
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
    });
  }
}
