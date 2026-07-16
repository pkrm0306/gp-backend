/**
 * Diagnose Gmail SMTP: send simple To-only messages and print accepted/rejected.
 *
 *   pnpm exec ts-node -r tsconfig-paths/register src/scripts/diagnose-smtp.ts
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as nodemailer from 'nodemailer';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
})
class DiagnoseModule {}

async function run() {
  const app = await NestFactory.createApplicationContext(DiagnoseModule, {
    logger: ['error', 'warn', 'log'],
  });
  const config = app.get(ConfigService);

  const user = config.get<string>('SMTP_SERVER_USER') || '';
  const pass = config.get<string>('SMTP_SERVER_PASS') || '';
  const from = config.get<string>('SMTP_SERVER_FROM') || user;

  if (!user || !pass) {
    throw new Error('SMTP_SERVER_USER / SMTP_SERVER_PASS missing');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user, pass },
  });

  console.log('\nVerifying SMTP…');
  await transporter.verify();
  console.log('SMTP verify OK for', user);

  const targets = [
    user, // adeshyearantycodes — must appear if SMTP works
    'niharikachn2003@gmail.com',
    'rmeghana184@gmail.com',
  ];

  for (const to of [...new Set(targets)]) {
    const stamp = new Date().toISOString();
    const info = await transporter.sendMail({
      from,
      to,
      subject: `GreenPro SMTP diagnose ${stamp}`,
      text: `Plain diagnose message to ${to} at ${stamp}. No CC/BCC.`,
      html: `<p>Plain diagnose message to <strong>${to}</strong> at ${stamp}. No CC/BCC.</p>`,
    });
    console.log('\n--- sent to', to);
    console.log('messageId:', info.messageId);
    console.log('accepted:', info.accepted);
    console.log('rejected:', info.rejected);
    console.log('response:', info.response);
    console.log('pending:', (info as any).pending);
  }

  await app.close();
  console.log('\nDone. Check inboxes (and Spam) for subject "GreenPro SMTP diagnose".\n');
}

run().catch((err) => {
  console.error('\nDiagnose failed:', err?.message || err);
  process.exit(1);
});
