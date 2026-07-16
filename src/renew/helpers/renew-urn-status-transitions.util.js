"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllowedRenewUrnStatusTargets = getAllowedRenewUrnStatusTargets;
exports.assertRenewUrnStatusTransition = assertRenewUrnStatusTransition;
exports.assertVendorCannotSetRenewStatus = assertVendorCannotSetRenewStatus;
var common_1 = require("@nestjs/common");
var renewal_urn_status_constants_1 = require("../constants/renewal-urn-status.constants");
var VENDOR_TRANSITIONS = (_a = {},
    _a[renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_APPROVED] = [renewal_urn_status_constants_1.RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS],
    _a[renewal_urn_status_constants_1.RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING] = [
        renewal_urn_status_constants_1.RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS,
    ],
    _a);
var ADMIN_TRANSITIONS = (_b = {},
    _b[renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_SUBMITTED] = [renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_APPROVED],
    _b[renewal_urn_status_constants_1.RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS] = [
        renewal_urn_status_constants_1.RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING,
        renewal_urn_status_constants_1.RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING,
    ],
    _b[renewal_urn_status_constants_1.RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING] = [renewal_urn_status_constants_1.RENEWAL_URN_STATUS.COMPLETED],
    _b);
function getAllowedRenewUrnStatusTargets(actor, currentStatus) {
    var _a;
    var map = actor === 'vendor' ? VENDOR_TRANSITIONS : ADMIN_TRANSITIONS;
    return (_a = map[currentStatus]) !== null && _a !== void 0 ? _a : [];
}
function assertRenewUrnStatusTransition(actor, currentStatus, targetStatus) {
    if (currentStatus === targetStatus) {
        return;
    }
    var allowed = getAllowedRenewUrnStatusTargets(actor, currentStatus);
    if (!allowed.includes(targetStatus)) {
        var allowedLabels = allowed.map(function (s) { return "".concat(s, " (").concat((0, renewal_urn_status_constants_1.getRenewalUrnStatusLabel)(s), ")"); });
        throw new common_1.BadRequestException("Invalid renewal URN transition from ".concat(currentStatus, " (").concat((0, renewal_urn_status_constants_1.getRenewalUrnStatusLabel)(currentStatus), ") to ").concat(targetStatus, " (").concat((0, renewal_urn_status_constants_1.getRenewalUrnStatusLabel)(targetStatus), "). ") +
            "Allowed targets for ".concat(actor, ": ").concat(allowedLabels.length ? allowedLabels.join(', ') : 'none'));
    }
}
function assertVendorCannotSetRenewStatus(targetStatus) {
    var forbidden = [
        renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING,
        renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_SUBMITTED,
        renewal_urn_status_constants_1.RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING,
        renewal_urn_status_constants_1.RENEWAL_URN_STATUS.COMPLETED,
    ];
    if (forbidden.includes(targetStatus)) {
        throw new common_1.BadRequestException("Vendors cannot set renewal urnStatus to ".concat(targetStatus, " (").concat((0, renewal_urn_status_constants_1.getRenewalUrnStatusLabel)(targetStatus), ")"));
    }
}
