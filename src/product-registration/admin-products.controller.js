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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.AdminProductsController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var permissions_guard_1 = require("../common/guards/permissions.guard");
var admin_list_products_dto_1 = require("./dto/admin-list-products.dto");
var admin_products_export_dto_1 = require("./dto/admin-products-export.dto");
var admin_list_valid_till_filter_util_1 = require("./helpers/admin-list-valid-till-filter.util");
var admin_list_products_filter_options_dto_1 = require("./dto/admin-list-products-filter-options.dto");
var admin_update_urn_status_dto_1 = require("./dto/admin-update-urn-status.dto");
var permissions_decorator_1 = require("../common/decorators/permissions.decorator");
var permissions_constants_1 = require("../common/constants/permissions.constants");
var urn_tab_review_dto_1 = require("./dto/urn-tab-review.dto");
var admin_update_product_change_request_dto_1 = require("./dto/admin-update-product-change-request.dto");
var admin_update_certified_product_passport_dto_1 = require("./dto/admin-update-certified-product-passport.dto");
var multer_universal_config_1 = require("../common/upload/multer-universal.config");
var admin_renew_validity_dto_1 = require("./dto/admin-renew-validity.dto");
var upsert_urn_final_review_dto_1 = require("./dto/upsert-urn-final-review.dto");
/**
 * Admin list filters EOIs by **product** `productStatus` (EOI lifecycle), not manufacturer/vendor status.
 * Body may send `status`, `productStatus`, or `product_status` (first non-empty wins).
 * If all are omitted or empty, default to Pending + Submitted `[0, 1]`.
 */
