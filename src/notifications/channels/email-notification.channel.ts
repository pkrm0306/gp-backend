import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from '../../common/services/email.service';
import {
  NotificationChannel,
  NotificationTemplateCode,
  ChannelDeliveryResult,
} from '../interfaces/notification.types';
import {
  NotificationChannelHandler,
  NotificationDispatchContext,
} from '../interfaces/notification-channel.interface';
import { NotificationTemplateRegistry } from '../templates/notification-template.registry';

@Injectable()
export class EmailNotificationChannel implements NotificationChannelHandler {
  readonly channel = NotificationChannel.EMAIL;
  private readonly logger = new Logger(EmailNotificationChannel.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly templateRegistry: NotificationTemplateRegistry,
  ) {}

  supports(context: NotificationDispatchContext): boolean {
    return Boolean(context.recipient.email?.trim());
  }

  async send(context: NotificationDispatchContext): Promise<ChannelDeliveryResult> {
    const email = context.recipient.email?.trim();
    if (!email) {
      return {
        channel: this.channel,
        success: false,
        skipped: true,
        error: 'No email on recipient',
      };
    }

    try {
      await this.dispatchEmail(context.template, email, context.payload);
      return { channel: this.channel, success: true, attempts: 1 };
    } catch (error) {
      const message = (error as Error)?.message || 'Email send failed';
      this.logger.error(
        `Email channel failed [${context.template}] to ${email}: ${message}`,
      );
      return { channel: this.channel, success: false, error: message, attempts: 1 };
    }
  }

  /**
   * Reuses existing EmailService HTML builders for parity; templates used for other codes.
   */
  private async dispatchEmail(
    template: NotificationTemplateCode,
    email: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    if (template === NotificationTemplateCode.USER_CREATED) {
      await this.emailService.sendRegistrationEmail(
        email,
        String(payload.password ?? ''),
        String(payload.otp ?? ''),
      );
      return;
    }

    if (template === NotificationTemplateCode.PASSWORD_RESET) {
      await this.emailService.sendPasswordResetEmail(
        email,
        String(payload.newPassword ?? payload.password ?? ''),
      );
      return;
    }

    const resolved = this.templateRegistry.resolveEmail(template, payload);
    if (!resolved) {
      throw new Error(`Template ${template} has no email definition`);
    }

    await this.emailService.sendEmail(
      email,
      resolved.subject,
      resolved.html,
      resolved.text,
    );
  }
}
