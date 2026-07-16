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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSummitBannersInput = normalizeSummitBannersInput;
exports.normalizeSummitSpeakersInput = normalizeSummitSpeakersInput;
exports.normalizeSummitPatchPayload = normalizeSummitPatchPayload;
var summit_speaker_util_1 = require("./summit-speaker.util");
/** Strip removed banner fields (title, subtitle) from client payloads. */
function normalizeSummitBannersInput(raw) {
    if (!Array.isArray(raw))
        return raw;
    return raw.map(function (item) {
        if (!item || typeof item !== 'object')
            return item;
        var row = item;
        var _t = row.title, _s = row.subtitle, rest = __rest(row, ["title", "subtitle"]);
        return rest;
    });
}
function speakerTagArraysEqual(a, b) {
    return a.length === b.length && a.every(function (value, index) { return value === b[index]; });
}
/** Keep speaker key point text and tag pills as separate persisted fields. */
function normalizeSummitSpeakersInput(raw) {
    if (!Array.isArray(raw))
        return raw;
    return raw.map(function (item) {
        var _a;
        if (!item || typeof item !== 'object')
            return item;
        var row = item;
        var keyPoints = row.keyPoints, keyPoint = row.keyPoint, tags = row.tags, image = row.image, imageUrl = row.imageUrl, rest = __rest(row, ["keyPoints", "keyPoint", "tags", "image", "imageUrl"]);
        var normalizedTags = (0, summit_speaker_util_1.normalizeSpeakerTags)(tags);
        var normalizedKeyPoint = (0, summit_speaker_util_1.normalizeSpeakerKeyPoint)(keyPoint);
        if (!normalizedKeyPoint && keyPoints !== undefined) {
            var legacyKeyPoints = (0, summit_speaker_util_1.normalizeSpeakerTags)(keyPoints);
            if (legacyKeyPoints.length === 1) {
                var candidate = (0, summit_speaker_util_1.normalizeSpeakerKeyPoint)(legacyKeyPoints[0]);
                if (candidate !== normalizedTags.join(' ') &&
                    !speakerTagArraysEqual(legacyKeyPoints, normalizedTags)) {
                    normalizedKeyPoint = candidate;
                }
            }
            else if (legacyKeyPoints.length > 1 &&
                !speakerTagArraysEqual(legacyKeyPoints, normalizedTags)) {
                normalizedKeyPoint = (0, summit_speaker_util_1.normalizeSpeakerKeyPoint)(legacyKeyPoints[0]);
            }
        }
        if (normalizedKeyPoint &&
            normalizedTags.length > 0 &&
            (normalizedKeyPoint === normalizedTags.join(' ') ||
                speakerTagArraysEqual((0, summit_speaker_util_1.normalizeSpeakerTags)([normalizedKeyPoint]), normalizedTags))) {
            normalizedKeyPoint = '';
        }
        return __assign(__assign({}, rest), { imageUrl: String((_a = imageUrl !== null && imageUrl !== void 0 ? imageUrl : image) !== null && _a !== void 0 ? _a : '').trim(), keyPoint: normalizedKeyPoint, tags: normalizedTags });
    });
}
/** Top-level PATCH body cleanup before validation. */
function normalizeSummitPatchPayload(body) {
    if (!body || typeof body !== 'object')
        return body;
    var payload = __assign({}, body);
    if (payload.banners !== undefined) {
        payload.banners = normalizeSummitBannersInput(payload.banners);
    }
    if (payload.speakers !== undefined) {
        payload.speakers = normalizeSummitSpeakersInput(payload.speakers);
    }
    return payload;
}