function firstNonEmptyStatusArray(dto) {
    var candidates = [dto.status, dto.productStatus, dto.product_status];
    for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
        var c = candidates_1[_i];
        if (Array.isArray(c) && c.length > 0) {
            return c;
        }
    }
    return undefined;
}
function resolveAdminListProductsBody(dto) {
    var _a, _b, _c, _d, _e, _f, _g;
    var resolved = firstNonEmptyStatusArray(dto);
    var categoryIds = __spreadArray(__spreadArray(__spreadArray([], ((_b = (_a = dto.categoryIds) !== null && _a !== void 0 ? _a : dto.category_ids) !== null && _b !== void 0 ? _b : []), true), (dto.categoryId ? [dto.categoryId] : []), true), (dto.category_id ? [dto.category_id] : []), true).map(function (id) { return String(id).trim(); })
        .filter(function (id) { return id.length > 0; });
    var uniqueCategoryIds = __spreadArray([], new Set(categoryIds), true);
    var sectorIds = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], ((_g = (_f = (_e = (_d = (_c = dto.sectorIds) !== null && _c !== void 0 ? _c : dto.sector_ids) !== null && _d !== void 0 ? _d : dto.buildingIds) !== null && _e !== void 0 ? _e : dto.building_ids) !== null && _f !== void 0 ? _f : dto.buildings) !== null && _g !== void 0 ? _g : []), true), (dto.sectorId != null ? [dto.sectorId] : []), true), (dto.sector_id != null ? [dto.sector_id] : []), true), (dto.buildingId != null ? [dto.buildingId] : []), true), (dto.building_id != null ? [dto.building_id] : []), true), (dto.building != null ? [dto.building] : []), true).map(function (id) { return Number(id); })
        .filter(function (id) { return Number.isFinite(id); });
    var uniqueSectorIds = __spreadArray([], new Set(sectorIds), true);
    var validTillMonthYear = (function () {
        var filter = (0, admin_list_valid_till_filter_util_1.resolveAdminListValidTillMonthYearFilter)(dto);
        return (filter === null || filter === void 0 ? void 0 : filter.kind) === 'single' ? filter.yearMonth : undefined;
    })();
    return __assign(__assign(__assign(__assign(__assign({}, dto), { status: resolved !== null && resolved !== void 0 ? resolved : [0, 1] }), (uniqueCategoryIds.length > 0 ? { categoryIds: uniqueCategoryIds } : {})), (uniqueSectorIds.length > 0 ? { sectorIds: uniqueSectorIds } : {})), (validTillMonthYear ? { validTillMonthYear: validTillMonthYear } : {}));
}
var AdminProductsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Admin Products'), (0, common_1.Controller)('api/admin/products'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getUrnTabReview_decorators;
    var _patchUrnTabReview_decorators;
    var _adminGetProductDetailsByUrn_decorators;
    var _adminPatchUrnStatus_decorators;
    var _adminRenewValidity_decorators;
    var _upsertUrnFinalReview_decorators;
    var _getUrnFinalReview_decorators;
    var _patchCertifiedProduct_decorators;
    var _uploadUrnAssessmentReportByBody_decorators;
    var _uploadUrnAssessmentReport_decorators;
    var _patchCertifiedProductPassport_decorators;
    var _listProductChangeRequests_decorators;
    var _updateProductChangeRequestStatus_decorators;
    var _listFilterOptions_decorators;
    var _list_decorators;
    var _export_decorators;
    var AdminProductsController = _classThis = /** @class */ (function () {
        function AdminProductsController_1(productRegistrationService, urnTabReviewService, renewAdminTestValidityService, processFinalReviewService, activityLogService) {
            this.productRegistrationService = (__runInitializers(this, _instanceExtraInitializers), productRegistrationService);
            this.urnTabReviewService = urnTabReviewService;
            this.renewAdminTestValidityService = renewAdminTestValidityService;
            this.processFinalReviewService = processFinalReviewService;
            this.activityLogService = activityLogService;
        }
        AdminProductsController_1.prototype.getUrnTabReview = function (urnNo, renewalCycleId) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.urnTabReviewService.getUrnTabReviews(urnNo.trim(), renewalCycleId === null || renewalCycleId === void 0 ? void 0 : renewalCycleId.trim())];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'URN tab reviews retrieved', data: data }];
                    }
                });
            });
        };
        AdminProductsController_1.prototype.patchUrnTabReview = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                var adminUserId, data;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            adminUserId = String((_b = (_a = user === null || user === void 0 ? void 0 : user.userId) !== null && _a !== void 0 ? _a : user === null || user === void 0 ? void 0 : user.id) !== null && _b !== void 0 ? _b : '').trim();
                            if (!adminUserId) {
                                throw new common_1.BadRequestException('Admin user id not found in token');
                            }
                            return [4 /*yield*/, this.urnTabReviewService.patchUrnTabReview(dto, adminUserId)];
                        case 1:
                            data = _c.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Tab review updated',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminProductsController_1.prototype.adminGetProductDetailsByUrn = function (urn) {
            return __awaiter(this, void 0, void 0, function () {
                var data, siteVisits, first, embeddedProductDetailsList, productDetailsList, visibleRawMaterialSteps, processFinalReview, vendorId, manufacturerId, trimmedUrn, quickView;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
                return __generator(this, function (_1) {
                    switch (_1.label) {
                        case 0:
                            if (!urn || urn.trim() === '') {
                                throw new common_1.BadRequestException('URN number is required');
                            }
                            return [4 /*yield*/, this.productRegistrationService.getProductDetailsByUrn(urn.trim())];
                        case 1:
                            data = _1.sent();
                            siteVisits = (_b = (_a = data[0]) === null || _a === void 0 ? void 0 : _a.siteVisits) !== null && _b !== void 0 ? _b : [];
                            first = ((_c = data[0]) !== null && _c !== void 0 ? _c : {});
                            embeddedProductDetailsList = first.product_details_list;
                            productDetailsList = Array.isArray(embeddedProductDetailsList) &&
                                embeddedProductDetailsList.length > 0
                                ? embeddedProductDetailsList
                                : data;
                            visibleRawMaterialSteps = (_g = (_e = (_d = first === null || first === void 0 ? void 0 : first.product_details) === null || _d === void 0 ? void 0 : _d.visibleRawMaterialSteps) !== null && _e !== void 0 ? _e : (_f = first === null || first === void 0 ? void 0 : first.category) === null || _f === void 0 ? void 0 : _f.visibleRawMaterialSteps) !== null && _g !== void 0 ? _g : [];
                            processFinalReview = (_j = (_h = first === null || first === void 0 ? void 0 : first.process_final_review) !== null && _h !== void 0 ? _h : first === null || first === void 0 ? void 0 : first.processFinalReview) !== null && _j !== void 0 ? _j : null;
                            vendorId = (_p = (_m = (_k = first === null || first === void 0 ? void 0 : first.vendorId) !== null && _k !== void 0 ? _k : (_l = first === null || first === void 0 ? void 0 : first.vendor) === null || _l === void 0 ? void 0 : _l._id) !== null && _m !== void 0 ? _m : (_o = first === null || first === void 0 ? void 0 : first.manufacturer) === null || _o === void 0 ? void 0 : _o.vendorId) !== null && _p !== void 0 ? _p : null;
                            manufacturerId = (_s = (_q = first === null || first === void 0 ? void 0 : first.manufacturerId) !== null && _q !== void 0 ? _q : (_r = first === null || first === void 0 ? void 0 : first.manufacturer) === null || _r === void 0 ? void 0 : _r._id) !== null && _s !== void 0 ? _s : null;
                            trimmedUrn = String((_t = first === null || first === void 0 ? void 0 : first.urnNo) !== null && _t !== void 0 ? _t : urn).trim();
                            return [4 /*yield*/, this.activityLogService.getQuickViewActivityForUrn(trimmedUrn)];
                        case 2:
                            quickView = _1.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Product details fetched successfully',
                                    data: data,
                                    product_details_list: productDetailsList,
                                    urnContext: {
                                        urnNo: trimmedUrn,
                                        urnStatus: (_u = first === null || first === void 0 ? void 0 : first.urnStatus) !== null && _u !== void 0 ? _u : null,
                                        product_renew_status: (_v = first === null || first === void 0 ? void 0 : first.productRenewStatus) !== null && _v !== void 0 ? _v : null,
                                        productRenewStatus: (_w = first === null || first === void 0 ? void 0 : first.productRenewStatus) !== null && _w !== void 0 ? _w : null,
                                        canSaveProcessComments: (_y = (_x = first === null || first === void 0 ? void 0 : first.product_details) === null || _x === void 0 ? void 0 : _x.canSaveProcessComments) !== null && _y !== void 0 ? _y : null,
                                        processCommentsBlockReason: (_0 = (_z = first === null || first === void 0 ? void 0 : first.product_details) === null || _z === void 0 ? void 0 : _z.processCommentsBlockReason) !== null && _0 !== void 0 ? _0 : null,
                                        vendorId: vendorId,
                                        manufacturerId: manufacturerId,
                                        visibleRawMaterialSteps: visibleRawMaterialSteps,
                                        processFinalReview: processFinalReview,
                                        process_final_review: processFinalReview,
                                    },
                                    currentActivity: quickView,
                                    quickView: quickView,
                                    siteVisits: siteVisits,
                                    site_visits: siteVisits,
                                }];
                    }
                });
            });
        };
        AdminProductsController_1.prototype.adminPatchUrnStatus = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productRegistrationService.adminUpdateUrnStatus(dto)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'URN status updated',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminProductsController_1.prototype.adminRenewValidity = function (user, dto, preview) {
            return __awaiter(this, void 0, void 0, function () {
                var resolvedPreview, userId, data;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            resolvedPreview = dto.preview !== undefined ? dto.preview : String(preview) === 'true';
                            if (dto.startNewRenewalCycle === true && !resolvedPreview) {
                                userId = String((_c = (_b = (_a = user === null || user === void 0 ? void 0 : user.userId) !== null && _a !== void 0 ? _a : user === null || user === void 0 ? void 0 : user.sub) !== null && _b !== void 0 ? _b : user === null || user === void 0 ? void 0 : user._id) !== null && _c !== void 0 ? _c : '').trim();
                                if (!userId) {
                                    throw new common_1.BadRequestException('User ID not found in token');
                                }
                                return [2 /*return*/, this.renewAdminTestValidityService.applyTestValidity({
                                        urnNo: dto.urnNo,
                                        validTillDate: dto.validTillDate,
                                        startNewRenewalCycle: true,
                                    }, userId)];
                            }
                            return [4 /*yield*/, this.productRegistrationService.adminUpdateRenewValidity(__assign(__assign({}, dto), { preview: resolvedPreview }))];
                        case 1:
                            data = _d.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Validity date updated',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminProductsController_1.prototype.upsertUrnFinalReview = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.processFinalReviewService.upsertForUrn(dto)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'URN final review saved successfully',
                                    data: data,
                                    process_final_review: data,
                                }];
                    }
                });
            });
        };
        AdminProductsController_1.prototype.getUrnFinalReview = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.processFinalReviewService.getByUrn(urnNo.trim())];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'URN final review fetched successfully',
                                    data: data,
                                    process_final_review: data,
                                }];
                    }
                });
            });
        };
        AdminProductsController_1.prototype.patchCertifiedProduct = function (productId, dto, productImage) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productRegistrationService.adminPatchCertifiedProduct(productId.trim(), dto, productImage)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Certified product updated successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminProductsController_1.prototype.uploadUrnAssessmentReportByBody = function (urnNo, assessmentReportFile) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.uploadUrnAssessmentReportResponse(urnNo, assessmentReportFile)];
                });
            });
        };
        AdminProductsController_1.prototype.uploadUrnAssessmentReport = function (urnNo, assessmentReportFile) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.uploadUrnAssessmentReportResponse(urnNo, assessmentReportFile)];
                });
            });
        };
        AdminProductsController_1.prototype.uploadUrnAssessmentReportResponse = function (urnNo, assessmentReportFile) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!assessmentReportFile) {
                                throw new common_1.BadRequestException('Assessment report file is required');
                            }
                            return [4 /*yield*/, this.productRegistrationService.adminUploadUrnAssessmentReport(String(urnNo !== null && urnNo !== void 0 ? urnNo : '').trim(), assessmentReportFile)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Assessment report uploaded successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminProductsController_1.prototype.patchCertifiedProductPassport = function (productId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productRegistrationService.adminUpdateCertifiedProductPassport(productId.trim(), dto)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Certified product passport saved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminProductsController_1.prototype.listProductChangeRequests = function (status) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productRegistrationService.adminListProductChangeRequests(status)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Product change requests fetched successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminProductsController_1.prototype.updateProductChangeRequestStatus = function (requestId, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                var adminUserId, data;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            adminUserId = String((_b = (_a = user === null || user === void 0 ? void 0 : user.userId) !== null && _a !== void 0 ? _a : user === null || user === void 0 ? void 0 : user.id) !== null && _b !== void 0 ? _b : '').trim();
                            if (!adminUserId) {
                                throw new common_1.BadRequestException('Admin user id not found in token');
                            }
                            return [4 /*yield*/, this.productRegistrationService.adminUpdateProductChangeRequestStatus(requestId, dto, adminUserId)];
                        case 1:
                            data = _c.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Product change request updated successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminProductsController_1.prototype.listFilterOptions = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.productRegistrationService.adminGetProductListFilterOptions(dto)];
                });
            });
        };
        AdminProductsController_1.prototype.list = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.productRegistrationService.adminListProducts(resolveAdminListProductsBody(dto))];
                });
            });
        };
        AdminProductsController_1.prototype.export = function (dto, res) {
            return __awaiter(this, void 0, void 0, function () {
                var file;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productRegistrationService.exportAdminProductsFile(resolveAdminListProductsBody(dto))];
                        case 1:
                            file = _a.sent();
                            res.setHeader('X-Export-Row-Count', String(file.rowCount));
                            res.setHeader('X-Export-Has-Data', file.rowCount > 0 ? 'true' : 'false');
                            res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, X-Export-Row-Count, X-Export-Has-Data');
                            return [2 /*return*/, new common_1.StreamableFile(file.buffer, {
                                    type: file.contentType,
                                    disposition: "attachment; filename=\"".concat(file.fileName, "\""),
                                })];
                    }
                });
            });
        };
        return AdminProductsController_1;
    }());
    __setFunctionName(_classThis, "AdminProductsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getUrnTabReview_decorators = [(0, common_1.Get)('urn-tab-review/:urnNo'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_VIEW), (0, swagger_1.ApiOperation)({
                summary: 'Get URN tab/step admin review state',
                description: 'Returns required process tabs + raw material steps (from category CSV), per-section reviewStatus (0=pending, 1=approved, 2=rejected), and summary. Used when urnStatus=4.',
            }), (0, swagger_1.ApiParam)({ name: 'urnNo', example: 'URN-20260326162423' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Tab review state' })];
        _patchUrnTabReview_decorators = [(0, common_1.Patch)('urn-tab-review'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Record admin approve/reject for one process tab or raw material step',
                description: 'Body: urnNo, tabKey, stepId (1–15 for raw-materials only), decision (approved|rejected), rejectionRemarks when rejected. Only when urnStatus=4.',
            }), (0, swagger_1.ApiBody)({ type: urn_tab_review_dto_1.PatchUrnTabReviewDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Review recorded' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'URN not in admin review (status !== 4)' })];
        _adminGetProductDetailsByUrn_decorators = [(0, common_1.Get)('details/:urn'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_VIEW), (0, swagger_1.ApiOperation)({
                summary: 'Get product details by URN (platform admin)',
                description: 'Same payload as **GET /products/details/:urn_no** — lookup by URN only (no manufacturer filter). ' +
                    'Each row includes **product_details.urnStatus** (number). **manufacturer** / **manufacturing_details** include full **vendor_details** (email, phone, GST, contacts, etc.) from the manufacturers record. ' +
                    'Includes **siteVisits** on each row and at the response root. ' +
                    'Requires a valid Bearer token (any authenticated user).',
            }), (0, swagger_1.ApiParam)({
                name: 'urn',
                description: 'Full URN (e.g. URN-20260303140911)',
                example: 'URN-20260303140911',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Product details for the URN' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'No products for this URN' })];
        _adminPatchUrnStatus_decorators = [(0, common_1.Patch)('urn-status'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Update URN status (platform admin)',
                description: 'Resolves all products by **urnNo** only. Body: **urnNo**, **updateStatusType** (`urn_status` or `product_status`), and **updateStatusTo**. ' +
                    '`urn_status` accepts 0–17 (includes renewal statuses 12–17). `product_status` accepts 0–3. ' +
                    'Requires a valid Bearer token (any authenticated user).',
            }), (0, swagger_1.ApiBody)({ type: admin_update_urn_status_dto_1.AdminUpdateUrnStatusDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated' }), (0, swagger_1.ApiResponse)({
                status: 400,
                description: 'Invalid updateStatusType/updateStatusTo',
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Unknown URN' })];
        _adminRenewValidity_decorators = [(0, common_1.Patch)('renew-validity'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Update valid-till date by URN (admin utility)',
                description: 'Updates only `validtillDate` for all products under the provided URN. ' +
                    'Does not require productName/productDetails/categoryId/eoiNo.',
            }), (0, swagger_1.ApiBody)({ type: admin_renew_validity_dto_1.AdminRenewValidityDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Validity date updated' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid URN/date input' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Unknown URN' })];
        _upsertUrnFinalReview_decorators = [(0, common_1.Put)('urn-final-review'), (0, common_1.Post)('urn-final-review'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Save URN technical/final review and credits (certified URN details)',
                description: 'Persists `technicalReview`, `finalReview`, `minCredits`, and `maxCredits` for the URN in `process_final_review`. ' +
                    'Snake_case aliases (`technical_review`, `final_review`, `min_credits`, `max_credits`) are accepted.',
            }), (0, swagger_1.ApiBody)({ type: upsert_urn_final_review_dto_1.UpsertUrnFinalReviewDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'URN final review saved' })];
        _getUrnFinalReview_decorators = [(0, common_1.Get)('urn-final-review/:urnNo'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_VIEW), (0, swagger_1.ApiOperation)({
                summary: 'Get URN technical/final review and credits',
            }), (0, swagger_1.ApiParam)({ name: 'urnNo', example: 'URN-20260527122016' })];
        _patchCertifiedProduct_decorators = [(0, common_1.Patch)('certified/:productId'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('productImage', (0, multer_universal_config_1.adminImageMemoryMulterOptions)())), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiOperation)({
                summary: 'Edit certified product (admin)',
                description: 'PATCH only for products with **productStatus = 2** (certified). Updates product name, description, valid till date, and optional image. **Category is read-only** (`categoryEditable: false`) — send the existing category id or omit it. ' +
                    'Body must include matching **urnNo** and **eoiNo**. Changes apply to listings after cache invalidation.',
            }), (0, swagger_1.ApiParam)({
                name: 'productId',
                description: 'MongoDB product document _id',
            }), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    required: [
                        'productName',
                        'productDetails',
                        'urnNo',
                        'eoiNo',
                        'validtillDate',
                    ],
                    properties: {
                        productName: { type: 'string' },
                        productDetails: { type: 'string' },
                        urnNo: { type: 'string' },
                        eoiNo: { type: 'string' },
                        categoryId: {
                            type: 'string',
                            description: 'Read-only — omit or send unchanged category id',
                        },
                        validtillDate: { type: 'string', format: 'date' },
                        validTillDate: { type: 'string', format: 'date' },
                        productImage: {
                            type: 'string',
                            format: 'binary',
                            description: 'Optional product image (JPEG, PNG, GIF, WebP)',
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Certified product updated',
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                _id: { type: 'string' },
                                productMongoId: { type: 'string' },
                                productName: { type: 'string' },
                                productDetails: { type: 'string' },
                                urnNo: { type: 'string' },
                                eoiNo: { type: 'string' },
                                categoryId: { type: 'string' },
                                categoryEditable: { type: 'boolean', example: false },
                                categoryChangeBlockReason: { type: 'string' },
                                productImage: { type: 'string', nullable: true },
                                productImageUrl: { type: 'string', nullable: true },
                                productStatus: { type: 'number', example: 2 },
                                validtillDate: { type: 'string', format: 'date-time', nullable: true },
                                validTill: { type: 'string', format: 'date-time', nullable: true },
                                validTillDate: { type: 'string', format: 'date-time', nullable: true },
                                valid_till_date: { type: 'string', format: 'date-time', nullable: true },
                                updatedDate: { type: 'string', format: 'date-time', nullable: true },
                            },
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Not certified or validation error' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' })];
        _uploadUrnAssessmentReportByBody_decorators = [(0, common_1.Post)('urn-assessment-report'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('assessmentReportFile', (0, multer_universal_config_1.assessmentReportMemoryMulterOptions)())), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiOperation)({
                summary: 'Upload assessment report for certified URN (admin)',
                description: 'Multipart body: `urnNo` + `assessmentReportFile`. Allowed after certification is complete (urnStatus 11). Only PDF, JPG, JPEG, PNG, DOC, and DOCX files are allowed.',
            }), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    required: ['urnNo', 'assessmentReportFile'],
                    properties: {
                        urnNo: { type: 'string', example: 'URN-20260604121240' },
                        assessmentReportFile: {
                            type: 'string',
                            format: 'binary',
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Assessment report uploaded' }), (0, swagger_1.ApiResponse)({
                status: 400,
                description: 'URN not certified, invalid file, or zip/folder rejected',
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'URN not found' })];
        _uploadUrnAssessmentReport_decorators = [(0, common_1.Post)('urn/:urnNo/assessment-report'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('assessmentReportFile', (0, multer_universal_config_1.assessmentReportMemoryMulterOptions)())), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiOperation)({
                summary: 'Upload assessment report for certified URN (admin, path param)',
                description: 'Legacy alias: URN in path. Prefer `POST urn-assessment-report` with `urnNo` in multipart body.',
            }), (0, swagger_1.ApiParam)({ name: 'urnNo', description: 'URN number' }), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    required: ['assessmentReportFile'],
                    properties: {
                        assessmentReportFile: {
                            type: 'string',
                            format: 'binary',
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Assessment report uploaded' }), (0, swagger_1.ApiResponse)({
                status: 400,
                description: 'URN not certified, invalid file, or zip/folder rejected',
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'URN not found' })];
        _patchCertifiedProductPassport_decorators = [(0, common_1.Patch)('certified/:productId/passport'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Save passport for certified product (admin)',
                description: 'Stores passport content for certified products only (productStatus = 2). Passport is optional; empty content clears the stored passport. Maximum 5000 characters excluding whitespace when provided.',
            }), (0, swagger_1.ApiParam)({
                name: 'productId',
                description: 'MongoDB product document _id',
            }), (0, swagger_1.ApiBody)({ type: admin_update_certified_product_passport_dto_1.AdminUpdateCertifiedProductPassportDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Certified product passport saved' }), (0, swagger_1.ApiResponse)({
                status: 400,
                description: 'Validation error (including >5000 characters excluding whitespace)',
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Certified product not found' })];
        _listProductChangeRequests_decorators = [(0, common_1.Get)('requests'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_VIEW), (0, swagger_1.ApiOperation)({
                summary: 'List vendor product name change requests',
                description: 'Used by admin request tab. Optional query `status` = pending | approved | rejected.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Requests fetched successfully' })];
        _updateProductChangeRequestStatus_decorators = [(0, common_1.Patch)('requests/:requestId/status'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_UPDATE), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Review vendor product name change request',
                description: 'Admin can mark request as pending/approved/rejected. On approve, product name is updated for that certified product.',
            }), (0, swagger_1.ApiParam)({
                name: 'requestId',
                description: 'Vendor product change request _id',
            }), (0, swagger_1.ApiBody)({ type: admin_update_product_change_request_dto_1.AdminUpdateProductChangeRequestDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Request status updated' })];
        _listFilterOptions_decorators = [(0, common_1.Post)('list/filter-options'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Filter dropdown options for admin product list (certified, uncertified, etc.)',
                description: 'Returns active categories, manufacturers, valid-till years, and **all countries** (`data.countries[]` — every row in the countries collection, A–Z, not limited to countries with products). ' +
                    'For **certified** scope (`status: [2]`), `filterControls.validTillMonthYear` is a **month/year picker** (`YYYY-MM`); send `validTillMonthYear` / `valid_till` (or aliases) on the list body. ' +
                    'Send selected `countryId` on `POST /admin/products/list`. **State** and **city** are free-text filters (`state`, `city`), not dropdowns. Alternative: `GET /countries/dropdown`. ' +
                    '**Multi-select filters:** `categoryIds` / `category_ids` (Category), `sectorIds` / `sector_ids` / `buildingIds` / `building_ids` (Building), `manufacturerIds`, `manufacturerNames`. **Valid till (certified):** month+year picker, not `validTillYears` dropdown.',
            }), (0, swagger_1.ApiBody)({ type: admin_list_products_filter_options_dto_1.AdminListProductsFilterOptionsDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Filter options' })];
        _list_decorators = [(0, common_1.Post)('list'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_VIEW), (0, swagger_1.ApiOperation)({
                summary: 'Admin product lifecycle listing (manufacturer → URN → EOI)',
                description: 'Default **groupBy: manufacturer** paginates manufacturer groups. Each item includes `manufacturer_id`, `manufacturer_name`, `total_urns`, `total_eois`, and nested `urns[]` with `eois[]`. ' +
                    'Search matches manufacturer name, URN, EOI, or product name; when a manufacturer qualifies, nested URNs/EOIs reflect filters (Option A). ' +
                    'Legacy **groupBy: urn** returns flat URN groups. `total` counts top-level groups (manufacturers or URNs). ' +
                    '**EOI status (`productStatus`):** filter with `status`, `productStatus`, or `product_status` (array of **0–4**). Omit or send empty → defaults to **[0, 1]** (Pending + Submitted). ' +
                    '**Multi-select filters:** `categoryIds` / `category_ids` (Category), `sectorIds` / `sector_ids` / `buildingIds` / `building_ids` (Building), `manufacturerIds`, `manufacturerNames`. **Valid till (certified):** `validTillMonthYear` / `valid_till` month+year picker (`YYYY-MM`), optional range via `validTillFrom` + `validTillTo`. **Location:** `countryId` (dropdown), **`state` / `state_name` (free text)**, `city` (free text). Single-value aliases are merged into multiselect arrays.',
            }), (0, swagger_1.ApiBody)({ type: admin_list_products_dto_1.AdminListProductsDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Products listed successfully' }), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
        _export_decorators = [(0, common_1.Post)('export'), (0, permissions_decorator_1.Permissions)(permissions_constants_1.PERMISSIONS.PRODUCTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiConsumes)('application/json'), (0, swagger_1.ApiOperation)({
                summary: 'Export admin products (Excel or CSV)',
                description: 'Same filters as list. Returns a file download even when filters match zero rows (headers only). Optional body `format`: `xlsx` (default) or `csv`.',
            }), (0, swagger_1.ApiBody)({ type: admin_products_export_dto_1.AdminProductsExportDto }), (0, swagger_1.ApiResponse)({ status: 200, description: 'File download (may contain headers only)' })];
        __esDecorate(_classThis, null, _getUrnTabReview_decorators, { kind: "method", name: "getUrnTabReview", static: false, private: false, access: { has: function (obj) { return "getUrnTabReview" in obj; }, get: function (obj) { return obj.getUrnTabReview; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _patchUrnTabReview_decorators, { kind: "method", name: "patchUrnTabReview", static: false, private: false, access: { has: function (obj) { return "patchUrnTabReview" in obj; }, get: function (obj) { return obj.patchUrnTabReview; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _adminGetProductDetailsByUrn_decorators, { kind: "method", name: "adminGetProductDetailsByUrn", static: false, private: false, access: { has: function (obj) { return "adminGetProductDetailsByUrn" in obj; }, get: function (obj) { return obj.adminGetProductDetailsByUrn; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _adminPatchUrnStatus_decorators, { kind: "method", name: "adminPatchUrnStatus", static: false, private: false, access: { has: function (obj) { return "adminPatchUrnStatus" in obj; }, get: function (obj) { return obj.adminPatchUrnStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _adminRenewValidity_decorators, { kind: "method", name: "adminRenewValidity", static: false, private: false, access: { has: function (obj) { return "adminRenewValidity" in obj; }, get: function (obj) { return obj.adminRenewValidity; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _upsertUrnFinalReview_decorators, { kind: "method", name: "upsertUrnFinalReview", static: false, private: false, access: { has: function (obj) { return "upsertUrnFinalReview" in obj; }, get: function (obj) { return obj.upsertUrnFinalReview; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getUrnFinalReview_decorators, { kind: "method", name: "getUrnFinalReview", static: false, private: false, access: { has: function (obj) { return "getUrnFinalReview" in obj; }, get: function (obj) { return obj.getUrnFinalReview; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _patchCertifiedProduct_decorators, { kind: "method", name: "patchCertifiedProduct", static: false, private: false, access: { has: function (obj) { return "patchCertifiedProduct" in obj; }, get: function (obj) { return obj.patchCertifiedProduct; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _uploadUrnAssessmentReportByBody_decorators, { kind: "method", name: "uploadUrnAssessmentReportByBody", static: false, private: false, access: { has: function (obj) { return "uploadUrnAssessmentReportByBody" in obj; }, get: function (obj) { return obj.uploadUrnAssessmentReportByBody; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _uploadUrnAssessmentReport_decorators, { kind: "method", name: "uploadUrnAssessmentReport", static: false, private: false, access: { has: function (obj) { return "uploadUrnAssessmentReport" in obj; }, get: function (obj) { return obj.uploadUrnAssessmentReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _patchCertifiedProductPassport_decorators, { kind: "method", name: "patchCertifiedProductPassport", static: false, private: false, access: { has: function (obj) { return "patchCertifiedProductPassport" in obj; }, get: function (obj) { return obj.patchCertifiedProductPassport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listProductChangeRequests_decorators, { kind: "method", name: "listProductChangeRequests", static: false, private: false, access: { has: function (obj) { return "listProductChangeRequests" in obj; }, get: function (obj) { return obj.listProductChangeRequests; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateProductChangeRequestStatus_decorators, { kind: "method", name: "updateProductChangeRequestStatus", static: false, private: false, access: { has: function (obj) { return "updateProductChangeRequestStatus" in obj; }, get: function (obj) { return obj.updateProductChangeRequestStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listFilterOptions_decorators, { kind: "method", name: "listFilterOptions", static: false, private: false, access: { has: function (obj) { return "listFilterOptions" in obj; }, get: function (obj) { return obj.listFilterOptions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _list_decorators, { kind: "method", name: "list", static: false, private: false, access: { has: function (obj) { return "list" in obj; }, get: function (obj) { return obj.list; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _export_decorators, { kind: "method", name: "export", static: false, private: false, access: { has: function (obj) { return "export" in obj; }, get: function (obj) { return obj.export; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminProductsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminProductsController = _classThis;
}();
exports.AdminProductsController = AdminProductsController;
