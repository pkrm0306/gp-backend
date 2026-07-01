import { NestFactory } from '@nestjs/core';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { AppModule } from '../app.module';
import { VendorUser, VendorUserDocument } from '../vendor-users/schemas/vendor-user.schema';
import { Role, RoleDocument } from '../rbac/schemas/role.schema';
import {
  StaffRoleMapping,
  StaffRoleMappingDocument,
} from '../rbac/schemas/staff-role-mapping.schema';

/**
 * Migrates platform admin/staff users and RBAC rows off manufacturer-scoped records.
 *
 * Run once after deploying optional manufacturerId for admin/staff:
 *   npx ts-node -r tsconfig-paths/register src/scripts/migrate-platform-portal-users.ts
 */
async function run() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const connection = app.get<Connection>(getConnectionToken());
  const vendorUserModel = app.get<Model<VendorUserDocument>>(
    getModelToken(VendorUser.name),
  );
  const roleModel = app.get<Model<RoleDocument>>(getModelToken(Role.name));
  const mappingModel = app.get<Model<StaffRoleMappingDocument>>(
    getModelToken(StaffRoleMapping.name),
  );

  const session = await connection.startSession();
  session.startTransaction();
  try {
    const usersResult = await vendorUserModel.updateMany(
      { type: { $in: ['admin', 'staff'] } },
      { $unset: { manufacturerId: '', vendorId: '' } },
      { session },
    );
    console.log(
      `Unset manufacturerId/vendorId on admin/staff users: ${usersResult.modifiedCount}`,
    );

    const rolesResult = await roleModel.updateMany(
      { manufacturerId: { $exists: true, $ne: null } },
      [{ $set: { manufacturerId: null } }],
      { session },
    );
    console.log(`Moved roles to platform scope: ${rolesResult.modifiedCount}`);

    const mappingsResult = await mappingModel.updateMany(
      { manufacturerId: { $exists: true, $ne: null } },
      [{ $set: { manufacturerId: null } }],
      { session },
    );
    console.log(
      `Moved staff role mappings to platform scope: ${mappingsResult.modifiedCount}`,
    );

    await session.commitTransaction();
    console.log('Platform portal user migration completed');
  } catch (error) {
    await session.abortTransaction();
    console.error('Platform portal user migration failed', error);
    process.exitCode = 1;
  } finally {
    session.endSession();
    await app.close();
  }
}

run();
