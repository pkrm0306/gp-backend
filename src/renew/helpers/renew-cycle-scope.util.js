"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.RENEW_ADMIN_PROCESS_TAB_UNLOCK_STATUS = void 0;
exports.resolveCycleScopedUrnStatus = resolveCycleScopedUrnStatus;
exports.canAdminAccessRenewProcessTabs = canAdminAccessRenewProcessTabs;
exports.buildStrictRenewDocumentsFilter = buildStrictRenewDocumentsFilter;
exports.buildRenewProcessHeaderFilter = buildRenewProcessHeaderFilter;
exports.resolveRenewCycleForQuery = resolveRenewCycleForQuery;
exports.buildRenewPaymentFindFilter = buildRenewPaymentFindFilter;
exports.findRenewPaymentsForCycle = findRenewPaymentsForCycle;
exports.mapRenewPaymentForApi = mapRenewPaymentForApi;
exports.buildRenewPaymentsPayload = buildRenewPaymentsPayload;
exports.assertRenewCycleAcceptsPayment = assertRenewCycleAcceptsPayment;
exports.formatCycleScopedPaymentRecords = formatCycleScopedPaymentRecords;
exports.resolveRenewCycleDocument = resolveRenewCycleDocument;
var common_1 = require("@nestjs/common");
var renewal_cycle_schema_1 = require("../schemas/renewal-cycle.schema");
var renewal_urn_status_constants_1 = require("../constants/renewal-urn-status.constants");
var payment_proposal_util_1 = require("../../payments/payment-proposal.util");
var renew_common_util_1 = require("./renew-common.util");
/** Minimum urn_status for admin renew process tabs (Product Performance, Manufacturing, …). */
exports.RENEW_ADMIN_PROCESS_TAB_UNLOCK_STATUS = renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_APPROVED;
/**
 * Resolve urn_status for a specific renewal cycle (admin tab gating + quick-view).
 * Avoids returning certified status 11 while an in-progress cycle is active.
 */
