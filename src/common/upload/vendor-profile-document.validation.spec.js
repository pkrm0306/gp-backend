"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vendor_profile_document_validation_1 = require("./vendor-profile-document.validation");
function file(originalname, mimetype) {
    return { originalname: originalname, mimetype: mimetype };
}
describe('vendor-profile-document.validation', function () {
    it('uses the standardized validation message', function () {
        expect(vendor_profile_document_validation_1.VENDOR_PROFILE_DOCUMENT_VALIDATION_MESSAGE).toBe('Only PDF, JPG, and PNG (.pdf, .jpg, .jpeg, .png) files are allowed');
    });
    it.each([
        ['gst.pdf', 'application/pdf'],
        ['pan.jpg', 'image/jpeg'],
        ['pan.jpeg', 'image/jpeg'],
        ['gst.png', 'image/png'],
    ])('allows %s with %s', function (originalname, mimetype) {
        expect((0, vendor_profile_document_validation_1.isAllowedVendorProfileDocumentFile)(file(originalname, mimetype))).toBe(true);
    });
    it('allows octet-stream when extension is allowed', function () {
        expect((0, vendor_profile_document_validation_1.isAllowedVendorProfileDocumentFile)(file('scan.pdf', 'application/octet-stream'))).toBe(true);
        expect((0, vendor_profile_document_validation_1.isAllowedVendorProfileDocumentFile)(file('pan.jpg', 'application/octet-stream'))).toBe(true);
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
    ])('rejects %s with %s', function (originalname, mimetype) {
        expect((0, vendor_profile_document_validation_1.isAllowedVendorProfileDocumentFile)(file(originalname, mimetype))).toBe(false);
    });
});
