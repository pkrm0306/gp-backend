import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class CaptchaService {
  private readonly secretKey: string;
  private readonly isDevelopment: boolean;
  private readonly verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get<string>('RECAPTCHA_SECRET_KEY');
    this.isDevelopment = this.configService.get<string>('NODE_ENV') !== 'production';
  }

  async verifyCaptcha(token: string): Promise<boolean> {
    if (this.isDevelopment && !this.secretKey) {
      console.warn('⚠️  reCAPTCHA bypassed in development mode. Set RECAPTCHA_SECRET_KEY for production.');
      if (token === 'test-token' || token === 'bypass') {
        return true;
      }
    }

    if (!this.secretKey) {
      throw new HttpException(
        'reCAPTCHA secret key not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (this.isDevelopment && (token === 'test-token' || token === 'bypass')) {
      console.warn('⚠️  reCAPTCHA bypassed with test token in development mode');
      return true;
    }

    try {
      const response = await axios.post(this.verifyUrl, null, {
        params: {
          secret: this.secretKey,
          response: token,
        },
      });

      return response.data.success === true;
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      return false;
    }
  }
}
