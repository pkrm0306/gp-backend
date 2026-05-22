import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model, Types } from 'mongoose';
import { UpdateZohoDealDto } from '../dto/update-zoho-deal.dto';
import { ZohoApiResponse } from '../interfaces/zoho-api-response.interface';
import {
  ZohoDealMapping,
  ZohoDealMappingDocument,
} from '../schemas/zoho-deal-mapping.schema';
import {
  ZohoLeadMapping,
  ZohoLeadMappingDocument,
} from '../schemas/zoho-lead-mapping.schema';
import {
  ZohoSyncLog,
  ZohoSyncLogDocument,
} from '../schemas/zoho-sync-log.schema';
import { ZohoApiClientService } from './zoho-api-client.service';

interface ZohoWriteResult {
  data?: Array<{
    code?: string;
    message?: string;
    details?: { id?: string; [key: string]: unknown };
    status?: string;
  }>;
}

interface ConvertLeadOptions {
  leadId: string;
  portalEntityId: string;
  portalEntityType?: string;
  vendorId?: string;
  dealName: string;
  accountName?: string;
  contactLastName?: string;
  stage?: string;
  closingDate?: string;
  amount?: number;
  customFields?: Record<string, unknown>;
}

interface ConvertVendorLeadOptions {
  manufacturerId: string;
  vendorInternalId: string;
}

interface ZohoVendorFunctionResponse {
  code?: string;
  message?: string;
  details?: {
    output?: string;
    userMessage?: string[];
    output_type?: string;
    id?: string;
  };
}

interface ZohoVendorFunctionOutput {
  Contacts?: string;
  Deals?: string;
  Accounts?: string;
}

interface UpdatePaymentDealOptions {
  manufacturerId: string;
  quoteNumber: number | string;
  gstin?: string;
  amount: number;
  transactionNumber?: string;
  paymentMode?: string;
}

@Injectable()
export class ZohoDealsService {
  private readonly logger = new Logger(ZohoDealsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly apiClient: ZohoApiClientService,
    @InjectModel(ZohoDealMapping.name)
    private readonly dealMappingModel: Model<ZohoDealMappingDocument>,
    @InjectModel(ZohoLeadMapping.name)
    private readonly leadMappingModel: Model<ZohoLeadMappingDocument>,
    @InjectModel(ZohoSyncLog.name)
    private readonly syncLogModel: Model<ZohoSyncLogDocument>,
  ) {}

