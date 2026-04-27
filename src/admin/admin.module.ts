import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import {
  Manufacturer,
  ManufacturerSchema,
} from '../manufacturers/schemas/manufacturer.schema';
import { ManufacturersModule } from '../manufacturers/manufacturers.module';
import {
  VendorUser,
  VendorUserSchema,
} from '../vendor-users/schemas/vendor-user.schema';
import { Banner, BannerSchema } from '../banners/schemas/banner.schema';
import {
  NewsletterSubscriber,
  NewsletterSubscriberSchema,
} from '../website/schemas/newsletter-subscriber.schema';
import {
  ContactMessage,
  ContactMessageSchema,
} from '../website/schemas/contact-message.schema';
import { Event, EventSchema } from '../events/schemas/event.schema';
import {
  EventIdCounter,
  EventIdCounterSchema,
} from '../events/schemas/event-id-counter.schema';
import { EmailService } from '../common/services/email.service';
import {
  ContactReplyThread,
  ContactReplyThreadSchema,
} from './schemas/contact-reply-thread.schema';
import {
  Notification,
  NotificationSchema,
} from '../common/schemas/notification.schema';

@Module({
  imports: [
    ManufacturersModule,
    MongooseModule.forFeature([
      { name: Manufacturer.name, schema: ManufacturerSchema },
      { name: VendorUser.name, schema: VendorUserSchema },
      { name: Banner.name, schema: BannerSchema },
      { name: NewsletterSubscriber.name, schema: NewsletterSubscriberSchema },
      { name: ContactMessage.name, schema: ContactMessageSchema },
      { name: ContactReplyThread.name, schema: ContactReplyThreadSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: Event.name, schema: EventSchema },
      { name: EventIdCounter.name, schema: EventIdCounterSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, EmailService],
  exports: [AdminService],
})
export class AdminModule {}
