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
    /** When duplicate EOIs exist, certified row returned for status-2 lookups. */
    certifiedProduct?: Record<string, unknown> | null;
    plants?: Array<Record<string, unknown>>;
    conflict?: Record<string, unknown> | null;
  }) {
    const certifiedProduct =
      overrides && 'certifiedProduct' in overrides
        ? overrides.certifiedProduct
        : overrides && 'product' in overrides
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

    const resolveProductForQuery = (query: Record<string, unknown>) => {
      if (query?.eoiNo === 'MISSING') return null;

      const idFilter = query?._id as { $ne?: unknown } | undefined;
      if (idFilter?.$ne) {
        if (query?.eoiNo === 'GPGS999999' && overrides?.conflict) {
          return overrides.conflict;
        }
        return null;
      }

      const wantsCertified = Number(query?.productStatus) === 2;

      if (wantsCertified) {
        if (
          certifiedProduct &&
          Number((certifiedProduct as { productStatus?: number }).productStatus) === 2
        ) {
          return certifiedProduct;
        }
        return null;
      }

      return certifiedProduct ?? null;
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
        const chain: Record<string, unknown> = {};
        const api = {
          sort: () => api,
          lean: () => ({
            exec: async () => resolveProductForQuery(query),
          }),
          session: () => api,
          exec: async () => resolveProductForQuery(query),
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

    return { service, product: certifiedProduct, plants, session };
  }

  it('getByEoi throws 404 when missing', async () => {
    const { service } = makeService({ certifiedProduct: null });
    await expect(service.getByEoi('MISSING')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('getByEoi throws 404 when only non-certified products exist', async () => {
    const { service } = makeService({
      certifiedProduct: {
        _id: productId,
        eoiNo: 'GPGS123456',
        productName: 'Widget',
        manufacturerId,
        productStatus: 3,
        validtillDate: new Date('2026-12-31T00:00:00.000Z'),
      },
    });
    await expect(service.getByEoi('GPGS123456')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('getByEoi returns certified product when duplicate EOIs exist', async () => {
    const certifiedId = new Types.ObjectId();
    const { service } = makeService({
      certifiedProduct: {
        _id: certifiedId,
        eoiNo: 'GPMC031655',
        productName: 'Grass Pavers',
        manufacturerId,
        productStatus: 2,
        validtillDate: new Date('2027-07-20T00:00:00.000Z'),
      },
      plants: [
        {
          productPlantId: 201,
          manufacturerId,
          stateId,
          countryId,
          city: 'Chennai',
          additionalPlantInfo: '',
          eoiNo: 'GPMC031655',
        },
      ],
    });

    const result = await service.getByEoi('GPMC031655');
    expect(result.eoi_no).toBe('GPMC031655');
    expect(result.product_name).toBe('Grass Pavers');
    expect(result.plants).toHaveLength(1);
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

  it('update targets certified product when duplicate EOIs exist', async () => {
    const certifiedId = new Types.ObjectId();
    const { service, product } = makeService({
      certifiedProduct: {
        _id: certifiedId,
        eoiNo: 'GPMC031655',
        productName: 'Grass Pavers',
        manufacturerId,
        productStatus: 2,
        validtillDate: new Date('2027-07-20T00:00:00.000Z'),
        save: jest.fn().mockResolvedValue(undefined),
      },
      plants: [
        {
          productPlantId: 201,
          manufacturerId,
          stateId,
          countryId,
          city: 'Chennai',
          additionalPlantInfo: '',
          eoiNo: 'GPMC031655',
          save: jest.fn().mockResolvedValue(undefined),
        },
      ],
    });

    await service.update({
      eoi: 'GPMC031655',
      neweoi: 'GPMC031655',
      product: 'Grass Pavers Updated',
      manufacturer: manufacturerId.toHexString(),
      valid_date: '2027-07-20',
      plants: [
        {
          product_plant_id: 201,
          state: stateId.toHexString(),
          city: 'Chennai',
        },
      ],
    });

    expect(String((product as { _id: Types.ObjectId })._id)).toBe(
      String(certifiedId),
    );
    expect((product as { productName: string }).productName).toBe(
      'Grass Pavers Updated',
    );
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
