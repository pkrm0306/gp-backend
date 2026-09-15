import {
  certificationSlotKey,
  certificationSlotKeyModeForSection,
  resolveCertificationVersionAction,
} from './certification-document-version.util';
import { DocumentSectionKey } from '../../common/constants/document-section-key.constants';

describe('resolveCertificationVersionAction', () => {
  it('returns added for the first upload into an empty slot', () => {
    expect(resolveCertificationVersionAction(0, false)).toBe('added');
    expect(resolveCertificationVersionAction(0, true)).toBe('added');
  });

  it('returns replaced when the slot already has live docs', () => {
    expect(resolveCertificationVersionAction(1, false)).toBe('replaced');
    expect(resolveCertificationVersionAction(2, true)).toBe('replaced');
  });
});

describe('certificationSlotKeyModeForSection', () => {
  it('versions Innovation as one subsection stream (not per documentTag)', () => {
    expect(
      certificationSlotKeyModeForSection(DocumentSectionKey.PROCESS_INNOVATION),
    ).toBe('subsection');
    expect(
      certificationSlotKey(
        DocumentSectionKey.PROCESS_INNOVATION,
        'innovation_implementation_documents',
        'tech',
      ),
    ).toBe('innovation_implementation_documents');
    expect(
      certificationSlotKey(
        DocumentSectionKey.PROCESS_INNOVATION,
        'innovation_implementation_documents',
        'social',
      ),
    ).toBe('innovation_implementation_documents');
  });
});

/**
 * Every file in a batch gets a History row under the same lifecycle version.
 * Version numbers themselves are owned by Admin Resend / renew start.
 */
function actionsForBatch(priorInSlot: number, batchSize: number, isResubmit: boolean) {
  const actions: Array<string | null> = [];
  for (let i = 0; i < batchSize; i += 1) {
    actions.push(resolveCertificationVersionAction(priorInSlot, isResubmit));
  }
  return actions;
}

describe('certification batch version stamps', () => {
  it('first submit of 3 files stamps added for each file (same lifecycle Vn)', () => {
    expect(actionsForBatch(0, 3, false)).toEqual(['added', 'added', 'added']);
  });

  it('resubmit/replace upload of 3 files stamps replaced for each file', () => {
    expect(actionsForBatch(1, 3, true)).toEqual([
      'replaced',
      'replaced',
      'replaced',
    ]);
    expect(actionsForBatch(2, 3, false)).toEqual([
      'replaced',
      'replaced',
      'replaced',
    ]);
  });

  it('single-file replace stamps one replaced version', () => {
    expect(actionsForBatch(1, 1, true)).toEqual(['replaced']);
  });
});
