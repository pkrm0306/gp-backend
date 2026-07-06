import { ConfigService } from '@nestjs/config';

export type NotificationCcGroup = 'TEAM_LEADS' | 'SHEshi';

const GROUP_ENV_KEYS: Record<NotificationCcGroup, string> = {
  TEAM_LEADS: 'NOTIFICATION_CC_TEAM_LEADS',
  SHEshi: 'NOTIFICATION_CC_SHEshi',
};

/** Parse comma/semicolon-separated email lists; dedupe case-insensitively. */
export function parseEmailList(raw: string | undefined | null): string[] {
  if (!raw?.trim()) {
    return [];
  }
  const seen = new Set<string>();
  const result: string[] = [];
  for (const part of raw.split(/[,;]/)) {
    const email = part.trim();
    if (!email) {
      continue;
    }
    const key = email.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(email);
  }
  return result;
}

/** Resolve configured CC groups; optionally exclude the primary To address. */
export function resolveCcGroups(
  configService: ConfigService,
  groups: NotificationCcGroup[] | undefined,
  excludeTo?: string,
): string[] {
  if (!groups?.length) {
    return [];
  }

  const seen = new Set<string>();
  const merged: string[] = [];
  for (const group of groups) {
    const envKey = GROUP_ENV_KEYS[group];
    for (const email of parseEmailList(configService.get<string>(envKey))) {
      const key = email.toLowerCase();
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      merged.push(email);
    }
  }

  const exclude = excludeTo?.trim().toLowerCase();
  if (!exclude) {
    return merged;
  }
  return merged.filter((email) => email.toLowerCase() !== exclude);
}
