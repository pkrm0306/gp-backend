import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { toIsoDateInTimeZone } from '../utils/cron-date.util';
import { EligibleExpiryProduct } from './certification-expiry.types';

export type ExpiryTemplateKind = 'certification_expiry' | 'deactivation';

@Injectable()
export class CertificationExpiryTemplateService {
  private readonly logger = new Logger(CertificationExpiryTemplateService.name);

  constructor(private readonly configService: ConfigService) {}

  private baseUrl(): string {
    return (
      this.configService.get<string>('APP_BASE_URL')?.replace(/\/$/, '') ||
      `http://localhost:${this.configService.get<string>('PORT') || '3000'}`
    );
  }

  private assetUrl(fileName: string): string {
    return `${this.baseUrl()}/email_templates/cronJob/${fileName}`;
  }

  private async readTemplate(fileName: string): Promise<string> {
    const path = join(process.cwd(), 'email_templates', 'cronJob', fileName);
    try {
      return await readFile(path, 'utf8');
    } catch (error) {
      this.logger.warn(
        `Template ${fileName} missing at ${path}; using built-in fallback`,
      );
      return this.fallbackTemplate(fileName);
    }
  }

  private fallbackTemplate(fileName: string): string {
    if (fileName.includes('deactivation')) {
      return `
        <html><body style="font-family:Arial,sans-serif">
          <p>Dear Vendor,</p>
          <p>Your GreenPro certified product registration has been deactivated as the certificate validity period has ended.</p>
          <p>Registration year reference: @productRegistrationyear@</p>
          <p>&copy; @currentYear@ GreenPro</p>
        </body></html>`;
    }
    return `
      <html><body style="font-family:Arial,sans-serif">
        <p>Dear Vendor,</p>
        <p>This is a reminder that your GreenPro product certification is approaching its validity end date. Please initiate renewal if eligible.</p>
        <p>&copy; @year@ GreenPro</p>
      </body></html>`;
  }

  private applyLegacyAssetPlaceholders(html: string): string {
    return html
      .replace(/@LOGO@/g, this.assetUrl('logo.png'))
      .replace(/@PAGEHEADER@/g, this.assetUrl('pageheader.png'))
      .replace(/@SOCIAL_FB@/g, this.assetUrl('social_fb.png'))
      .replace(/@SOCIAL_TW@/g, this.assetUrl('social_tw.png'))
      .replace(/@SOCIAL_IN@/g, this.assetUrl('social_in.png'));
  }

  private applyProductPlaceholders(
    html: string,
    product: EligibleExpiryProduct,
  ): string {
    const validTill = product.validtillDate
      ? toIsoDateInTimeZone(product.validtillDate)
      : '—';
    return html
      .replace(/@VENDOR_NAME@/g, product.vendorName?.trim() || 'Vendor')
      .replace(/@PRODUCT_NAME@/g, product.productName?.trim() || '—')
      .replace(/@EOI_NO@/g, product.eoiNo?.trim() || '—')
      .replace(/@URN_NO@/g, product.urnNo?.trim() || '—')
      .replace(/@CATEGORY_NAME@/g, product.categoryName?.trim() || '—')
      .replace(/@MANUFACTURER_NAME@/g, product.manufacturerName?.trim() || '—')
      .replace(/@VALID_TILL@/g, validTill);
  }

  async renderCertificationExpiryEmail(
    product: EligibleExpiryProduct,
    options?: { includeYear?: boolean; year?: number },
  ): Promise<string> {
    let html = await this.readTemplate('certification_expiry_email.html');
    html = this.applyLegacyAssetPlaceholders(html);
    html = this.applyProductPlaceholders(html, product);
    if (options?.includeYear !== false) {
      const year = options?.year ?? new Date().getFullYear();
      html = html.replace(/@year@/g, String(year));
    } else {
      html = html.replace(/@year@/g, '');
    }
    return html;
  }

  async renderDeactivationEmail(
    product: EligibleExpiryProduct,
    options: { productRegistrationYear: number; currentYear: number },
  ): Promise<string> {
    let html = await this.readTemplate('deactivationMail.html');
    html = this.applyLegacyAssetPlaceholders(html);
    html = this.applyProductPlaceholders(html, product)
      .replace(/@productRegistrationyear@/g, String(options.productRegistrationYear))
      .replace(/@currentYear@/g, String(options.currentYear));
    return html;
  }
}
