import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateZohoLeadDto } from '../dto/create-zoho-lead.dto';
import {
  ZohoApiResponse,
  ZohoRecordReference,
} from '../interfaces/zoho-api-response.interface';
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

@Injectable()
export class ZohoLeadsService {
  private readonly logger = new Logger(ZohoLeadsService.name);

  constructor(
    private readonly apiClient: ZohoApiClientService,
    @InjectModel(ZohoLeadMapping.name)
    private readonly leadMappingModel: Model<ZohoLeadMappingDocument>,
    @InjectModel(ZohoSyncLog.name)
    private readonly syncLogModel: Model<ZohoSyncLogDocument>,
  ) {}

  async createLead(dto: CreateZohoLeadDto): Promise<{
    lead: ZohoRecordReference;
    response: ZohoApiResponse<ZohoWriteResult>;
  }> {
    const payload = this.toZohoLeadPayload(dto);
    const portalEntityId =
      dto.manufacturerId || dto.vendorId || dto.portalUserId;
    const response = await this.apiClient.post<ZohoWriteResult>(
      '/crm/v8/Leads',
      { data: [payload] },
    );

    if (!response.ok) {
      await this.logFailure('lead.create', portalEntityId, payload, response);
      throw new BadGatewayException(
        response.error?.message || 'Lead sync failed',
      );
    }

    const zohoLeadId = response.data?.data?.[0]?.details?.id;
    if (!zohoLeadId) {
      await this.logFailure('lead.create', portalEntityId, payload, response);
      throw new InternalServerErrorException('Zoho lead ID was not returned');
    }

    if (dto.portalUserId || dto.manufacturerId || dto.vendorId) {
      await this.upsertLeadMapping(dto, zohoLeadId, payload);
    }

    await this.syncLogModel.create({
      operation: 'lead.create',
      status: 'success',
      portalEntityId,
      zohoModule: 'Leads',
      zohoRecordId: zohoLeadId,
      requestPayload: payload,
      responsePayload: response.data as Record<string, unknown>,
      attempts: 1,
    });

    return {
      lead: { module: 'Leads', id: zohoLeadId },
      response,
    };
  }

  private toZohoLeadPayload(dto: CreateZohoLeadDto): Record<string, unknown> {
    return {
      Company: dto.company,
      Last_Name: dto.lastName,
      ...(dto.firstName ? { First_Name: dto.firstName } : {}),
      ...(dto.email ? { Email: dto.email } : {}),
      ...(dto.phone ? { Phone: dto.phone } : {}),
      ...(dto.mobile ? { Mobile: dto.mobile } : {}),
      ...(dto.leadSource ? { Lead_Source: dto.leadSource } : {}),
      ...(dto.leadStatus ? { Lead_Status: dto.leadStatus } : {}),
      ...(dto.city ? { City: dto.city } : {}),
      ...(dto.state ? { State: dto.state } : {}),
      ...(dto.country ? { Country: dto.country } : {}),
      ...(dto.productInterest ? { Product_Interest: dto.productInterest } : {}),
      ...(dto.customFields || {}),
    };
  }

  private async upsertLeadMapping(
    dto: CreateZohoLeadDto,
    zohoLeadId: string,
    payload: Record<string, unknown>,
  ) {
    const manufacturerObjectId = this.toObjectId(
      dto.manufacturerId || dto.vendorId,
    );
    const portalUserId =
      dto.portalUserId || dto.manufacturerId || dto.vendorId || zohoLeadId;
    const mappingFilter = manufacturerObjectId
      ? {
          $or: [
            { manufacturerId: manufacturerObjectId },
            { vendorId: manufacturerObjectId },
            { portalUserId },
          ],
        }
      : { portalUserId };

    await this.leadMappingModel
      .findOneAndUpdate(
        mappingFilter,
        {
          $set: {
            zohoLeadId,
            vendorId: manufacturerObjectId,
            manufacturerId: manufacturerObjectId,
            email: dto.email,
            company: dto.company,
            source: dto.leadSource || 'vendor-registration',
            lastSyncedAt: new Date(),
            rawSnapshot: payload,
          },
          $setOnInsert: { portalUserId },
        },
        { new: true, upsert: true },
      )
      .exec();
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
      zohoModule: 'Leads',
      requestPayload,
      responsePayload: response.data as Record<string, unknown>,
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
}
