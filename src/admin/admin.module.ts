import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminDashboardController } from './dashboard/admin-dashboard.controller';
import { AdminDashboardStatsService } from './dashboard/admin-dashboard-stats.service';
import { AdminRevenueDashboardService } from './dashboard/admin-revenue-dashboard.service';
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
import { Article, ArticleSchema } from '../articles/schemas/article.schema';
import { RbacModule } from '../rbac/rbac.module';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { CategoriesModule } from '../categories/categories.module';
import { SectorsModule } from '../sectors/sectors.module';
import { Product, ProductSchema } from '../product-registration/schemas/product.schema';
import {
  ProductPlant,
  ProductPlantSchema,
} from '../product-registration/schemas/product-plant.schema';
import { Category, CategorySchema } from '../categories/schemas/category.schema';
import { State, StateSchema } from '../states/schemas/state.schema';
import {
  ActivityLog,
  ActivityLogSchema,
} from '../activity-log/schemas/activity-log.schema';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PaymentsModule } from '../payments/payments.module';
import { AuthModule } from '../auth/auth.module';
import { GalleryModule } from '../gallery/gallery.module';
import {
  PaymentDetails,
  PaymentDetailsSchema,
} from '../payments/schemas/payment-details.schema';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    ManufacturersModule,
    RbacModule,
    CategoriesModule,
    SectorsModule,
    ProductRegistrationModule,
    PaymentsModule,
    GalleryModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductPlant.name, schema: ProductPlantSchema },
      { name: Category.name, schema: CategorySchema },
      { name: State.name, schema: StateSchema },
      { name: ActivityLog.name, schema: ActivityLogSchema },
      { name: Manufacturer.name, schema: ManufacturerSchema },
      { name: VendorUser.name, schema: VendorUserSchema },
      { name: Banner.name, schema: BannerSchema },
      { name: NewsletterSubscriber.name, schema: NewsletterSubscriberSchema },
      { name: ContactMessage.name, schema: ContactMessageSchema },
      { name: ContactReplyThread.name, schema: ContactReplyThreadSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: Event.name, schema: EventSchema },
      { name: EventIdCounter.name, schema: EventIdCounterSchema },
      { name: Article.name, schema: ArticleSchema },
      { name: PaymentDetails.name, schema: PaymentDetailsSchema },
    ]),
  ],
  controllers: [AdminController, AdminDashboardController],
  providers: [
    AdminService,
    AdminDashboardStatsService,
    AdminRevenueDashboardService,
    EmailService,
    PermissionsGuard,
  ],
  exports: [AdminService, GalleryModule],
})
export class AdminModule {}
