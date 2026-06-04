import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Product, ProductSchema } from '../schemas/product.schema';
import { ProductPlant, ProductPlantSchema } from '../schemas/product-plant.schema';
import {
  AllProductDocument,
  AllProductDocumentSchema,
} from '../../product-design/schemas/all-product-document.schema';
import { Category, CategorySchema } from '../../categories/schemas/category.schema';
import {
  RenewalCycle,
  RenewalCycleSchema,
} from '../../renew/schemas/renewal-cycle.schema';
import { UrnMergeAudit, UrnMergeAuditSchema } from './schemas/urn-merge-audit.schema';
import { UrnMergeController } from './urn-merge.controller';
import { UrnMergeService } from './urn-merge.service';
import { ActivityLogModule } from '../../activity-log/activity-log.module';
import { AuthModule } from '../../auth/auth.module';
import { RbacModule } from '../../rbac/rbac.module';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductPlant.name, schema: ProductPlantSchema },
      { name: AllProductDocument.name, schema: AllProductDocumentSchema },
      { name: Category.name, schema: CategorySchema },
      { name: RenewalCycle.name, schema: RenewalCycleSchema },
      { name: UrnMergeAudit.name, schema: UrnMergeAuditSchema },
    ]),
    PassportModule,
    AuthModule,
    RbacModule,
    ActivityLogModule,
  ],
  controllers: [UrnMergeController],
  providers: [UrnMergeService, PermissionsGuard],
  exports: [UrnMergeService],
})
export class UrnMergeModule {}
