"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var process_comments_payload_util_1 = require("./process-comments-payload.util");
describe('process-comments-payload.util', function () {
    it('parses packed admin comment with review meta', function () {
        var packed = "rreeerr".concat(process_comments_payload_util_1.FINAL_REVIEW_META_SEPARATOR, "{\"technicalHtml\":\"dddd\",\"credits\":\"132\",\"maxCredits\":\"12\"}");
        expect((0, process_comments_payload_util_1.parseSectionCommentPayload)(packed)).toMatchObject({
            adminComment: 'rreeerr',
            technicalReview: 'dddd',
            finalReview: null,
            credits: '132',
            maxCredits: '12',
        });
    });
    it('builds packed payload with meta separator', function () {
        var packed = (0, process_comments_payload_util_1.buildSectionCommentPayload)({
            adminComment: 'note',
            technicalReview: 'tech',
            credits: 10,
            maxCredits: 20,
        });
        expect(packed).toContain(process_comments_payload_util_1.FINAL_REVIEW_META_SEPARATOR);
        expect((0, process_comments_payload_util_1.parseSectionCommentPayload)(packed)).toMatchObject({
            adminComment: 'note',
            technicalReview: 'tech',
            credits: '10',
            maxCredits: '20',
        });
    });
});
