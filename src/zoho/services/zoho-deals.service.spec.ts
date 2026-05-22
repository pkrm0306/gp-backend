import { BadGatewayException } from '@nestjs/common';
import axios from 'axios';
import { Types } from 'mongoose';
import { ZohoDealsService } from './zoho-deals.service';

jest.mock('axios');

function queryMock<T>(result: T) {
  return {
    sort: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(result),
  };
}

function execMock<T>(result: T) {
  return {
    exec: jest.fn().mockResolvedValue(result),
  };
}

describe('ZohoDealsService', () => {
  let service: ZohoDealsService;
  let configService: { get: jest.Mock };
  let apiClient: { put: jest.Mock; post: jest.Mock };
  let dealMappingModel: {
    findOne: jest.Mock;
    findOneAndUpdate: jest.Mock;
    findByIdAndUpdate: jest.Mock;
  };
  let leadMappingModel: { findOne: jest.Mock };
  let syncLogModel: { create: jest.Mock };
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(() => {
    jest.clearAllMocks();

    configService = {
      get: jest.fn((key: string) => {
        if (key === 'ZOHO_VENDOR_CONVERT_ZAPIKEY') return 'zapikey-123';
        if (key === 'ZOHO_BASE_URL') return 'https://www.zohoapis.in';
        return undefined;
      }),
    };
    apiClient = {
      put: jest.fn(),
      post: jest.fn(),
    };
    dealMappingModel = {
      findOne: jest.fn(),
      findOneAndUpdate: jest
        .fn()
        .mockReturnValue(execMock({ _id: 'deal-map' })),
      findByIdAndUpdate: jest
        .fn()
        .mockReturnValue(execMock({ _id: 'deal-map' })),
    };
    leadMappingModel = {
      findOne: jest.fn(),
    };
    syncLogModel = {
      create: jest.fn().mockResolvedValue({ _id: 'log-1' }),
    };

    service = new ZohoDealsService(
      configService as any,
      apiClient as any,
      dealMappingModel as any,
      leadMappingModel as any,
      syncLogModel as any,
    );
  });

  it('converts a registered vendor lead and stores contact/deal/account ids', async () => {
    const manufacturerId = new Types.ObjectId().toString();
    leadMappingModel.findOne.mockReturnValue(
      queryMock({
        zohoLeadId: '1110053000001280001',
      }),
    );
    mockedAxios.post.mockResolvedValue({
      data: {
        code: 'success',
        details: {
          output: JSON.stringify({
            Contacts: '1110053000001287004',
            Deals: '1110053000001287007',
            Accounts: '1110053000001287001',
          }),
        },
      },
    });

    const result = await service.convertRegisteredVendorLead({
      manufacturerId,
      vendorInternalId: 'VEN-01',
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining(
        '/crm/v7/functions/vendor_contact/actions/execute',
      ),
      {
        data: [
          {
            Lead_id: '1110053000001280001',
            Vendor_ID: 'VEN-01',
          },
        ],
      },
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    expect(dealMappingModel.findOneAndUpdate).toHaveBeenCalledWith(
      { portalEntityId: manufacturerId },
      expect.objectContaining({
        $set: expect.objectContaining({
          portalEntityType: 'manufacturer',
          zohoLeadId: '1110053000001280001',
          zohoContactId: '1110053000001287004',
          zohoDealId: '1110053000001287007',
          zohoAccountId: '1110053000001287001',
          manufacturerId: expect.any(Types.ObjectId),
          vendorId: expect.any(Types.ObjectId),
        }),
      }),
      { new: true, upsert: true },
    );
    expect(syncLogModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: 'lead.convert.vendor-function',
        status: 'success',
        portalEntityId: manufacturerId,
        zohoRecordId: '1110053000001287007',
      }),
    );
    expect(result).toEqual({
      Contacts: '1110053000001287004',
      Deals: '1110053000001287007',
      Accounts: '1110053000001287001',
    });
  });

  it('skips vendor lead conversion when lead mapping is missing', async () => {
    leadMappingModel.findOne.mockReturnValue(queryMock(null));

    await expect(
      service.convertRegisteredVendorLead({
        manufacturerId: new Types.ObjectId().toString(),
        vendorInternalId: 'VEN-01',
      }),
    ).rejects.toBeInstanceOf(BadGatewayException);

    expect(syncLogModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: 'lead.convert.vendor-function',
        status: 'skipped',
        errorMessage: 'Zoho Lead ID mapping not found',
      }),
    );
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('updates Zoho Potentials with approved payment details', async () => {
    const manufacturerId = new Types.ObjectId().toString();
    dealMappingModel.findOne.mockReturnValue(
      queryMock({
        _id: 'deal-map-id',
        zohoDealId: '1110053000005094008',
        rawSnapshot: { existing: true },
      }),
    );
    apiClient.put.mockResolvedValue({
      ok: true,
      statusCode: 200,
      data: {
        data: [
          {
            code: 'SUCCESS',
            status: 'success',
            details: { id: '1110053000005094008' },
          },
        ],
      },
    });

    await service.updateDealPaymentDetails({
      manufacturerId,
      quoteNumber: 454545,
      gstin: '876587687y6',
      amount: 8989,
      transactionNumber: '98776654321',
      paymentMode: 'online',
    });

    expect(apiClient.put).toHaveBeenCalledWith('/crm/v8/Potentials', {
      data: [
        {
          id: '1110053000005094008',
          Quote_Number: 454545,
          GSTIN: '876587687y6',
          Amount: 8989,
          Transaction_Number: '98776654321',
          Payment_Mode: 'Online',
        },
      ],
    });
    expect(dealMappingModel.findByIdAndUpdate).toHaveBeenCalledWith(
      'deal-map-id',
      expect.objectContaining({
        $set: expect.objectContaining({
          manufacturerId: expect.any(Types.ObjectId),
          lastSyncedAt: expect.any(Date),
          rawSnapshot: expect.objectContaining({
            existing: true,
            lastPaymentUpdate: expect.objectContaining({
              id: '1110053000005094008',
              Payment_Mode: 'Online',
            }),
          }),
        }),
      }),
    );
    expect(syncLogModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: 'deal.payment.update',
        status: 'success',
        zohoModule: 'Potentials',
        zohoRecordId: '1110053000005094008',
      }),
    );
  });

  it('logs failed Zoho Potentials update', async () => {
    dealMappingModel.findOne.mockReturnValue(
      queryMock({
        _id: 'deal-map-id',
        zohoDealId: '1110053000005094008',
      }),
    );
    apiClient.put.mockResolvedValue({
      ok: false,
      statusCode: 400,
      error: { code: 'INVALID_DATA', message: 'Invalid deal update' },
    });

    await expect(
      service.updateDealPaymentDetails({
        manufacturerId: new Types.ObjectId().toString(),
        quoteNumber: 454545,
        amount: 8989,
      }),
    ).rejects.toBeInstanceOf(BadGatewayException);

    expect(syncLogModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: 'deal.payment.update',
        status: 'failed',
        errorCode: 'INVALID_DATA',
        errorMessage: 'Invalid deal update',
      }),
    );
  });
});
