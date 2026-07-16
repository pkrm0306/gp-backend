"use strict";
/**
 * Vendor registration-fee proposal approval — response shaping and legacy defaults.
 */
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
exports.resolveVendorProposalApprovalStatus = resolveVendorProposalApprovalStatus;
exports.formatPaymentRecord = formatPaymentRecord;
exports.formatPaymentRecords = formatPaymentRecords;
function resolvePaymentRejectionRemarks(payment) {
    var _a, _b, _c, _d;
    var raw = (_d = (_c = (_b = (_a = payment.paymentRejectionRemarks) !== null && _a !== void 0 ? _a : payment.payment_rejection_remarks) !== null && _b !== void 0 ? _b : payment.adminPaymentRejectionRemarks) !== null && _c !== void 0 ? _c : payment.admin_payment_rejection_remarks) !== null && _d !== void 0 ? _d : null;
    if (raw === undefined || raw === null) {
        return null;
    }
    var trimmed = String(raw).trim();
    return trimmed || null;
}
/** Effective approval status including legacy rows without the column. */
function resolveVendorProposalApprovalStatus(payment) {
    var _a, _b, _c;
    var raw = (_a = payment.vendorProposalApprovalStatus) !== null && _a !== void 0 ? _a : payment.vendor_proposal_approval_status;
    if (raw !== undefined && raw !== null && Number.isFinite(Number(raw))) {
        return Number(raw);
    }
    var paymentStatus = Number((_b = payment.paymentStatus) !== null && _b !== void 0 ? _b : 0);
    if (paymentStatus === 1 || paymentStatus === 2) {
        return 1;
    }
    if (paymentStatus === 0 && String((_c = payment.proposalFile) !== null && _c !== void 0 ? _c : '').trim()) {
        return 0;
    }
    return 0;
}
function formatPaymentRecord(payment) {
    var _a, _b;
    var vendorProposalApprovalStatus = resolveVendorProposalApprovalStatus(payment);
    var proposalRejectionRemarks = ((_b = (_a = payment.proposalRejectionRemarks) !== null && _a !== void 0 ? _a : payment.proposal_rejection_remarks) !== null && _b !== void 0 ? _b : null);
    var paymentRejectionRemarks = resolvePaymentRejectionRemarks(payment);
    return __assign(__assign({}, payment), { vendorProposalApprovalStatus: vendorProposalApprovalStatus, vendor_proposal_approval_status: vendorProposalApprovalStatus, proposalRejectionRemarks: proposalRejectionRemarks, proposal_rejection_remarks: proposalRejectionRemarks, paymentRejectionRemarks: paymentRejectionRemarks, payment_rejection_remarks: paymentRejectionRemarks, adminPaymentRejectionRemarks: paymentRejectionRemarks, admin_payment_rejection_remarks: paymentRejectionRemarks });
}
function formatPaymentRecords(payments) {
    if (!Array.isArray(payments)) {
        return [];
    }
    return payments.map(function (p) { return formatPaymentRecord(p); });
}
