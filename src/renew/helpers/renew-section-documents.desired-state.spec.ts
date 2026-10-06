import { Types } from 'mongoose';
import {
  applyRenewSectionDocumentKeepList,
  resolveRenewDocumentIdRefs,
  renewDocumentMatchesIdRefs,
} from './renew-section-documents.util';

describe('renew DesiredState keep-list (Phase renew parity)', () => {
  const id = (hex: string) => new Types.ObjectId(hex.padEnd(24, '0'));

  it('resolveRenewDocumentIdRefs parses numeric keep IDs', () => {
    const refs = resolveRenewDocumentIdRefs(['10', '11']);
    expect(refs.productDocumentIds).toEqual([10, 11]);
  });

  it('renewDocumentMatchesIdRefs matches productDocumentId', () => {
    expect(
      renewDocumentMatchesIdRefs(
        { productDocumentId: 5 },
        { objectIds: [], productDocumentIds: [5] },
      ),
    ).toBe(true);
    expect(
      renewDocumentMatchesIdRefs(
        { productDocumentId: 9 },
        { objectIds: [], productDocumentIds: [5] },
      ),
    ).toBe(false);
  });

  it('applyRenewSectionDocumentKeepList soft-deletes unkept with historyHidden', async () => {
    const live = [
      {
        _id: id('aaaa1111'),
        productDocumentId: 1,
        documentFormSubsection: 'wm_supporting_documents',
        documentLink: 'a.pdf',
      },
      {
        _id: id('aaaa2222'),
        productDocumentId: 2,
        documentFormSubsection: 'wm_supporting_documents',
        documentLink: 'b.pdf',
      },
    ];
    const updateOne = jest.fn().mockResolvedValue({});
    const updateMany = jest.fn().mockResolvedValue({});
    const find = jest.fn().mockReturnValue({
      session: jest.fn().mockResolvedValue(live),
    });
    const renewDocumentModel = { find, updateOne, updateMany } as any;
    const trackAllProductDocument = jest.fn().mockResolvedValue(undefined);

    const links = await applyRenewSectionDocumentKeepList({
      renewDocumentModel,
      documentVersioningService: { trackAllProductDocument } as any,
      urnNo: 'URN-1',
      vendorObjectId: id('bbbb1111'),
      renewalCycleObjectId: id('cccc1111'),
      cycleNo: 1,
      sectionKey: 'process_waste_management' as any,
      existingDocumentIds: ['1'],
      urnStatus: 1,
      now: new Date(),
      session: {} as any,
    });

    expect(links).toEqual(['b.pdf']);
    expect(updateMany).toHaveBeenCalled();
    const setArg = updateMany.mock.calls[0][1].$set;
    expect(setArg.isDeleted).toBe(true);
    expect(setArg.historyHidden).toBe(true);
  });

  it('subsectionFilter isolates SEA from QM keep sync', async () => {
    const live = [
      {
        _id: id('dddd1111'),
        productDocumentId: 1,
        documentFormSubsection: 'sea_supporting_documents',
        documentLink: 'sea.pdf',
      },
      {
        _id: id('dddd2222'),
        productDocumentId: 2,
        documentFormSubsection: 'qm_supporting_documents',
        documentLink: 'qm.pdf',
      },
    ];
    const updateOne = jest.fn().mockResolvedValue({});
    const updateMany = jest.fn().mockResolvedValue({});
    const find = jest.fn().mockReturnValue({
      session: jest.fn().mockResolvedValue(live),
    });
    const renewDocumentModel = { find, updateOne, updateMany } as any;

    const links = await applyRenewSectionDocumentKeepList({
      renewDocumentModel,
      documentVersioningService: {
        trackAllProductDocument: jest.fn().mockResolvedValue(undefined),
      } as any,
      urnNo: 'URN-1',
      vendorObjectId: id('eeee1111'),
      renewalCycleObjectId: id('ffff1111'),
      cycleNo: 1,
      sectionKey: 'process_product_stewardship' as any,
      existingDocumentIds: [],
      subsectionFilter: 'sea_supporting_documents',
      urnStatus: 1,
      now: new Date(),
      session: {} as any,
    });

    // Only SEA should be removed when keep=[] + SEA filter; QM untouched.
    expect(links).toEqual(['sea.pdf']);
    expect(updateMany).toHaveBeenCalled();
  });
});
