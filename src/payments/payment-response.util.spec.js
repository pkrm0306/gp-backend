"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var payment_response_util_1 = require("./payment-response.util");
describe('payment-response.util', function () {
    it('maps paymentStatus to submissionStatus values', function () {
        expect((0, payment_response_util_1.resolvePaymentSubmissionStatus)(0).submissionStatus).toBe('draft');
        expect((0, payment_response_util_1.resolvePaymentSubmissionStatus)(1).submissionStatus).toBe('submitted');
        expect((0, payment_response_util_1.resolvePaymentSubmissionStatus)(2).submissionStatus).toBe('approved');
        expect((0, payment_response_util_1.resolvePaymentSubmissionStatus)(3).submissionStatus).toBe('rejected');
    });
    it('builds TDS file metadata from stored file path', function () {
        expect((0, payment_response_util_1.buildTdsFileMetadata)('/uploads/payments/supporting-doc.pdf')).toMatchObject({
            storedName: 'supporting-doc.pdf',
            filePath: '/uploads/payments/supporting-doc.pdf',
        });
    });
    it('enriches payment by URN response with required vendor form fields', function () {
        var response = (0, payment_response_util_1.enrichPaymentByUrnResponse)({
            urnNo: 'URN-1',
            paymentType: 'registration',
            vendorProposalApprovalStatus: 1,
            paymentStatus: 1,
            paymentReferenceNo: 'REF123',
            tdsFile: '/uploads/payments/supporting-doc.pdf',
            proposalFile: '/uploads/payments/proposal.pdf',
        });
        expect(response).toMatchObject({
            referenceNumberMustBeUnique: true,
            reference_number_must_be_unique: true,
            referenceNumberUniqueMessage: payment_response_util_1.PAYMENT_REFERENCE_UNIQUE_MESSAGE,
            submissionStatus: 'submitted',
            submission_status: 'submitted',
            paymentProofEditable: false,
            payment_proof_editable: false,
            paymentProofLockMessage: payment_response_util_1.PAYMENT_PROOF_SUBMITTED_LOCKED_MESSAGE,
            tdsFileMetadata: {
                storedName: 'supporting-doc.pdf',
                filePath: '/uploads/payments/supporting-doc.pdf',
            },
            tds_file_metadata: {
                storedName: 'supporting-doc.pdf',
                filePath: '/uploads/payments/supporting-doc.pdf',
            },
        });
    });
    it('keeps registration payment stage inactive until proposal is approved', function () {
        expect((0, payment_response_util_1.isPaymentSubmissionStageActive)({
            paymentType: 'registration',
            vendorProposalApprovalStatus: 0,
            paymentStatus: 0,
            proposalFile: '/uploads/payments/proposal.pdf',
        })).toBe(false);
        expect((0, payment_response_util_1.isPaymentSubmissionStageActive)({
            paymentType: 'registration',
            vendorProposalApprovalStatus: 2,
            paymentStatus: 0,
            proposalFile: '/uploads/payments/proposal.pdf',
        })).toBe(false);
        expect((0, payment_response_util_1.isPaymentSubmissionStageActive)({
            paymentType: 'registration',
            vendorProposalApprovalStatus: 1,
            paymentStatus: 0,
            proposalFile: '/uploads/payments/proposal.pdf',
        })).toBe(true);
    });
    it('masks payment submission fields for URN details before payment stage', function () {
        var masked = (0, payment_response_util_1.maskPaymentSubmissionFields)({
            paymentType: 'registration',
            vendorProposalApprovalStatus: 0,
            paymentStatus: 0,
            paymentMode: 'neft_or_rtgs',
            paymentReferenceNo: 'REF123',
            tdsFile: '/uploads/payments/supporting-doc.pdf',
            quoteTotal: 10800,
            proposalFile: '/uploads/payments/proposal.pdf',
        });
        expect(masked).toMatchObject({
            paymentStageActive: false,
            payment_stage_active: false,
            paymentMode: null,
            paymentReferenceNo: null,
            tdsFile: null,
            quoteTotal: 10800,
            proposalFile: '/uploads/payments/proposal.pdf',
        });
    });
    it('keeps payment submission fields visible after vendor submits payment', function () {
        var visible = (0, payment_response_util_1.formatPaymentRecordsForUrnDetails)([
            {
                paymentType: 'registration',
                vendorProposalApprovalStatus: 1,
                paymentStatus: 1,
                paymentMode: 'neft_or_rtgs',
                paymentReferenceNo: 'REF123',
                tdsFile: '/uploads/payments/supporting-doc.pdf',
            },
        ]);
        expect(visible[0]).toMatchObject({
            paymentStageActive: true,
            paymentMode: 'neft_or_rtgs',
            paymentReferenceNo: 'REF123',
            tdsFile: '/uploads/payments/supporting-doc.pdf',
            paymentProofEditable: false,
            paymentProofLockMessage: payment_response_util_1.PAYMENT_PROOF_SUBMITTED_LOCKED_MESSAGE,
        });
    });
    it('marks draft payment proof as editable after proposal approval', function () {
        expect((0, payment_response_util_1.isVendorPaymentProofEditable)({
            paymentType: 'registration',
            paymentStatus: 0,
            vendorProposalApprovalStatus: 1,
        })).toBe(true);
        expect((0, payment_response_util_1.isVendorPaymentProofEditable)({
            paymentType: 'registration',
            paymentStatus: 0,
            vendorProposalApprovalStatus: 0,
        })).toBe(false);
        expect((0, payment_response_util_1.isVendorPaymentProofEditable)({
            paymentType: 'registration',
            paymentStatus: 1,
            vendorProposalApprovalStatus: 1,
        })).toBe(false);
        expect((0, payment_response_util_1.isVendorPaymentProofEditable)({
            paymentType: 'registration',
            paymentStatus: 3,
            vendorProposalApprovalStatus: 1,
        })).toBe(true);
    });
});
