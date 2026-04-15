import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WebsiteController } from './website.controller';
import { WebsiteService } from './website.service';
import {
  NewsletterSubscriber,
  NewsletterSubscriberSchema,
} from './schemas/newsletter-subscriber.schema';
import { ContactMessage, ContactMessageSchema } from './schemas/contact-message.schema';
import { Event, EventSchema } from '../events/schemas/event.schema';
import { VendorUser, VendorUserSchema } from '../vendor-users/schemas/vendor-user.schema';
import { ManufacturersModule } from '../manufacturers/manufacturers.module';
import { CategoriesModule } from '../categories/categories.module';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { EmailService } from '../common/services/email.service';
import {
  Notification,
  NotificationSchema,
} from '../common/schemas/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NewsletterSubscriber.name, schema: NewsletterSubscriberSchema },
      { name: ContactMessage.name, schema: ContactMessageSchema },
      { name: Event.name, schema: EventSchema },
      { name: VendorUser.name, schema: VendorUserSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    ManufacturersModule,
    CategoriesModule,
    ProductRegistrationModule,
  ],
  controllers: [WebsiteController],
  providers: [WebsiteService, EmailService],
})
export class WebsiteModule {}

