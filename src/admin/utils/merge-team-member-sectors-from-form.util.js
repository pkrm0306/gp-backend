"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeTeamMemberSectorIdsFromFormObject = mergeTeamMemberSectorIdsFromFormObject;
exports.hasExplicitTeamMemberSectorFields = hasExplicitTeamMemberSectorFields;
var common_1 = require("@nestjs/common");
var team_member_sectors_constants_1 = require("../team-member-sectors.constants");
/**
 * Parses team-member sector multiselect from multipart/JSON.
 * Accepts fixed ids (1–4) or names: Building Products, Industrial Products, Consumer Products, Facility Services.
 */
function mergeTeamMemberSectorIdsFromFormObject(obj) {
    if (!obj || typeof obj !== 'object') {
        return [];
    }
    var o = obj;
    var out = [];
    var seen = new Set();
    var invalid = [];
    var pushResolved = function (raw) {
        if (raw === undefined || raw === null || raw === '') {
            return;
        }
        if (Array.isArray(raw)) {
            for (var _i = 0, raw_1 = raw; _i < raw_1.length; _i++) {
                var item = raw_1[_i];
                pushResolved(item);
            }
            return;
        }
        var trimmed = String(raw).trim();
        if (!trimmed) {
            return;
        }
        // Frontend often sends the same multiselect as JSON on `sectors` and again on `sector` / `sector_names`.
        if (trimmed.startsWith('[')) {
            try {
                var parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) {
                    for (var _a = 0, parsed_1 = parsed; _a < parsed_1.length; _a++) {
                        var item = parsed_1[_a];
                        pushResolved(item);
                    }
                    return;
                }
            }
            catch (_b) {
                invalid.push(trimmed);
                return;
            }
        }
        var unquoted = (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
            (trimmed.startsWith("'") && trimmed.endsWith("'"))
            ? trimmed.slice(1, -1).trim()
            : trimmed;
        var id = (0, team_member_sectors_constants_1.resolveTeamMemberSectorIdFromInput)(unquoted);
        if (id === null) {
            invalid.push(unquoted);
            return;
        }
        if (!seen.has(id)) {
            seen.add(id);
            out.push(id);
        }
    };
    var consumeArrayLike = function (raw) {
        if (raw === undefined || raw === null) {
            return;
        }
        pushResolved(raw);
    };
    consumeArrayLike(o.sectors);
    consumeArrayLike(o['sectors[]']);
    consumeArrayLike(o.sector_names);
    consumeArrayLike(o['sector_names[]']);
    consumeArrayLike(o.business_verticals);
    consumeArrayLike(o['business_verticals[]']);
    consumeArrayLike(o.business_vertical_names);
    consumeArrayLike(o['business_vertical_names[]']);
    consumeArrayLike(o.sectorNames);
    consumeArrayLike(o['sectorNames[]']);
    consumeArrayLike(o.sector_ids);
    consumeArrayLike(o['sector_ids[]']);
    consumeArrayLike(o.sectorIds);
    consumeArrayLike(o['sectorIds[]']);
    if (o.sector !== undefined && o.sector !== null && o.sector !== '') {
        pushResolved(o.sector);
    }
    if (o.sector_id !== undefined && o.sector_id !== null && o.sector_id !== '') {
        pushResolved(o.sector_id);
    }
    if (o.sector_name !== undefined && o.sector_name !== null && o.sector_name !== '') {
        pushResolved(o.sector_name);
    }
    if (invalid.length > 0) {
        var allowed = team_member_sectors_constants_1.TEAM_MEMBER_SECTOR_OPTIONS.map(function (s) { return s.name; }).join(', ');
        throw new common_1.BadRequestException("Invalid sector(s): ".concat(invalid.join(', '), ". Allowed values: ").concat(allowed));
    }
    return out.sort(function (a, b) { return a - b; });
}
var TEAM_MEMBER_SECTOR_BODY_KEYS = [
    'sector',
    'sector_id',
    'sector_name',
    'sectors',
    'sectors[]',
    'sector_names',
    'sector_names[]',
    'business_verticals',
    'business_verticals[]',
    'business_vertical_names',
    'business_vertical_names[]',
    'sectorNames',
    'sectorNames[]',
    'sector_ids',
    'sector_ids[]',
    'sectorIds',
    'sectorIds[]',
];
function hasExplicitTeamMemberSectorFields(body) {
    if (!body || typeof body !== 'object') {
        return false;
    }
    return TEAM_MEMBER_SECTOR_BODY_KEYS.some(function (k) {
        return Object.prototype.hasOwnProperty.call(body, k);
    });
}
