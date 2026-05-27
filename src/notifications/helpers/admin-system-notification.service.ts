import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from '../../common/schemas/notification.schema';
import { EmailService } from '../../common/services/email.service';

@Injectable()
export class AdminSystemNotificationService {
  private readonly logger = new Logger(AdminSystemNotificationService.name);

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async createFeedNotification(input: {
    title: string;
    message: string;
    type?: string;
    source?: string;
    referenceType?: string;
    referenceId?: string;
    actorName?: string;
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
  }

  sendAdminAlertEmailInBackground(input: {
    subject: string;
    html: string;
    text?: string;
  }): void {
    const to =
      this.configService.get<string>('SMTP_ADMIN_ALERT_EMAIL')?.trim() ||
      this.configService.get<string>('ADMIN_ALERT_EMAIL')?.trim();
    if (!to) {
      return;
    }
    this.emailService.sendInBackground(() =>
      this.emailService.sendEmail(to, input.subject, input.html, input.text),
    );
  }
}
