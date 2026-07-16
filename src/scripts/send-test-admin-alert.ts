/**
 * Send a sample admin alert (same SMTP path as vendor lifecycle notifications).
 *
 * Usage:
 *   pnpm email:admin-test
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { NestFactory } from '@nestjs/core';
import { Notification } from '../common/schemas/notification.schema';
import { EmailModule } from '../common/email.module';
import { AdminSystemNotificationService } from '../notifications/helpers/admin-system-notification.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    EmailModule,
  ],
  providers: [
    AdminSystemNotificationService,
    {
      provide: getModelToken(Notification.name),
      useValue: { create: async () => ({}) },
    },
  ],
})
class AdminAlertTestModule {}

async function run() {
  const app = await NestFactory.createApplicationContext(AdminAlertTestModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const adminNotifications = app.get(AdminSystemNotificationService);
    await adminNotifications.sendAdminAlertEmail({
      subject: 'GreenPro — Vendor Registration OTP (admin test)',
      html: '<p>Test admin alert — vendor registration OTP notification path.</p>',
      text: 'Test admin alert — vendor registration OTP notification path.',
      ccGroups: ['SHEshi'],
    });
    console.log('\nOK — admin alert test email sent (check rmeghana184@gmail.com To/CC)\n');
  } finally {
    await app.close();
  }
}

run().catch((err) => {
  console.error('\nFailed to send admin alert test:', err?.message || err);
  process.exit(1);
});
