import { BadRequestException } from '@nestjs/common';
import {
  resolveTeamMemberSectorIdFromInput,
  TEAM_MEMBER_SECTOR_OPTIONS,
} from '../team-member-sectors.constants';

/**
 * Parses team-member sector multiselect from multipart/JSON.
 * Accepts fixed ids (1–4) or names: Building, Industries, Consumer Products, Facility Services.
 */
export function mergeTeamMemberSectorIdsFromFormObject(obj: unknown): number[] {
  if (!obj || typeof obj !== 'object') {
    return [];
  }
  const o = obj as Record<string, unknown>;
  const out: number[] = [];
  const seen = new Set<number>();
  const invalid: string[] = [];

  const pushResolved = (raw: unknown) => {
    const id = resolveTeamMemberSectorIdFromInput(raw);
    if (id === null) {
      if (raw !== '' && raw !== null && raw !== undefined) {
        invalid.push(String(raw).trim());
      }
      return;
    }
    if (!seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  };

  const consumeArrayLike = (raw: unknown): void => {
    if (raw === undefined || raw === null) return;
    if (Array.isArray(raw)) {
      for (const x of raw) pushResolved(x);
      return;
    }
    const s = String(raw).trim();
    if (!s) return;
    if (s.startsWith('[')) {
      try {
        const arr = JSON.parse(s) as unknown;
        if (Array.isArray(arr)) {
          for (const x of arr) pushResolved(x);
        }
      } catch {
        invalid.push(s);
      }
      return;
    }
    for (const part of s
      .split(/[\s,;]+/)
      .map((p) => p.trim())
      .filter(Boolean)) {
      pushResolved(part);
    }
  };

  consumeArrayLike(o.sectors);
  consumeArrayLike(o['sectors[]']);
  consumeArrayLike(o.sector_names);
  consumeArrayLike(o['sector_names[]']);
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
    const allowed = TEAM_MEMBER_SECTOR_OPTIONS.map((s) => s.name).join(', ');
    throw new BadRequestException(
      `Invalid sector(s): ${invalid.join(', ')}. Allowed values: ${allowed}`,
    );
  }

  return out.sort((a, b) => a - b);
}

const TEAM_MEMBER_SECTOR_BODY_KEYS = [
  'sector',
  'sector_id',
  'sector_name',
  'sectors',
  'sectors[]',
  'sector_names',
  'sector_names[]',
  'sectorNames',
  'sectorNames[]',
  'sector_ids',
  'sector_ids[]',
  'sectorIds',
  'sectorIds[]',
] as const;

export function hasExplicitTeamMemberSectorFields(
  body?: Record<string, unknown>,
): boolean {
  if (!body || typeof body !== 'object') {
    return false;
  }
  return TEAM_MEMBER_SECTOR_BODY_KEYS.some((k) =>
    Object.prototype.hasOwnProperty.call(body, k),
  );
}
