"use strict";
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
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const summit_constants_1 = require("../constants/summit.constants");
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
    return [...items].sort((a, b) => { var _a, _b; return ((_a = a.sortOrder) !== null && _a !== void 0 ? _a : 0) - ((_b = b.sortOrder) !== null && _b !== void 0 ? _b : 0); });
}
function throwSummitFieldErrors(fieldErrors) {
    throw new common_1.BadRequestException({
        message: 'Validation failed',
        fieldErrors,
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
        for (const key of nestedKeys) {
            const nested = value[key];
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
        errors[fieldKey] = `Minimum ${summit_constants_1.SUMMIT_CMS_FIELD_MIN} characters are required.`;
        return;
    }
    if (title.length > summit_constants_1.SUMMIT_CMS_FIELD_MAX) {
        errors[fieldKey] = `Maximum ${summit_constants_1.SUMMIT_CMS_FIELD_MAX} characters are allowed.`;
    }
}
/** True when a CMS text field has enough content to keep (not an empty draft UI row). */
function hasCmsFieldContent(value) {
    return value.length >= summit_constants_1.SUMMIT_CMS_FIELD_MIN;
}
/**
 * Draft/basic saves often send empty placeholder cards from other tabs.
 * Keep only fully filled rows; drop incomplete placeholders instead of failing.
 */
function isCompleteCardRow(item) {
    return hasCmsFieldContent(item.heading) && hasCmsFieldContent(item.description);
}
function validateCmsFieldMax(value, fieldKey, errors) {
    if (value.length > summit_constants_1.SUMMIT_CMS_FIELD_MAX) {
        errors[fieldKey] = `Maximum ${summit_constants_1.SUMMIT_CMS_FIELD_MAX} characters are allowed.`;
    }
}
function splitLegacyCardText(text, knownHeading) {
    const trimmed = readTrimmed(text);
    if (!trimmed) {
        return { heading: readTrimmed(knownHeading), description: '' };
    }
    const heading = readTrimmed(knownHeading);
    if (heading) {
        const prefix = `${heading} — `;
        if (trimmed.startsWith(prefix)) {
            return {
                heading,
                description: readTrimmed(trimmed.slice(prefix.length)),
            };
        }
        if (trimmed === heading) {
            return { heading, description: '' };
        }
        return { heading, description: trimmed };
    }
    const separatorIndex = trimmed.indexOf(' — ');
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
    const source = (item !== null && item !== void 0 ? item : {});
    const legacyText = readTrimmed((_a = source.text) !== null && _a !== void 0 ? _a : source.point);
    let heading = readTrimmed((_c = (_b = source.heading) !== null && _b !== void 0 ? _b : source.title) !== null && _c !== void 0 ? _c : source.label);
    let description = readTrimmed(source.description);
    if (!description && legacyText) {
        const parsed = splitLegacyCardText(legacyText, heading || undefined);
        heading = heading || parsed.heading;
        description = parsed.description;
    }
    else if (!description) {
        description = legacyText;
    }
    else if (!heading && description.includes(' — ')) {
        const parsed = splitLegacyCardText(description);
        heading = parsed.heading;
        description = parsed.description;
    }
    return {
        id: ensureItemId(source.id),
        sortOrder: typeof source.sortOrder === 'number' ? source.sortOrder : index,
        heading,
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
    const source = (item !== null && item !== void 0 ? item : {});
    const legacyText = readTrimmed((_a = source.text) !== null && _a !== void 0 ? _a : source.point);
    const heading = readTrimmed((_c = (_b = source.heading) !== null && _b !== void 0 ? _b : source.title) !== null && _c !== void 0 ? _c : source.label);
    const description = readTrimmed(source.description);
    const text = legacyText || combineCardText(heading, description) || heading;
    return {
        id: ensureItemId(source.id),
        sortOrder: typeof source.sortOrder === 'number' ? source.sortOrder : index,
        text,
    };
}
function normalizeFocusPointsFromCard(source) {
    var _a, _b, _c, _d;
    const fromPoints = extractNestedArray(source.points, ['items']).map((point, pointIndex) => pointRowFromInput(point, pointIndex));
    const fromItems = extractNestedArray(source.items, []).map((item, itemIndex) => pointRowFromInput(item, itemIndex));
    if (fromPoints.length === 0) {
        return fromItems;
    }
    if (fromItems.length === 0) {
        return fromPoints;
    }
    const merged = [];
    const maxLen = Math.max(fromPoints.length, fromItems.length);
    for (let index = 0; index < maxLen; index++) {
        const point = fromPoints[index];
        const item = fromItems[index];
        if (point && readTrimmed(point.text)) {
            merged.push({ ...point, sortOrder: (_a = point.sortOrder) !== null && _a !== void 0 ? _a : index });
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
    return merged.filter((point) => readTrimmed(point.text));
}
function shouldRegroupFlatAreaPoints(entries) {
    if (entries.length <= summit_constants_1.SUMMIT_CMS_CARD_MAX) {
        return false;
    }
    return entries.every((entry) => {
        var _a, _b;
        if (typeof entry === 'string' || typeof entry === 'number') {
            return true;
        }
        const source = (entry !== null && entry !== void 0 ? entry : {});
        const hasNestedPoints = extractNestedArray(source.points, ['items']).length > 0;
        const heading = readTrimmed((_b = (_a = source.heading) !== null && _a !== void 0 ? _a : source.title) !== null && _b !== void 0 ? _b : source.label);
        return !hasNestedPoints && !heading;
    });
}
function reconstructFocusedAreaCardsFromAreaPoints(areaPoints) {
    var _a;
    const parsed = sortSummitItems(areaPoints.map((item, index) => {
        var _a, _b;
        const source = (item !== null && item !== void 0 ? item : {});
        const bullet = pointRowFromInput(source, index);
        const topicHeading = readTrimmed((_b = (_a = source.heading) !== null && _a !== void 0 ? _a : source.title) !== null && _b !== void 0 ? _b : source.label);
        return {
            source,
            sortOrder: typeof source.sortOrder === 'number' ? source.sortOrder : index,
            bullet,
            topicHeading,
        };
    }));
    const topicShaped = parsed.filter((row) => row.topicHeading &&
        readTrimmed(row.bullet.text) &&
        row.bullet.text !== row.topicHeading);
    if (topicShaped.length > 0 &&
        topicShaped.length === parsed.length &&
        topicShaped.length <= summit_constants_1.SUMMIT_CMS_CARD_MAX * 3) {
        return topicShaped.slice(0, summit_constants_1.SUMMIT_CMS_CARD_MAX).map((row, index) => {
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
    const groups = new Map();
    for (const row of parsed) {
        const groupKey = Math.floor(row.sortOrder / 10);
        const bucket = (_a = groups.get(groupKey)) !== null && _a !== void 0 ? _a : [];
        bucket.push(row);
        groups.set(groupKey, bucket);
    }
    if (groups.size > 1) {
        return [...groups.entries()]
            .sort((a, b) => a[0] - b[0])
            .slice(0, summit_constants_1.SUMMIT_CMS_CARD_MAX)
            .map(([groupKey, rows], index) => {
            var _a;
            return ({
                id: ensureItemId(undefined),
                sortOrder: groupKey,
                heading: readTrimmed((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.topicHeading) || `Topic ${index + 1}`,
                points: sortSummitItems(rows
                    .map((row, pointIndex) => ({
                    id: ensureItemId(row.source.id),
                    sortOrder: row.sortOrder % 10 || pointIndex,
                    text: row.bullet.text,
                }))
                    .filter((point) => readTrimmed(point.text))).slice(0, summit_constants_1.SUMMIT_FOCUS_POINTS_MAX),
            });
        });
    }
    const chunks = [];
    for (let index = 0; index < parsed.length; index += summit_constants_1.SUMMIT_FOCUS_POINTS_MAX) {
        chunks.push(parsed.slice(index, index + summit_constants_1.SUMMIT_FOCUS_POINTS_MAX));
    }
    return chunks.slice(0, summit_constants_1.SUMMIT_CMS_CARD_MAX).map((rows, index) => {
        var _a;
        return ({
            id: ensureItemId(undefined),
            sortOrder: index,
            heading: readTrimmed((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.topicHeading) || `Topic ${index + 1}`,
            points: rows
                .map((row, pointIndex) => ({
                id: ensureItemId(row.source.id),
                sortOrder: pointIndex,
                text: row.bullet.text,
            }))
                .filter((point) => readTrimmed(point.text)),
        });
    });
}
function focusCardFromInput(card, index) {
    var _a, _b, _c, _d, _e;
    const source = (card !== null && card !== void 0 ? card : {});
    let points = normalizeFocusPointsFromCard(source);
    if (points.length === 0) {
        let cardHeading = readTrimmed((_b = (_a = source.heading) !== null && _a !== void 0 ? _a : source.title) !== null && _b !== void 0 ? _b : source.label);
        let cardDescription = readTrimmed(source.description);
        const legacyText = readTrimmed((_c = source.text) !== null && _c !== void 0 ? _c : source.point);
        if (!cardDescription && legacyText) {
            const parsed = splitLegacyCardText(legacyText, cardHeading || undefined);
            cardHeading = cardHeading || parsed.heading;
            cardDescription = parsed.description;
        }
        const fallbackText = cardDescription || cardHeading || legacyText;
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
        points,
    };
}
/** Parse legacy agenda HTML into plain-text bullet rows. */
function parseAgendaHtmlToTexts(html) {
    const raw = String(html !== null && html !== void 0 ? html : '').trim();
    if (!raw) {
        return [];
    }
    const liMatches = [...raw.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
    if (liMatches.length > 0) {
        return liMatches
            .map((match) => stripHtml(match[1]))
            .map((line) => line.trim())
            .filter(Boolean);
    }
    const pMatches = [...raw.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
    if (pMatches.length > 0) {
        return pMatches
            .map((match) => stripHtml(match[1]))
            .map((line) => line.trim())
            .filter(Boolean);
    }
    const plain = stripHtml(raw);
    if (!plain) {
        return [];
    }
    return plain
        .split(/\r?\n/)
        .map((line) => line.trim())
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
    const legacyText = readTrimmed(item.text);
    const heading = readTrimmed(item.heading);
    const description = readTrimmed(item.description);
    return {
        id: ensureItemId(item.id),
        sortOrder: (_a = item.sortOrder) !== null && _a !== void 0 ? _a : index,
        heading,
        description: description || legacyText,
    };
}
function mapHighlightsFromDoc(doc) {
    var _a;
    const rows = sortSummitItems((_a = doc.highlights) !== null && _a !== void 0 ? _a : []).map(mapStoredCardRow);
    return rows.slice(0, summit_constants_1.SUMMIT_CMS_CARD_MAX);
}
function mapEventOutcomesFromDoc(doc) {
    var _a;
    const rows = sortSummitItems((_a = doc.eventOutcomes) !== null && _a !== void 0 ? _a : []).map(mapStoredCardRow);
    return rows.slice(0, summit_constants_1.SUMMIT_CMS_CARD_MAX);
}
function mapFocusedAreasFromDoc(doc) {
    var _a, _b;
    const stored = sortSummitItems((_a = doc.focusedAreas) !== null && _a !== void 0 ? _a : []);
    if (stored.length > 0) {
        return stored.slice(0, summit_constants_1.SUMMIT_CMS_CARD_MAX).map((card, index) => {
            var _a, _b;
            return ({
                id: ensureItemId(card.id),
                sortOrder: (_a = card.sortOrder) !== null && _a !== void 0 ? _a : index,
                heading: readTrimmed(card.heading),
                points: sortSummitItems((_b = card.points) !== null && _b !== void 0 ? _b : [])
                    .slice(0, summit_constants_1.SUMMIT_FOCUS_POINTS_MAX)
                    .map((point, pointIndex) => {
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
    const legacy = sortSummitItems((_b = doc.areaPoints) !== null && _b !== void 0 ? _b : []);
    return legacy.slice(0, summit_constants_1.SUMMIT_CMS_CARD_MAX).map((point, index) => {
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
        return `${heading} — ${description}`;
    }
    return heading || description;
}
function agendaPointRowFromStored(item, index) {
    var _a;
    const legacyText = readTrimmed(item.text);
    const heading = readTrimmed(item.heading);
    const description = readTrimmed(item.description) || legacyText;
    return {
        id: ensureItemId(item.id),
        sortOrder: (_a = item.sortOrder) !== null && _a !== void 0 ? _a : index,
        heading,
        description,
        text: combineCardText(heading, description),
    };
}
function mapAgendaFromDoc(doc) {
    var _a, _b, _c, _d, _e, _f;
    const legacyAgendaTitle = readTrimmed((_c = (_a = doc.agendaTitle) !== null && _a !== void 0 ? _a : (_b = doc.agenda) === null || _b === void 0 ? void 0 : _b.title) !== null && _c !== void 0 ? _c : doc.agendaTitleLegacy);
    const title = legacyAgendaTitle || "GreenPro's Core Agenda";
    const stored = sortSummitItems((_d = doc.agendaPoints) !== null && _d !== void 0 ? _d : []);
    if (stored.length > 0) {
        return {
            title,
            points: stored.map((point, index) => agendaPointRowFromStored(point, index)),
        };
    }
    const parsed = parseAgendaHtmlToTexts((_f = (_e = doc.agenda) === null || _e === void 0 ? void 0 : _e.content) !== null && _f !== void 0 ? _f : '');
    return {
        title,
        points: parsed.map((text, index) => ({
            id: new mongoose_1.Types.ObjectId().toString(),
            sortOrder: index,
            heading: '',
            description: text,
            text,
        })),
    };
}
function normalizeHighlightsSection(body) {
    var _a, _b;
    const errors = {};
    const rawItems = extractNestedArray(body.highlights, ['items', 'points']);
    const items = rawItems
        .map((item, index) => cardRowFromInput(item, index))
        // Drop empty / half-filled draft cards from other tabs so basic-only saves work.
        .filter((item) => isCompleteCardRow(item));
    if (items.length > summit_constants_1.SUMMIT_CMS_CARD_MAX) {
        errors['highlights.max'] = `Maximum ${summit_constants_1.SUMMIT_CMS_CARD_MAX} highlights are allowed.`;
    }
    const sorted = sortSummitItems(items).slice(0, summit_constants_1.SUMMIT_CMS_CARD_MAX);
    for (const item of sorted) {
        validateCmsFieldMax(item.heading, `highlight.${item.id}.heading`, errors);
        validateCmsFieldMax(item.description, `highlight.${item.id}.description`, errors);
    }
    const rawTitle = readTrimmed((_b = (_a = body.highlightsTitle) !== null && _a !== void 0 ? _a : body.highlights_title) !== null && _b !== void 0 ? _b : (isPlainObject(body.highlights) ? body.highlights.title : undefined));
    validateSectionTitle(rawTitle, 'highlights.title', sorted.length > 0, errors);
    if (Object.keys(errors).length > 0) {
        throwSummitFieldErrors(errors);
    }
    return { title: rawTitle, items: sorted };
}
function normalizeEventOutcomesSection(body) {
    var _a, _b;
    const errors = {};
    const rawItems = extractNestedArray(body.eventOutcomes, ['items', 'points']);
    const items = rawItems
        .map((item, index) => cardRowFromInput(item, index))
        .filter((item) => isCompleteCardRow(item));
    if (items.length > summit_constants_1.SUMMIT_CMS_CARD_MAX) {
        errors['event-outcomes.max'] =
            `Maximum ${summit_constants_1.SUMMIT_CMS_CARD_MAX} event outcomes are allowed.`;
    }
    const sorted = sortSummitItems(items).slice(0, summit_constants_1.SUMMIT_CMS_CARD_MAX);
    for (const item of sorted) {
        validateCmsFieldMax(item.heading, `outcome.${item.id}.heading`, errors);
        validateCmsFieldMax(item.description, `outcome.${item.id}.description`, errors);
    }
    const rawTitle = readTrimmed((_b = (_a = body.eventOutcomesTitle) !== null && _a !== void 0 ? _a : body.event_outcomes_title) !== null && _b !== void 0 ? _b : (isPlainObject(body.eventOutcomes)
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
    const errors = {};
    const legacyFlat = extractNestedArray((_b = (_a = body.areaPoints) !== null && _a !== void 0 ? _a : body.focusedAreaPoints) !== null && _b !== void 0 ? _b : body.focused_area_points, []);
    let rawCards = extractNestedArray((_e = (_d = (_c = body.focusedAreas) !== null && _c !== void 0 ? _c : body.focused_areas) !== null && _d !== void 0 ? _d : body.focusedArea) !== null && _e !== void 0 ? _e : body.focused_area, ['items', 'cards', 'points']);
    const areaPointsLookLikeCards = legacyFlat.some((entry) => {
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
    const cards = rawCards
        .map((card, index) => focusCardFromInput(card, index))
        .map((card) => {
        var _a;
        const points = sortSummitItems((_a = card.points) !== null && _a !== void 0 ? _a : []).filter((point) => hasCmsFieldContent(readTrimmed(point.text)));
        return { ...card, points };
    })
        // Drop empty / half-filled draft topic cards from other tabs.
        .filter((card) => { var _a, _b; return hasCmsFieldContent(card.heading) && ((_b = (_a = card.points) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 0; });
    if (cards.length > summit_constants_1.SUMMIT_CMS_CARD_MAX) {
        errors['focused-area.max'] =
            `Maximum ${summit_constants_1.SUMMIT_CMS_CARD_MAX} focused-area cards are allowed.`;
    }
    const sorted = sortSummitItems(cards).slice(0, summit_constants_1.SUMMIT_CMS_CARD_MAX);
    for (const card of sorted) {
        validateCmsFieldMax(card.heading, `focus-card.${card.id}.heading`, errors);
        if (card.points.length > summit_constants_1.SUMMIT_FOCUS_POINTS_MAX) {
            errors[`focus-card.${card.id}.points.max`] =
                `Maximum ${summit_constants_1.SUMMIT_FOCUS_POINTS_MAX} points are allowed per topic card.`;
        }
        card.points = card.points.slice(0, summit_constants_1.SUMMIT_FOCUS_POINTS_MAX);
        for (const point of card.points) {
            validateCmsFieldMax(point.text, `focus-point.${point.id}.text`, errors);
        }
    }
    const rawTitle = readTrimmed((_h = (_g = (_f = body.focusedAreaTitle) !== null && _f !== void 0 ? _f : body.focused_area_title) !== null && _g !== void 0 ? _g : (isPlainObject(body.focusedArea) ? body.focusedArea.title : undefined)) !== null && _h !== void 0 ? _h : (isPlainObject(body.focused_area) ? body.focused_area.title : undefined));
    validateSectionTitle(rawTitle, 'focused-area.title', sorted.length > 0, errors);
    if (Object.keys(errors).length > 0) {
        throwSummitFieldErrors(errors);
    }
    return { title: rawTitle, cards: sorted };
}
function normalizeAgendaSectionInput(body) {
    var _a, _b, _c, _d, _e, _f;
    const errors = {};
    const rawPoints = extractNestedArray((_c = (_b = (_a = body.agendaPoints) !== null && _a !== void 0 ? _a : (Array.isArray(body.agenda) ? body.agenda : undefined)) !== null && _b !== void 0 ? _b : (isPlainObject(body.agenda) ? body.agenda.points : undefined)) !== null && _c !== void 0 ? _c : (isPlainObject(body.agenda) ? body.agenda.items : undefined), ['items', 'points']);
    let pointsSource = rawPoints;
    let fromLegacyHtml = false;
    if (!pointsSource.length &&
        isPlainObject(body.agenda) &&
        String((_d = body.agenda.content) !== null && _d !== void 0 ? _d : '').trim()) {
        pointsSource = parseAgendaHtmlToTexts(String(body.agenda.content)).map((text) => ({ text }));
        fromLegacyHtml = true;
    }
    const legacyTextOnlyIds = new Set();
    const points = pointsSource
        .map((point, index) => {
        var _a, _b, _c;
        const row = cardRowFromInput(point, index);
        const source = (point !== null && point !== void 0 ? point : {});
        const isLegacyTextOnly = !readTrimmed((_b = (_a = source.heading) !== null && _a !== void 0 ? _a : source.title) !== null && _b !== void 0 ? _b : source.label) &&
            readTrimmed((_c = source.text) !== null && _c !== void 0 ? _c : source.point).length > 0 &&
            source.description === undefined;
        if (fromLegacyHtml || isLegacyTextOnly) {
            legacyTextOnlyIds.add(row.id);
        }
        return {
            ...row,
            text: combineCardText(row.heading, row.description),
        };
    })
        // Drop empty / incomplete draft agenda rows from other tabs.
        .filter((point) => {
        if (legacyTextOnlyIds.has(point.id)) {
            return hasCmsFieldContent(point.description);
        }
        return isCompleteCardRow(point);
    });
    const sorted = sortSummitItems(points);
    for (const point of sorted) {
        if (!legacyTextOnlyIds.has(point.id)) {
            validateCmsFieldMax(point.heading, `agenda-point.${point.id}.heading`, errors);
        }
        validateCmsFieldMax(point.description, `agenda-point.${point.id}.description`, errors);
    }
    const rawTitle = readTrimmed((_f = (_e = body.agendaTitle) !== null && _e !== void 0 ? _e : body.agenda_title) !== null && _f !== void 0 ? _f : (isPlainObject(body.agenda) ? body.agenda.title : undefined));
    validateSectionTitle(rawTitle, 'agenda.title', sorted.length > 0, errors);
    if (Object.keys(errors).length > 0) {
        throwSummitFieldErrors(errors);
    }
    return { title: rawTitle, points: sorted };
}
