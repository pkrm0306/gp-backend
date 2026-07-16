"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ADMIN_MAIL_CC = void 0;
exports.parseEmailList = parseEmailList;
exports.resolveAlwaysAdminCc = resolveAlwaysAdminCc;
exports.resolveAdminAlertTo = resolveAdminAlertTo;
exports.mergeEmailLists = mergeEmailLists;
exports.resolveCcGroups = resolveCcGroups;
exports.mergeOutgoingCc = mergeOutgoingCc;
exports.resolveOpsCopyRecipients = resolveOpsCopyRecipients;
exports.mergeOutgoingBcc = mergeOutgoingBcc;
var GROUP_ENV_KEYS = {
    TEAM_LEADS: 'NOTIFICATION_CC_TEAM_LEADS',
    SHEshi: 'NOTIFICATION_CC_SHEshi',
    ADMIN: 'NOTIFICATION_CC_ADMIN',
};
/** Default ops CC when env is unset — keep in sync with local ADMIN_MAIL_CC. */
exports.DEFAULT_ADMIN_MAIL_CC = 'rmeghana184@gmail.com';
/** Parse comma/semicolon-separated email lists; dedupe case-insensitively. */
function parseEmailList(raw) {
    if (!(raw === null || raw === void 0 ? void 0 : raw.trim())) {
        return [];
    }
    var seen = new Set();
    var result = [];
    for (var _i = 0, _a = raw.split(/[,;]/); _i < _a.length; _i++) {
        var part = _a[_i];
        var email = part.trim();
        if (!email) {
            continue;
        }
        var key = email.toLowerCase();
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
function resolveAlwaysAdminCc(configService) {
    var fromConfig = configService
        ? parseEmailList(configService.get('ADMIN_MAIL_CC') ||
            configService.get('NOTIFICATION_CC_ADMIN'))
        : [];
    if (fromConfig.length > 0) {
        return fromConfig;
    }
    return parseEmailList(exports.DEFAULT_ADMIN_MAIL_CC);
}
/** Primary To address for admin alert emails (in-app companion mail). */
function resolveAdminAlertTo(configService) {
    var _a, _b;
    var configured = ((_a = configService.get('SMTP_ADMIN_ALERT_EMAIL')) === null || _a === void 0 ? void 0 : _a.trim()) ||
        ((_b = configService.get('ADMIN_ALERT_EMAIL')) === null || _b === void 0 ? void 0 : _b.trim());
    if (configured) {
        return configured;
    }
    var always = resolveAlwaysAdminCc(configService);
    return always[0];
}
function mergeEmailLists(lists, excludeTo) {
    var seen = new Set();
    var merged = [];
    var exclude = excludeTo === null || excludeTo === void 0 ? void 0 : excludeTo.trim().toLowerCase();
    for (var _i = 0, lists_1 = lists; _i < lists_1.length; _i++) {
        var list = lists_1[_i];
        for (var _a = 0, list_1 = list; _a < list_1.length; _a++) {
            var email = list_1[_a];
            var key = email.toLowerCase();
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
function resolveCcGroups(configService, groups, excludeTo) {
    var fromGroups = [];
    if (groups === null || groups === void 0 ? void 0 : groups.length) {
        for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
            var group = groups_1[_i];
            var envKey = GROUP_ENV_KEYS[group];
            fromGroups.push.apply(fromGroups, parseEmailList(configService.get(envKey)));
        }
    }
    return mergeEmailLists([fromGroups, resolveAlwaysAdminCc(configService)], excludeTo);
}
/** Merge explicit CC with always-admin CC for EmailService.sendEmail. */
function mergeOutgoingCc(configService, to, explicitCc) {
    var explicit = Array.isArray(explicitCc)
        ? explicitCc
        : parseEmailList(explicitCc !== null && explicitCc !== void 0 ? explicitCc : '');
    var always = resolveAlwaysAdminCc(configService);
    var merged = mergeEmailLists([explicit, always], to);
    return merged.length > 0 ? merged : undefined;
}
/**
 * Watcher inboxes that should receive a separate To-copy of outbound mail.
 * Gmail SMTP does not show BCC/Sent for the sending account, so BCC-to-self
 * never appears — we send a second message with To: these addresses instead.
 */
function resolveOpsCopyRecipients(configService, to) {
    var fromConfig = configService
        ? __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], parseEmailList(configService.get('ADMIN_MAIL_CC')), true), parseEmailList(configService.get('NOTIFICATION_CC_ADMIN')), true), parseEmailList(configService.get('SMTP_BCC')), true), parseEmailList(configService.get('MAIL_BCC')), true), parseEmailList(configService.get('SMTP_SERVER_USER')), true), parseEmailList(configService.get('MAIL_USERNAME')), true), parseEmailList(exports.DEFAULT_ADMIN_MAIL_CC), true) : parseEmailList(exports.DEFAULT_ADMIN_MAIL_CC);
    return mergeEmailLists([fromConfig], to);
}
/**
 * Always BCC the SMTP mailbox (and optional SMTP_BCC / MAIL_BCC) so outbound
 * vendor mails appear in the sending Gmail inbox. Prefer resolveOpsCopyRecipients
 * + separate To copies — Gmail SMTP does not surface BCC-to-self.
 */
function mergeOutgoingBcc(configService, to, explicitBcc) {
    var explicit = Array.isArray(explicitBcc)
        ? explicitBcc
        : parseEmailList(explicitBcc !== null && explicitBcc !== void 0 ? explicitBcc : '');
    var fromConfig = configService
        ? parseEmailList(configService.get('SMTP_BCC') ||
            configService.get('MAIL_BCC') ||
            configService.get('SMTP_SERVER_USER') ||
            configService.get('MAIL_USERNAME'))
        : [];
    var merged = mergeEmailLists([explicit, fromConfig], to);
    return merged.length > 0 ? merged : undefined;
}
