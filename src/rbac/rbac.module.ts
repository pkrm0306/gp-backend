import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/role.schema';
import {
  StaffRoleMapping,
  StaffRoleMappingSchema,
} from './schemas/staff-role-mapping.schema';
import {
  VendorUser,
  VendorUserSchema,
} from '../vendor-users/schemas/vendor-user.schema';
import { RbacService } from './rbac.service';
import { RbacController } from './rbac.controller';
import { VendorUsersModule } from '../vendor-users/vendor-users.module';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { EmailService } from '../common/services/email.service';

@Module({
  imports: [
    VendorUsersModule,
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: StaffRoleMapping.name, schema: StaffRoleMappingSchema },
      { name: VendorUser.name, schema: VendorUserSchema },
    ]),
  ],
  providers: [RbacService, PermissionsGuard, EmailService],
  controllers: [RbacController],
  exports: [RbacService],
})
export class RbacModule {}