  async convertRegisteredVendorLead(
    options: ConvertVendorLeadOptions,
  ): Promise<ZohoVendorFunctionOutput> {
    const manufacturerObjectId = this.toObjectId(options.manufacturerId);
    if (!manufacturerObjectId) {
      throw new BadGatewayException('Invalid manufacturer ID for Zoho sync');
    }

    const leadMapping = await this.leadMappingModel
      .findOne({
        $or: [
          { manufacturerId: manufacturerObjectId },
          { vendorId: manufacturerObjectId },
        ],
      })
      .sort({ updatedAt: -1 })
      .lean()
      .exec();

    if (!leadMapping?.zohoLeadId) {
      await this.syncLogModel.create({
        operation: 'lead.convert.vendor-function',
        status: 'skipped',
        portalEntityId: options.manufacturerId,
        requestPayload: { vendorInternalId: options.vendorInternalId },
        errorMessage: 'Zoho Lead ID mapping not found',
        attempts: 0,
      });
      throw new BadGatewayException('Zoho Lead ID mapping not found');
    }

    const payload = {
      data: [
        {
          Lead_id: leadMapping.zohoLeadId,
          Vendor_ID: options.vendorInternalId,
        },
      ],
    };

    try {
      const response = await axios.post<ZohoVendorFunctionResponse>(
        this.vendorConvertFunctionUrl(),
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: this.requestTimeoutMs(),
        },
      );

      const output = this.parseVendorFunctionOutput(response.data);
      if (!output.Deals) {
        throw new Error('Zoho vendor conversion did not return a Deal ID');
      }

      await this.dealMappingModel
        .findOneAndUpdate(
          { portalEntityId: options.manufacturerId },
          {
            $set: {
              portalEntityType: 'manufacturer',
              vendorId: manufacturerObjectId,
              manufacturerId: manufacturerObjectId,
              zohoLeadId: leadMapping.zohoLeadId,
              zohoContactId: output.Contacts,
              zohoAccountId: output.Accounts,
              zohoDealId: output.Deals,
              stage: 'Vendor Verified',
              lastSyncedAt: new Date(),
              rawSnapshot: {
                functionResponse: response.data,
                parsedOutput: output,
              },
            },
          },
          { new: true, upsert: true },
        )
        .exec();

      await this.syncLogModel.create({
        operation: 'lead.convert.vendor-function',
        status: 'success',
        portalEntityId: options.manufacturerId,
        zohoModule: 'Deals',
        zohoRecordId: output.Deals,
        requestPayload: payload,
        responsePayload: response.data as Record<string, unknown>,
        attempts: 1,
      });

      return output;
    } catch (error: any) {
      const responsePayload = error?.response?.data;
      const message =
        responsePayload?.message ||
        responsePayload?.code ||
        error?.message ||
        'Zoho vendor lead conversion failed';
      this.logger.error(`Zoho vendor lead conversion failed: ${message}`);
      await this.syncLogModel.create({
        operation: 'lead.convert.vendor-function',
        status: 'failed',
        portalEntityId: options.manufacturerId,
        zohoModule: 'Leads',
        zohoRecordId: leadMapping.zohoLeadId,
        requestPayload: payload,
        responsePayload: responsePayload as Record<string, unknown>,
        errorMessage: String(message),
        attempts: 1,
      });
      throw new BadGatewayException('Zoho vendor lead conversion failed');
    }
  }

  async updateDealPaymentDetails(
    options: UpdatePaymentDealOptions,
  ): Promise<ZohoApiResponse<ZohoWriteResult>> {
    const manufacturerObjectId = this.toObjectId(options.manufacturerId);
    if (!manufacturerObjectId) {
      throw new BadGatewayException('Invalid manufacturer ID for Zoho sync');
    }

    const mapping = await this.dealMappingModel
      .findOne({
        $or: [
          { manufacturerId: manufacturerObjectId },
          { vendorId: manufacturerObjectId },
          { portalEntityId: options.manufacturerId },
        ],
      })
      .sort({ updatedAt: -1 })
      .lean()
      .exec();

    if (!mapping?.zohoDealId) {
      await this.syncLogModel.create({
        operation: 'deal.payment.update',
        status: 'skipped',
        portalEntityId: options.manufacturerId,
        requestPayload: {
          quoteNumber: options.quoteNumber,
          transactionNumber: options.transactionNumber,
        },
        errorMessage: 'Zoho Deal ID mapping not found',
        attempts: 0,
      });
      throw new BadGatewayException('Zoho Deal ID mapping not found');
    }

    const payload = {
      data: [
        {
          id: mapping.zohoDealId,
          Quote_Number: options.quoteNumber,
          ...(options.gstin ? { GSTIN: options.gstin } : {}),
          Amount: options.amount,
          ...(options.transactionNumber
            ? { Transaction_Number: options.transactionNumber }
            : {}),
          ...(options.paymentMode
            ? { Payment_Mode: this.toZohoPaymentMode(options.paymentMode) }
            : {}),
        },
      ],
    };

    const response = await this.apiClient.put<ZohoWriteResult>(
      '/crm/v8/Potentials',
      payload,
    );

    if (!response.ok) {
      await this.logFailure(
        'deal.payment.update',
        options.manufacturerId,
        payload,
        response,
      );
      throw new BadGatewayException(
        response.error?.message || 'Zoho deal payment update failed',
      );
    }

    await this.dealMappingModel
      .findByIdAndUpdate(mapping._id, {
        $set: {
          manufacturerId: manufacturerObjectId,
          vendorId: mapping.vendorId ?? manufacturerObjectId,
          lastSyncedAt: new Date(),
          rawSnapshot: {
            ...(mapping.rawSnapshot || {}),
            lastPaymentUpdate: payload.data[0],
            lastPaymentUpdateResponse: response.data,
          },
        },
      })
      .exec();

    await this.logSuccess(
      'deal.payment.update',
      options.manufacturerId,
      'Potentials',
      mapping.zohoDealId,
      payload,
      response,
    );

    return response;
  }

  async convertLeadToDeal(
    options: ConvertLeadOptions,
  ): Promise<ZohoApiResponse> {
    const payload = {
      data: [
        {
          overwrite: true,
          notify_lead_owner: false,
          notify_new_entity_owner: false,
          Deals: {
            Deal_Name: options.dealName,
            ...(options.stage ? { Stage: options.stage } : {}),
            ...(options.closingDate
              ? { Closing_Date: options.closingDate }
              : {}),
            ...(options.amount !== undefined ? { Amount: options.amount } : {}),
            ...(options.customFields || {}),
          },
          ...(options.accountName
            ? { Accounts: { Account_Name: options.accountName } }
            : {}),
          ...(options.contactLastName
            ? { Contacts: { Last_Name: options.contactLastName } }
            : {}),
        },
      ],
    };

    const response = await this.apiClient.post<ZohoWriteResult>(
      `/crm/v2/Leads/${options.leadId}/actions/convert`,
      payload,
    );

    if (!response.ok) {
      await this.logFailure(
        'lead.convert',
        options.portalEntityId,
        payload,
        response,
      );
      throw new BadGatewayException(
        response.error?.message || 'Zoho lead conversion failed',
      );
    }

    const details = response.data?.data?.[0]?.details || {};
    const dealId = String(details.Deals || details.id || '');
    if (dealId) {
      await this.dealMappingModel
        .findOneAndUpdate(
          { portalEntityId: options.portalEntityId },
          {
            $set: {
              portalEntityType:
                options.portalEntityType || 'product-registration',
              vendorId: this.toObjectId(options.vendorId),
              zohoLeadId: options.leadId,
              zohoContactId: this.toOptionalString(details.Contacts),
              zohoAccountId: this.toOptionalString(details.Accounts),
              zohoDealId: dealId,
              stage: options.stage,
              lastSyncedAt: new Date(),
              rawSnapshot: details,
            },
          },
          { new: true, upsert: true },
        )
        .exec();
    }

    await this.logSuccess(
      'lead.convert',
      options.portalEntityId,
      'Deals',
      dealId,
      payload,
      response,
    );
    return response;
  }

  async updateDeal(
    dto: UpdateZohoDealDto,
    portalEntityId?: string,
  ): Promise<ZohoApiResponse<ZohoWriteResult>> {
    const payload = {
      data: [
        {
          ...(dto.stage ? { Stage: dto.stage } : {}),
          ...(dto.amount !== undefined ? { Amount: dto.amount } : {}),
          ...(dto.closingDate ? { Closing_Date: dto.closingDate } : {}),
          ...(dto.customFields || {}),
        },
      ],
    };

    const response = await this.apiClient.put<ZohoWriteResult>(
      `/crm/v2/Deals/${dto.dealId}`,
      payload,
    );

    if (!response.ok) {
      await this.logFailure('deal.update', portalEntityId, payload, response);
      throw new BadGatewayException(
        response.error?.message || 'Zoho deal update failed',
      );
    }

    await this.dealMappingModel
      .findOneAndUpdate(
        { zohoDealId: dto.dealId },
        {
          $set: {
            ...(dto.stage ? { stage: dto.stage } : {}),
            lastSyncedAt: new Date(),
            rawSnapshot: payload.data[0],
          },
        },
      )
      .exec();

    await this.logSuccess(
      'deal.update',
      portalEntityId,
      'Deals',
      dto.dealId,
      payload,
      response,
    );
    return response;
  }

  private async logSuccess(
    operation: string,
    portalEntityId: string | undefined,
    zohoModule: string,
    zohoRecordId: string | undefined,
    requestPayload: Record<string, unknown>,
    response: ZohoApiResponse,
  ) {
    await this.syncLogModel.create({
      operation,
      status: 'success',
      portalEntityId,
      zohoModule,
      zohoRecordId,
      requestPayload,
      responsePayload: (response.data ?? {}) as Record<string, unknown>,
      attempts: 1,
    });
  }

  private async logFailure(
    operation: string,
    portalEntityId: string | undefined,
    requestPayload: Record<string, unknown>,
    response: ZohoApiResponse,
  ) {
    this.logger.error(`${operation} failed: ${response.error?.message}`);
    await this.syncLogModel.create({
      operation,
      status: 'failed',
      portalEntityId,
      requestPayload,
      responsePayload: (response.data ?? {}) as Record<string, unknown>,
      errorCode: response.error?.code,
      errorMessage: response.error?.message,
      attempts: 1,
    });
  }

  private toObjectId(value?: string): Types.ObjectId | undefined {
    return value && Types.ObjectId.isValid(value)
      ? new Types.ObjectId(value)
      : undefined;
  }

  private toOptionalString(value: unknown): string | undefined {
    return value ? String(value) : undefined;
  }

  private vendorConvertFunctionUrl(): string {
    const fullUrl = this.configService.get<string>(
      'ZOHO_VENDOR_CONVERT_FUNCTION_URL',
    );
    if (fullUrl) return fullUrl;

    const zapikey = this.configService.get<string>(
      'ZOHO_VENDOR_CONVERT_ZAPIKEY',
    );
    if (!zapikey) {
      throw new BadGatewayException(
        'ZOHO_VENDOR_CONVERT_ZAPIKEY is not configured',
      );
    }

    const baseUrl =
      this.configService.get<string>('ZOHO_BASE_URL') ||
      'https://www.zohoapis.in';
    const normalizedBase = baseUrl.replace(/\/+$/, '');
    return `${normalizedBase}/crm/v7/functions/vendor_contact/actions/execute?auth_type=apikey&zapikey=${encodeURIComponent(zapikey)}`;
  }

  private parseVendorFunctionOutput(
    response: ZohoVendorFunctionResponse,
  ): ZohoVendorFunctionOutput {
    if (response.code && response.code !== 'success') {
      throw new Error(response.message || 'Zoho function failed');
    }

    const rawOutput = response.details?.output;
    if (!rawOutput) {
      throw new Error('Zoho function output missing');
    }

    const parsed = JSON.parse(rawOutput) as ZohoVendorFunctionOutput;
    return {
      Contacts: this.toOptionalString(parsed.Contacts),
      Deals: this.toOptionalString(parsed.Deals),
      Accounts: this.toOptionalString(parsed.Accounts),
    };
  }

  private requestTimeoutMs(): number {
    return (
      Number(this.configService.get<string>('ZOHO_HTTP_TIMEOUT_MS')) || 15000
    );
  }

  private toZohoPaymentMode(paymentMode: string): string {
    const normalized = String(paymentMode || '')
      .trim()
      .toLowerCase();
    if (normalized === 'online') return 'Online';
    if (normalized === 'cheque_or_dd') return 'Cheque Or DD';
    if (normalized === 'neft_or_rtgs') return 'NEFT Or RTGS';
    return paymentMode;
  }
}
