import { ConfigService } from '@nestjs/config';

export type NotificationCcGroup = 'TEAM_LEADS' | 'SHEshi' | 'ADMIN';

const GROUP_ENV_KEYS: Record<NotificationCcGroup, string> = {
  TEAM_LEADS: 'NOTIFICATION_CC_TEAM_LEADS',
  SHEshi: 'NOTIFICATION_CC_SHEshi',
  ADMIN: 'NOTIFICATION_CC_ADMIN',
};

/** Default ops CC when env is unset — keep in sync with local ADMIN_MAIL_CC. */
export const DEFAULT_ADMIN_MAIL_CC = 'rmeghana184@gmail.com';

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

/**
 * Always-on admin CC for outbound mail / admin alert emails.
 * Reads ADMIN_MAIL_CC, NOTIFICATION_CC_ADMIN, then defaults to DEFAULT_ADMIN_MAIL_CC.
 */
export function resolveAlwaysAdminCc(
  configService?: ConfigService | null,
): string[] {
  const fromConfig = configService
    ? parseEmailList(
        configService.get<string>('ADMIN_MAIL_CC') ||
          configService.get<string>('NOTIFICATION_CC_ADMIN'),
      )
    : [];
  if (fromConfig.length > 0) {
    return fromConfig;
  }
  return parseEmailList(DEFAULT_ADMIN_MAIL_CC);
}

/** Primary To address for admin alert emails (in-app companion mail). */
export function resolveAdminAlertTo(
  configService: ConfigService,
): string | undefined {
  const configured =
    configService.get<string>('SMTP_ADMIN_ALERT_EMAIL')?.trim() ||
    configService.get<string>('ADMIN_ALERT_EMAIL')?.trim();
  if (configured) {
    return configured;
  }
  const always = resolveAlwaysAdminCc(configService);
  return always[0];
}

export function mergeEmailLists(
  lists: string[][],
  excludeTo?: string,
): string[] {
  const seen = new Set<string>();
  const merged: string[] = [];
  const exclude = excludeTo?.trim().toLowerCase();
  for (const list of lists) {
    for (const email of list) {
      const key = email.toLowerCase();
      if (exclude && key === exclude) {
        continue;
      }
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      merged.push(email);
    }
  }
  return merged;
}

/**
 * Resolve configured CC groups and always include the admin ops CC list.
 * Optionally exclude the primary To address.
 */
export function resolveCcGroups(
  configService: ConfigService,
  groups: NotificationCcGroup[] | undefined,
  excludeTo?: string,
): string[] {
  const fromGroups: string[] = [];
  if (groups?.length) {
    for (const group of groups) {
      const envKey = GROUP_ENV_KEYS[group];
      fromGroups.push(...parseEmailList(configService.get<string>(envKey)));
    }
  }

  return mergeEmailLists(
    [fromGroups, resolveAlwaysAdminCc(configService)],
    excludeTo,
  );
}

/** Merge explicit CC with always-admin CC for EmailService.sendEmail. */
export function mergeOutgoingCc(
  configService: ConfigService | null | undefined,
  to: string,
  explicitCc?: string | string[] | null,
): string[] | undefined {
  const explicit = Array.isArray(explicitCc)
    ? explicitCc
    : parseEmailList(explicitCc ?? '');
  const always = resolveAlwaysAdminCc(configService);
  const merged = mergeEmailLists([explicit, always], to);
  return merged.length > 0 ? merged : undefined;
}

/**
 * Watcher inboxes that should receive a separate To-copy of outbound mail.
 * Gmail SMTP does not show BCC/Sent for the sending account, so BCC-to-self
 * never appears — we send a second message with To: these addresses instead.
 */
export function resolveOpsCopyRecipients(
  configService: ConfigService | null | undefined,
  to: string,
): string[] {
  const fromConfig = configService
    ? [
        ...parseEmailList(configService.get<string>('ADMIN_MAIL_CC')),
        ...parseEmailList(configService.get<string>('NOTIFICATION_CC_ADMIN')),
        ...parseEmailList(configService.get<string>('SMTP_BCC')),
        ...parseEmailList(configService.get<string>('MAIL_BCC')),
        ...parseEmailList(configService.get<string>('SMTP_SERVER_USER')),
        ...parseEmailList(configService.get<string>('MAIL_USERNAME')),
        ...parseEmailList(DEFAULT_ADMIN_MAIL_CC),
      ]
    : parseEmailList(DEFAULT_ADMIN_MAIL_CC);

  return mergeEmailLists([fromConfig], to);
}

/**
 * Always BCC the SMTP mailbox (and optional SMTP_BCC / MAIL_BCC) so outbound
 * vendor mails appear in the sending Gmail inbox. Prefer resolveOpsCopyRecipients
 * + separate To copies — Gmail SMTP does not surface BCC-to-self.
 */
export function mergeOutgoingBcc(
  configService: ConfigService | null | undefined,
  to: string,
  explicitBcc?: string | string[] | null,
): string[] | undefined {
  const explicit = Array.isArray(explicitBcc)
    ? explicitBcc
    : parseEmailList(explicitBcc ?? '');

  const fromConfig = configService
    ? parseEmailList(
        configService.get<string>('SMTP_BCC') ||
          configService.get<string>('MAIL_BCC') ||
          configService.get<string>('SMTP_SERVER_USER') ||
          configService.get<string>('MAIL_USERNAME'),
      )
    : [];

  const merged = mergeEmailLists([explicit, fromConfig], to);
  return merged.length > 0 ? merged : undefined;
}
