import { resolveRenewDocumentVersionAction } from '../../documents/helpers/certification-document-version.util';

describe('renew PP version allocation expectations', () => {
  it('labels first renew slot upload as added and later same-slot files as replaced', () => {
    expect(resolveRenewDocumentVersionAction(0)).toBe('added');
    expect(resolveRenewDocumentVersionAction(1)).toBe('replaced');
    expect(resolveRenewDocumentVersionAction(2)).toBe('replaced');
  });
});