function resolveCycleScopedUrnStatus(cycle, product, payment) {
    var _a, _b, _c, _d;
    var productStatus = Number((_a = product.urnStatus) !== null && _a !== void 0 ? _a : 0);
    var productCycleNo = Number((_b = product.renewCycleNo) !== null && _b !== void 0 ? _b : 0);
    if (!cycle) {
        return productStatus;
    }
    var cycleNo = Number((_c = cycle.cycleNo) !== null && _c !== void 0 ? _c : 0);
    var paymentStatus = Number((_d = payment === null || payment === void 0 ? void 0 : payment.paymentStatus) !== null && _d !== void 0 ? _d : -1);
    var inferFromPayment = function () {
        if (paymentStatus === 2) {
            return renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_APPROVED;
        }
        if (paymentStatus === 1) {
            return renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_SUBMITTED;
        }
        return renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING;
    };
    if (cycle.status === renewal_cycle_schema_1.RenewalCycleStatus.COMPLETED) {
        return renewal_urn_status_constants_1.RENEWAL_URN_STATUS.COMPLETED;
    }
    if (productCycleNo === cycleNo) {
        if (productStatus === renewal_urn_status_constants_1.RENEWAL_URN_STATUS.COMPLETED) {
            return renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING;
        }
        if (productStatus >= renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING) {
            return productStatus;
        }
        return inferFromPayment();
    }
    if (productCycleNo < cycleNo) {
        return inferFromPayment();
    }
    if (productCycleNo > cycleNo) {
        return renewal_urn_status_constants_1.RENEWAL_URN_STATUS.COMPLETED;
    }
    return inferFromPayment();
}
function canAdminAccessRenewProcessTabs(urnStatus) {
    return (urnStatus >= exports.RENEW_ADMIN_PROCESS_TAB_UNLOCK_STATUS ||
        urnStatus === renewal_urn_status_constants_1.RENEWAL_URN_STATUS.COMPLETED);
}
/** Strict renew document filter — current cycle only (no legacy null cycle rows). */
function buildStrictRenewDocumentsFilter(urnNo, renewalCycleId) {
    return {
        urnNo: urnNo.trim(),
        isDeleted: { $ne: true },
        renewalCycleId: (0, renew_common_util_1.toRenewObjectId)(String(renewalCycleId), 'renewalCycleId'),
    };
}
/** Process header lookup: cycle 1 allows legacy rows without renewalCycleId. */
function buildRenewProcessHeaderFilter(urnNo, cycle) {
    var trimmed = urnNo.trim();
    if (!(cycle === null || cycle === void 0 ? void 0 : cycle._id)) {
        return { urnNo: trimmed };
    }
    var cycleId = cycle._id;
    var cycleIdStr = String(cycleId);
    var cycleIdMatches = [
        { renewalCycleId: cycleId },
        { renewalCycleId: cycleIdStr },
    ];
    if (Number(cycle.cycleNo) > 1) {
        return { urnNo: trimmed, $or: cycleIdMatches };
    }
    return {
        urnNo: trimmed,
        $or: __spreadArray(__spreadArray([], cycleIdMatches, true), [
            { renewalCycleId: null },
            { renewalCycleId: { $exists: false } },
        ], false),
    };
}
/** Resolve renewal cycle for read APIs (list units, quick-view) without payment-edit guards. */
function resolveRenewCycleForQuery(cycleModel, urnNo, renewalCycleId) {
    return __awaiter(this, void 0, void 0, function () {
        var trimmed, cycleIdHint, cycle, active;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    trimmed = urnNo.trim();
                    cycleIdHint = String(renewalCycleId !== null && renewalCycleId !== void 0 ? renewalCycleId : '').trim();
                    if (!cycleIdHint) return [3 /*break*/, 2];
                    return [4 /*yield*/, cycleModel.findById(cycleIdHint).exec()];
                case 1:
                    cycle = _a.sent();
                    if (!cycle || cycle.urnNo !== trimmed) {
                        throw new common_1.BadRequestException('renewalCycleId does not match this URN');
                    }
                    return [2 /*return*/, cycle];
                case 2: return [4 /*yield*/, cycleModel
                        .findOne({ urnNo: trimmed, status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS })
                        .exec()];
                case 3:
                    active = _a.sent();
                    if (!active) {
                        throw new common_1.BadRequestException('renewalCycleId is required to load renewal data for this URN');
                    }
                    return [2 /*return*/, active];
            }
        });
    });
}
function buildRenewPaymentFindFilter(urnNo, cycle, vendorId) {
    var _a;
    var cycleId = (0, renew_common_util_1.toRenewObjectId)(String(cycle._id), 'renewalCycleId');
    var cycleNo = Number((_a = cycle.cycleNo) !== null && _a !== void 0 ? _a : 1);
    var orClause = [{ renewalCycleId: cycleId }];
    /** Legacy cycle-1 rows only — never match untagged payments on cycle 2+. */
    if (cycleNo === 1) {
        if (cycle.paymentId != null) {
            orClause.push({
                renewalCycleId: { $in: [null] },
                paymentId: cycle.paymentId,
            });
            orClause.push({
                renewalCycleId: { $exists: false },
                paymentId: cycle.paymentId,
            });
        }
        if (cycle.paymentId == null) {
            orClause.push({ renewalCycleId: { $exists: false } });
            orClause.push({ renewalCycleId: null });
        }
    }
    var filter = {
        urnNo: urnNo.trim(),
        paymentType: 'renew',
        $or: orClause,
    };
    if (vendorId) {
        filter.vendorId = (0, renew_common_util_1.toRenewObjectId)(String(vendorId), 'vendorId');
    }
    return filter;
}
function findRenewPaymentsForCycle(paymentModel, urnNo, cycle, vendorId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, paymentModel
                    .find(buildRenewPaymentFindFilter(urnNo, cycle, vendorId))
                    .sort({ paymentId: -1 })
                    .exec()];
        });
    });
}
function mapRenewPaymentForApi(row) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var plain = typeof row.toObject === 'function'
        ? row.toObject()
        : __assign({}, row);
    return {
        paymentId: plain.paymentId,
        urnNo: plain.urnNo,
        paymentType: plain.paymentType,
        renewalCycleId: plain.renewalCycleId
            ? String(plain.renewalCycleId)
            : null,
        paymentStatus: plain.paymentStatus,
        quoteAmount: plain.quoteAmount,
        quoteGstAmount: plain.quoteGstAmount,
        quoteTdsAmount: plain.quoteTdsAmount,
        quoteTotal: plain.quoteTotal,
        totalAmount: plain.quoteTotal,
        paymentMode: (_a = plain.paymentMode) !== null && _a !== void 0 ? _a : null,
        paymentReferenceNo: (_b = plain.paymentReferenceNo) !== null && _b !== void 0 ? _b : null,
        paymentChequeDate: (_c = plain.paymentChequeDate) !== null && _c !== void 0 ? _c : null,
        proposalFile: (_d = plain.proposalFile) !== null && _d !== void 0 ? _d : null,
        chequeOrDdFile: (_e = plain.chequeOrDdFile) !== null && _e !== void 0 ? _e : null,
        cheque_or_dd_file: (_f = plain.chequeOrDdFile) !== null && _f !== void 0 ? _f : null,
        tdsFile: (_g = plain.tdsFile) !== null && _g !== void 0 ? _g : null,
        tds_file: (_h = plain.tdsFile) !== null && _h !== void 0 ? _h : null,
        paymentRejectionRemarks: (_j = plain.paymentRejectionRemarks) !== null && _j !== void 0 ? _j : null,
        payment_rejection_remarks: (_k = plain.paymentRejectionRemarks) !== null && _k !== void 0 ? _k : null,
        admin_payment_rejection_remarks: (_l = plain.paymentRejectionRemarks) !== null && _l !== void 0 ? _l : null,
        proposalRejectionRemarks: (_m = plain.proposalRejectionRemarks) !== null && _m !== void 0 ? _m : null,
        createdAt: plain.createdDate,
        updatedAt: plain.updatedDate,
        createdDate: plain.createdDate,
        updatedDate: plain.updatedDate,
    };
}
function buildRenewPaymentsPayload(rows) {
    var mapped = rows.map(function (row) { return mapRenewPaymentForApi(row); });
    return {
        payments: mapped,
        payment: mapped.length > 0 ? mapped[0] : null,
    };
}
function assertRenewCycleAcceptsPayment(cycleModel, urnNo, renewalCycleId) {
    return __awaiter(this, void 0, void 0, function () {
        var cycle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cycleModel.findById(renewalCycleId.trim()).exec()];
                case 1:
                    cycle = _a.sent();
                    if (!cycle || cycle.urnNo !== urnNo.trim()) {
                        throw new common_1.BadRequestException('renewalCycleId does not match this URN');
                    }
                    if (cycle.status !== renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS) {
                        throw new common_1.BadRequestException('Renewal payment can only be created for an in-progress renewal cycle');
                    }
                    return [2 /*return*/, cycle];
            }
        });
    });
}
function formatCycleScopedPaymentRecords(rows) {
    return (0, payment_proposal_util_1.formatPaymentRecords)(rows);
}
/** Resolve renewal cycle document for reads/writes (explicit id or active in-progress). */
function resolveRenewCycleDocument(cycleModel, urnNo, renewalCycleId) {
    return __awaiter(this, void 0, void 0, function () {
        var trimmedUrn, cycle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    trimmedUrn = urnNo.trim();
                    if (!(renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim())) return [3 /*break*/, 2];
                    return [4 /*yield*/, cycleModel.findById(renewalCycleId.trim()).exec()];
                case 1:
                    cycle = _a.sent();
                    if (!cycle || cycle.urnNo !== trimmedUrn) {
                        throw new common_1.BadRequestException('renewalCycleId does not match this URN');
                    }
                    return [2 /*return*/, cycle];
                case 2: return [2 /*return*/, cycleModel
                        .findOne({ urnNo: trimmedUrn, status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS })
                        .sort({ cycleNo: -1 })
                        .exec()];
            }
        });
    });
}
