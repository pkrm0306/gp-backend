import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminVendorUserController } from './admin-vendor-user.controller';
import { AdminDashboardController } from './dashboard/admin-dashboard.controller';
import { AdminDashboardStatsService } from './dashboard/admin-dashboard-stats.service';
import { AdminDashboardKpiService } from './dashboard/admin-dashboard-kpi.service';
import { AdminDashboardWidgetsService } from './dashboard/admin-dashboard-widgets.service';
import { AdminDashboardCertificationTimingService } from './dashboard/admin-dashboard-certification-timing.service';
import { AdminDashboardSustainabilityService } from './dashboard/admin-dashboard-sustainability.service';
import { AdminDashboardVisitorAnalyticsService } from './dashboard/admin-dashboard-visitor-analytics.service';
import { WebsiteAnalyticsModule } from '../website/website-analytics.module';
import { AdminDashboardOptimizedService } from './dashboard/admin-dashboard-optimized.service';
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
import {
  TeamMemberDisplayOrderCounter,
  TeamMemberDisplayOrderCounterSchema,
} from './schemas/team-member-display-order-counter.schema';
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
import {
  VendorProductChangeRequest,
  VendorProductChangeRequestSchema,
} from '../product-registration/schemas/vendor-product-change-request.schema';
import {
  ProcessMpManufacturingUnit,
  ProcessMpManufacturingUnitSchema,
} from '../process-mp-manufacturing-units/schemas/process-mp-manufacturing-unit.schema';
import {
  RawMaterialsRecycledContent,
  RawMaterialsRecycledContentSchema,
} from '../raw-materials-recycled-content/schemas/raw-materials-recycled-content.schema';
import {
  RawMaterialsRecovery,
  RawMaterialsRecoverySchema,
} from '../raw-materials-recovery/schemas/raw-materials-recovery.schema';
import {
  RawMaterialsRapidlyRenewableMaterials,
  RawMaterialsRapidlyRenewableMaterialsSchema,
} from '../raw-materials-rapidly-renewable-materials/schemas/raw-materials-rapidly-renewable-materials.schema';
import {
  RawMaterialsUtilizationRmc,
  RawMaterialsUtilizationRmcSchema,
} from '../raw-materials-utilization-rmc/schemas/raw-materials-utilization-rmc.schema';

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
    WebsiteAnalyticsModule,
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
      {
        name: TeamMemberDisplayOrderCounter.name,
        schema: TeamMemberDisplayOrderCounterSchema,
      },
      { name: Article.name, schema: ArticleSchema },
      { name: PaymentDetails.name, schema: PaymentDetailsSchema },
      {
        name: VendorProductChangeRequest.name,
        schema: VendorProductChangeRequestSchema,
      },
      { name: ProcessMpManufacturingUnit.name, schema: ProcessMpManufacturingUnitSchema },
      { name: RawMaterialsRecycledContent.name, schema: RawMaterialsRecycledContentSchema },
      { name: RawMaterialsRecovery.name, schema: RawMaterialsRecoverySchema },
      {
        name: RawMaterialsRapidlyRenewableMaterials.name,
        schema: RawMaterialsRapidlyRenewableMaterialsSchema,
      },
      { name: RawMaterialsUtilizationRmc.name, schema: RawMaterialsUtilizationRmcSchema },
    ]),
  ],
  controllers: [
    AdminController,
    AdminVendorUserController,
    AdminDashboardController,
  ],
  providers: [
    AdminService,
    AdminDashboardStatsService,
    AdminDashboardKpiService,
    AdminDashboardWidgetsService,
    AdminDashboardCertificationTimingService,
    AdminDashboardSustainabilityService,
    AdminDashboardVisitorAnalyticsService,
    AdminDashboardOptimizedService,
    AdminRevenueDashboardService,
    PermissionsGuard,
  ],
  exports: [AdminService, GalleryModule],
})
export class AdminModule {}
