import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ActivityLog, ActivityLogSchema } from './schemas/activity-log.schema';
import { ActivityLogService } from './activity-log.service';
import { ActivityLogController } from './activity-log.controller';
import { ActivityLogAccessService } from './activity-log-access.service';
import {
  Product,
  ProductSchema,
} from '../product-registration/schemas/product.schema';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RbacModule } from '../rbac/rbac.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivityLog.name, schema: ActivityLogSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    AuthModule,
    RbacModule,
  ],
  controllers: [ActivityLogController],
  providers: [ActivityLogService, ActivityLogAccessService, PermissionsGuard],
  exports: [ActivityLogService, ActivityLogAccessService],
})
export class ActivityLogModule {}
