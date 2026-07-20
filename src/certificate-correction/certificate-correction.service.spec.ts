import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

jest.mock('../product-registration/services/vendor-certificate.service', () => ({
  VendorCertificateService: class VendorCertificateService {},
}));

import { CertificateCorrectionService } from './certificate-correction.service';

describe('CertificateCorrectionService', () => {
  const productId = new Types.ObjectId();
  const manufacturerId = new Types.ObjectId();
  const stateId = new Types.ObjectId();
  const countryId = new Types.ObjectId();

  function makeService(overrides?: {
    product?: Record<string, unknown> | null;
    plants?: Array<Record<string, unknown>>;
    conflict?: Record<string, unknown> | null;
  }) {
    const product =
      overrides && 'product' in overrides
        ? overrides.product
        : {
            _id: productId,
            eoiNo: 'GPGS123456',
            productName: 'Widget',
            manufacturerId,
            productStatus: 2,
            validtillDate: new Date('2026-12-31T00:00:00.000Z'),
            save: jest.fn().mockResolvedValue(undefined),
          };

    const plants =
      overrides?.plants ??
      [
        {
          productPlantId: 101,
          manufacturerId,
          stateId,
          countryId,
          city: 'Hyderabad',
          additionalPlantInfo: 'Plant A',
          eoiNo: 'GPGS123456',
          save: jest.fn().mockResolvedValue(undefined),
        },
      ];

    const session = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    const productModel = {
      findOne: jest.fn().mockImplementation((query: Record<string, unknown>) => {
        const idFilter = query?._id as { $ne?: unknown } | undefined;
        const chain: Record<string, unknown> = {};
        const api = {
          lean: () => ({
            exec: async () => {
              if (query?.eoiNo === 'MISSING') return null;
              if (idFilter?.$ne) {
                if (query?.eoiNo === 'GPGS999999' && overrides?.conflict) {
                  return overrides.conflict;
                }
                return null;
              }
              return product ?? null;
            },
          }),
          session: () => api,
          exec: async () => {
            if (!product || query?.eoiNo === 'MISSING') return null;
            // Uniqueness check path (always includes _id.$ne)
            if (idFilter?.$ne) {
              if (
                query?.eoiNo === 'GPGS999999' &&
                overrides?.conflict
              ) {
                return overrides.conflict;
              }
              return null;
            }
            return product;
          },
        };
        Object.assign(chain, api);
        return api;
      }),
    };

    const productPlantModel = {
      find: jest.fn().mockImplementation(() => {
        const api = {
          sort: () => api,
          lean: () => ({
            exec: async () =>
              plants.map(({ save: _s, ...rest }) => rest),
          }),
          session: () => api,
          exec: async () => plants,
        };
        return api;
      }),
    };

    const manufacturerModel = {
      find: jest.fn().mockReturnValue({
        select: () => ({
          sort: () => ({
            lean: () => ({
              exec: async () => [
                { _id: manufacturerId, manufacturerName: 'ABC Ltd' },
              ],
            }),
          }),
        }),
      }),
    };

    const countryModel = {
      findOne: jest.fn().mockReturnValue({
        select: () => ({
          lean: () => ({
            exec: async () => ({ _id: countryId }),
          }),
        }),
      }),
    };

    const statesService = {
      findAll: jest.fn().mockResolvedValue([{ _id: stateId, name: 'Telangana' }]),
    };

    const vendorCertificateService = {
      regenerateCertificatePdfByEoiNo: jest.fn().mockResolvedValue({
        buffer: Buffer.from('%PDF'),
        fileName: 'test.pdf',
        contentType: 'application/pdf',
      }),
    };

    const connection = {
      startSession: jest.fn().mockResolvedValue(session),
    };

    const service = new CertificateCorrectionService(
      connection as never,
      productModel as never,
      productPlantModel as never,
      manufacturerModel as never,
      countryModel as never,
      statesService as never,
      vendorCertificateService as never,
    );

    return { service, product, plants, session };
  }

  it('getByEoi throws 404 when missing', async () => {
    const { service } = makeService({ product: null });
    await expect(service.getByEoi('MISSING')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('getByEoi rejects non-certified products', async () => {
    const { service } = makeService({
      product: {
        _id: productId,
        eoiNo: 'GPGS123456',
        productName: 'Widget',
        manufacturerId,
        productStatus: 0,
        validtillDate: new Date('2026-12-31T00:00:00.000Z'),
      },
    });
    await expect(service.getByEoi('GPGS123456')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('update rejects manufacturer change', async () => {
    const { service } = makeService();
    await expect(
      service.update({
        eoi: 'GPGS123456',
        neweoi: 'GPGS123456',
        product: 'Widget',
        manufacturer: new Types.ObjectId().toHexString(),
        valid_date: '2026-12-31',
        plants: [
          {
            product_plant_id: 101,
            state: stateId.toHexString(),
            city: 'Hyderabad',
            additional_plant_info: 'Plant A',
          },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('update rejects duplicate new EOI', async () => {
    const { service } = makeService({
      conflict: { _id: new Types.ObjectId(), eoiNo: 'GPGS999999' },
    });
    await expect(
      service.update({
        eoi: 'GPGS123456',
        neweoi: 'GPGS999999',
        product: 'Widget',
        manufacturer: manufacturerId.toHexString(),
        valid_date: '2026-12-31',
        plants: [
          {
            product_plant_id: 101,
            state: stateId.toHexString(),
            city: 'Hyderabad',
          },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('update saves product and plants on success', async () => {
    const { service, product, plants, session } = makeService();
    const result = await service.update({
      eoi: 'GPGS123456',
      neweoi: 'GPGS123457',
      product: 'Updated Widget',
      manufacturer: manufacturerId.toHexString(),
      valid_date: '2027-01-15',
      plants: [
        {
          product_plant_id: 101,
          state: stateId.toHexString(),
          city: 'Chennai',
          additional_plant_info: 'Unit 2',
        },
      ],
    });

    expect(result.message).toContain('updated successfully');
    expect(result.previewUrl).toContain('GPGS123457');
    expect((product as { eoiNo: string }).eoiNo).toBe('GPGS123457');
    expect((product as { productName: string }).productName).toBe(
      'Updated Widget',
    );
    expect((product as { save: jest.Mock }).save).toHaveBeenCalled();
    expect(plants[0].city).toBe('Chennai');
    expect(plants[0].additionalPlantInfo).toBe('Unit 2');
    expect(plants[0].save).toHaveBeenCalled();
    expect(session.commitTransaction).toHaveBeenCalled();
  });
});
