import { Module, forwardRef } from '@nestjs/common';
import { RenewalModule } from '../renew/renewal.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ProductRegistrationController } from './product-registration.controller';
import { ProductsController } from './products.controller';
import { VendorRequestsController } from './vendor-requests.controller';
import { AdminProductsController } from './admin-products.controller';
import { AdminExpiredReactivateController } from './admin-expired-reactivate.controller';
import { AdminRejectedRestoreController } from './admin-rejected-restore.controller';
import { AdminCertifiedRejectController } from './admin-certified-reject.controller';
import { AdminUrnAddProductController } from './admin-urn-add-product.controller';
import { AdminUrnController } from './admin-urn.controller';
import { ProductController } from './product.controller';
import { ProductRegistrationService } from './product-registration.service';
import { EoiNumberService } from './services/eoi-number.service';
import { ProductSoftDeleteService } from './services/product-soft-delete.service';
import { VendorCertificateService } from './services/vendor-certificate.service';
import { Product, ProductSchema } from './schemas/product.schema';
import {
  ProductPlant,
  ProductPlantSchema,
} from './schemas/product-plant.schema';
import { SequenceHelper } from './helpers/sequence.helper';
import { ManufacturersModule } from '../manufacturers/manufacturers.module';
import { CountriesModule } from '../countries/countries.module';
import { StatesModule } from '../states/states.module';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';
import { SectorsModule } from '../sectors/sectors.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';
import { RbacModule } from '../rbac/rbac.module';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { UrnSiteVisitsModule } from '../urn-site-visits/urn-site-visits.module';
import {
  Category,
  CategorySchema,
} from '../categories/schemas/category.schema';
import {
  Manufacturer,
  ManufacturerSchema,
} from '../manufacturers/schemas/manufacturer.schema';
import {
  AllProductDocument,
  AllProductDocumentSchema,
} from '../product-design/schemas/all-product-document.schema';
import {
  UrnProcessTabReview,
  UrnProcessTabReviewSchema,
} from './schemas/urn-process-tab-review.schema';
import {
  VendorProductChangeRequest,
  VendorProductChangeRequestSchema,
} from './schemas/vendor-product-change-request.schema';
import {
  ProcessFinalReview,
  ProcessFinalReviewSchema,
} from './schemas/process-final-review.schema';
import { UrnTabReviewService } from './urn-tab-review.service';
import { CertificationLifecycleService } from './certification-lifecycle.service';
import { ZohoModule } from '../zoho/zoho.module';
import { EmailService } from '../common/services/email.service';
import {
  ProductStatusAudit,
  ProductStatusAuditSchema,
} from '../renew/schemas/product-status-audit.schema';
import { AdminExpiredReactivateService } from './services/admin-expired-reactivate.service';
import { AdminRejectedRestoreService } from './services/admin-rejected-restore.service';
import { AdminCertifiedRejectService } from './services/admin-certified-reject.service';
import { AdminAddProductToUrnService } from './services/admin-add-product-to-urn.service';
import { CategoryChangeCleanupService } from './services/category-change-cleanup.service';
import { ProcessFinalReviewService } from './services/process-final-review.service';
import {
  ProcessComments,
  ProcessCommentsSchema,
} from '../process-comments/schemas/process-comments.schema';
import {
  PlantMergeAudit,
  PlantMergeAuditSchema,
} from './plant-merge/schemas/plant-merge-audit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductPlant.name, schema: ProductPlantSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Manufacturer.name, schema: ManufacturerSchema },
      { name: AllProductDocument.name, schema: AllProductDocumentSchema },
      { name: UrnProcessTabReview.name, schema: UrnProcessTabReviewSchema },
      {
        name: VendorProductChangeRequest.name,
        schema: VendorProductChangeRequestSchema,
      },
      { name: ProductStatusAudit.name, schema: ProductStatusAuditSchema },
      { name: ProcessFinalReview.name, schema: ProcessFinalReviewSchema },
      { name: ProcessComments.name, schema: ProcessCommentsSchema },
      { name: PlantMergeAudit.name, schema: PlantMergeAuditSchema },
    ]),
    PassportModule,
    AuthModule,
    ManufacturersModule,
    CountriesModule,
    StatesModule,
    CategoriesModule,
    SectorsModule,
    ActivityLogModule,
    RbacModule,
    UrnSiteVisitsModule,
    ZohoModule,
    forwardRef(() => RenewalModule),
  ],
  controllers: [
    ProductRegistrationController,
    ProductsController,
    VendorRequestsController,
    AdminProductsController,
    AdminExpiredReactivateController,
    AdminRejectedRestoreController,
    AdminCertifiedRejectController,
    AdminUrnAddProductController,
    AdminUrnController,
    ProductController,
  ],
  providers: [
    ProductRegistrationService,
    EoiNumberService,
    ProductSoftDeleteService,
    SequenceHelper,
    PermissionsGuard,
    UrnTabReviewService,
    CertificationLifecycleService,
    VendorCertificateService,
    EmailService,
    AdminExpiredReactivateService,
    AdminRejectedRestoreService,
    AdminCertifiedRejectService,
    AdminAddProductToUrnService,
    CategoryChangeCleanupService,
    ProcessFinalReviewService,
  ],
  exports: [
    ProductRegistrationService,
    EoiNumberService,
    ProductSoftDeleteService,
    SequenceHelper,
    UrnTabReviewService,
    CertificationLifecycleService,
    VendorCertificateService,
  ],
})
export class ProductRegistrationModule {}
