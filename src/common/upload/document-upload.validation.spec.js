"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var document_upload_validation_1 = require("./document-upload.validation");
function file(originalname, mimetype) {
    return { originalname: originalname, mimetype: mimetype };
}
describe('document-upload.validation', function () {
    it('uses the standardized validation message', function () {
        expect(document_upload_validation_1.STANDARD_DOCUMENT_VALIDATION_MESSAGE).toBe('Only PDF and Excel (.pdf, .xls, .xlsx) files are allowed');
    });
    it.each([
        ['report.pdf', 'application/pdf'],
        ['sheet.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        ['sheet.xls', 'application/vnd.ms-excel'],
    ])('allows %s with %s', function (originalname, mimetype) {
        expect((0, document_upload_validation_1.isAllowedStandardDocumentFile)(file(originalname, mimetype))).toBe(true);
    });
    it('allows octet-stream when extension is allowed', function () {
        expect((0, document_upload_validation_1.isAllowedStandardDocumentFile)(file('scan.pdf', 'application/octet-stream'))).toBe(true);
        expect((0, document_upload_validation_1.isAllowedStandardDocumentFile)(file('data.xlsx', 'application/octet-stream'))).toBe(true);
    });
    it.each([
        ['photo.jpg', 'image/jpeg'],
        ['photo.png', 'image/png'],
        ['proposal.doc', 'application/msword'],
        ['proposal.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        ['data.csv', 'text/csv'],
        ['archive.zip', 'application/zip'],
        ['archive.rar', 'application/vnd.rar'],
        ['malware.exe', 'application/x-msdownload'],
        ['script.js', 'application/javascript'],
        ['spoof.pdf', 'application/javascript'],
        ['report.xlsx', 'application/pdf'],
    ])('rejects %s with %s', function (originalname, mimetype) {
        expect((0, document_upload_validation_1.isAllowedStandardDocumentFile)(file(originalname, mimetype))).toBe(false);
    });
    it('assertStandardDocumentFileTypes throws standardized message', function () {
        expect(function () {
            return (0, document_upload_validation_1.assertStandardDocumentFileTypes)([file('bad.zip', 'application/zip')]);
        }).toThrow(document_upload_validation_1.STANDARD_DOCUMENT_VALIDATION_MESSAGE);
    });
});
