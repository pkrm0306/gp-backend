"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwTeamMemberMobileDuplicateIssue = throwTeamMemberMobileDuplicateIssue;
var common_1 = require("@nestjs/common");
var global_phone_uniqueness_service_1 = require("../common/services/global-phone-uniqueness.service");
/** Inline form issue for duplicate team-member mobile (admin CMS). */
function throwTeamMemberMobileDuplicateIssue() {
    var message = global_phone_uniqueness_service_1.ADMIN_MOBILE_UNAVAILABLE_MESSAGE;
    throw new common_1.BadRequestException({
        code: 'VALIDATION_ERROR',
        message: message,
        fieldErrors: { mobile: message },
        issues: [{ field: 'mobile', message: message }],
    });
}
