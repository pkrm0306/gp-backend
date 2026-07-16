"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatProcessFinalReviewPayload = formatProcessFinalReviewPayload;
function formatProcessFinalReviewPayload(row) {
    var _a, _b, _c, _d, _e, _f;
    if (!row) {
        return null;
    }
    var technicalReview = String((_b = (_a = row.technicalReview) !== null && _a !== void 0 ? _a : row.technical_review) !== null && _b !== void 0 ? _b : '').trim();
    var finalReview = String((_d = (_c = row.finalReview) !== null && _c !== void 0 ? _c : row.final_review) !== null && _d !== void 0 ? _d : '').trim();
    var minRaw = (_e = row.minCredits) !== null && _e !== void 0 ? _e : row.min_credits;
    var maxRaw = (_f = row.maxCredits) !== null && _f !== void 0 ? _f : row.max_credits;
    var minCredits = minRaw === '' || minRaw == null ? null : Number(minRaw);
    var maxCredits = maxRaw === '' || maxRaw == null ? null : Number(maxRaw);
    return {
        _id: row._id,
        processFinalReviewId: row.processFinalReviewId != null
            ? Number(row.processFinalReviewId)
            : undefined,
        urnNo: row.urnNo != null ? String(row.urnNo) : undefined,
        vendorId: row.vendorId,
        technicalReview: technicalReview || null,
        finalReview: finalReview || null,
        minCredits: Number.isFinite(minCredits) ? minCredits : null,
        maxCredits: Number.isFinite(maxCredits) ? maxCredits : null,
        technical_review: technicalReview || null,
        final_review: finalReview || null,
        min_credits: Number.isFinite(minCredits) ? minCredits : null,
        max_credits: Number.isFinite(maxCredits) ? maxCredits : null,
        createdDate: row.createdDate,
        updatedDate: row.updatedDate,
    };
}
