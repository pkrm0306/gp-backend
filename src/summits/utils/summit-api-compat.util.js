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
exports.formatSummitCardLegacyText = formatSummitCardLegacyText;
exports.enrichSummitCardRow = enrichSummitCardRow;
exports.enrichFocusedAreaRow = enrichFocusedAreaRow;
exports.buildAgendaHtmlFromPoints = buildAgendaHtmlFromPoints;
exports.mapLegacyAreaPoints = mapLegacyAreaPoints;
function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
/** Flat string for legacy website parsers (`asStringArray` reads `text` first). */
function formatSummitCardLegacyText(heading, description) {
    var h = String(heading !== null && heading !== void 0 ? heading : '').trim();
    var d = String(description !== null && description !== void 0 ? description : '').trim();
    if (h && d) {
        return "".concat(h, " \u2014 ").concat(d);
    }
    return h || d;
}
function enrichSummitCardRow(row) {
    var _a, _b;
    var heading = String((_a = row.heading) !== null && _a !== void 0 ? _a : '').trim();
    var description = String((_b = row.description) !== null && _b !== void 0 ? _b : '').trim();
    return __assign(__assign({}, row), { title: heading, text: formatSummitCardLegacyText(heading, description) });
}
function enrichFocusedAreaRow(area) {
    var _a, _b;
    var heading = String((_a = area.heading) !== null && _a !== void 0 ? _a : '').trim();
    var items = ((_b = area.points) !== null && _b !== void 0 ? _b : [])
        .map(function (point) { var _a; return String((_a = point.text) !== null && _a !== void 0 ? _a : '').trim(); })
        .filter(Boolean);
    return __assign(__assign({}, area), { title: heading, items: items });
}
function buildAgendaHtmlFromPoints(points) {
    var rows = points
        .map(function (point) {
        var _a, _b, _c;
        return ({
            heading: String((_a = point.heading) !== null && _a !== void 0 ? _a : '').trim(),
            description: String((_b = point.description) !== null && _b !== void 0 ? _b : '').trim() ||
                String((_c = point.text) !== null && _c !== void 0 ? _c : '').trim(),
        });
    })
        .filter(function (row) { return row.heading || row.description; });
    if (rows.length === 0) {
        return '';
    }
    var items = rows.map(function (row) {
        if (row.heading && row.description) {
            return "<li><strong>".concat(escapeHtml(row.heading), "</strong> \u2014 ").concat(escapeHtml(row.description), "</li>");
        }
        return "<li>".concat(escapeHtml(row.heading || row.description), "</li>");
    });
    return "<ul>".concat(items.join(''), "</ul>");
}
function mapLegacyAreaPoints(doc, focusedAreas) {
    var _a;
    var legacy = (_a = doc.areaPoints) !== null && _a !== void 0 ? _a : [];
    if (legacy.length > 0) {
        return legacy.map(function (point, index) {
            var _a, _b, _c;
            return ({
                id: String((_a = point.id) !== null && _a !== void 0 ? _a : '').trim() || "area-".concat(index),
                sortOrder: (_b = point.sortOrder) !== null && _b !== void 0 ? _b : index,
                text: String((_c = point.text) !== null && _c !== void 0 ? _c : '').trim(),
            });
        });
    }
    return focusedAreas.flatMap(function (area, areaIndex) {
        var _a;
        return ((_a = area.points) !== null && _a !== void 0 ? _a : []).map(function (point, pointIndex) {
            var _a;
            return ({
                id: point.id,
                sortOrder: area.sortOrder * 10 + pointIndex,
                text: String((_a = point.text) !== null && _a !== void 0 ? _a : '').trim(),
            });
        });
    });
}
