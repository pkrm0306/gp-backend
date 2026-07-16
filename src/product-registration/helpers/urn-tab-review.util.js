"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTabReviewSlotAlreadyDecided = isTabReviewSlotAlreadyDecided;
exports.isTabReviewSlotRejected = isTabReviewSlotRejected;
exports.parseVisibleRawMaterialSteps = parseVisibleRawMaterialSteps;
exports.isProcessTabKey = isProcessTabKey;
exports.normalizeReviewStepId = normalizeReviewStepId;
exports.apiStepIdFromStored = apiStepIdFromStored;
exports.buildRequiredReviewSlots = buildRequiredReviewSlots;
exports.reviewSlotKey = reviewSlotKey;
var urn_tab_review_constants_1 = require("../constants/urn-tab-review.constants");
/** True when admin has approved this tab/step — locked for the current review cycle. */
function isTabReviewSlotAlreadyDecided(reviewStatus) {
    return reviewStatus === urn_tab_review_constants_1.URN_TAB_REVIEW_STATUS.APPROVED;
}
/** True when a slot is rejected (unlocked again after vendor resubmit resets it to pending). */
function isTabReviewSlotRejected(reviewStatus) {
    return reviewStatus === urn_tab_review_constants_1.URN_TAB_REVIEW_STATUS.REJECTED;
}
/** Match admin UI `parseVisibleRawMaterialSteps`: empty CSV → all 15 steps. */
function parseVisibleRawMaterialSteps(categoryRawMaterialForms) {
    var trimmed = String(categoryRawMaterialForms !== null && categoryRawMaterialForms !== void 0 ? categoryRawMaterialForms : '').trim();
    if (!trimmed) {
        return Array.from({ length: 15 }, function (_, i) { return i + 1; });
    }
    var steps = trimmed
        .split(',')
        .map(function (part) { return Number.parseInt(part.trim(), 10); })
        .filter(function (n) { return Number.isFinite(n) && n >= 1 && n <= 15; });
    var unique = __spreadArray([], new Set(steps), true).sort(function (a, b) { return a - b; });
    return unique.length > 0 ? unique : Array.from({ length: 15 }, function (_, i) { return i + 1; });
}
function isProcessTabKey(tabKey) {
    return urn_tab_review_constants_1.PROCESS_TAB_REVIEW_KEYS.includes(tabKey);
}
function normalizeReviewStepId(tabKey, stepId) {
    if (tabKey === urn_tab_review_constants_1.RAW_MATERIALS_TAB_KEY) {
        var id = Number(stepId);
        if (!Number.isFinite(id) || id < 1 || id > 15) {
            throw new Error('stepId must be 1–15 for raw-materials');
        }
        return id;
    }
    if (isProcessTabKey(tabKey)) {
        return urn_tab_review_constants_1.PROCESS_TAB_STEP_ID;
    }
    throw new Error('Invalid tabKey');
}
function apiStepIdFromStored(tabKey, storedStepId) {
    if (tabKey === urn_tab_review_constants_1.RAW_MATERIALS_TAB_KEY) {
        return storedStepId;
    }
    return null;
}
function buildRequiredReviewSlots(visibleRawMaterialSteps) {
    var process = urn_tab_review_constants_1.PROCESS_TAB_REVIEW_KEYS.map(function (tabKey) { return ({
        tabKey: tabKey,
        stepId: null,
        label: urn_tab_review_constants_1.PROCESS_TAB_LABELS[tabKey],
    }); });
    var raw = visibleRawMaterialSteps.map(function (stepId) {
        var _a;
        return ({
            tabKey: urn_tab_review_constants_1.RAW_MATERIALS_TAB_KEY,
            stepId: stepId,
            label: (_a = urn_tab_review_constants_1.RAW_MATERIAL_STEP_TITLES[stepId]) !== null && _a !== void 0 ? _a : "Raw materials step ".concat(stepId),
        });
    });
    return __spreadArray(__spreadArray([], process, true), raw, true);
}
function reviewSlotKey(tabKey, stepId) {
    return "".concat(tabKey, "::").concat(stepId);
}
