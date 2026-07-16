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
exports.DashboardService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var vendor_progress_util_1 = require("./vendor-progress.util");
var vendor_applications_util_1 = require("./vendor-applications.util");
var DashboardService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DashboardService = _classThis = /** @class */ (function () {
        function DashboardService_1(productModel, paymentDetailsModel, vendorUserModel, eventModel, manufacturerModel, activityLogModel, manufacturersService) {
            this.productModel = productModel;
            this.paymentDetailsModel = paymentDetailsModel;
            this.vendorUserModel = vendorUserModel;
            this.eventModel = eventModel;
            this.manufacturerModel = manufacturerModel;
            this.activityLogModel = activityLogModel;
            this.manufacturersService = manufacturersService;
        }
        /**
         * Vendor dashboard — **Applications & URNs** table.
         * When **urn** is passed, returns products for that batch only.
         * When **urn** is omitted, returns products across **all** URN batches.
         */
        DashboardService_1.prototype.listApplicationsAndUrns = function (authUserId, tokenManufacturerId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, urnFilter, scopedUrn, page, limit, currentPage, perPage, skip, match, search, re, _a, totalCount, products, rows;
                var _b, _c, _d, _e, _f, _g, _h;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0: return [4 /*yield*/, this.resolveVendorManufacturerObjectId(authUserId, tokenManufacturerId)];
                        case 1:
                            vendorObjectId = _j.sent();
                            return [4 /*yield*/, this.assertVendorProfileComplete(authUserId, tokenManufacturerId)];
                        case 2:
                            _j.sent();
                            urnFilter = String((_b = query.urn) !== null && _b !== void 0 ? _b : '').trim();
                            scopedUrn = null;
                            if (!urnFilter) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.resolvePrimaryUrnProduct(vendorObjectId, urnFilter)];
                        case 3:
                            scopedUrn = _j.sent();
                            if (!scopedUrn) {
                                return [2 /*return*/, {
                                        message: 'Applications and URNs retrieved successfully',
                                        data: {
                                            urn_no: urnFilter,
                                            urn_status: 0,
                                            rows: [],
                                            totalCount: 0,
                                            currentPage: 1,
                                            totalPages: 1,
                                            limit: Number((_c = query.limit) !== null && _c !== void 0 ? _c : 10),
                                        },
                                    }];
                            }
                            _j.label = 4;
                        case 4:
                            page = Number((_d = query.page) !== null && _d !== void 0 ? _d : 1);
                            limit = Number((_e = query.limit) !== null && _e !== void 0 ? _e : 10);
                            currentPage = Number.isFinite(page) && page > 0 ? page : 1;
                            perPage = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 10;
                            skip = (currentPage - 1) * perPage;
                            match = {
                                vendorId: vendorObjectId,
                                productType: 0,
                            };
                            if (scopedUrn) {
                                match.urnNo = scopedUrn.urnNo;
                            }
                            search = String((_f = query.search) !== null && _f !== void 0 ? _f : '').trim();
                            if (search) {
                                re = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                                match.$or = [{ eoiNo: re }, { productName: re }, { urnNo: re }];
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.productModel.countDocuments(match).exec(),
                                    this.productModel
                                        .find(match)
                                        .select('productId urnNo eoiNo productName productStatus urnStatus validtillDate createdDate')
                                        .sort({ urnNo: -1, createdDate: -1, productId: -1 })
                                        .skip(skip)
                                        .limit(perPage)
                                        .lean()
                                        .exec(),
                                ])];
                        case 5:
                            _a = _j.sent(), totalCount = _a[0], products = _a[1];
                            rows = products.map(function (p, index) { return (__assign({ s_no: skip + index + 1 }, (0, vendor_applications_util_1.buildVendorApplicationRow)({
                                productId: p.productId,
                                urnNo: p.urnNo,
                                eoiNo: p.eoiNo,
                                productName: p.productName,
                                productStatus: p.productStatus,
                                urnStatus: p.urnStatus,
                                validtillDate: p.validtillDate,
                            }))); });
                            return [2 /*return*/, {
                                    message: 'Applications and URNs retrieved successfully',
                                    data: {
                                        urn_no: (_g = scopedUrn === null || scopedUrn === void 0 ? void 0 : scopedUrn.urnNo) !== null && _g !== void 0 ? _g : null,
                                        urn_status: (_h = scopedUrn === null || scopedUrn === void 0 ? void 0 : scopedUrn.urnStatus) !== null && _h !== void 0 ? _h : 0,
                                        rows: rows,
                                        totalCount: totalCount,
                                        currentPage: currentPage,
                                        totalPages: Math.max(1, Math.ceil(totalCount / perPage)),
                                        limit: perPage,
                                    },
                                }];
                    }
                });
            });
        };
        /** Distinct certification URNs for the vendor dashboard URN selector. */
        DashboardService_1.prototype.listVendorUrns = function (authUserId, tokenManufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, urns;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.resolveVendorManufacturerObjectId(authUserId, tokenManufacturerId)];
                        case 1:
                            vendorObjectId = _a.sent();
                            return [4 /*yield*/, this.assertVendorProfileComplete(authUserId, tokenManufacturerId)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.productModel.distinct('urnNo', {
                                    vendorId: vendorObjectId,
                                    productType: 0,
                                    urnNo: { $exists: true, $nin: [null, ''] },
                                })];
                        case 3:
                            urns = _a.sent();
                            return [2 /*return*/, urns
                                    .map(function (urn) { return String(urn !== null && urn !== void 0 ? urn : '').trim(); })
                                    .filter(Boolean)
                                    .sort(function (a, b) { return b.localeCompare(a); })];
                    }
                });
            });
        };
        /**
         * Progress tracking for every URN batch in one request (dashboard carousel).
         */
        DashboardService_1.prototype.listAllUrnProgressTracking = function (authUserId, tokenManufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, products, urnStatusByUrn, _i, products_1, product, urn, urns, activityLogs, logsByUrn, _a, activityLogs_1, log, urn, existing, progress;
                var _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0: return [4 /*yield*/, this.resolveVendorManufacturerObjectId(authUserId, tokenManufacturerId)];
                        case 1:
                            vendorObjectId = _f.sent();
                            return [4 /*yield*/, this.assertVendorProfileComplete(authUserId, tokenManufacturerId)];
                        case 2:
                            _f.sent();
                            return [4 /*yield*/, this.productModel
                                    .find({
                                    vendorId: vendorObjectId,
                                    productType: 0,
                                    urnNo: { $exists: true, $nin: [null, ''] },
                                })
                                    .select('urnNo urnStatus productId')
                                    .sort({ urnNo: -1, productId: -1 })
                                    .lean()
                                    .exec()];
                        case 3:
                            products = _f.sent();
                            urnStatusByUrn = new Map();
                            for (_i = 0, products_1 = products; _i < products_1.length; _i++) {
                                product = products_1[_i];
                                urn = String((_b = product.urnNo) !== null && _b !== void 0 ? _b : '').trim();
                                if (!urn || urnStatusByUrn.has(urn))
                                    continue;
                                urnStatusByUrn.set(urn, Number((_c = product.urnStatus) !== null && _c !== void 0 ? _c : 0));
                            }
                            urns = Array.from(urnStatusByUrn.keys()).sort(function (a, b) {
                                return b.localeCompare(a);
                            });
                            if (urns.length === 0) {
                                return [2 /*return*/, { urns: [], progress: [] }];
                            }
                            return [4 /*yield*/, this.activityLogModel
                                    .find({ vendor_id: vendorObjectId, urn_no: { $in: urns } })
                                    .sort({ created_at: 1 })
                                    .lean()
                                    .exec()];
                        case 4:
                            activityLogs = _f.sent();
                            logsByUrn = new Map();
                            for (_a = 0, activityLogs_1 = activityLogs; _a < activityLogs_1.length; _a++) {
                                log = activityLogs_1[_a];
                                urn = String((_d = log.urn_no) !== null && _d !== void 0 ? _d : '').trim();
                                if (!urn)
                                    continue;
                                existing = (_e = logsByUrn.get(urn)) !== null && _e !== void 0 ? _e : [];
                                existing.push(log);
                                logsByUrn.set(urn, existing);
                            }
                            progress = urns.map(function (urnNo) {
                                var _a, _b;
                                return (0, vendor_progress_util_1.buildVendorProgressTracking)({
                                    urnNo: urnNo,
                                    urnStatus: (_a = urnStatusByUrn.get(urnNo)) !== null && _a !== void 0 ? _a : 0,
                                    activityLogs: (_b = logsByUrn.get(urnNo)) !== null && _b !== void 0 ? _b : [],
                                });
                            });
                            return [2 /*return*/, { urns: urns, progress: progress }];
                    }
                });
            });
        };
        DashboardService_1.prototype.resolveVendorManufacturerObjectId = function (authUserId, tokenManufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var resolvedManufacturer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manufacturersService.resolveManufacturerForAuthUser({
                                userId: authUserId,
                                manufacturerId: tokenManufacturerId,
                                vendorId: tokenManufacturerId,
                            })];
                        case 1:
                            resolvedManufacturer = (_a.sent()).resolvedManufacturer;
                            if (resolvedManufacturer === null || resolvedManufacturer === void 0 ? void 0 : resolvedManufacturer._id) {
                                return [2 /*return*/, resolvedManufacturer._id];
                            }
                            if (tokenManufacturerId && mongoose_1.Types.ObjectId.isValid(tokenManufacturerId)) {
                                return [2 /*return*/, new mongoose_1.Types.ObjectId(tokenManufacturerId)];
                            }
                            throw new common_1.ForbiddenException('Manufacturer not found');
                    }
                });
            });
        };
        DashboardService_1.prototype.assertVendorProfileComplete = function (authUserId, tokenManufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, resolvedManufacturer, vendorUser;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.manufacturersService.resolveManufacturerForAuthUser({
                                userId: authUserId,
                                manufacturerId: tokenManufacturerId,
                                vendorId: tokenManufacturerId,
                            })];
                        case 1:
                            _a = _b.sent(), resolvedManufacturer = _a.resolvedManufacturer, vendorUser = _a.vendorUser;
                            if (!resolvedManufacturer) {
                                throw new common_1.ForbiddenException('Please enter your account details to access all options!');
                            }
                            if (!this.manufacturersService.isVendorAccountProfileComplete(resolvedManufacturer, vendorUser)) {
                                throw new common_1.ForbiddenException('Please enter your account details to access all options!');
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        DashboardService_1.prototype.resolveVendorObjectIdForOverview = function (authUserId, tokenManufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.resolveVendorManufacturerObjectId(authUserId, tokenManufacturerId)];
                        case 1:
                            vendorObjectId = _a.sent();
                            return [4 /*yield*/, this.assertVendorProfileComplete(authUserId, tokenManufacturerId)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, vendorObjectId];
                    }
                });
            });
        };
        DashboardService_1.prototype.getDashboardData = function (authUserId, tokenManufacturerId, urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, _a, productCount, certifiedProductCount, paymentPendingAmount, partnerCount, upcomingEventsCount, latestUrn, latestEoi, progressTracking, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.resolveVendorObjectIdForOverview(authUserId, tokenManufacturerId)];
                        case 1:
                            vendorObjectId = _b.sent();
                            return [4 /*yield*/, Promise.all([
                                    this.getProductsCount(vendorObjectId),
                                    this.getCertifiedProductsCount(vendorObjectId),
                                    this.getPaymentPendingAmount(vendorObjectId),
                                    this.getPartnersCount(vendorObjectId),
                                    this.getUpcomingEventsCount(),
                                    this.getLatestUrn(vendorObjectId),
                                    this.getLatestEoi(vendorObjectId),
                                    this.getProgressTracking(vendorObjectId, urnNo === null || urnNo === void 0 ? void 0 : urnNo.trim()),
                                ])];
                        case 2:
                            _a = _b.sent(), productCount = _a[0], certifiedProductCount = _a[1], paymentPendingAmount = _a[2], partnerCount = _a[3], upcomingEventsCount = _a[4], latestUrn = _a[5], latestEoi = _a[6], progressTracking = _a[7];
                            return [2 /*return*/, {
                                    success: true,
                                    data: {
                                        products: { product_count: productCount },
                                        certifiedProducts: { certified_product_count: certifiedProductCount },
                                        paymentPendingAmount: {
                                            payment_pending_amount: paymentPendingAmount,
                                        },
                                        partners: { partner_count: partnerCount },
                                        upcomingEventsCount: { upcoming_events_count: upcomingEventsCount },
                                        latestUrn: latestUrn,
                                        latestEoi: latestEoi,
                                        progressTracking: progressTracking,
                                    },
                                }];
                        case 3:
                            error_1 = _b.sent();
                            if (error_1 instanceof common_1.ForbiddenException) {
                                throw error_1;
                            }
                            console.error('[Dashboard Service] Error:', error_1);
                            throw new common_1.InternalServerErrorException('Failed to fetch dashboard data');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Query 1: Get total number of products for the vendor
         */
        DashboardService_1.prototype.getProductsCount = function (vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productModel.countDocuments({ vendorId: vendorId }).exec()];
                        case 1:
                            count = _a.sent();
                            return [2 /*return*/, count || 0];
                    }
                });
            });
        };
        /**
         * Query 2: Get count of certified products (product_status = 2)
         */
        DashboardService_1.prototype.getCertifiedProductsCount = function (vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productModel
                                .countDocuments({
                                vendorId: vendorId,
                                productStatus: 2,
                            })
                                .exec()];
                        case 1:
                            count = _a.sent();
                            return [2 /*return*/, count || 0];
                    }
                });
            });
        };
        /**
         * Query 3: Get sum of pending payment amounts (payment_status = 0)
         */
        DashboardService_1.prototype.getPaymentPendingAmount = function (vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.paymentDetailsModel
                                .aggregate([
                                {
                                    $match: {
                                        vendorId: vendorId,
                                        paymentStatus: 0,
                                    },
                                },
                                {
                                    $group: {
                                        _id: null,
                                        total: { $sum: '$quoteTotal' },
                                    },
                                },
                            ])
                                .exec()];
                        case 1:
                            result = _a.sent();
                            if (result.length === 0 ||
                                result[0].total === null ||
                                result[0].total === undefined) {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, result[0].total];
                    }
                });
            });
        };
        /**
         * Query 4: Get count of partners (type = 'partner', status IN (0, 1))
         */
        DashboardService_1.prototype.getPartnersCount = function (vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.vendorUserModel
                                .countDocuments({
                                vendorId: vendorId,
                                type: 'partner',
                                status: { $in: [0, 1] },
                            })
                                .exec()];
                        case 1:
                            count = _a.sent();
                            return [2 /*return*/, count || 0];
                    }
                });
            });
        };
        /**
         * Query 5: Get count of upcoming events (event_date >= today, event_status = 1)
         * Note: This query is NOT filtered by vendor_id (it's global events)
         */
        DashboardService_1.prototype.getUpcomingEventsCount = function () {
            return __awaiter(this, void 0, void 0, function () {
                var today, count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return [4 /*yield*/, this.eventModel
                                    .countDocuments({
                                    eventDate: { $gte: today },
                                    eventStatus: 1,
                                })
                                    .exec()];
                        case 1:
                            count = _a.sent();
                            return [2 /*return*/, count || 0];
                    }
                });
            });
        };
        /**
         * Dynamic certification progress (vendor panel only).
         * Stepper + latest/next cards from products.urnStatus and activity_log for the URN.
         */
        DashboardService_1.prototype.getProgressTracking = function (vendorId, urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var primary, activityLogs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.resolvePrimaryUrnProduct(vendorId, urnNo)];
                        case 1:
                            primary = _a.sent();
                            if (!primary) {
                                return [2 /*return*/, (0, vendor_progress_util_1.buildVendorProgressTracking)({
                                        urnNo: null,
                                        urnStatus: null,
                                        activityLogs: [],
                                    })];
                            }
                            return [4 /*yield*/, this.activityLogModel
                                    .find({ vendor_id: vendorId, urn_no: primary.urnNo })
                                    .sort({ created_at: 1 })
                                    .lean()
                                    .exec()];
                        case 2:
                            activityLogs = _a.sent();
                            return [2 /*return*/, (0, vendor_progress_util_1.buildVendorProgressTracking)({
                                    urnNo: primary.urnNo,
                                    urnStatus: primary.urnStatus,
                                    activityLogs: activityLogs,
                                })];
                    }
                });
            });
        };
        DashboardService_1.prototype.resolvePrimaryUrnProduct = function (vendorId, urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var row_1, row;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!urnNo) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.productModel
                                    .findOne({ vendorId: vendorId, urnNo: urnNo, productType: 0 })
                                    .select('urnNo urnStatus')
                                    .sort({ productId: -1 })
                                    .lean()
                                    .exec()];
                        case 1:
                            row_1 = _c.sent();
                            if (!(row_1 === null || row_1 === void 0 ? void 0 : row_1.urnNo)) {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, {
                                    urnNo: row_1.urnNo,
                                    urnStatus: Number((_a = row_1.urnStatus) !== null && _a !== void 0 ? _a : 0),
                                }];
                        case 2: return [4 /*yield*/, this.productModel
                                .findOne({ vendorId: vendorId, productType: 0 })
                                .select('urnNo urnStatus')
                                .sort({ urnNo: -1, productId: -1 })
                                .lean()
                                .exec()];
                        case 3:
                            row = _c.sent();
                            if (!(row === null || row === void 0 ? void 0 : row.urnNo)) {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, {
                                    urnNo: row.urnNo,
                                    urnStatus: Number((_b = row.urnStatus) !== null && _b !== void 0 ? _b : 0),
                                }];
                    }
                });
            });
        };
        /**
         * Query 6: Get latest 4 URN records (product_type = 0), ordered by urn_no DESC
         */
        DashboardService_1.prototype.getLatestUrn = function (vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var results;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productModel
                                .find({
                                vendorId: vendorId,
                                productType: 0,
                            })
                                .select('urnNo urnStatus productStatus')
                                .sort({ urnNo: -1, productId: -1 })
                                .limit(4)
                                .exec()];
                        case 1:
                            results = _a.sent();
                            return [2 /*return*/, results.map(function (product) { return ({
                                    urn_no: product.urnNo,
                                    urn_status: product.urnStatus,
                                    product_status: product.productStatus,
                                }); })];
                    }
                });
            });
        };
        /**
         * Query 7: Get latest 10 EOI records (product_type = 0), ordered by created_date DESC
         */
        DashboardService_1.prototype.getLatestEoi = function (vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var results;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productModel
                                .find({
                                vendorId: vendorId,
                                productType: 0,
                            })
                                .select('eoiNo productName productStatus')
                                .sort({ createdDate: -1 })
                                .limit(10)
                                .exec()];
                        case 1:
                            results = _a.sent();
                            return [2 /*return*/, results.map(function (product) { return ({
                                    eoi_no: product.eoiNo,
                                    product_name: product.productName,
                                    product_status: product.productStatus,
                                }); })];
                    }
                });
            });
        };
        return DashboardService_1;
    }());
    __setFunctionName(_classThis, "DashboardService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DashboardService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DashboardService = _classThis;
}();
exports.DashboardService = DashboardService;
