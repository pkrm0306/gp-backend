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

    const accountsUrl =
      this.configService.get<string>('ZOHO_ACCOUNTS_URL') ||
      ZOHO_DEFAULT_ACCOUNTS_URL;

    try {
      const response = await axios.post<ZohoTokenResponse>(
        `${accountsUrl.replace(/\/+$/, '')}/oauth/v2/token`,
        null,
        {
          params: {
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'refresh_token',
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
      const message =
        error?.response?.data?.error_description ||
        error?.response?.data?.error ||
        error?.message ||
        'Zoho token refresh failed';
      this.logger.error(`Zoho token refresh failed: ${message}`);
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
      throw new ServiceUnavailableException('Unable to refresh Zoho token');
    }
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

  private requiredConfig(key: string): string {
    const value = this.configService.get<string>(key);
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
