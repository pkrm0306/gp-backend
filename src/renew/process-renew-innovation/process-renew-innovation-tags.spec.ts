import {
  normalizeInnovationDocumentTag,
  parseInnovationDocumentTagsForUpload,
} from '../../process-innovation/utils/innovation-document-tag.util';
import { renewSectionDocumentSlotKeyMode } from '../helpers/renew-section-documents.util';
import { DocumentSectionKey } from '../../common/constants/document-section-key.constants';

describe('Renew innovation document tags', () => {
  it('parses Tech/Process/Social tags for multipart upload order', () => {
    const tags = parseInnovationDocumentTagsForUpload(
      JSON.stringify(['tech', 'process', 'social']),
      3,
    );
    expect(tags).toEqual(['tech', 'process', 'social']);
    expect(normalizeInnovationDocumentTag('Process')).toBe('process');
    expect(normalizeInnovationDocumentTag('SOCIAL')).toBe('social');
  });

  it('keeps Innovation versioning as subsection stream (not tag-split)', () => {
    expect(
      renewSectionDocumentSlotKeyMode(DocumentSectionKey.PROCESS_INNOVATION),
    ).toBe('subsection');
  });
});
