import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WebsiteController } from './website.controller';
import { WebsiteService } from './website.service';
import {
  NewsletterSubscriber,
  NewsletterSubscriberSchema,
} from './schemas/newsletter-subscriber.schema';
import {
  ContactMessage,
  ContactMessageSchema,
} from './schemas/contact-message.schema';
import { Event, EventSchema } from '../events/schemas/event.schema';
import {
  Product,
  ProductSchema,
} from '../product-registration/schemas/product.schema';
import {
  Manufacturer,
  ManufacturerSchema,
} from '../manufacturers/schemas/manufacturer.schema';
import {
  Category,
  CategorySchema,
} from '../categories/schemas/category.schema';
import {
  VendorUser,
  VendorUserSchema,
} from '../vendor-users/schemas/vendor-user.schema';
import { ManufacturersModule } from '../manufacturers/manufacturers.module';
import { CategoriesModule } from '../categories/categories.module';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { AdminModule } from '../admin/admin.module';
import { GalleryModule } from '../gallery/gallery.module';
import { SummitsModule } from '../summits/summits.module';
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
      { name: Product.name, schema: ProductSchema },
      { name: Manufacturer.name, schema: ManufacturerSchema },
      { name: Category.name, schema: CategorySchema },
      { name: VendorUser.name, schema: VendorUserSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    ManufacturersModule,
    CategoriesModule,
    ProductRegistrationModule,
    AdminModule,
    GalleryModule,
    SummitsModule,
  ],
  controllers: [WebsiteController],
  providers: [WebsiteService, EmailService],
})
export class WebsiteModule {}
