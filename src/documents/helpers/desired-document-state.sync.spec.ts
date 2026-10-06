import { Types } from 'mongoose';
import {
  docMatchesDesiredKeepRefs,
  partitionLiveDocumentsForDesiredState,
  type DocumentIdKeepRefs,
} from './desired-document-state.sync';

describe('desired-document-state.sync', () => {
  const id = (hex: string) => new Types.ObjectId(hex.padEnd(24, '0'));

  const keepRefs = (productDocumentIds: number[]): DocumentIdKeepRefs => ({
    objectIds: [],
    productDocumentIds,
  });

  it('retains all when keepRefs is null (omit keep list)', () => {
    const live = [
      { _id: id('a'), productDocumentId: 1, documentLink: 'a.pdf' },
      { _id: id('b'), productDocumentId: 2, documentLink: 'b.pdf' },
    ];
    const part = partitionLiveDocumentsForDesiredState(live, null);
    expect(part.retain).toHaveLength(2);
    expect(part.remove).toHaveLength(0);
  });

  it('retains keep IDs and removes others even when uploads would have been present', () => {
    const live = [
      { _id: id('a'), productDocumentId: 10, documentLink: 'keep.pdf' },
      { _id: id('b'), productDocumentId: 11, documentLink: 'drop.pdf' },
    ];
    const part = partitionLiveDocumentsForDesiredState(live, keepRefs([10]));
    expect(part.retain.map((d) => d.productDocumentId)).toEqual([10]);
    expect(part.remove.map((d) => d.productDocumentId)).toEqual([11]);
    expect(part.oldFileLinks).toEqual(['drop.pdf']);
  });

  it('20 → save → retain 20', () => {
    const live = Array.from({ length: 20 }, (_, i) => ({
      _id: id(String(i + 1)),
      productDocumentId: i + 1,
      documentLink: `f${i + 1}.pdf`,
    }));
    const part = partitionLiveDocumentsForDesiredState(
      live,
      keepRefs(live.map((d) => d.productDocumentId)),
    );
    expect(part.retain).toHaveLength(20);
    expect(part.remove).toHaveLength(0);
  });

  it('20 → add 6 keep set → retain 20 (new files appended by caller → 26)', () => {
    const live = Array.from({ length: 20 }, (_, i) => ({
      _id: id(String(i + 1)),
      productDocumentId: i + 1,
    }));
    const part = partitionLiveDocumentsForDesiredState(
      live,
      keepRefs(live.map((d) => d.productDocumentId)),
    );
    expect(part.retain).toHaveLength(20);
    expect(part.remove).toHaveLength(0);
    expect(part.retain.length + 6).toBe(26);
  });

  it('20 → delete 2 → save → 18', () => {
    const live = Array.from({ length: 20 }, (_, i) => ({
      _id: id(String(i + 1)),
      productDocumentId: i + 1,
    }));
    const keep = live.slice(0, 18).map((d) => d.productDocumentId);
    const part = partitionLiveDocumentsForDesiredState(live, keepRefs(keep));
    expect(part.retain).toHaveLength(18);
    expect(part.remove.map((d) => d.productDocumentId)).toEqual([19, 20]);
  });

  it('20 → add 6 → delete 2 → retain 18 (+6 uploads → 24)', () => {
    const live = Array.from({ length: 20 }, (_, i) => ({
      _id: id(String(i + 1)),
      productDocumentId: i + 1,
    }));
    const keep = live.slice(0, 18).map((d) => d.productDocumentId);
    const part = partitionLiveDocumentsForDesiredState(live, keepRefs(keep));
    expect(part.retain).toHaveLength(18);
    expect(part.retain.length + 6).toBe(24);
  });

  it('26 → delete all → keep=[] removes all live → 0', () => {
    const live = Array.from({ length: 26 }, (_, i) => ({
      _id: id(String(i + 1)),
      productDocumentId: i + 1,
    }));
    const part = partitionLiveDocumentsForDesiredState(live, keepRefs([]));
    expect(part.retain).toHaveLength(0);
    expect(part.remove).toHaveLength(26);
  });

  it('20 existing + 26 new keep → retain 20 (+26 uploads → 46)', () => {
    const live = Array.from({ length: 20 }, (_, i) => ({
      _id: id(String(i + 1)),
      productDocumentId: i + 1,
    }));
    const part = partitionLiveDocumentsForDesiredState(
      live,
      keepRefs(live.map((d) => d.productDocumentId)),
    );
    expect(part.retain.length + 26).toBe(46);
  });

  it('eco DesiredState does not remove supporting docs (independent partitions)', () => {
    const ecoLive = [
      { _id: id('aaaa1111'), productDocumentId: 1 },
      { _id: id('aaaa2222'), productDocumentId: 2 },
    ];
    const supportingLive = [
      { _id: id('bbbb1111'), productDocumentId: 10 },
      { _id: id('bbbb2222'), productDocumentId: 11 },
    ];
    const ecoPart = partitionLiveDocumentsForDesiredState(ecoLive, keepRefs([1]));
    const supportingPart = partitionLiveDocumentsForDesiredState(
      supportingLive,
      null,
    );
    expect(ecoPart.retain.map((d) => d.productDocumentId)).toEqual([1]);
    expect(ecoPart.remove.map((d) => d.productDocumentId)).toEqual([2]);
    expect(supportingPart.retain).toHaveLength(2);
    expect(supportingPart.remove).toHaveLength(0);
  });

  it('supporting DesiredState does not remove eco docs', () => {
    const ecoLive = [
      { _id: id('cccc1111'), productDocumentId: 1 },
      { _id: id('cccc2222'), productDocumentId: 2 },
    ];
    const supportingLive = [
      { _id: id('dddd1111'), productDocumentId: 10 },
      { _id: id('dddd2222'), productDocumentId: 11 },
    ];
    const ecoPart = partitionLiveDocumentsForDesiredState(ecoLive, null);
    const supportingPart = partitionLiveDocumentsForDesiredState(
      supportingLive,
      keepRefs([10]),
    );
    expect(ecoPart.retain).toHaveLength(2);
    expect(supportingPart.retain.map((d) => d.productDocumentId)).toEqual([10]);
    expect(supportingPart.remove.map((d) => d.productDocumentId)).toEqual([11]);
  });

  it('docMatchesDesiredKeepRefs matches productDocumentId', () => {
    expect(
      docMatchesDesiredKeepRefs(
        { productDocumentId: 5 },
        { objectIds: [], productDocumentIds: [5, 6] },
      ),
    ).toBe(true);
    expect(
      docMatchesDesiredKeepRefs(
        { productDocumentId: 9 },
        { objectIds: [], productDocumentIds: [5] },
      ),
    ).toBe(false);
  });
});
