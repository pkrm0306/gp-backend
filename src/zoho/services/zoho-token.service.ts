import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { RedisService } from '../../common/redis/redis.service';
import {
  ZOHO_DEFAULT_ACCOUNTS_URL,
  ZOHO_TOKEN_CACHE_KEY,
  ZOHO_TOKEN_REFRESH_SKEW_MS,
} from '../helpers/zoho.constants';
import { ZohoToken, ZohoTokenDocument } from '../schemas/zoho-token.schema';

interface CachedZohoToken {
  accessToken: string;
  expiresAt: string;
}

interface ZohoTokenResponse {
  access_token: string;
  expires_in?: number;
  api_domain?: string;
  token_type?: string;
}

@Injectable()
export class ZohoTokenService {
  private readonly logger = new Logger(ZohoTokenService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    @InjectModel(ZohoToken.name)
    private readonly tokenModel: Model<ZohoTokenDocument>,
  ) {}

  async getValidAccessToken(): Promise<string> {
    const cached =
      await this.redisService.get<CachedZohoToken>(ZOHO_TOKEN_CACHE_KEY);
    if (cached?.accessToken && this.isUsable(cached.expiresAt)) {
      return cached.accessToken;
    }

    const stored = await this.tokenModel.findOne({ key: 'primary' }).exec();
    if (stored?.accessToken && this.isUsable(stored.expiresAt)) {
      await this.cacheToken(stored.accessToken, stored.expiresAt);
      return stored.accessToken;
    }

    return this.refreshAccessToken();
  }

  async refreshAccessToken(): Promise<string> {
    const clientId = this.requiredConfig('ZOHO_CLIENT_ID');
    const clientSecret = this.requiredConfig('ZOHO_CLIENT_SECRET');
    const stored = await this.tokenModel.findOne({ key: 'primary' }).exec();
    const refreshToken =
      this.configService.get<string>('ZOHO_REFRESH_TOKEN') ||
      stored?.refreshToken;

    if (!refreshToken) {
      throw new ServiceUnavailableException(
        'Zoho refresh token is not configured',
      );
    }

    const tokenUrl = `${this.resolveAccountsBaseUrl()}/oauth/v2/token`;
    const body = new URLSearchParams({
      refresh_token: String(refreshToken).trim(),
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
    });

    try {
      const response = await axios.post<ZohoTokenResponse>(
        tokenUrl,
        body.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: this.requestTimeoutMs(),
        },
      );

      const expiresInSeconds = response.data.expires_in ?? 3600;
      const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

      await this.tokenModel
        .findOneAndUpdate(
          { key: 'primary' },
          {
            $set: {
              accessToken: response.data.access_token,
              apiDomain: response.data.api_domain,
              expiresAt,
              lastRefreshError: undefined,
              lastRefreshedAt: new Date(),
            },
            $setOnInsert: { key: 'primary', refreshToken },
          },
          { new: true, upsert: true },
        )
        .exec();

      await this.cacheToken(response.data.access_token, expiresAt);
      return response.data.access_token;
    } catch (error: any) {
      const message = this.extractRefreshErrorMessage(error);
      this.logger.error(`Zoho token refresh failed (${tokenUrl}): ${message}`);
      await this.tokenModel
        .findOneAndUpdate(
          { key: 'primary' },
          {
            $set: {
              lastRefreshError: String(message),
              lastRefreshedAt: new Date(),
            },
            $setOnInsert: { key: 'primary', refreshToken },
          },
          { upsert: true },
        )
        .exec();
      throw new ServiceUnavailableException(
        `Unable to refresh Zoho token: ${message}`,
      );
    }
  }

  private extractRefreshErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      if (typeof responseData === 'string' && responseData.trim()) {
        try {
          const parsed = JSON.parse(responseData) as Record<string, unknown>;
          const parsedMessage =
            (parsed.error_description as string) ||
            (parsed.error as string) ||
            (parsed.message as string) ||
            '';
          if (parsedMessage) return parsedMessage;
        } catch {
          return responseData;
        }
      }

      if (responseData && typeof responseData === 'object') {
        const body = responseData as Record<string, unknown>;
        const message =
          (body.error_description as string) ||
          (body.error as string) ||
          (body.message as string);
        if (message) return message;
      }

      const status = error.response?.status;
      return `HTTP ${status || 'unknown'} from Zoho accounts token endpoint`;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Zoho token refresh failed';
  }

  private async cacheToken(accessToken: string, expiresAt?: Date | string) {
    const expiry = expiresAt
      ? new Date(expiresAt)
      : new Date(Date.now() + 3600);
    const ttlSeconds = Math.max(
      1,
      Math.floor(
        (expiry.getTime() - Date.now() - ZOHO_TOKEN_REFRESH_SKEW_MS) / 1000,
      ),
    );
    await this.redisService.set(
      ZOHO_TOKEN_CACHE_KEY,
      { accessToken, expiresAt: expiry.toISOString() },
      ttlSeconds,
    );
  }

  private isUsable(expiresAt?: Date | string): boolean {
    if (!expiresAt) return false;
    return (
      new Date(expiresAt).getTime() - Date.now() > ZOHO_TOKEN_REFRESH_SKEW_MS
    );
  }

  /**
   * OAuth must hit accounts.zoho.* — not www.zohoapis.in (CRM).
   * Strips inline comments (# ...) often pasted into Render env values.
   */
  private resolveAccountsBaseUrl(): string {
    const raw =
      this.configService.get<string>('ZOHO_ACCOUNTS_URL') ||
      ZOHO_DEFAULT_ACCOUNTS_URL;
    let trimmed = String(raw).split('#')[0].trim().replace(/\/+$/, '');
    trimmed = trimmed.replace(/\/oauth\/v2\/token\/?$/i, '');

    if (/zohoapis\./i.test(trimmed)) {
      this.logger.warn(
        `ZOHO_ACCOUNTS_URL is set to CRM host (${trimmed}); using ${ZOHO_DEFAULT_ACCOUNTS_URL} for OAuth token refresh`,
      );
      return ZOHO_DEFAULT_ACCOUNTS_URL;
    }

    return trimmed || ZOHO_DEFAULT_ACCOUNTS_URL;
  }

  private requiredConfig(key: string): string {
    const value = String(this.configService.get<string>(key) ?? '')
      .split('#')[0]
      .trim();
    if (!value) {
      throw new ServiceUnavailableException(`${key} is not configured`);
    }
    return value;
  }

  private requestTimeoutMs(): number {
    return (
      Number(this.configService.get<string>('ZOHO_HTTP_TIMEOUT_MS')) || 15000
    );
  }
}
