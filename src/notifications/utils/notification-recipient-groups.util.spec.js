"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var notification_recipient_groups_util_1 = require("./notification-recipient-groups.util");
describe('notification-recipient-groups.util', function () {
    describe('parseEmailList', function () {
        it('parses comma-separated emails and dedupes', function () {
            expect((0, notification_recipient_groups_util_1.parseEmailList)('a@cii.in, b@cii.in;a@cii.in ,  ')).toEqual([
                'a@cii.in',
                'b@cii.in',
            ]);
        });
        it('returns empty for blank input', function () {
            expect((0, notification_recipient_groups_util_1.parseEmailList)('')).toEqual([]);
            expect((0, notification_recipient_groups_util_1.parseEmailList)(undefined)).toEqual([]);
        });
    });
    describe('resolveAlwaysAdminCc', function () {
        it('defaults to DEFAULT_ADMIN_MAIL_CC when env unset', function () {
            var config = {
                get: jest.fn(function () { return undefined; }),
            };
            expect((0, notification_recipient_groups_util_1.resolveAlwaysAdminCc)(config)).toEqual([notification_recipient_groups_util_1.DEFAULT_ADMIN_MAIL_CC]);
        });
        it('prefers ADMIN_MAIL_CC when set', function () {
            var config = {
                get: jest.fn(function (key) {
                    return key === 'ADMIN_MAIL_CC' ? 'ops@example.com' : undefined;
                }),
            };
            expect((0, notification_recipient_groups_util_1.resolveAlwaysAdminCc)(config)).toEqual(['ops@example.com']);
        });
    });
    describe('resolveAdminAlertTo', function () {
        it('falls back to always-admin CC when alert To unset', function () {
            var config = {
                get: jest.fn(function () { return undefined; }),
            };
            expect((0, notification_recipient_groups_util_1.resolveAdminAlertTo)(config)).toBe(notification_recipient_groups_util_1.DEFAULT_ADMIN_MAIL_CC);
        });
    });
    describe('resolveCcGroups', function () {
        var config = {
            get: jest.fn(function (key) {
                var map = {
                    NOTIFICATION_CC_TEAM_LEADS: 'tl1@cii.in,tl2@cii.in,tl1@cii.in',
                    NOTIFICATION_CC_SHEshi: 'sheshi@cii.in',
                    ADMIN_MAIL_CC: 'rmeghana184@gmail.com',
                };
                return map[key];
            }),
        };
        it('merges groups and always includes admin CC', function () {
            expect((0, notification_recipient_groups_util_1.resolveCcGroups)(config, ['TEAM_LEADS', 'SHEshi'])).toEqual([
                'tl1@cii.in',
                'tl2@cii.in',
                'sheshi@cii.in',
                'rmeghana184@gmail.com',
            ]);
        });
        it('excludes primary To from CC list', function () {
            expect((0, notification_recipient_groups_util_1.resolveCcGroups)(config, ['TEAM_LEADS'], 'TL1@cii.in')).toEqual([
                'tl2@cii.in',
                'rmeghana184@gmail.com',
            ]);
        });
        it('still returns admin CC when no groups requested', function () {
            expect((0, notification_recipient_groups_util_1.resolveCcGroups)(config, [])).toEqual(['rmeghana184@gmail.com']);
            expect((0, notification_recipient_groups_util_1.resolveCcGroups)(config, undefined)).toEqual([
                'rmeghana184@gmail.com',
            ]);
        });
    });
    describe('mergeOutgoingCc', function () {
        it('adds always-admin CC and skips To address', function () {
            var config = {
                get: jest.fn(function (key) {
                    return key === 'ADMIN_MAIL_CC' ? 'rmeghana184@gmail.com' : undefined;
                }),
            };
            expect((0, notification_recipient_groups_util_1.mergeOutgoingCc)(config, 'vendor@example.com', 'lead@cii.in')).toEqual(['lead@cii.in', 'rmeghana184@gmail.com']);
            expect((0, notification_recipient_groups_util_1.mergeOutgoingCc)(config, 'rmeghana184@gmail.com', undefined)).toBeUndefined();
        });
    });
    describe('mergeOutgoingBcc', function () {
        it('BCC SMTP mailbox and skips To address', function () {
            var config = {
                get: jest.fn(function (key) {
                    return key === 'SMTP_SERVER_USER'
                        ? 'adeshyearantycodes@gmail.com'
                        : undefined;
                }),
            };
            expect((0, notification_recipient_groups_util_1.mergeOutgoingBcc)(config, 'niharikachn2003@gmail.com', undefined)).toEqual(['adeshyearantycodes@gmail.com']);
            expect((0, notification_recipient_groups_util_1.mergeOutgoingBcc)(config, 'adeshyearantycodes@gmail.com', undefined)).toBeUndefined();
        });
    });
    describe('resolveOpsCopyRecipients', function () {
        it('includes SMTP user and admin CC, skips To', function () {
            var config = {
                get: jest.fn(function (key) {
                    var map = {
                        ADMIN_MAIL_CC: 'rmeghana184@gmail.com',
                        SMTP_SERVER_USER: 'adeshyearantycodes@gmail.com',
                    };
                    return map[key];
                }),
            };
            expect((0, notification_recipient_groups_util_1.resolveOpsCopyRecipients)(config, 'niharikachn2003@gmail.com')).toEqual([
                'rmeghana184@gmail.com',
                'adeshyearantycodes@gmail.com',
            ]);
        });
    });
});
