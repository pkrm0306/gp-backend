"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var document_section_key_constants_1 = require("../../common/constants/document-section-key.constants");
var renewal_urn_status_constants_1 = require("../constants/renewal-urn-status.constants");
var certification_document_version_util_1 = require("../../documents/helpers/certification-document-version.util");
var renew_section_documents_util_1 = require("./renew-section-documents.util");
describe('renew-section-documents.util', function () {
    var cycleId = new mongoose_1.Types.ObjectId();
    it('skips renew version tracking before admin resend', function () {
        expect((0, certification_document_version_util_1.resolveRenewDocumentVersionAction)(0, renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_APPROVED)).toBeNull();
        expect((0, certification_document_version_util_1.resolveRenewDocumentVersionAction)(2, renewal_urn_status_constants_1.RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS)).toBeNull();
    });
    it('tracks renew versions only after admin resend', function () {
        var resubmit = renewal_urn_status_constants_1.RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING;
        expect((0, certification_document_version_util_1.resolveRenewDocumentVersionAction)(0, resubmit)).toBe('added');
        expect((0, certification_document_version_util_1.resolveRenewDocumentVersionAction)(1, resubmit)).toBe('replaced');
    });
    it('matches productDocumentId keep refs', function () {
        var refs = (0, renew_section_documents_util_1.resolveRenewDocumentIdRefs)(['21', '22']);
        expect((0, renew_section_documents_util_1.renewDocumentMatchesIdRefs)({ productDocumentId: 21 }, refs)).toBe(true);
        expect((0, renew_section_documents_util_1.renewDocumentMatchesIdRefs)({ productDocumentId: 99 }, refs)).toBe(false);
    });
    it('strict cycle filter excludes legacy null renewalCycleId rows', function () {
        var filter = (0, renew_section_documents_util_1.buildRenewSectionDocMigrationFilter)('URN-1', cycleId, document_section_key_constants_1.DocumentSectionKey.PROCESS_MANUFACTURING, true);
        expect(filter).toEqual({
            urnNo: 'URN-1',
            documentForm: document_section_key_constants_1.DocumentSectionKey.PROCESS_MANUFACTURING,
            isDeleted: { $ne: true },
            renewalCycleId: cycleId,
        });
    });
    it('rejects delete when document cycle differs on cycle 2+', function () {
        var otherCycle = new mongoose_1.Types.ObjectId();
        expect(function () {
            return (0, renew_section_documents_util_1.assertRenewDocumentMatchesCycle)({ renewalCycleId: otherCycle }, cycleId, 2);
        }).toThrow(/renewalCycleId does not match document cycle/);
    });
});
