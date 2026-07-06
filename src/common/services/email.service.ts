import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

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
              <h1 style="margin:0; font-size:42px; line-height:1.2; font-weight:700;">Welcome to GreenPro!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px; font-size:18px; line-height:1.7; color:#111827;">
              ${normalizedContent}
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  private escapeHtml(input: string): string {
    return String(input ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  constructor(private configService: ConfigService) {
    const service =
      this.configService.get<string>('SMTP_SERVER_SERVICE') ||
      this.configService.get<string>('MAIL_SERVICE') ||
      '';
    const host =
      this.configService.get<string>('SMTP_SERVER_HOST') ||
      this.configService.get<string>('MAIL_HOST') ||
      'sandbox.smtp.mailtrap.io';
    const port = parseInt(
      this.configService.get<string>('SMTP_SERVER_PORT') ||
        this.configService.get<string>('MAIL_PORT') ||
        '2525',
      10,
    );
    const secureRaw =
      this.configService.get<string>('SMTP_SERVER_SECURE') ||
      this.configService.get<string>('MAIL_SECURE') ||
      'false';
    const secure = String(secureRaw).toLowerCase() === 'true';
    const user =
      this.configService.get<string>('SMTP_SERVER_USER') ||
      this.configService.get<string>('MAIL_USERNAME') ||
      '';
    const pass =
      this.configService.get<string>('SMTP_SERVER_PASS') ||
      this.configService.get<string>('MAIL_PASSWORD') ||
      '';

    // Prefer provider-level `service` when supplied; fallback to host/port.
    const transportOptions: SMTPTransport.Options = {
      ...(service ? { service } : { host, port }),
      secure,
      ...(user && pass ? { auth: { user, pass } } : {}),
      tls: {
        rejectUnauthorized: false,
      },
    };

    this.transporter = nodemailer.createTransport(transportOptions);
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
    },
  ): Promise<void> {
    try {
      const disabledRaw =
        this.configService.get<string>('EMAIL_DISABLED') || 'false';
      const disabled = String(disabledRaw).toLowerCase() === 'true';
      if (disabled) {
        this.logger.warn(`EMAIL_DISABLED=true, skipping email send to ${to}`);
        return;
      }

      const mailOptions: nodemailer.SendMailOptions = {
        from:
          this.configService.get<string>('SMTP_SERVER_FROM') ||
          this.configService.get<string>('MAIL_FROM_ADDRESS') ||
          'noreply@greenpro.com',
        to,
        subject,
        html: options?.rawHtml
          ? htmlBody
          : this.wrapWithGreenProTemplate(subject, htmlBody),
        text: textBody || this.stripHtml(htmlBody),
        ...(options?.cc ? { cc: options.cc } : {}),
        ...(options?.bcc ? { bcc: options.bcc } : {}),
      };

      const info = await this.transporter.sendMail(mailOptions);
      const ccLabel = options?.cc
        ? `, cc: ${Array.isArray(options.cc) ? options.cc.join(', ') : options.cc}`
        : '';
      this.logger.log(
        `Email sent successfully to ${to}${ccLabel}. Message ID: ${info.messageId}`,
      );
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
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
  ): Promise<void> {
    const subject = 'Welcome to GreenPro - Registration Successful';
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to GreenPro</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1 style="margin: 0;">Welcome to GreenPro!</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px;">
          <p>Dear Vendor,</p>
          <p>Your account has been created successfully. Below are your login credentials:</p>
          
          <div style="background-color: white; padding: 20px; border-left: 4px solid #16a34a; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
          </div>
          
          <p><strong>Please verify your email using the OTP below:</strong></p>
          <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <h2 style="margin: 0; color: #856404; font-size: 32px; letter-spacing: 5px;">${otp}</h2>
          </div>
          
          <p style="margin-top: 30px;">Thank you for joining GreenPro!</p>
          <p>Best regards,<br>The GreenPro Team</p>
        </div>
      </body>
      </html>
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

    await this.sendEmail(email, subject, htmlBody, textBody);
  }

  async sendPasswordResetEmail(
    email: string,
    newPassword: string,
  ): Promise<void> {
    const subject = 'GreenPro - Password Reset';
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - GreenPro</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #7e22ce; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1 style="margin: 0;">Password Reset Request</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px;">
          <p>Dear User,</p>
          <p>Your password has been reset successfully. Please find your new password below:</p>
          
          <div style="background-color: white; padding: 20px; border-left: 4px solid #7e22ce; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Your new password:</strong></p>
            <p style="margin: 10px 0; font-size: 18px; font-weight: bold; color: #7e22ce;">${newPassword}</p>
          </div>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="margin: 0; color: #856404;"><strong>⚠️ Important:</strong> Please login and change your password immediately for security reasons.</p>
          </div>
          
          <p>If you did not request this password reset, please contact our support team immediately.</p>
          <p style="margin-top: 30px;">Best regards,<br>The GreenPro Team</p>
        </div>
      </body>
      </html>
    `;

    const textBody = `
Password Reset Request

Your password has been reset successfully.

Your new password is: ${newPassword}

⚠️ Important: Please login and change your password immediately for security reasons.

If you did not request this password reset, please contact our support team immediately.

Best regards,
The GreenPro Team
    `;

    await this.sendEmail(email, subject, htmlBody, textBody);
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
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Team Member Credentials</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #166534; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1 style="margin: 0;">GreenPro Team Access</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px;">
          <p>Hello ${safeName},</p>
          <p>Your team member account has been created. Use the credentials below to sign in:</p>
          <div style="background-color: white; padding: 20px; border-left: 4px solid #16a34a; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Email:</strong> ${safeEmail}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> ${safePassword}</p>
          </div>
          <p style="margin-top: 20px;">For security, please sign in and change your password immediately.</p>
          <p>Best regards,<br>The GreenPro Team</p>
        </div>
      </body>
      </html>
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
  ): Promise<void> {
    const safeName = this.escapeHtml(vendorName?.trim() || 'Vendor');
    const safeEmail = this.escapeHtml(email);
    const safePassword = password ? this.escapeHtml(password) : '';

    if (password) {
      const subject = 'GreenPro - Your vendor portal login credentials';
      const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vendor portal credentials</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #166534; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1 style="margin: 0;">Vendor portal access</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px;">
          <p>Hello ${safeName},</p>
          <p>Your GreenPro vendor portal login has been updated. Use these credentials to sign in:</p>
          <div style="background-color: white; padding: 20px; border-left: 4px solid #16a34a; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Email:</strong> ${safeEmail}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> ${safePassword}</p>
          </div>
          <p style="margin-top: 20px;">For security, please sign in and change your password after your first login.</p>
          <p>Best regards,<br>The GreenPro Team</p>
        </div>
      </body>
      </html>
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
      await this.sendEmail(email, subject, htmlBody, textBody);
      return;
    }

    const subject = 'GreenPro - Your login email was updated';
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login email updated</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #166534; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1 style="margin: 0;">Login email updated</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px;">
          <p>Hello ${safeName},</p>
          <p>Your GreenPro vendor portal login email has been updated to:</p>
          <div style="background-color: white; padding: 20px; border-left: 4px solid #16a34a; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Email:</strong> ${safeEmail}</p>
          </div>
          <p>Your password is unchanged. Sign in with this email and your existing password.</p>
          <p>If you cannot sign in, use <strong>Forgot password</strong> on the login page.</p>
          <p>Best regards,<br>The GreenPro Team</p>
        </div>
      </body>
      </html>
    `;

    const textBody = `
Hello ${vendorName?.trim() || 'Vendor'},

Your GreenPro vendor portal login email has been updated to: ${email}

Your password is unchanged. Sign in with this email and your existing password.

If you cannot sign in, use Forgot password on the login page.

Best regards,
The GreenPro Team
    `;

    await this.sendEmail(email, subject, htmlBody, textBody);
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
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New vendor team member</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #166534; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1 style="margin: 0;">New team member</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px;">
          <p>A new team member was added from the <strong>vendor panel</strong>.</p>
          <p><strong>Manufacturer:</strong> ${manufacturer}</p>
          <div style="background-color: white; padding: 20px; border-left: 4px solid #16a34a; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Name:</strong> ${memberName}</p>
            <p style="margin: 5px 0;"><strong>Email (username):</strong> ${memberEmail}</p>
            <p style="margin: 5px 0;"><strong>Mobile:</strong> ${memberPhone}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
          </div>
          <p style="margin-top: 20px;">The team member can sign in to the vendor portal with the email and password above.</p>
          <p>Best regards,<br>The GreenPro System</p>
        </div>
      </body>
      </html>
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
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vendor portal credentials</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #166534; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1 style="margin: 0;">Vendor portal access</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px;">
          <p>Hello ${safeName},</p>
          <p>You have been added as a team member for <strong>${manufacturer}</strong> on GreenPro. Use the credentials below to sign in to the vendor portal:</p>
          <div style="background-color: white; padding: 20px; border-left: 4px solid #16a34a; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Email:</strong> ${safeEmail}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> ${safePassword}</p>
          </div>
          ${loginLinkHtml}
          <p style="margin-top: 20px;">For security, please change your password after your first login.</p>
          <p>Best regards,<br>The GreenPro Team</p>
        </div>
      </body>
      </html>
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
}
