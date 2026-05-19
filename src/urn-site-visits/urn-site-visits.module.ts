import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UrnSiteVisit,
  UrnSiteVisitSchema,
} from './schemas/urn-site-visit.schema';
import { UrnSiteVisitsService } from './urn-site-visits.service';
import { AdminUrnSiteVisitsController } from './admin-urn-site-visits.controller';
import {
  Product,
  ProductSchema,
} from '../product-registration/schemas/product.schema';
import { ActivityLogModule } from '../activity-log/activity-log.module';
import { RbacModule } from '../rbac/rbac.module';
import { AuthModule } from '../auth/auth.module';
import { PermissionsGuard } from '../common/guards/permissions.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UrnSiteVisit.name, schema: UrnSiteVisitSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    ActivityLogModule,
    RbacModule,
    AuthModule,
  ],
  controllers: [AdminUrnSiteVisitsController],
  providers: [UrnSiteVisitsService, PermissionsGuard],
  exports: [UrnSiteVisitsService],
})
export class UrnSiteVisitsModule {}
