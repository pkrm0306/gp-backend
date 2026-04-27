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
import { RawMaterialsAdditivesModule } from './raw-materials-additives/raw-materials-additives.module';
import { RawMaterialsEliminationOfFormaldehydeModule } from './raw-materials-elimination-of-formaldehyde/raw-materials-elimination-of-formaldehyde.module';
import { RawMaterialsEliminationOfProhibitedFlameModule } from './raw-materials-elimination-of-prohibited-flame/raw-materials-elimination-of-prohibited-flame.module';
import { RawMaterialsEliminationOfProhibitedFlameSolventsModule } from './raw-materials-elimination-of-prohibited-flame-solvents/raw-materials-elimination-of-prohibited-flame-solvents.module';
import { RawMaterialsEliminationOfProhibitedFlameSolventsProductsModule } from './raw-materials-elimination-of-prohibited-flame-solvents-products/raw-materials-elimination-of-prohibited-flame-solvents-products.module';
import { RawMaterialsEliminationOfOzoneDepletingGlobalWarmingSubstancesModule } from './raw-materials-elimination-of-ozone-depleting-global-warming-substances/raw-materials-elimination-of-ozone-depleting-global-warming-substances.module';
import { RawMaterialsGreenSupplyModule } from './raw-materials-green-supply/raw-materials-green-supply.module';
import { RawMaterialsHazardousModule } from './raw-materials-hazardous/raw-materials-hazardous.module';
import { RawMaterialsOptimizationOfRawMixModule } from './raw-materials-optimization-of-raw-mix/raw-materials-optimization-of-raw-mix.module';
import { RawMaterialsRapidlyRenewableMaterialsModule } from './raw-materials-rapidly-renewable-materials/raw-materials-rapidly-renewable-materials.module';
import { RawMaterialsRecoveryModule } from './raw-materials-recovery/raw-materials-recovery.module';
import { RawMaterialsRecycledContentModule } from './raw-materials-recycled-content/raw-materials-recycled-content.module';
import { RawMaterialsReduceEnvironmentalModule } from './raw-materials-reduce-environmental/raw-materials-reduce-environmental.module';
import { RawMaterialsRegionalMaterialsModule } from './raw-materials-regional-materials/raw-materials-regional-materials.module';
import { RawMaterialsUtilizationModule } from './raw-materials-utilization/raw-materials-utilization.module';
import { RawMaterialsUtilizationManufacturingUnitsModule } from './raw-materials-utilization-manufacturing-units/raw-materials-utilization-manufacturing-units.module';
import { RawMaterialsUtilizationRmcModule } from './raw-materials-utilization-rmc/raw-materials-utilization-rmc.module';
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
import { AuditLogModule } from './audit-log/audit-log.module';
import { DocumentsModule } from './documents/documents.module';

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
    AuditLogModule,
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
    RawMaterialsAdditivesModule,
    RawMaterialsEliminationOfFormaldehydeModule,
    RawMaterialsEliminationOfProhibitedFlameModule,
    RawMaterialsEliminationOfProhibitedFlameSolventsModule,
    RawMaterialsEliminationOfProhibitedFlameSolventsProductsModule,
    RawMaterialsEliminationOfOzoneDepletingGlobalWarmingSubstancesModule,
    RawMaterialsGreenSupplyModule,
    RawMaterialsHazardousModule,
    RawMaterialsOptimizationOfRawMixModule,
    RawMaterialsRapidlyRenewableMaterialsModule,
    RawMaterialsRecoveryModule,
    RawMaterialsRecycledContentModule,
    RawMaterialsReduceEnvironmentalModule,
    RawMaterialsRegionalMaterialsModule,
    RawMaterialsUtilizationModule,
    RawMaterialsUtilizationManufacturingUnitsModule,
    RawMaterialsUtilizationRmcModule,
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
    DocumentsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
