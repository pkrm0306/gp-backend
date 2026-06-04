import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';
import { DocumentsModule } from '../documents/documents.module';
import { AuthModule } from '../auth/auth.module';
import { RbacModule } from '../rbac/rbac.module';
import {
  Product,
  ProductSchema,
} from '../product-registration/schemas/product.schema';
import {
  PaymentDetails,
  PaymentDetailsSchema,
} from '../payments/schemas/payment-details.schema';
import {
  Category,
  CategorySchema,
} from '../categories/schemas/category.schema';
import { RenewalCycle, RenewalCycleSchema } from './schemas/renewal-cycle.schema';
import {
  AllRenewProductDocument,
  AllRenewProductDocumentSchema,
} from './schemas/all-renew-product-document.schema';
import {
  ProcessRenewComments,
  ProcessRenewCommentsSchema,
} from './schemas/process-renew-comments.schema';
import {
  ProcessRenewProductPerformance,
  ProcessRenewProductPerformanceSchema,
} from './schemas/process-renew-product-performance.schema';
import {
  ProcessRenewPpTestReport,
  ProcessRenewPpTestReportSchema,
} from './schemas/process-renew-pp-test-report.schema';
import {
  ProductStatusAudit,
  ProductStatusAuditSchema,
} from './schemas/product-status-audit.schema';
import { AdminRenewProductDiscontinueController } from './controllers/admin-renew-product-discontinue.controller';
import { AdminRenewProductDiscontinueService } from './services/admin-renew-product-discontinue.service';
import {
  ProcessRenewManufacturing,
  ProcessRenewManufacturingSchema,
} from './schemas/process-renew-manufacturing.schema';
import {
  ProcessRenewInnovation,
  ProcessRenewInnovationSchema,
} from './schemas/process-renew-innovation.schema';
import {
  ProcessRenewWasteManagement,
  ProcessRenewWasteManagementSchema,
} from './schemas/process-renew-waste-management.schema';
import {
  ProcessRenewProductStewardship,
  ProcessRenewProductStewardshipSchema,
} from './schemas/process-renew-product-stewardship.schema';
import {
  ProcessRenewPsStakeholderEduAwarness,
  ProcessRenewPsStakeholderEduAwarnessSchema,
} from './schemas/process-renew-ps-stakeholder-edu-awarness.schema';
import {
  ProcessRenewMpManufacturingUnit,
  ProcessRenewMpManufacturingUnitSchema,
} from './schemas/process-renew-mp-manufacturing-unit.schema';
import {
  ProcessRenewMpEnergyConsumption,
  ProcessRenewMpEnergyConsumptionSchema,
} from './schemas/process-renew-mp-energy-consumption.schema';
import {
  ProcessRenewWmManufacturingUnit,
  ProcessRenewWmManufacturingUnitSchema,
} from './schemas/process-renew-wm-manufacturing-unit.schema';
import { RenewalCycleService } from './services/renewal-cycle.service';
import { RenewalOrchestrationService } from './services/renewal-orchestration.service';
import { RenewQuickViewService } from './services/renew-quick-view.service';
import { RenewDocumentsService } from './documents/renew-documents.service';
import { AdminRenewController } from './controllers/admin-renew.controller';
import { VendorRenewController } from './controllers/vendor-renew.controller';
import { RenewDocumentsController } from './documents/renew-documents.controller';
import { ProcessRenewInnovationController } from './process-renew-innovation/process-renew-innovation.controller';
import { ProcessRenewInnovationService } from './process-renew-innovation/process-renew-innovation.service';
import { ProcessRenewManufacturingController } from './process-renew-manufacturing/process-renew-manufacturing.controller';
import { ProcessRenewManufacturingService } from './process-renew-manufacturing/process-renew-manufacturing.service';
import { ProcessRenewWasteManagementController } from './process-renew-waste-management/process-renew-waste-management.controller';
import { ProcessRenewWasteManagementService } from './process-renew-waste-management/process-renew-waste-management.service';
import { ProcessRenewCommentsController } from './process-renew-comments/process-renew-comments.controller';
import { AdminRenewProcessCommentsController } from './process-renew-comments/admin-renew-process-comments.controller';
import { ProcessRenewCommentsService } from './process-renew-comments/process-renew-comments.service';
import { ProcessRenewProductStewardshipController } from './process-renew-product-stewardship/process-renew-product-stewardship.controller';
import { ProcessRenewProductStewardshipService } from './process-renew-product-stewardship/process-renew-product-stewardship.service';
import { ProcessRenewProductPerformanceController } from './process-renew-product-performance/process-renew-product-performance.controller';
import { ProcessRenewProductPerformanceService } from './process-renew-product-performance/process-renew-product-performance.service';
import { ProcessRenewMpManufacturingUnitsController } from './process-renew-mp-manufacturing-units/process-renew-mp-manufacturing-units.controller';
import { ProcessRenewMpManufacturingUnitsService } from './process-renew-mp-manufacturing-units/process-renew-mp-manufacturing-units.service';
import { ProcessRenewWmManufacturingUnitsController } from './process-renew-wm-manufacturing-units/process-renew-wm-manufacturing-units.controller';
import { ProcessRenewWmManufacturingUnitsService } from './process-renew-wm-manufacturing-units/process-renew-wm-manufacturing-units.service';
import { RenewUrnStatusController } from './controllers/renew-urn-status.controller';
import { RenewUrnStatusService } from './services/renew-urn-status.service';
import { RenewDetailsController } from './controllers/renew-details.controller';
import { RenewDetailsService } from './services/renew-details.service';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { DocStream, DocStreamSchema } from '../documents/schemas/doc-stream.schema';
import {
  UrnRenewTabReview,
  UrnRenewTabReviewSchema,
} from './schemas/urn-renew-tab-review.schema';
import { RenewUrnTabReviewService } from './services/renew-urn-tab-review.service';
import { RenewDocumentPromotionService } from './services/renew-document-promotion.service';
import { RenewAdminTestValidityService } from './services/renew-admin-test-validity.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RenewalCycle.name, schema: RenewalCycleSchema },
      { name: AllRenewProductDocument.name, schema: AllRenewProductDocumentSchema },
      { name: ProcessRenewComments.name, schema: ProcessRenewCommentsSchema },
      {
        name: ProcessRenewProductPerformance.name,
        schema: ProcessRenewProductPerformanceSchema,
      },
      {
        name: ProcessRenewManufacturing.name,
        schema: ProcessRenewManufacturingSchema,
      },
      { name: ProcessRenewInnovation.name, schema: ProcessRenewInnovationSchema },
      {
        name: ProcessRenewWasteManagement.name,
        schema: ProcessRenewWasteManagementSchema,
      },
      {
        name: ProcessRenewProductStewardship.name,
        schema: ProcessRenewProductStewardshipSchema,
      },
      {
        name: ProcessRenewPsStakeholderEduAwarness.name,
        schema: ProcessRenewPsStakeholderEduAwarnessSchema,
      },
      {
        name: ProcessRenewMpManufacturingUnit.name,
        schema: ProcessRenewMpManufacturingUnitSchema,
      },
      {
        name: ProcessRenewMpEnergyConsumption.name,
        schema: ProcessRenewMpEnergyConsumptionSchema,
      },
      {
        name: ProcessRenewWmManufacturingUnit.name,
        schema: ProcessRenewWmManufacturingUnitSchema,
      },
      { name: Product.name, schema: ProductSchema },
      { name: PaymentDetails.name, schema: PaymentDetailsSchema },
      { name: Category.name, schema: CategorySchema },
      { name: DocStream.name, schema: DocStreamSchema },
      { name: ProductStatusAudit.name, schema: ProductStatusAuditSchema },
      { name: ProcessRenewPpTestReport.name, schema: ProcessRenewPpTestReportSchema },
      { name: UrnRenewTabReview.name, schema: UrnRenewTabReviewSchema },
    ]),
    forwardRef(() => ProductRegistrationModule),
    ActivityLogModule,
    DocumentsModule,
    AuthModule,
    PassportModule,
    RbacModule,
  ],
  controllers: [
    AdminRenewController,
    AdminRenewProcessCommentsController,
    AdminRenewProductDiscontinueController,
    VendorRenewController,
    RenewDetailsController,
    RenewDocumentsController,
    ProcessRenewInnovationController,
    ProcessRenewManufacturingController,
    ProcessRenewWasteManagementController,
    ProcessRenewCommentsController,
    ProcessRenewProductStewardshipController,
    ProcessRenewProductPerformanceController,
    ProcessRenewMpManufacturingUnitsController,
    ProcessRenewWmManufacturingUnitsController,
    RenewUrnStatusController,
  ],
  providers: [
    RenewalCycleService,
    RenewalOrchestrationService,
    RenewDocumentPromotionService,
    RenewAdminTestValidityService,
    RenewQuickViewService,
    RenewDetailsService,
    AdminRenewProductDiscontinueService,
    RenewDocumentsService,
    ProcessRenewInnovationService,
    ProcessRenewManufacturingService,
    ProcessRenewWasteManagementService,
    ProcessRenewCommentsService,
    ProcessRenewProductStewardshipService,
    ProcessRenewProductPerformanceService,
    ProcessRenewMpManufacturingUnitsService,
    ProcessRenewWmManufacturingUnitsService,
    RenewUrnStatusService,
    RenewUrnTabReviewService,
    PermissionsGuard,
  ],
  exports: [
    RenewalOrchestrationService,
    RenewalCycleService,
    RenewAdminTestValidityService,
    RenewUrnTabReviewService,
    ProcessRenewCommentsService,
  ],
})
export class RenewalModule {}
