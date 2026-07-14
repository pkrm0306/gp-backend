import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RbacModule } from '../rbac/rbac.module';
import { ManufacturersModule } from '../manufacturers/manufacturers.module';
import {
  Manufacturer,
  ManufacturerSchema,
} from '../manufacturers/schemas/manufacturer.schema';
import { AdminAccountDeletionController } from './admin-account-deletion.controller';
import { AccountDeletionService } from './account-deletion.service';
import {
  AccountDeletionIdCounter,
  AccountDeletionIdCounterSchema,
} from './schemas/account-deletion-id-counter.schema';
import {
  AccountDeletionRequest,
  AccountDeletionRequestSchema,
} from './schemas/account-deletion-request.schema';
import { VendorAccountDeletionController } from './vendor-account-deletion.controller';

@Module({
  imports: [
    RbacModule,
    ManufacturersModule,
    MongooseModule.forFeature([
      {
        name: AccountDeletionRequest.name,
        schema: AccountDeletionRequestSchema,
      },
      {
        name: AccountDeletionIdCounter.name,
        schema: AccountDeletionIdCounterSchema,
      },
      { name: Manufacturer.name, schema: ManufacturerSchema },
    ]),
  ],
  controllers: [
    VendorAccountDeletionController,
    AdminAccountDeletionController,
  ],
  providers: [AccountDeletionService, PermissionsGuard],
  exports: [AccountDeletionService],
})
export class AccountDeletionModule {}
