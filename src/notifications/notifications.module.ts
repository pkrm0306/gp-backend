import { Global, Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from '../common/services/email.service';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';
import {
  UserNotification,
  UserNotificationSchema,
} from './schemas/user-notification.schema';
import {
  Notification,
  NotificationSchema,
} from '../common/schemas/notification.schema';
import { NotificationTemplateRegistry } from './templates/notification-template.registry';
import { NotificationChannelRegistry } from './channels/notification-channel.registry';
import { EmailNotificationChannel } from './channels/email-notification.channel';
import { InAppNotificationChannel } from './channels/in-app-notification.channel';
import { NotificationService } from './notification.service';
import { NotificationHelper } from './notification.helper';
import { NOTIFICATION_CHANNEL_HANDLERS } from './constants/notification.constants';
import { NotificationChannelHandler } from './interfaces/notification-channel.interface';
import { NotificationRecipientService } from './helpers/notification-recipient.service';
import { AdminSystemNotificationService } from './helpers/admin-system-notification.service';
import { LifecycleNotificationService } from './lifecycle-notification.service';
import { ProductDocumentUploadNotificationHelper } from './helpers/product-document-upload-notification.helper';
import { VendorUsersModule } from '../vendor-users/vendor-users.module';
import { ManufacturersModule } from '../manufacturers/manufacturers.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    VendorUsersModule,
    forwardRef(() => ManufacturersModule),
    MongooseModule.forFeature([
      { name: UserNotification.name, schema: UserNotificationSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [],
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
    NotificationRecipientService,
    AdminSystemNotificationService,
    LifecycleNotificationService,
    ProductDocumentUploadNotificationHelper,
  ],
  exports: [
    NotificationHelper,
    NotificationService,
    NotificationTemplateRegistry,
    LifecycleNotificationService,
    ProductDocumentUploadNotificationHelper,
    NotificationRecipientService,
  ],
})
export class NotificationsModule {}
