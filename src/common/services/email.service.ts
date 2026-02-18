import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    const apiKey = this.configService.get<string>('EMAIL_SERVICE_API_KEY');
    
    console.log('=== EMAIL SENT ===');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log('==================');

    if (apiKey) {
      // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
      // For now, just log the email details
    }
  }

  async sendRegistrationEmail(
    email: string,
    password: string,
    otp: string,
  ): Promise<void> {
    const subject = 'Welcome to GreenPro - Registration Successful';
    const body = `
      Welcome to GreenPro!
      
      Your account has been created successfully.
      
      Login Credentials:
      Email: ${email}
      Password: ${password}
      
      Please verify your email using the OTP below:
      OTP: ${otp}
      
      Thank you for joining GreenPro!
    `;

    await this.sendEmail(email, subject, body);
  }

  async sendPasswordResetEmail(
    email: string,
    newPassword: string,
  ): Promise<void> {
    const subject = 'GreenPro - Password Reset';
    const body = `
      Your password has been reset.
      
      Your new password is: ${newPassword}
      
      Please login and change your password immediately.
      
      If you did not request this, please contact support.
    `;

    await this.sendEmail(email, subject, body);
  }
}
