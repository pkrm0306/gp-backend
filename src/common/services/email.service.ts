import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST') || 'sandbox.smtp.mailtrap.io',
      port: parseInt(this.configService.get<string>('MAIL_PORT') || '2525', 10),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USERNAME') || 'f287ab81e654be',
        pass: this.configService.get<string>('MAIL_PASSWORD') || 'baba66e91e9271',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    htmlBody: string,
    textBody?: string,
  ): Promise<void> {
    try {
      const mailOptions = {
        from: this.configService.get<string>('MAIL_FROM_ADDRESS') || 'noreply@greenpro.com',
        to,
        subject,
        html: htmlBody,
        text: textBody || htmlBody.replace(/<[^>]*>/g, ''),
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
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
}
