"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_PROOF_APPROVED_LOCKED_MESSAGE = exports.PAYMENT_PROOF_SUBMITTED_LOCKED_MESSAGE = exports.PAYMENT_REFERENCE_UNIQUE_MESSAGE = void 0;
exports.resolvePaymentSubmissionStatus = resolvePaymentSubmissionStatus;
exports.isPaymentSubmissionStageActive = isPaymentSubmissionStageActive;
exports.isVendorPaymentProofEditable = isVendorPaymentProofEditable;
exports.resolveVendorPaymentProofLockMessage = resolveVendorPaymentProofLockMessage;
exports.maskPaymentSubmissionFields = maskPaymentSubmissionFields;
exports.formatPaymentRecordsForUrnDetails = formatPaymentRecordsForUrnDetails;
exports.buildTdsFileMetadata = buildTdsFileMetadata;
exports.enrichPaymentByUrnResponse = enrichPaymentByUrnResponse;
var path_1 = require("path");
var document_version_helper_1 = require("../documents/helpers/document-version.helper");
var payment_proposal_util_1 = require("./payment-proposal.util");
exports.PAYMENT_REFERENCE_UNIQUE_MESSAGE = 'Reference Number already exists';
exports.PAYMENT_PROOF_SUBMITTED_LOCKED_MESSAGE = 'Payment details have already been submitted and cannot be modified while admin review is in progress.';
exports.PAYMENT_PROOF_APPROVED_LOCKED_MESSAGE = 'Approved payment details cannot be modified.';
function resolvePaymentSubmissionStatus(paymentStatus) {
    var status = Number(paymentStatus !== null && paymentStatus !== void 0 ? paymentStatus : 0);
    if (status === 1) {
        return {
            submissionStatus: 'submitted',
            submission_status: 'submitted',
            submissionStatusLabel: 'Submitted',
            submission_status_label: 'Submitted',
        };
    }
    if (status === 2) {
        return {
            submissionStatus: 'approved',
            submission_status: 'approved',
            submissionStatusLabel: 'Approved',
            submission_status_label: 'Approved',
        };
    }
    if (status === 3) {
        return {
            submissionStatus: 'rejected',
            submission_status: 'rejected',
            submissionStatusLabel: 'Rejected',
            submission_status_label: 'Rejected',
        };
    }
    return {
        submissionStatus: 'draft',
        submission_status: 'draft',
        submissionStatusLabel: 'Not Submitted',
        submission_status_label: 'Not Submitted',
    };
}
/** Registration payments require vendor proposal approval before payment proof fields apply. */
function isPaymentSubmissionStageActive(payment) {
    var _a, _b;
    var paymentType = String((_a = payment.paymentType) !== null && _a !== void 0 ? _a : 'registration')
        .trim()
        .toLowerCase();
    var paymentStatus = Number((_b = payment.paymentStatus) !== null && _b !== void 0 ? _b : 0);
    if (paymentStatus >= 1) {
        return true;
    }
    if (paymentType === 'registration') {
        return (0, payment_proposal_util_1.resolveVendorProposalApprovalStatus)(payment) === 1;
    }
    return true;
}
/** Vendor may edit/submit payment proof only in draft, or after admin payment rejection. */
function isVendorPaymentProofEditable(payment) {
    var _a, _b;
    var paymentStatus = Number((_a = payment.paymentStatus) !== null && _a !== void 0 ? _a : 0);
    if (paymentStatus === 3) {
        return true;
    }
    if (paymentStatus === 1 || paymentStatus === 2) {
        return false;
    }
    var paymentType = String((_b = payment.paymentType) !== null && _b !== void 0 ? _b : 'registration')
        .trim()
        .toLowerCase();
    if (paymentType === 'registration') {
        return (0, payment_proposal_util_1.resolveVendorProposalApprovalStatus)(payment) === 1;
    }
    return true;
}
function resolveVendorPaymentProofLockMessage(payment) {
    var _a;
    var paymentStatus = Number((_a = payment.paymentStatus) !== null && _a !== void 0 ? _a : 0);
    if (paymentStatus === 1) {
        return exports.PAYMENT_PROOF_SUBMITTED_LOCKED_MESSAGE;
    }
    if (paymentStatus === 2) {
        return exports.PAYMENT_PROOF_APPROVED_LOCKED_MESSAGE;
    }
    return null;
}
var PAYMENT_SUBMISSION_MASK_KEYS = [
    'paymentMode',
    'payment_mode',
    'paymentReferenceNo',
    'payment_reference_no',
    'paymentChequeDate',
    'payment_cheque_date',
    'tdsFile',
    'tds_file',
    'chequeOrDdFile',
    'cheque_or_dd_file',
    'tdsFileMetadata',
    'tds_file_metadata',
    'referenceNumberMustBeUnique',
    'reference_number_must_be_unique',
    'referenceNumberUniqueMessage',
    'reference_number_unique_message',
];
function maskPaymentSubmissionFields(payment) {
    var paymentStageActive = isPaymentSubmissionStageActive(payment);
    if (paymentStageActive) {
        return __assign(__assign({}, payment), { paymentStageActive: true, payment_stage_active: true });
    }
    var masked = __assign({}, payment);
    for (var _i = 0, PAYMENT_SUBMISSION_MASK_KEYS_1 = PAYMENT_SUBMISSION_MASK_KEYS; _i < PAYMENT_SUBMISSION_MASK_KEYS_1.length; _i++) {
        var key = PAYMENT_SUBMISSION_MASK_KEYS_1[_i];
        if (key in masked) {
            masked[key] = null;
        }
    }
    return __assign(__assign({}, masked), { paymentStageActive: false, payment_stage_active: false });
}
function formatPaymentRecordsForUrnDetails(payments) {
    if (!Array.isArray(payments)) {
        return [];
    }
    return payments.map(function (payment) {
        var formatted = (0, payment_proposal_util_1.formatPaymentRecord)(payment);
        var paymentProofEditable = isVendorPaymentProofEditable(formatted);
        var paymentProofLockMessage = resolveVendorPaymentProofLockMessage(formatted);
        return maskPaymentSubmissionFields(__assign(__assign({}, formatted), { paymentProofEditable: paymentProofEditable, payment_proof_editable: paymentProofEditable, paymentProofLockMessage: paymentProofLockMessage, payment_proof_lock_message: paymentProofLockMessage }));
    });
}
function buildTdsFileMetadata(tdsFile, versionMetadata) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var filePath = String((_a = tdsFile !== null && tdsFile !== void 0 ? tdsFile : versionMetadata === null || versionMetadata === void 0 ? void 0 : versionMetadata.filePath) !== null && _a !== void 0 ? _a : '').trim();
    if (!filePath) {
        return null;
    }
    var fallback = (0, document_version_helper_1.fileMetadataFromMulter)(undefined, (0, path_1.basename)(filePath), filePath);
    return {
        originalName: (_c = (_b = versionMetadata === null || versionMetadata === void 0 ? void 0 : versionMetadata.originalName) !== null && _b !== void 0 ? _b : fallback.originalName) !== null && _c !== void 0 ? _c : null,
        storedName: (_f = (_e = (_d = versionMetadata === null || versionMetadata === void 0 ? void 0 : versionMetadata.storedName) !== null && _d !== void 0 ? _d : fallback.storedName) !== null && _e !== void 0 ? _e : (0, path_1.basename)(filePath)) !== null && _f !== void 0 ? _f : null,
        mimeType: (_h = (_g = versionMetadata === null || versionMetadata === void 0 ? void 0 : versionMetadata.mimeType) !== null && _g !== void 0 ? _g : fallback.mimeType) !== null && _h !== void 0 ? _h : null,
        sizeBytes: (versionMetadata === null || versionMetadata === void 0 ? void 0 : versionMetadata.sizeBytes) !== undefined &&
            (versionMetadata === null || versionMetadata === void 0 ? void 0 : versionMetadata.sizeBytes) !== null
            ? versionMetadata.sizeBytes
            : (_j = fallback.sizeBytes) !== null && _j !== void 0 ? _j : null,
        filePath: filePath,
    };
}
function enrichPaymentByUrnResponse(payment, options) {
    var _a, _b, _c, _d;
    var formatted = (0, payment_proposal_util_1.formatPaymentRecord)(payment);
    var tdsFile = String((_b = (_a = formatted.tdsFile) !== null && _a !== void 0 ? _a : formatted.tds_file) !== null && _b !== void 0 ? _b : '').trim();
    var tdsFileMetadata = (options === null || options === void 0 ? void 0 : options.tdsFileMetadata) !== undefined
        ? options.tdsFileMetadata
        : buildTdsFileMetadata(tdsFile);
    var submission = resolvePaymentSubmissionStatus(Number((_c = formatted.paymentStatus) !== null && _c !== void 0 ? _c : 0));
    var referenceNumberMustBeUnique = (_d = options === null || options === void 0 ? void 0 : options.referenceNumberMustBeUnique) !== null && _d !== void 0 ? _d : true;
    var paymentProofEditable = isVendorPaymentProofEditable(formatted);
    var paymentProofLockMessage = resolveVendorPaymentProofLockMessage(formatted);
    return maskPaymentSubmissionFields(__assign(__assign(__assign({}, formatted), { referenceNumberMustBeUnique: referenceNumberMustBeUnique, reference_number_must_be_unique: referenceNumberMustBeUnique, referenceNumberUniqueMessage: exports.PAYMENT_REFERENCE_UNIQUE_MESSAGE, reference_number_unique_message: exports.PAYMENT_REFERENCE_UNIQUE_MESSAGE, tdsFileMetadata: tdsFileMetadata, tds_file_metadata: tdsFileMetadata, paymentProofEditable: paymentProofEditable, payment_proof_editable: paymentProofEditable, paymentProofLockMessage: paymentProofLockMessage, payment_proof_lock_message: paymentProofLockMessage }), submission));
}
