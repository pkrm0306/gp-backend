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
exports.sortSummitItems = sortSummitItems;
exports.throwSummitFieldErrors = throwSummitFieldErrors;
exports.parseAgendaHtmlToTexts = parseAgendaHtmlToTexts;
exports.mapHighlightsFromDoc = mapHighlightsFromDoc;
exports.mapEventOutcomesFromDoc = mapEventOutcomesFromDoc;
exports.mapFocusedAreasFromDoc = mapFocusedAreasFromDoc;
exports.mapAgendaFromDoc = mapAgendaFromDoc;
exports.normalizeHighlightsSection = normalizeHighlightsSection;
exports.normalizeEventOutcomesSection = normalizeEventOutcomesSection;
exports.normalizeFocusedAreaSection = normalizeFocusedAreaSection;
exports.normalizeAgendaSectionInput = normalizeAgendaSectionInput;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var summit_constants_1 = require("../constants/summit.constants");
function ensureItemId(id) {
    if (id && String(id).trim()) {
        return String(id).trim();
    }
    return new mongoose_1.Types.ObjectId().toString();
}
function isPlainObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function sortSummitItems(items) {
    return __spreadArray([], items, true).sort(function (a, b) { var _a, _b; return ((_a = a.sortOrder) !== null && _a !== void 0 ? _a : 0) - ((_b = b.sortOrder) !== null && _b !== void 0 ? _b : 0); });
}
function throwSummitFieldErrors(fieldErrors) {
    throw new common_1.BadRequestException({
        message: 'Validation failed',
        fieldErrors: fieldErrors,
        errors: fieldErrors,
    });
}
function readTrimmed(value) {
    return String(value !== null && value !== void 0 ? value : '').trim();
}
function extractNestedArray(value, nestedKeys) {
    if (Array.isArray(value)) {
        return value;
    }
    if (isPlainObject(value)) {
        for (var _i = 0, nestedKeys_1 = nestedKeys; _i < nestedKeys_1.length; _i++) {
            var key = nestedKeys_1[_i];
            var nested = value[key];
            if (Array.isArray(nested)) {
                return nested;
            }
        }
    }
    return [];
}
function validateSectionTitle(title, fieldKey, hasContent, errors) {
    if (!hasContent) {
        return;
    }
    if (!title) {
        errors[fieldKey] = 'Section title is required.';
        return;
    }
    if (title.length < summit_constants_1.SUMMIT_CMS_FIELD_MIN) {
        errors[fieldKey] = "Minimum ".concat(summit_constants_1.SUMMIT_CMS_FIELD_MIN, " characters are required.");
        return;
    }
    if (title.length > summit_constants_1.SUMMIT_CMS_FIELD_MAX) {
        errors[fieldKey] = "Maximum ".concat(summit_constants_1.SUMMIT_CMS_FIELD_MAX, " characters are allowed.");
    }
}
function validateRequiredField(value, fieldKey, label, errors) {
    if (!value) {
        errors[fieldKey] = "".concat(label, " is required.");
        return;
    }
    if (value.length < summit_constants_1.SUMMIT_CMS_FIELD_MIN) {
        errors[fieldKey] = "Minimum ".concat(summit_constants_1.SUMMIT_CMS_FIELD_MIN, " characters are required.");
        return;
    }
    if (value.length > summit_constants_1.SUMMIT_CMS_FIELD_MAX) {
        errors[fieldKey] = "Maximum ".concat(summit_constants_1.SUMMIT_CMS_FIELD_MAX, " characters are allowed.");
    }
}
function splitLegacyCardText(text, knownHeading) {
    var trimmed = readTrimmed(text);
    if (!trimmed) {
        return { heading: readTrimmed(knownHeading), description: '' };
    }
    var heading = readTrimmed(knownHeading);
    if (heading) {
        var prefix = "".concat(heading, " \u2014 ");
        if (trimmed.startsWith(prefix)) {
            return {
                heading: heading,
                description: readTrimmed(trimmed.slice(prefix.length)),
            };
        }
        if (trimmed === heading) {
            return { heading: heading, description: '' };
        }
        return { heading: heading, description: trimmed };
    }
    var separatorIndex = trimmed.indexOf(' — ');
    if (separatorIndex > 0) {
        return {
            heading: readTrimmed(trimmed.slice(0, separatorIndex)),
            description: readTrimmed(trimmed.slice(separatorIndex + 3)),
        };
    }
    return { heading: '', description: trimmed };
}
function cardRowFromInput(item, index) {
    var _a, _b, _c;
    var source = (item !== null && item !== void 0 ? item : {});
    var legacyText = readTrimmed((_a = source.text) !== null && _a !== void 0 ? _a : source.point);
    var heading = readTrimmed((_c = (_b = source.heading) !== null && _b !== void 0 ? _b : source.title) !== null && _c !== void 0 ? _c : source.label);
    var description = readTrimmed(source.description);
    if (!description && legacyText) {
        var parsed = splitLegacyCardText(legacyText, heading || undefined);
        heading = heading || parsed.heading;
        description = parsed.description;
    }
    else if (!description) {
        description = legacyText;
    }
    else if (!heading && description.includes(' — ')) {
        var parsed = splitLegacyCardText(description);
        heading = parsed.heading;
        description = parsed.description;
    }
    return {
        id: ensureItemId(source.id),
        sortOrder: typeof source.sortOrder === 'number' ? source.sortOrder : index,
        heading: heading,
        description: description || (heading ? '' : legacyText),
    };
}
function pointRowFromInput(item, index) {
    var _a, _b, _c;
    if (typeof item === 'string' || typeof item === 'number') {
        return {
            id: ensureItemId(undefined),
            sortOrder: index,
            text: readTrimmed(item),
        };
    }
    var source = (item !== null && item !== void 0 ? item : {});
    var legacyText = readTrimmed((_a = source.text) !== null && _a !== void 0 ? _a : source.point);
    var heading = readTrimmed((_c = (_b = source.heading) !== null && _b !== void 0 ? _b : source.title) !== null && _c !== void 0 ? _c : source.label);
    var description = readTrimmed(source.description);
    var text = legacyText || combineCardText(heading, description) || heading;
    return {
        id: ensureItemId(source.id),
        sortOrder: typeof source.sortOrder === 'number' ? source.sortOrder : index,
        text: text,
    };
}
function normalizeFocusPointsFromCard(source) {
    var _a, _b, _c, _d;
    var fromPoints = extractNestedArray(source.points, ['items']).map(function (point, pointIndex) { return pointRowFromInput(point, pointIndex); });
    var fromItems = extractNestedArray(source.items, []).map(function (item, itemIndex) {
        return pointRowFromInput(item, itemIndex);
    });
    if (fromPoints.length === 0) {
        return fromItems;
    }
    if (fromItems.length === 0) {
        return fromPoints;
    }
    var merged = [];
    var maxLen = Math.max(fromPoints.length, fromItems.length);
    for (var index = 0; index < maxLen; index++) {
        var point = fromPoints[index];
        var item = fromItems[index];
        if (point && readTrimmed(point.text)) {
            merged.push(__assign(__assign({}, point), { sortOrder: (_a = point.sortOrder) !== null && _a !== void 0 ? _a : index }));
            continue;
        }
        if (item && readTrimmed(item.text)) {
            merged.push({
                id: (_b = point === null || point === void 0 ? void 0 : point.id) !== null && _b !== void 0 ? _b : item.id,
                sortOrder: (_d = (_c = point === null || point === void 0 ? void 0 : point.sortOrder) !== null && _c !== void 0 ? _c : item.sortOrder) !== null && _d !== void 0 ? _d : index,
                text: item.text,
            });
            continue;
        }
    }
    return merged.filter(function (point) { return readTrimmed(point.text); });
}
function shouldRegroupFlatAreaPoints(entries) {
    if (entries.length <= summit_constants_1.SUMMIT_CMS_CARD_MAX) {
        return false;
    }
    return entries.every(function (entry) {
        var _a, _b;
        if (typeof entry === 'string' || typeof entry === 'number') {
            return true;
        }
        var source = (entry !== null && entry !== void 0 ? entry : {});
        var hasNestedPoints = extractNestedArray(source.points, ['items']).length > 0;
        var heading = readTrimmed((_b = (_a = source.heading) !== null && _a !== void 0 ? _a : source.title) !== null && _b !== void 0 ? _b : source.label);
        return !hasNestedPoints && !heading;
    });
}
function reconstructFocusedAreaCardsFromAreaPoints(areaPoints) {
    var _a;
    var parsed = sortSummitItems(areaPoints.map(function (item, index) {
        var _a, _b;
        var source = (item !== null && item !== void 0 ? item : {});
        var bullet = pointRowFromInput(source, index);
        var topicHeading = readTrimmed((_b = (_a = source.heading) !== null && _a !== void 0 ? _a : source.title) !== null && _b !== void 0 ? _b : source.label);
        return {
            source: source,
            sortOrder: typeof source.sortOrder === 'number' ? source.sortOrder : index,
            bullet: bullet,
            topicHeading: topicHeading,
        };
    }));
    var topicShaped = parsed.filter(function (row) {
        return row.topicHeading &&
            readTrimmed(row.bullet.text) &&
            row.bullet.text !== row.topicHeading;
    });
    if (topicShaped.length > 0 &&
        topicShaped.length === parsed.length &&
        topicShaped.length <= summit_constants_1.SUMMIT_CMS_CARD_MAX * 3) {
        return topicShaped.slice(0, summit_constants_1.SUMMIT_CMS_CARD_MAX).map(function (row, index) {
            var _a;
            return ({
                id: ensureItemId(row.source.id),
                sortOrder: (_a = row.sortOrder) !== null && _a !== void 0 ? _a : index,
                heading: row.topicHeading,
                points: [
                    {
                        id: ensureItemId(undefined),
                        sortOrder: 0,
                        text: row.bullet.text,
                    },
                ],
            });
        });
    }
    var groups = new Map();
    for (var _i = 0, parsed_1 = parsed; _i < parsed_1.length; _i++) {
        var row = parsed_1[_i];
        var groupKey = Math.floor(row.sortOrder / 10);
        var bucket = (_a = groups.get(groupKey)) !== null && _a !== void 0 ? _a : [];
        bucket.push(row);
        groups.set(groupKey, bucket);
    }
    if (groups.size > 1) {
        return __spreadArray([], groups.entries(), true).sort(function (a, b) { return a[0] - b[0]; })
            .slice(0, summit_constants_1.SUMMIT_CMS_CARD_MAX)
            .map(function (_a, index) {
            var _b;
            var groupKey = _a[0], rows = _a[1];
            return ({
                id: ensureItemId(undefined),
                sortOrder: groupKey,
                heading: readTrimmed((_b = rows[0]) === null || _b === void 0 ? void 0 : _b.topicHeading) || "Topic ".concat(index + 1),
                points: sortSummitItems(rows
                    .map(function (row, pointIndex) { return ({
                    id: ensureItemId(row.source.id),
                    sortOrder: row.sortOrder % 10 || pointIndex,
                    text: row.bullet.text,
                }); })
                    .filter(function (point) { return readTrimmed(point.text); })).slice(0, summit_constants_1.SUMMIT_FOCUS_POINTS_MAX),
            });
        });
    }
    var chunks = [];
    for (var index = 0; index < parsed.length; index += summit_constants_1.SUMMIT_FOCUS_POINTS_MAX) {
        chunks.push(parsed.slice(index, index + summit_constants_1.SUMMIT_FOCUS_POINTS_MAX));
    }
    return chunks.slice(0, summit_constants_1.SUMMIT_CMS_CARD_MAX).map(function (rows, index) {
        var _a;
        return ({
            id: ensureItemId(undefined),
            sortOrder: index,
            heading: readTrimmed((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.topicHeading) || "Topic ".concat(index + 1),
            points: rows
                .map(function (row, pointIndex) { return ({
                id: ensureItemId(row.source.id),
                sortOrder: pointIndex,
                text: row.bullet.text,
            }); })
                .filter(function (point) { return readTrimmed(point.text); }),
        });
    });
}
function focusCardFromInput(card, index) {
    var _a, _b, _c, _d, _e;
    var source = (card !== null && card !== void 0 ? card : {});
    var points = normalizeFocusPointsFromCard(source);
    if (points.length === 0) {
        var cardHeading = readTrimmed((_b = (_a = source.heading) !== null && _a !== void 0 ? _a : source.title) !== null && _b !== void 0 ? _b : source.label);
        var cardDescription = readTrimmed(source.description);
        var legacyText = readTrimmed((_c = source.text) !== null && _c !== void 0 ? _c : source.point);
        if (!cardDescription && legacyText) {
            var parsed = splitLegacyCardText(legacyText, cardHeading || undefined);
            cardHeading = cardHeading || parsed.heading;
            cardDescription = parsed.description;
        }
        var fallbackText = cardDescription || cardHeading || legacyText;
        if (fallbackText) {
            points = [
                {
                    id: ensureItemId(undefined),
                    sortOrder: 0,
                    text: fallbackText,
                },
            ];
        }
    }
    return {
        id: ensureItemId(source.id),
        sortOrder: typeof source.sortOrder === 'number' ? source.sortOrder : index,
        heading: readTrimmed((_e = (_d = source.heading) !== null && _d !== void 0 ? _d : source.title) !== null && _e !== void 0 ? _e : source.label),
        points: points,
    };
}
/** Parse legacy agenda HTML into plain-text bullet rows. */
function parseAgendaHtmlToTexts(html) {
    var raw = String(html !== null && html !== void 0 ? html : '').trim();
    if (!raw) {
        return [];
    }
    var liMatches = __spreadArray([], raw.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi), true);
    if (liMatches.length > 0) {
        return liMatches
            .map(function (match) { return stripHtml(match[1]); })
            .map(function (line) { return line.trim(); })
            .filter(Boolean);
    }
    var pMatches = __spreadArray([], raw.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi), true);
    if (pMatches.length > 0) {
        return pMatches
            .map(function (match) { return stripHtml(match[1]); })
            .map(function (line) { return line.trim(); })
            .filter(Boolean);
    }
    var plain = stripHtml(raw);
    if (!plain) {
        return [];
    }
    return plain
        .split(/\r?\n/)
        .map(function (line) { return line.trim(); })
        .filter(Boolean);
}
function stripHtml(html) {
    return String(html)
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
function mapStoredCardRow(item, index) {
    var _a;
    var legacyText = readTrimmed(item.text);
    var heading = readTrimmed(item.heading);
    var description = readTrimmed(item.description);
    return {
        id: ensureItemId(item.id),
        sortOrder: (_a = item.sortOrder) !== null && _a !== void 0 ? _a : index,
        heading: heading,
        description: description || legacyText,
    };
}
function mapHighlightsFromDoc(doc) {
    var _a;
    var rows = sortSummitItems((_a = doc.highlights) !== null && _a !== void 0 ? _a : []).map(mapStoredCardRow);
    return rows.slice(0, summit_constants_1.SUMMIT_CMS_CARD_MAX);
}
function mapEventOutcomesFromDoc(doc) {
    var _a;
    var rows = sortSummitItems((_a = doc.eventOutcomes) !== null && _a !== void 0 ? _a : []).map(mapStoredCardRow);
    return rows.slice(0, summit_constants_1.SUMMIT_CMS_CARD_MAX);
}
function mapFocusedAreasFromDoc(doc) {
    var _a, _b;
    var stored = sortSummitItems((_a = doc.focusedAreas) !== null && _a !== void 0 ? _a : []);
    if (stored.length > 0) {
        return stored.slice(0, summit_constants_1.SUMMIT_CMS_CARD_MAX).map(function (card, index) {
            var _a, _b;
            return ({
                id: ensureItemId(card.id),
                sortOrder: (_a = card.sortOrder) !== null && _a !== void 0 ? _a : index,
                heading: readTrimmed(card.heading),
                points: sortSummitItems((_b = card.points) !== null && _b !== void 0 ? _b : [])
                    .slice(0, summit_constants_1.SUMMIT_FOCUS_POINTS_MAX)
                    .map(function (point, pointIndex) {
                    var _a;
                    return ({
                        id: ensureItemId(point.id),
                        sortOrder: (_a = point.sortOrder) !== null && _a !== void 0 ? _a : pointIndex,
                        text: readTrimmed(point.text),
                    });
                }),
            });
        });
    }
    var legacy = sortSummitItems((_b = doc.areaPoints) !== null && _b !== void 0 ? _b : []);
    return legacy.slice(0, summit_constants_1.SUMMIT_CMS_CARD_MAX).map(function (point, index) {
        var _a;
        return ({
            id: ensureItemId(point.id),
            sortOrder: (_a = point.sortOrder) !== null && _a !== void 0 ? _a : index,
            heading: '',
            points: [
                {
                    id: new mongoose_1.Types.ObjectId().toString(),
                    sortOrder: 0,
                    text: readTrimmed(point.text),
                },
            ],
        });
    });
}
function combineCardText(heading, description) {
    if (heading && description) {
        return "".concat(heading, " \u2014 ").concat(description);
    }
    return heading || description;
}
function agendaPointRowFromStored(item, index) {
    var _a;
    var legacyText = readTrimmed(item.text);
    var heading = readTrimmed(item.heading);
    var description = readTrimmed(item.description) || legacyText;
    return {
        id: ensureItemId(item.id),
        sortOrder: (_a = item.sortOrder) !== null && _a !== void 0 ? _a : index,
        heading: heading,
        description: description,
        text: combineCardText(heading, description),
    };
}
function mapAgendaFromDoc(doc) {
    var _a, _b, _c, _d, _e, _f;
    var legacyAgendaTitle = readTrimmed((_c = (_a = doc.agendaTitle) !== null && _a !== void 0 ? _a : (_b = doc.agenda) === null || _b === void 0 ? void 0 : _b.title) !== null && _c !== void 0 ? _c : doc.agendaTitleLegacy);
    var title = legacyAgendaTitle || "GreenPro's Core Agenda";
    var stored = sortSummitItems((_d = doc.agendaPoints) !== null && _d !== void 0 ? _d : []);
    if (stored.length > 0) {
        return {
            title: title,
            points: stored.map(function (point, index) {
                return agendaPointRowFromStored(point, index);
            }),
        };
    }
    var parsed = parseAgendaHtmlToTexts((_f = (_e = doc.agenda) === null || _e === void 0 ? void 0 : _e.content) !== null && _f !== void 0 ? _f : '');
    return {
        title: title,
        points: parsed.map(function (text, index) { return ({
            id: new mongoose_1.Types.ObjectId().toString(),
            sortOrder: index,
            heading: '',
            description: text,
            text: text,
        }); }),
    };
}
function normalizeHighlightsSection(body) {
    var _a, _b;
    var errors = {};
    var rawItems = extractNestedArray(body.highlights, ['items', 'points']);
    var items = rawItems.map(function (item, index) { return cardRowFromInput(item, index); });
    if (items.length > summit_constants_1.SUMMIT_CMS_CARD_MAX) {
        errors['highlights.max'] = "Maximum ".concat(summit_constants_1.SUMMIT_CMS_CARD_MAX, " highlights are allowed.");
    }
    var sorted = sortSummitItems(items).slice(0, summit_constants_1.SUMMIT_CMS_CARD_MAX);
    for (var _i = 0, sorted_1 = sorted; _i < sorted_1.length; _i++) {
        var item = sorted_1[_i];
        validateRequiredField(item.heading, "highlight.".concat(item.id, ".heading"), 'Highlight heading', errors);
        validateRequiredField(item.description, "highlight.".concat(item.id, ".description"), 'Highlight description', errors);
    }
    var rawTitle = readTrimmed((_b = (_a = body.highlightsTitle) !== null && _a !== void 0 ? _a : body.highlights_title) !== null && _b !== void 0 ? _b : (isPlainObject(body.highlights) ? body.highlights.title : undefined));
    validateSectionTitle(rawTitle, 'highlights.title', sorted.length > 0, errors);
    if (Object.keys(errors).length > 0) {
        throwSummitFieldErrors(errors);
    }
    return { title: rawTitle, items: sorted };
}
function normalizeEventOutcomesSection(body) {
    var _a, _b;
    var errors = {};
    var rawItems = extractNestedArray(body.eventOutcomes, ['items', 'points']);
    var items = rawItems.map(function (item, index) { return cardRowFromInput(item, index); });
    if (items.length > summit_constants_1.SUMMIT_CMS_CARD_MAX) {
        errors['event-outcomes.max'] =
            "Maximum ".concat(summit_constants_1.SUMMIT_CMS_CARD_MAX, " event outcomes are allowed.");
    }
    var sorted = sortSummitItems(items).slice(0, summit_constants_1.SUMMIT_CMS_CARD_MAX);
    for (var _i = 0, sorted_2 = sorted; _i < sorted_2.length; _i++) {
        var item = sorted_2[_i];
        validateRequiredField(item.heading, "outcome.".concat(item.id, ".heading"), 'Outcome heading', errors);
        validateRequiredField(item.description, "outcome.".concat(item.id, ".description"), 'Outcome description', errors);
    }
    var rawTitle = readTrimmed((_b = (_a = body.eventOutcomesTitle) !== null && _a !== void 0 ? _a : body.event_outcomes_title) !== null && _b !== void 0 ? _b : (isPlainObject(body.eventOutcomes)
        ? body.eventOutcomes.title
        : undefined));
    validateSectionTitle(rawTitle, 'event-outcomes.title', sorted.length > 0, errors);
    if (Object.keys(errors).length > 0) {
        throwSummitFieldErrors(errors);
    }
    return { title: rawTitle, items: sorted };
}
function normalizeFocusedAreaSection(body) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var errors = {};
    var legacyFlat = extractNestedArray((_b = (_a = body.areaPoints) !== null && _a !== void 0 ? _a : body.focusedAreaPoints) !== null && _b !== void 0 ? _b : body.focused_area_points, []);
    var rawCards = extractNestedArray((_e = (_d = (_c = body.focusedAreas) !== null && _c !== void 0 ? _c : body.focused_areas) !== null && _d !== void 0 ? _d : body.focusedArea) !== null && _e !== void 0 ? _e : body.focused_area, ['items', 'cards', 'points']);
    var areaPointsLookLikeCards = legacyFlat.some(function (entry) {
        if (!isPlainObject(entry))
            return false;
        return (extractNestedArray(entry.points, ['items']).length > 0 ||
            extractNestedArray(entry.items, []).length > 0);
    });
    if (!rawCards.length && legacyFlat.length) {
        // Admin CMS sends topic cards under `areaPoints` (heading + nested points).
        // Treat those as cards; only use the flat-bullet regrouper for legacy rows.
        rawCards = areaPointsLookLikeCards
            ? legacyFlat
            : reconstructFocusedAreaCardsFromAreaPoints(legacyFlat);
    }
    else if (rawCards.length > summit_constants_1.SUMMIT_CMS_CARD_MAX &&
        shouldRegroupFlatAreaPoints(rawCards)) {
        rawCards = reconstructFocusedAreaCardsFromAreaPoints(rawCards);
    }
    var cards = rawCards.map(function (card, index) { return focusCardFromInput(card, index); });
    if (cards.length > summit_constants_1.SUMMIT_CMS_CARD_MAX) {
        errors['focused-area.max'] =
            "Maximum ".concat(summit_constants_1.SUMMIT_CMS_CARD_MAX, " focused-area cards are allowed.");
    }
    var sorted = sortSummitItems(cards).slice(0, summit_constants_1.SUMMIT_CMS_CARD_MAX);
    for (var _i = 0, sorted_3 = sorted; _i < sorted_3.length; _i++) {
        var card = sorted_3[_i];
        validateRequiredField(card.heading, "focus-card.".concat(card.id, ".heading"), 'Topic heading', errors);
        if (card.points.length === 0) {
            errors["focus-card.".concat(card.id, ".points.min")] =
                'At least 1 point is required per topic card.';
        }
        if (card.points.length > summit_constants_1.SUMMIT_FOCUS_POINTS_MAX) {
            errors["focus-card.".concat(card.id, ".points.max")] =
                "Maximum ".concat(summit_constants_1.SUMMIT_FOCUS_POINTS_MAX, " points are allowed per topic card.");
        }
        var sortedPoints = sortSummitItems(card.points).slice(0, summit_constants_1.SUMMIT_FOCUS_POINTS_MAX);
        for (var _j = 0, sortedPoints_1 = sortedPoints; _j < sortedPoints_1.length; _j++) {
            var point = sortedPoints_1[_j];
            validateRequiredField(point.text, "focus-point.".concat(point.id, ".text"), 'Point text', errors);
        }
        card.points = sortedPoints;
    }
    var rawTitle = readTrimmed((_h = (_g = (_f = body.focusedAreaTitle) !== null && _f !== void 0 ? _f : body.focused_area_title) !== null && _g !== void 0 ? _g : (isPlainObject(body.focusedArea) ? body.focusedArea.title : undefined)) !== null && _h !== void 0 ? _h : (isPlainObject(body.focused_area) ? body.focused_area.title : undefined));
    validateSectionTitle(rawTitle, 'focused-area.title', sorted.length > 0, errors);
    if (Object.keys(errors).length > 0) {
        throwSummitFieldErrors(errors);
    }
    return { title: rawTitle, cards: sorted };
}
function normalizeAgendaSectionInput(body) {
    var _a, _b, _c, _d, _e, _f;
    var errors = {};
    var rawPoints = extractNestedArray((_c = (_b = (_a = body.agendaPoints) !== null && _a !== void 0 ? _a : (Array.isArray(body.agenda) ? body.agenda : undefined)) !== null && _b !== void 0 ? _b : (isPlainObject(body.agenda) ? body.agenda.points : undefined)) !== null && _c !== void 0 ? _c : (isPlainObject(body.agenda) ? body.agenda.items : undefined), ['items', 'points']);
    var pointsSource = rawPoints;
    var fromLegacyHtml = false;
    if (!pointsSource.length &&
        isPlainObject(body.agenda) &&
        String((_d = body.agenda.content) !== null && _d !== void 0 ? _d : '').trim()) {
        pointsSource = parseAgendaHtmlToTexts(String(body.agenda.content)).map(function (text) { return ({ text: text }); });
        fromLegacyHtml = true;
    }
    var legacyTextOnlyIds = new Set();
    var points = pointsSource.map(function (point, index) {
        var _a, _b, _c;
        var row = cardRowFromInput(point, index);
        var source = (point !== null && point !== void 0 ? point : {});
        var isLegacyTextOnly = !readTrimmed((_b = (_a = source.heading) !== null && _a !== void 0 ? _a : source.title) !== null && _b !== void 0 ? _b : source.label) &&
            readTrimmed((_c = source.text) !== null && _c !== void 0 ? _c : source.point).length > 0 &&
            source.description === undefined;
        if (fromLegacyHtml || isLegacyTextOnly) {
            legacyTextOnlyIds.add(row.id);
        }
        return __assign(__assign({}, row), { text: combineCardText(row.heading, row.description) });
    });
    var sorted = sortSummitItems(points);
    for (var _i = 0, sorted_4 = sorted; _i < sorted_4.length; _i++) {
        var point = sorted_4[_i];
        if (!legacyTextOnlyIds.has(point.id)) {
            validateRequiredField(point.heading, "agenda-point.".concat(point.id, ".heading"), 'Agenda point heading', errors);
        }
        validateRequiredField(point.description, "agenda-point.".concat(point.id, ".description"), 'Agenda point description', errors);
    }
    var rawTitle = readTrimmed((_f = (_e = body.agendaTitle) !== null && _e !== void 0 ? _e : body.agenda_title) !== null && _f !== void 0 ? _f : (isPlainObject(body.agenda) ? body.agenda.title : undefined));
    validateSectionTitle(rawTitle, 'agenda.title', sorted.length > 0, errors);
    if (Object.keys(errors).length > 0) {
        throwSummitFieldErrors(errors);
    }
    return { title: rawTitle, points: sorted };
}
