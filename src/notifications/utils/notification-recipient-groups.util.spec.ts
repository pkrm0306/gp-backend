import { ConfigService } from '@nestjs/config';
import {
  DEFAULT_ADMIN_MAIL_CC,
  parseEmailList,
  resolveAlwaysAdminCc,
  resolveAdminAlertTo,
  resolveCcGroups,
  mergeOutgoingCc,
  mergeOutgoingBcc,
  resolveOpsCopyRecipients,
} from './notification-recipient-groups.util';

describe('notification-recipient-groups.util', () => {
  describe('parseEmailList', () => {
    it('parses comma-separated emails and dedupes', () => {
      expect(parseEmailList('a@cii.in, b@cii.in;a@cii.in ,  ')).toEqual([
        'a@cii.in',
        'b@cii.in',
      ]);
    });

    it('returns empty for blank input', () => {
      expect(parseEmailList('')).toEqual([]);
      expect(parseEmailList(undefined)).toEqual([]);
    });
  });

  describe('resolveAlwaysAdminCc', () => {
    it('defaults to DEFAULT_ADMIN_MAIL_CC when env unset', () => {
      const config = {
        get: jest.fn(() => undefined),
      } as unknown as ConfigService;
      expect(resolveAlwaysAdminCc(config)).toEqual([DEFAULT_ADMIN_MAIL_CC]);
    });

    it('prefers ADMIN_MAIL_CC when set', () => {
      const config = {
        get: jest.fn((key: string) =>
          key === 'ADMIN_MAIL_CC' ? 'ops@example.com' : undefined,
        ),
      } as unknown as ConfigService;
      expect(resolveAlwaysAdminCc(config)).toEqual(['ops@example.com']);
    });
  });

  describe('resolveAdminAlertTo', () => {
    it('falls back to always-admin CC when alert To unset', () => {
      const config = {
        get: jest.fn(() => undefined),
      } as unknown as ConfigService;
      expect(resolveAdminAlertTo(config)).toBe(DEFAULT_ADMIN_MAIL_CC);
    });
  });

  describe('resolveCcGroups', () => {
    const config = {
      get: jest.fn((key: string) => {
        const map: Record<string, string> = {
          NOTIFICATION_CC_TEAM_LEADS: 'tl1@cii.in,tl2@cii.in,tl1@cii.in',
          NOTIFICATION_CC_SHEshi: 'sheshi@cii.in',
          ADMIN_MAIL_CC: 'rmeghana184@gmail.com',
        };
        return map[key];
      }),
    } as unknown as ConfigService;

    it('merges groups and always includes admin CC', () => {
      expect(resolveCcGroups(config, ['TEAM_LEADS', 'SHEshi'])).toEqual([
        'tl1@cii.in',
        'tl2@cii.in',
        'sheshi@cii.in',
        'rmeghana184@gmail.com',
      ]);
    });

    it('excludes primary To from CC list', () => {
      expect(resolveCcGroups(config, ['TEAM_LEADS'], 'TL1@cii.in')).toEqual([
        'tl2@cii.in',
        'rmeghana184@gmail.com',
      ]);
    });

    it('still returns admin CC when no groups requested', () => {
      expect(resolveCcGroups(config, [])).toEqual(['rmeghana184@gmail.com']);
      expect(resolveCcGroups(config, undefined)).toEqual([
        'rmeghana184@gmail.com',
      ]);
    });
  });

  describe('mergeOutgoingCc', () => {
    it('adds always-admin CC and skips To address', () => {
      const config = {
        get: jest.fn((key: string) =>
          key === 'ADMIN_MAIL_CC' ? 'rmeghana184@gmail.com' : undefined,
        ),
      } as unknown as ConfigService;
      expect(
        mergeOutgoingCc(config, 'vendor@example.com', 'lead@cii.in'),
      ).toEqual(['lead@cii.in', 'rmeghana184@gmail.com']);
      expect(
        mergeOutgoingCc(config, 'rmeghana184@gmail.com', undefined),
      ).toBeUndefined();
    });
  });

  describe('mergeOutgoingBcc', () => {
    it('BCC SMTP mailbox and skips To address', () => {
      const config = {
        get: jest.fn((key: string) =>
          key === 'SMTP_SERVER_USER'
            ? 'adeshyearantycodes@gmail.com'
            : undefined,
        ),
      } as unknown as ConfigService;
      expect(
        mergeOutgoingBcc(config, 'niharikachn2003@gmail.com', undefined),
      ).toEqual(['adeshyearantycodes@gmail.com']);
      expect(
        mergeOutgoingBcc(config, 'adeshyearantycodes@gmail.com', undefined),
      ).toBeUndefined();
    });
  });

  describe('resolveOpsCopyRecipients', () => {
    it('includes SMTP user and admin CC, skips To', () => {
      const config = {
        get: jest.fn((key: string) => {
          const map: Record<string, string> = {
            ADMIN_MAIL_CC: 'rmeghana184@gmail.com',
            SMTP_SERVER_USER: 'adeshyearantycodes@gmail.com',
          };
          return map[key];
        }),
      } as unknown as ConfigService;
      expect(
        resolveOpsCopyRecipients(config, 'niharikachn2003@gmail.com'),
      ).toEqual([
        'rmeghana184@gmail.com',
        'adeshyearantycodes@gmail.com',
      ]);
    });
  });
});
