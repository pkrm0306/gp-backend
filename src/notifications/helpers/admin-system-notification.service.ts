import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from '../../common/schemas/notification.schema';
import { EmailService } from '../../common/services/email.service';
import {
  NotificationCcGroup,
  mergeEmailLists,
  resolveAdminAlertTo,
  resolveAlwaysAdminCc,
  resolveCcGroups,
} from '../utils/notification-recipient-groups.util';

@Injectable()
export class AdminSystemNotificationService {
  private readonly logger = new Logger(AdminSystemNotificationService.name);

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Admin panel bell feed. By default also emails ADMIN_ALERT_EMAIL with
   * rmeghana184@gmail.com (or ADMIN_MAIL_CC) always in CC.
   */
  async createFeedNotification(input: {
    title: string;
    message: string;
    type?: string;
    source?: string;
    referenceType?: string;
    referenceId?: string;
    actorName?: string;
    emailSubject?: string;
    emailHtmlExtra?: string;
    ccGroups?: NotificationCcGroup[];
    /** Set true to write the feed only (no companion email). */
    skipEmail?: boolean;
  }): Promise<void> {
    try {
      await this.notificationModel.create({
        title: input.title,
        message: input.message,
        type: input.type ?? 'info',
        source: input.source ?? 'vendor',
        referenceType: input.referenceType,
        referenceId: input.referenceId,
        actorName: input.actorName,
      });
    } catch (error) {
      this.logger.warn(
        `Admin feed notification failed: ${(error as Error)?.message}`,
      );
    }

    if (input.skipEmail) {
      return;
    }

    // Companion email is async — feed write must succeed even if SMTP is down.
    this.sendAdminAlertEmailInBackground({
      subject: input.emailSubject ?? `GreenPro — ${input.title}`,
      html: input.emailHtmlExtra ?? `<p>${this.escapeHtml(input.message)}</p>`,
      text: input.message,
      ccGroups: input.ccGroups,
    });
  }

  /**
   * Deliver admin alert via Gmail (not Mailtrap-only) with ops CC.
   * Logs failures only — never throws into API handlers.
   */
  async sendAdminAlertEmail(input: {
    subject: string;
    html: string;
    text?: string;
    ccGroups?: NotificationCcGroup[];
  }): Promise<boolean> {
    const to = resolveAdminAlertTo(this.configService);
    if (!to) {
      this.logger.warn(
        'Admin alert email skipped — set ADMIN_ALERT_EMAIL or ADMIN_MAIL_CC',
      );
      return false;
    }

    const cc = this.resolveAdminAlertCc(input.ccGroups);
    const ok = await this.emailService.sendEmail(
      to,
      input.subject,
      input.html,
      input.text,
      {
        cc: cc.length ? cc : undefined,
        primaryOnly: true,
      },
    );
    if (ok) {
      this.logger.log(
        `Admin alert email sent to ${to}${cc.length ? `, cc: ${cc.join(', ')}` : ''} — ${input.subject}`,
      );
    } else {
      this.logger.error(
        `Admin alert email failed to ${to} — ${input.subject}`,
      );
    }
    return ok;
  }

  sendAdminAlertEmailInBackground(input: {
    subject: string;
    html: string;
    text?: string;
    ccGroups?: NotificationCcGroup[];
  }): void {
    this.emailService.sendInBackground(() => this.sendAdminAlertEmail(input));
  }

  /** Always CC ops (rmeghana184@gmail.com by default), even when also the To address. */
  private resolveAdminAlertCc(
    ccGroups?: NotificationCcGroup[],
  ): string[] {
    return mergeEmailLists([
      resolveCcGroups(this.configService, ccGroups),
      resolveAlwaysAdminCc(this.configService),
    ]);
  }

  private escapeHtml(input: string): string {
    return String(input ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
