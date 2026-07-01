import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { VendorUsersService } from '../vendor-users/vendor-users.service';

const EMAIL = process.env.PLATFORM_ADMIN_EMAIL || 'admin@greenpro.com';
const PASSWORD = process.env.PLATFORM_ADMIN_PASSWORD || 'Greenpro@123';
const NAME = process.env.PLATFORM_ADMIN_NAME || 'Platform Admin';

/**
 * Seeds a platform admin user (no manufacturerId / vendorId).
 *
 *   npm run seed:platform-admin
 */
async function run() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const vendorUsers = app.get(VendorUsersService);

  const existing = await vendorUsers.findByEmail(EMAIL);
  if (existing) {
    await vendorUsers.update(existing._id.toString(), {
      type: 'admin',
      password: PASSWORD,
      status: 1,
      isVerified: true,
    });
    console.log(`Updated platform admin: ${EMAIL}`);
    await app.close();
    return;
  }

  await vendorUsers.create({
    name: NAME,
    email: EMAIL,
    phone: process.env.PLATFORM_ADMIN_PHONE || '0000000001',
    password: PASSWORD,
    type: 'admin',
    status: 1,
    isVerified: true,
  });

  console.log(`Seeded platform admin (no manufacturer): ${EMAIL}`);
  await app.close();
}

run();
