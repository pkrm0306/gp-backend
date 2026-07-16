"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUMMIT_SPEAKER_KEY_POINT_MAX_LENGTH = void 0;
exports.normalizeSpeakerTags = normalizeSpeakerTags;
exports.normalizeSpeakerKeyPoint = normalizeSpeakerKeyPoint;
exports.splitSpeakerSubField = splitSpeakerSubField;
exports.resolveSpeakerDesignationAndOrganisation = resolveSpeakerDesignationAndOrganisation;
/** Max characters for speaker key point plain text (admin form). */
exports.SUMMIT_SPEAKER_KEY_POINT_MAX_LENGTH = 75;
/** Normalize speaker tag chips from array or comma-separated string. */
function normalizeSpeakerTags(raw) {
    if (raw === undefined || raw === null)
        return [];
    if (Array.isArray(raw)) {
        return raw
            .map(function (t) { return String(t).trim(); })
            .filter(function (t) { return t.length > 0; });
    }
    if (typeof raw === 'string') {
        return raw
            .split(',')
            .map(function (t) { return t.trim(); })
            .filter(function (t) { return t.length > 0; });
    }
    return [];
}
function normalizeSpeakerKeyPoint(raw) {
    return String(raw !== null && raw !== void 0 ? raw : '')
        .trim()
        .slice(0, exports.SUMMIT_SPEAKER_KEY_POINT_MAX_LENGTH);
}
/** Split legacy combined `sub` into designation + organisation. */
function splitSpeakerSubField(sub) {
    var trimmed = String(sub !== null && sub !== void 0 ? sub : '').trim();
    if (!trimmed)
        return { designation: '', organisation: '' };
    var doubleSpace = trimmed.match(/\s{2,}/);
    if ((doubleSpace === null || doubleSpace === void 0 ? void 0 : doubleSpace.index) != null && doubleSpace.index > 0) {
        return {
            designation: trimmed.slice(0, doubleSpace.index).trim(),
            organisation: trimmed.slice(doubleSpace.index).replace(/\s+/g, ' ').trim(),
        };
    }
    var newline = trimmed.indexOf('\n');
    if (newline >= 0) {
        return {
            designation: trimmed.slice(0, newline).trim(),
            organisation: trimmed.slice(newline + 1).replace(/\s+/g, ' ').trim(),
        };
    }
    return { designation: trimmed, organisation: '' };
}
function resolveSpeakerDesignationAndOrganisation(item) {
    var _a, _b, _c, _d;
    var designation = String((_a = item.designation) !== null && _a !== void 0 ? _a : '').trim();
    var organisation = String((_c = (_b = item.organisation) !== null && _b !== void 0 ? _b : item.organization) !== null && _c !== void 0 ? _c : '').trim();
    var sub = String((_d = item.sub) !== null && _d !== void 0 ? _d : '').trim();
    if (!designation && !organisation && sub) {
        var split = splitSpeakerSubField(sub);
        designation = split.designation;
        organisation = split.organisation;
    }
    else if (!designation && sub) {
        designation = sub;
    }
    return { designation: designation, organisation: organisation };
}
