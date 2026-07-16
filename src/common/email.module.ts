import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './services/email.service';

/**
 * Single shared SMTP EmailService for website, admin, and vendor mail.
 * All modules must import/use this — do not re-provide EmailService locally.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
