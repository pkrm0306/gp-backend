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

    return resolveManufacturerDisplayName({

      manufacturerName: recipient?.companyName,

      companyName: recipient?.companyName,

      contactName: recipient?.vendorName,

      email: recipient?.email,

    }) || fallback || 'Manufacturer';

  }



  /** Welcome email + in-app only. Admin bell feed is created after OTP verify. */

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



  /** Resend registration email verification OTP (vendor portal). */
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

    const label = resolveManufacturerDisplayName({

      manufacturerName,

      email,

    });



    const notifyResult = await this.notificationHelper.send({

      type: [NotificationChannel.EMAIL],

      template: NotificationTemplateCode.VENDOR_REGISTRATION_COMPLETE,

      userId,

      email,

      payload: {

        manufacturerName: label,

        vendorName: label,

        email,

      },

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

    await this.adminSystemNotification.createFeedNotification({

      title: copy.title,

      message: copy.message,

      type: 'info',

      source: 'manufacturer',

      referenceType: 'document_uploaded',

      referenceId: params.urnNo || params.manufacturerId,

      actorName: copy.actorName,

    });

  }



  async notifyUrnInitialApproved(params: {

    manufacturerId: string;

    urnNo: string;

    productName?: string;

    approvedBy?: string;

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

      template: NotificationTemplateCode.URN_INITIAL_APPROVED,

      userId: recipient.userId,

      email: recipient.email,

      payload: {

        urnNo: params.urnNo,

        productName: params.productName ?? params.urnNo,

        manufacturerName,

        vendorName: manufacturerName,

        approvedBy: params.approvedBy ?? 'GreenPro Admin',

      },

      async: true,

    });

  }



  async notifyUrnSubmittedForReview(params: {

    manufacturerId: string;

    urnNo: string;

    productName?: string;

    manufacturerName?: string;

  }): Promise<void> {

    const recipient = await this.recipientService.resolveByManufacturerId(

      params.manufacturerId,

    );

    if (!recipient?.email && !recipient?.userId) {

      return;

    }

    const manufacturerName =

      params.manufacturerName ??

      this.manufacturerLabelFromRecipient(recipient);



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



    const copy = AdminNotificationMessages.urnSubmittedForReview(

      manufacturerName,

      params.urnNo,

    );

    await this.adminSystemNotification.createFeedNotification({

      title: copy.title,

      message: copy.message,

      type: 'info',

      source: 'manufacturer',

      referenceType: 'urn_submitted_for_review',

      referenceId: params.urnNo,

      actorName: copy.actorName,

    });



    this.adminSystemNotification.sendAdminAlertEmailInBackground({

      subject: `GreenPro — URN ${params.urnNo} submitted for review`,

      html: `<p><strong>${manufacturerName}</strong> submitted URN <strong>${params.urnNo}</strong> for review.</p>`,

      text: `${manufacturerName} submitted URN ${params.urnNo} for review.`,

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

    this.notificationHelper.sendInBackground({

      type: [NotificationChannel.EMAIL],

      template: NotificationTemplateCode.CERTIFICATION_PAYMENT_APPROVED,

      userId: recipient.userId,

      email: recipient.email,

      payload: {

        urnNo: params.urnNo,

        paymentId: String(params.paymentId),

        manufacturerName,

        vendorName: manufacturerName,

      },

      async: true,

    });

  }

}

