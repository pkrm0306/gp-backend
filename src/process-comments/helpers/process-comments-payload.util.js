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
exports.PROCESS_COMMENT_SECTION_FIELDS = exports.FINAL_REVIEW_META_SEPARATOR = void 0;
exports.parseSectionCommentPayload = parseSectionCommentPayload;
exports.buildSectionCommentPayload = buildSectionCommentPayload;
exports.formatProcessCommentsForApi = formatProcessCommentsForApi;
exports.FINAL_REVIEW_META_SEPARATOR = '\n\n---FINAL_REVIEW_META---\n\n';
exports.PROCESS_COMMENT_SECTION_FIELDS = [
    'productDesign',
    'productPerformance',
    'manfacturingProcess',
    'wasteManagement',
    'lifeCycleApproach',
    'productStewardship',
    'productInnovation',
    'rawMaterials31',
    'rawMaterials32',
    'rawMaterials33',
    'rawMaterials34',
    'rawMaterials35',
    'rawMaterials36',
    'rawMaterials37',
    'rawMaterials38',
    'rawMaterials39',
    'rawMaterials310',
    'rawMaterials311',
    'rawMaterials312',
    'rawMaterials313',
    'rawMaterials314',
    'rawMaterials315',
];
function parseSectionCommentPayload(packed) {
    var _a, _b, _c, _d, _e, _f;
    var raw = String(packed !== null && packed !== void 0 ? packed : '');
    var separatorIndex = raw.indexOf(exports.FINAL_REVIEW_META_SEPARATOR);
    var adminComment = raw.trim();
    var meta = {};
    if (separatorIndex >= 0) {
        adminComment = raw.slice(0, separatorIndex).trim();
        var metaRaw = raw
            .slice(separatorIndex + exports.FINAL_REVIEW_META_SEPARATOR.length)
            .trim();
        if (metaRaw) {
            try {
                var parsed = JSON.parse(metaRaw);
                if (parsed && typeof parsed === 'object') {
                    meta = parsed;
                }
            }
            catch (_g) {
                meta = {};
            }
        }
    }
    var technicalReview = String((_b = (_a = meta.technicalHtml) !== null && _a !== void 0 ? _a : meta.technicalReview) !== null && _b !== void 0 ? _b : '').trim();
    var finalReview = String((_d = (_c = meta.finalHtml) !== null && _c !== void 0 ? _c : meta.finalReview) !== null && _d !== void 0 ? _d : '').trim();
    var credits = (_e = meta.credits) !== null && _e !== void 0 ? _e : null;
    var maxCredits = (_f = meta.maxCredits) !== null && _f !== void 0 ? _f : null;
    return {
        adminComment: adminComment || null,
        commentHtml: adminComment || null,
        technicalReview: technicalReview || null,
        finalReview: finalReview || null,
        credits: credits === '' || credits == null
            ? null
            : credits,
        maxCredits: maxCredits === '' || maxCredits == null
            ? null
            : maxCredits,
        technicalHtml: technicalReview || null,
        finalHtml: finalReview || null,
    };
}
function buildSectionCommentPayload(params) {
    var _a, _b, _c;
    var adminComment = String((_a = params.adminComment) !== null && _a !== void 0 ? _a : '').trim();
    var meta = {
        technicalHtml: String((_b = params.technicalReview) !== null && _b !== void 0 ? _b : '').trim() || undefined,
        finalHtml: String((_c = params.finalReview) !== null && _c !== void 0 ? _c : '').trim() || undefined,
        credits: params.credits === '' || params.credits == null
            ? undefined
            : String(params.credits),
        maxCredits: params.maxCredits === '' || params.maxCredits == null
            ? undefined
            : String(params.maxCredits),
    };
    var hasMeta = Object.values(meta).some(function (value) { return value != null && String(value).trim() !== ''; });
    if (!hasMeta) {
        return adminComment;
    }
    return "".concat(adminComment).concat(exports.FINAL_REVIEW_META_SEPARATOR).concat(JSON.stringify(meta));
}
function formatProcessCommentsForApi(doc) {
    if (!doc) {
        return null;
    }
    var sectionReviews = {};
    for (var _i = 0, PROCESS_COMMENT_SECTION_FIELDS_1 = exports.PROCESS_COMMENT_SECTION_FIELDS; _i < PROCESS_COMMENT_SECTION_FIELDS_1.length; _i++) {
        var field = PROCESS_COMMENT_SECTION_FIELDS_1[_i];
        var packed = doc[field];
        if (typeof packed === 'string' && packed.trim() !== '') {
            sectionReviews[field] = parseSectionCommentPayload(packed);
        }
    }
    return __assign(__assign({}, doc), { sectionReviews: sectionReviews });
}
