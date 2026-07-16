import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import {
  mergeOutgoingCc,
  parseEmailList,
} from '../../notifications/utils/notification-recipient-groups.util';

type SmtpEndpointConfig = {
  label: string;
  service?: string;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from?: string;
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  /** One or more SMTP endpoints (Gmail + Mailtrap can run together). */
  private transporters: Array<{
    label: string;
    from?: string;
    transporter: nodemailer.Transporter;
  }> = [];
  private readonly registeredKeys = new Set<string>();

  private hasHtmlTags(content: string): boolean {
    return /<[a-z][\s\S]*>/i.test(content);
  }

  private stripHtml(content: string): string {
    return String(content ?? '')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private extractBodyContent(html: string): string {
    const raw = String(html ?? '').trim();
    if (!raw) return '';
    const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return bodyMatch?.[1]?.trim() || raw;
  }

  private normalizeContentForTemplate(content: string): string {
    const raw = String(content ?? '').trim();
    if (!raw) {
      return '<p>No additional details provided.</p>';
    }
    if (this.hasHtmlTags(raw)) {
      return this.extractBodyContent(raw);
    }
    const escaped = this.escapeHtml(raw).replace(/\r?\n/g, '<br/>');
    return `<p>${escaped}</p>`;
  }

  private wrapWithGreenProTemplate(subject: string, content: string): string {
    const title = this.escapeHtml(subject || 'GreenPro Notification');
    const normalizedContent = this.normalizeContentForTemplate(content);
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="margin:0; padding:20px; background:#f3f4f6; font-family: Arial, sans-serif; color:#1f2937;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:700px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e5e7eb;">
          <tr>
            <td style="background:#16a34a; color:#ffffff; text-align:center; padding:22px 16px;">
              <h1 style="margin:0; font-size:28px; line-height:1.3; font-weight:700;">GreenPro</h1>
              <p style="margin:8px 0 0; font-size:16px; font-weight:500; opacity:0.95;">${title}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px; font-size:16px; line-height:1.7; color:#111827;">
              ${normalizedContent}
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px; font-size:12px; color:#6b7280;">
              This is an automated email from GreenPro.
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  private looksLikeFullHtmlDocument(html: string): boolean {
    const raw = String(html ?? '').trim();
    return (
      /^<!doctype\s+html/i.test(raw) ||
      /^<html[\s>]/i.test(raw) ||
      /<html[\s>]/i.test(raw)
    );
  }

  private escapeHtml(input: string): string {
    return String(input ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private parseBool(raw: string | undefined, fallback = false): boolean {
    if (raw == null || raw === '') return fallback;
    return String(raw).toLowerCase() === 'true';
  }

  private isMailtrapHost(host: string): boolean {
    return /mailtrap\.io/i.test(host || '');
  }

  private createTransport(config: SmtpEndpointConfig): nodemailer.Transporter {
    const transportOptions: SMTPTransport.Options = {
      ...(config.service
        ? { service: config.service }
        : { host: config.host, port: config.port }),
      secure: config.secure,
      ...(config.user && config.pass
        ? { auth: { user: config.user, pass: config.pass } }
        : {}),
      tls: {
        rejectUnauthorized: false,
      },
    };
    return nodemailer.createTransport(transportOptions);
  }

  private registerTransport(config: SmtpEndpointConfig | null): void {
    if (!config) return;
    const key = `${config.label}|${config.service || ''}|${config.host}|${config.port}|${config.user}`;
    if (this.registeredKeys.has(key)) return;
    this.registeredKeys.add(key);
    this.transporters.push({
      label: config.label,
      from: config.from,
      transporter: this.createTransport(config),
    });
    this.logger.log(
      `Email transport registered: ${config.label} → ${config.service || config.host}:${config.port}`,
    );
  }

  constructor(private configService: ConfigService) {
    // Primary SMTP (Gmail when SMTP_SERVER_* points at smtp.gmail.com / service=gmail).
    // Also still accepts Mailtrap here for backward compatibility.
    const primaryService =
      this.configService.get<string>('SMTP_SERVER_SERVICE') ||
      this.configService.get<string>('MAIL_SERVICE') ||
      '';
    const primaryHost =
      this.configService.get<string>('SMTP_SERVER_HOST') ||
      this.configService.get<string>('MAIL_HOST') ||
      'sandbox.smtp.mailtrap.io';
    const primaryPort = parseInt(
      this.configService.get<string>('SMTP_SERVER_PORT') ||
        this.configService.get<string>('MAIL_PORT') ||
        '2525',
      10,
    );
    const primarySecure = this.parseBool(
      this.configService.get<string>('SMTP_SERVER_SECURE') ||
        this.configService.get<string>('MAIL_SECURE'),
      false,
    );
    const primaryUser =
      this.configService.get<string>('SMTP_SERVER_USER') ||
      this.configService.get<string>('MAIL_USERNAME') ||
      '';
    const primaryPass =
      this.configService.get<string>('SMTP_SERVER_PASS') ||
      this.configService.get<string>('MAIL_PASSWORD') ||
      '';
    const primaryFrom =
      this.configService.get<string>('SMTP_SERVER_FROM') ||
      this.configService.get<string>('MAIL_FROM_ADDRESS') ||
      'noreply@greenpro.com';

    const primaryLabel = this.isMailtrapHost(primaryHost)
      ? 'mailtrap'
      : primaryService.toLowerCase() === 'gmail' ||
          /smtp\.gmail\.com/i.test(primaryHost)
        ? 'gmail'
        : 'smtp';

    this.registerTransport({
      label: primaryLabel,
      service: primaryService || undefined,
      host: primaryHost,
      port: primaryPort,
      secure: primarySecure,
      user: primaryUser,
      pass: primaryPass,
      from: primaryFrom,
    });

    // Optional second endpoint: keep Mailtrap capturing emails while Gmail delivers for real.
    const mailtrapHost =
      this.configService.get<string>('MAILTRAP_HOST') ||
      this.configService.get<string>('MAILTRAP_SERVER_HOST') ||
      '';
    const mailtrapUser =
      this.configService.get<string>('MAILTRAP_USER') ||
      this.configService.get<string>('MAILTRAP_USERNAME') ||
      this.configService.get<string>('MAILTRAP_SERVER_USER') ||
      '';
    const mailtrapPass =
      this.configService.get<string>('MAILTRAP_PASS') ||
      this.configService.get<string>('MAILTRAP_PASSWORD') ||
      this.configService.get<string>('MAILTRAP_SERVER_PASS') ||
      '';

    if (mailtrapHost && mailtrapUser && mailtrapPass) {
      const mailtrapPort = parseInt(
        this.configService.get<string>('MAILTRAP_PORT') ||
          this.configService.get<string>('MAILTRAP_SERVER_PORT') ||
          '2525',
        10,
      );
      const mailtrapSecure = this.parseBool(
        this.configService.get<string>('MAILTRAP_SECURE') ||
          this.configService.get<string>('MAILTRAP_SERVER_SECURE'),
        false,
      );
      const mailtrapFrom =
        this.configService.get<string>('MAILTRAP_FROM') ||
        this.configService.get<string>('MAILTRAP_SERVER_FROM') ||
        primaryFrom;

      // Avoid registering the same Mailtrap endpoint twice when SMTP_* is already Mailtrap.
      if (
        !(
          primaryLabel === 'mailtrap' &&
          primaryHost === mailtrapHost &&
          primaryUser === mailtrapUser
        )
      ) {
        this.registerTransport({
          label: 'mailtrap',
          host: mailtrapHost,
          port: mailtrapPort,
          secure: mailtrapSecure,
          user: mailtrapUser,
          pass: mailtrapPass,
          from: mailtrapFrom,
        });
      }
    }

    if (this.transporters.length === 0) {
      this.logger.warn(
        'No SMTP transports configured; emails will fail until SMTP/Mailtrap env vars are set.',
      );
    } else {
      this.logger.log(
        `Email delivery endpoints: ${this.transporters.map((t) => t.label).join(' + ')}`,
      );
    }
  }

  async sendEmail(
    to: string,
    subject: string,
    htmlBody: string,
    textBody?: string,
    options?: {
      rawHtml?: boolean;
      cc?: string | string[];
      bcc?: string | string[];
      /** Use only Gmail/SMTP (skip Mailtrap capture). */
      primaryOnly?: boolean;
      /** Vendor-facing mail — do not CC admin ops addresses. */
      skipAdminCc?: boolean;
    },
  ): Promise<void> {
    try {
      const disabledRaw =
        this.configService.get<string>('EMAIL_DISABLED') || 'false';
      const disabled = String(disabledRaw).toLowerCase() === 'true';

      const defaultFrom =
        this.configService.get<string>('SMTP_SERVER_FROM') ||
        this.configService.get<string>('MAIL_FROM_ADDRESS') ||
        'noreply@greenpro.com';
      const useRawHtml =
        options?.rawHtml === true || this.looksLikeFullHtmlDocument(htmlBody);
      const html = useRawHtml
        ? htmlBody
        : this.wrapWithGreenProTemplate(subject, htmlBody);
      const text = textBody || this.stripHtml(htmlBody);
      const cc = options?.skipAdminCc
        ? parseEmailList(
            Array.isArray(options?.cc)
              ? options.cc.join(',')
              : (options?.cc ?? ''),
          )
        : mergeOutgoingCc(this.configService, to, options?.cc);
      const ccList = cc?.length ? cc : undefined;

      this.saveLocalMailPreview({
        to,
        subject,
        html,
        text,
        cc: ccList,
      });

      if (disabled) {
        this.logger.warn(
          `EMAIL_DISABLED=true, skipping SMTP send to ${to} (local preview still saved if enabled)`,
        );
        return;
      }

      if (this.transporters.length === 0) {
        throw new Error('No SMTP transports configured');
      }

      let outcome = await this.dispatchToTransports({
        to,
        subject,
        html,
        text,
        fromDefault: defaultFrom,
        cc: ccList,
        primaryOnly: options?.primaryOnly === true,
      });

      if (!outcome.delivered && ccList?.length) {
        this.logger.warn(
          `Email to ${to} failed on primary SMTP with CC; retrying without CC`,
        );
        outcome = await this.dispatchToTransports({
          to,
          subject,
          html,
          text,
          fromDefault: defaultFrom,
          primaryOnly: options?.primaryOnly === true,
        });
      }

      if (!outcome.delivered) {
        const detail = outcome.primaryError
          ? `: ${outcome.primaryError}`
          : '';
        throw new Error(`Failed to send email to ${to}${detail}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  /** True when at least one transport can deliver to a real inbox (not Mailtrap capture). */
  private hasPrimaryDeliveryTransport(): boolean {
    return this.transporters.some((t) => t.label !== 'mailtrap');
  }

  private async dispatchToTransports(params: {
    to: string;
    subject: string;
    html: string;
    text: string;
    fromDefault: string;
    cc?: string[];
    bcc?: string | string[];
    primaryOnly?: boolean;
  }): Promise<{
    delivered: boolean;
    primaryError?: string;
  }> {
    const transports =
      params.primaryOnly === true
        ? this.transporters.filter((t) => t.label !== 'mailtrap')
        : this.transporters;
    const active =
      transports.length > 0 ? transports : this.transporters;

    if (active.length === 0) {
      return {
        delivered: false,
        primaryError: 'No SMTP transports configured',
      };
    }

    const fromName =
      this.configService.get<string>('SMTP_FROM_NAME')?.trim() || 'GreenPro';
    const ccLabel = params.cc?.length ? `, cc: ${params.cc.join(', ')}` : '';
    const bccList = Array.isArray(params.bcc)
      ? params.bcc.map((x) => String(x).trim()).filter(Boolean)
      : parseEmailList(params.bcc);
    const bccLabel = bccList.length ? `, bcc: ${bccList.join(', ')}` : '';
    const results = await Promise.allSettled(
      active.map(async ({ label, from, transporter }) => {
        const fromAddress = from || params.fromDefault;
        const mailOptions: nodemailer.SendMailOptions = {
          from: `"${fromName.replace(/"/g, '')}" <${fromAddress}>`,
          to: params.to,
          replyTo: fromAddress,
          subject: params.subject,
          html: params.html,
          text: params.text,
          ...(params.cc?.length ? { cc: params.cc } : {}),
          ...(bccList.length ? { bcc: bccList } : {}),
          headers: {
            'X-GreenPro-Mail': '1',
            'X-Entity-Ref-ID': `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
          },
        };
        const info = await transporter.sendMail(mailOptions);
        this.logger.log(
          `Email sent via ${label} to ${params.to}${ccLabel}${bccLabel}. Message ID: ${info.messageId}` +
            ` accepted=${JSON.stringify(info.accepted)} rejected=${JSON.stringify(info.rejected)} response=${info.response || ''}`,
        );
        if (Array.isArray(info.rejected) && info.rejected.length > 0) {
          throw new Error(
            `SMTP rejected recipients via ${label}: ${info.rejected.join(', ')}`,
          );
        }
        return { label, info };
      }),
    );

    let primaryOk = false;
    let mailtrapOk = false;
    let primaryError: string | undefined;

    results.forEach((result, index) => {
      const label = active[index]?.label || 'smtp';
      if (result.status === 'fulfilled') {
        if (label === 'mailtrap') {
          mailtrapOk = true;
        } else {
          primaryOk = true;
        }
        return;
      }

      const message =
        (result.reason as Error)?.message || String(result.reason);
      this.logger.warn(
        `Partial email failure via ${label} for ${params.to}: ${message}`,
      );
      if (label !== 'mailtrap') {
        primaryError = message;
      }
    });

    // Mailtrap is capture-only — never treat it as successful delivery when
    // Gmail/SMTP is also configured (otherwise registration "succeeds" with no inbox mail).
    const delivered = this.hasPrimaryDeliveryTransport()
      ? primaryOk
      : primaryOk || mailtrapOk;

    if (!delivered && mailtrapOk && this.hasPrimaryDeliveryTransport()) {
      this.logger.warn(
        `Email to ${params.to} reached Mailtrap only; primary SMTP did not deliver`,
      );
    }

    return { delivered, primaryError };
  }

  /**
   * Fire-and-forget wrapper used by non-critical email flows.
   * Prevents request failures when SMTP has transient issues.
   */
  sendInBackground(task: () => Promise<void>): void {
    task().catch((error) => {
      this.logger.warn(
        `Background email task failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    });
  }

  async sendRegistrationEmail(
    email: string,
    password: string,
    otp: string,
    options?: { cc?: string | string[] },
  ): Promise<void> {
    const subject = 'Welcome to GreenPro - Registration Successful';
    const safeEmail = this.escapeHtml(email);
    const safePassword = this.escapeHtml(password);
    const safeOtp = this.escapeHtml(otp);
    const htmlBody = `
      <p>Dear Vendor,</p>
      <p>Your account has been created successfully. Below are your login credentials:</p>
      <div style="background:#f9fafb; padding:16px; border-radius:8px; border-left:4px solid #16a34a; margin:16px 0;">
        <p style="margin:5px 0;"><strong>Email:</strong> ${safeEmail}</p>
        <p style="margin:5px 0;"><strong>Password:</strong> ${safePassword}</p>
      </div>
      <p><strong>Please verify your email using the OTP below:</strong></p>
      <div style="background:#fff3cd; border:1px solid #ffc107; padding:14px; text-align:center; margin:16px 0; border-radius:8px;">
        <p style="margin:0; color:#856404; font-size:28px; letter-spacing:4px; font-weight:700;">${safeOtp}</p>
      </div>
      <p>Thank you for joining GreenPro!</p>
      <p>Best regards,<br>The GreenPro Team</p>
    `;

    const textBody = `
Welcome to GreenPro!

Your account has been created successfully.

Login Credentials:
Email: ${email}
Password: ${password}

Please verify your email using the OTP below:
OTP: ${otp}

Thank you for joining GreenPro!
    `;

    await this.sendEmail(email, subject, htmlBody, textBody, {
      ...options,
      primaryOnly: true,
      skipAdminCc: true,
    });
  }

  async sendNewsletterSubscribeEmail(
    email: string,
    subscribedFor: string[] = [],
  ): Promise<void> {
    const prefs =
      subscribedFor.length > 0 ? subscribedFor.join(', ') : 'Newsletter';
    const subject = 'You are subscribed to GreenPro updates';
    const htmlBody = `
      <p>Hi,</p>
      <p>Thanks for subscribing to GreenPro. You will receive updates for:</p>
      <p><strong>Subscribed For:</strong> ${this.escapeHtml(prefs)}</p>
      <p><strong>Email:</strong> ${this.escapeHtml(email)}</p>
      <p>Best regards,<br/>The GreenPro Team</p>
    `;
    const textBody = `Thanks for subscribing to GreenPro.\n\nSubscribed For: ${prefs}\nEmail: ${email}\n\nBest regards,\nThe GreenPro Team`;
    await this.sendEmail(email, subject, htmlBody, textBody);
  }

  async sendPasswordResetEmail(
    email: string,
    newPassword: string,
    options?: { cc?: string | string[] },
  ): Promise<void> {
    const subject = 'GreenPro - Password Reset';
    const safePassword = this.escapeHtml(newPassword);
    const htmlBody = `
      <p>Dear User,</p>
      <p>Your password has been reset successfully. Please find your new password below:</p>
      <div style="background:#f9fafb; padding:16px; border-radius:8px; border-left:4px solid #16a34a; margin:16px 0;">
        <p style="margin:5px 0;"><strong>Your new password:</strong></p>
        <p style="margin:10px 0; font-size:18px; font-weight:700; color:#16a34a;">${safePassword}</p>
      </div>
      <div style="background:#fff3cd; border:1px solid #ffc107; padding:14px; margin:16px 0; border-radius:8px;">
        <p style="margin:0; color:#856404;"><strong>Important:</strong> Please login and change your password immediately for security reasons.</p>
      </div>
      <p>If you did not request this password reset, please contact our support team immediately.</p>
      <p>Best regards,<br>The GreenPro Team</p>
    `;

    const textBody = `
Password Reset Request

Your password has been reset successfully.

Your new password is: ${newPassword}

Important: Please login and change your password immediately for security reasons.

If you did not request this password reset, please contact our support team immediately.

Best regards,
The GreenPro Team
    `;

    await this.sendEmail(email, subject, htmlBody, textBody, options);
  }

  async sendStaffCredentialsEmail(
    email: string,
    password: string,
    staffName?: string,
  ): Promise<void> {
    const safeName = this.escapeHtml(staffName?.trim() || 'Team Member');
    const safeEmail = this.escapeHtml(email);
    const safePassword = this.escapeHtml(password);
    const subject = 'GreenPro Admin - Team Member Credentials';
    const htmlBody = `
      <p>Hello ${safeName},</p>
      <p>Your team member account has been created. Use the credentials below to sign in:</p>
      <div style="background:#f9fafb; padding:16px; border-radius:8px; border-left:4px solid #16a34a; margin:16px 0;">
        <p style="margin:5px 0;"><strong>Email:</strong> ${safeEmail}</p>
        <p style="margin:5px 0;"><strong>Password:</strong> ${safePassword}</p>
      </div>
      <p>For security, please sign in and change your password immediately.</p>
      <p>Best regards,<br>The GreenPro Team</p>
    `;
    const textBody = `
GreenPro Team Access

Hello ${staffName?.trim() || 'Team Member'},

Your team member account has been created. Use the credentials below to sign in:
Email: ${email}
Password: ${password}

For security, please sign in and change your password immediately.

Best regards,
The GreenPro Team
    `;

    await this.sendEmail(email, subject, htmlBody, textBody);
  }

  /** Admin manufacturer email change includes a new random password; profile self-edit does not. */
  async sendVendorLoginEmailUpdatedEmail(
    email: string,
    vendorName?: string,
    password?: string,
    options?: { cc?: string | string[] },
  ): Promise<void> {
    const safeName = this.escapeHtml(vendorName?.trim() || 'Vendor');
    const safeEmail = this.escapeHtml(email);
    const safePassword = password ? this.escapeHtml(password) : '';

    if (password) {
      const subject = 'GreenPro - Your vendor portal login credentials';
      const htmlBody = `
      <p>Hello ${safeName},</p>
      <p>Your GreenPro vendor portal login has been updated. Use these credentials to sign in:</p>
      <div style="background:#f9fafb; padding:16px; border-radius:8px; border-left:4px solid #16a34a; margin:16px 0;">
        <p style="margin:5px 0;"><strong>Email:</strong> ${safeEmail}</p>
        <p style="margin:5px 0;"><strong>Password:</strong> ${safePassword}</p>
      </div>
      <p>For security, please sign in and change your password after your first login.</p>
      <p>Best regards,<br>The GreenPro Team</p>
    `;
      const textBody = `
Hello ${vendorName?.trim() || 'Vendor'},

Your GreenPro vendor portal login has been updated. Use these credentials to sign in:

Email: ${email}
Password: ${password}

For security, please sign in and change your password after your first login.

Best regards,
The GreenPro Team
      `;
      await this.sendEmail(email, subject, htmlBody, textBody, options);
      return;
    }

    const subject = 'GreenPro - Your login email was updated';
    const htmlBody = `
      <p>Hello ${safeName},</p>
      <p>Your GreenPro vendor portal login email has been updated to:</p>
      <div style="background:#f9fafb; padding:16px; border-radius:8px; border-left:4px solid #16a34a; margin:16px 0;">
        <p style="margin:5px 0;"><strong>Email:</strong> ${safeEmail}</p>
      </div>
      <p>Your password is unchanged. Sign in with this email and your existing password.</p>
      <p>If you cannot sign in, use <strong>Forgot password</strong> on the login page.</p>
      <p>Best regards,<br>The GreenPro Team</p>
    `;

    const textBody = `
Hello ${vendorName?.trim() || 'Vendor'},

Your GreenPro vendor portal login email has been updated to: ${email}

Your password is unchanged. Sign in with this email and your existing password.

If you cannot sign in, use Forgot password on the login page.

Best regards,
The GreenPro Team
    `;

    await this.sendEmail(email, subject, htmlBody, textBody, options);
  }

  /** Notifies platform admin when a vendor registers a new team member (partner). */
  async sendVendorTeamMemberRegisteredAdminEmail(
    adminEmail: string,
    params: {
      manufacturerName?: string;
      memberName: string;
      memberEmail: string;
      memberPhone?: string;
      password: string;
    },
  ): Promise<void> {
    const manufacturer = this.escapeHtml(
      params.manufacturerName?.trim() || 'Vendor',
    );
    const memberName = this.escapeHtml(params.memberName.trim() || 'Team Member');
    const memberEmail = this.escapeHtml(params.memberEmail.trim());
    const memberPhone = this.escapeHtml(params.memberPhone?.trim() || '—');
    const password = this.escapeHtml(params.password);

    const subject = 'GreenPro Admin — New vendor team member registered';
    const htmlBody = `
      <p>A new team member was added from the <strong>vendor panel</strong>.</p>
      <p><strong>Manufacturer:</strong> ${manufacturer}</p>
      <div style="background:#f9fafb; padding:16px; border-radius:8px; border-left:4px solid #16a34a; margin:16px 0;">
        <p style="margin:5px 0;"><strong>Name:</strong> ${memberName}</p>
        <p style="margin:5px 0;"><strong>Email (username):</strong> ${memberEmail}</p>
        <p style="margin:5px 0;"><strong>Mobile:</strong> ${memberPhone}</p>
        <p style="margin:5px 0;"><strong>Password:</strong> ${password}</p>
      </div>
      <p>The team member can sign in to the vendor portal with the email and password above.</p>
      <p>Best regards,<br>The GreenPro System</p>
    `;
    const textBody = `
A new team member was added from the vendor panel.

Manufacturer: ${params.manufacturerName?.trim() || 'Vendor'}

Name: ${params.memberName.trim()}
Email (username): ${params.memberEmail.trim()}
Mobile: ${params.memberPhone?.trim() || '—'}
Password: ${params.password}

The team member can sign in to the vendor portal with the email and password above.

Best regards,
The GreenPro System
    `;

    await this.sendEmail(adminEmail, subject, htmlBody, textBody);
  }

  /** Sends vendor portal login credentials to a newly added team member (partner). */
  async sendVendorTeamMemberCredentialsEmail(
    email: string,
    params: {
      memberName: string;
      password: string;
      manufacturerName?: string;
      loginUrl?: string;
    },
  ): Promise<void> {
    const safeName = this.escapeHtml(params.memberName.trim() || 'Team Member');
    const safeEmail = this.escapeHtml(email.trim());
    const safePassword = this.escapeHtml(params.password);
    const manufacturer = this.escapeHtml(
      params.manufacturerName?.trim() || 'your organization',
    );
    const loginUrl = params.loginUrl?.trim();
    const loginLinkHtml = loginUrl
      ? `<p><a href="${this.escapeHtml(loginUrl)}" style="color: #16a34a;">Sign in to the vendor portal</a></p>`
      : '';
    const loginLinkText = loginUrl
      ? `\nSign in: ${loginUrl}\n`
      : '';

    const subject = 'GreenPro - Your vendor portal login credentials';
    const htmlBody = `
      <p>Hello ${safeName},</p>
      <p>You have been added as a team member for <strong>${manufacturer}</strong> on GreenPro. Use the credentials below to sign in to the vendor portal:</p>
      <div style="background:#f9fafb; padding:16px; border-radius:8px; border-left:4px solid #16a34a; margin:16px 0;">
        <p style="margin:5px 0;"><strong>Email:</strong> ${safeEmail}</p>
        <p style="margin:5px 0;"><strong>Password:</strong> ${safePassword}</p>
      </div>
      ${loginLinkHtml}
      <p>For security, please change your password after your first login.</p>
      <p>Best regards,<br>The GreenPro Team</p>
    `;
    const textBody = `
Hello ${params.memberName.trim() || 'Team Member'},

You have been added as a team member for ${params.manufacturerName?.trim() || 'your organization'} on GreenPro. Use the credentials below to sign in to the vendor portal:

Email: ${email.trim()}
Password: ${params.password}
${loginLinkText}
For security, please change your password after your first login.

Best regards,
The GreenPro Team
    `;

    await this.sendEmail(email, subject, htmlBody, textBody);
  }

  /**
   * Writes HTML + text previews under `.local-mail/` so outbound SMTP can be
   * inspected locally. Enabled when EMAIL_SAVE_LOCAL=true, or by default outside production.
   * Folder is gitignored.
   */
  private saveLocalMailPreview(params: {
    to: string;
    subject: string;
    html: string;
    text: string;
    cc?: string[];
  }): void {
    try {
      const nodeEnv = String(
        this.configService.get<string>('NODE_ENV') ?? 'development',
      ).toLowerCase();
      const flag = String(
        this.configService.get<string>('EMAIL_SAVE_LOCAL') ?? '',
      )
        .trim()
        .toLowerCase();
      const enabled =
        flag === 'true' ||
        (flag !== 'false' && nodeEnv !== 'production' && nodeEnv !== 'prod');
      if (!enabled) {
        return;
      }

      const dir = join(process.cwd(), '.local-mail');
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      const safeSubject = String(params.subject ?? 'email')
        .replace(/[^a-zA-Z0-9._-]+/g, '_')
        .slice(0, 80);
      const base = `${stamp}_${safeSubject || 'email'}`;
      const meta = [
        `To: ${params.to}`,
        params.cc?.length ? `Cc: ${params.cc.join(', ')}` : null,
        `Subject: ${params.subject}`,
        `SavedAt: ${new Date().toISOString()}`,
        '',
      ]
        .filter((line) => line != null)
        .join('\n');

      writeFileSync(join(dir, `${base}.html`), params.html, 'utf8');
      writeFileSync(
        join(dir, `${base}.txt`),
        `${meta}${params.text}\n`,
        'utf8',
      );
      this.logger.log(
        `Local email preview saved: .local-mail/${base}.html (open in browser)`,
      );
    } catch (error) {
      this.logger.warn(
        `Failed to save local email preview: ${(error as Error)?.message || error}`,
      );
    }
  }
}
