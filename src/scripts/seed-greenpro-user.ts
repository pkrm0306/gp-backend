import { NestFactory } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AppModule } from '../app.module';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { VendorUsersService } from '../vendor-users/vendor-users.service';

const EMAIL = 'greenpro@gmail.com';
const PASSWORD = 'Greenpro@123';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const vendorUsers = app.get(VendorUsersService);
  const manufacturers = app.get(ManufacturersService);
  const connection = app.get<Connection>(getConnectionToken());

  const existing = await vendorUsers.findByEmail(EMAIL);
  if (existing) {
    await vendorUsers.update(existing._id.toString(), {
      password: PASSWORD,
      status: 1,
      isVerified: true,
    });
    console.log(`Updated password and flags for existing user: ${EMAIL}`);
    await app.close();
    return;
  }

  const session = await connection.startSession();
  session.startTransaction();
  try {
    const manufacturer = await manufacturers.create(
      {
        manufacturerName: 'GreenPro',
        gpInternalId: `GP_SEED_${Date.now()}`,
        manufacturerInitial: 'GRE',
        manufacturerStatus: 1,
        vendor_name: 'GreenPro',
        vendor_email: EMAIL,
        vendor_phone: '0000000000',
        vendor_status: 1,
      },
      session,
    );

    await vendorUsers.create(
      {
        manufacturerId: manufacturer._id,
        vendorId: manufacturer._id,
        name: 'GreenPro',
        email: EMAIL,
        phone: '0000000000',
        password: PASSWORD,
        type: 'vendor',
        status: 1,
        isVerified: true,
      },
      session,
    );

    await session.commitTransaction();
    console.log(`Seeded vendor user: ${EMAIL}`);
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    process.exitCode = 1;
  } finally {
    session.endSession();
    await app.close();
  }
}

run();
