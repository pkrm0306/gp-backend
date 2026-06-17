import {
  isAllowedStandardDocumentFile,
  STANDARD_DOCUMENT_VALIDATION_MESSAGE,
  assertStandardDocumentFileTypes,
} from './document-upload.validation';

function file(
  originalname: string,
  mimetype: string,
): Express.Multer.File {
  return { originalname, mimetype } as Express.Multer.File;
}

describe('document-upload.validation', () => {
  it('uses the standardized validation message', () => {
    expect(STANDARD_DOCUMENT_VALIDATION_MESSAGE).toBe(
      'Only PDF, JPG, JPEG, PNG, DOC, and DOCX files are allowed',
    );
  });

  it.each([
    ['report.pdf', 'application/pdf'],
    ['photo.jpg', 'image/jpeg'],
    ['photo.jpeg', 'image/jpeg'],
    ['photo.png', 'image/png'],
    ['proposal.doc', 'application/msword'],
    ['proposal.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ])('allows %s with %s', (originalname, mimetype) => {
    expect(isAllowedStandardDocumentFile(file(originalname, mimetype))).toBe(
      true,
    );
  });

  it('allows octet-stream when extension is allowed', () => {
    expect(
      isAllowedStandardDocumentFile(file('scan.pdf', 'application/octet-stream')),
    ).toBe(true);
  });

  it.each([
    ['sheet.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    ['sheet.xls', 'application/vnd.ms-excel'],
    ['data.csv', 'text/csv'],
    ['archive.zip', 'application/zip'],
    ['archive.rar', 'application/vnd.rar'],
    ['malware.exe', 'application/x-msdownload'],
    ['script.js', 'application/javascript'],
    ['spoof.pdf', 'application/javascript'],
    ['report.xlsx', 'application/pdf'],
  ])('rejects %s with %s', (originalname, mimetype) => {
    expect(isAllowedStandardDocumentFile(file(originalname, mimetype))).toBe(
      false,
    );
  });

  it('assertStandardDocumentFileTypes throws standardized message', () => {
    expect(() =>
      assertStandardDocumentFileTypes([file('bad.zip', 'application/zip')]),
    ).toThrow(STANDARD_DOCUMENT_VALIDATION_MESSAGE);
  });
});
