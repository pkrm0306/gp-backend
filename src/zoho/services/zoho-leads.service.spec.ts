import {
  BadGatewayException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ZohoLeadsService } from './zoho-leads.service';

function execQuery<T>(result: T) {
  return {
    exec: jest.fn().mockResolvedValue(result),
  };
}

describe('ZohoLeadsService', () => {
  let service: ZohoLeadsService;
  let apiClient: { post: jest.Mock };
  let leadMappingModel: { findOneAndUpdate: jest.Mock };
  let syncLogModel: { create: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    apiClient = {
      post: jest.fn(),
    };
    leadMappingModel = {
      findOneAndUpdate: jest.fn().mockReturnValue(execQuery({ _id: 'map-1' })),
    };
    syncLogModel = {
      create: jest.fn().mockResolvedValue({ _id: 'log-1' }),
    };

    service = new ZohoLeadsService(
      apiClient as any,
      leadMappingModel as any,
      syncLogModel as any,
    );
  });

  it('creates a Zoho lead and stores the returned lead id for the manufacturer', async () => {
    const manufacturerId = new Types.ObjectId().toString();
    const portalUserId = new Types.ObjectId().toString();
    apiClient.post.mockResolvedValue({
      ok: true,
      statusCode: 201,
      data: {
        data: [
          {
            status: 'success',
            details: { id: '1110053000001280001' },
          },
        ],
      },
    });

    const result = await service.createLead({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      mobile: '+919876543210',
      company: 'ABC Pvt Ltd',
      leadStatus: 'New',
      leadSource: 'Portal',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      portalUserId,
      vendorId: manufacturerId,
      manufacturerId,
      customFields: {
        GBC_s_Services: 'Greenpro',
      },
    });

    expect(apiClient.post).toHaveBeenCalledWith('/crm/v8/Leads', {
      data: [
        expect.objectContaining({
          First_Name: 'John',
          Last_Name: 'Doe',
          Email: 'john@example.com',
          Mobile: '+919876543210',
          Company: 'ABC Pvt Ltd',
          Lead_Status: 'New',
          Lead_Source: 'Portal',
          City: 'Hyderabad',
          State: 'Telangana',
          Country: 'India',
          GBC_s_Services: 'Greenpro',
        }),
      ],
    });
    expect(leadMappingModel.findOneAndUpdate).toHaveBeenCalledWith(
      {
        $or: [
          { manufacturerId: expect.any(Types.ObjectId) },
          { vendorId: expect.any(Types.ObjectId) },
          { portalUserId },
        ],
      },
      expect.objectContaining({
        $set: expect.objectContaining({
          zohoLeadId: '1110053000001280001',
          email: 'john@example.com',
          company: 'ABC Pvt Ltd',
          source: 'Portal',
          manufacturerId: expect.any(Types.ObjectId),
          vendorId: expect.any(Types.ObjectId),
        }),
        $setOnInsert: { portalUserId },
      }),
      { new: true, upsert: true },
    );
    expect(syncLogModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: 'lead.create',
        status: 'success',
        portalEntityId: manufacturerId,
        zohoModule: 'Leads',
        zohoRecordId: '1110053000001280001',
      }),
    );
    expect(result.lead).toEqual({
      module: 'Leads',
      id: '1110053000001280001',
    });
  });

  it('logs and throws when Zoho lead creation fails', async () => {
    apiClient.post.mockResolvedValue({
      ok: false,
      statusCode: 400,
      error: { message: 'Invalid data' },
    });

    await expect(
      service.createLead({
        lastName: 'Doe',
        company: 'ABC Pvt Ltd',
        manufacturerId: new Types.ObjectId().toString(),
      }),
    ).rejects.toBeInstanceOf(BadGatewayException);

    expect(syncLogModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: 'lead.create',
        status: 'failed',
        zohoModule: 'Leads',
        errorMessage: 'Invalid data',
      }),
    );
    expect(leadMappingModel.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it('throws when Zoho does not return a lead id', async () => {
    apiClient.post.mockResolvedValue({
      ok: true,
      statusCode: 201,
      data: { data: [{ status: 'success', details: {} }] },
    });

    await expect(
      service.createLead({
        lastName: 'Doe',
        company: 'ABC Pvt Ltd',
        manufacturerId: new Types.ObjectId().toString(),
      }),
    ).rejects.toBeInstanceOf(InternalServerErrorException);

    expect(syncLogModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: 'lead.create',
        status: 'failed',
      }),
    );
  });
});
