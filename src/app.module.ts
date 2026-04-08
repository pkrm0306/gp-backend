import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { VendorUsersModule } from './vendor-users/vendor-users.module';
import { PartnersModule } from './partners/partners.module';
import { AdminModule } from './admin/admin.module';
import { StatesModule } from './states/states.module';
import { CategoriesModule } from './categories/categories.module';
import { CountriesModule } from './countries/countries.module';
import { ProductRegistrationModule } from './product-registration/product-registration.module';
import { PaymentsModule } from './payments/payments.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { ProductDesignModule } from './product-design/product-design.module';
import { ProductPerformanceModule } from './product-performance/product-performance.module';
import { RawMaterialsHazardousProductsModule } from './raw-materials-hazardous-products/raw-materials-hazardous-products.module';
import { ProcessManufacturingModule } from './process-manufacturing/process-manufacturing.module';
import { ProcessMpManufacturingUnitsModule } from './process-mp-manufacturing-units/process-mp-manufacturing-units.module';
import { ProcessWasteManagementModule } from './process-waste-management/process-waste-management.module';
import { ProcessWmManufacturingUnitsModule } from './process-wm-manufacturing-units/process-wm-manufacturing-units.module';
import { ProcessLifeCycleApproachModule } from './process-life-cycle-approach/process-life-cycle-approach.module';
import { ProcessProductStewardshipModule } from './process-product-stewardship/process-product-stewardship.module';
import { ProcessInnovationModule } from './process-innovation/process-innovation.module';
import { ProcessCommentsModule } from './process-comments/process-comments.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SectorsModule } from './sectors/sectors.module';
import { StandardsModule } from './standards/standards.module';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { WebsiteModule } from './website/website.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ManufacturersModule,
    VendorUsersModule,
    PartnersModule,
    AdminModule,
    StatesModule,
    CategoriesModule,
    CountriesModule,
    ProductRegistrationModule,
    PaymentsModule,
    ActivityLogModule,
    ProductDesignModule,
    ProductPerformanceModule,
    RawMaterialsHazardousProductsModule,
    ProcessManufacturingModule,
    ProcessMpManufacturingUnitsModule,
    ProcessWasteManagementModule,
    ProcessWmManufacturingUnitsModule,
    ProcessLifeCycleApproachModule,
    ProcessProductStewardshipModule,
    ProcessInnovationModule,
    ProcessCommentsModule,
    WebsiteModule,
    DashboardModule,
    SectorsModule,
    StandardsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
