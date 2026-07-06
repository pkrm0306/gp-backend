import { ConfigService } from '@nestjs/config';
import {
  parseEmailList,
  resolveCcGroups,
} from './notification-recipient-groups.util';

describe('notification-recipient-groups.util', () => {
  describe('parseEmailList', () => {
    it('parses comma-separated emails and dedupes', () => {
      expect(
        parseEmailList('a@cii.in, b@cii.in;a@cii.in ,  '),
      ).toEqual(['a@cii.in', 'b@cii.in']);
    });

    it('returns empty for blank input', () => {
      expect(parseEmailList('')).toEqual([]);
      expect(parseEmailList(undefined)).toEqual([]);
    });
  });

  describe('resolveCcGroups', () => {
    const config = {
      get: jest.fn((key: string) => {
        const map: Record<string, string> = {
          NOTIFICATION_CC_TEAM_LEADS:
            'tl1@cii.in,tl2@cii.in,tl1@cii.in',
          NOTIFICATION_CC_SHEshi: 'sheshi@cii.in',
        };
        return map[key];
      }),
    } as unknown as ConfigService;

    it('merges multiple groups without duplicates', () => {
      expect(
        resolveCcGroups(config, ['TEAM_LEADS', 'SHEshi']),
      ).toEqual(['tl1@cii.in', 'tl2@cii.in', 'sheshi@cii.in']);
    });

    it('excludes primary To from CC list', () => {
      expect(
        resolveCcGroups(config, ['TEAM_LEADS'], 'TL1@cii.in'),
      ).toEqual(['tl2@cii.in']);
    });

    it('returns empty when no groups requested', () => {
      expect(resolveCcGroups(config, [])).toEqual([]);
      expect(resolveCcGroups(config, undefined)).toEqual([]);
    });
  });
});
