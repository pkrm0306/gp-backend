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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RENEW_UPLOAD_PREFIX = void 0;
exports.toRenewObjectId = toRenewObjectId;
exports.renewUploadPath = renewUploadPath;
exports.resolveUrnRenewContext = resolveUrnRenewContext;
exports.resolveUrnOwnerVendorId = resolveUrnOwnerVendorId;
exports.renewOwnershipFields = renewOwnershipFields;
exports.assertRenewActorCanReadUrn = assertRenewActorCanReadUrn;
exports.assertRenewActorCanEditUrn = assertRenewActorCanEditUrn;
exports.assertRenewProcessEditable = assertRenewProcessEditable;
exports.addMonths = addMonths;
exports.startOfDay = startOfDay;
exports.extendValidityForRenewal = extendValidityForRenewal;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var renewal_cycle_schema_1 = require("../schemas/renewal-cycle.schema");
var renewal_urn_status_constants_1 = require("../constants/renewal-urn-status.constants");
var renew_eligible_product_util_1 = require("./renew-eligible-product.util");
function toRenewObjectId(id, fieldName) {
    if (id instanceof mongoose_1.Types.ObjectId) {
        return id;
    }
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format: ").concat(id));
    }
    return new mongoose_1.Types.ObjectId(id);
}
exports.RENEW_UPLOAD_PREFIX = 'renew_urns';
function renewUploadPath(urnNo) {
    return "".concat(exports.RENEW_UPLOAD_PREFIX, "/").concat(urnNo.trim());
}
/** Resolve vendor + manufacturer from products by URN (renew storage is URN-scoped). */
function resolveUrnRenewContext(productModel, urnNo) {
    return __awaiter(this, void 0, void 0, function () {
        var trimmedUrn, product;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    trimmedUrn = urnNo.trim();
                    return [4 /*yield*/, productModel
                            .findOne(__assign({ urnNo: trimmedUrn }, (0, renew_eligible_product_util_1.matchRenewEligibleProducts)()))
                            .select('vendorId manufacturerId')
                            .lean()
                            .exec()];
                case 1:
                    product = _a.sent();
                    if (!(product === null || product === void 0 ? void 0 : product.vendorId) || !(product === null || product === void 0 ? void 0 : product.manufacturerId)) {
                        throw new common_1.NotFoundException('No certified products found for this URN (rejected EOIs are excluded from renewal)');
                    }
                    return [2 /*return*/, {
                            urnNo: trimmedUrn,
                            vendorId: product.vendorId,
                            manufacturerId: product.manufacturerId,
                        }];
            }
        });
    });
}
/** @deprecated use resolveUrnRenewContext */
function resolveUrnOwnerVendorId(productModel, urnNo) {
    return __awaiter(this, void 0, void 0, function () {
        var context;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, resolveUrnRenewContext(productModel, urnNo)];
                case 1:
                    context = _a.sent();
                    return [2 /*return*/, String(context.vendorId)];
            }
        });
    });
}
function renewOwnershipFields(context) {
    return {
        urnNo: context.urnNo,
        vendorId: context.vendorId,
        manufacturerId: context.manufacturerId,
    };
}
/** Optional vendor JWT check; returns URN ownership context for reads/writes. */
function assertRenewActorCanReadUrn(productModel, urnNo, actorVendorOrManufacturerId) {
    return __awaiter(this, void 0, void 0, function () {
        var context, actorId, ownsUrn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, resolveUrnRenewContext(productModel, urnNo)];
                case 1:
                    context = _a.sent();
                    actorId = actorVendorOrManufacturerId
                        ? String(actorVendorOrManufacturerId).trim()
                        : '';
                    if (actorId) {
                        ownsUrn = String(context.vendorId) === actorId ||
                            String(context.manufacturerId) === actorId;
                        if (!ownsUrn) {
                            throw new common_1.ForbiddenException('Authenticated user does not own this URN');
                        }
                    }
                    return [2 /*return*/, context];
            }
        });
    });
}
/** Optional vendor JWT check; returns URN ownership context for reads/writes. */
function assertRenewActorCanEditUrn(productModel, urnNo, actorVendorOrManufacturerId) {
    return __awaiter(this, void 0, void 0, function () {
        var context, actorId, ownsUrn, product, urnStatus;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, resolveUrnRenewContext(productModel, urnNo)];
                case 1:
                    context = _a.sent();
                    actorId = actorVendorOrManufacturerId
                        ? String(actorVendorOrManufacturerId).trim()
                        : '';
                    if (!actorId) return [3 /*break*/, 3];
                    ownsUrn = String(context.vendorId) === actorId ||
                        String(context.manufacturerId) === actorId;
                    if (!ownsUrn) {
                        throw new common_1.ForbiddenException('Authenticated user does not own this URN');
                    }
                    return [4 /*yield*/, productModel
                            .findOne(__assign({ urnNo: context.urnNo }, (0, renew_eligible_product_util_1.matchRenewEligibleProducts)()))
                            .select('urnStatus')
                            .lean()
                            .exec()];
                case 2:
                    product = _a.sent();
                    urnStatus = Number(product === null || product === void 0 ? void 0 : product.urnStatus);
                    if (renewal_urn_status_constants_1.RENEW_VENDOR_PROCESS_LOCK_STATUSES.has(urnStatus)) {
                        throw new common_1.ForbiddenException('Renewal process forms are locked while admin is reviewing this URN');
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/, context];
            }
        });
    });
}
function assertRenewProcessEditable(productModel, renewalCycleModel, urnNo, renewalCycleId) {
    return __awaiter(this, void 0, void 0, function () {
        var context, product, urnStatus, cycle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, resolveUrnRenewContext(productModel, urnNo)];
                case 1:
                    context = _a.sent();
                    return [4 /*yield*/, productModel
                            .findOne(__assign({ urnNo: context.urnNo }, (0, renew_eligible_product_util_1.matchRenewEligibleProducts)()))
                            .select('urnStatus')
                            .lean()
                            .exec()];
                case 2:
                    product = _a.sent();
                    if (!product) {
                        throw new common_1.NotFoundException('No certified products found for this URN (rejected EOIs are excluded from renewal)');
                    }
                    urnStatus = Number(product.urnStatus);
                    if (urnStatus < renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_APPROVED) {
                        throw new common_1.ForbiddenException('Renewal payment must be approved before editing process sections.');
                    }
                    cycle = null;
                    if (!(renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim())) return [3 /*break*/, 4];
                    return [4 /*yield*/, renewalCycleModel
                            .findById(renewalCycleId.trim())
                            .exec()];
                case 3:
                    cycle = _a.sent();
                    if (!cycle || cycle.urnNo !== context.urnNo) {
                        throw new common_1.BadRequestException('renewalCycleId does not match this URN');
                    }
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, renewalCycleModel
                        .findOne({
                        urnNo: context.urnNo,
                        status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS,
                    })
                        .sort({ cycleNo: -1 })
                        .exec()];
                case 5:
                    cycle = _a.sent();
                    _a.label = 6;
                case 6:
                    if (!cycle) {
                        throw new common_1.ForbiddenException('No active renewal cycle found');
                    }
                    return [2 /*return*/, { cycle: cycle, context: context, urnStatus: urnStatus }];
            }
        });
    });
}
function addMonths(date, months) {
    var d = new Date(date);
    var day = d.getDate();
    d.setDate(1);
    d.setMonth(d.getMonth() + months);
    var lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(day, lastDayOfMonth));
    return d;
}
function startOfDay(date) {
    var d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}
/** Extend validity by 24 months and normalize to Dec 31 of the resulting year. */
function extendValidityForRenewal(currentValidTill) {
    var extended = addMonths(currentValidTill, 24);
    return startOfDay(new Date(extended.getFullYear(), 11, 31));
}
