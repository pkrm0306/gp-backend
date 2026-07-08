import { BadRequestException } from '@nestjs/common';
import {
  resolveTeamMemberSectorIdFromInput,
  TEAM_MEMBER_SECTOR_OPTIONS,
} from '../team-member-sectors.constants';

/**
 * Parses team-member sector multiselect from multipart/JSON.
 * Accepts fixed ids (1–4) or names: Building Products, Industrial Products, Consumer Products, Facility Services.
 */
export function mergeTeamMemberSectorIdsFromFormObject(obj: unknown): number[] {
  if (!obj || typeof obj !== 'object') {
    return [];
  }
  const o = obj as Record<string, unknown>;
  const out: number[] = [];
  const seen = new Set<number>();
  const invalid: string[] = [];

  const pushResolved = (raw: unknown): void => {
    if (raw === undefined || raw === null || raw === '') {
      return;
    }

    if (Array.isArray(raw)) {
      for (const item of raw) {
        pushResolved(item);
      }
      return;
    }

    const trimmed = String(raw).trim();
    if (!trimmed) {
      return;
    }

    // Frontend often sends the same multiselect as JSON on `sectors` and again on `sector` / `sector_names`.
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed) as unknown;
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            pushResolved(item);
          }
          return;
        }
      } catch {
        invalid.push(trimmed);
        return;
      }
    }

    const unquoted =
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))
        ? trimmed.slice(1, -1).trim()
        : trimmed;

    const id = resolveTeamMemberSectorIdFromInput(unquoted);
    if (id === null) {
      invalid.push(unquoted);
      return;
    }
    if (!seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  };

  const consumeArrayLike = (raw: unknown): void => {
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
