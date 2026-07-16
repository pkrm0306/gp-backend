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
exports.normalizeSummitAssetUrl = normalizeSummitAssetUrl;
exports.ensureSummitItemId = ensureSummitItemId;
exports.mapSummitToApi = mapSummitToApi;
exports.mapSummitToPublicListItem = mapSummitToPublicListItem;
exports.mapSummitToListItem = mapSummitToListItem;
var mongoose_1 = require("mongoose");
var upload_file_util_1 = require("../../utils/upload-file.util");
var summit_status_util_1 = require("./summit-status.util");
var summit_api_compat_util_1 = require("./summit-api-compat.util");
var summit_cms_sections_util_1 = require("./summit-cms-sections.util");
function normalizeSummitAssetUrl(raw, origin) {
    var _a;
    var baseUrl = String(origin !== null && origin !== void 0 ? origin : '').trim() || undefined;
    return (_a = (0, upload_file_util_1.resolvePublicUploadUrl)(raw, baseUrl)) !== null && _a !== void 0 ? _a : '';
}
function readStoredSpeakerImageUrl(speaker) {
    var _a, _b;
    return String((_b = (_a = speaker.imageUrl) !== null && _a !== void 0 ? _a : speaker.image) !== null && _b !== void 0 ? _b : '').trim();
}
function decodeBasicHtmlEntities(text) {
    return String(text)
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#039;/gi, "'");
}
function stripHtmlForExcerpt(html) {
    if (!html)
        return '';
    return decodeBasicHtmlEntities(String(html)
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim());
}
function resolveSummitCoverImageUrl(doc, origin) {
    var _a, _b, _c;
    var banners = sortByOrder((_a = doc.banners) !== null && _a !== void 0 ? _a : []);
    var firstBanner = banners.find(function (b) { var _a; return (_a = b.imageUrl) === null || _a === void 0 ? void 0 : _a.trim(); });
    var raw = (_c = (_b = firstBanner === null || firstBanner === void 0 ? void 0 : firstBanner.imageUrl) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : '';
    if (!raw)
        return null;
    return normalizeSummitAssetUrl(raw, origin) || null;
}
function sortByOrder(items) {
    return __spreadArray([], items, true).sort(function (a, b) { var _a, _b; return ((_a = a.sortOrder) !== null && _a !== void 0 ? _a : 0) - ((_b = b.sortOrder) !== null && _b !== void 0 ? _b : 0); });
}
function ensureSummitItemId(id) {
    if (id && String(id).trim())
        return String(id).trim();
    return new mongoose_1.Types.ObjectId().toString();
}
function mapSummitToApi(doc) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
    var banners = sortByOrder((_a = doc.banners) !== null && _a !== void 0 ? _a : []);
    var agenda = (0, summit_cms_sections_util_1.mapAgendaFromDoc)(doc);
    var highlights = (0, summit_cms_sections_util_1.mapHighlightsFromDoc)(doc).map(summit_api_compat_util_1.enrichSummitCardRow);
    var focusedAreas = (0, summit_cms_sections_util_1.mapFocusedAreasFromDoc)(doc).map(summit_api_compat_util_1.enrichFocusedAreaRow);
    var eventOutcomes = (0, summit_cms_sections_util_1.mapEventOutcomesFromDoc)(doc).map(summit_api_compat_util_1.enrichSummitCardRow);
    var focusedAreaTitle = (_b = doc.focusedAreaTitle) !== null && _b !== void 0 ? _b : 'Focused Area';
    var agendaContent = (0, summit_api_compat_util_1.buildAgendaHtmlFromPoints)(agenda.points) ||
        String((_d = (_c = doc.agenda) === null || _c === void 0 ? void 0 : _c.content) !== null && _d !== void 0 ? _d : '').trim();
    var coverImageUrl = resolveSummitCoverImageUrl(doc);
    return {
        id: doc._id.toString(),
        slug: (_e = doc.slug) !== null && _e !== void 0 ? _e : '',
        coverImageUrl: coverImageUrl,
        basic: {
            year: (_f = doc.year) !== null && _f !== void 0 ? _f : '',
            title: (_g = doc.title) !== null && _g !== void 0 ? _g : '',
            date: (_h = doc.date) !== null && _h !== void 0 ? _h : '',
            location: (_j = doc.location) !== null && _j !== void 0 ? _j : '',
            status: (0, summit_status_util_1.normalizeSummitStatus)(doc.status),
            slug: (_k = doc.slug) !== null && _k !== void 0 ? _k : '',
        },
        banners: banners.map(function (b) {
            var _a;
            return ({
                id: b.id,
                sortOrder: (_a = b.sortOrder) !== null && _a !== void 0 ? _a : 0,
                imageUrl: normalizeSummitAssetUrl(b.imageUrl) || '',
            });
        }),
        industrialPdfs: sortByOrder((_l = doc.industrialPdfs) !== null && _l !== void 0 ? _l : []).map(function (p) {
            var _a, _b, _c;
            return ({
                id: p.id,
                sortOrder: (_a = p.sortOrder) !== null && _a !== void 0 ? _a : 0,
                title: (_b = p.title) !== null && _b !== void 0 ? _b : '',
                fileUrl: normalizeSummitAssetUrl(p.fileUrl) || '',
                fileName: (_c = p.fileName) !== null && _c !== void 0 ? _c : '',
            });
        }),
        buildingsPdfs: sortByOrder((_m = doc.buildingsPdfs) !== null && _m !== void 0 ? _m : []).map(function (p) {
            var _a, _b, _c;
            return ({
                id: p.id,
                sortOrder: (_a = p.sortOrder) !== null && _a !== void 0 ? _a : 0,
                title: (_b = p.title) !== null && _b !== void 0 ? _b : '',
                fileUrl: normalizeSummitAssetUrl(p.fileUrl) || '',
                fileName: (_c = p.fileName) !== null && _c !== void 0 ? _c : '',
            });
        }),
        aboutGreenPro: {
            title: (_p = (_o = doc.aboutGreenPro) === null || _o === void 0 ? void 0 : _o.title) !== null && _p !== void 0 ? _p : '',
            content: (_r = (_q = doc.aboutGreenPro) === null || _q === void 0 ? void 0 : _q.content) !== null && _r !== void 0 ? _r : '',
        },
        aboutSummit: {
            title: (_t = (_s = doc.aboutSummit) === null || _s === void 0 ? void 0 : _s.title) !== null && _t !== void 0 ? _t : '',
            content: (_v = (_u = doc.aboutSummit) === null || _u === void 0 ? void 0 : _u.content) !== null && _v !== void 0 ? _v : '',
        },
        highlightsTitle: (_w = doc.highlightsTitle) !== null && _w !== void 0 ? _w : '',
        highlights: highlights,
        focusedAreaTitle: focusedAreaTitle,
        areaPointsTitle: focusedAreaTitle,
        focusedAreas: focusedAreas,
        areaPoints: (0, summit_api_compat_util_1.mapLegacyAreaPoints)(doc, focusedAreas),
        eventOutcomesTitle: (_x = doc.eventOutcomesTitle) !== null && _x !== void 0 ? _x : 'Event Outcomes',
        eventOutcomes: eventOutcomes,
        speakers: sortByOrder((_y = doc.speakers) !== null && _y !== void 0 ? _y : []).map(function (s) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            var tags = (_a = s.tags) !== null && _a !== void 0 ? _a : [];
            var keyPoint = String((_b = s.keyPoint) !== null && _b !== void 0 ? _b : '').trim();
            var designation = String((_d = (_c = s.designation) !== null && _c !== void 0 ? _c : s.sub) !== null && _d !== void 0 ? _d : '').trim();
            var organisation = String((_e = s.organisation) !== null && _e !== void 0 ? _e : '').trim();
            var imageUrl = normalizeSummitAssetUrl(readStoredSpeakerImageUrl(s)) || '';
            return {
                id: s.id,
                sortOrder: (_f = s.sortOrder) !== null && _f !== void 0 ? _f : 0,
                name: (_g = s.name) !== null && _g !== void 0 ? _g : '',
                designation: designation,
                organisation: organisation,
                organization: organisation,
                sub: (_h = s.sub) !== null && _h !== void 0 ? _h : '',
                keyPoint: keyPoint,
                tags: tags,
                keyPoints: keyPoint ? [keyPoint] : [],
                imageUrl: imageUrl,
                image: imageUrl,
            };
        }),
        agendaTitle: agenda.title,
        agendaPoints: agenda.points,
        agenda: {
            title: agenda.title,
            content: agendaContent,
        },
        sponsorsTitle: (_z = doc.sponsorsTitle) !== null && _z !== void 0 ? _z : '',
        sponsors: sortByOrder((_0 = doc.sponsors) !== null && _0 !== void 0 ? _0 : []).map(function (s) {
            var _a, _b, _c;
            return ({
                id: s.id,
                sortOrder: (_a = s.sortOrder) !== null && _a !== void 0 ? _a : 0,
                name: (_b = s.name) !== null && _b !== void 0 ? _b : '',
                tier: (_c = s.tier) !== null && _c !== void 0 ? _c : 'Partner',
                logoUrl: normalizeSummitAssetUrl(s.logoUrl) || '',
            });
        }),
        createdAt: (_3 = (_2 = (_1 = doc.createdAt) === null || _1 === void 0 ? void 0 : _1.toISOString) === null || _2 === void 0 ? void 0 : _2.call(_1)) !== null && _3 !== void 0 ? _3 : new Date().toISOString(),
        updatedAt: (_6 = (_5 = (_4 = doc.updatedAt) === null || _4 === void 0 ? void 0 : _4.toISOString) === null || _5 === void 0 ? void 0 : _5.call(_4)) !== null && _6 !== void 0 ? _6 : new Date().toISOString(),
    };
}
function mapSummitToPublicListItem(doc, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var banners = sortByOrder((_a = doc.banners) !== null && _a !== void 0 ? _a : []);
    var id = doc._id != null
        ? typeof doc._id === 'object' && 'toString' in doc._id
            ? doc._id.toString()
            : String(doc._id)
        : '';
    var aboutContent = (_c = (_b = doc.aboutSummit) === null || _b === void 0 ? void 0 : _b.content) !== null && _c !== void 0 ? _c : '';
    var excerptRaw = stripHtmlForExcerpt(aboutContent);
    var excerpt = excerptRaw.length > 200 ? "".concat(excerptRaw.slice(0, 197), "...") : excerptRaw;
    var coverImageUrl = resolveSummitCoverImageUrl(doc, options.origin);
    return {
        s_no: options.s_no,
        id: id,
        year: (_d = doc.year) !== null && _d !== void 0 ? _d : '',
        title: (_e = doc.title) !== null && _e !== void 0 ? _e : '',
        slug: (_f = doc.slug) !== null && _f !== void 0 ? _f : '',
        date: (_g = doc.date) !== null && _g !== void 0 ? _g : '',
        location: (_h = doc.location) !== null && _h !== void 0 ? _h : '',
        coverImageUrl: coverImageUrl,
        excerpt: excerpt,
        preview: {
            coverImageUrl: coverImageUrl,
            excerpt: excerpt,
        },
    };
}
function mapSummitToListItem(doc) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    var banners = sortByOrder((_a = doc.banners) !== null && _a !== void 0 ? _a : []);
    var firstBanner = banners.find(function (b) { var _a; return (_a = b.imageUrl) === null || _a === void 0 ? void 0 : _a.trim(); });
    var id = doc._id != null
        ? typeof doc._id === 'object' && 'toString' in doc._id
            ? doc._id.toString()
            : String(doc._id)
        : '';
    return {
        id: id,
        year: (_b = doc.year) !== null && _b !== void 0 ? _b : '',
        title: (_c = doc.title) !== null && _c !== void 0 ? _c : '',
        slug: (_d = doc.slug) !== null && _d !== void 0 ? _d : '',
        date: (_e = doc.date) !== null && _e !== void 0 ? _e : '',
        location: (_f = doc.location) !== null && _f !== void 0 ? _f : '',
        status: (0, summit_status_util_1.normalizeSummitStatus)(doc.status),
        coverImageUrl: normalizeSummitAssetUrl(firstBanner === null || firstBanner === void 0 ? void 0 : firstBanner.imageUrl) || null,
        speakerCount: (_h = (_g = doc.speakers) === null || _g === void 0 ? void 0 : _g.length) !== null && _h !== void 0 ? _h : 0,
        sponsorCount: (_k = (_j = doc.sponsors) === null || _j === void 0 ? void 0 : _j.length) !== null && _k !== void 0 ? _k : 0,
        bannerCount: banners.length,
        createdAt: (_o = (_m = (_l = doc.createdAt) === null || _l === void 0 ? void 0 : _l.toISOString) === null || _m === void 0 ? void 0 : _m.call(_l)) !== null && _o !== void 0 ? _o : new Date().toISOString(),
        updatedAt: (_r = (_q = (_p = doc.updatedAt) === null || _p === void 0 ? void 0 : _p.toISOString) === null || _q === void 0 ? void 0 : _q.call(_p)) !== null && _r !== void 0 ? _r : new Date().toISOString(),
    };
}
