import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';
import { AuditLogService } from './audit-log.service';
import { AuditHttpInterceptor } from './audit-http.interceptor';
import { AuditLogAdminController } from './audit-log-admin.controller';
import { AuditEntryFactory } from './audit-entry.factory';
import { AuditLookupResolver } from './audit-lookup-resolver.service';
import { AuditRouteMapper } from './audit-route-map';
import { AuditStatusResolver } from './audit-status-resolver.service';
import { AuditValueTransformer } from './audit-value-transformer.service';
import {
  Category,
  CategorySchema,
} from '../categories/schemas/category.schema';
import { Sector, SectorSchema } from '../sectors/schemas/sector.schema';
import {
  Manufacturer,
  ManufacturerSchema,
} from '../manufacturers/schemas/manufacturer.schema';
import { Country, CountrySchema } from '../countries/schemas/country.schema';
import { State, StateSchema } from '../states/schemas/state.schema';
import { Standard, StandardSchema } from '../standards/schemas/standard.schema';
import {
  Product,
  ProductSchema,
} from '../product-registration/schemas/product.schema';
import { Role, RoleSchema } from '../rbac/schemas/role.schema';
import {
  VendorUser,
  VendorUserSchema,
} from '../vendor-users/schemas/vendor-user.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuditLog.name, schema: AuditLogSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Sector.name, schema: SectorSchema },
      { name: Manufacturer.name, schema: ManufacturerSchema },
      { name: Country.name, schema: CountrySchema },
      { name: State.name, schema: StateSchema },
      { name: Standard.name, schema: StandardSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Role.name, schema: RoleSchema },
      { name: VendorUser.name, schema: VendorUserSchema },
    ]),
  ],
  controllers: [AuditLogAdminController],
  providers: [
    AuditEntryFactory,
    AuditLookupResolver,
    AuditRouteMapper,
    AuditStatusResolver,
    AuditValueTransformer,
    AuditLogService,
    { provide: APP_INTERCEPTOR, useClass: AuditHttpInterceptor },
  ],
  exports: [AuditEntryFactory, AuditLogService],
})
export class AuditLogModule {}
