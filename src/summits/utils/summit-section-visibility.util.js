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
exports.PUBLIC_SUMMIT_SECTION_ORDER = void 0;
exports.computeSummitSectionVisibility = computeSummitSectionVisibility;
exports.getVisiblePublicSummitSections = getVisiblePublicSummitSections;
exports.buildSummitViewPayload = buildSummitViewPayload;
exports.PUBLIC_SUMMIT_SECTION_ORDER = [
    'banners',
    'downloads',
    'about-greenpro',
    'about-summit',
    'highlights',
    'focused-area',
    'event-outcomes',
    'speakers',
    'agenda',
    'sponsors',
];
function stripHtml(html) {
    if (!html)
        return '';
    return String(html)
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
function hasRichTextContentOnly(block) {
    return stripHtml(block.content).length > 0;
}
function hasCardSection(items) {
    return (items !== null && items !== void 0 ? items : []).some(function (item) {
        var _a, _b;
        return String((_a = item.heading) !== null && _a !== void 0 ? _a : '').trim().length > 0 ||
            String((_b = item.description) !== null && _b !== void 0 ? _b : '').trim().length > 0;
    });
}
function hasFocusedAreaSection(cards) {
    return (cards !== null && cards !== void 0 ? cards : []).some(function (card) {
        var _a, _b;
        return String((_a = card.heading) !== null && _a !== void 0 ? _a : '').trim().length > 0 ||
            ((_b = card.points) !== null && _b !== void 0 ? _b : []).some(function (point) { var _a; return String((_a = point.text) !== null && _a !== void 0 ? _a : '').trim().length > 0; });
    });
}
function hasAgendaPoints(points) {
    return (points !== null && points !== void 0 ? points : []).some(function (point) {
        var _a, _b, _c;
        return String((_a = point.text) !== null && _a !== void 0 ? _a : '').trim().length > 0 ||
            String((_b = point.heading) !== null && _b !== void 0 ? _b : '').trim().length > 0 ||
            String((_c = point.description) !== null && _c !== void 0 ? _c : '').trim().length > 0;
    });
}
function computeSummitSectionVisibility(summit) {
    var _a, _b;
    var hasBanner = summit.banners.some(function (b) { var _a; return String((_a = b.imageUrl) !== null && _a !== void 0 ? _a : '').trim(); });
    var hasDownloads = summit.industrialPdfs.some(function (p) { var _a; return String((_a = p.fileUrl) !== null && _a !== void 0 ? _a : '').trim(); }) ||
        summit.buildingsPdfs.some(function (p) { var _a; return String((_a = p.fileUrl) !== null && _a !== void 0 ? _a : '').trim(); });
    var visibility = {
        basic: Boolean(String((_a = summit.basic.title) !== null && _a !== void 0 ? _a : '').trim() ||
            String((_b = summit.basic.date) !== null && _b !== void 0 ? _b : '').trim()),
        banners: hasBanner,
        downloads: hasDownloads,
        'about-greenpro': true,
        'about-summit': true,
        highlights: hasCardSection(summit.highlights),
        'focused-area': hasFocusedAreaSection(summit.focusedAreas),
        'event-outcomes': hasCardSection(summit.eventOutcomes),
        speakers: summit.speakers.some(function (s) {
            var _a, _b, _c, _d, _e;
            return String((_a = s.name) !== null && _a !== void 0 ? _a : '').trim() ||
                String((_b = s.imageUrl) !== null && _b !== void 0 ? _b : '').trim() ||
                String((_c = s.sub) !== null && _c !== void 0 ? _c : '').trim() ||
                String((_d = s.keyPoint) !== null && _d !== void 0 ? _d : '').trim() ||
                ((_e = s.tags) !== null && _e !== void 0 ? _e : []).some(function (t) { return String(t).trim(); });
        }),
        agenda: hasAgendaPoints(summit.agendaPoints),
        sponsors: summit.sponsors.some(function (s) { var _a, _b; return String((_a = s.name) !== null && _a !== void 0 ? _a : '').trim() || String((_b = s.logoUrl) !== null && _b !== void 0 ? _b : '').trim(); }),
    };
    return visibility;
}
function getVisiblePublicSummitSections(summit) {
    var visibility = computeSummitSectionVisibility(summit);
    return exports.PUBLIC_SUMMIT_SECTION_ORDER.filter(function (key) { return visibility[key]; });
}
function buildSummitViewPayload(summit) {
    var sectionVisibility = computeSummitSectionVisibility(summit);
    var visibleSections = getVisiblePublicSummitSections(summit);
    return __assign(__assign({}, summit), { sectionVisibility: sectionVisibility, visibleSections: visibleSections });
}
