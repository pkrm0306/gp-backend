"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var format_process_final_review_util_1 = require("./format-process-final-review.util");
describe('formatProcessFinalReviewPayload', function () {
    it('returns null for empty input', function () {
        expect((0, format_process_final_review_util_1.formatProcessFinalReviewPayload)(null)).toBeNull();
        expect((0, format_process_final_review_util_1.formatProcessFinalReviewPayload)(undefined)).toBeNull();
    });
    it('formats camelCase and snake_case aliases', function () {
        var out = (0, format_process_final_review_util_1.formatProcessFinalReviewPayload)({
            technicalReview: 'Technical notes',
            finalReview: 'Final notes',
            minCredits: 52,
            maxCredits: 88,
        });
        expect(out).toMatchObject({
            technicalReview: 'Technical notes',
            finalReview: 'Final notes',
            minCredits: 52,
            maxCredits: 88,
            technical_review: 'Technical notes',
            final_review: 'Final notes',
            min_credits: 52,
            max_credits: 88,
        });
    });
});
