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
exports.UrnTabReviewService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var active_product_filter_1 = require("./constants/active-product.filter");
var urn_tab_review_constants_1 = require("./constants/urn-tab-review.constants");
var category_change_constants_1 = require("./constants/category-change.constants");
var urn_tab_review_util_1 = require("./helpers/urn-tab-review.util");
var renewal_urn_status_constants_1 = require("../renew/constants/renewal-urn-status.constants");
var vendor_urn_tab_access_util_1 = require("../common/vendor/vendor-urn-tab-access.util");
var process_comments_payload_util_1 = require("../process-comments/helpers/process-comments-payload.util");
var process_comments_lock_util_1 = require("../process-comments/helpers/process-comments-lock.util");
var TAB_KEY_TO_PROCESS_COMMENT_FIELD = {
    'product-design': 'productDesign',
    'product-performance': 'productPerformance',
    'manufacturing-process': 'manfacturingProcess',
    'waste-management': 'wasteManagement',
    'life-cycle-approach': 'lifeCycleApproach',
    'product-stewardship': 'productStewardship',
    innovation: 'productInnovation',
};
var UrnTabReviewService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var UrnTabReviewService = _classThis = /** @class */ (function () {
        function UrnTabReviewService_1(productModel, categoryModel, reviewModel, processCommentsModel, renewUrnTabReviewService) {
            this.productModel = productModel;
            this.categoryModel = categoryModel;
            this.reviewModel = reviewModel;
            this.processCommentsModel = processCommentsModel;
            this.renewUrnTabReviewService = renewUrnTabReviewService;
        }
        UrnTabReviewService_1.prototype.ensurePendingReviewsForUrn = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var context, slots, _i, slots_1, slot, stepId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadUrnReviewContext(urnNo)];
                        case 1:
                            context = _a.sent();
                            slots = (0, urn_tab_review_util_1.buildRequiredReviewSlots)(context.visibleRawMaterialSteps);
                            _i = 0, slots_1 = slots;
                            _a.label = 2;
                        case 2:
                            if (!(_i < slots_1.length)) return [3 /*break*/, 5];
                            slot = slots_1[_i];
                            stepId = void 0;
                            try {
                                stepId = (0, urn_tab_review_util_1.normalizeReviewStepId)(slot.tabKey, slot.stepId);
                            }
                            catch (_b) {
                                return [3 /*break*/, 4];
                            }
                            return [4 /*yield*/, this.reviewModel.updateOne({ urnNo: urnNo, tabKey: slot.tabKey, stepId: stepId }, {
                                    $setOnInsert: {
                                        urnNo: urnNo,
                                        tabKey: slot.tabKey,
                                        stepId: stepId,
                                        reviewStatus: urn_tab_review_constants_1.URN_TAB_REVIEW_STATUS.PENDING,
                                        reviewedBy: null,
                                        reviewedAt: null,
                                        rejectionRemarks: null,
                                    },
                                }, { upsert: true })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * After vendor resubmit (urnStatus 5→4), reopen rejected sections for admin re-review.
         * Approved sections stay locked.
         */
        UrnTabReviewService_1.prototype.resetRejectedReviewsToPendingForUrn = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmed, result;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            trimmed = urnNo === null || urnNo === void 0 ? void 0 : urnNo.trim();
                            if (!trimmed) {
                                return [2 /*return*/, 0];
                            }
                            return [4 /*yield*/, this.reviewModel
                                    .updateMany({ urnNo: trimmed, reviewStatus: urn_tab_review_constants_1.URN_TAB_REVIEW_STATUS.REJECTED }, {
                                    $set: {
                                        reviewStatus: urn_tab_review_constants_1.URN_TAB_REVIEW_STATUS.PENDING,
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
        /**
         * Heal rejected rows left at status 2 after vendor resubmit when the 5→4 hook did not run
         * (e.g. data from before the reset fix). If the URN was updated after the last rejection
         * timestamp, vendor changes are in — reopen those sections for admin.
         */
        UrnTabReviewService_1.prototype.reconcileStaleRejectedReviewsAfterVendorResubmit = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmed, rejected, product, productUpdatedAt, maxRejectedReviewedAt, _i, rejected_1, row, reviewedAt;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmed = urnNo === null || urnNo === void 0 ? void 0 : urnNo.trim();
                            if (!trimmed) {
                                return [2 /*return*/, 0];
                            }
                            return [4 /*yield*/, this.reviewModel
                                    .find({ urnNo: trimmed, reviewStatus: urn_tab_review_constants_1.URN_TAB_REVIEW_STATUS.REJECTED })
                                    .select('reviewedAt')
                                    .lean()
                                    .exec()];
                        case 1:
                            rejected = _a.sent();
                            if (rejected.length === 0) {
                                return [2 /*return*/, 0];
                            }
                            return [4 /*yield*/, this.productModel
                                    .findOne((0, active_product_filter_1.matchActiveProducts)({ urnNo: trimmed }))
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
                            return [2 /*return*/, this.resetRejectedReviewsToPendingForUrn(trimmed)];
                    }
                });
            });
        };
        /**
         * Vendor panel: after admin resend (`urnStatus === 5`), which tabs/steps may use Save & Next.
         * Only sections with `reviewStatus === rejected` are editable; approved tabs are read-only.
         */
        UrnTabReviewService_1.prototype.getVendorUrnTabReviewGuidance = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, trimmedUrn, product, urnStatus, productRenewStatus, tabAccess, renewGuidance, restrictSaveAndNext, adminState, processTabs, rawMaterialSteps, reviews;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            vendorObjectId = this.toVendorObjectId(vendorId);
                            trimmedUrn = urnNo === null || urnNo === void 0 ? void 0 : urnNo.trim();
                            if (!trimmedUrn) {
                                throw new common_1.BadRequestException('urnNo is required');
                            }
                            return [4 /*yield*/, this.productModel
                                    .findOne((0, active_product_filter_1.matchActiveProducts)({
                                    urnNo: trimmedUrn,
                                    vendorId: vendorObjectId,
                                }))
                                    .select('urnNo urnStatus categoryId productRenewStatus')
                                    .lean()
                                    .exec()];
                        case 1:
                            product = _c.sent();
                            if (!product) {
                                throw new common_1.NotFoundException("No product found for URN: ".concat(trimmedUrn));
                            }
                            urnStatus = Number((_a = product.urnStatus) !== null && _a !== void 0 ? _a : 0);
                            productRenewStatus = Number((_b = product.productRenewStatus) !== null && _b !== void 0 ? _b : 0);
                            tabAccess = (0, vendor_urn_tab_access_util_1.buildVendorUrnTabAccess)({
                                urnNo: trimmedUrn,
                                urnStatus: urnStatus,
                                productRenewStatus: productRenewStatus,
                            });
                            if (!(0, renewal_urn_status_constants_1.shouldUseRenewWorkflowForUrn)({ urnStatus: urnStatus, productRenewStatus: productRenewStatus })) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.renewUrnTabReviewService.getVendorRenewTabReviewGuidance(trimmedUrn, vendorId)];
                        case 2:
                            renewGuidance = _c.sent();
                            return [2 /*return*/, __assign(__assign({}, renewGuidance), { tabAccess: tabAccess })];
                        case 3:
                            restrictSaveAndNext = urnStatus === urn_tab_review_constants_1.VENDOR_RESUBMIT_URN_STATUS;
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
                                        tabAccess: tabAccess,
                                    }];
                            }
                            return [4 /*yield*/, this.getUrnTabReviews(trimmedUrn)];
                        case 4:
                            adminState = _c.sent();
                            processTabs = {};
                            rawMaterialSteps = {};
                            reviews = adminState.reviews.map(function (row) {
                                var _a, _b;
                                var canSaveAndNext = row.reviewStatus === urn_tab_review_constants_1.URN_TAB_REVIEW_STATUS.REJECTED;
                                var slot = {
                                    tabKey: row.tabKey,
                                    stepId: row.stepId,
                                    label: (_b = (_a = adminState.requiredTabs.find(function (t) { return t.tabKey === row.tabKey && t.stepId === row.stepId; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : row.tabKey,
                                    reviewStatus: row.reviewStatus,
                                    rejectionRemarks: row.rejectionRemarks != null ? String(row.rejectionRemarks) : null,
                                    canSaveAndNext: canSaveAndNext,
                                };
                                if (row.tabKey === urn_tab_review_constants_1.RAW_MATERIALS_TAB_KEY && row.stepId != null) {
                                    rawMaterialSteps[String(row.stepId)] = slot;
                                }
                                else if (row.stepId == null) {
                                    processTabs[row.tabKey] = slot;
                                }
                                return __assign(__assign({}, row), { canSaveAndNext: canSaveAndNext });
                            });
                            return [2 /*return*/, {
                                    urnNo: trimmedUrn,
                                    urnStatus: urnStatus,
                                    restrictSaveAndNext: true,
                                    visibleRawMaterialSteps: 'visibleRawMaterialSteps' in adminState
                                        ? adminState.visibleRawMaterialSteps
                                        : [],
                                    reviews: reviews,
                                    processTabs: processTabs,
                                    rawMaterialSteps: rawMaterialSteps,
                                    rejectedDocumentSlotKeys: [],
                                    summary: adminState.summary,
                                    tabAccess: tabAccess,
                                }];
                    }
                });
            });
        };
        UrnTabReviewService_1.prototype.getVendorUrnTabAccess = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var guidance;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.getVendorUrnTabReviewGuidance(urnNo, vendorId)];
                        case 1:
                            guidance = _c.sent();
                            return [2 /*return*/, (_a = guidance.tabAccess) !== null && _a !== void 0 ? _a : (0, vendor_urn_tab_access_util_1.buildVendorUrnTabAccess)({
                                    urnNo: guidance.urnNo,
                                    urnStatus: Number((_b = guidance.urnStatus) !== null && _b !== void 0 ? _b : 0),
                                })];
                    }
                });
            });
        };
        /** Used by admin PATCH urn-status before 4→5 and 4→6. */
        UrnTabReviewService_1.prototype.assertAdminQuickViewTransitionAllowed = function (urnNo, targetStatus) {
            return __awaiter(this, void 0, void 0, function () {
                var adminState, summary;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getUrnTabReviews(urnNo.trim())];
                        case 1:
                            adminState = _a.sent();
                            summary = adminState.summary;
                            if (targetStatus === urn_tab_review_constants_1.VENDOR_RESUBMIT_URN_STATUS) {
                                if (!summary.allReviewed || !summary.hasRejection || summary.allApproved) {
                                    throw new common_1.BadRequestException('Cannot resend to vendor until all sections are reviewed and at least one is rejected');
                                }
                                return [2 /*return*/];
                            }
                            if (targetStatus === category_change_constants_1.ADMIN_FINAL_SUBMIT_URN_STATUS) {
                                if (!summary.allReviewed || !summary.allApproved) {
                                    throw new common_1.BadRequestException('Cannot submit for final review until all process sections are approved');
                                }
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        UrnTabReviewService_1.prototype.getUrnTabReviews = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var context, stored, sectionReviewByTabKey, requiredSlots, reviews, summary, canSaveProcessComments;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadUrnReviewContext(urnNo)];
                        case 1:
                            context = _a.sent();
                            if ((0, renewal_urn_status_constants_1.shouldUseRenewWorkflowForUrn)({
                                urnStatus: context.urnStatus,
                                productRenewStatus: context.productRenewStatus,
                            })) {
                                return [2 /*return*/, this.renewUrnTabReviewService.getUrnTabReviews(urnNo, renewalCycleId)];
                            }
                            return [4 /*yield*/, this.ensurePendingReviewsForUrn(urnNo)];
                        case 2:
                            _a.sent();
                            if (!(context.urnStatus === urn_tab_review_constants_1.ADMIN_REVIEW_URN_STATUS)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.reconcileStaleRejectedReviewsAfterVendorResubmit(urnNo)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [4 /*yield*/, this.reviewModel
                                .find({ urnNo: urnNo })
                                .sort({ tabKey: 1, stepId: 1 })
                                .lean()
                                .exec()];
                        case 5:
                            stored = _a.sent();
                            return [4 /*yield*/, this.loadSectionReviewsByTabKey(urnNo, context.vendorId)];
                        case 6:
                            sectionReviewByTabKey = _a.sent();
                            requiredSlots = (0, urn_tab_review_util_1.buildRequiredReviewSlots)(context.visibleRawMaterialSteps);
                            reviews = requiredSlots.map(function (slot) {
                                var _a;
                                var stepIdStored = (0, urn_tab_review_util_1.normalizeReviewStepId)(slot.tabKey, slot.stepId);
                                var row = stored.find(function (r) { return r.tabKey === slot.tabKey && r.stepId === stepIdStored; });
                                var sectionReview = slot.stepId == null ? (_a = sectionReviewByTabKey[slot.tabKey]) !== null && _a !== void 0 ? _a : null : null;
                                return __assign(__assign({}, _this.formatReviewRow(slot.tabKey, stepIdStored, row)), { sectionReview: sectionReview });
                            });
                            summary = this.buildSummary(reviews, requiredSlots.length);
                            canSaveProcessComments = (0, process_comments_lock_util_1.canAdminSaveUncertifiedProcessComments)({
                                urnStatus: context.urnStatus,
                                productStatus: context.productStatus,
                            });
                            return [2 /*return*/, {
                                    urnNo: urnNo,
                                    urnStatus: context.urnStatus,
                                    categoryRawMaterialForms: context.categoryRawMaterialForms,
                                    visibleRawMaterialSteps: context.visibleRawMaterialSteps,
                                    requiredTabs: requiredSlots,
                                    reviews: reviews,
                                    sectionReviews: sectionReviewByTabKey,
                                    summary: summary,
                                    canReview: context.urnStatus === urn_tab_review_constants_1.ADMIN_REVIEW_URN_STATUS,
                                    canSaveProcessComments: canSaveProcessComments,
                                    processCommentsBlockReason: (0, process_comments_lock_util_1.resolveProcessCommentsBlockReason)({
                                        urnStatus: context.urnStatus,
                                        productStatus: context.productStatus,
                                    }),
                                }];
                    }
                });
            });
        };
        UrnTabReviewService_1.prototype.patchUrnTabReview = function (dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, context, remarks, stepIdStored, existing, reviewStatus, now, updated, requiredSlots, summary;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            urnNo = dto.urnNo.trim();
                            return [4 /*yield*/, this.loadUrnReviewContext(urnNo)];
                        case 1:
                            context = _c.sent();
                            if ((0, renewal_urn_status_constants_1.shouldUseRenewWorkflowForUrn)({
                                urnStatus: context.urnStatus,
                                productRenewStatus: context.productRenewStatus,
                            })) {
                                return [2 /*return*/, this.renewUrnTabReviewService.patchUrnTabReview(dto, adminUserId)];
                            }
                            if (context.urnStatus !== urn_tab_review_constants_1.ADMIN_REVIEW_URN_STATUS) {
                                throw new common_1.ForbiddenException("Tab review is only allowed when urnStatus is ".concat(urn_tab_review_constants_1.ADMIN_REVIEW_URN_STATUS, " (Admin Review Pending)"));
                            }
                            if (dto.tabKey === urn_tab_review_constants_1.RAW_MATERIALS_TAB_KEY) {
                                if (dto.stepId == null) {
                                    throw new common_1.BadRequestException('stepId is required for raw-materials');
                                }
                                if (!context.visibleRawMaterialSteps.includes(dto.stepId)) {
                                    throw new common_1.BadRequestException("Raw materials step ".concat(dto.stepId, " is not enabled for this product category"));
                                }
                            }
                            else if (!(0, urn_tab_review_util_1.isProcessTabKey)(dto.tabKey)) {
                                throw new common_1.BadRequestException("Invalid tabKey: ".concat(dto.tabKey));
                            }
                            else if (dto.stepId != null && dto.stepId !== 0) {
                                throw new common_1.BadRequestException('stepId must be omitted for process tabs');
                            }
                            if (dto.decision === 'rejected') {
                                remarks = String((_a = dto.rejectionRemarks) !== null && _a !== void 0 ? _a : '').trim();
                                if (!remarks) {
                                    throw new common_1.BadRequestException('rejectionRemarks is required when decision is rejected');
                                }
                            }
                            stepIdStored = (0, urn_tab_review_util_1.normalizeReviewStepId)(dto.tabKey, dto.stepId);
                            return [4 /*yield*/, this.reviewModel
                                    .findOne({ urnNo: urnNo, tabKey: dto.tabKey, stepId: stepIdStored })
                                    .select('reviewStatus')
                                    .lean()
                                    .exec()];
                        case 2:
                            existing = _c.sent();
                            if ((0, urn_tab_review_util_1.isTabReviewSlotAlreadyDecided)(existing === null || existing === void 0 ? void 0 : existing.reviewStatus)) {
                                throw new common_1.ConflictException('This section has already been reviewed');
                            }
                            reviewStatus = dto.decision === 'approved'
                                ? urn_tab_review_constants_1.URN_TAB_REVIEW_STATUS.APPROVED
                                : urn_tab_review_constants_1.URN_TAB_REVIEW_STATUS.REJECTED;
                            if (!mongoose_1.Types.ObjectId.isValid(adminUserId)) {
                                throw new common_1.BadRequestException('Invalid admin user id');
                            }
                            now = new Date();
                            return [4 /*yield*/, this.reviewModel
                                    .findOneAndUpdate({ urnNo: urnNo, tabKey: dto.tabKey, stepId: stepIdStored }, {
                                    $set: {
                                        reviewStatus: reviewStatus,
                                        reviewedBy: new mongoose_1.Types.ObjectId(adminUserId),
                                        reviewedAt: now,
                                        rejectionRemarks: dto.decision === 'rejected'
                                            ? String((_b = dto.rejectionRemarks) !== null && _b !== void 0 ? _b : '').trim()
                                            : null,
                                    },
                                    $setOnInsert: { urnNo: urnNo, tabKey: dto.tabKey, stepId: stepIdStored },
                                }, { upsert: true, new: true })
                                    .lean()
                                    .exec()];
                        case 3:
                            updated = _c.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Failed to save tab review');
                            }
                            requiredSlots = (0, urn_tab_review_util_1.buildRequiredReviewSlots)(context.visibleRawMaterialSteps);
                            return [4 /*yield*/, this.buildSummaryForUrn(urnNo, requiredSlots.length)];
                        case 4:
                            summary = _c.sent();
                            return [2 /*return*/, {
                                    urnNo: urnNo,
                                    updatedReview: this.formatReviewRow(dto.tabKey, stepIdStored, updated),
                                    summary: summary,
                                    quickActions: this.buildQuickActions(summary),
                                    /** Reserved for future timeline hook when patch writes activity rows. */
                                    activity: null,
                                }];
                    }
                });
            });
        };
        UrnTabReviewService_1.prototype.formatReviewRow = function (tabKey, stepIdStored, row) {
            var _a, _b;
            var status = typeof (row === null || row === void 0 ? void 0 : row.reviewStatus) === 'number'
                ? row.reviewStatus
                : urn_tab_review_constants_1.URN_TAB_REVIEW_STATUS.PENDING;
            return {
                tabKey: tabKey,
                stepId: (0, urn_tab_review_util_1.apiStepIdFromStored)(tabKey, stepIdStored),
                reviewStatus: status,
                rejectionRemarks: (_a = row === null || row === void 0 ? void 0 : row.rejectionRemarks) !== null && _a !== void 0 ? _a : null,
                reviewedBy: (row === null || row === void 0 ? void 0 : row.reviewedBy) ? String(row.reviewedBy) : null,
                reviewedAt: (_b = row === null || row === void 0 ? void 0 : row.reviewedAt) !== null && _b !== void 0 ? _b : null,
            };
        };
        UrnTabReviewService_1.prototype.buildSummary = function (reviews, totalRequired) {
            var pending = 0;
            var approved = 0;
            var rejected = 0;
            for (var _i = 0, reviews_1 = reviews; _i < reviews_1.length; _i++) {
                var r = reviews_1[_i];
                if (r.reviewStatus === urn_tab_review_constants_1.URN_TAB_REVIEW_STATUS.APPROVED)
                    approved += 1;
                else if (r.reviewStatus === urn_tab_review_constants_1.URN_TAB_REVIEW_STATUS.REJECTED)
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
        /**
         * Lightweight summary for PATCH responses (avoids heavy `getUrnTabReviews()` refetch path).
         */
        UrnTabReviewService_1.prototype.buildSummaryForUrn = function (urnNo, totalRequired) {
            return __awaiter(this, void 0, void 0, function () {
                var counts, approved, rejected, pending;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, this.reviewModel.aggregate([
                                { $match: { urnNo: urnNo } },
                                {
                                    $group: {
                                        _id: '$reviewStatus',
                                        count: { $sum: 1 },
                                    },
                                },
                            ])];
                        case 1:
                            counts = _e.sent();
                            approved = (_b = (_a = counts.find(function (c) { return c._id === urn_tab_review_constants_1.URN_TAB_REVIEW_STATUS.APPROVED; })) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0;
                            rejected = (_d = (_c = counts.find(function (c) { return c._id === urn_tab_review_constants_1.URN_TAB_REVIEW_STATUS.REJECTED; })) === null || _c === void 0 ? void 0 : _c.count) !== null && _d !== void 0 ? _d : 0;
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
        UrnTabReviewService_1.prototype.buildQuickActions = function (summary) {
            var enableResend = summary.allReviewed && summary.hasRejection && !summary.allApproved;
            var enableSubmitFinal = summary.allReviewed && summary.allApproved;
            return {
                disableBoth: !summary.allReviewed,
                enableResend: enableResend,
                enableSubmitFinal: enableSubmitFinal,
            };
        };
        UrnTabReviewService_1.prototype.toVendorObjectId = function (vendorId) {
            if (!mongoose_1.Types.ObjectId.isValid(vendorId)) {
                throw new common_1.BadRequestException('Invalid vendor id');
            }
            return new mongoose_1.Types.ObjectId(vendorId);
        };
        UrnTabReviewService_1.prototype.loadUrnReviewContext = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmed, product, category, categoryRawMaterialForms, visibleRawMaterialSteps;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            trimmed = urnNo === null || urnNo === void 0 ? void 0 : urnNo.trim();
                            if (!trimmed) {
                                throw new common_1.BadRequestException('urnNo is required');
                            }
                            return [4 /*yield*/, this.productModel
                                    .findOne((0, active_product_filter_1.matchActiveProducts)({ urnNo: trimmed }))
                                    .select('urnNo urnStatus categoryId vendorId productRenewStatus productStatus')
                                    .sort({ createdDate: 1 })
                                    .lean()
                                    .exec()];
                        case 1:
                            product = _e.sent();
                            if (!product) {
                                throw new common_1.NotFoundException("No product found for URN: ".concat(trimmed));
                            }
                            return [4 /*yield*/, this.categoryModel
                                    .findById(product.categoryId)
                                    .select('category_raw_material_forms')
                                    .lean()
                                    .exec()];
                        case 2:
                            category = _e.sent();
                            categoryRawMaterialForms = (_a = category === null || category === void 0 ? void 0 : category.category_raw_material_forms) !== null && _a !== void 0 ? _a : '';
                            visibleRawMaterialSteps = (0, urn_tab_review_util_1.parseVisibleRawMaterialSteps)(categoryRawMaterialForms);
                            return [2 /*return*/, {
                                    urnNo: trimmed,
                                    urnStatus: Number((_b = product.urnStatus) !== null && _b !== void 0 ? _b : 0),
                                    productStatus: Number((_c = product.productStatus) !== null && _c !== void 0 ? _c : 0),
                                    productRenewStatus: Number((_d = product.productRenewStatus) !== null && _d !== void 0 ? _d : 0),
                                    vendorId: product.vendorId,
                                    categoryRawMaterialForms: categoryRawMaterialForms,
                                    visibleRawMaterialSteps: visibleRawMaterialSteps,
                                }];
                    }
                });
            });
        };
        UrnTabReviewService_1.prototype.loadSectionReviewsByTabKey = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var comments, row, out, _i, _a, _b, tabKey, field, packed;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.processCommentsModel
                                .findOne({ urnNo: urnNo, vendorId: vendorId })
                                .lean()
                                .exec()];
                        case 1:
                            comments = _c.sent();
                            if (!comments) {
                                return [2 /*return*/, {}];
                            }
                            row = comments;
                            out = {};
                            for (_i = 0, _a = Object.entries(TAB_KEY_TO_PROCESS_COMMENT_FIELD); _i < _a.length; _i++) {
                                _b = _a[_i], tabKey = _b[0], field = _b[1];
                                packed = row[field];
                                if (typeof packed === 'string' && packed.trim() !== '') {
                                    out[tabKey] = (0, process_comments_payload_util_1.parseSectionCommentPayload)(packed);
                                }
                            }
                            return [2 /*return*/, out];
                    }
                });
            });
        };
        return UrnTabReviewService_1;
    }());
    __setFunctionName(_classThis, "UrnTabReviewService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UrnTabReviewService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UrnTabReviewService = _classThis;
}();
exports.UrnTabReviewService = UrnTabReviewService;
