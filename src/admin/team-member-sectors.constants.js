"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEAM_MEMBER_SECTOR_OPTIONS = void 0;
exports.normalizeTeamMemberSectorNameKey = normalizeTeamMemberSectorNameKey;
exports.isTeamMemberSectorId = isTeamMemberSectorId;
exports.getTeamMemberSectorNameById = getTeamMemberSectorNameById;
exports.resolveTeamMemberSectorIdFromInput = resolveTeamMemberSectorIdFromInput;
/** Fixed CMS team-member business verticals (not loaded from GET /api/sectors). */
exports.TEAM_MEMBER_SECTOR_OPTIONS = [
    { id: 1, name: 'Building Products' },
    { id: 2, name: 'Industrial Products' },
    { id: 3, name: 'Consumer Products' },
    { id: 4, name: 'Facility Services' },
];
var TEAM_MEMBER_SECTOR_NAME_BY_ID = new Map(exports.TEAM_MEMBER_SECTOR_OPTIONS.map(function (s) { return [s.id, s.name]; }));
var TEAM_MEMBER_SECTOR_ID_BY_NORMALIZED_NAME = new Map(exports.TEAM_MEMBER_SECTOR_OPTIONS.map(function (s) { return [normalizeTeamMemberSectorNameKey(s.name), s.id]; }));
/** Legacy labels from before the business-vertical rename. */
var TEAM_MEMBER_SECTOR_LEGACY_ID_BY_NORMALIZED_NAME = new Map([
    [normalizeTeamMemberSectorNameKey('Building'), 1],
    [normalizeTeamMemberSectorNameKey('Industries'), 2],
]);
function normalizeTeamMemberSectorNameKey(name) {
    return String(name !== null && name !== void 0 ? name : '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ');
}
function isTeamMemberSectorId(id) {
    return TEAM_MEMBER_SECTOR_NAME_BY_ID.has(id);
}
function getTeamMemberSectorNameById(id) {
    var _a;
    return (_a = TEAM_MEMBER_SECTOR_NAME_BY_ID.get(id)) !== null && _a !== void 0 ? _a : '';
}
function resolveTeamMemberSectorIdFromInput(raw) {
    var _a, _b;
    if (raw === '' || raw === null || raw === undefined) {
        return null;
    }
    if (typeof raw === 'number' && Number.isInteger(raw)) {
        return isTeamMemberSectorId(raw) ? raw : null;
    }
    var s = String(raw).trim();
    if (!s)
        return null;
    var asNum = parseInt(s, 10);
    if (String(asNum) === s && isTeamMemberSectorId(asNum)) {
        return asNum;
    }
    var normalized = normalizeTeamMemberSectorNameKey(s);
    return ((_b = (_a = TEAM_MEMBER_SECTOR_ID_BY_NORMALIZED_NAME.get(normalized)) !== null && _a !== void 0 ? _a : TEAM_MEMBER_SECTOR_LEGACY_ID_BY_NORMALIZED_NAME.get(normalized)) !== null && _b !== void 0 ? _b : null);
}
