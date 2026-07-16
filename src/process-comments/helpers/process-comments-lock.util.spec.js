"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var process_comments_lock_util_1 = require("./process-comments-lock.util");
describe('process-comments-lock.util', function () {
    it('allows save during admin review and before certification payment submit', function () {
        expect((0, process_comments_lock_util_1.canAdminSaveUncertifiedProcessComments)({ urnStatus: 4, productStatus: 1 })).toBe(true);
        expect((0, process_comments_lock_util_1.canAdminSaveUncertifiedProcessComments)({ urnStatus: 6, productStatus: 1 })).toBe(true);
        expect((0, process_comments_lock_util_1.canAdminSaveUncertifiedProcessComments)({
            urnStatus: process_comments_lock_util_1.PROCESS_COMMENTS_LOCKED_MIN_URN_STATUS - 1,
            productStatus: 1,
        })).toBe(true);
    });
    it('blocks save after vendor submits certification payment for review', function () {
        expect((0, process_comments_lock_util_1.canAdminSaveUncertifiedProcessComments)({
            urnStatus: process_comments_lock_util_1.PROCESS_COMMENTS_LOCKED_MIN_URN_STATUS,
            productStatus: 1,
        })).toBe(false);
        expect((0, process_comments_lock_util_1.canAdminSaveUncertifiedProcessComments)({ urnStatus: 11, productStatus: 1 })).toBe(false);
    });
    it('returns lock message when comments are blocked', function () {
        expect((0, process_comments_lock_util_1.resolveProcessCommentsBlockReason)({
            urnStatus: 8,
            productStatus: 1,
        })).toContain('certification payment');
    });
});
