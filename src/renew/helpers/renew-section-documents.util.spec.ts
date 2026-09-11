import { Types } from 'mongoose';
import { DocumentSectionKey } from '../../common/constants/document-section-key.constants';
import {
  resolveRenewDocumentVersionAction,
} from '../../documents/helpers/certification-document-version.util';
import {
  assertRenewDocumentMatchesCycle,
  buildRenewSectionDocMigrationFilter,
  renewDocumentMatchesIdRefs,
  resolveRenewDocumentIdRefs,
} from './renew-section-documents.util';

describe('renew-section-documents.util', () => {
  const cycleId = new Types.ObjectId();

  it('versions every renew upload regardless of urn status', () => {
    expect(resolveRenewDocumentVersionAction(0)).toBe('added');
    expect(resolveRenewDocumentVersionAction(1)).toBe('replaced');
    expect(resolveRenewDocumentVersionAction(4)).toBe('replaced');
  });

  it('matches productDocumentId keep refs', () => {
    const refs = resolveRenewDocumentIdRefs(['21', '22']);
    expect(
      renewDocumentMatchesIdRefs({ productDocumentId: 21 }, refs),
    ).toBe(true);
    expect(
      renewDocumentMatchesIdRefs({ productDocumentId: 99 }, refs),
    ).toBe(false);
  });

  it('strict cycle filter excludes legacy null renewalCycleId rows', () => {
    const filter = buildRenewSectionDocMigrationFilter(
      'URN-1',
      cycleId,
      DocumentSectionKey.PROCESS_MANUFACTURING,
      true,
    );
    expect(filter).toEqual({
      urnNo: 'URN-1',
      documentForm: DocumentSectionKey.PROCESS_MANUFACTURING,
      isDeleted: { $ne: true },
      renewalCycleId: cycleId,
    });
  });

  it('rejects delete when document cycle differs on cycle 2+', () => {
    const otherCycle = new Types.ObjectId();
    expect(() =>
      assertRenewDocumentMatchesCycle(
        { renewalCycleId: otherCycle },
        cycleId,
        2,
      ),
    ).toThrow(/renewalCycleId does not match document cycle/);
  });
});
