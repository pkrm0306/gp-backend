import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailService } from '../common/services/email.service';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import {
  UserNotification,
  UserNotificationSchema,
} from './schemas/user-notification.schema';
import { NotificationTemplateRegistry } from './templates/notification-template.registry';
import { NotificationChannelRegistry } from './channels/notification-channel.registry';
import { EmailNotificationChannel } from './channels/email-notification.channel';
import { InAppNotificationChannel } from './channels/in-app-notification.channel';
import { NotificationService } from './notification.service';
import { NotificationHelper } from './notification.helper';
import { NOTIFICATION_CHANNEL_HANDLERS } from './constants/notification.constants';
import { NotificationChannelHandler } from './interfaces/notification-channel.interface';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserNotification.name, schema: UserNotificationSchema },
    ]),
  ],
  providers: [
    EmailService,
    SequenceHelper,
    NotificationTemplateRegistry,
    EmailNotificationChannel,
    InAppNotificationChannel,
    {
      provide: NOTIFICATION_CHANNEL_HANDLERS,
      useFactory: (
        email: EmailNotificationChannel,
        inApp: InAppNotificationChannel,
      ): NotificationChannelHandler[] => [email, inApp],
      inject: [EmailNotificationChannel, InAppNotificationChannel],
    },
    NotificationChannelRegistry,
    NotificationService,
    NotificationHelper,
  ],
  exports: [NotificationHelper, NotificationService, NotificationTemplateRegistry],
})
export class NotificationsModule {}
