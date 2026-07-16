/**
 * Send a one-off local SMTP smoke-test using `.env` (Gmail / SMTP_SERVER_*).
 *
 * Usage:
 *   pnpm email:test
 *   pnpm email:test -- you@example.com
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { EmailService } from '../common/services/email.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [EmailService],
})
class EmailTestModule {}

async function run() {
  const toArg = process.argv
    .slice(2)
    .map((a) => a.trim())
    .find((a) => a && !a.startsWith('-'));

  const app = await NestFactory.createApplicationContext(EmailTestModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const emailService = app.get(EmailService);
    const to =
      toArg ||
      process.env.SMTP_SERVER_USER ||
      process.env.MAIL_USERNAME ||
      '';

    if (!to) {
      throw new Error(
        'No recipient. Pass an email: pnpm email:test -- you@example.com',
      );
    }

    if (String(process.env.EMAIL_DISABLED ?? 'false').toLowerCase() === 'true') {
      throw new Error(
        'EMAIL_DISABLED=true in .env — set EMAIL_DISABLED=false to send locally.',
      );
    }

    const subject = 'GreenPro local SMTP test';
    const html = `
      <p>This is a <strong>local smoke test</strong> from the GreenPro Nest API.</p>
      <p>If you received this, Gmail/SMTP from <code>.env</code> is working.</p>
      <p>Sent at: ${new Date().toISOString()}</p>
    `;

    await emailService.sendEmail(to, subject, html, undefined, {
      rawHtml: true,
    });

    console.log(`\nOK — test email sent to ${to}\n`);
  } finally {
    await app.close();
  }
}

run().catch((err) => {
  console.error('\nFailed to send test email:', err?.message || err);
  process.exit(1);
});
