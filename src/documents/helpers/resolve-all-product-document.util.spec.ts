import { Types } from 'mongoose';
import {
  buildAllProductDocumentLookupFilter,
  findAllProductDocumentByIdParam,
} from './resolve-all-product-document.util';

describe('resolve-all-product-document.util', () => {
  it('builds numeric productDocumentId filter', () => {
    expect(buildAllProductDocumentLookupFilter('1428')).toEqual({
      productDocumentId: 1428,
    });
  });

  it('builds ObjectId filter for 24-char hex', () => {
    const id = '6a33b7dd5bcebf841cc5f469';
    expect(buildAllProductDocumentLookupFilter(id)).toEqual({
      _id: new Types.ObjectId(id),
    });
  });

  it('findAllProductDocumentByIdParam returns null for invalid id', async () => {
    const findOne = jest.fn();
    const model = { findOne } as any;
    findOne.mockReturnValue({
      lean: () => ({
        exec: async () => null,
      }),
    });

    const result = await findAllProductDocumentByIdParam(model, 'not-an-id');
    expect(result).toBeNull();
    expect(findOne).not.toHaveBeenCalled();
  });
});
