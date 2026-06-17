import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { AdminAddProductToUrnService } from './admin-add-product-to-urn.service';

describe('AdminAddProductToUrnService', () => {
  const urnNo = 'URN-20260528142848';
  const adminUserId = new Types.ObjectId().toHexString();
  const categoryId = new Types.ObjectId();
  const manufacturerId = new Types.ObjectId();
  const vendorId = new Types.ObjectId();
  const productObjectId = new Types.ObjectId();

  let findLeanExec: jest.Mock;
  let countDocuments: jest.Mock;
  let categoryFindById: jest.Mock;
  let manufacturerFindById: jest.Mock;
  let assignNextActiveEoiNo: jest.Mock;
  let getProductId: jest.Mock;
  let getProductPlantId: jest.Mock;
  let productCreate: jest.Mock;
  let plantCreate: jest.Mock;
  let plantFind: jest.Mock;
  let auditRecord: jest.Mock;
  let startSession: jest.Mock;
  let certificationPaymentCount: jest.Mock;
  let service: AdminAddProductToUrnService;
  let countryId: string;
  let stateId: string;

  beforeEach(() => {
    countryId = new Types.ObjectId().toHexString();
    stateId = new Types.ObjectId().toHexString();
    findLeanExec = jest.fn().mockResolvedValue([
      {
        _id: productObjectId,
        categoryId,
        manufacturerId,
        vendorId,
        urnStatus: 1,
        productStatus: 0,
        productRenewStatus: 0,
      },
    ]);
    countDocuments = jest.fn().mockResolvedValue(1);
    categoryFindById = jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ categoryName: 'Copper Tubes' }),
      }),
    });
    manufacturerFindById = jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ manufacturerName: 'prabha vendor' }),
      }),
    });
    assignNextActiveEoiNo = jest.fn().mockResolvedValue({
      eoiNo: 'GPPMI003006',
      eoiSequence: 6,
    });
    getProductId = jest.fn().mockResolvedValue(501);
    getProductPlantId = jest.fn().mockResolvedValue(9001);
    productCreate = jest.fn().mockResolvedValue([
      { _id: new Types.ObjectId(), productId: 501 },
    ]);
    plantCreate = jest.fn().mockResolvedValue([]);
    plantFind = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([]),
          }),
        }),
      }),
    });
    auditRecord = jest.fn().mockResolvedValue(undefined);
    certificationPaymentCount = jest.fn().mockResolvedValue(0);

    const session = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
    startSession = jest.fn().mockResolvedValue(session);

    service = new AdminAddProductToUrnService(
      {
        find: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({ exec: findLeanExec }),
          }),
        }),
        countDocuments: jest.fn().mockReturnValue({ exec: countDocuments }),
        create: productCreate,
      } as never,
      {
        find: plantFind,
        create: plantCreate,
      } as never,
      { findById: categoryFindById } as never,
      { findById: manufacturerFindById } as never,
      {
        startSession,
        db: {
          collection: jest.fn().mockReturnValue({
            countDocuments: certificationPaymentCount,
          }),
        },
      } as never,
      { assignNextActiveEoiNo } as never,
      {
        getProductId,
        getProductPlantId,
      } as never,
      {
        findById: jest.fn().mockResolvedValue({ _id: countryId }),
      } as never,
      {
        findById: jest.fn().mockResolvedValue({ countryId }),
      } as never,
      { record: auditRecord } as never,
      {
        deleteByPattern: jest.fn().mockResolvedValue(undefined),
        buildKey: jest.fn((...parts: string[]) => parts.join(':')),
      } as never,
    );
  });

  it('returns context for eligible URN', async () => {
    const result = await service.getAddProductContext(urnNo);
    expect(result.canAddProduct).toBe(true);
    expect(result.categoryName).toBe('Copper Tubes');
    expect(result.urnStatus).toBe(1);
  });

  it('throws 404 when URN has no active products', async () => {
    findLeanExec.mockResolvedValue([]);
    await expect(service.getAddProductContext(urnNo)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('adds product with next active EOI', async () => {
    const result = await service.addProductToUrn(
      urnNo,
      {
        productName: 'New solar panel model',
        productDetails: 'desc',
        plants: [
          {
            plantName: 'Plant A',
            plantLocation: '123 Industrial Area',
            countryId,
            stateId,
            city: 'Hyderabad',
          },
        ],
      },
      adminUserId,
    );

    expect(result.eoiNo).toBe('GPPMI003006');
    expect(result.urnStatus).toBe(1);
    expect(result.productStatus).toBe(0);
    expect(assignNextActiveEoiNo).toHaveBeenCalled();
    expect(auditRecord).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'admin_add_product_to_urn' }),
    );
  });

  it('blocks add-product when certification fee exists', async () => {
    certificationPaymentCount.mockResolvedValue(1);
    await expect(
      service.addProductToUrn(
        urnNo,
        {
          productName: 'Late product',
          productDetails: 'desc',
          plants: [
            {
              plantName: 'Plant A',
              plantLocation: '123 Industrial Area',
              countryId,
              stateId,
              city: 'Hyderabad',
            },
          ],
        },
        adminUserId,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects wrong categoryId in body', async () => {
    await expect(
      service.addProductToUrn(
        urnNo,
        {
          productName: 'x',
          productDetails: 'y',
          categoryId: new Types.ObjectId().toHexString(),
          plants: [
            {
              plantName: 'Plant A',
              plantLocation: 'loc',
              countryId: new Types.ObjectId().toHexString(),
              stateId: new Types.ObjectId().toHexString(),
              city: 'Hyderabad',
            },
          ],
        },
        adminUserId,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
