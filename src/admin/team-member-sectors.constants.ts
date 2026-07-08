/** Fixed CMS team-member business verticals (not loaded from GET /api/sectors). */
export const TEAM_MEMBER_SECTOR_OPTIONS = [
  { id: 1, name: 'Building Products' },
  { id: 2, name: 'Industrial Products' },
  { id: 3, name: 'Consumer Products' },
  { id: 4, name: 'Facility Services' },
] as const;

export type TeamMemberSectorId = (typeof TEAM_MEMBER_SECTOR_OPTIONS)[number]['id'];

const TEAM_MEMBER_SECTOR_NAME_BY_ID = new Map<number, string>(
  TEAM_MEMBER_SECTOR_OPTIONS.map((s) => [s.id, s.name]),
);

const TEAM_MEMBER_SECTOR_ID_BY_NORMALIZED_NAME = new Map<string, number>(
  TEAM_MEMBER_SECTOR_OPTIONS.map((s) => [normalizeTeamMemberSectorNameKey(s.name), s.id]),
);

/** Legacy labels from before the business-vertical rename. */
const TEAM_MEMBER_SECTOR_LEGACY_ID_BY_NORMALIZED_NAME = new Map<string, number>([
  [normalizeTeamMemberSectorNameKey('Building'), 1],
  [normalizeTeamMemberSectorNameKey('Industries'), 2],
]);

export function normalizeTeamMemberSectorNameKey(name: string): string {
  return String(name ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function isTeamMemberSectorId(id: number): id is TeamMemberSectorId {
  return TEAM_MEMBER_SECTOR_NAME_BY_ID.has(id);
}

export function getTeamMemberSectorNameById(id: number): string {
  return TEAM_MEMBER_SECTOR_NAME_BY_ID.get(id) ?? '';
}

export function resolveTeamMemberSectorIdFromInput(raw: unknown): number | null {
  if (raw === '' || raw === null || raw === undefined) {
    return null;
  }
  if (typeof raw === 'number' && Number.isInteger(raw)) {
    return isTeamMemberSectorId(raw) ? raw : null;
  }
  const s = String(raw).trim();
  if (!s) return null;
  const asNum = parseInt(s, 10);
  if (String(asNum) === s && isTeamMemberSectorId(asNum)) {
    return asNum;
  }
  const normalized = normalizeTeamMemberSectorNameKey(s);
  return (
    TEAM_MEMBER_SECTOR_ID_BY_NORMALIZED_NAME.get(normalized) ??
    TEAM_MEMBER_SECTOR_LEGACY_ID_BY_NORMALIZED_NAME.get(normalized) ??
    null
  );
}
