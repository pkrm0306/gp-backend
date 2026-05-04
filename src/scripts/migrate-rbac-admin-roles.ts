import { NestFactory } from '@nestjs/core';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { AppModule } from '../app.module';
import { VendorUser, VendorUserDocument } from '../vendor-users/schemas/vendor-user.schema';
import { Role, RoleDocument } from '../rbac/schemas/role.schema';
import { PERMISSIONS } from '../common/constants/permissions.constants';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const connection = app.get<Connection>(getConnectionToken());
  const vendorUserModel = app.get<Model<VendorUserDocument>>(
    getModelToken(VendorUser.name),
  );
  const roleModel = app.get<Model<RoleDocument>>(getModelToken(Role.name));

  const session = await connection.startSession();
  session.startTransaction();
  try {
    const migrated = await vendorUserModel.updateMany(
      { type: 'super_admin' },
      { $set: { type: 'admin' } },
      { session },
    );
    console.log(`Migrated super_admin -> admin: ${migrated.modifiedCount}`);

    const manufacturers = await vendorUserModel
      .distinct('manufacturerId', { manufacturerId: { $exists: true, $ne: null } })
      .session(session);

    const defaultRoles = [
      {
        name: 'Content Manager',
        description: 'Manages catalog content and banners',
        permissions: [
          PERMISSIONS.CATEGORIES_VIEW,
          PERMISSIONS.CATEGORIES_ADD,
          PERMISSIONS.CATEGORIES_UPDATE,
          PERMISSIONS.BANNERS_VIEW,
          PERMISSIONS.BANNERS_ADD,
          PERMISSIONS.BANNERS_UPDATE,
          PERMISSIONS.PRODUCTS_VIEW,
        ],
      },
      {
        name: 'Sales Operator',
        description: 'Handles leads, products, and payment visibility',
        permissions: [
          PERMISSIONS.DASHBOARD_VIEW,
          PERMISSIONS.PRODUCTS_VIEW,
          PERMISSIONS.PRODUCTS_UPDATE,
          PERMISSIONS.PAYMENTS_VIEW,
          PERMISSIONS.INQUIRIES_VIEW,
        ],
      },
      {
        name: 'Support Executive',
        description: 'Handles support inbox, subscribers, and team data',
        permissions: [
          PERMISSIONS.DASHBOARD_VIEW,
          PERMISSIONS.INQUIRIES_VIEW,
          PERMISSIONS.SUBSCRIBERS_VIEW,
          PERMISSIONS.SUBSCRIBERS_UPDATE,
          PERMISSIONS.TEAM_MEMBERS_VIEW,
        ],
      },
    ];

    for (const manufacturerId of manufacturers) {
      const tenantId = new Types.ObjectId(manufacturerId);
      for (const role of defaultRoles) {
        await roleModel.updateOne(
          { manufacturerId: tenantId, name: role.name },
          {
            $setOnInsert: {
              manufacturerId: tenantId,
              name: role.name,
              description: role.description,
              permissions: role.permissions,
              status: 1,
            },
          },
          { upsert: true, session },
        );
      }
    }

    await session.commitTransaction();
    console.log('RBAC migration and seeding completed');
  } catch (error) {
    await session.abortTransaction();
    console.error('RBAC migration failed', error);
    process.exitCode = 1;
  } finally {
    session.endSession();
    await app.close();
  }
}

run();

