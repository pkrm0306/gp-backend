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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenewUrnTabReviewService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var renewal_cycle_schema_1 = require("../schemas/renewal-cycle.schema");
var renew_urn_tab_review_constants_1 = require("../constants/renew-urn-tab-review.constants");
var urn_tab_review_util_1 = require("../../product-registration/helpers/urn-tab-review.util");
var renew_eligible_product_util_1 = require("../helpers/renew-eligible-product.util");
var renewal_urn_status_constants_1 = require("../constants/renewal-urn-status.constants");
var renew_common_util_1 = require("../helpers/renew-common.util");
var RenewUrnTabReviewService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RenewUrnTabReviewService = _classThis = /** @class */ (function () {
        function RenewUrnTabReviewService_1(productModel, renewalCycleModel, reviewModel, activityLogService) {
            this.productModel = productModel;
            this.renewalCycleModel = renewalCycleModel;
            this.reviewModel = reviewModel;
            this.activityLogService = activityLogService;
        }
        RenewUrnTabReviewService_1.prototype.resolveRenewalCycleId = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var cycle_1, cycle;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim())) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.renewalCycleModel
                                    .findById(renewalCycleId.trim())
                                    .exec()];
                        case 1:
                            cycle_1 = _a.sent();
                            if (!cycle_1 || cycle_1.urnNo !== urnNo.trim()) {
                                throw new common_1.BadRequestException('renewalCycleId does not match this URN');
                            }
                            return [2 /*return*/, cycle_1._id];
                        case 2: return [4 /*yield*/, this.renewalCycleModel
                                .findOne({ urnNo: urnNo.trim(), status: renewal_cycle_schema_1.RenewalCycleStatus.IN_PROGRESS })
                                .sort({ cycleNo: -1 })
                                .exec()];
                        case 3:
                            cycle = _a.sent();
                            if (!cycle) {
                                throw new common_1.BadRequestException('renewalCycleId is required when no active renewal cycle exists for this URN');
                            }
                            return [2 /*return*/, cycle._id];
                    }
                });
            });
        };
        /**
         * After vendor resubmit (urnStatus 16→15), reopen rejected renewal sections for admin re-review.
         */
        RenewUrnTabReviewService_1.prototype.resetRejectedReviewsToPendingForCycle = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmed, result;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            trimmed = urnNo.trim();
                            return [4 /*yield*/, this.reviewModel
                                    .updateMany({
                                    urnNo: trimmed,
                                    renewalCycleId: renewalCycleId,
                                    reviewStatus: renew_urn_tab_review_constants_1.RENEW_TAB_REVIEW_STATUS.REJECTED,
                                }, {
                                    $set: {
                                        reviewStatus: renew_urn_tab_review_constants_1.RENEW_TAB_REVIEW_STATUS.PENDING,
                                        reviewedBy: null,
                                        reviewedAt: null,
                                        rejectionRemarks: null,
                                    },
                                })
                                    .exec()];
                        case 1:
                            result = _b.sent();
                            return [2 /*return*/, (_a = result.modifiedCount) !== null && _a !== void 0 ? _a : 0];
                    }
                });
            });
        };
        RenewUrnTabReviewService_1.prototype.ensurePendingReviewsForCycle = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, _a, slot;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _i = 0, _a = (0, renew_urn_tab_review_constants_1.buildRenewRequiredReviewSlots)();
                            _b.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            slot = _a[_i];
                            return [4 /*yield*/, this.reviewModel.updateOne({
                                    urnNo: urnNo,
                                    renewalCycleId: renewalCycleId,
                                    tabKey: slot.tabKey,
                                    stepId: renew_urn_tab_review_constants_1.RENEW_PROCESS_TAB_STEP_ID,
                                }, {
                                    $setOnInsert: {
                                        urnNo: urnNo,
                                        renewalCycleId: renewalCycleId,
                                        tabKey: slot.tabKey,
                                        stepId: renew_urn_tab_review_constants_1.RENEW_PROCESS_TAB_STEP_ID,
                                        reviewStatus: renew_urn_tab_review_constants_1.RENEW_TAB_REVIEW_STATUS.PENDING,
                                        reviewedBy: null,
                                        reviewedAt: null,
                                        rejectionRemarks: null,
                                    },
                                }, { upsert: true })];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RenewUrnTabReviewService_1.prototype.reconcileStaleRejectedReviewsAfterVendorResubmit = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmed, rejected, product, productUpdatedAt, maxRejectedReviewedAt, _i, rejected_1, row, reviewedAt;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmed = urnNo.trim();
                            return [4 /*yield*/, this.reviewModel
                                    .find({
                                    urnNo: trimmed,
                                    renewalCycleId: renewalCycleId,
                                    reviewStatus: renew_urn_tab_review_constants_1.RENEW_TAB_REVIEW_STATUS.REJECTED,
                                })
                                    .select('reviewedAt')
                                    .lean()
                                    .exec()];
                        case 1:
                            rejected = _a.sent();
                            if (rejected.length === 0) {
                                return [2 /*return*/, 0];
                            }
                            return [4 /*yield*/, this.productModel
                                    .findOne(__assign({ urnNo: trimmed }, (0, renew_eligible_product_util_1.matchRenewEligibleProducts)()))
                                    .select('updatedDate')
                                    .sort({ updatedDate: -1 })
                                    .lean()
                                    .exec()];
                        case 2:
                            product = _a.sent();
                            productUpdatedAt = (product === null || product === void 0 ? void 0 : product.updatedDate)
                                ? new Date(product.updatedDate)
                                : null;
                            if (!productUpdatedAt || Number.isNaN(productUpdatedAt.getTime())) {
                                return [2 /*return*/, 0];
                            }
                            maxRejectedReviewedAt = null;
                            for (_i = 0, rejected_1 = rejected; _i < rejected_1.length; _i++) {
                                row = rejected_1[_i];
                                reviewedAt = row.reviewedAt ? new Date(row.reviewedAt) : null;
                                if (!reviewedAt || Number.isNaN(reviewedAt.getTime())) {
                                    continue;
                                }
                                if (!maxRejectedReviewedAt || reviewedAt > maxRejectedReviewedAt) {
                                    maxRejectedReviewedAt = reviewedAt;
                                }
                            }
                            if (!maxRejectedReviewedAt || productUpdatedAt <= maxRejectedReviewedAt) {
                                return [2 /*return*/, 0];
                            }
                            return [2 /*return*/, this.resetRejectedReviewsToPendingForCycle(trimmed, renewalCycleId)];
                    }
                });
            });
        };
        RenewUrnTabReviewService_1.prototype.getUrnTabReviews = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, cycleId, urnStatus, stored, requiredSlots, reviews, summary;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmedUrn = urnNo.trim();
                            return [4 /*yield*/, this.resolveRenewalCycleId(trimmedUrn, renewalCycleId)];
                        case 1:
                            cycleId = _a.sent();
                            return [4 /*yield*/, this.loadUrnStatus(trimmedUrn)];
                        case 2:
                            urnStatus = _a.sent();
                            if (!(0, renewal_urn_status_constants_1.isRenewalUrnStatus)(urnStatus)) {
                                throw new common_1.BadRequestException('URN is not in renewal workflow — use certification tab review');
                            }
                            return [4 /*yield*/, this.ensurePendingReviewsForCycle(trimmedUrn, cycleId)];
                        case 3:
                            _a.sent();
                            if (!(urnStatus === renew_urn_tab_review_constants_1.RENEW_ADMIN_REVIEW_URN_STATUS)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.reconcileStaleRejectedReviewsAfterVendorResubmit(trimmedUrn, cycleId)];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [4 /*yield*/, this.reviewModel
                                .find({ urnNo: trimmedUrn, renewalCycleId: cycleId })
                                .sort({ tabKey: 1 })
                                .lean()
                                .exec()];
                        case 6:
                            stored = _a.sent();
                            requiredSlots = (0, renew_urn_tab_review_constants_1.buildRenewRequiredReviewSlots)();
                            reviews = requiredSlots.map(function (slot) {
                                var row = stored.find(function (r) {
                                    return r.tabKey === slot.tabKey &&
                                        r.stepId === renew_urn_tab_review_constants_1.RENEW_PROCESS_TAB_STEP_ID;
                                });
                                return _this.formatReviewRow(slot.tabKey, row);
                            });
                            summary = this.buildSummary(reviews, requiredSlots.length);
                            return [2 /*return*/, {
                                    urnNo: trimmedUrn,
                                    renewalCycleId: String(cycleId),
                                    urnStatus: urnStatus,
                                    requiredTabs: requiredSlots,
                                    reviews: reviews,
                                    summary: summary,
                                    canReview: urnStatus === renew_urn_tab_review_constants_1.RENEW_ADMIN_REVIEW_URN_STATUS,
                                    quickActions: this.buildQuickActions(summary),
                                }];
                    }
                });
            });
        };
        RenewUrnTabReviewService_1.prototype.patchUrnTabReview = function (dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, cycleId, urnStatus, remarks, existing, reviewStatus, now, updated, requiredCount, summary;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            urnNo = dto.urnNo.trim();
                            return [4 /*yield*/, this.resolveRenewalCycleId(urnNo, dto.renewalCycleId)];
                        case 1:
                            cycleId = _c.sent();
                            return [4 /*yield*/, this.loadUrnStatus(urnNo)];
                        case 2:
                            urnStatus = _c.sent();
                            if (urnStatus !== renew_urn_tab_review_constants_1.RENEW_ADMIN_REVIEW_URN_STATUS) {
                                throw new common_1.ForbiddenException("Renewal tab review is only allowed when urnStatus is ".concat(renew_urn_tab_review_constants_1.RENEW_ADMIN_REVIEW_URN_STATUS, " (Check process forms)"));
                            }
                            if (!(0, renew_urn_tab_review_constants_1.isRenewProcessTabKey)(dto.tabKey)) {
                                throw new common_1.BadRequestException("Invalid renewal tabKey: ".concat(dto.tabKey));
                            }
                            if (dto.stepId != null && dto.stepId !== 0) {
                                throw new common_1.BadRequestException('stepId must be omitted for renewal process tabs');
                            }
                            if (dto.decision === 'rejected') {
                                remarks = String((_a = dto.rejectionRemarks) !== null && _a !== void 0 ? _a : '').trim();
                                if (!remarks) {
                                    throw new common_1.BadRequestException('rejectionRemarks is required when decision is rejected');
                                }
                            }
                            if (!mongoose_1.Types.ObjectId.isValid(adminUserId)) {
                                throw new common_1.BadRequestException('Invalid admin user id');
                            }
                            return [4 /*yield*/, this.reviewModel
                                    .findOne({
                                    urnNo: urnNo,
                                    renewalCycleId: cycleId,
                                    tabKey: dto.tabKey,
                                    stepId: renew_urn_tab_review_constants_1.RENEW_PROCESS_TAB_STEP_ID,
                                })
                                    .select('reviewStatus')
                                    .lean()
                                    .exec()];
                        case 3:
                            existing = _c.sent();
                            if ((0, urn_tab_review_util_1.isTabReviewSlotAlreadyDecided)(existing === null || existing === void 0 ? void 0 : existing.reviewStatus)) {
                                throw new common_1.ConflictException('This section has already been reviewed');
                            }
                            reviewStatus = dto.decision === 'approved'
                                ? renew_urn_tab_review_constants_1.RENEW_TAB_REVIEW_STATUS.APPROVED
                                : renew_urn_tab_review_constants_1.RENEW_TAB_REVIEW_STATUS.REJECTED;
                            now = new Date();
                            return [4 /*yield*/, this.reviewModel
                                    .findOneAndUpdate({
                                    urnNo: urnNo,
                                    renewalCycleId: cycleId,
                                    tabKey: dto.tabKey,
                                    stepId: renew_urn_tab_review_constants_1.RENEW_PROCESS_TAB_STEP_ID,
                                }, {
                                    $set: {
                                        reviewStatus: reviewStatus,
                                        reviewedBy: new mongoose_1.Types.ObjectId(adminUserId),
                                        reviewedAt: now,
                                        rejectionRemarks: dto.decision === 'rejected'
                                            ? String((_b = dto.rejectionRemarks) !== null && _b !== void 0 ? _b : '').trim()
                                            : null,
                                    },
                                    $setOnInsert: {
                                        urnNo: urnNo,
                                        renewalCycleId: cycleId,
                                        tabKey: dto.tabKey,
                                        stepId: renew_urn_tab_review_constants_1.RENEW_PROCESS_TAB_STEP_ID,
                                    },
                                }, { upsert: true, new: true })
                                    .lean()
                                    .exec()];
                        case 4:
                            updated = _c.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Failed to save renewal tab review');
                            }
                            requiredCount = (0, renew_urn_tab_review_constants_1.buildRenewRequiredReviewSlots)().length;
                            return [4 /*yield*/, this.buildSummaryForCycle(urnNo, cycleId, requiredCount)];
                        case 5:
                            summary = _c.sent();
                            return [4 /*yield*/, this.logTabReviewDecision(urnNo, dto.tabKey, dto.decision, urnStatus)];
                        case 6:
                            _c.sent();
                            return [2 /*return*/, {
                                    urnNo: urnNo,
                                    renewalCycleId: String(cycleId),
                                    updatedReview: this.formatReviewRow(dto.tabKey, updated),
                                    summary: summary,
                                    quickActions: this.buildQuickActions(summary),
                                    activity: null,
                                }];
                    }
                });
            });
        };
        /** Used by PATCH /renew/urn-status before 15→16 and 15→17. */
        RenewUrnTabReviewService_1.prototype.assertAdminQuickViewTransitionAllowed = function (urnNo, renewalCycleId, targetStatus) {
            return __awaiter(this, void 0, void 0, function () {
                var cycleObjectId, _a, requiredCount, summary;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(renewalCycleId instanceof mongoose_1.Types.ObjectId)) return [3 /*break*/, 1];
                            _a = renewalCycleId;
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, this.resolveRenewalCycleId(urnNo, String(renewalCycleId))];
                        case 2:
                            _a = _b.sent();
                            _b.label = 3;
                        case 3:
                            cycleObjectId = _a;
                            requiredCount = (0, renew_urn_tab_review_constants_1.buildRenewRequiredReviewSlots)().length;
                            return [4 /*yield*/, this.buildSummaryForCycle(urnNo.trim(), cycleObjectId, requiredCount)];
                        case 4:
                            summary = _b.sent();
                            if (targetStatus === renewal_urn_status_constants_1.RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING) {
                                if (!summary.allApproved) {
                                    throw new common_1.BadRequestException('Cannot submit for final review until all renewal process sections are approved');
                                }
                                return [2 /*return*/];
                            }
                            if (targetStatus === renewal_urn_status_constants_1.RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING) {
                                if (!summary.allReviewed || !summary.hasRejection || summary.allApproved) {
                                    throw new common_1.BadRequestException('Cannot resend to vendor until all sections are reviewed and at least one is rejected');
                                }
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        RenewUrnTabReviewService_1.prototype.getVendorRenewTabReviewGuidance = function (urnNo, vendorId, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, trimmedUrn, product, urnStatus, restrictSaveAndNext, adminState, processTabs, reviews;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            vendorObjectId = this.toVendorObjectId(vendorId);
                            trimmedUrn = urnNo === null || urnNo === void 0 ? void 0 : urnNo.trim();
                            if (!trimmedUrn) {
                                throw new common_1.BadRequestException('urnNo is required');
                            }
                            return [4 /*yield*/, this.productModel
                                    .findOne(__assign({ urnNo: trimmedUrn, vendorId: vendorObjectId }, (0, renew_eligible_product_util_1.matchRenewEligibleProducts)()))
                                    .select('urnNo urnStatus')
                                    .lean()
                                    .exec()];
                        case 1:
                            product = _b.sent();
                            if (!product) {
                                throw new common_1.NotFoundException("No product found for URN: ".concat(trimmedUrn));
                            }
                            urnStatus = Number((_a = product.urnStatus) !== null && _a !== void 0 ? _a : 0);
                            restrictSaveAndNext = urnStatus === renew_urn_tab_review_constants_1.RENEW_VENDOR_RESUBMIT_URN_STATUS;
                            if (!restrictSaveAndNext) {
                                return [2 /*return*/, {
                                        urnNo: trimmedUrn,
                                        urnStatus: urnStatus,
                                        restrictSaveAndNext: false,
                                        reviews: [],
                                        processTabs: {},
                                        rawMaterialSteps: {},
                                        rejectedDocumentSlotKeys: [],
                                        summary: null,
                                    }];
                            }
                            return [4 /*yield*/, this.getUrnTabReviews(trimmedUrn, renewalCycleId)];
                        case 2:
                            adminState = _b.sent();
                            processTabs = {};
                            reviews = adminState.reviews.map(function (row) {
                                var _a, _b;
                                var canSaveAndNext = row.reviewStatus === renew_urn_tab_review_constants_1.RENEW_TAB_REVIEW_STATUS.REJECTED;
                                var slot = {
                                    tabKey: row.tabKey,
                                    stepId: row.stepId,
                                    label: (_b = (_a = adminState.requiredTabs.find(function (t) { return t.tabKey === row.tabKey; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : row.tabKey,
                                    reviewStatus: row.reviewStatus,
                                    rejectionRemarks: row.rejectionRemarks,
                                    canSaveAndNext: canSaveAndNext,
                                };
                                if (row.stepId == null) {
                                    processTabs[row.tabKey] = slot;
                                }
                                return __assign(__assign({}, row), { canSaveAndNext: canSaveAndNext });
                            });
                            return [2 /*return*/, {
                                    urnNo: trimmedUrn,
                                    urnStatus: urnStatus,
                                    renewalCycleId: adminState.renewalCycleId,
                                    restrictSaveAndNext: true,
                                    reviews: reviews,
                                    processTabs: processTabs,
                                    rawMaterialSteps: {},
                                    rejectedDocumentSlotKeys: [],
                                    summary: adminState.summary,
                                }];
                    }
                });
            });
        };
        RenewUrnTabReviewService_1.prototype.formatReviewRow = function (tabKey, row) {
            var _a, _b;
            var status = typeof (row === null || row === void 0 ? void 0 : row.reviewStatus) === 'number'
                ? row.reviewStatus
                : renew_urn_tab_review_constants_1.RENEW_TAB_REVIEW_STATUS.PENDING;
            return {
                tabKey: tabKey,
                stepId: null,
                reviewStatus: status,
                rejectionRemarks: (_a = row === null || row === void 0 ? void 0 : row.rejectionRemarks) !== null && _a !== void 0 ? _a : null,
                reviewedBy: (row === null || row === void 0 ? void 0 : row.reviewedBy) ? String(row.reviewedBy) : null,
                reviewedAt: (_b = row === null || row === void 0 ? void 0 : row.reviewedAt) !== null && _b !== void 0 ? _b : null,
            };
        };
        RenewUrnTabReviewService_1.prototype.buildSummary = function (reviews, totalRequired) {
            var pending = 0;
            var approved = 0;
            var rejected = 0;
            for (var _i = 0, reviews_1 = reviews; _i < reviews_1.length; _i++) {
                var r = reviews_1[_i];
                if (r.reviewStatus === renew_urn_tab_review_constants_1.RENEW_TAB_REVIEW_STATUS.APPROVED)
                    approved += 1;
                else if (r.reviewStatus === renew_urn_tab_review_constants_1.RENEW_TAB_REVIEW_STATUS.REJECTED)
                    rejected += 1;
                else
                    pending += 1;
            }
            return {
                totalRequired: totalRequired,
                pending: pending,
                approved: approved,
                rejected: rejected,
                allReviewed: pending === 0,
                allApproved: totalRequired > 0 && approved === totalRequired,
                hasRejection: rejected > 0,
            };
        };
        RenewUrnTabReviewService_1.prototype.buildSummaryForCycle = function (urnNo, renewalCycleId, totalRequired) {
            return __awaiter(this, void 0, void 0, function () {
                var counts, approved, rejected, pending;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, this.reviewModel.aggregate([
                                { $match: { urnNo: urnNo, renewalCycleId: renewalCycleId } },
                                { $group: { _id: '$reviewStatus', count: { $sum: 1 } } },
                            ])];
                        case 1:
                            counts = _e.sent();
                            approved = (_b = (_a = counts.find(function (c) { return c._id === renew_urn_tab_review_constants_1.RENEW_TAB_REVIEW_STATUS.APPROVED; })) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0;
                            rejected = (_d = (_c = counts.find(function (c) { return c._id === renew_urn_tab_review_constants_1.RENEW_TAB_REVIEW_STATUS.REJECTED; })) === null || _c === void 0 ? void 0 : _c.count) !== null && _d !== void 0 ? _d : 0;
                            pending = Math.max(totalRequired - approved - rejected, 0);
                            return [2 /*return*/, {
                                    totalRequired: totalRequired,
                                    pending: pending,
                                    approved: approved,
                                    rejected: rejected,
                                    allReviewed: pending === 0,
                                    allApproved: totalRequired > 0 && approved === totalRequired,
                                    hasRejection: rejected > 0,
                                }];
                    }
                });
            });
        };
        RenewUrnTabReviewService_1.prototype.buildQuickActions = function (summary) {
            var enableResend = summary.allReviewed && summary.hasRejection && !summary.allApproved;
            var enableSubmitFinal = summary.allReviewed && summary.allApproved;
            return {
                disableBoth: !summary.allReviewed,
                enableResend: enableResend,
                enableSubmitFinal: enableSubmitFinal,
            };
        };
        RenewUrnTabReviewService_1.prototype.loadUrnStatus = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var product;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.productModel
                                .findOne(__assign({ urnNo: urnNo }, (0, renew_eligible_product_util_1.matchRenewEligibleProducts)()))
                                .select('urnStatus')
                                .lean()
                                .exec()];
                        case 1:
                            product = _b.sent();
                            if (!product) {
                                throw new common_1.NotFoundException("No product found for URN: ".concat(urnNo));
                            }
                            return [2 /*return*/, Number((_a = product.urnStatus) !== null && _a !== void 0 ? _a : 0)];
                    }
                });
            });
        };
        RenewUrnTabReviewService_1.prototype.toVendorObjectId = function (vendorId) {
            if (!mongoose_1.Types.ObjectId.isValid(vendorId)) {
                throw new common_1.BadRequestException('Invalid vendor id');
            }
            return new mongoose_1.Types.ObjectId(vendorId);
        };
        RenewUrnTabReviewService_1.prototype.logTabReviewDecision = function (urnNo, tabKey, decision, urnStatus) {
            return __awaiter(this, void 0, void 0, function () {
                var context, ownership, label, _a;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, (0, renew_common_util_1.resolveUrnRenewContext)(this.productModel, urnNo)];
                        case 1:
                            context = _d.sent();
                            ownership = (0, renew_common_util_1.renewOwnershipFields)(context);
                            label = (_c = (_b = (0, renew_urn_tab_review_constants_1.buildRenewRequiredReviewSlots)().find(function (s) { return s.tabKey === tabKey; })) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : tabKey;
                            return [4 /*yield*/, this.activityLogService.logActivity({
                                    vendor_id: ownership.vendorId,
                                    manufacturer_id: ownership.manufacturerId,
                                    urn_no: urnNo,
                                    activities_id: urnStatus,
                                    activity: decision === 'rejected'
                                        ? "Renewal section rejected: ".concat(label)
                                        : "Renewal section approved: ".concat(label),
                                    activity_status: urnStatus,
                                    responsibility: 'Admin',
                                    next_responsibility: 'Admin',
                                    next_acitivities_id: urnStatus,
                                    next_activity: 'Renewal process review',
                                })];
                        case 2:
                            _d.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _d.sent();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return RenewUrnTabReviewService_1;
    }());
    __setFunctionName(_classThis, "RenewUrnTabReviewService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RenewUrnTabReviewService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RenewUrnTabReviewService = _classThis;
}();
exports.RenewUrnTabReviewService = RenewUrnTabReviewService;
