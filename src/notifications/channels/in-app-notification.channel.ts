import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  UserNotification,
  UserNotificationDocument,
} from '../schemas/user-notification.schema';
import { SequenceHelper } from '../../product-registration/helpers/sequence.helper';
import {
  NotificationChannel,
  ChannelDeliveryResult,
} from '../interfaces/notification.types';
import {
  NotificationChannelHandler,
  NotificationDispatchContext,
} from '../interfaces/notification-channel.interface';
import { NotificationTemplateRegistry } from '../templates/notification-template.registry';

@Injectable()
export class InAppNotificationChannel implements NotificationChannelHandler {
  readonly channel = NotificationChannel.IN_APP;
  private readonly logger = new Logger(InAppNotificationChannel.name);

  constructor(
    @InjectModel(UserNotification.name)
    private readonly userNotificationModel: Model<UserNotificationDocument>,
    private readonly templateRegistry: NotificationTemplateRegistry,
    private readonly sequenceHelper: SequenceHelper,
  ) {}

  supports(context: NotificationDispatchContext): boolean {
    return Boolean(context.recipient.userId?.trim());
  }

  async send(context: NotificationDispatchContext): Promise<ChannelDeliveryResult> {
    const userId = context.recipient.userId?.trim();
    if (!userId) {
      return {
        channel: this.channel,
        success: false,
        skipped: true,
        error: 'No userId on recipient',
      };
    }

    if (!Types.ObjectId.isValid(userId)) {
      return {
        channel: this.channel,
        success: false,
        error: 'Invalid userId format',
      };
    }

    const inApp = this.templateRegistry.resolveInApp(
      context.template,
      context.payload,
      {
        title: context.inAppOverrides?.title,
        content: context.inAppOverrides?.content,
        type: context.inAppOverrides?.type,
        notifyType: context.inAppOverrides?.notifyType,
      },
    );

    if (!inApp?.title?.trim()) {
      return {
        channel: this.channel,
        success: false,
        skipped: true,
        error: `Template ${context.template} has no in-app definition`,
      };
    }

    try {
      const notificationId = await this.sequenceHelper.getUserNotificationId();
      const doc = await this.userNotificationModel.create({
        id: notificationId,
        user_id: new Types.ObjectId(userId),
        title: inApp.title.trim(),
        content: inApp.content.trim(),
        type: inApp.type ?? 'info',
        notify_type: inApp.notifyType ?? context.template,
        seen: 0,
        deleted_at: null,
      });

      this.logger.log(
        `In-app notification created [${context.template}] user=${userId} id=${doc.id}`,
      );

      return {
        channel: this.channel,
        success: true,
        attempts: 1,
        metadata: { notificationId: doc.id },
      };
    } catch (error) {
      const message = (error as Error)?.message || 'In-app notification failed';
      this.logger.error(
        `In-app channel failed [${context.template}] user ${userId}: ${message}`,
      );
      return { channel: this.channel, success: false, error: message, attempts: 1 };
    }
  }
}
