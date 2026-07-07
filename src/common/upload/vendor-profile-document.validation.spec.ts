import {
  isAllowedVendorProfileDocumentFile,
  VENDOR_PROFILE_DOCUMENT_VALIDATION_MESSAGE,
} from './vendor-profile-document.validation';

function file(
  originalname: string,
  mimetype: string,
): Express.Multer.File {
  return { originalname, mimetype } as Express.Multer.File;
}

describe('vendor-profile-document.validation', () => {
  it('uses the standardized validation message', () => {
    expect(VENDOR_PROFILE_DOCUMENT_VALIDATION_MESSAGE).toBe(
      'Only PDF, JPG, and PNG (.pdf, .jpg, .jpeg, .png) files are allowed',
    );
  });

  it.each([
    ['gst.pdf', 'application/pdf'],
    ['pan.jpg', 'image/jpeg'],
    ['pan.jpeg', 'image/jpeg'],
    ['gst.png', 'image/png'],
  ])('allows %s with %s', (originalname, mimetype) => {
    expect(isAllowedVendorProfileDocumentFile(file(originalname, mimetype))).toBe(
      true,
    );
  });

  it('allows octet-stream when extension is allowed', () => {
    expect(
      isAllowedVendorProfileDocumentFile(file('scan.pdf', 'application/octet-stream')),
    ).toBe(true);
    expect(
      isAllowedVendorProfileDocumentFile(file('pan.jpg', 'application/octet-stream')),
    ).toBe(true);
  });

  it.each([
    ['sheet.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    ['sheet.xls', 'application/vnd.ms-excel'],
    ['proposal.doc', 'application/msword'],
    ['data.csv', 'text/csv'],
    ['archive.zip', 'application/zip'],
    ['malware.exe', 'application/x-msdownload'],
    ['script.js', 'application/javascript'],
    ['spoof.pdf', 'application/javascript'],
    ['report.jpg', 'application/pdf'],
  ])('rejects %s with %s', (originalname, mimetype) => {
    expect(isAllowedVendorProfileDocumentFile(file(originalname, mimetype))).toBe(
      false,
    );
  });
});
