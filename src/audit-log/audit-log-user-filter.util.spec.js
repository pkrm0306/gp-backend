"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var audit_log_user_filter_util_1 = require("./audit-log-user-filter.util");
describe('buildAuditActorUserFilter', function () {
    var userId = '507f1f77bcf86cd799439011';
    it('matches actor and performed_by user_id', function () {
        expect((0, audit_log_user_filter_util_1.buildAuditActorUserFilter)(userId)).toEqual({
            $or: expect.arrayContaining([
                { 'actor.user_id': userId },
                { 'performed_by.user_id': userId },
                { 'actor.user_id': new mongoose_1.Types.ObjectId(userId) },
                { 'performed_by.user_id': new mongoose_1.Types.ObjectId(userId) },
                {
                    $expr: {
                        $or: expect.arrayContaining([
                            { $eq: [{ $toString: '$actor.user_id' }, userId] },
                            { $eq: [{ $toString: '$performed_by.user_id' }, userId] },
                        ]),
                    },
                },
            ]),
        });
    });
    it('matches vendor organization ids on actor', function () {
        var filter = (0, audit_log_user_filter_util_1.buildAuditActorUserFilter)(userId);
        expect(filter === null || filter === void 0 ? void 0 : filter.$or).toEqual(expect.arrayContaining([
            { 'actor.vendor_id': userId },
            { 'actor.manufacturer_id': userId },
            { 'actor.vendor_id': new mongoose_1.Types.ObjectId(userId) },
            { 'actor.manufacturer_id': new mongoose_1.Types.ObjectId(userId) },
        ]));
    });
    it('matches performed_by name and email case-insensitively', function () {
        var filter = (0, audit_log_user_filter_util_1.buildAuditActorUserFilter)('Prabhas Miraki');
        expect(filter === null || filter === void 0 ? void 0 : filter.$or).toEqual(expect.arrayContaining([
            { 'performed_by.email': /^Prabhas Miraki$/i },
            { 'performed_by.name': /^Prabhas Miraki$/i },
        ]));
    });
    it('returns undefined for blank input', function () {
        expect((0, audit_log_user_filter_util_1.buildAuditActorUserFilter)('   ')).toBeUndefined();
    });
});
