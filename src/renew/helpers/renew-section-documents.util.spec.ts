import { Types } from 'mongoose';
import { DocumentSectionKey } from '../../common/constants/document-section-key.constants';
import { RENEWAL_URN_STATUS } from '../constants/renewal-urn-status.constants';
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

  it('skips renew version tracking before admin resend', () => {
    expect(
      resolveRenewDocumentVersionAction(0, RENEWAL_URN_STATUS.PAYMENT_APPROVED),
    ).toBeNull();
    expect(
      resolveRenewDocumentVersionAction(2, RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS),
    ).toBeNull();
  });

  it('tracks renew versions only after admin resend', () => {
    const resubmit = RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING;
    expect(resolveRenewDocumentVersionAction(0, resubmit)).toBe('added');
    expect(resolveRenewDocumentVersionAction(1, resubmit)).toBe('replaced');
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
