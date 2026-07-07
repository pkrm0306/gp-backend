import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Product, ProductSchema } from '../schemas/product.schema';
import { ProductPlant, ProductPlantSchema } from '../schemas/product-plant.schema';
import {
  RenewalCycle,
  RenewalCycleSchema,
} from '../../renew/schemas/renewal-cycle.schema';
import {
  PlantMergeAudit,
  PlantMergeAuditSchema,
} from './schemas/plant-merge-audit.schema';
import { PlantMergeController } from './plant-merge.controller';
import { PlantMergeService } from './plant-merge.service';
import { PlantMergeUrnPreviewService } from './services/plant-merge-urn-preview.service';
import { PlantMergeUrnValidationService } from './services/plant-merge-urn-validation.service';
import { PlantMergeUrnExecuteService } from './services/plant-merge-urn-execute.service';
import { ActivityLogModule } from '../../activity-log/activity-log.module';
import { AuthModule } from '../../auth/auth.module';
import { RbacModule } from '../../rbac/rbac.module';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { SequenceHelper } from '../helpers/sequence.helper';
import { RedisModule } from '../../common/redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductPlant.name, schema: ProductPlantSchema },
      { name: RenewalCycle.name, schema: RenewalCycleSchema },
      { name: PlantMergeAudit.name, schema: PlantMergeAuditSchema },
    ]),
    PassportModule,
    AuthModule,
    RbacModule,
    ActivityLogModule,
    RedisModule,
  ],
  controllers: [PlantMergeController],
  providers: [
    PlantMergeService,
    PlantMergeUrnPreviewService,
    PlantMergeUrnValidationService,
    PlantMergeUrnExecuteService,
    SequenceHelper,
    PermissionsGuard,
  ],
  exports: [
    PlantMergeService,
    PlantMergeUrnPreviewService,
    PlantMergeUrnValidationService,
    PlantMergeUrnExecuteService,
  ],
})
export class PlantMergeModule {}
