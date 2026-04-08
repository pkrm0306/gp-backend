import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Manufacturer, ManufacturerSchema } from '../manufacturers/schemas/manufacturer.schema';
import { ManufacturersModule } from '../manufacturers/manufacturers.module';
import { VendorUser, VendorUserSchema } from '../vendor-users/schemas/vendor-user.schema';
import { Banner, BannerSchema } from '../banners/schemas/banner.schema';
import {
  NewsletterSubscriber,
  NewsletterSubscriberSchema,
} from '../website/schemas/newsletter-subscriber.schema';
import { ContactMessage, ContactMessageSchema } from '../website/schemas/contact-message.schema';

@Module({
  imports: [
    ManufacturersModule,
    MongooseModule.forFeature([
      { name: Manufacturer.name, schema: ManufacturerSchema },
      { name: VendorUser.name, schema: VendorUserSchema },
      { name: Banner.name, schema: BannerSchema },
      { name: NewsletterSubscriber.name, schema: NewsletterSubscriberSchema },
      { name: ContactMessage.name, schema: ContactMessageSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
