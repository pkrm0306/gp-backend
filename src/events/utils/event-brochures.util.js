"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_BROCHURE_LINK_MAX = exports.EVENT_BROCHURE_HEADING_MAX = exports.EVENT_BROCHURES_MAX = void 0;
exports.normalizeEventBrochuresInput = normalizeEventBrochuresInput;
exports.mapEventBrochuresFromDoc = mapEventBrochuresFromDoc;
exports.primaryEventBrochureLink = primaryEventBrochureLink;
var common_1 = require("@nestjs/common");
exports.EVENT_BROCHURES_MAX = 20;
exports.EVENT_BROCHURE_HEADING_MAX = 200;
exports.EVENT_BROCHURE_LINK_MAX = 2048;
function readTrim(value) {
    return String(value !== null && value !== void 0 ? value : '').trim();
}
function parseBrochuresRaw(raw) {
    if (raw === undefined || raw === null) {
        return [];
    }
    if (typeof raw === 'string') {
        var trimmed = raw.trim();
        if (!trimmed) {
            return [];
        }
        try {
            var parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                return parsed;
            }
            if (parsed && typeof parsed === 'object') {
                return [parsed];
            }
            throw new Error('invalid');
        }
        catch (_a) {
            throw new common_1.BadRequestException('brochures must be a valid JSON array');
        }
    }
    if (Array.isArray(raw)) {
        return raw;
    }
    if (typeof raw === 'object') {
        return [raw];
    }
    throw new common_1.BadRequestException('brochures must be an array');
}
/** Validate and normalize brochures from admin create/update payloads. */
function normalizeEventBrochuresInput(raw) {
    var items = parseBrochuresRaw(raw);
    var errors = {};
    var out = [];
    items.forEach(function (item, index) {
        var _a, _b, _c, _d, _e;
        var rec = (item !== null && item !== void 0 ? item : {});
        var heading = readTrim((_b = (_a = rec.heading) !== null && _a !== void 0 ? _a : rec.title) !== null && _b !== void 0 ? _b : rec.name);
        var link = readTrim((_e = (_d = (_c = rec.link) !== null && _c !== void 0 ? _c : rec.url) !== null && _d !== void 0 ? _d : rec.brochureLink) !== null && _e !== void 0 ? _e : rec.brochure_link);
        var prefix = "brochures[".concat(index, "]");
        if (!heading && !link) {
            return;
        }
        if (!heading) {
            errors["".concat(prefix, ".heading")] = 'Brochure heading is required.';
        }
        else if (heading.length > exports.EVENT_BROCHURE_HEADING_MAX) {
            errors["".concat(prefix, ".heading")] =
                "Maximum ".concat(exports.EVENT_BROCHURE_HEADING_MAX, " characters are allowed.");
        }
        if (!link) {
            errors["".concat(prefix, ".link")] = 'Brochure link is required.';
        }
        else if (link.length > exports.EVENT_BROCHURE_LINK_MAX) {
            errors["".concat(prefix, ".link")] =
                "Maximum ".concat(exports.EVENT_BROCHURE_LINK_MAX, " characters are allowed.");
        }
        out.push({ heading: heading, link: link });
    });
    if (out.length > exports.EVENT_BROCHURES_MAX) {
        errors['brochures.max'] =
            "Maximum ".concat(exports.EVENT_BROCHURES_MAX, " brochures are allowed.");
    }
    if (Object.keys(errors).length > 0) {
        throw new common_1.BadRequestException({
            message: 'Validation failed',
            fieldErrors: errors,
            errors: errors,
        });
    }
    return out;
}
/** Read brochures from stored event doc, migrating legacy single `brochureLink`. */
function mapEventBrochuresFromDoc(doc) {
    var stored = Array.isArray(doc.brochures) ? doc.brochures : [];
    var rows = stored
        .map(function (item) { return ({
        heading: readTrim(item.heading),
        link: readTrim(item.link),
    }); })
        .filter(function (item) { return item.heading || item.link; });
    if (rows.length > 0) {
        return rows;
    }
    var legacyLink = readTrim(doc.brochureLink);
    if (legacyLink) {
        return [{ heading: 'Brochure', link: legacyLink }];
    }
    return [];
}
function primaryEventBrochureLink(brochures) {
    var first = brochures.find(function (item) { return readTrim(item.link); });
    return first ? readTrim(first.link) : undefined;
}
