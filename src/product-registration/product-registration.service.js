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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.ProductRegistrationService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var crypto_1 = require("crypto");
var fs_1 = require("fs");
var path_1 = require("path");
var exceljs_1 = require("exceljs");
var certification_dates_util_1 = require("./helpers/certification-dates.util");
var admin_list_valid_till_filter_util_1 = require("./helpers/admin-list-valid-till-filter.util");
var format_admin_certified_product_patch_util_1 = require("./helpers/format-admin-certified-product-patch.util");
var format_process_final_review_util_1 = require("./helpers/format-process-final-review.util");
var process_comments_payload_util_1 = require("../process-comments/helpers/process-comments-payload.util");
var process_comments_lock_util_1 = require("../process-comments/helpers/process-comments-lock.util");
var admin_products_export_util_1 = require("./helpers/admin-products-export.util");
var eoi_number_service_1 = require("./services/eoi-number.service");
var active_product_filter_1 = require("./constants/active-product.filter");
var expired_product_filter_1 = require("./constants/expired-product.filter");
var website_public_product_filter_1 = require("./constants/website-public-product.filter");
var public_website_manufacturer_visibility_filter_1 = require("../manufacturers/constants/public-website-manufacturer-visibility.filter");
var invalidate_product_listings_cache_util_1 = require("./helpers/invalidate-product-listings-cache.util");
var activity_lifecycle_constants_1 = require("../activity-log/activity-lifecycle.constants");
var payment_response_util_1 = require("../payments/payment-response.util");
var document_section_key_constants_1 = require("../common/constants/document-section-key.constants");
var consolidate_urn_detail_items_util_1 = require("./utils/consolidate-urn-detail-items.util");
var urn_renew_process_documents_util_1 = require("./utils/urn-renew-process-documents.util");
var raw_materials_hazardous_display_util_1 = require("../common/raw-materials/raw-materials-hazardous-display.util");
var raw_materials_upload_util_1 = require("../common/raw-materials/raw-materials-upload.util");
var urn_lookup_match_util_1 = require("./utils/urn-lookup-match.util");
var product_name_uniqueness_util_1 = require("./helpers/product-name-uniqueness.util");
var mp_energy_consumption_calculations_util_1 = require("../process-mp-manufacturing-units/utils/mp-energy-consumption-calculations.util");
var mp_manufacturing_weighted_totals_util_1 = require("../process-mp-manufacturing-units/utils/mp-manufacturing-weighted-totals.util");
var wm_waste_disposal_calculations_util_1 = require("../process-wm-manufacturing-units/utils/wm-waste-disposal-calculations.util");
var upload_file_util_1 = require("../utils/upload-file.util");
var product_status_constants_1 = require("../renew/constants/product-status.constants");
var renewal_urn_status_constants_1 = require("../renew/constants/renewal-urn-status.constants");
var renewal_urn_status_constants_2 = require("../renew/constants/renewal-urn-status.constants");
var urn_tab_review_constants_1 = require("./constants/urn-tab-review.constants");
var category_change_constants_1 = require("./constants/category-change.constants");
var category_change_util_1 = require("./helpers/category-change.util");
var vendor_product_list_pagination_util_1 = require("./helpers/vendor-product-list-pagination.util");
var vendor_plant_merge_status_util_1 = require("./plant-merge/helpers/vendor-plant-merge-status.util");
var ProductRegistrationService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProductRegistrationService = _classThis = /** @class */ (function () {
        function ProductRegistrationService_1(productModel, productPlantModel, categoryModel, manufacturerModel, vendorProductChangeRequestModel, plantMergeAuditModel, connection, sequenceHelper, eoiNumberService, manufacturersService, countriesService, sectorsService, statesService, productRegistrationWorkflowService, configService, redisService, urnSiteVisitsService, lifecycleNotification, urnTabReviewService, categoryChangeCleanupService, zohoDealsService, emailService) {
            this.productModel = productModel;
            this.productPlantModel = productPlantModel;
            this.categoryModel = categoryModel;
            this.manufacturerModel = manufacturerModel;
            this.vendorProductChangeRequestModel = vendorProductChangeRequestModel;
            this.plantMergeAuditModel = plantMergeAuditModel;
            this.connection = connection;
            this.sequenceHelper = sequenceHelper;
            this.eoiNumberService = eoiNumberService;
            this.manufacturersService = manufacturersService;
            this.countriesService = countriesService;
            this.sectorsService = sectorsService;
            this.statesService = statesService;
            this.productRegistrationWorkflowService = productRegistrationWorkflowService;
            this.configService = configService;
            this.redisService = redisService;
            this.urnSiteVisitsService = urnSiteVisitsService;
            this.lifecycleNotification = lifecycleNotification;
            this.urnTabReviewService = urnTabReviewService;
            this.categoryChangeCleanupService = categoryChangeCleanupService;
            this.zohoDealsService = zohoDealsService;
            this.emailService = emailService;
            this.logger = new common_1.Logger(ProductRegistrationService.name);
            this.exportJobs = new Map();
            this.exportDir = (0, path_1.join)(process.cwd(), 'uploads', 'exports');
            this.exportTtlMs = 24 * 60 * 60 * 1000;
            this.exportMaxRows = 200000;
        }
        ProductRegistrationService_1.prototype.syncUrnProductsToZohoDeal = function (urnNo, manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var normalizedUrn, products;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            normalizedUrn = String(urnNo !== null && urnNo !== void 0 ? urnNo : '').trim();
                            if (!normalizedUrn)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.productModel
                                    .find((0, active_product_filter_1.matchActiveProducts)({ urnNo: normalizedUrn }))
                                    .select('productName productDetails')
                                    .sort({ createdDate: 1, productId: 1 })
                                    .lean()
                                    .exec()];
                        case 1:
                            products = _a.sent();
                            return [4 /*yield*/, this.zohoDealsService.syncDealProducts({
                                    manufacturerId: manufacturerId.toString(),
                                    urnNo: normalizedUrn,
                                    products: products.map(function (product) {
                                        var _a, _b;
                                        return ({
                                            productName: String((_a = product.productName) !== null && _a !== void 0 ? _a : '').trim(),
                                            productDetail: String((_b = product.productDetails) !== null && _b !== void 0 ? _b : '').trim(),
                                        });
                                    }),
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.syncDocumentReviewedStatusToZohoDeal = function (urnNo, manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.zohoDealsService.updateDealStatus({
                                manufacturerId: manufacturerId.toString(),
                                status: 'Document Reviewed',
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.getProductListCacheTtlSeconds = function () {
            var ttl = parseInt(this.configService.get('PRODUCT_LIST_CACHE_TTL_SECONDS') ||
                this.configService.get('CACHE_TTL_SECONDS') ||
                '60', 10);
            return Number.isFinite(ttl) && ttl > 0 ? ttl : 60;
        };
        ProductRegistrationService_1.prototype.resolveVendorListProductStatuses = function (dto) {
            var _a;
            var fromList = Array.isArray(dto.productStatusList) && dto.productStatusList.length > 0
                ? dto.productStatusList
                : Array.isArray(dto.product_status_list) &&
                    dto.product_status_list.length > 0
                    ? dto.product_status_list
                    : null;
            if (fromList) {
                return fromList;
            }
            var single = (_a = dto.productStatus) !== null && _a !== void 0 ? _a : dto.status;
            if (single !== undefined &&
                single !== null &&
                Number.isFinite(Number(single))) {
                return [Number(single)];
            }
            return null;
        };
        /**
         * Plant state **name** substring filter for vendor EOI list: `state_name`, or `state` when not an ObjectId.
         */
        ProductRegistrationService_1.prototype.resolveVendorListPlantStateNameSearch = function (dto) {
            var explicit = dto.state_name != null ? String(dto.state_name).trim() : '';
            if (explicit) {
                return explicit;
            }
            var st = dto.state != null ? String(dto.state).trim() : '';
            if (st && !/^[a-fA-F0-9]{24}$/.test(st)) {
                return st;
            }
            return undefined;
        };
        ProductRegistrationService_1.prototype.resolveVendorListCountryId = function (dto) {
            var _a;
            var raw = (_a = dto.countryId) !== null && _a !== void 0 ? _a : dto.country_id;
            var countryId = raw != null ? String(raw).trim() : '';
            return countryId || undefined;
        };
        ProductRegistrationService_1.prototype.resolveVendorListCitySearch = function (dto) {
            var _a;
            var raw = (_a = dto.city) !== null && _a !== void 0 ? _a : dto.city_name;
            var city = raw != null ? String(raw).trim() : '';
            return city || undefined;
        };
        /**
         * Product ids for this vendor whose plants match country / state name / city filters.
         * Returns `null` when no location filters are set.
         */
        ProductRegistrationService_1.prototype.findVendorProductIdsByPlantLocationFilters = function (manufacturerId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var countryId, stateSearch, citySearch, actorObjectId, plantMatch, pipeline, postMatchParts, rows;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            countryId = this.resolveVendorListCountryId(dto);
                            stateSearch = this.resolveVendorListPlantStateNameSearch(dto);
                            citySearch = this.resolveVendorListCitySearch(dto);
                            if (!countryId && !stateSearch && !citySearch) {
                                return [2 /*return*/, null];
                            }
                            actorObjectId = this.toObjectId(manufacturerId, 'manufacturerId');
                            plantMatch = __assign(__assign({}, (0, active_product_filter_1.matchActiveProductPlants)()), { $or: [{ manufacturerId: actorObjectId }, { vendorId: actorObjectId }] });
                            if (countryId) {
                                plantMatch.countryId = this.toObjectId(countryId, 'countryId');
                            }
                            pipeline = [
                                { $match: plantMatch },
                                {
                                    $lookup: {
                                        from: 'states',
                                        localField: 'stateId',
                                        foreignField: '_id',
                                        as: 'st',
                                    },
                                },
                                {
                                    $unwind: {
                                        path: '$st',
                                        preserveNullAndEmptyArrays: true,
                                    },
                                },
                                {
                                    $addFields: {
                                        stateName: {
                                            $ifNull: [
                                                '$st.stateName',
                                                { $ifNull: ['$st.state_name', '$st.name'] },
                                            ],
                                        },
                                    },
                                },
                            ];
                            postMatchParts = [];
                            if (stateSearch) {
                                postMatchParts.push({
                                    stateName: new RegExp(this.escapeRegexLiteral(stateSearch), 'i'),
                                });
                            }
                            if (citySearch) {
                                postMatchParts.push({
                                    city: new RegExp(this.escapeRegexLiteral(citySearch), 'i'),
                                });
                            }
                            if (postMatchParts.length > 0) {
                                pipeline.push({
                                    $match: postMatchParts.length === 1
                                        ? postMatchParts[0]
                                        : { $and: postMatchParts },
                                });
                            }
                            pipeline.push({ $group: { _id: '$productId' } });
                            return [4 /*yield*/, this.productPlantModel.aggregate(pipeline).exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, rows.map(function (row) { return row._id; })];
                    }
                });
            });
        };
        /**
         * Countries dropdown + UI hints for vendor uncertified (EOI) list location filters.
         */
        ProductRegistrationService_1.prototype.vendorGetUncertifiedListFilterOptions = function () {
            return __awaiter(this, void 0, void 0, function () {
                var countryOptions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.countriesService.buildDropdownOptions()];
                        case 1:
                            countryOptions = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Filter options retrieved successfully',
                                    data: {
                                        countries: countryOptions,
                                        countriesTotal: countryOptions.length,
                                        filterControls: {
                                            countryId: {
                                                type: 'dropdown',
                                                label: 'Country',
                                                queryParam: 'countryId',
                                                optionsKey: 'countries',
                                            },
                                            state: {
                                                type: 'text',
                                                label: 'State',
                                                queryParam: 'state',
                                                placeholder: 'Search by state name',
                                            },
                                            city: {
                                                type: 'text',
                                                label: 'City',
                                                queryParam: 'city',
                                                placeholder: 'Search by city',
                                            },
                                        },
                                    },
                                }];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.buildVendorProductListCacheKey = function (listProductsDto, manufacturerId) {
            var _a, _b, _c, _d, _e, _f;
            var resolvedForKey = this.resolveVendorListProductStatuses(listProductsDto);
            var normalized = {
                manufacturerId: manufacturerId,
                page: (_a = listProductsDto.page) !== null && _a !== void 0 ? _a : 1,
                limit: (_b = listProductsDto.limit) !== null && _b !== void 0 ? _b : 20,
                search: String(listProductsDto.search || '').trim().toLowerCase(),
                productStatuses: resolvedForKey === null
                    ? 'default_0_1'
                    : __spreadArray([], resolvedForKey, true).sort(function (a, b) { return a - b; }),
                categoryId: (_c = listProductsDto.categoryId) !== null && _c !== void 0 ? _c : null,
                dateFrom: (_d = listProductsDto.dateFrom) !== null && _d !== void 0 ? _d : null,
                dateTo: (_e = listProductsDto.dateTo) !== null && _e !== void 0 ? _e : null,
                countryId: (_f = this.resolveVendorListCountryId(listProductsDto)) !== null && _f !== void 0 ? _f : null,
                state: String(this.resolveVendorListPlantStateNameSearch(listProductsDto) || '')
                    .trim()
                    .toLowerCase(),
                city: String(this.resolveVendorListCitySearch(listProductsDto) || '')
                    .trim()
                    .toLowerCase(),
                sort: listProductsDto.sort === 'asc' ? 'asc' : 'desc',
                v: 7,
            };
            return this.redisService.buildKey('products', 'list', 'vendor', JSON.stringify(normalized));
        };
        ProductRegistrationService_1.prototype.buildAdminProductListCacheKey = function (dto) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14;
            var resolvedStatus = (function () {
                for (var _i = 0, _a = [dto.status, dto.productStatus, dto.product_status]; _i < _a.length; _i++) {
                    var c = _a[_i];
                    if (Array.isArray(c) && c.length > 0) {
                        return __spreadArray([], c, true).sort(function (a, b) { return a - b; });
                    }
                }
                return [];
            })();
            var normalized = {
                page: (_a = dto.page) !== null && _a !== void 0 ? _a : 1,
                limit: (_b = dto.limit) !== null && _b !== void 0 ? _b : 10,
                order: ((_c = dto.order) !== null && _c !== void 0 ? _c : dto.sortOrder) === 'asc' ? 'asc' : 'desc',
                sortBy: (_d = dto.sortBy) !== null && _d !== void 0 ? _d : 'createdDate',
                groupBy: (_e = dto.groupBy) !== null && _e !== void 0 ? _e : 'manufacturer',
                search: String(dto.search || '').trim().toLowerCase(),
                product_type: (_f = dto.product_type) !== null && _f !== void 0 ? _f : null,
                categoryId: (_g = dto.categoryId) !== null && _g !== void 0 ? _g : null,
                categoryIds: (_j = (_h = this.resolveAdminListCategoryIds(dto)) === null || _h === void 0 ? void 0 : _h.join(',')) !== null && _j !== void 0 ? _j : null,
                manufacturerId: (_k = dto.manufacturerId) !== null && _k !== void 0 ? _k : null,
                manufacturerIds: (_m = (_l = this.resolveAdminListManufacturerIds(dto)) === null || _l === void 0 ? void 0 : _l.join(',')) !== null && _m !== void 0 ? _m : null,
                manufacturerNames: (_p = (_o = this.resolveAdminListManufacturerNames(dto)) === null || _o === void 0 ? void 0 : _o.join('|')) !== null && _p !== void 0 ? _p : null,
                countryId: (_q = this.resolveAdminListCountryId(dto)) !== null && _q !== void 0 ? _q : null,
                stateId: (_r = this.resolveAdminListPlantStateObjectId(dto)) !== null && _r !== void 0 ? _r : null,
                stateIds: (_t = (_s = this.resolveAdminListPlantStateObjectIds(dto)) === null || _s === void 0 ? void 0 : _s.join(',')) !== null && _t !== void 0 ? _t : null,
                stateNames: (_v = (_u = this.resolveAdminListPlantStateNames(dto)) === null || _u === void 0 ? void 0 : _u.join('|')) !== null && _v !== void 0 ? _v : null,
                state_name: String(dto.state_name || '').trim().toLowerCase(),
                stateLegacy: (function () {
                    var s = dto.state != null ? String(dto.state).trim() : '';
                    if (!s || /^[a-fA-F0-9]{24}$/.test(s))
                        return null;
                    return s.toLowerCase();
                })(),
                city: String(dto.city || '').trim().toLowerCase(),
                cities: (_x = (_w = this.resolveAdminListCities(dto)) === null || _w === void 0 ? void 0 : _w.join('|')) !== null && _x !== void 0 ? _x : null,
                from: (_z = (_y = dto.from) !== null && _y !== void 0 ? _y : dto.fromDate) !== null && _z !== void 0 ? _z : null,
                to: (_1 = (_0 = dto.to) !== null && _0 !== void 0 ? _0 : dto.toDate) !== null && _1 !== void 0 ? _1 : null,
                validTillYear: (_3 = (_2 = dto.validTillYear) !== null && _2 !== void 0 ? _2 : dto.valid_till_year) !== null && _3 !== void 0 ? _3 : null,
                validTillYears: (_5 = (_4 = this.resolveAdminListValidTillYears(dto)) === null || _4 === void 0 ? void 0 : _4.join(',')) !== null && _5 !== void 0 ? _5 : null,
                validTillMonth: (_7 = (_6 = dto.validTillMonth) !== null && _6 !== void 0 ? _6 : dto.valid_till_month) !== null && _7 !== void 0 ? _7 : null,
                validTillMonthYear: (_8 = this.resolveAdminListValidTillMonthYear(dto)) !== null && _8 !== void 0 ? _8 : null,
                validTillFrom: (_10 = (_9 = dto.validTillFrom) !== null && _9 !== void 0 ? _9 : dto.valid_till_from) !== null && _10 !== void 0 ? _10 : null,
                validTillTo: (_12 = (_11 = dto.validTillTo) !== null && _11 !== void 0 ? _11 : dto.valid_till_to) !== null && _12 !== void 0 ? _12 : null,
                sectorIds: (_14 = (_13 = this.resolveAdminListSectorIds(dto)) === null || _13 === void 0 ? void 0 : _13.join(',')) !== null && _14 !== void 0 ? _14 : null,
                status: resolvedStatus,
                urnStatuses: (function () {
                    for (var _i = 0, _a = [dto.urnStatuses, dto.urnStatus, dto.urn_status]; _i < _a.length; _i++) {
                        var c = _a[_i];
                        if (Array.isArray(c) && c.length > 0) {
                            return __spreadArray([], c, true).map(function (s) { return Number(s); }).filter(function (s) { return Number.isFinite(s); }).sort(function (a, b) { return a - b; }).join(',');
                        }
                    }
                    return null;
                })(),
                v: 16,
            };
            return this.redisService.buildKey('products', 'list', 'admin', JSON.stringify(normalized));
        };
        ProductRegistrationService_1.prototype.invalidateProductListingsCache = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, invalidate_product_listings_cache_util_1.invalidateProductListingsCache)(this.redisService, this.logger)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Distinct URN + EOI counts for a manufacturer scoped to one category (admin list totals). */
        ProductRegistrationService_1.prototype.countManufacturerCategoryTotals = function (manufacturerId, categoryId) {
            return __awaiter(this, void 0, void 0, function () {
                var match, _a, urnNos, total_eois;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            match = (0, active_product_filter_1.matchActiveProducts)({
                                manufacturerId: manufacturerId,
                                categoryId: categoryId,
                            });
                            return [4 /*yield*/, Promise.all([
                                    this.productModel.distinct('urnNo', match).exec(),
                                    this.productModel.countDocuments(match).exec(),
                                ])];
                        case 1:
                            _a = _b.sent(), urnNos = _a[0], total_eois = _a[1];
                            return [2 /*return*/, {
                                    total_urns: urnNos.filter(function (urn) { return String(urn !== null && urn !== void 0 ? urn : '').trim(); }).length,
                                    total_eois: total_eois,
                                }];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.toMongoIdString = function (value) {
            if (value === undefined || value === null) {
                return undefined;
            }
            return String(value);
        };
        /** Multipart form flags (`1`, `true`, `yes`, `on`) sent as strings. */
        ProductRegistrationService_1.prototype.multipartTruthy = function (value) {
            var v = String(value !== null && value !== void 0 ? value : '').trim().toLowerCase();
            return v === '1' || v === 'true' || v === 'yes' || v === 'on';
        };
        ProductRegistrationService_1.prototype.normalizeUrnForCompare = function (urn) {
            return String(urn !== null && urn !== void 0 ? urn : '')
                .trim()
                .replace(/\/+$/g, '');
        };
        ProductRegistrationService_1.prototype.urnValuesMatch = function (stored, provided) {
            var normalizedStored = this.normalizeUrnForCompare(stored !== null && stored !== void 0 ? stored : '');
            var normalizedProvided = this.normalizeUrnForCompare(provided);
            if (!normalizedStored || !normalizedProvided) {
                return false;
            }
            return (normalizedStored === normalizedProvided ||
                "".concat(normalizedStored, "/") === normalizedProvided ||
                normalizedStored === "".concat(normalizedProvided, "/"));
        };
        /** Plant state Mongo id: `stateId` wins, else `state` when it is a 24-char hex id. */
        ProductRegistrationService_1.prototype.resolveAdminListPlantStateObjectId = function (dto) {
            for (var _i = 0, _a = [dto.stateId, dto.state]; _i < _a.length; _i++) {
                var raw = _a[_i];
                var s = raw != null ? String(raw).trim() : '';
                if (s && /^[a-fA-F0-9]{24}$/.test(s)) {
                    return s;
                }
            }
            return undefined;
        };
        /**
         * Plant state **name** substring filter: explicit `state_name`, or `state` when it is not an ObjectId.
         */
        ProductRegistrationService_1.prototype.resolveAdminListPlantStateNameSearch = function (dto) {
            var explicit = dto.state_name != null ? String(dto.state_name).trim() : '';
            if (explicit)
                return explicit;
            var st = dto.state != null ? String(dto.state).trim() : '';
            if (st && !/^[a-fA-F0-9]{24}$/.test(st)) {
                return st;
            }
            return undefined;
        };
        ProductRegistrationService_1.prototype.escapeRegexLiteral = function (value) {
            return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };
        ProductRegistrationService_1.prototype.resolveAdminListCategoryIds = function (dto) {
            var _a;
            var multi = (_a = dto.categoryIds) !== null && _a !== void 0 ? _a : dto.category_ids;
            var singles = [dto.categoryId, dto.category_id]
                .map(function (v) { return (v != null ? String(v).trim() : ''); })
                .filter(function (v) { return v.length > 0; });
            var fromMulti = Array.isArray(multi) && multi.length > 0
                ? multi.map(function (id) { return String(id).trim(); }).filter(function (id) { return id.length > 0; })
                : [];
            var merged = __spreadArray([], new Set(__spreadArray(__spreadArray([], fromMulti, true), singles, true)), true);
            return merged.length > 0 ? merged : null;
        };
        ProductRegistrationService_1.prototype.resolveAdminListManufacturerIds = function (dto) {
            var _a, _b;
            var multi = (_a = dto.manufacturerIds) !== null && _a !== void 0 ? _a : dto.manufacturer_ids;
            if (Array.isArray(multi) && multi.length > 0) {
                return multi;
            }
            var single = (_b = dto.manufacturerId) !== null && _b !== void 0 ? _b : dto.manufacturer_id;
            if (single) {
                return [single];
            }
            return null;
        };
        ProductRegistrationService_1.prototype.resolveAdminListManufacturerNames = function (dto) {
            var _a;
            var multi = (_a = dto.manufacturerNames) !== null && _a !== void 0 ? _a : dto.manufacturer_names;
            if (!Array.isArray(multi) || multi.length === 0) {
                return null;
            }
            var names = multi.map(function (n) { return String(n).trim(); }).filter(function (n) { return n.length > 0; });
            return names.length > 0 ? names : null;
        };
        ProductRegistrationService_1.prototype.resolveAdminListPlantStateObjectIds = function (dto) {
            var _a;
            var multi = (_a = dto.stateIds) !== null && _a !== void 0 ? _a : dto.state_ids;
            if (Array.isArray(multi) && multi.length > 0) {
                return multi;
            }
            var single = this.resolveAdminListPlantStateObjectId(dto);
            return single ? [single] : null;
        };
        ProductRegistrationService_1.prototype.resolveAdminListPlantStateNames = function (dto) {
            var _a;
            var multi = (_a = dto.stateNames) !== null && _a !== void 0 ? _a : dto.state_names;
            if (Array.isArray(multi) && multi.length > 0) {
                var names = multi.map(function (n) { return String(n).trim(); }).filter(function (n) { return n.length > 0; });
                return names.length > 0 ? names : null;
            }
            var single = this.resolveAdminListPlantStateNameSearch(dto);
            return single ? [single] : null;
        };
        ProductRegistrationService_1.prototype.resolveAdminListCountryId = function (dto) {
            var _a;
            var raw = (_a = dto.countryId) !== null && _a !== void 0 ? _a : dto.country_id;
            var s = raw != null ? String(raw).trim() : '';
            return s || undefined;
        };
        ProductRegistrationService_1.prototype.resolveAdminListCities = function (dto) {
            var _a, _b;
            if (Array.isArray(dto.cities) && dto.cities.length > 0) {
                var cities = dto.cities
                    .map(function (c) { return String(c).trim(); })
                    .filter(function (c) { return c.length > 0; });
                return cities.length > 0 ? cities : null;
            }
            var city = String((_b = (_a = dto.city) !== null && _a !== void 0 ? _a : dto.city_name) !== null && _b !== void 0 ? _b : '').trim();
            if (city) {
                return [city];
            }
            return null;
        };
        ProductRegistrationService_1.prototype.resolveAdminListValidTillYears = function (dto) {
            var _a, _b;
            if ((0, admin_list_valid_till_filter_util_1.resolveAdminListValidTillMonthYearFilter)(dto)) {
                return null;
            }
            var multi = (_a = dto.validTillYears) !== null && _a !== void 0 ? _a : dto.valid_till_years;
            if (Array.isArray(multi) && multi.length > 0) {
                var years = __spreadArray([], new Set(multi.map(function (y) { return Number(y); }).filter(function (y) { return Number.isFinite(y); })), true);
                return years.length > 0 ? years : null;
            }
            if (dto.validTillYear !== undefined || dto.valid_till_year !== undefined) {
                var year = (_b = dto.validTillYear) !== null && _b !== void 0 ? _b : dto.valid_till_year;
                return year !== undefined ? [year] : null;
            }
            return null;
        };
        ProductRegistrationService_1.prototype.resolveAdminListValidTillMonthYear = function (dto) {
            var filter = (0, admin_list_valid_till_filter_util_1.resolveAdminListValidTillMonthYearFilter)(dto);
            return (filter === null || filter === void 0 ? void 0 : filter.kind) === 'single' ? filter.yearMonth : undefined;
        };
        /** Resolves sector / building filter from list DTO (multi list wins over single id). */
        ProductRegistrationService_1.prototype.resolveAdminListSectorIds = function (dto) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            var multi = (_d = (_c = (_b = (_a = dto.sectorIds) !== null && _a !== void 0 ? _a : dto.sector_ids) !== null && _b !== void 0 ? _b : dto.buildingIds) !== null && _c !== void 0 ? _c : dto.building_ids) !== null && _d !== void 0 ? _d : dto.buildings;
            if (Array.isArray(multi) && multi.length > 0) {
                var uniq = __spreadArray([], new Set(multi.map(function (n) { return Number(n); }).filter(function (n) { return Number.isFinite(n); })), true);
                return uniq.length > 0 ? uniq : null;
            }
            var single = (_h = (_g = (_f = (_e = dto.sectorId) !== null && _e !== void 0 ? _e : dto.sector_id) !== null && _f !== void 0 ? _f : dto.buildingId) !== null && _g !== void 0 ? _g : dto.building_id) !== null && _h !== void 0 ? _h : dto.building;
            if (single === undefined || single === null) {
                return null;
            }
            var n = Number(single);
            return Number.isFinite(n) ? [n] : null;
        };
        /** Admin list EOI row — flat fields only; product description is `productDetails` (string). */
        ProductRegistrationService_1.prototype.formatAdminListEoiEntry = function (e) {
            var _a, _b, _c, _d, _e, _f, _g;
            var plants = Array.isArray(e === null || e === void 0 ? void 0 : e.plants) ? e.plants : [];
            var mongoId = this.toMongoIdString(e === null || e === void 0 ? void 0 : e._id);
            var urnNo = (e === null || e === void 0 ? void 0 : e.urnNo) !== undefined && (e === null || e === void 0 ? void 0 : e.urnNo) !== null ? String(e.urnNo) : undefined;
            var productStatus = Number((_a = e === null || e === void 0 ? void 0 : e.productStatus) !== null && _a !== void 0 ? _a : 0);
            var urnWorkflowStatus = Number((_b = e === null || e === void 0 ? void 0 : e.urnStatus) !== null && _b !== void 0 ? _b : 0);
            var statusLabel = this.mapVendorProductStatusLabel(productStatus, e === null || e === void 0 ? void 0 : e.validtillDate);
            var sectorRaw = e === null || e === void 0 ? void 0 : e.sector;
            var sectorNum = sectorRaw === null || sectorRaw === undefined || sectorRaw === ''
                ? null
                : Number(sectorRaw);
            var sectorNameRaw = e === null || e === void 0 ? void 0 : e.sectorName;
            var categoryEditable = (0, category_change_util_1.isProductCategoryEditable)({
                productStatus: productStatus,
                urnStatus: urnWorkflowStatus,
            });
            var categoryChangeBlockReason = (0, category_change_util_1.resolveCategoryChangeBlockReason)({
                productStatus: productStatus,
                urnStatus: urnWorkflowStatus,
            });
            return {
                _id: mongoId,
                productMongoId: mongoId,
                productId: e === null || e === void 0 ? void 0 : e.productId,
                eoiNo: e === null || e === void 0 ? void 0 : e.eoiNo,
                urnNo: urnNo,
                urn_number: urnNo,
                productName: e === null || e === void 0 ? void 0 : e.productName,
                productDetails: (_c = e === null || e === void 0 ? void 0 : e.productDetails) !== null && _c !== void 0 ? _c : null,
                categoryName: e === null || e === void 0 ? void 0 : e.categoryName,
                manufacturerName: e === null || e === void 0 ? void 0 : e.manufacturerName,
                sector: sectorNum != null && Number.isFinite(sectorNum) ? sectorNum : null,
                sectorName: sectorNameRaw != null && String(sectorNameRaw).trim() !== ''
                    ? String(sectorNameRaw).trim()
                    : null,
                /** EOI lifecycle code on `products.productStatus` (this is what list `status` filters). */
                productStatus: productStatus,
                /** URN workflow step from `products.urnStatus` (separate from EOI productStatus). */
                urnWorkflowStatus: urnWorkflowStatus,
                /** Alias for urnWorkflowStatus — DB `products.urnStatus` (0–6+ workflow; use for category lock). */
                urnStatusCode: urnWorkflowStatus,
                urn_status: urnWorkflowStatus,
                createdDate: e === null || e === void 0 ? void 0 : e.createdDate,
                plantDetails: plants.map(function (p) {
                    var _a;
                    return ({
                        _id: p === null || p === void 0 ? void 0 : p._id,
                        productPlantId: p === null || p === void 0 ? void 0 : p.productPlantId,
                        productId: p === null || p === void 0 ? void 0 : p.productId,
                        plantName: p === null || p === void 0 ? void 0 : p.plantName,
                        plantLocation: p === null || p === void 0 ? void 0 : p.plantLocation,
                        countryId: p === null || p === void 0 ? void 0 : p.countryId,
                        stateId: p === null || p === void 0 ? void 0 : p.stateId,
                        stateName: (_a = p === null || p === void 0 ? void 0 : p.stateName) !== null && _a !== void 0 ? _a : null,
                        city: p === null || p === void 0 ? void 0 : p.city,
                        plantStatus: p === null || p === void 0 ? void 0 : p.plantStatus,
                        createdDate: p === null || p === void 0 ? void 0 : p.createdDate,
                    });
                }),
                statusLabel: statusLabel,
                categoryId: this.toMongoIdString(e === null || e === void 0 ? void 0 : e.categoryId),
                productImage: (e === null || e === void 0 ? void 0 : e.productImage) != null && String(e.productImage).trim() !== ''
                    ? String(e.productImage).trim()
                    : null,
                validtillDate: (_d = e === null || e === void 0 ? void 0 : e.validtillDate) !== null && _d !== void 0 ? _d : null,
                validTill: (_e = e === null || e === void 0 ? void 0 : e.validtillDate) !== null && _e !== void 0 ? _e : null,
                validTillDate: (_f = e === null || e === void 0 ? void 0 : e.validtillDate) !== null && _f !== void 0 ? _f : null,
                valid_till_date: (_g = e === null || e === void 0 ? void 0 : e.validtillDate) !== null && _g !== void 0 ? _g : null,
                categoryEditable: categoryEditable,
                categoryChangeBlockReason: categoryChangeBlockReason,
            };
        };
        /**
         * URN rollup from child EOI productStatus codes.
         * Returns numeric status code (0..4):
         * 0 Pending, 1 Submitted, 2 Certified, 3 Rejected, 4 Expired
         */
        ProductRegistrationService_1.prototype.deriveAdminUrnStatus = function (codes) {
            if (codes.includes(3))
                return 3;
            if (codes.includes(4))
                return 4;
            if (codes.includes(2))
                return 2;
            if (codes.includes(1))
                return 1;
            return 0;
        };
        ProductRegistrationService_1.prototype.mapUrnRollupStatusLabel = function (status) {
            switch (status) {
                case 1:
                    return 'Submitted';
                case 2:
                    return 'Certified';
                case 3:
                    return 'Rejected';
                case 4:
                    return 'Expired';
                default:
                    return 'Pending';
            }
        };
        ProductRegistrationService_1.prototype.resolveAdminListStatusFilter = function (dto) {
            for (var _i = 0, _a = [dto.status, dto.productStatus, dto.product_status]; _i < _a.length; _i++) {
                var c = _a[_i];
                if (Array.isArray(c) && c.length > 0) {
                    return c.map(function (s) { return Number(s); }).filter(function (s) { return Number.isFinite(s); });
                }
            }
            return [];
        };
        ProductRegistrationService_1.prototype.isAdminRejectedOnlyListFilter = function (dto) {
            var statuses = this.resolveAdminListStatusFilter(dto);
            var regularStatuses = statuses.filter(function (s) { return s !== 4; });
            return regularStatuses.length === 1 && regularStatuses[0] === 3;
        };
        ProductRegistrationService_1.prototype.enrichAdminRejectedListUrns = function (grouped) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNos, _a, certifiedRows, rejectedRows, certifiedByUrn, rejectedByUrn, _i, grouped_1, manufacturer, _b, _c, urn, urnNo, certifiedProductCount, rejectedProductCount, hasCertifiedProducts;
                var _d, _e, _f, _g, _h, _j;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0:
                            urnNos = __spreadArray([], new Set(grouped.flatMap(function (m) {
                                var _a;
                                return ((_a = m.urns) !== null && _a !== void 0 ? _a : [])
                                    .map(function (u) { var _a, _b; return String((_b = (_a = u.urnNo) !== null && _a !== void 0 ? _a : u.urn_number) !== null && _b !== void 0 ? _b : '').trim(); })
                                    .filter(Boolean);
                            })), true);
                            if (!urnNos.length) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.productModel
                                        .aggregate([
                                        {
                                            $match: __assign({ urnNo: { $in: urnNos }, productStatus: 2 }, (0, active_product_filter_1.matchActiveProducts)()),
                                        },
                                        { $group: { _id: '$urnNo', count: { $sum: 1 } } },
                                    ])
                                        .exec(),
                                    this.productModel
                                        .aggregate([
                                        {
                                            $match: __assign({ urnNo: { $in: urnNos }, productStatus: 3 }, (0, active_product_filter_1.matchActiveProducts)()),
                                        },
                                        { $group: { _id: '$urnNo', count: { $sum: 1 } } },
                                    ])
                                        .exec(),
                                ])];
                        case 1:
                            _a = _k.sent(), certifiedRows = _a[0], rejectedRows = _a[1];
                            certifiedByUrn = new Map(certifiedRows.map(function (row) { return [row._id, row.count]; }));
                            rejectedByUrn = new Map(rejectedRows.map(function (row) { return [row._id, row.count]; }));
                            for (_i = 0, grouped_1 = grouped; _i < grouped_1.length; _i++) {
                                manufacturer = grouped_1[_i];
                                for (_b = 0, _c = (_d = manufacturer.urns) !== null && _d !== void 0 ? _d : []; _b < _c.length; _b++) {
                                    urn = _c[_b];
                                    urnNo = String((_f = (_e = urn.urnNo) !== null && _e !== void 0 ? _e : urn.urn_number) !== null && _f !== void 0 ? _f : '').trim();
                                    certifiedProductCount = (_g = certifiedByUrn.get(urnNo)) !== null && _g !== void 0 ? _g : 0;
                                    rejectedProductCount = (_h = rejectedByUrn.get(urnNo)) !== null && _h !== void 0 ? _h : (Array.isArray(urn.eois) ? urn.eois.length : Number((_j = urn.totalEoi) !== null && _j !== void 0 ? _j : 0));
                                    hasCertifiedProducts = certifiedProductCount > 0;
                                    urn.hasCertifiedProducts = hasCertifiedProducts;
                                    urn.certifiedProductCount = certifiedProductCount;
                                    urn.rejectedProductCount = rejectedProductCount;
                                    urn.allowedTargets = hasCertifiedProducts
                                        ? ['certified']
                                        : ['uncertified'];
                                }
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.formatAdminListUrnGroup = function (urn) {
            var _this = this;
            var _a, _b;
            var eoiSummaryStatusCode = this.deriveAdminUrnStatus((_a = urn.statusCodes) !== null && _a !== void 0 ? _a : []);
            var eoiSummaryStatusLabel = this.mapUrnRollupStatusLabel(eoiSummaryStatusCode);
            var eois = ((_b = urn.eoiDocs) !== null && _b !== void 0 ? _b : []).map(function (e) {
                return _this.formatAdminListEoiEntry(e !== null && e !== void 0 ? e : {});
            });
            var workflowStatus = (function () {
                for (var _i = 0, eois_1 = eois; _i < eois_1.length; _i++) {
                    var e = eois_1[_i];
                    var code = Number((e === null || e === void 0 ? void 0 : e.urnWorkflowStatus) !== null && (e === null || e === void 0 ? void 0 : e.urnWorkflowStatus) !== undefined
                        ? e.urnWorkflowStatus
                        : e === null || e === void 0 ? void 0 : e.urnStatusCode);
                    if (Number.isFinite(code))
                        return code;
                }
                return null;
            })();
            return {
                urn_number: urn.urnNo,
                urnNo: urn.urnNo,
                total_eoi: urn.totalEoi,
                totalEoi: urn.totalEoi,
                /** Rollup from child EOI `productStatus` codes — not manufacturer / vendor status. */
                eoiSummaryStatus: eoiSummaryStatusLabel,
                eoiSummaryStatusCode: eoiSummaryStatusCode,
                eoiSummaryStatusLabel: eoiSummaryStatusLabel,
                /** @deprecated Same as `eoiSummaryStatus`; name is misleading (not DB `urnStatus`). */
                urnStatus: eoiSummaryStatusLabel,
                urnStatusCode: eoiSummaryStatusCode,
                urnStatusLabel: eoiSummaryStatusLabel,
                urnWorkflowStatus: workflowStatus,
                urn_workflow_status: workflowStatus,
                urn_status: workflowStatus,
                status: eoiSummaryStatusLabel,
                statusCode: eoiSummaryStatusCode,
                statusLabel: eoiSummaryStatusLabel,
                created_at: urn.createdDate,
                createdDate: urn.createdDate,
                eois: eois,
            };
        };
        ProductRegistrationService_1.prototype.formatRenewAdminListUrnGroup = function (urn) {
            var _this = this;
            var _a, _b;
            var workflowStatus = Number((_a = urn.urn_status) !== null && _a !== void 0 ? _a : 0);
            var urnStatusLabel = (0, renewal_urn_status_constants_2.isRenewalUrnStatus)(workflowStatus)
                ? (0, renewal_urn_status_constants_2.getRenewalUrnStatusLabel)(workflowStatus)
                : "URN status ".concat(workflowStatus);
            var eois = ((_b = urn.eoiDocs) !== null && _b !== void 0 ? _b : []).map(function (e) {
                return _this.formatAdminListEoiEntry(e !== null && e !== void 0 ? e : {});
            });
            return {
                urn_number: urn.urnNo,
                urnNo: urn.urnNo,
                total_eoi: urn.totalEoi,
                totalEoi: urn.totalEoi,
                urnStatus: workflowStatus,
                urn_status: workflowStatus,
                urnStatusCode: workflowStatus,
                urnStatusLabel: urnStatusLabel,
                status: urnStatusLabel,
                statusCode: workflowStatus,
                statusLabel: urnStatusLabel,
                created_at: urn.createdDate,
                createdDate: urn.createdDate,
                eois: eois,
            };
        };
        ProductRegistrationService_1.prototype.formatRenewAdminListManufacturerGroup = function (m) {
            var _this = this;
            var _a, _b, _c, _d, _e, _f, _g;
            var manufacturerName = String((_b = (_a = m.manufacturerName) !== null && _a !== void 0 ? _a : m.manufacturer_name) !== null && _b !== void 0 ? _b : '').trim() || 'Unknown Manufacturer';
            var email = String((_c = m.vendor_email) !== null && _c !== void 0 ? _c : '').trim();
            var phone = String((_d = m.vendor_phone) !== null && _d !== void 0 ? _d : '').trim();
            var urns = ((_e = m.urns) !== null && _e !== void 0 ? _e : [])
                .map(function (u) { return _this.formatRenewAdminListUrnGroup(u); })
                .sort(function (a, b) {
                return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
            });
            return {
                manufacturer_id: String(m.manufacturer_id),
                manufacturerName: manufacturerName,
                manufacturer_name: manufacturerName,
                vendor_email: email,
                vendor_phone: phone,
                email: email,
                phone: phone,
                total_urns: (_f = m.total_urns) !== null && _f !== void 0 ? _f : 0,
                total_eois: (_g = m.total_eois) !== null && _g !== void 0 ? _g : 0,
                urns: urns,
            };
        };
        ProductRegistrationService_1.prototype.formatAdminListManufacturerGroup = function (m) {
            var _this = this;
            var _a, _b, _c, _d, _e, _f, _g;
            var urns = ((_a = m.urns) !== null && _a !== void 0 ? _a : [])
                .map(function (u) { return _this.formatAdminListUrnGroup(u); })
                .sort(function (a, b) {
                return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
            });
            var manufacturerName = String((_c = (_b = m.manufacturerName) !== null && _b !== void 0 ? _b : m.manufacturer_name) !== null && _c !== void 0 ? _c : '').trim();
            var email = String((_d = m.vendor_email) !== null && _d !== void 0 ? _d : '').trim();
            var phone = String((_e = m.vendor_phone) !== null && _e !== void 0 ? _e : '').trim();
            return {
                manufacturer_id: String(m.manufacturer_id),
                manufacturerName: manufacturerName,
                /** @deprecated Use manufacturerName — kept for older admin clients */
                manufacturer_name: manufacturerName,
                vendor_email: email,
                vendor_phone: phone,
                email: email,
                phone: phone,
                total_urns: (_f = m.total_urns) !== null && _f !== void 0 ? _f : 0,
                total_eois: (_g = m.total_eois) !== null && _g !== void 0 ? _g : 0,
                urns: urns,
            };
        };
        ProductRegistrationService_1.prototype.mapProductDetailsVendorContactSlot = function (slot) {
            var _a, _b, _c, _d;
            if (!slot) {
                return {
                    name: '',
                    email_id: '',
                    phone_number: '',
                    designation: '',
                };
            }
            return {
                name: String((_a = slot.name) !== null && _a !== void 0 ? _a : '').trim(),
                email_id: String((_b = slot.email_id) !== null && _b !== void 0 ? _b : '').trim(),
                phone_number: String((_c = slot.phone_number) !== null && _c !== void 0 ? _c : '').trim(),
                designation: String((_d = slot.designation) !== null && _d !== void 0 ? _d : '').trim(),
            };
        };
        /**
         * Manufacturer + vendor org profile for URN product details (admin / vendor).
         * Vendor contact fields live on the manufacturers collection.
         */
        ProductRegistrationService_1.prototype.formatCategoryForUrnDetails = function (category) {
            return (0, category_change_util_1.formatCategoryWithRawMaterialVisibility)(category);
        };
        ProductRegistrationService_1.prototype.formatProductDetailsPlants = function (plants) {
            return (plants !== null && plants !== void 0 ? plants : []).map(function (p) {
                var _a, _b, _c, _d, _e, _f;
                var stateDoc = Array.isArray(p.state)
                    ? p.state[0]
                    : p.state;
                var countryDoc = Array.isArray(p.country)
                    ? p.country[0]
                    : p.country;
                return {
                    _id: p._id,
                    productPlantId: p.productPlantId,
                    productId: p.productId,
                    vendorId: p.vendorId,
                    categoryId: p.categoryId,
                    manufacturerId: p.manufacturerId,
                    urnNo: p.urnNo,
                    eoiNo: p.eoiNo,
                    plantName: p.plantName,
                    plantLocation: p.plantLocation,
                    countryId: p.countryId,
                    stateId: p.stateId,
                    city: p.city,
                    plantStatus: p.plantStatus,
                    stateName: (_c = (_b = (_a = stateDoc === null || stateDoc === void 0 ? void 0 : stateDoc.stateName) !== null && _a !== void 0 ? _a : stateDoc === null || stateDoc === void 0 ? void 0 : stateDoc.name) !== null && _b !== void 0 ? _b : p.stateName) !== null && _c !== void 0 ? _c : null,
                    countryName: (_f = (_e = (_d = countryDoc === null || countryDoc === void 0 ? void 0 : countryDoc.countryName) !== null && _d !== void 0 ? _d : countryDoc === null || countryDoc === void 0 ? void 0 : countryDoc.name) !== null && _e !== void 0 ? _e : p.countryName) !== null && _f !== void 0 ? _f : null,
                    createdDate: p.createdDate,
                };
            });
        };
        ProductRegistrationService_1.prototype.buildProductPlantsLookupStage = function (options) {
            var enrichPlantsWithGeo = options.enrichPlantsWithGeo, _a = options.matchPlantsByUrn, matchPlantsByUrn = _a === void 0 ? false : _a;
            var productMatchExpr = matchPlantsByUrn
                ? {
                    $or: [
                        { $eq: ['$productId', '$$productId'] },
                        { $eq: ['$urnNo', '$$urnNo'] },
                    ],
                }
                : { $eq: ['$productId', '$$productId'] };
            var plantMatchStages = [
                {
                    $match: {
                        $expr: {
                            $and: [productMatchExpr, { $ne: ['$is_deleted', true] }],
                        },
                    },
                },
                { $sort: { createdDate: 1 } },
            ];
            if (enrichPlantsWithGeo) {
                plantMatchStages.push({
                    $lookup: {
                        from: 'states',
                        localField: 'stateId',
                        foreignField: '_id',
                        as: 'state',
                    },
                }, {
                    $lookup: {
                        from: 'countries',
                        localField: 'countryId',
                        foreignField: '_id',
                        as: 'country',
                    },
                });
            }
            return {
                $lookup: {
                    from: 'product_plants',
                    let: { productId: '$_id', urnNo: '$urnNo' },
                    pipeline: plantMatchStages,
                    as: 'plants',
                },
            };
        };
        /** Active product_plants for a URN with states/countries (admin renew / quick view). */
        ProductRegistrationService_1.prototype.listProductPlantsWithGeoForUrn = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmed, rows;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmed = urnNo.trim();
                            if (!trimmed) {
                                return [2 /*return*/, []];
                            }
                            return [4 /*yield*/, this.productPlantModel
                                    .aggregate([
                                    { $match: (0, active_product_filter_1.matchActiveProductPlants)({ urnNo: trimmed }) },
                                    {
                                        $lookup: {
                                            from: 'states',
                                            localField: 'stateId',
                                            foreignField: '_id',
                                            as: 'state',
                                        },
                                    },
                                    {
                                        $lookup: {
                                            from: 'countries',
                                            localField: 'countryId',
                                            foreignField: '_id',
                                            as: 'country',
                                        },
                                    },
                                    { $sort: { createdDate: 1 } },
                                ])
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, this.formatProductDetailsPlants(rows)];
                    }
                });
            });
        };
        /**
         * Manufacturer + plants for a URN (used when aggregation rows are missing joins).
         */
        ProductRegistrationService_1.prototype.getManufacturerAndPlantsForUrn = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmed, plants, product, manufacturerId, manufacturer, doc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmed = urnNo.trim();
                            return [4 /*yield*/, this.listProductPlantsWithGeoForUrn(trimmed)];
                        case 1:
                            plants = _a.sent();
                            return [4 /*yield*/, this.productModel
                                    .findOne((0, active_product_filter_1.matchActiveProducts)({ urnNo: trimmed }))
                                    .select('manufacturerId')
                                    .lean()
                                    .exec()];
                        case 2:
                            product = _a.sent();
                            manufacturerId = product === null || product === void 0 ? void 0 : product.manufacturerId;
                            manufacturer = null;
                            if (!manufacturerId) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.manufacturerModel.findById(manufacturerId).lean().exec()];
                        case 3:
                            doc = _a.sent();
                            manufacturer = this.formatProductDetailsManufacturer(doc);
                            _a.label = 4;
                        case 4: return [2 /*return*/, {
                                manufacturer: manufacturer,
                                manufacturing_details: manufacturer,
                                plants: plants,
                            }];
                    }
                });
            });
        };
        /**
         * Ensures renew/cert URN detail rows include joined manufacturer and product_plants.
         */
        ProductRegistrationService_1.prototype.enrichUrnDetailRowsWithManufacturerAndPlants = function (urnNo, rows) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, urnPlants, _a, sharedManufacturer, _i, rows_1, row, formatted, urnBundle;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!rows.length) {
                                return [2 /*return*/, rows];
                            }
                            trimmedUrn = urnNo.trim();
                            if (!trimmedUrn) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.listProductPlantsWithGeoForUrn(trimmedUrn)];
                        case 1:
                            _a = _b.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = [];
                            _b.label = 3;
                        case 3:
                            urnPlants = _a;
                            sharedManufacturer = null;
                            for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                                row = rows_1[_i];
                                formatted = this.formatProductDetailsManufacturer(row.manufacturer);
                                if (formatted === null || formatted === void 0 ? void 0 : formatted.manufacturerName) {
                                    sharedManufacturer = formatted;
                                    break;
                                }
                            }
                            if (!!sharedManufacturer) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.getManufacturerAndPlantsForUrn(trimmedUrn)];
                        case 4:
                            urnBundle = _b.sent();
                            sharedManufacturer = urnBundle.manufacturer;
                            _b.label = 5;
                        case 5: return [2 /*return*/, rows.map(function (row) {
                                var _a, _b, _c;
                                var pd = row.product_details;
                                var productOid = (_a = pd === null || pd === void 0 ? void 0 : pd._id) !== null && _a !== void 0 ? _a : row._id;
                                var eoiNo = (_b = pd === null || pd === void 0 ? void 0 : pd.eoiNo) !== null && _b !== void 0 ? _b : row.eoiNo;
                                var existingPlants = row.plants;
                                var plants = [];
                                if (urnPlants.length > 0) {
                                    if (rows.length === 1) {
                                        plants = urnPlants;
                                    }
                                    else {
                                        var filtered = urnPlants.filter(function (plant) {
                                            if (productOid && String(plant.productId) === String(productOid)) {
                                                return true;
                                            }
                                            if (eoiNo && String(plant.eoiNo) === String(eoiNo)) {
                                                return true;
                                            }
                                            return false;
                                        });
                                        plants = filtered.length > 0 ? filtered : urnPlants;
                                    }
                                }
                                else if (Array.isArray(existingPlants) && existingPlants.length > 0) {
                                    plants = existingPlants;
                                }
                                var rowManufacturer = _this.formatProductDetailsManufacturer(row.manufacturer);
                                var manufacturer = (rowManufacturer === null || rowManufacturer === void 0 ? void 0 : rowManufacturer.manufacturerName) != null &&
                                    String(rowManufacturer.manufacturerName).trim() !== ''
                                    ? rowManufacturer
                                    : sharedManufacturer;
                                return __assign(__assign({}, row), { manufacturer: manufacturer !== null && manufacturer !== void 0 ? manufacturer : null, manufacturing_details: (_c = manufacturer !== null && manufacturer !== void 0 ? manufacturer : row.manufacturing_details) !== null && _c !== void 0 ? _c : null, plants: plants, plant_details: plants });
                            })];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.formatProductDetailsManufacturer = function (manufacturer) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31;
            if (!manufacturer) {
                return null;
            }
            var technicalContact = this.mapProductDetailsVendorContactSlot(manufacturer.technicalContact);
            var marketingContact = this.mapProductDetailsVendorContactSlot(manufacturer.marketingContact);
            var vendor_details = {
                companyName: String((_a = manufacturer.manufacturerName) !== null && _a !== void 0 ? _a : '').trim(),
                name: String((_b = manufacturer.vendor_name) !== null && _b !== void 0 ? _b : '').trim(),
                designation: String((_c = manufacturer.vendor_designation) !== null && _c !== void 0 ? _c : '').trim(),
                email: String((_d = manufacturer.vendor_email) !== null && _d !== void 0 ? _d : '').trim(),
                vendor_email: String((_e = manufacturer.vendor_email) !== null && _e !== void 0 ? _e : '').trim(),
                phone: String((_f = manufacturer.vendor_phone) !== null && _f !== void 0 ? _f : '').trim(),
                vendor_phone: String((_g = manufacturer.vendor_phone) !== null && _g !== void 0 ? _g : '').trim(),
                mobile: String((_h = manufacturer.vendor_phone) !== null && _h !== void 0 ? _h : '').trim(),
                website: String((_j = manufacturer.vendor_website) !== null && _j !== void 0 ? _j : '').trim(),
                vendor_website: String((_k = manufacturer.vendor_website) !== null && _k !== void 0 ? _k : '').trim(),
                facebook: String((_l = manufacturer.vendor_facebook) !== null && _l !== void 0 ? _l : '').trim(),
                vendor_facebook: String((_m = manufacturer.vendor_facebook) !== null && _m !== void 0 ? _m : '').trim(),
                youtube: String((_o = manufacturer.vendor_youtube) !== null && _o !== void 0 ? _o : '').trim(),
                vendor_youtube: String((_p = manufacturer.vendor_youtube) !== null && _p !== void 0 ? _p : '').trim(),
                twitter: String((_q = manufacturer.vendor_twitter) !== null && _q !== void 0 ? _q : '').trim(),
                vendor_twitter: String((_r = manufacturer.vendor_twitter) !== null && _r !== void 0 ? _r : '').trim(),
                linkedin: String((_s = manufacturer.vendor_linkedin) !== null && _s !== void 0 ? _s : '').trim(),
                vendor_linkedin: String((_t = manufacturer.vendor_linkedin) !== null && _t !== void 0 ? _t : '').trim(),
                gst: String((_u = manufacturer.vendor_gst) !== null && _u !== void 0 ? _u : '').trim(),
                vendor_gst: String((_v = manufacturer.vendor_gst) !== null && _v !== void 0 ? _v : '').trim(),
                gstPdf: (_w = manufacturer.vendorGstPdf) !== null && _w !== void 0 ? _w : null,
                companyLogo: (_x = manufacturer.companyLogo) !== null && _x !== void 0 ? _x : null,
                companySize: String((_y = manufacturer.companySize) !== null && _y !== void 0 ? _y : '').trim(),
                panNumber: (_z = manufacturer.vendorPan) !== null && _z !== void 0 ? _z : null,
                pan: (_0 = manufacturer.vendorPanDocument) !== null && _0 !== void 0 ? _0 : null,
                vendor_status: (_1 = manufacturer.vendor_status) !== null && _1 !== void 0 ? _1 : 0,
                technicalContact: technicalContact,
                marketingContact: marketingContact,
            };
            return {
                _id: manufacturer._id,
                manufacturerName: (_2 = manufacturer.manufacturerName) !== null && _2 !== void 0 ? _2 : '',
                gpInternalId: (_3 = manufacturer.gpInternalId) !== null && _3 !== void 0 ? _3 : null,
                manufacturerInitial: (_4 = manufacturer.manufacturerInitial) !== null && _4 !== void 0 ? _4 : null,
                manufacturerStatus: (_5 = manufacturer.manufacturerStatus) !== null && _5 !== void 0 ? _5 : 0,
                manufacturerImage: (_6 = manufacturer.manufacturerImage) !== null && _6 !== void 0 ? _6 : null,
                companyLogo: (_7 = manufacturer.companyLogo) !== null && _7 !== void 0 ? _7 : null,
                companySize: (_8 = manufacturer.companySize) !== null && _8 !== void 0 ? _8 : '',
                vendor_name: (_9 = manufacturer.vendor_name) !== null && _9 !== void 0 ? _9 : '',
                vendor_email: (_10 = manufacturer.vendor_email) !== null && _10 !== void 0 ? _10 : '',
                vendor_phone: (_11 = manufacturer.vendor_phone) !== null && _11 !== void 0 ? _11 : '',
                vendor_website: (_12 = manufacturer.vendor_website) !== null && _12 !== void 0 ? _12 : '',
                vendor_facebook: String((_13 = manufacturer.vendor_facebook) !== null && _13 !== void 0 ? _13 : '').trim(),
                vendor_youtube: String((_14 = manufacturer.vendor_youtube) !== null && _14 !== void 0 ? _14 : '').trim(),
                vendor_twitter: String((_15 = manufacturer.vendor_twitter) !== null && _15 !== void 0 ? _15 : '').trim(),
                vendor_linkedin: String((_16 = manufacturer.vendor_linkedin) !== null && _16 !== void 0 ? _16 : '').trim(),
                facebook: String((_17 = manufacturer.vendor_facebook) !== null && _17 !== void 0 ? _17 : '').trim(),
                youtube: String((_18 = manufacturer.vendor_youtube) !== null && _18 !== void 0 ? _18 : '').trim(),
                twitter: String((_19 = manufacturer.vendor_twitter) !== null && _19 !== void 0 ? _19 : '').trim(),
                linkedin: String((_20 = manufacturer.vendor_linkedin) !== null && _20 !== void 0 ? _20 : '').trim(),
                vendor_designation: (_21 = manufacturer.vendor_designation) !== null && _21 !== void 0 ? _21 : '',
                vendor_gst: (_22 = manufacturer.vendor_gst) !== null && _22 !== void 0 ? _22 : '',
                vendorGstPdf: (_23 = manufacturer.vendorGstPdf) !== null && _23 !== void 0 ? _23 : null,
                gstPdf: (_24 = manufacturer.vendorGstPdf) !== null && _24 !== void 0 ? _24 : null,
                vendor_status: (_25 = manufacturer.vendor_status) !== null && _25 !== void 0 ? _25 : 0,
                vendorPan: (_26 = manufacturer.vendorPan) !== null && _26 !== void 0 ? _26 : null,
                vendorPanDocument: (_27 = manufacturer.vendorPanDocument) !== null && _27 !== void 0 ? _27 : null,
                panNumber: (_28 = manufacturer.vendorPan) !== null && _28 !== void 0 ? _28 : null,
                pan: (_29 = manufacturer.vendorPanDocument) !== null && _29 !== void 0 ? _29 : null,
                technicalContact: technicalContact,
                marketingContact: marketingContact,
                createdAt: (_30 = manufacturer.createdAt) !== null && _30 !== void 0 ? _30 : null,
                updatedAt: (_31 = manufacturer.updatedAt) !== null && _31 !== void 0 ? _31 : null,
                vendor_details: vendor_details,
            };
        };
        ProductRegistrationService_1.prototype.asNullableNumber = function (value) {
            if (value === undefined || value === null || value === '') {
                return null;
            }
            var n = typeof value === 'number' ? value : Number(value);
            return Number.isFinite(n) ? n : null;
        };
        ProductRegistrationService_1.prototype.formatProductPerformanceForUrnDetails = function (raw, testReportRows) {
            if (testReportRows === void 0) { testReportRows = []; }
            if (!raw && testReportRows.length === 0) {
                return null;
            }
            var testReports = testReportRows.length > 0
                ? testReportRows.map(function (r) {
                    var _a, _b;
                    return ({
                        _id: r._id,
                        productPerformanceTestReportId: r.productPerformanceTestReportId,
                        productName: String((_a = r.productName) !== null && _a !== void 0 ? _a : ''),
                        testReportFileName: String((_b = r.testReportFileName) !== null && _b !== void 0 ? _b : ''),
                    });
                })
                : Array.isArray(raw === null || raw === void 0 ? void 0 : raw.testReports)
                    ? raw.testReports.map(function (row) {
                        var _a, _b;
                        return ({
                            _id: row._id,
                            productPerformanceTestReportId: row.productPerformanceTestReportId,
                            productName: String((_a = row.productName) !== null && _a !== void 0 ? _a : ''),
                            testReportFileName: String((_b = row.testReportFileName) !== null && _b !== void 0 ? _b : ''),
                        });
                    })
                    : [];
            return {
                _id: raw === null || raw === void 0 ? void 0 : raw._id,
                processProductPerformanceId: raw === null || raw === void 0 ? void 0 : raw.processProductPerformanceId,
                urnNo: raw === null || raw === void 0 ? void 0 : raw.urnNo,
                vendorId: raw === null || raw === void 0 ? void 0 : raw.vendorId,
                testReportFiles: this.asNullableNumber(raw === null || raw === void 0 ? void 0 : raw.testReportFiles),
                testReports: testReports,
                renewalType: this.asNullableNumber(raw === null || raw === void 0 ? void 0 : raw.renewalType),
                productPerformanceStatus: this.asNullableNumber(raw === null || raw === void 0 ? void 0 : raw.productPerformanceStatus),
                createdDate: raw === null || raw === void 0 ? void 0 : raw.createdDate,
                updatedDate: raw === null || raw === void 0 ? void 0 : raw.updatedDate,
            };
        };
        ProductRegistrationService_1.prototype.formatProductDesignForUrnDetails = function (raw, measureRows) {
            var _a, _b;
            if (measureRows === void 0) { measureRows = []; }
            if (!raw && measureRows.length === 0) {
                return null;
            }
            var strategiesText = String((_b = (_a = raw === null || raw === void 0 ? void 0 : raw.statergies) !== null && _a !== void 0 ? _a : raw === null || raw === void 0 ? void 0 : raw.strategies) !== null && _b !== void 0 ? _b : '').trim();
            var measuresAndBenefits = measureRows.length > 0
                ? measureRows.map(function (m) {
                    var _a, _b, _c, _d;
                    return ({
                        _id: m._id,
                        productDesignMeasureId: m.productDesignMeasureId,
                        measuresImplemented: String((_b = (_a = m.measures) !== null && _a !== void 0 ? _a : m.measuresImplemented) !== null && _b !== void 0 ? _b : ''),
                        benefitsAchieved: String((_d = (_c = m.benefits) !== null && _c !== void 0 ? _c : m.benefitsAchieved) !== null && _d !== void 0 ? _d : ''),
                    });
                })
                : Array.isArray(raw === null || raw === void 0 ? void 0 : raw.measuresAndBenefits)
                    ? raw.measuresAndBenefits.map(function (row) {
                        var _a, _b;
                        return ({
                            measuresImplemented: String((_a = row.measuresImplemented) !== null && _a !== void 0 ? _a : ''),
                            benefitsAchieved: String((_b = row.benefitsAchieved) !== null && _b !== void 0 ? _b : ''),
                            _id: row._id,
                            productDesignMeasureId: row.productDesignMeasureId,
                        });
                    })
                    : [];
            return {
                _id: raw === null || raw === void 0 ? void 0 : raw._id,
                productDesignId: raw === null || raw === void 0 ? void 0 : raw.productDesignId,
                urnNo: raw === null || raw === void 0 ? void 0 : raw.urnNo,
                ecoVisionUpload: this.asNullableNumber(raw === null || raw === void 0 ? void 0 : raw.ecoVisionUpload),
                statergies: strategiesText,
                strategies: strategiesText,
                productDesignSupportingDocument: this.asNullableNumber(raw === null || raw === void 0 ? void 0 : raw.productDesignSupportingDocument),
                productDesignStatus: this.asNullableNumber(raw === null || raw === void 0 ? void 0 : raw.productDesignStatus),
                measuresAndBenefits: measuresAndBenefits,
                createdDate: raw === null || raw === void 0 ? void 0 : raw.createdDate,
                updatedDate: raw === null || raw === void 0 ? void 0 : raw.updatedDate,
            };
        };
        ProductRegistrationService_1.prototype.formatProductDetailsVendor = function (manufacturer, vendorFromCollection) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            if (vendorFromCollection) {
                return {
                    _id: vendorFromCollection._id,
                    vendorName: vendorFromCollection.vendorName,
                    vendorEmail: vendorFromCollection.vendorEmail,
                    vendorPhone: vendorFromCollection.vendorPhone,
                    vendorDesignation: vendorFromCollection.vendorDesignation,
                    vendorGst: vendorFromCollection.vendorGst,
                    vendorStatus: vendorFromCollection.vendorStatus,
                };
            }
            if (!manufacturer) {
                return null;
            }
            return {
                _id: manufacturer._id,
                vendorName: (_b = (_a = manufacturer.vendor_name) !== null && _a !== void 0 ? _a : manufacturer.manufacturerName) !== null && _b !== void 0 ? _b : '',
                vendorEmail: (_c = manufacturer.vendor_email) !== null && _c !== void 0 ? _c : '',
                vendorPhone: (_d = manufacturer.vendor_phone) !== null && _d !== void 0 ? _d : '',
                vendorDesignation: (_e = manufacturer.vendor_designation) !== null && _e !== void 0 ? _e : '',
                vendorGst: (_f = manufacturer.vendor_gst) !== null && _f !== void 0 ? _f : '',
                vendorStatus: (_g = manufacturer.vendor_status) !== null && _g !== void 0 ? _g : 0,
                vendor_details: (_h = this.formatProductDetailsManufacturer(manufacturer)) === null || _h === void 0 ? void 0 : _h.vendor_details,
            };
        };
        /** Flatten manufacturer-grouped or legacy URN-grouped list rows for export. */
        ProductRegistrationService_1.prototype.flattenAdminListForExport = function (data) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            var urnRows = [];
            var eoiRows = [];
            for (var _i = 0, _p = data !== null && data !== void 0 ? data : []; _i < _p.length; _i++) {
                var item = _p[_i];
                if ((item === null || item === void 0 ? void 0 : item.manufacturer_id) && Array.isArray(item.urns)) {
                    var groupManufacturerName = (_b = (_a = item.manufacturerName) !== null && _a !== void 0 ? _a : item.manufacturer_name) !== null && _b !== void 0 ? _b : '';
                    var groupVendorEmail = String((_d = (_c = item.vendor_email) !== null && _c !== void 0 ? _c : item.email) !== null && _d !== void 0 ? _d : '').trim();
                    var groupVendorPhone = String((_f = (_e = item.vendor_phone) !== null && _e !== void 0 ? _e : item.phone) !== null && _f !== void 0 ? _f : '').trim();
                    for (var _q = 0, _r = item.urns; _q < _r.length; _q++) {
                        var u = _r[_q];
                        urnRows.push(__assign(__assign({}, u), { manufacturerName: groupManufacturerName, vendor_email: groupVendorEmail, vendor_phone: groupVendorPhone, email: groupVendorEmail, phone: groupVendorPhone }));
                        for (var _s = 0, _t = (_g = u.eois) !== null && _g !== void 0 ? _g : []; _s < _t.length; _s++) {
                            var e = _t[_s];
                            eoiRows.push(__assign(__assign({}, e), { urnNo: (_j = (_h = e.urnNo) !== null && _h !== void 0 ? _h : u.urnNo) !== null && _j !== void 0 ? _j : u.urn_number, manufacturerName: (_k = e.manufacturerName) !== null && _k !== void 0 ? _k : groupManufacturerName, vendor_email: groupVendorEmail, vendor_phone: groupVendorPhone, email: groupVendorEmail, phone: groupVendorPhone }));
                        }
                    }
                    continue;
                }
                if (item === null || item === void 0 ? void 0 : item.urnNo) {
                    urnRows.push(item);
                    for (var _u = 0, _v = (_l = item.eois) !== null && _l !== void 0 ? _l : []; _u < _v.length; _u++) {
                        var e = _v[_u];
                        eoiRows.push(__assign(__assign({}, e), { urnNo: (_m = e.urnNo) !== null && _m !== void 0 ? _m : item.urnNo, manufacturerName: (_o = e.manufacturerName) !== null && _o !== void 0 ? _o : '' }));
                    }
                }
            }
            return { urnRows: urnRows, eoiRows: eoiRows };
        };
        /** Vendor EOI list — productStatus labels for uncertified / lifecycle UI. */
        ProductRegistrationService_1.prototype.mapVendorProductStatusLabel = function (productStatus, validtillDate) {
            var now = new Date();
            if (productStatus === 4) {
                return 'Expired';
            }
            if (productStatus === 2 && validtillDate) {
                var vt = new Date(validtillDate);
                if (!Number.isNaN(vt.getTime()) && vt < now) {
                    return 'Expired';
                }
            }
            switch (productStatus) {
                case 1:
                    return 'Submitted';
                case 2:
                    return 'Certified';
                case 3:
                    return 'Rejected';
                default:
                    return 'Pending';
            }
        };
        /** Vendor URN row rollup from child productStatus codes (returns numeric 0..4). */
        ProductRegistrationService_1.prototype.deriveVendorUrnStatus = function (codes) {
            if (codes.includes(3))
                return 3;
            if (codes.includes(4))
                return 4;
            if (codes.includes(2))
                return 2;
            if (codes.includes(1))
                return 1;
            return 0;
        };
        ProductRegistrationService_1.prototype.formatVendorListEoiEntry = function (e, plantMergeSource) {
            var _a, _b, _c, _d, _e;
            var productStatus = Number((_a = e === null || e === void 0 ? void 0 : e.productStatus) !== null && _a !== void 0 ? _a : 0);
            var sectorRaw = e === null || e === void 0 ? void 0 : e.sector;
            var sectorNum = sectorRaw === null || sectorRaw === undefined || sectorRaw === ''
                ? null
                : Number(sectorRaw);
            var productId = (e === null || e === void 0 ? void 0 : e._id) != null ? String(e._id) : '';
            var units = Number((_b = e === null || e === void 0 ? void 0 : e.plantCount) !== null && _b !== void 0 ? _b : 0);
            var base = {
                _id: e === null || e === void 0 ? void 0 : e._id,
                eoiNo: e === null || e === void 0 ? void 0 : e.eoiNo,
                productName: e === null || e === void 0 ? void 0 : e.productName,
                categoryName: (_c = e === null || e === void 0 ? void 0 : e.categoryName) !== null && _c !== void 0 ? _c : null,
                productStatus: productStatus,
                statusLabel: this.mapVendorProductStatusLabel(productStatus, e === null || e === void 0 ? void 0 : e.validtillDate),
                validtillDate: (_d = e === null || e === void 0 ? void 0 : e.validtillDate) !== null && _d !== void 0 ? _d : null,
                validTill: (_e = e === null || e === void 0 ? void 0 : e.validtillDate) !== null && _e !== void 0 ? _e : null,
                createdDate: e === null || e === void 0 ? void 0 : e.createdDate,
                hpUnits: units,
                plantCount: units,
                units: units,
                /** First plant (by createdDate) — manufacturing location for this EOI. */
                city: (e === null || e === void 0 ? void 0 : e.city) != null && String(e.city).trim() !== '' ? String(e.city).trim() : null,
                stateName: (e === null || e === void 0 ? void 0 : e.stateName) != null && String(e.stateName).trim() !== ''
                    ? String(e.stateName).trim()
                    : null,
                /** Category sector id + resolved label from `sectors` collection. */
                sector: sectorNum != null && Number.isFinite(sectorNum) ? sectorNum : null,
                sectorName: (e === null || e === void 0 ? void 0 : e.sectorName) != null && String(e.sectorName).trim() !== ''
                    ? String(e.sectorName).trim()
                    : null,
            };
            if (productStatus !== product_status_constants_1.PRODUCT_STATUS_CERTIFIED || !productId) {
                return base;
            }
            if (plantMergeSource) {
                return __assign(__assign({}, base), { plantMergeSource: true, plantMergeTargetEoiNo: plantMergeSource.targetEoiNo, plantMergeTargetUrnNo: plantMergeSource.targetUrnNo });
            }
            return __assign(__assign({}, base), { plantMergeSource: false, certificateDownloadUrl: "/products/certificates/eoi/".concat(productId), certificateZipDownloadUrl: "/products/certificates/eoi/".concat(productId, "?format=zip"), plantCertificatesListUrl: "/products/certificates/eoi/".concat(productId, "/plants"), certificateVendorDownloadUrl: "/products/certificates/vendor/download", certificateVendorZipDownloadUrl: "/products/certificates/vendor/download?format=zip", certificateVendorPlantCountUrl: "/products/certificates/vendor/plant-count" });
        };
        ProductRegistrationService_1.prototype.formatUrnProductDetailsListEntry = function (product, context) {
            var _a, _b, _c, _d, _e;
            var productStatus = Number((_a = product.productStatus) !== null && _a !== void 0 ? _a : 0);
            var categoryDoc = (_b = context.categoryDoc) !== null && _b !== void 0 ? _b : null;
            var categoryEditable = (0, category_change_util_1.isProductCategoryEditableForUrn)({
                productStatus: productStatus,
                urnStatuses: context.urnStatuses,
                anyProductCertified: context.anyCertifiedOnUrn,
            });
            var categoryChangeBlockReason = (0, category_change_util_1.resolveCategoryChangeBlockReasonForUrn)({
                productStatus: productStatus,
                urnStatuses: context.urnStatuses,
                anyProductCertified: context.anyCertifiedOnUrn,
            });
            var visibleRawMaterialSteps = (0, category_change_util_1.visibleStepsForCategory)(String((_c = categoryDoc === null || categoryDoc === void 0 ? void 0 : categoryDoc.category_raw_material_forms) !== null && _c !== void 0 ? _c : '').trim() || null);
            return {
                _id: product._id,
                productId: product.productId,
                eoiNo: product.eoiNo,
                urnNo: product.urnNo,
                productName: product.productName,
                productImage: product.productImage,
                plantCount: product.plantCount,
                categoryId: (_e = (_d = product.categoryId) !== null && _d !== void 0 ? _d : categoryDoc === null || categoryDoc === void 0 ? void 0 : categoryDoc._id) !== null && _e !== void 0 ? _e : null,
                productDetails: product.productDetails,
                productType: product.productType,
                productStatus: product.productStatus,
                productRenewStatus: product.productRenewStatus,
                renewedDate: product.renewedDate,
                urnStatus: product.urnStatus,
                assessmentReportUrl: product.assessmentReportUrl,
                rejectedDetails: product.rejectedDetails,
                certifiedDate: product.certifiedDate,
                validtillDate: product.validtillDate,
                firstNotifyDate: product.firstNotifyDate,
                secondNotifyDate: product.secondNotifyDate,
                thirdNotifyDate: product.thirdNotifyDate,
                createdDate: product.createdDate,
                updatedDate: product.updatedDate,
                categoryEditable: categoryEditable,
                categoryChangeBlockReason: categoryChangeBlockReason,
                visibleRawMaterialSteps: visibleRawMaterialSteps,
            };
        };
        ProductRegistrationService_1.prototype.buildUrnProductDetailsList = function (products, context) {
            return __awaiter(this, void 0, void 0, function () {
                var categoryIds, categories, _a, categoryById;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            categoryIds = __spreadArray([], new Set(products
                                .map(function (product) { var _a; return String((_a = product.categoryId) !== null && _a !== void 0 ? _a : '').trim(); })
                                .filter(function (id) { return mongoose_1.Types.ObjectId.isValid(id); })), true).map(function (id) { return new mongoose_1.Types.ObjectId(id); });
                            if (!(categoryIds.length > 0)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.categoryModel
                                    .find({ _id: { $in: categoryIds } })
                                    .lean()
                                    .exec()];
                        case 1:
                            _a = _b.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = [];
                            _b.label = 3;
                        case 3:
                            categories = _a;
                            categoryById = new Map(categories.map(function (category) { return [String(category._id), category]; }));
                            return [2 /*return*/, products.map(function (product) {
                                    var _a, _b;
                                    return _this.formatUrnProductDetailsListEntry(product, __assign(__assign({}, context), { categoryDoc: (_b = categoryById.get(String((_a = product.categoryId) !== null && _a !== void 0 ? _a : ''))) !== null && _b !== void 0 ? _b : null }));
                                })];
                    }
                });
            });
        };
        /**
         * Vendor uncertified EOI list — filters on **`products.productStatus`** (EOI list status), not manufacturer/vendor status.
         * When `statuses` is omitted or empty, defaults to **Pending (0) + Submitted (1)** only.
         * Code **4** = expired (`productStatus` 4 discontinued, or `productStatus` 2 with `validtillDate` in the past).
         * Explicit **2** alone (no 4) = active certified only (`validtillDate` null or not yet passed).
         */
        ProductRegistrationService_1.prototype.buildVendorListProductStatusMatch = function (statuses) {
            var now = new Date();
            var explicit = Array.isArray(statuses) && statuses.length > 0;
            var effective = explicit ? statuses : [0, 1];
            var includeExpired = effective.includes(4);
            var regularStatuses = effective.filter(function (s) { return s !== 4; });
            /** Certified (2) without expired (4): active certificates only. */
            if (explicit &&
                regularStatuses.length === 1 &&
                regularStatuses[0] === 2 &&
                !includeExpired) {
                return {
                    productStatus: 2,
                    $or: [
                        { validtillDate: null },
                        { validtillDate: { $exists: false } },
                        { validtillDate: { $gte: now } },
                    ],
                };
            }
            if (includeExpired && regularStatuses.length > 0) {
                return {
                    $or: [
                        { productStatus: { $in: regularStatuses } },
                        (0, expired_product_filter_1.matchExpiredProducts)(now),
                    ],
                };
            }
            if (includeExpired) {
                return (0, expired_product_filter_1.matchExpiredProducts)(now);
            }
            if (regularStatuses.length === 1) {
                return { productStatus: regularStatuses[0] };
            }
            return { productStatus: { $in: regularStatuses } };
        };
        ProductRegistrationService_1.prototype.ensureExportDir = function () {
            if (!(0, fs_1.existsSync)(this.exportDir)) {
                (0, fs_1.mkdirSync)(this.exportDir, { recursive: true });
            }
        };
        ProductRegistrationService_1.prototype.buildPublicFileUrl = function (fileName) {
            var _a;
            var fromEnv = ((_a = process.env.API_BASE_URL) !== null && _a !== void 0 ? _a : '').trim().replace(/\/+$/, '');
            var rel = "/uploads/exports/".concat(fileName);
            return fromEnv ? "".concat(fromEnv).concat(rel) : rel;
        };
        ProductRegistrationService_1.prototype.cleanupExpiredExportJobs = function () {
            var now = Date.now();
            for (var _i = 0, _a = this.exportJobs.entries(); _i < _a.length; _i++) {
                var _b = _a[_i], jobId = _b[0], job = _b[1];
                if (job.expiresAt && job.expiresAt.getTime() < now) {
                    this.exportJobs.delete(jobId);
                }
            }
        };
        ProductRegistrationService_1.prototype.normalizeAdminExportIncludeSheets = function (includeSheets) {
            var allowed = new Set(['urn_summary', 'eoi_details']);
            var normalized = (includeSheets !== null && includeSheets !== void 0 ? includeSheets : []).filter(function (sheet) {
                return allowed.has(sheet);
            });
            return normalized.length > 0 ? normalized : ['urn_summary', 'eoi_details'];
        };
        ProductRegistrationService_1.prototype.writeAdminUrnSummaryWorksheetHeaders = function (ws) {
            var headers = [
                'S.No',
                'Manufacturer Name',
                'Email',
                'Phone',
                'URN',
                'URN Status',
                'Total EOI',
            ];
            var keys = [
                'sno',
                'manufacturerName',
                'email',
                'phone',
                'urnNo',
                'urnStatus',
                'totalEoi',
            ];
            var widths = [8, 28, 28, 18, 28, 16, 12];
            ws.columns = keys.map(function (key, index) { return ({
                header: headers[index],
                key: key,
                width: widths[index],
            }); });
            var headerRow = ws.getRow(1);
            headerRow.values = __spreadArray([], headers, true);
            headerRow.font = { bold: true };
            headerRow.commit();
            ws.views = [{ state: 'frozen', ySplit: 1, activeCell: 'A2' }];
        };
        ProductRegistrationService_1.prototype.collectAdminListRowsForExport = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var batchSize, page, totalGroups, listRows, batch;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            batchSize = 500;
                            page = 1;
                            totalGroups = 0;
                            listRows = [];
                            _d.label = 1;
                        case 1:
                            if (!true) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.adminListProducts(__assign(__assign({}, dto), { page: page, limit: batchSize }))];
                        case 2:
                            batch = _d.sent();
                            if (totalGroups === 0) {
                                totalGroups = (_a = batch.total) !== null && _a !== void 0 ? _a : 0;
                            }
                            listRows.push.apply(listRows, ((_b = batch.data) !== null && _b !== void 0 ? _b : []));
                            if (listRows.length >= totalGroups || ((_c = batch.data) !== null && _c !== void 0 ? _c : []).length === 0) {
                                return [3 /*break*/, 3];
                            }
                            page += 1;
                            return [3 /*break*/, 1];
                        case 3: return [2 /*return*/, listRows];
                    }
                });
            });
        };
        /** Set a date field only when a non-empty ISO value was provided. */
        ProductRegistrationService_1.prototype.applyOptionalDateField = function (target, field, value) {
            if (value === undefined || value === null || String(value).trim() === '') {
                return;
            }
            var parsed = new Date(value);
            if (Number.isNaN(parsed.getTime())) {
                throw new common_1.BadRequestException("Invalid date for ".concat(field));
            }
            target[field] = parsed;
        };
        /**
         * Safely convert string to ObjectId with validation
         */
        ProductRegistrationService_1.prototype.toObjectId = function (id, fieldName) {
            if (!id) {
                throw new common_1.BadRequestException("".concat(fieldName, " is required"));
            }
            // If already an ObjectId, return it
            if (id instanceof mongoose_1.Types.ObjectId) {
                return id;
            }
            // Convert to string and validate
            var idString = String(id).trim();
            // Check if it's a valid 24-character hex string
            if (!/^[0-9a-fA-F]{24}$/.test(idString)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format. Must be a valid 24-character MongoDB ObjectId."));
            }
            try {
                return new mongoose_1.Types.ObjectId(idString);
            }
            catch (error) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format: ").concat(idString));
            }
        };
        /**
         * Validate country exists
         */
        ProductRegistrationService_1.prototype.validateCountry = function (countryId) {
            return __awaiter(this, void 0, void 0, function () {
                var country;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.countriesService.findById(countryId)];
                        case 1:
                            country = _a.sent();
                            if (!country) {
                                throw new common_1.NotFoundException("Country with ID ".concat(countryId, " not found"));
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Validate state exists and belongs to country
         */
        ProductRegistrationService_1.prototype.validateState = function (stateId, countryId) {
            return __awaiter(this, void 0, void 0, function () {
                var state, country;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.statesService.findById(stateId)];
                        case 1:
                            state = _a.sent();
                            if (!state) {
                                throw new common_1.NotFoundException("State with ID ".concat(stateId, " not found"));
                            }
                            return [4 /*yield*/, this.countriesService.findById(countryId)];
                        case 2:
                            country = _a.sent();
                            if (!country) {
                                throw new common_1.NotFoundException("Country with ID ".concat(countryId, " not found"));
                            }
                            this.assertStateBelongsToCountry(state, country, stateId, countryId);
                            return [2 /*return*/];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.assertStateBelongsToCountry = function (state, country, stateId, countryId) {
            if (state.countryId && state.countryId.toString() === countryId) {
                return;
            }
            if (state.country_id && country.id && state.country_id === country.id) {
                return;
            }
            var stateCountryCode = state.country_code;
            var countryCode = country.country_code || country.countryCode;
            if (stateCountryCode && countryCode && stateCountryCode === countryCode) {
                return;
            }
            throw new common_1.BadRequestException("State with ID ".concat(stateId, " does not belong to country with ID ").concat(countryId));
        };
        /** Validate unique plant country/state pairs once per bulk chunk (before DB writes). */
        ProductRegistrationService_1.prototype.validateBulkRegistrationPlantLocations = function (chunk) {
            return __awaiter(this, void 0, void 0, function () {
                var countryIds, stateCountryPairs, _i, chunk_1, product, _a, _b, plant, countryCache;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            countryIds = new Set();
                            stateCountryPairs = new Map();
                            for (_i = 0, chunk_1 = chunk; _i < chunk_1.length; _i++) {
                                product = chunk_1[_i];
                                for (_a = 0, _b = product.plants; _a < _b.length; _a++) {
                                    plant = _b[_a];
                                    countryIds.add(plant.countryId);
                                    stateCountryPairs.set(plant.stateId, plant.countryId);
                                }
                            }
                            countryCache = new Map();
                            return [4 /*yield*/, Promise.all(__spreadArray([], countryIds, true).map(function (countryId) { return __awaiter(_this, void 0, void 0, function () {
                                    var country;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.countriesService.findById(countryId)];
                                            case 1:
                                                country = _a.sent();
                                                if (!country) {
                                                    throw new common_1.NotFoundException("Country with ID ".concat(countryId, " not found"));
                                                }
                                                countryCache.set(countryId, country);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }))];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, Promise.all(__spreadArray([], stateCountryPairs.entries(), true).map(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                                    var state, country;
                                    var stateId = _b[0], countryId = _b[1];
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0: return [4 /*yield*/, this.statesService.findById(stateId)];
                                            case 1:
                                                state = _c.sent();
                                                if (!state) {
                                                    throw new common_1.NotFoundException("State with ID ".concat(stateId, " not found"));
                                                }
                                                country = countryCache.get(countryId);
                                                if (!country) {
                                                    throw new common_1.NotFoundException("Country with ID ".concat(countryId, " not found"));
                                                }
                                                this.assertStateBelongsToCountry(state, country, stateId, countryId);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }))];
                        case 2:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Map urnStatus to activity name
         * Certification Flow Status Mapping (activity log labels):
         * Activity log labels and responsibility owners are shared with payments and dashboard progress.
         */
        ProductRegistrationService_1.prototype.getActivityName = function (urnStatus) {
            return (0, activity_lifecycle_constants_1.activityLifecycleName)(urnStatus);
        };
        /** Next timeline step id from the canonical activity lifecycle. */
        ProductRegistrationService_1.prototype.getNextActivityIdForLog = function (currentStatus) {
            return (0, activity_lifecycle_constants_1.nextActivityLifecycleStatus)(currentStatus);
        };
        /** Responsibility owner by status for activity timeline rows. */
        ProductRegistrationService_1.prototype.getResponsibilityForStatus = function (status) {
            return (0, activity_lifecycle_constants_1.activityLifecycleResponsibility)(status);
        };
        /**
         * Get next activity name based on current urnStatus
         */
        ProductRegistrationService_1.prototype.getNextActivityName = function (urnStatus) {
            return this.getActivityName(this.getNextActivityIdForLog(urnStatus));
        };
        /**
         * Vendor panel compatibility: "submit for review" actions should always move URN to 4.
         * Some clients still send stale updateStatusTo values; normalize here to avoid wrong stage transitions.
         */
        ProductRegistrationService_1.prototype.resolveVendorRequestedUrnStatus = function (updateStatusType, updateStatusTo) {
            var type = String(updateStatusType !== null && updateStatusType !== void 0 ? updateStatusType : '')
                .trim()
                .toLowerCase();
            if (type === 'submit_for_review' ||
                type === 'submit-for-review' ||
                type === 'process_form_submit' ||
                type === 'process-form-submit' ||
                type === 'process_form_submitted') {
                return 4;
            }
            return updateStatusTo;
        };
        /**
         * Persists one timeline row when `products.urnStatus` advances to `newUrnStatus`.
         * Errors are swallowed so the primary DB operation still succeeds.
         */
        ProductRegistrationService_1.prototype.tryLogUrnLifecycleStep = function (vendorId, manufacturerId, urnNo, newUrnStatus, previousUrnStatus) {
            return __awaiter(this, void 0, void 0, function () {
                var err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.productRegistrationWorkflowService.syncToUrnStatus({
                                    vendorId: vendorId,
                                    manufacturerId: manufacturerId,
                                    urnNo: urnNo,
                                }, previousUrnStatus !== null && previousUrnStatus !== void 0 ? previousUrnStatus : Math.max(0, newUrnStatus - 1), newUrnStatus)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            err_1 = _a.sent();
                            console.error('[Activity Log] tryLogUrnLifecycleStep failed:', err_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Generate URN: "URN-" + timestamp in YYYYMMDDHHmmss format
         * Always unique - no validation, no retries needed
         * Example: URN-20260219153022
         */
        ProductRegistrationService_1.prototype.generateURN = function () {
            var now = new Date();
            var year = now.getFullYear();
            var month = String(now.getMonth() + 1).padStart(2, '0');
            var day = String(now.getDate()).padStart(2, '0');
            var hours = String(now.getHours()).padStart(2, '0');
            var minutes = String(now.getMinutes()).padStart(2, '0');
            var seconds = String(now.getSeconds()).padStart(2, '0');
            return "URN-".concat(year).concat(month).concat(day).concat(hours).concat(minutes).concat(seconds);
        };
        /**
         * Generate unique EOI: "GP" + manufacturer_initial + 3-digit internal_id + 3-digit manufacturer_product_count
         * Format: GPAB012006
         * - manufacturer_initial: e.g., "AB"
         * - internal_id: Extract number from gpInternalId, pad to 3 digits (e.g., "GP-12" → "012")
         * - manufacturer_product_count: Count existing products for manufacturer + 1, pad to 3 digits (e.g., 6 → "006")
         * Uses manufacturer-specific count only, not global count
         */
        ProductRegistrationService_1.prototype.generateEOI = function (manufacturerId, session) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.eoiNumberService.generateNextEoiNo(manufacturerId, session)];
                });
            });
        };
        /**
         * Generate EOI with a specific manufacturer product count
         * Format: "GP" + manufacturer_initial + left-pad internal_id to 3 digits + left-pad manufacturer_product_count to 3 digits
         * Example: GPAB012006 (where AB is manufacturer_initial, 012 is internal_id, 006 is manufacturer_product_count)
         * Used for bulk registration where we need to control the sequence
         */
        ProductRegistrationService_1.prototype.generateEOIWithCount = function (manufacturerId, manufacturerProductCount, session) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.eoiNumberService.buildEoiNo(manufacturerId, manufacturerProductCount, session)];
                });
            });
        };
        /**
         * Register a single product
         * Deterministic URN and EOI generation - no retries needed
         */
        ProductRegistrationService_1.prototype.registerProduct = function (registerProductDto, manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var maxRetries, retryCount, _loop_1, this_1, state_1;
                var _this = this;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            maxRetries = 3;
                            retryCount = 0;
                            _loop_1 = function () {
                                var session, manufacturerObjectId, vendorObjectId, urnNo_1, eoiNo, productId, now, categoryObjectId, productData, product, savedProduct, plants, _i, _d, plantDto, productPlantId, plantCountryObjectId, plantStateObjectId, plantData, plant, savedPlant, activityLogError_1, error_1, errorMessage;
                                return __generator(this, function (_e) {
                                    switch (_e.label) {
                                        case 0: return [4 /*yield*/, this_1.connection.startSession()];
                                        case 1:
                                            session = _e.sent();
                                            session.startTransaction();
                                            _e.label = 2;
                                        case 2:
                                            _e.trys.push([2, 19, , 24]);
                                            console.log('[Product Registration] Starting registration (attempt ' +
                                                (retryCount + 1) +
                                                ')...');
                                            console.log('[Product Registration] Manufacturer ID:', manufacturerId);
                                            console.log('[Product Registration] Auth manufacturer ID:', manufacturerId);
                                            manufacturerObjectId = this_1.toObjectId(manufacturerId, 'manufacturerId');
                                            vendorObjectId = this_1.toObjectId(manufacturerId, 'manufacturerId');
                                            urnNo_1 = this_1.generateURN();
                                            console.log('[Product Registration] Generated URN:', urnNo_1);
                                            // Generate EOI: Based on manufacturer-specific product count only
                                            // Format: GP + manufacturer_initial + left-pad internal_id to 3 digits + left-pad manufacturer_product_count to 3 digits
                                            console.log('[Product Registration] Generating EOI...');
                                            return [4 /*yield*/, this_1.generateEOI(manufacturerId, session)];
                                        case 3:
                                            eoiNo = _e.sent();
                                            console.log('[Product Registration] Generated EOI:', eoiNo);
                                            return [4 /*yield*/, this_1.sequenceHelper.getProductId()];
                                        case 4:
                                            productId = _e.sent();
                                            now = new Date();
                                            categoryObjectId = this_1.toObjectId(registerProductDto.categoryId, 'categoryId');
                                            productData = {
                                                productId: productId,
                                                categoryId: categoryObjectId,
                                                vendorId: vendorObjectId,
                                                manufacturerId: manufacturerObjectId,
                                                eoiNo: eoiNo,
                                                urnNo: urnNo_1,
                                                productName: registerProductDto.productName,
                                                productImage: registerProductDto.productImage,
                                                plantCount: registerProductDto.plants.length,
                                                productDetails: registerProductDto.productDetails,
                                                productType: registerProductDto.productType || 0,
                                                productStatus: 0,
                                                productRenewStatus: 0,
                                                urnStatus: 0,
                                                createdDate: now,
                                                updatedDate: now,
                                            };
                                            product = new this_1.productModel(productData);
                                            return [4 /*yield*/, product.save({ session: session })];
                                        case 5:
                                            savedProduct = _e.sent();
                                            plants = [];
                                            _i = 0, _d = registerProductDto.plants;
                                            _e.label = 6;
                                        case 6:
                                            if (!(_i < _d.length)) return [3 /*break*/, 12];
                                            plantDto = _d[_i];
                                            return [4 /*yield*/, this_1.sequenceHelper.getProductPlantId()];
                                        case 7:
                                            productPlantId = _e.sent();
                                            plantCountryObjectId = this_1.toObjectId(plantDto.countryId, 'countryId');
                                            return [4 /*yield*/, this_1.validateCountry(plantDto.countryId)];
                                        case 8:
                                            _e.sent();
                                            plantStateObjectId = this_1.toObjectId(plantDto.stateId, 'stateId');
                                            return [4 /*yield*/, this_1.validateState(plantDto.stateId, plantDto.countryId)];
                                        case 9:
                                            _e.sent();
                                            plantData = {
                                                productPlantId: productPlantId,
                                                productId: savedProduct._id,
                                                vendorId: vendorObjectId,
                                                categoryId: categoryObjectId,
                                                manufacturerId: manufacturerObjectId,
                                                countryId: plantCountryObjectId,
                                                stateId: plantStateObjectId,
                                                urnNo: urnNo_1,
                                                eoiNo: eoiNo,
                                                plantName: plantDto.plantName,
                                                plantLocation: plantDto.plantLocation,
                                                city: plantDto.city,
                                                plantStatus: 1,
                                                createdDate: now,
                                            };
                                            plant = new this_1.productPlantModel(plantData);
                                            return [4 /*yield*/, plant.save({ session: session })];
                                        case 10:
                                            savedPlant = _e.sent();
                                            plants.push(savedPlant);
                                            _e.label = 11;
                                        case 11:
                                            _i++;
                                            return [3 /*break*/, 6];
                                        case 12: return [4 /*yield*/, session.commitTransaction()];
                                        case 13:
                                            _e.sent();
                                            session.endSession();
                                            _e.label = 14;
                                        case 14:
                                            _e.trys.push([14, 16, , 17]);
                                            return [4 /*yield*/, this_1.productRegistrationWorkflowService.initializeOnProductRegistration({
                                                    vendorId: manufacturerId,
                                                    manufacturerId: manufacturerId,
                                                    urnNo: urnNo_1,
                                                })];
                                        case 15:
                                            _e.sent();
                                            return [3 /*break*/, 17];
                                        case 16:
                                            activityLogError_1 = _e.sent();
                                            // Log error but don't fail the product registration
                                            console.error('[Product Registration] Failed to log activity:', activityLogError_1);
                                            return [3 /*break*/, 17];
                                        case 17: return [4 /*yield*/, this_1.invalidateProductListingsCache()];
                                        case 18:
                                            _e.sent();
                                            this_1.lifecycleNotification
                                                .notifyProductRegistered({
                                                manufacturerId: manufacturerId,
                                                urnNo: urnNo_1,
                                                eoiNo: eoiNo,
                                                productName: registerProductDto.productName,
                                            })
                                                .catch(function (err) {
                                                return _this.logger.warn("[registerProduct] Admin notification failed for ".concat(urnNo_1, ": ").concat(err.message));
                                            });
                                            return [2 /*return*/, { value: __assign(__assign({}, savedProduct.toObject()), { plants: plants.map(function (p) { return p.toObject(); }) }) }];
                                        case 19:
                                            error_1 = _e.sent();
                                            return [4 /*yield*/, session.abortTransaction()];
                                        case 20:
                                            _e.sent();
                                            session.endSession();
                                            // For validation errors, throw immediately with detailed message
                                            if (error_1 instanceof common_1.NotFoundException ||
                                                error_1 instanceof common_1.BadRequestException) {
                                                console.error('Validation error:', error_1.message);
                                                throw error_1;
                                            }
                                            if (!(error_1.code === 11000 ||
                                                (error_1.name === 'MongoServerError' &&
                                                    ((_a = error_1.message) === null || _a === void 0 ? void 0 : _a.includes('duplicate'))))) return [3 /*break*/, 23];
                                            retryCount++;
                                            if (!(retryCount < maxRetries)) return [3 /*break*/, 22];
                                            console.warn("[Product Registration] Duplicate URN/EOI detected. Retry ".concat(retryCount, "/").concat(maxRetries, "..."));
                                            // Wait a bit before retry (exponential backoff)
                                            return [4 /*yield*/, new Promise(function (resolve) {
                                                    return setTimeout(resolve, 100 * retryCount);
                                                })];
                                        case 21:
                                            // Wait a bit before retry (exponential backoff)
                                            _e.sent();
                                            return [2 /*return*/, "continue"];
                                        case 22: throw new common_1.InternalServerErrorException('Failed to register product after multiple attempts due to duplicate URN or EOI. Please try again.');
                                        case 23:
                                            // Log the actual error for debugging
                                            console.error('Product registration error:', error_1);
                                            console.error('Error name:', error_1.name);
                                            console.error('Error message:', error_1.message);
                                            console.error('Error code:', error_1.code);
                                            console.error('Error stack:', error_1.stack);
                                            // Check for specific error types
                                            if (error_1.name === 'CastError' ||
                                                ((_b = error_1.message) === null || _b === void 0 ? void 0 : _b.includes('Cast to ObjectId'))) {
                                                throw new common_1.BadRequestException("Invalid ID format provided: ".concat(error_1.message));
                                            }
                                            errorMessage = error_1.message || 'Failed to register product';
                                            console.error('Throwing InternalServerErrorException with message:', errorMessage);
                                            throw new common_1.InternalServerErrorException("".concat(errorMessage, ". Check server logs for details."));
                                        case 24: return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _c.label = 1;
                        case 1:
                            if (!(retryCount < maxRetries)) return [3 /*break*/, 3];
                            return [5 /*yield**/, _loop_1()];
                        case 2:
                            state_1 = _c.sent();
                            if (typeof state_1 === "object")
                                return [2 /*return*/, state_1.value];
                            return [3 /*break*/, 1];
                        case 3: 
                        // Should never reach here, but just in case
                        throw new common_1.InternalServerErrorException('Failed to register product after all retry attempts.');
                    }
                });
            });
        };
        /**
         * Register multiple products (bulk)
         * - ONE URN for all products in the bulk upload
         * - Individual EOI per product based on manufacturer-specific count
         * - Commits in chunks to avoid MongoDB transaction time limits on large uploads
         */
        ProductRegistrationService_1.prototype.registerBulkProducts = function (bulkRegisterProductDto, manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var maxRetries, retryCount, BULK_REGISTRATION_CHUNK_SIZE, BULK_TXN_MAX_COMMIT_MS, bulkStartedAt, _loop_2, this_2, state_2;
                var _this = this;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            maxRetries = 3;
                            retryCount = 0;
                            BULK_REGISTRATION_CHUNK_SIZE = 500;
                            BULK_TXN_MAX_COMMIT_MS = 120000;
                            bulkStartedAt = Date.now();
                            _loop_2 = function () {
                                var manufacturerObjectId, vendorObjectId, urnNo, committedAny, initialMaxActiveSequence, manufacturerProfile, results, products, chunkStart, chunk, chunkResults, activityLogError_2, productNames, eoiNos, error_2, rollbackError_1, errorMessage;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            manufacturerObjectId = this_2.toObjectId(manufacturerId, 'manufacturerId');
                                            vendorObjectId = this_2.toObjectId(manufacturerId, 'manufacturerId');
                                            urnNo = this_2.generateURN();
                                            committedAny = false;
                                            _d.label = 1;
                                        case 1:
                                            _d.trys.push([1, 12, , 20]);
                                            console.log('[Bulk Product Registration] Starting bulk registration (attempt ' +
                                                (retryCount + 1) +
                                                ')...');
                                            console.log('[Bulk Product Registration] Manufacturer ID:', manufacturerId);
                                            console.log('[Bulk Product Registration] Number of products:', bulkRegisterProductDto.products.length);
                                            console.log('[Bulk Product Registration] Generated single URN for all products:', urnNo);
                                            return [4 /*yield*/, this_2.eoiNumberService.getMaxActiveSequenceSuffix(manufacturerObjectId)];
                                        case 2:
                                            initialMaxActiveSequence = _d.sent();
                                            console.log('[Bulk Product Registration] Initial max active EOI sequence:', initialMaxActiveSequence);
                                            return [4 /*yield*/, this_2.eoiNumberService.loadManufacturerEoiProfile(manufacturerId)];
                                        case 3:
                                            manufacturerProfile = _d.sent();
                                            results = [];
                                            products = bulkRegisterProductDto.products;
                                            chunkStart = 0;
                                            _d.label = 4;
                                        case 4:
                                            if (!(chunkStart < products.length)) return [3 /*break*/, 7];
                                            chunk = products.slice(chunkStart, chunkStart + BULK_REGISTRATION_CHUNK_SIZE);
                                            return [4 /*yield*/, this_2.registerBulkProductChunk({
                                                    chunk: chunk,
                                                    chunkStartIndex: chunkStart,
                                                    totalProducts: products.length,
                                                    initialMaxActiveSequence: initialMaxActiveSequence,
                                                    manufacturerProfile: manufacturerProfile,
                                                    manufacturerId: manufacturerId,
                                                    manufacturerObjectId: manufacturerObjectId,
                                                    vendorObjectId: vendorObjectId,
                                                    urnNo: urnNo,
                                                    maxCommitTimeMS: BULK_TXN_MAX_COMMIT_MS,
                                                })];
                                        case 5:
                                            chunkResults = _d.sent();
                                            results.push.apply(results, chunkResults);
                                            committedAny = true;
                                            _d.label = 6;
                                        case 6:
                                            chunkStart += BULK_REGISTRATION_CHUNK_SIZE;
                                            return [3 /*break*/, 4];
                                        case 7:
                                            _d.trys.push([7, 9, , 10]);
                                            return [4 /*yield*/, this_2.productRegistrationWorkflowService.initializeOnProductRegistration({
                                                    vendorId: manufacturerId,
                                                    manufacturerId: manufacturerId,
                                                    urnNo: urnNo,
                                                })];
                                        case 8:
                                            _d.sent();
                                            return [3 /*break*/, 10];
                                        case 9:
                                            activityLogError_2 = _d.sent();
                                            // Log error but don't fail the bulk product registration
                                            console.error('[Bulk Product Registration] Failed to log activity:', activityLogError_2);
                                            return [3 /*break*/, 10];
                                        case 10:
                                            this_2.logger.log("[Bulk Product Registration] Registered ".concat(results.length, " products in ").concat(Date.now() - bulkStartedAt, "ms (URN ").concat(urnNo, ")"));
                                            return [4 /*yield*/, this_2.invalidateProductListingsCache()];
                                        case 11:
                                            _d.sent();
                                            productNames = results
                                                .map(function (row) { var _a; return String((_a = row === null || row === void 0 ? void 0 : row.productName) !== null && _a !== void 0 ? _a : '').trim(); })
                                                .filter(Boolean);
                                            eoiNos = results.map(function (row) { var _a; return String((_a = row === null || row === void 0 ? void 0 : row.eoiNo) !== null && _a !== void 0 ? _a : '').trim(); });
                                            this_2.lifecycleNotification
                                                .notifyProductRegistered({
                                                manufacturerId: manufacturerId,
                                                urnNo: urnNo,
                                                productNames: productNames.length > 0 ? productNames : ['Product'],
                                                eoiNos: eoiNos,
                                            })
                                                .catch(function (err) {
                                                return _this.logger.warn("[registerBulkProducts] Admin notification failed for ".concat(urnNo, ": ").concat(err.message));
                                            });
                                            return [2 /*return*/, { value: {
                                                        urnNo: urnNo,
                                                        registeredCount: results.length,
                                                        products: results.map(function (row) {
                                                            var _a;
                                                            return ({
                                                                _id: row._id,
                                                                productId: row.productId,
                                                                productName: row.productName,
                                                                eoiNo: row.eoiNo,
                                                                urnNo: row.urnNo,
                                                                plantCount: Number((_a = row.plantCount) !== null && _a !== void 0 ? _a : 0) ||
                                                                    (Array.isArray(row.plants) ? row.plants.length : 0),
                                                            });
                                                        }),
                                                    } }];
                                        case 12:
                                            error_2 = _d.sent();
                                            if (!committedAny) return [3 /*break*/, 16];
                                            _d.label = 13;
                                        case 13:
                                            _d.trys.push([13, 15, , 16]);
                                            return [4 /*yield*/, this_2.rollbackBulkRegistrationByUrn(urnNo, manufacturerObjectId)];
                                        case 14:
                                            _d.sent();
                                            return [3 /*break*/, 16];
                                        case 15:
                                            rollbackError_1 = _d.sent();
                                            console.error('[Bulk Product Registration] Failed to roll back partial bulk registration:', rollbackError_1);
                                            return [3 /*break*/, 16];
                                        case 16:
                                            // For validation errors, throw immediately
                                            if (error_2 instanceof common_1.NotFoundException ||
                                                error_2 instanceof common_1.BadRequestException) {
                                                console.error('Validation error:', error_2.message);
                                                throw error_2;
                                            }
                                            if (!(error_2.code === 11000 ||
                                                (error_2.name === 'MongoServerError' &&
                                                    ((_a = error_2.message) === null || _a === void 0 ? void 0 : _a.includes('duplicate'))))) return [3 /*break*/, 19];
                                            retryCount++;
                                            if (!(retryCount < maxRetries)) return [3 /*break*/, 18];
                                            console.warn("[Bulk Product Registration] Duplicate URN/EOI detected. Retry ".concat(retryCount, "/").concat(maxRetries, "..."));
                                            // Wait a bit before retry (exponential backoff)
                                            return [4 /*yield*/, new Promise(function (resolve) {
                                                    return setTimeout(resolve, 100 * retryCount);
                                                })];
                                        case 17:
                                            // Wait a bit before retry (exponential backoff)
                                            _d.sent();
                                            return [2 /*return*/, "continue"];
                                        case 18: throw new common_1.InternalServerErrorException('Failed to register bulk products after multiple attempts due to duplicate URN or EOI. Please try again.');
                                        case 19:
                                            // Log the actual error for debugging
                                            console.error('Bulk product registration error:', error_2);
                                            console.error('Error name:', error_2.name);
                                            console.error('Error message:', error_2.message);
                                            console.error('Error code:', error_2.code);
                                            console.error('Error stack:', error_2.stack);
                                            // Check for specific error types
                                            if (error_2.name === 'CastError' ||
                                                ((_b = error_2.message) === null || _b === void 0 ? void 0 : _b.includes('Cast to ObjectId'))) {
                                                throw new common_1.BadRequestException("Invalid ID format provided: ".concat(error_2.message));
                                            }
                                            errorMessage = error_2.message || 'Failed to register bulk products';
                                            console.error('Throwing InternalServerErrorException with message:', errorMessage);
                                            throw new common_1.InternalServerErrorException("".concat(errorMessage, ". Check server logs for details."));
                                        case 20: return [2 /*return*/];
                                    }
                                });
                            };
                            this_2 = this;
                            _c.label = 1;
                        case 1:
                            if (!(retryCount < maxRetries)) return [3 /*break*/, 3];
                            return [5 /*yield**/, _loop_2()];
                        case 2:
                            state_2 = _c.sent();
                            if (typeof state_2 === "object")
                                return [2 /*return*/, state_2.value];
                            return [3 /*break*/, 1];
                        case 3: 
                        // Should never reach here, but just in case
                        throw new common_1.InternalServerErrorException('Failed to register bulk products after all retry attempts.');
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.rollbackBulkRegistrationByUrn = function (urnNo, manufacturerObjectId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productPlantModel
                                .deleteMany({ urnNo: urnNo, manufacturerId: manufacturerObjectId })
                                .exec()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.productModel
                                    .deleteMany({ urnNo: urnNo, manufacturerId: manufacturerObjectId })
                                    .exec()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.registerBulkProductChunk = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var chunk, chunkSize, totalPlants, _a, productIds, plantIds, now, productDocs, plantMetaByProduct, _loop_3, this_3, i, session, insertedProducts, plantIdIndex, allPlantDocs, i, product, _i, _b, _c, plantDto, eoiNo, categoryObjectId, insertedPlants, _d, plantsByProductId_1, _e, insertedPlants_1, plant, productIdKey, rows, error_3;
                var _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            chunk = params.chunk;
                            chunkSize = chunk.length;
                            totalPlants = chunk.reduce(function (sum, row) { return sum + row.plants.length; }, 0);
                            return [4 /*yield*/, this.validateBulkRegistrationPlantLocations(chunk)];
                        case 1:
                            _g.sent();
                            return [4 /*yield*/, Promise.all([
                                    this.sequenceHelper.reserveSequenceValues('product_id', chunkSize),
                                    totalPlants > 0
                                        ? this.sequenceHelper.reserveSequenceValues('product_plant_id', totalPlants)
                                        : Promise.resolve([]),
                                ])];
                        case 2:
                            _a = _g.sent(), productIds = _a[0], plantIds = _a[1];
                            now = new Date();
                            productDocs = [];
                            plantMetaByProduct = [];
                            _loop_3 = function (i) {
                                var registerProductDto = chunk[i];
                                var globalIndex = params.chunkStartIndex + i;
                                var manufacturerProductCount = params.initialMaxActiveSequence + globalIndex + 1;
                                var eoiNo = (0, eoi_number_service_1.buildEoiNoFromManufacturerProfile)(params.manufacturerProfile, manufacturerProductCount);
                                var categoryObjectId = this_3.toObjectId(registerProductDto.categoryId, 'categoryId');
                                productDocs.push({
                                    productId: productIds[i],
                                    categoryId: categoryObjectId,
                                    vendorId: params.vendorObjectId,
                                    manufacturerId: params.manufacturerObjectId,
                                    eoiNo: eoiNo,
                                    urnNo: params.urnNo,
                                    productName: registerProductDto.productName,
                                    productImage: registerProductDto.productImage,
                                    plantCount: registerProductDto.plants.length,
                                    productDetails: registerProductDto.productDetails,
                                    productType: registerProductDto.productType || 0,
                                    productStatus: 0,
                                    productRenewStatus: 0,
                                    urnStatus: 0,
                                    createdDate: now,
                                    updatedDate: now,
                                });
                                plantMetaByProduct.push(registerProductDto.plants.map(function (plantDto) { return ({
                                    plantDto: plantDto,
                                    eoiNo: eoiNo,
                                    categoryObjectId: categoryObjectId,
                                }); }));
                            };
                            this_3 = this;
                            for (i = 0; i < chunkSize; i++) {
                                _loop_3(i);
                            }
                            return [4 /*yield*/, this.connection.startSession()];
                        case 3:
                            session = _g.sent();
                            session.startTransaction({ maxCommitTimeMS: params.maxCommitTimeMS });
                            _g.label = 4;
                        case 4:
                            _g.trys.push([4, 10, 12, 13]);
                            return [4 /*yield*/, this.productModel.insertMany(productDocs, {
                                    session: session,
                                })];
                        case 5:
                            insertedProducts = _g.sent();
                            plantIdIndex = 0;
                            allPlantDocs = [];
                            for (i = 0; i < chunkSize; i++) {
                                product = insertedProducts[i];
                                for (_i = 0, _b = plantMetaByProduct[i]; _i < _b.length; _i++) {
                                    _c = _b[_i], plantDto = _c.plantDto, eoiNo = _c.eoiNo, categoryObjectId = _c.categoryObjectId;
                                    allPlantDocs.push({
                                        productPlantId: plantIds[plantIdIndex++],
                                        productId: product._id,
                                        vendorId: params.vendorObjectId,
                                        categoryId: categoryObjectId,
                                        manufacturerId: params.manufacturerObjectId,
                                        countryId: this.toObjectId(plantDto.countryId, 'countryId'),
                                        stateId: this.toObjectId(plantDto.stateId, 'stateId'),
                                        urnNo: params.urnNo,
                                        eoiNo: eoiNo,
                                        plantName: plantDto.plantName,
                                        plantLocation: plantDto.plantLocation,
                                        city: plantDto.city,
                                        plantStatus: 1,
                                        createdDate: now,
                                    });
                                }
                            }
                            if (!(allPlantDocs.length > 0)) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.productPlantModel.insertMany(allPlantDocs, { session: session })];
                        case 6:
                            _d = _g.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            _d = [];
                            _g.label = 8;
                        case 8:
                            insertedPlants = _d;
                            return [4 /*yield*/, session.commitTransaction()];
                        case 9:
                            _g.sent();
                            plantsByProductId_1 = new Map();
                            for (_e = 0, insertedPlants_1 = insertedPlants; _e < insertedPlants_1.length; _e++) {
                                plant = insertedPlants_1[_e];
                                productIdKey = String(plant.productId);
                                rows = (_f = plantsByProductId_1.get(productIdKey)) !== null && _f !== void 0 ? _f : [];
                                rows.push((typeof plant.toObject === 'function'
                                    ? plant.toObject()
                                    : __assign({}, plant)));
                                plantsByProductId_1.set(productIdKey, rows);
                            }
                            return [2 /*return*/, insertedProducts.map(function (product) {
                                    var _a;
                                    var productIdKey = String(product._id);
                                    var productObj = typeof product.toObject === 'function'
                                        ? product.toObject()
                                        : __assign({}, product);
                                    return __assign(__assign({}, productObj), { plants: (_a = plantsByProductId_1.get(productIdKey)) !== null && _a !== void 0 ? _a : [] });
                                })];
                        case 10:
                            error_3 = _g.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 11:
                            _g.sent();
                            throw error_3;
                        case 12:
                            session.endSession();
                            return [7 /*endfinally*/];
                        case 13: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Update an existing product in place (admin EOI edit).
         * URN and EOI are immutable — body urnNo/eoiNo must match the document.
         */
        ProductRegistrationService_1.prototype.updateProduct = function (productId, updateProductDto) {
            return __awaiter(this, void 0, void 0, function () {
                var session, productObjectId, existingProduct, providedEoi, storedEoi, previousUrnStatus, categoryChangeMeta, nextProductName, storedProductName, updateData, syncValidityToUrn, newValidTill, previous, nextTime, notify, urnNoForBlock, manufacturerObjectId, categoryBlockReason, urnSiblings, categoryObjectId, categoryExists, previousCategoryId, categoryChanged, previousCategory, _a, urnNo, manufacturerId, previousCategoryTotals, _b, cleanup, urnProductMatch, urnProductIds, syncedProducts, newCategoryTotals, previousForms, newForms, addedRawMaterialSteps, updatedProduct, urnNo, manufacturerId, newCategoryObjectId, _c, urnNo, urnStatus, error_4;
                var _d, _e;
                var _this = this;
                var _f, _g, _h, _j, _k, _l, _m, _o, _p;
                return __generator(this, function (_q) {
                    switch (_q.label) {
                        case 0: return [4 /*yield*/, this.connection.startSession()];
                        case 1:
                            session = _q.sent();
                            session.startTransaction();
                            _q.label = 2;
                        case 2:
                            _q.trys.push([2, 40, , 42]);
                            productObjectId = this.toObjectId(productId, 'productId');
                            return [4 /*yield*/, this.productModel
                                    .findById(productObjectId)
                                    .session(session)
                                    .exec()];
                        case 3:
                            existingProduct = _q.sent();
                            if (!existingProduct) {
                                throw new common_1.NotFoundException('Product not found');
                            }
                            if (!this.urnValuesMatch(existingProduct.urnNo, updateProductDto.urnNo)) {
                                throw new common_1.BadRequestException('urnNo does not match this product');
                            }
                            providedEoi = String((_f = updateProductDto.eoiNo) !== null && _f !== void 0 ? _f : '').trim();
                            storedEoi = String((_g = existingProduct.eoiNo) !== null && _g !== void 0 ? _g : '').trim();
                            if (!providedEoi || providedEoi !== storedEoi) {
                                throw new common_1.BadRequestException('eoiNo does not match this product');
                            }
                            previousUrnStatus = existingProduct.urnStatus;
                            categoryChangeMeta = void 0;
                            nextProductName = (0, product_name_uniqueness_util_1.normalizeProductNameForComparison)(updateProductDto.productName);
                            storedProductName = (0, product_name_uniqueness_util_1.normalizeProductNameForComparison)(existingProduct.productName);
                            if (!(nextProductName &&
                                nextProductName.localeCompare(storedProductName, undefined, {
                                    sensitivity: 'accent',
                                }) !== 0)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.assertProductNameIsUnique(nextProductName, productObjectId, 'productName')];
                        case 4:
                            _q.sent();
                            _q.label = 5;
                        case 5:
                            updateData = {
                                updatedDate: new Date(),
                                productName: updateProductDto.productName,
                                productDetails: updateProductDto.productDetails,
                            };
                            if (updateProductDto.productImage !== undefined) {
                                updateData.productImage = updateProductDto.productImage;
                            }
                            if (updateProductDto.productDetails !== undefined) {
                                updateData.productDetails = updateProductDto.productDetails;
                            }
                            if (updateProductDto.productType !== undefined) {
                                updateData.productType = updateProductDto.productType;
                            }
                            if (updateProductDto.productStatus !== undefined) {
                                updateData.productStatus = updateProductDto.productStatus;
                            }
                            if (updateProductDto.productRenewStatus !== undefined) {
                                updateData.productRenewStatus = updateProductDto.productRenewStatus;
                            }
                            if (updateProductDto.urnStatus !== undefined) {
                                updateData.urnStatus = updateProductDto.urnStatus;
                            }
                            if (updateProductDto.assessmentReportUrl !== undefined) {
                                updateData.assessmentReportUrl = updateProductDto.assessmentReportUrl;
                            }
                            if (updateProductDto.rejectedDetails !== undefined) {
                                updateData.rejectedDetails = updateProductDto.rejectedDetails;
                            }
                            this.applyOptionalDateField(updateData, 'certifiedDate', updateProductDto.certifiedDate);
                            this.applyOptionalDateField(updateData, 'validtillDate', updateProductDto.validtillDate);
                            syncValidityToUrn = false;
                            if (updateProductDto.validtillDate !== undefined) {
                                newValidTill = updateData.validtillDate;
                                if (newValidTill) {
                                    previous = existingProduct.validtillDate
                                        ? new Date(existingProduct.validtillDate).getTime()
                                        : null;
                                    nextTime = newValidTill.getTime();
                                    if (previous !== nextTime) {
                                        notify = (0, certification_dates_util_1.computeNotifyDates)(newValidTill);
                                        updateData.firstNotifyDate = notify.firstNotifyDate;
                                        updateData.secondNotifyDate = notify.secondNotifyDate;
                                        updateData.thirdNotifyDate = notify.thirdNotifyDate;
                                        syncValidityToUrn = true;
                                    }
                                }
                            }
                            else {
                                this.applyOptionalDateField(updateData, 'firstNotifyDate', updateProductDto.firstNotifyDate);
                                this.applyOptionalDateField(updateData, 'secondNotifyDate', updateProductDto.secondNotifyDate);
                                this.applyOptionalDateField(updateData, 'thirdNotifyDate', updateProductDto.thirdNotifyDate);
                            }
                            this.applyOptionalDateField(updateData, 'renewedDate', updateProductDto.renewedDate);
                            if (!(updateProductDto.categoryId !== undefined)) return [3 /*break*/, 26];
                            urnNoForBlock = String((_h = existingProduct.urnNo) !== null && _h !== void 0 ? _h : '').trim();
                            manufacturerObjectId = existingProduct.manufacturerId;
                            categoryBlockReason = null;
                            if (!urnNoForBlock) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.productModel
                                    .find((0, active_product_filter_1.matchActiveProducts)({
                                    urnNo: urnNoForBlock,
                                    manufacturerId: manufacturerObjectId,
                                }))
                                    .session(session)
                                    .select('productStatus urnStatus')
                                    .lean()
                                    .exec()];
                        case 6:
                            urnSiblings = _q.sent();
                            categoryBlockReason = (0, category_change_util_1.resolveCategoryChangeBlockReasonForUrn)({
                                productStatus: existingProduct.productStatus,
                                urnStatuses: urnSiblings.map(function (row) { var _a; return Number((_a = row.urnStatus) !== null && _a !== void 0 ? _a : 0); }),
                                anyProductCertified: urnSiblings.some(function (row) { return Number(row.productStatus) === product_status_constants_1.PRODUCT_STATUS_CERTIFIED; }),
                            });
                            return [3 /*break*/, 8];
                        case 7:
                            categoryBlockReason = (0, category_change_util_1.resolveCategoryChangeBlockReason)({
                                productStatus: existingProduct.productStatus,
                                urnStatus: existingProduct.urnStatus,
                            });
                            _q.label = 8;
                        case 8:
                            if (categoryBlockReason) {
                                throw new common_1.BadRequestException(categoryBlockReason);
                            }
                            categoryObjectId = this.toObjectId(updateProductDto.categoryId, 'categoryId');
                            return [4 /*yield*/, this.categoryModel
                                    .findById(categoryObjectId)
                                    .session(session)
                                    .select('_id category_raw_material_forms')
                                    .lean()
                                    .exec()];
                        case 9:
                            categoryExists = _q.sent();
                            if (!categoryExists) {
                                throw new common_1.BadRequestException('Category not found');
                            }
                            previousCategoryId = existingProduct.categoryId;
                            categoryChanged = !(0, category_change_util_1.categoryObjectIdsEqual)(previousCategoryId, categoryObjectId);
                            if (!categoryChanged) return [3 /*break*/, 25];
                            if (!previousCategoryId) return [3 /*break*/, 11];
                            return [4 /*yield*/, this.categoryModel
                                    .findById(previousCategoryId)
                                    .session(session)
                                    .select('category_raw_material_forms')
                                    .lean()
                                    .exec()];
                        case 10:
                            _a = _q.sent();
                            return [3 /*break*/, 12];
                        case 11:
                            _a = null;
                            _q.label = 12;
                        case 12:
                            previousCategory = _a;
                            urnNo = String((_j = existingProduct.urnNo) !== null && _j !== void 0 ? _j : '').trim();
                            manufacturerId = existingProduct.manufacturerId;
                            if (!previousCategoryId) return [3 /*break*/, 14];
                            return [4 /*yield*/, this.countManufacturerCategoryTotals(manufacturerId, previousCategoryId)];
                        case 13:
                            _b = _q.sent();
                            return [3 /*break*/, 15];
                        case 14:
                            _b = null;
                            _q.label = 15;
                        case 15:
                            previousCategoryTotals = _b;
                            if (!urnNo) return [3 /*break*/, 23];
                            return [4 /*yield*/, this.categoryChangeCleanupService.purgeForCategoryChange({
                                    urnNo: urnNo,
                                    vendorId: existingProduct.vendorId,
                                    previousCategoryRawMaterialForms: previousCategory === null || previousCategory === void 0 ? void 0 : previousCategory.category_raw_material_forms,
                                    newCategoryRawMaterialForms: categoryExists.category_raw_material_forms,
                                    session: session,
                                })];
                        case 16:
                            cleanup = _q.sent();
                            urnProductMatch = (0, active_product_filter_1.matchActiveProducts)({
                                urnNo: urnNo,
                                manufacturerId: manufacturerId,
                            });
                            return [4 /*yield*/, this.productModel
                                    .updateMany(urnProductMatch, {
                                    $set: {
                                        categoryId: categoryObjectId,
                                        updatedDate: new Date(),
                                    },
                                }, { session: session })
                                    .exec()];
                        case 17:
                            _q.sent();
                            return [4 /*yield*/, this.productModel
                                    .find(urnProductMatch)
                                    .session(session)
                                    .distinct('_id')
                                    .exec()];
                        case 18:
                            urnProductIds = _q.sent();
                            if (!(urnProductIds.length > 0)) return [3 /*break*/, 20];
                            return [4 /*yield*/, this.productPlantModel
                                    .updateMany((0, active_product_filter_1.matchActiveProductPlants)({
                                    productId: { $in: urnProductIds },
                                }), { $set: { categoryId: categoryObjectId } }, { session: session })
                                    .exec()];
                        case 19:
                            _q.sent();
                            _q.label = 20;
                        case 20: return [4 /*yield*/, this.productModel
                                .find(urnProductMatch)
                                .session(session)
                                .select('_id eoiNo categoryId')
                                .lean()
                                .exec()];
                        case 21:
                            syncedProducts = _q.sent();
                            return [4 /*yield*/, this.countManufacturerCategoryTotals(manufacturerId, categoryObjectId)];
                        case 22:
                            newCategoryTotals = _q.sent();
                            categoryChangeMeta = __assign(__assign({ changed: true, listRefreshRequired: true, categorySyncedAcrossUrn: true, syncedEoiCount: syncedProducts.length, syncedEoiNos: syncedProducts
                                    .map(function (row) { var _a; return String((_a = row.eoiNo) !== null && _a !== void 0 ? _a : '').trim(); })
                                    .filter(Boolean), syncedProductIds: syncedProducts.map(function (row) { return String(row._id); }), previousCategoryId: previousCategoryId
                                    ? String(previousCategoryId)
                                    : null, newCategoryId: String(categoryObjectId), manufacturerListTotals: {
                                    previousCategory: previousCategoryTotals,
                                    newCategory: newCategoryTotals,
                                } }, cleanup), { vendorMustRefillRawMaterials: cleanup.addedRawMaterialSteps.length > 0 });
                            return [3 /*break*/, 25];
                        case 23:
                            previousForms = previousCategory === null || previousCategory === void 0 ? void 0 : previousCategory.category_raw_material_forms;
                            newForms = categoryExists.category_raw_material_forms;
                            addedRawMaterialSteps = (0, category_change_util_1.addedRawMaterialStepsOnCategoryChange)(previousForms, newForms);
                            _d = {
                                changed: true,
                                listRefreshRequired: true,
                                vendorMustRefillRawMaterials: addedRawMaterialSteps.length > 0,
                                previousCategoryId: previousCategoryId
                                    ? String(previousCategoryId)
                                    : null,
                                newCategoryId: String(categoryObjectId)
                            };
                            _e = {
                                previousCategory: previousCategoryTotals
                            };
                            return [4 /*yield*/, this.countManufacturerCategoryTotals(manufacturerId, categoryObjectId)];
                        case 24:
                            categoryChangeMeta = (_d.manufacturerListTotals = (_e.newCategory = _q.sent(),
                                _e),
                                _d.purgedSteps = (0, category_change_util_1.stepsToPurgeOnCategoryChange)(previousForms, newForms),
                                _d.retainedRawMaterialSteps = (0, category_change_util_1.retainedRawMaterialStepsOnCategoryChange)(previousForms, newForms),
                                _d.addedRawMaterialSteps = addedRawMaterialSteps,
                                _d.visibleRawMaterialSteps = (0, category_change_util_1.visibleStepsForCategory)(newForms),
                                _d.documentsRemoved = 0,
                                _d.recordsRemovedByCollection = {},
                                _d.rawMaterialReviewsRemoved = 0,
                                _d);
                            _q.label = 25;
                        case 25:
                            updateData.categoryId = categoryObjectId;
                            _q.label = 26;
                        case 26: return [4 /*yield*/, this.productModel
                                .findByIdAndUpdate(productObjectId, updateData, { new: true, session: session })
                                .exec()];
                        case 27:
                            updatedProduct = _q.sent();
                            if (!updatedProduct) {
                                throw new common_1.NotFoundException('Product not found after update');
                            }
                            if (!(updateProductDto.categoryId !== undefined)) return [3 /*break*/, 29];
                            return [4 /*yield*/, this.productPlantModel
                                    .updateMany((0, active_product_filter_1.matchActiveProductPlants)({ productId: productObjectId }), {
                                    $set: {
                                        categoryId: updateData.categoryId,
                                    },
                                }, { session: session })
                                    .exec()];
                        case 28:
                            _q.sent();
                            _q.label = 29;
                        case 29:
                            if (!syncValidityToUrn) return [3 /*break*/, 31];
                            urnNo = String((_k = existingProduct.urnNo) !== null && _k !== void 0 ? _k : '').trim();
                            if (!urnNo) return [3 /*break*/, 31];
                            return [4 /*yield*/, this.productModel
                                    .updateMany((0, active_product_filter_1.matchActiveProducts)({
                                    urnNo: urnNo,
                                    productStatus: 2,
                                }), {
                                    $set: {
                                        validtillDate: updateData.validtillDate,
                                        firstNotifyDate: updateData.firstNotifyDate,
                                        secondNotifyDate: updateData.secondNotifyDate,
                                        thirdNotifyDate: updateData.thirdNotifyDate,
                                        updatedDate: new Date(),
                                    },
                                }, { session: session })
                                    .exec()];
                        case 30:
                            _q.sent();
                            _q.label = 31;
                        case 31: return [4 /*yield*/, session.commitTransaction()];
                        case 32:
                            _q.sent();
                            session.endSession();
                            if (!(categoryChangeMeta === null || categoryChangeMeta === void 0 ? void 0 : categoryChangeMeta.changed)) return [3 /*break*/, 36];
                            manufacturerId = existingProduct.manufacturerId;
                            newCategoryObjectId = this.toObjectId(String((_l = categoryChangeMeta.newCategoryId) !== null && _l !== void 0 ? _l : ''), 'categoryId');
                            if (!(categoryChangeMeta.manufacturerListTotals &&
                                typeof categoryChangeMeta.manufacturerListTotals === 'object')) return [3 /*break*/, 34];
                            _c = categoryChangeMeta.manufacturerListTotals;
                            return [4 /*yield*/, this.countManufacturerCategoryTotals(manufacturerId, newCategoryObjectId)];
                        case 33:
                            _c.newCategory = _q.sent();
                            _q.label = 34;
                        case 34:
                            urnNo = String((_m = existingProduct.urnNo) !== null && _m !== void 0 ? _m : '').trim();
                            urnStatus = Number((_o = updatedProduct.urnStatus) !== null && _o !== void 0 ? _o : 0);
                            if (!(urnNo &&
                                urnStatus < category_change_constants_1.CATEGORY_CHANGE_LOCKED_MIN_URN_STATUS &&
                                !(0, renewal_urn_status_constants_2.isRenewalUrnStatus)(urnStatus))) return [3 /*break*/, 36];
                            return [4 /*yield*/, this.urnTabReviewService
                                    .ensurePendingReviewsForUrn(urnNo)
                                    .catch(function (err) {
                                    return _this.logger.warn("[Update Product] Tab review re-init after category change failed: ".concat(err.message));
                                })];
                        case 35:
                            _q.sent();
                            _q.label = 36;
                        case 36:
                            if (!(updateProductDto.urnStatus !== undefined &&
                                updatedProduct.urnStatus !== previousUrnStatus)) return [3 /*break*/, 38];
                            return [4 /*yield*/, this.tryLogUrnLifecycleStep(existingProduct.vendorId, existingProduct.manufacturerId, updatedProduct.urnNo, updatedProduct.urnStatus, previousUrnStatus)];
                        case 37:
                            _q.sent();
                            _q.label = 38;
                        case 38: return [4 /*yield*/, this.invalidateProductListingsCache()];
                        case 39:
                            _q.sent();
                            return [2 /*return*/, __assign(__assign({}, updatedProduct.toObject()), (categoryChangeMeta ? { categoryChange: categoryChangeMeta } : {}))];
                        case 40:
                            error_4 = _q.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 41:
                            _q.sent();
                            session.endSession();
                            if (error_4 instanceof common_1.NotFoundException ||
                                error_4 instanceof common_1.BadRequestException) {
                                throw error_4;
                            }
                            // Log the actual error for debugging
                            console.error('Product update error:', error_4);
                            console.error('Error stack:', error_4.stack);
                            // Check for specific error types
                            if (error_4.name === 'CastError' ||
                                ((_p = error_4.message) === null || _p === void 0 ? void 0 : _p.includes('Cast to ObjectId'))) {
                                throw new common_1.BadRequestException('Invalid product ID format');
                            }
                            throw new common_1.InternalServerErrorException(error_4.message ||
                                'Failed to update product. Please check the logs for details.');
                        case 42: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Admin: edit a certified product (productStatus === 2 only).
         * Updates name, description, category, valid till, and optional image; reuses updateProduct transaction logic.
         */
        ProductRegistrationService_1.prototype.buildUrnAssessmentReportDocumentPayload = function (assessmentReportUrl, documentOriginalName) {
            var link = String(assessmentReportUrl !== null && assessmentReportUrl !== void 0 ? assessmentReportUrl : '').trim();
            var originalName = String(documentOriginalName !== null && documentOriginalName !== void 0 ? documentOriginalName : '').trim() ||
                link.replace(/\\/g, '/').split('/').filter(Boolean).pop() ||
                'Assessment report';
            return {
                documentForm: 'certification_admin',
                documentFormSubsection: 'assessment_report',
                documentLink: link,
                documentOriginalName: originalName,
            };
        };
        ProductRegistrationService_1.prototype.adminUploadUrnAssessmentReport = function (urnNo, file) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmedUrn, products, urnStatus, uploaded, assessmentReportUrl, previousUrl, assessmentReport;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            trimmedUrn = String(urnNo !== null && urnNo !== void 0 ? urnNo : '').trim();
                            if (!trimmedUrn) {
                                throw new common_1.BadRequestException('URN number is required');
                            }
                            return [4 /*yield*/, this.productModel
                                    .find((0, active_product_filter_1.matchActiveProducts)({ urnNo: trimmedUrn }))
                                    .select('_id urnStatus assessmentReportUrl')
                                    .lean()
                                    .exec()];
                        case 1:
                            products = _d.sent();
                            if (!products.length) {
                                throw new common_1.NotFoundException('No products found for this URN');
                            }
                            urnStatus = Math.max.apply(Math, products.map(function (row) { var _a; return Number((_a = row.urnStatus) !== null && _a !== void 0 ? _a : 0); }));
                            if (urnStatus < 11) {
                                throw new common_1.BadRequestException('Assessment report can only be uploaded after certification is complete');
                            }
                            return [4 /*yield*/, (0, upload_file_util_1.uploadUrnAssessmentReport)(file, trimmedUrn)];
                        case 2:
                            uploaded = _d.sent();
                            assessmentReportUrl = (0, upload_file_util_1.resolveStoredUploadUrl)(uploaded.fileUrl) || uploaded.fileUrl;
                            previousUrl = String((_b = (_a = products.find(function (row) { return row.assessmentReportUrl; })) === null || _a === void 0 ? void 0 : _a.assessmentReportUrl) !== null && _b !== void 0 ? _b : '').trim();
                            if (!(previousUrl && previousUrl !== assessmentReportUrl)) return [3 /*break*/, 4];
                            return [4 /*yield*/, (0, upload_file_util_1.deleteUploadedFileByDocumentLink)(previousUrl)];
                        case 3:
                            _d.sent();
                            _d.label = 4;
                        case 4: return [4 /*yield*/, this.productModel
                                .updateMany((0, active_product_filter_1.matchActiveProducts)({ urnNo: trimmedUrn }), {
                                $set: {
                                    assessmentReportUrl: assessmentReportUrl,
                                    updatedDate: new Date(),
                                },
                            })
                                .exec()];
                        case 5:
                            _d.sent();
                            assessmentReport = this.buildUrnAssessmentReportDocumentPayload(assessmentReportUrl, String((_c = file.originalname) !== null && _c !== void 0 ? _c : '').trim() || uploaded.fileName);
                            return [4 /*yield*/, this.invalidateProductListingsCache()];
                        case 6:
                            _d.sent();
                            return [2 /*return*/, {
                                    urnNo: trimmedUrn,
                                    assessmentReportUrl: assessmentReportUrl,
                                    assessmentReportFileName: uploaded.fileName,
                                    assessmentReport: assessmentReport,
                                    urnAssessmentReport: assessmentReport,
                                }];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.adminPatchCertifiedProduct = function (productId, dto, imageFile) {
            return __awaiter(this, void 0, void 0, function () {
                var productObjectId, existing, existingImage, _a, removeImage, productImage, uploaded, validTillRaw, updateDto, row;
                var _this = this;
                var _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            productObjectId = this.toObjectId(productId, 'productId');
                            return [4 /*yield*/, this.productModel
                                    .findById(productObjectId)
                                    .select('productStatus urnNo eoiNo categoryId')
                                    .lean()
                                    .exec()];
                        case 1:
                            existing = _e.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException('Product not found');
                            }
                            if (Number(existing.productStatus) !== 2) {
                                throw new common_1.BadRequestException('Only certified products (productStatus 2) can be edited from the admin certified list');
                            }
                            if (dto.categoryId != null &&
                                !(0, category_change_util_1.categoryObjectIdsEqual)(existing.categoryId, dto.categoryId)) {
                                throw new common_1.BadRequestException(category_change_constants_1.CATEGORY_CHANGE_CERTIFIED_MESSAGE);
                            }
                            _a = String;
                            return [4 /*yield*/, this.productModel
                                    .findById(productObjectId)
                                    .select('productImage')
                                    .lean()
                                    .exec()];
                        case 2:
                            existingImage = _a.apply(void 0, [(_c = (_b = (_e.sent())) === null || _b === void 0 ? void 0 : _b.productImage) !== null && _c !== void 0 ? _c : '']).trim();
                            removeImage = this.multipartTruthy(dto.remove_image) ||
                                this.multipartTruthy(dto.delete_image);
                            if (!imageFile) return [3 /*break*/, 6];
                            return [4 /*yield*/, (0, upload_file_util_1.uploadCertifiedProductImage)(imageFile)];
                        case 3:
                            uploaded = _e.sent();
                            productImage = uploaded.fileUrl;
                            if (!(existingImage && existingImage !== productImage)) return [3 /*break*/, 5];
                            return [4 /*yield*/, (0, upload_file_util_1.deleteUploadedFileByDocumentLink)(existingImage)];
                        case 4:
                            _e.sent();
                            _e.label = 5;
                        case 5: return [3 /*break*/, 8];
                        case 6:
                            if (!removeImage) return [3 /*break*/, 8];
                            productImage = '';
                            if (!existingImage) return [3 /*break*/, 8];
                            return [4 /*yield*/, (0, upload_file_util_1.deleteUploadedFileByDocumentLink)(existingImage)];
                        case 7:
                            _e.sent();
                            _e.label = 8;
                        case 8:
                            validTillRaw = (_d = dto.validtillDate) !== null && _d !== void 0 ? _d : dto.validTillDate;
                            updateDto = __assign({ productName: dto.productName.trim(), productDetails: dto.productDetails, urnNo: String(dto.urnNo).trim(), eoiNo: String(dto.eoiNo).trim(), validtillDate: validTillRaw }, (productImage !== undefined ? { productImage: productImage } : {}));
                            return [4 /*yield*/, this.updateProduct(productId, updateDto)];
                        case 9:
                            _e.sent();
                            return [4 /*yield*/, this.productModel
                                    .findById(productObjectId)
                                    .select('_id urnNo eoiNo productName productDetails categoryId productImage productStatus validtillDate updatedDate')
                                    .lean()
                                    .exec()];
                        case 10:
                            row = _e.sent();
                            if (!row) {
                                throw new common_1.NotFoundException('Product not found after update');
                            }
                            return [2 /*return*/, (0, format_admin_certified_product_patch_util_1.formatAdminCertifiedProductPatchResponse)(row, function (value) { return _this.toMongoIdString(value); })];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.adminUpdateCertifiedProductPassport = function (productId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var productObjectId, passport, nonWhitespaceLength, updated;
                var _a, _b, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            productObjectId = this.toObjectId(productId, 'productId');
                            passport = String((_a = dto.passport) !== null && _a !== void 0 ? _a : '');
                            nonWhitespaceLength = passport.replace(/\s+/g, '').length;
                            return [4 /*yield*/, this.productModel
                                    .findOneAndUpdate((0, active_product_filter_1.matchActiveProducts)({
                                    _id: productObjectId,
                                    productStatus: 2,
                                }), {
                                    $set: {
                                        productPassport: passport,
                                        updatedDate: new Date(),
                                    },
                                }, { new: true })
                                    .select('_id urnNo eoiNo productName productStatus productPassport updatedDate')
                                    .lean()
                                    .exec()];
                        case 1:
                            updated = _h.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Certified product not found. Passport is allowed only for certified products');
                            }
                            return [4 /*yield*/, this.invalidateProductListingsCache()];
                        case 2:
                            _h.sent();
                            return [2 /*return*/, {
                                    _id: this.toMongoIdString(updated._id),
                                    urnNo: String((_b = updated.urnNo) !== null && _b !== void 0 ? _b : ''),
                                    eoiNo: String((_c = updated.eoiNo) !== null && _c !== void 0 ? _c : ''),
                                    productName: String((_d = updated.productName) !== null && _d !== void 0 ? _d : ''),
                                    productStatus: Number((_e = updated.productStatus) !== null && _e !== void 0 ? _e : 0),
                                    passport: String((_f = updated.productPassport) !== null && _f !== void 0 ? _f : ''),
                                    nonWhitespaceLength: nonWhitespaceLength,
                                    updatedDate: (_g = updated.updatedDate) !== null && _g !== void 0 ? _g : null,
                                }];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.getPublicCertifiedProductPassport = function (productId) {
            return __awaiter(this, void 0, void 0, function () {
                var productObjectId, row, manufacturerVisible, productImageRaw, productImage, manufacturer;
                var _a, _b, _c, _d, _e, _f, _g, _h;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            productObjectId = this.toObjectId(productId, 'productId');
                            return [4 /*yield*/, this.productModel
                                    .findOne((0, active_product_filter_1.matchActiveProducts)({
                                    _id: productObjectId,
                                    productStatus: 2,
                                }))
                                    .select('_id urnNo eoiNo productName productImage validtillDate productPassport productDetails productStatus manufacturerId')
                                    .lean()
                                    .exec()];
                        case 1:
                            row = _j.sent();
                            if (!row) {
                                throw new common_1.NotFoundException('Certified product not found');
                            }
                            return [4 /*yield*/, this.isManufacturerVisibleOnPublicWebsite(row.manufacturerId)];
                        case 2:
                            manufacturerVisible = _j.sent();
                            if (!manufacturerVisible) {
                                throw new common_1.NotFoundException('Certified product not found');
                            }
                            productImageRaw = row.productImage ? String(row.productImage).trim() : '';
                            productImage = productImageRaw
                                ? (0, upload_file_util_1.resolveStoredUploadUrl)(productImageRaw) || productImageRaw
                                : null;
                            return [4 /*yield*/, this.getPublicManufacturerDetailsForProduct(row.manufacturerId)];
                        case 3:
                            manufacturer = _j.sent();
                            return [2 /*return*/, {
                                    _id: this.toMongoIdString(row._id),
                                    urnNo: String((_a = row.urnNo) !== null && _a !== void 0 ? _a : ''),
                                    eoiNo: String((_b = row.eoiNo) !== null && _b !== void 0 ? _b : ''),
                                    productName: String((_c = row.productName) !== null && _c !== void 0 ? _c : ''),
                                    productImage: productImage,
                                    productImageUrl: productImage,
                                    validtillDate: (_d = row.validtillDate) !== null && _d !== void 0 ? _d : null,
                                    passport: String((_e = row.productPassport) !== null && _e !== void 0 ? _e : ''),
                                    productDetails: String((_f = row.productDetails) !== null && _f !== void 0 ? _f : '').trim() || null,
                                    productStatus: Number((_g = row.productStatus) !== null && _g !== void 0 ? _g : 0),
                                    manufacturerName: (_h = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.manufacturerName) !== null && _h !== void 0 ? _h : '',
                                    manufacturer: manufacturer,
                                    manufacturer_details: manufacturer,
                                }];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.isManufacturerVisibleOnPublicWebsite = function (manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var id, m;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            id = String(manufacturerId !== null && manufacturerId !== void 0 ? manufacturerId : '').trim();
                            if (!id || !mongoose_1.Types.ObjectId.isValid(id)) {
                                return [2 /*return*/, false];
                            }
                            return [4 /*yield*/, this.manufacturerModel
                                    .findOne(__assign({ _id: new mongoose_1.Types.ObjectId(id) }, (0, public_website_manufacturer_visibility_filter_1.matchPublicWebsiteManufacturerVisibility)('')))
                                    .select('_id')
                                    .lean()
                                    .exec()];
                        case 1:
                            m = _a.sent();
                            return [2 /*return*/, Boolean(m)];
                    }
                });
            });
        };
        /**
         * Public-safe manufacturer details for the website product detail page:
         * name, logo, website, and social links only (no emails/phones/documents).
         */
        ProductRegistrationService_1.prototype.getPublicManufacturerDetailsForProduct = function (manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var id, m, manufacturerImageRaw, companyLogoRaw;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                return __generator(this, function (_p) {
                    switch (_p.label) {
                        case 0:
                            id = String(manufacturerId !== null && manufacturerId !== void 0 ? manufacturerId : '').trim();
                            if (!id || !mongoose_1.Types.ObjectId.isValid(id)) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, this.manufacturerModel
                                    .findById(id)
                                    .select('manufacturerName manufacturerImage companyLogo vendor_website vendor_facebook vendor_youtube vendor_twitter vendor_linkedin manufacturerStatus')
                                    .lean()
                                    .exec()];
                        case 1:
                            m = _p.sent();
                            if (!m) {
                                return [2 /*return*/, null];
                            }
                            manufacturerImageRaw = String((_a = m.manufacturerImage) !== null && _a !== void 0 ? _a : '').trim();
                            companyLogoRaw = String((_b = m.companyLogo) !== null && _b !== void 0 ? _b : '').trim();
                            return [2 /*return*/, {
                                    _id: this.toMongoIdString(m._id),
                                    manufacturerName: String((_c = m.manufacturerName) !== null && _c !== void 0 ? _c : '').trim(),
                                    manufacturerImage: manufacturerImageRaw
                                        ? (0, upload_file_util_1.resolveStoredUploadUrl)(manufacturerImageRaw) || manufacturerImageRaw
                                        : null,
                                    companyLogo: companyLogoRaw
                                        ? (0, upload_file_util_1.resolveStoredUploadUrl)(companyLogoRaw) || companyLogoRaw
                                        : null,
                                    website: String((_d = m.vendor_website) !== null && _d !== void 0 ? _d : '').trim(),
                                    vendor_website: String((_e = m.vendor_website) !== null && _e !== void 0 ? _e : '').trim(),
                                    facebook: String((_f = m.vendor_facebook) !== null && _f !== void 0 ? _f : '').trim(),
                                    vendor_facebook: String((_g = m.vendor_facebook) !== null && _g !== void 0 ? _g : '').trim(),
                                    youtube: String((_h = m.vendor_youtube) !== null && _h !== void 0 ? _h : '').trim(),
                                    vendor_youtube: String((_j = m.vendor_youtube) !== null && _j !== void 0 ? _j : '').trim(),
                                    twitter: String((_k = m.vendor_twitter) !== null && _k !== void 0 ? _k : '').trim(),
                                    vendor_twitter: String((_l = m.vendor_twitter) !== null && _l !== void 0 ? _l : '').trim(),
                                    linkedin: String((_m = m.vendor_linkedin) !== null && _m !== void 0 ? _m : '').trim(),
                                    vendor_linkedin: String((_o = m.vendor_linkedin) !== null && _o !== void 0 ? _o : '').trim(),
                                }];
                    }
                });
            });
        };
        /**
         * Map a state row to its parent country Mongo _id (supports legacy country_id / country_code / country_name).
         */
        ProductRegistrationService_1.prototype.resolveCountryMongoIdForState = function (state, countryMongoIds, countryByNumericId, countryByCode, countryByName) {
            var _a, _b, _c, _d, _e;
            var objectIdRaw = state.countryId;
            if (objectIdRaw) {
                var key = String(objectIdRaw);
                if (countryMongoIds.has(key)) {
                    return key;
                }
            }
            var numericCountryId = Number(state.country_id);
            if (Number.isFinite(numericCountryId) && countryByNumericId.has(numericCountryId)) {
                return (_a = countryByNumericId.get(numericCountryId)) !== null && _a !== void 0 ? _a : null;
            }
            var code = String((_b = state.country_code) !== null && _b !== void 0 ? _b : '')
                .trim()
                .toUpperCase();
            if (code && countryByCode.has(code)) {
                return (_c = countryByCode.get(code)) !== null && _c !== void 0 ? _c : null;
            }
            var countryName = String((_d = state.country_name) !== null && _d !== void 0 ? _d : '')
                .trim()
                .toLowerCase();
            if (countryName && countryByName.has(countryName)) {
                return (_e = countryByName.get(countryName)) !== null && _e !== void 0 ? _e : null;
            }
            return null;
        };
        /**
         * Public website filter panel: active categories + country/state tree (from DB).
         */
        ProductRegistrationService_1.prototype.getPublicCertifiedWebsiteFilterOptions = function () {
            return __awaiter(this, void 0, void 0, function () {
                var categoryIdsWithProducts, categories, _a, categoryOptions, _b, countries, states, countryMongoIds, countryByNumericId, countryByCode, countryByName, _i, _c, country, c, mongoId, codes, _d, codes_1, code, names, _e, names_1, name_1, statesByCountry, _f, countryMongoIds_1, countryId, statesLinked, statesUnmapped, _g, _h, state, s, stateLabel, countryKey, bucket, _j, statesByCountry_1, _k, list, countryStateTree, countriesWithStates;
                var _l, _m, _o, _p;
                return __generator(this, function (_q) {
                    switch (_q.label) {
                        case 0: return [4 /*yield*/, this.productModel
                                .distinct('categoryId', (0, website_public_product_filter_1.matchWebsitePublicActiveCertifiedProducts)())
                                .exec()];
                        case 1:
                            categoryIdsWithProducts = _q.sent();
                            if (!(categoryIdsWithProducts.length > 0)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.categoryModel
                                    .find({
                                    _id: { $in: categoryIdsWithProducts },
                                    category_status: 1,
                                })
                                    .select('_id category_name')
                                    .sort({ category_name: 1 })
                                    .lean()
                                    .exec()];
                        case 2:
                            _a = _q.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a = [];
                            _q.label = 4;
                        case 4:
                            categories = _a;
                            categoryOptions = categories.map(function (c) {
                                var _a;
                                return ({
                                    id: String(c._id),
                                    label: String((_a = c.category_name) !== null && _a !== void 0 ? _a : '').trim() ||
                                        'Category',
                                });
                            });
                            return [4 /*yield*/, Promise.all([
                                    this.countriesService.findAllForFilterOptions(),
                                    this.statesService.findAllForFilterOptions(),
                                ])];
                        case 5:
                            _b = _q.sent(), countries = _b[0], states = _b[1];
                            countryMongoIds = new Set();
                            countryByNumericId = new Map();
                            countryByCode = new Map();
                            countryByName = new Map();
                            for (_i = 0, _c = countries !== null && countries !== void 0 ? countries : []; _i < _c.length; _i++) {
                                country = _c[_i];
                                c = country;
                                mongoId = String(c._id);
                                countryMongoIds.add(mongoId);
                                if (c.id != null && Number.isFinite(Number(c.id))) {
                                    countryByNumericId.set(Number(c.id), mongoId);
                                }
                                codes = [c.countryCode, c.country_code, c.iso2, c.iso3]
                                    .map(function (v) { return String(v !== null && v !== void 0 ? v : '').trim().toUpperCase(); })
                                    .filter(Boolean);
                                for (_d = 0, codes_1 = codes; _d < codes_1.length; _d++) {
                                    code = codes_1[_d];
                                    countryByCode.set(code, mongoId);
                                }
                                names = [c.countryName, c.country_name, c.name]
                                    .map(function (v) { return String(v !== null && v !== void 0 ? v : '').trim().toLowerCase(); })
                                    .filter(Boolean);
                                for (_e = 0, names_1 = names; _e < names_1.length; _e++) {
                                    name_1 = names_1[_e];
                                    countryByName.set(name_1, mongoId);
                                }
                            }
                            statesByCountry = new Map();
                            for (_f = 0, countryMongoIds_1 = countryMongoIds; _f < countryMongoIds_1.length; _f++) {
                                countryId = countryMongoIds_1[_f];
                                statesByCountry.set(countryId, []);
                            }
                            statesLinked = 0;
                            statesUnmapped = 0;
                            for (_g = 0, _h = states !== null && states !== void 0 ? states : []; _g < _h.length; _g++) {
                                state = _h[_g];
                                s = state;
                                stateLabel = String((_o = (_m = (_l = s.stateName) !== null && _l !== void 0 ? _l : s.state_name) !== null && _m !== void 0 ? _m : s.name) !== null && _o !== void 0 ? _o : '').trim();
                                if (!stateLabel) {
                                    statesUnmapped++;
                                    continue;
                                }
                                countryKey = this.resolveCountryMongoIdForState(s, countryMongoIds, countryByNumericId, countryByCode, countryByName);
                                if (!countryKey) {
                                    statesUnmapped++;
                                    continue;
                                }
                                statesLinked++;
                                bucket = (_p = statesByCountry.get(countryKey)) !== null && _p !== void 0 ? _p : [];
                                bucket.push({ id: String(s._id), label: stateLabel });
                                statesByCountry.set(countryKey, bucket);
                            }
                            for (_j = 0, statesByCountry_1 = statesByCountry; _j < statesByCountry_1.length; _j++) {
                                _k = statesByCountry_1[_j], list = _k[1];
                                list.sort(function (a, b) { return a.label.localeCompare(b.label); });
                            }
                            countryStateTree = (countries !== null && countries !== void 0 ? countries : [])
                                .map(function (country) {
                                var _a, _b, _c, _d;
                                var c = country;
                                var id = String(c._id);
                                var label = String((_c = (_b = (_a = c.countryName) !== null && _a !== void 0 ? _a : c.country_name) !== null && _b !== void 0 ? _b : c.name) !== null && _c !== void 0 ? _c : '').trim();
                                return {
                                    id: id,
                                    label: label,
                                    type: 'country',
                                    children: ((_d = statesByCountry.get(id)) !== null && _d !== void 0 ? _d : []).map(function (state) { return ({
                                        id: state.id,
                                        label: state.label,
                                        type: 'state',
                                        parentId: id,
                                    }); }),
                                };
                            })
                                .filter(function (c) { return c.label.length > 0; })
                                .sort(function (a, b) { return a.label.localeCompare(b.label); });
                            countriesWithStates = countryStateTree.filter(function (c) { return c.children.length > 0; }).length;
                            return [2 /*return*/, {
                                    categories: categoryOptions,
                                    countryStateTree: countryStateTree,
                                    totals: {
                                        countries: countryStateTree.length,
                                        countriesWithStates: countriesWithStates,
                                        statesInDatabase: (states !== null && states !== void 0 ? states : []).length,
                                        statesLinked: statesLinked,
                                        statesUnmapped: statesUnmapped,
                                    },
                                }];
                    }
                });
            });
        };
        /**
         * Typeahead for public certified product search bar (min 2 chars).
         */
        ProductRegistrationService_1.prototype.searchPublicCertifiedProducts = function (q_1) {
            return __awaiter(this, arguments, void 0, function (q, limit) {
                var term, rx, safeLimit, rows;
                if (limit === void 0) { limit = 15; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            term = String(q !== null && q !== void 0 ? q : '').trim();
                            if (term.length < 2) {
                                return [2 /*return*/, []];
                            }
                            rx = new RegExp(this.escapeRegexLiteral(term), 'i');
                            safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 30) : 15;
                            return [4 /*yield*/, this.productModel
                                    .aggregate([
                                    {
                                        $match: __assign(__assign({}, (0, active_product_filter_1.matchActiveProducts)()), { productStatus: 2, $or: [
                                                { productName: rx },
                                                { eoiNo: rx },
                                                { urnNo: rx },
                                            ] }),
                                    },
                                    {
                                        $lookup: {
                                            from: 'manufacturers',
                                            localField: 'manufacturerId',
                                            foreignField: '_id',
                                            as: 'manufacturer',
                                        },
                                    },
                                    {
                                        $unwind: {
                                            path: '$manufacturer',
                                            preserveNullAndEmptyArrays: true,
                                        },
                                    },
                                    {
                                        $match: (0, public_website_manufacturer_visibility_filter_1.matchPublicWebsiteManufacturerVisibility)(),
                                    },
                                    {
                                        $lookup: {
                                            from: 'categories',
                                            localField: 'categoryId',
                                            foreignField: '_id',
                                            as: 'category',
                                        },
                                    },
                                    {
                                        $unwind: {
                                            path: '$category',
                                            preserveNullAndEmptyArrays: true,
                                        },
                                    },
                                    {
                                        $match: {
                                            $or: [
                                                { productName: rx },
                                                { eoiNo: rx },
                                                { urnNo: rx },
                                                { 'manufacturer.manufacturerName': rx },
                                            ],
                                        },
                                    },
                                    { $sort: { productName: 1 } },
                                    { $limit: safeLimit },
                                    {
                                        $project: {
                                            _id: 0,
                                            id: { $toString: '$_id' },
                                            productId: 1,
                                            productName: 1,
                                            eoiNo: 1,
                                            urnNo: 1,
                                            productImage: {
                                                $ifNull: ['$productImage', '$product_image'],
                                            },
                                            categoryImage: {
                                                $ifNull: ['$category.category_image', '$category.categoryImage'],
                                            },
                                        },
                                    },
                                ])
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, rows !== null && rows !== void 0 ? rows : []];
                    }
                });
            });
        };
        /**
         * Product ids that have at least one active plant matching country / state / city filters.
         * `state` / `state_name` = free-text partial match on resolved state name (not a dropdown).
         * Returns null when no location filter is set; [] when filter is set but nothing matches.
         */
        ProductRegistrationService_1.prototype.findAdminListProductIdsByPlantLocation = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var countryId, stateIds, stateText, multiStateNames, cities, hasCountry, hasStateIds, hasStateText, hasStateNames, hasCities, plantMatch, needsStateLookup, productIds, pipeline, postMatchParts, rows_2, ids, statuses, productQuery, now, includeExpired, regularStatuses, rows;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            countryId = this.resolveAdminListCountryId(dto);
                            stateIds = this.resolveAdminListPlantStateObjectIds(dto);
                            stateText = this.resolveAdminListPlantStateNameSearch(dto);
                            multiStateNames = (function () {
                                var _a;
                                var multi = (_a = dto.stateNames) !== null && _a !== void 0 ? _a : dto.state_names;
                                if (!Array.isArray(multi) || multi.length === 0) {
                                    return null;
                                }
                                var names = multi.map(function (n) { return String(n).trim(); }).filter(function (n) { return n.length > 0; });
                                return names.length > 0 ? names : null;
                            })();
                            cities = this.resolveAdminListCities(dto);
                            hasCountry = Boolean(countryId);
                            hasStateIds = Boolean(stateIds && stateIds.length > 0);
                            hasStateText = Boolean(stateText);
                            hasStateNames = Boolean(multiStateNames && multiStateNames.length > 0);
                            hasCities = Boolean(cities && cities.length > 0);
                            if (!hasCountry && !hasStateIds && !hasStateText && !hasStateNames && !hasCities) {
                                return [2 /*return*/, null];
                            }
                            plantMatch = __assign({}, (0, active_product_filter_1.matchActiveProductPlants)());
                            if (hasCountry) {
                                plantMatch.countryId = this.toObjectId(countryId, 'countryId');
                            }
                            if (hasStateIds) {
                                plantMatch.stateId = {
                                    $in: stateIds.map(function (id) { return _this.toObjectId(id, 'stateId'); }),
                                };
                            }
                            needsStateLookup = hasStateText || hasStateNames;
                            if (!needsStateLookup) return [3 /*break*/, 2];
                            pipeline = [
                                { $match: plantMatch },
                                {
                                    $lookup: {
                                        from: 'states',
                                        localField: 'stateId',
                                        foreignField: '_id',
                                        as: 'st',
                                    },
                                },
                                {
                                    $unwind: {
                                        path: '$st',
                                        preserveNullAndEmptyArrays: true,
                                    },
                                },
                                {
                                    $addFields: {
                                        stateName: {
                                            $ifNull: [
                                                '$st.stateName',
                                                { $ifNull: ['$st.state_name', '$st.name'] },
                                            ],
                                        },
                                    },
                                },
                            ];
                            postMatchParts = [];
                            if (hasStateText) {
                                postMatchParts.push({
                                    stateName: new RegExp(this.escapeRegexLiteral(stateText), 'i'),
                                });
                            }
                            else if (hasStateNames) {
                                postMatchParts.push({
                                    $or: multiStateNames.map(function (name) { return ({
                                        stateName: new RegExp("^".concat(_this.escapeRegexLiteral(name), "$"), 'i'),
                                    }); }),
                                });
                            }
                            if (hasCities) {
                                if (cities.length === 1) {
                                    postMatchParts.push({
                                        city: new RegExp(this.escapeRegexLiteral(cities[0]), 'i'),
                                    });
                                }
                                else {
                                    postMatchParts.push({
                                        $or: cities.map(function (city) { return ({
                                            city: new RegExp(_this.escapeRegexLiteral(city), 'i'),
                                        }); }),
                                    });
                                }
                            }
                            if (postMatchParts.length > 0) {
                                pipeline.push({
                                    $match: postMatchParts.length === 1
                                        ? postMatchParts[0]
                                        : { $and: postMatchParts },
                                });
                            }
                            pipeline.push({ $group: { _id: '$productId' } });
                            return [4 /*yield*/, this.productPlantModel.aggregate(pipeline).exec()];
                        case 1:
                            rows_2 = _a.sent();
                            productIds = rows_2.map(function (row) { return row._id; });
                            return [3 /*break*/, 4];
                        case 2:
                            if (hasCities) {
                                if (cities.length === 1) {
                                    plantMatch.city = new RegExp(this.escapeRegexLiteral(cities[0]), 'i');
                                }
                                else {
                                    plantMatch.$or = cities.map(function (city) { return ({
                                        city: new RegExp(_this.escapeRegexLiteral(city), 'i'),
                                    }); });
                                }
                            }
                            return [4 /*yield*/, this.productPlantModel.distinct('productId', plantMatch).exec()];
                        case 3:
                            ids = _a.sent();
                            productIds = ids.map(function (id) { return id; });
                            _a.label = 4;
                        case 4:
                            if (!productIds.length) {
                                return [2 /*return*/, []];
                            }
                            statuses = (function () {
                                for (var _i = 0, _a = [dto.status, dto.productStatus, dto.product_status]; _i < _a.length; _i++) {
                                    var c = _a[_i];
                                    if (Array.isArray(c) && c.length > 0) {
                                        return c;
                                    }
                                }
                                return [];
                            })();
                            productQuery = __assign({ _id: { $in: productIds } }, (0, active_product_filter_1.matchActiveProducts)());
                            if (statuses.length > 0) {
                                now = new Date();
                                includeExpired = statuses.includes(4);
                                regularStatuses = statuses.filter(function (s) { return s !== 4; });
                                if (includeExpired && regularStatuses.length > 0) {
                                    productQuery.$or = [
                                        { productStatus: { $in: regularStatuses } },
                                        {
                                            productStatus: 2,
                                            validtillDate: { $exists: true, $ne: null, $lt: now },
                                        },
                                    ];
                                }
                                else if (includeExpired) {
                                    productQuery.productStatus = 2;
                                    productQuery.validtillDate = { $exists: true, $ne: null, $lt: now };
                                }
                                else if (regularStatuses.length === 1) {
                                    productQuery.productStatus = regularStatuses[0];
                                }
                                else {
                                    productQuery.productStatus = { $in: regularStatuses };
                                }
                            }
                            return [4 /*yield*/, this.productModel
                                    .find(productQuery)
                                    .select('_id')
                                    .lean()
                                    .exec()];
                        case 5:
                            rows = _a.sent();
                            return [2 /*return*/, rows.map(function (row) { return row._id; })];
                    }
                });
            });
        };
        /** Certified-only alias used by the public website product grid. */
        ProductRegistrationService_1.prototype.findCertifiedProductIdsByPlantLocation = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.findAdminListProductIdsByPlantLocation(__assign(__assign({}, dto), { status: [2] }))];
                });
            });
        };
        /**
         * Flat certified product cards for public website grid (not URN/manufacturer groups).
         */
        ProductRegistrationService_1.prototype.listPublicCertifiedProductsFlat = function (dto, productId) {
            return __awaiter(this, void 0, void 0, function () {
                var listDto, locationProductIds, page_1, limit_1, _a, page, limit, skip, sortOrder, rowBase, urnSortField, pipeline, trimmedProductId, sortField, dataPipeline, facetResult, payload, total, totalPages, data;
                var _b;
                var _this = this;
                var _c, _d, _e, _f, _g, _h, _j;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0:
                            listDto = __assign(__assign({}, dto), { status: [2] });
                            return [4 /*yield*/, this.findCertifiedProductIdsByPlantLocation(listDto)];
                        case 1:
                            locationProductIds = _k.sent();
                            if (locationProductIds !== null && locationProductIds.length === 0) {
                                page_1 = (_c = listDto.page) !== null && _c !== void 0 ? _c : 1;
                                limit_1 = (_d = listDto.limit) !== null && _d !== void 0 ? _d : 10;
                                return [2 /*return*/, {
                                        data: [],
                                        total: 0,
                                        page: page_1,
                                        limit: limit_1,
                                        totalPages: 0,
                                    }];
                            }
                            _a = this.buildAdminListRowBase(listDto, locationProductIds, {
                                requirePublicWebsiteManufacturerVisibility: true,
                            }), page = _a.page, limit = _a.limit, skip = _a.skip, sortOrder = _a.sortOrder, rowBase = _a.rowBase, urnSortField = _a.urnSortField;
                            pipeline = __spreadArray([], rowBase, true);
                            trimmedProductId = String(productId !== null && productId !== void 0 ? productId : '').trim();
                            if (trimmedProductId) {
                                pipeline = __spreadArray([
                                    {
                                        $match: {
                                            _id: this.toObjectId(trimmedProductId, 'productId'),
                                        },
                                    }
                                ], pipeline, true);
                            }
                            sortField = urnSortField;
                            dataPipeline = __spreadArray(__spreadArray([], pipeline, true), [
                                { $sort: (_b = {}, _b[sortField] = sortOrder, _b) },
                                { $skip: skip },
                                { $limit: limit },
                                {
                                    $project: {
                                        _id: 0,
                                        id: { $toString: '$_id' },
                                        productId: 1,
                                        eoiNo: 1,
                                        urnNo: 1,
                                        productName: 1,
                                        productDetails: 1,
                                        productImage: {
                                            $ifNull: ['$productImage', '$product_image'],
                                        },
                                        categoryImage: {
                                            $ifNull: ['$category.category_image', '$category.categoryImage'],
                                        },
                                        validtillDate: 1,
                                        categoryId: { $toString: '$categoryId' },
                                        categoryName: {
                                            $ifNull: ['$category.categoryName', '$category.category_name'],
                                        },
                                        manufacturerName: '$manufacturer.manufacturerName',
                                        manufacturerId: { $toString: '$manufacturerId' },
                                        manufacturerFacebook: {
                                            $ifNull: ['$manufacturer.vendor_facebook', ''],
                                        },
                                        manufacturerYoutube: {
                                            $ifNull: ['$manufacturer.vendor_youtube', ''],
                                        },
                                        manufacturerTwitter: {
                                            $ifNull: ['$manufacturer.vendor_twitter', ''],
                                        },
                                        manufacturerLinkedin: {
                                            $ifNull: ['$manufacturer.vendor_linkedin', ''],
                                        },
                                        sectorName: '$_adminSectorDoc.name',
                                        plants: 1,
                                    },
                                },
                            ], false);
                            return [4 /*yield*/, this.productModel
                                    .aggregate([
                                    {
                                        $facet: {
                                            data: dataPipeline,
                                            total: __spreadArray(__spreadArray([], pipeline, true), [{ $count: 'count' }], false),
                                        },
                                    },
                                ])
                                    .exec()];
                        case 2:
                            facetResult = _k.sent();
                            payload = (_e = facetResult[0]) !== null && _e !== void 0 ? _e : { data: [], total: [] };
                            total = (_h = (_g = (_f = payload.total) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.count) !== null && _h !== void 0 ? _h : 0;
                            totalPages = total > 0 ? Math.ceil(total / limit) : 0;
                            data = ((_j = payload.data) !== null && _j !== void 0 ? _j : []).map(function (row) {
                                return _this.mapPublicCertifiedProductFlatRow(row);
                            });
                            return [2 /*return*/, {
                                    data: data,
                                    total: total,
                                    page: page,
                                    limit: limit,
                                    totalPages: totalPages,
                                }];
                    }
                });
            });
        };
        /** Public manufacturer social links — flat fields always returned; nested object always present. */
        ProductRegistrationService_1.prototype.mapPublicManufacturerSocialFields = function (fields) {
            var _a, _b, _c, _d, _e;
            var facebook = String((_a = fields.facebook) !== null && _a !== void 0 ? _a : '').trim();
            var youtube = String((_b = fields.youtube) !== null && _b !== void 0 ? _b : '').trim();
            var twitter = String((_c = fields.twitter) !== null && _c !== void 0 ? _c : '').trim();
            var linkedin = String((_d = fields.linkedin) !== null && _d !== void 0 ? _d : '').trim();
            var website = String((_e = fields.website) !== null && _e !== void 0 ? _e : '').trim();
            var manufacturerSocialLinks = {
                facebook: facebook,
                facebookUrl: facebook,
                youtube: youtube,
                youtubeUrl: youtube,
                twitter: twitter,
                twitterUrl: twitter,
                linkedin: linkedin,
                linkedinUrl: linkedin,
            };
            return {
                website: website,
                vendor_website: website,
                facebook: facebook,
                facebookUrl: facebook,
                vendor_facebook: facebook,
                youtube: youtube,
                youtubeUrl: youtube,
                vendor_youtube: youtube,
                twitter: twitter,
                twitterUrl: twitter,
                vendor_twitter: twitter,
                linkedin: linkedin,
                linkedinUrl: linkedin,
                vendor_linkedin: linkedin,
                manufacturerSocialLinks: manufacturerSocialLinks,
                socialLinks: manufacturerSocialLinks,
            };
        };
        /** @deprecated use mapPublicManufacturerSocialFields */
        ProductRegistrationService_1.prototype.buildPublicManufacturerSocialLinks = function (fields) {
            var _a;
            var mapped = this.mapPublicManufacturerSocialFields(fields);
            var nested = mapped.manufacturerSocialLinks;
            var hasAny = ['facebook', 'youtube', 'twitter', 'linkedin'].some(function (key) { var _a; return String((_a = nested[key]) !== null && _a !== void 0 ? _a : '').trim(); });
            if (!hasAny) {
                return undefined;
            }
            var out = {};
            for (var _i = 0, _b = ['facebook', 'youtube', 'twitter', 'linkedin']; _i < _b.length; _i++) {
                var key = _b[_i];
                var value = String((_a = nested[key]) !== null && _a !== void 0 ? _a : '').trim();
                if (value) {
                    out[key] = value;
                    out["".concat(key, "Url")] = value;
                }
            }
            return out;
        };
        /** Resolve stored upload paths for public website certified product cards. */
        ProductRegistrationService_1.prototype.mapPublicCertifiedProductFlatRow = function (row) {
            var _a, _b, _c, _d, _e, _f, _g;
            var productImageRaw = String((_b = (_a = row.productImage) !== null && _a !== void 0 ? _a : row.product_image) !== null && _b !== void 0 ? _b : '').trim();
            var categoryImageRaw = String((_d = (_c = row.categoryImage) !== null && _c !== void 0 ? _c : row.category_image) !== null && _d !== void 0 ? _d : '').trim();
            var productImage = productImageRaw
                ? (0, upload_file_util_1.resolveStoredUploadUrl)(productImageRaw) || productImageRaw
                : null;
            var categoryImage = categoryImageRaw
                ? (0, upload_file_util_1.resolveStoredUploadUrl)(categoryImageRaw) || categoryImageRaw
                : null;
            var productDetails = String((_f = (_e = row.productDetails) !== null && _e !== void 0 ? _e : row.product_details) !== null && _f !== void 0 ? _f : '').trim();
            var manufacturerSocialLinks = this.buildPublicManufacturerSocialLinks({
                facebook: row.manufacturerFacebook,
                youtube: row.manufacturerYoutube,
                twitter: row.manufacturerTwitter,
                linkedin: row.manufacturerLinkedin,
            });
            var _mf = row.manufacturerFacebook, _my = row.manufacturerYoutube, _mt = row.manufacturerTwitter, _ml = row.manufacturerLinkedin, rest = __rest(row, ["manufacturerFacebook", "manufacturerYoutube", "manufacturerTwitter", "manufacturerLinkedin"]);
            var manufacturerId = String((_g = row.manufacturerId) !== null && _g !== void 0 ? _g : '').trim();
            return __assign(__assign({}, rest), { manufacturerId: manufacturerId || undefined, productDetails: productDetails || null, productImage: productImage, productImageUrl: productImage, categoryImage: categoryImage, categoryImageUrl: categoryImage, manufacturerSocialLinks: manufacturerSocialLinks !== null && manufacturerSocialLinks !== void 0 ? manufacturerSocialLinks : {
                    facebook: '',
                    facebookUrl: '',
                    youtube: '',
                    youtubeUrl: '',
                    twitter: '',
                    twitterUrl: '',
                    linkedin: '',
                    linkedinUrl: '',
                } });
        };
        ProductRegistrationService_1.prototype.vendorPatchCertifiedProduct = function (productId, dto, manufacturerId, imageFile) {
            return __awaiter(this, void 0, void 0, function () {
                var productObjectId, vendorObjectId, existing, existingImage, _a, productImage, uploaded, productName, productDetails, hasAnyField, updatePayload, updated;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            productObjectId = this.toObjectId(productId, 'productId');
                            vendorObjectId = this.toObjectId(manufacturerId, 'manufacturerId');
                            return [4 /*yield*/, this.productModel
                                    .findOne({
                                    _id: productObjectId,
                                    vendorId: vendorObjectId,
                                })
                                    .select('_id productStatus')
                                    .lean()
                                    .exec()];
                        case 1:
                            existing = _d.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException('Certified product not found for this vendor');
                            }
                            if (Number(existing.productStatus) !== 2) {
                                throw new common_1.BadRequestException('Only certified products (productStatus 2) can be edited from vendor certified list');
                            }
                            _a = String;
                            return [4 /*yield*/, this.productModel
                                    .findOne({
                                    _id: productObjectId,
                                    vendorId: vendorObjectId,
                                })
                                    .select('productImage')
                                    .lean()
                                    .exec()];
                        case 2:
                            existingImage = _a.apply(void 0, [(_c = (_b = (_d.sent())) === null || _b === void 0 ? void 0 : _b.productImage) !== null && _c !== void 0 ? _c : '']).trim();
                            if (!imageFile) return [3 /*break*/, 5];
                            return [4 /*yield*/, (0, upload_file_util_1.uploadCertifiedProductImage)(imageFile)];
                        case 3:
                            uploaded = _d.sent();
                            productImage = uploaded.fileUrl;
                            if (!(existingImage && existingImage !== productImage)) return [3 /*break*/, 5];
                            return [4 /*yield*/, (0, upload_file_util_1.deleteUploadedFileByDocumentLink)(existingImage)];
                        case 4:
                            _d.sent();
                            _d.label = 5;
                        case 5:
                            productName = dto.productName !== undefined
                                ? (0, product_name_uniqueness_util_1.normalizeProductNameForComparison)(dto.productName)
                                : undefined;
                            productDetails = dto.productDetails;
                            hasAnyField = productName !== undefined ||
                                productDetails !== undefined ||
                                productImage !== undefined;
                            if (!hasAnyField) {
                                throw new common_1.BadRequestException('At least one field is required: productName, productDetails, or productImage');
                            }
                            if (!productName) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.assertProductNameIsUnique(productName, productObjectId, 'productName')];
                        case 6:
                            _d.sent();
                            _d.label = 7;
                        case 7:
                            updatePayload = {
                                updatedDate: new Date(),
                            };
                            if (productName !== undefined) {
                                updatePayload.productName = productName;
                            }
                            if (productDetails !== undefined) {
                                updatePayload.productDetails = productDetails;
                            }
                            if (productImage !== undefined) {
                                updatePayload.productImage = productImage;
                            }
                            return [4 /*yield*/, this.productModel
                                    .findOneAndUpdate({
                                    _id: productObjectId,
                                    vendorId: vendorObjectId,
                                    productStatus: 2,
                                }, { $set: updatePayload }, { new: true })
                                    .exec()];
                        case 8:
                            updated = _d.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Certified product not found for this vendor');
                            }
                            return [4 /*yield*/, this.invalidateProductListingsCache()];
                        case 9:
                            _d.sent();
                            return [2 /*return*/, updated.toObject()];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.vendorSubmitProductChangeRequest = function (manufacturerId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, productObjectId, product, currentName, requestedName, reason, fieldErrors, normalizedStoredName, existingPending, now, created, manufacturer, manufacturerName, err_2;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                return __generator(this, function (_l) {
                    switch (_l.label) {
                        case 0:
                            vendorObjectId = this.toObjectId(manufacturerId, 'manufacturerId');
                            productObjectId = this.toObjectId(dto.productId, 'productId');
                            return [4 /*yield*/, this.productModel
                                    .findOne((0, active_product_filter_1.matchActiveProducts)({
                                    _id: productObjectId,
                                    vendorId: vendorObjectId,
                                    productStatus: 2,
                                }))
                                    .select('_id urnNo eoiNo productName vendorId manufacturerId productStatus')
                                    .lean()
                                    .exec()];
                        case 1:
                            product = _l.sent();
                            if (!product) {
                                throw new common_1.NotFoundException('Certified product not found for this vendor');
                            }
                            currentName = (0, product_name_uniqueness_util_1.normalizeProductNameForComparison)(dto.currentName);
                            requestedName = (0, product_name_uniqueness_util_1.normalizeProductNameForComparison)(dto.requestedName);
                            reason = String((_a = dto.reason) !== null && _a !== void 0 ? _a : '').trim();
                            fieldErrors = {};
                            if (!requestedName) {
                                fieldErrors.requestedName = 'New Product Name is required.';
                            }
                            if (!reason) {
                                fieldErrors.reason = 'Reason is required.';
                            }
                            if (!currentName) {
                                fieldErrors.currentName = 'Current product name is required.';
                            }
                            if (Object.keys(fieldErrors).length > 0) {
                                throw new common_1.BadRequestException({
                                    code: 'VALIDATION_ERROR',
                                    message: 'Please complete all required fields.',
                                    fieldErrors: fieldErrors,
                                });
                            }
                            if (requestedName.localeCompare(currentName, undefined, {
                                sensitivity: 'accent',
                            }) === 0) {
                                throw new common_1.BadRequestException({
                                    code: 'VALIDATION_ERROR',
                                    message: 'Requested name must be different from current name',
                                    fieldErrors: {
                                        requestedName: 'Requested name must be different from current name',
                                    },
                                });
                            }
                            return [4 /*yield*/, this.assertProductNameIsUnique(requestedName, productObjectId, 'requestedName')];
                        case 2:
                            _l.sent();
                            normalizedStoredName = String((_b = product.productName) !== null && _b !== void 0 ? _b : '').trim();
                            if (normalizedStoredName && normalizedStoredName !== currentName) {
                                throw new common_1.BadRequestException('Current name does not match latest product name. Refresh and try again.');
                            }
                            return [4 /*yield*/, this.vendorProductChangeRequestModel
                                    .findOne({
                                    vendorId: vendorObjectId,
                                    productId: productObjectId,
                                    status: 'pending',
                                })
                                    .select('_id')
                                    .lean()
                                    .exec()];
                        case 3:
                            existingPending = _l.sent();
                            if (existingPending) {
                                throw new common_1.BadRequestException('A pending request already exists for this product.');
                            }
                            now = new Date();
                            return [4 /*yield*/, this.vendorProductChangeRequestModel.create({
                                    productId: productObjectId,
                                    vendorId: vendorObjectId,
                                    manufacturerId: vendorObjectId,
                                    urnNo: String((_d = (_c = dto.urnNo) !== null && _c !== void 0 ? _c : product.urnNo) !== null && _d !== void 0 ? _d : '').trim() || product.urnNo,
                                    eoiNo: String((_f = (_e = dto.eoiNo) !== null && _e !== void 0 ? _e : product.eoiNo) !== null && _f !== void 0 ? _f : '').trim() || product.eoiNo,
                                    currentName: currentName,
                                    requestedName: requestedName,
                                    reason: reason,
                                    status: 'pending',
                                    createdDate: now,
                                    updatedDate: now,
                                })];
                        case 4:
                            created = _l.sent();
                            return [4 /*yield*/, this.manufacturerModel
                                    .findById(vendorObjectId)
                                    .select('manufacturerName vendor_name')
                                    .lean()
                                    .exec()];
                        case 5:
                            manufacturer = _l.sent();
                            manufacturerName = String((_g = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.manufacturerName) !== null && _g !== void 0 ? _g : '').trim() ||
                                String((_h = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.vendor_name) !== null && _h !== void 0 ? _h : '').trim() ||
                                undefined;
                            _l.label = 6;
                        case 6:
                            _l.trys.push([6, 8, , 9]);
                            return [4 /*yield*/, this.lifecycleNotification.notifyProductNameChangeRequested({
                                    manufacturerId: vendorObjectId.toString(),
                                    requestId: String(created._id),
                                    urnNo: String((_j = created.urnNo) !== null && _j !== void 0 ? _j : ''),
                                    eoiNo: String((_k = created.eoiNo) !== null && _k !== void 0 ? _k : ''),
                                    currentName: currentName,
                                    requestedName: requestedName,
                                    reason: reason,
                                    manufacturerName: manufacturerName,
                                })];
                        case 7:
                            _l.sent();
                            return [3 /*break*/, 9];
                        case 8:
                            err_2 = _l.sent();
                            this.logger.warn("[Product name change] Admin notification failed: ".concat(err_2.message));
                            return [3 /*break*/, 9];
                        case 9: return [2 /*return*/, this.mapProductChangeRequest(created.toObject())];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.vendorListProductChangeRequests = function (manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, rows;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vendorObjectId = this.toObjectId(manufacturerId, 'manufacturerId');
                            return [4 /*yield*/, this.vendorProductChangeRequestModel
                                    .find({ vendorId: vendorObjectId })
                                    .sort({ createdDate: -1 })
                                    .lean()
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, rows.map(function (row) { return _this.mapProductChangeRequest(row); })];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.adminListProductChangeRequests = function (status) {
            return __awaiter(this, void 0, void 0, function () {
                var match, normalizedStatus, rows;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            match = {};
                            normalizedStatus = String(status !== null && status !== void 0 ? status : '')
                                .trim()
                                .toLowerCase();
                            if (normalizedStatus === 'pending' ||
                                normalizedStatus === 'approved' ||
                                normalizedStatus === 'rejected') {
                                match.status = normalizedStatus;
                            }
                            return [4 /*yield*/, this.vendorProductChangeRequestModel
                                    .find(match)
                                    .sort({ createdDate: -1 })
                                    .lean()
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, rows.map(function (row) { return _this.mapProductChangeRequest(row); })];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.adminUpdateProductChangeRequestStatus = function (requestId, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var requestObjectId, reviewerObjectId, now, existing, nextStatus, remarksRaw, updated, manufacturer, vendorEmail, manufacturerName, approvedName;
                var _this = this;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                return __generator(this, function (_r) {
                    switch (_r.label) {
                        case 0:
                            requestObjectId = this.toObjectId(requestId, 'requestId');
                            reviewerObjectId = this.toObjectId(adminUserId, 'adminUserId');
                            now = new Date();
                            return [4 /*yield*/, this.vendorProductChangeRequestModel
                                    .findById(requestObjectId)
                                    .lean()
                                    .exec()];
                        case 1:
                            existing = _r.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException('Request not found');
                            }
                            nextStatus = dto.status;
                            remarksRaw = (_a = dto.adminRemarks) === null || _a === void 0 ? void 0 : _a.trim();
                            if (nextStatus === 'rejected' && !remarksRaw) {
                                throw new common_1.BadRequestException('adminRemarks is required when rejecting a request');
                            }
                            return [4 /*yield*/, this.vendorProductChangeRequestModel
                                    .findByIdAndUpdate(requestObjectId, {
                                    $set: {
                                        status: nextStatus,
                                        adminRemarks: nextStatus === 'rejected' ? remarksRaw !== null && remarksRaw !== void 0 ? remarksRaw : null : null,
                                        reviewedBy: reviewerObjectId,
                                        reviewedAt: now,
                                        updatedDate: now,
                                    },
                                }, { new: true })
                                    .lean()
                                    .exec()];
                        case 2:
                            updated = _r.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Request not found');
                            }
                            return [4 /*yield*/, this.manufacturerModel
                                    .findById(updated.manufacturerId)
                                    .select('manufacturerName vendor_email')
                                    .lean()
                                    .exec()];
                        case 3:
                            manufacturer = _r.sent();
                            vendorEmail = String((_b = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.vendor_email) !== null && _b !== void 0 ? _b : '').trim();
                            manufacturerName = String((_c = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.manufacturerName) !== null && _c !== void 0 ? _c : 'Vendor').trim();
                            if (!(nextStatus === 'approved')) return [3 /*break*/, 7];
                            approvedName = (0, product_name_uniqueness_util_1.normalizeProductNameForComparison)(updated.requestedName);
                            return [4 /*yield*/, this.assertProductNameIsUnique(approvedName, updated.productId, 'requestedName')];
                        case 4:
                            _r.sent();
                            return [4 /*yield*/, this.productModel
                                    .findOneAndUpdate((0, active_product_filter_1.matchActiveProducts)({
                                    _id: updated.productId,
                                    productStatus: 2,
                                }), {
                                    $set: {
                                        productName: approvedName,
                                        updatedDate: now,
                                    },
                                }, { new: false })
                                    .exec()];
                        case 5:
                            _r.sent();
                            return [4 /*yield*/, this.invalidateProductListingsCache()];
                        case 6:
                            _r.sent();
                            this.lifecycleNotification
                                .notifyProductNameChangeDecision({
                                manufacturerId: String((_d = updated.manufacturerId) !== null && _d !== void 0 ? _d : ''),
                                requestId: String((_e = updated._id) !== null && _e !== void 0 ? _e : requestObjectId),
                                email: vendorEmail,
                                urnNo: String((_f = updated.urnNo) !== null && _f !== void 0 ? _f : ''),
                                eoiNo: String((_g = updated.eoiNo) !== null && _g !== void 0 ? _g : ''),
                                currentName: String((_h = updated.currentName) !== null && _h !== void 0 ? _h : ''),
                                requestedName: String((_j = updated.requestedName) !== null && _j !== void 0 ? _j : ''),
                                decision: 'approved',
                                manufacturerName: manufacturerName,
                            })
                                .catch(function (err) {
                                return _this.logger.warn("[reviewProductChangeRequest] Decision notification failed: ".concat(err.message));
                            });
                            return [3 /*break*/, 8];
                        case 7:
                            if (nextStatus === 'rejected') {
                                this.lifecycleNotification
                                    .notifyProductNameChangeDecision({
                                    manufacturerId: String((_k = updated.manufacturerId) !== null && _k !== void 0 ? _k : ''),
                                    requestId: String((_l = updated._id) !== null && _l !== void 0 ? _l : requestObjectId),
                                    email: vendorEmail,
                                    urnNo: String((_m = updated.urnNo) !== null && _m !== void 0 ? _m : ''),
                                    eoiNo: String((_o = updated.eoiNo) !== null && _o !== void 0 ? _o : ''),
                                    currentName: String((_p = updated.currentName) !== null && _p !== void 0 ? _p : ''),
                                    requestedName: String((_q = updated.requestedName) !== null && _q !== void 0 ? _q : ''),
                                    decision: 'rejected',
                                    manufacturerName: manufacturerName,
                                    remarks: remarksRaw !== null && remarksRaw !== void 0 ? remarksRaw : '',
                                })
                                    .catch(function (err) {
                                    return _this.logger.warn("[reviewProductChangeRequest] Decision notification failed: ".concat(err.message));
                                });
                            }
                            _r.label = 8;
                        case 8: return [2 /*return*/, this.mapProductChangeRequest(updated)];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.escapeHtml = function (input) {
            return String(input !== null && input !== void 0 ? input : '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        };
        ProductRegistrationService_1.prototype.getVendorProductChangeRequestFormMeta = function () {
            return {
                fields: [
                    {
                        key: 'requestedName',
                        label: 'New Product Name',
                        required: true,
                        maxLength: 500,
                    },
                    {
                        key: 'reason',
                        label: 'Reason',
                        required: true,
                    },
                ],
                validationMessages: {
                    requestedNameRequired: 'New Product Name is required.',
                    reasonRequired: 'Reason is required.',
                    productNameExists: product_name_uniqueness_util_1.PRODUCT_NAME_ALREADY_EXISTS_MESSAGE,
                },
                display: {
                    productNameWrapCss: 'word-break: break-word; white-space: normal; overflow-wrap: anywhere;',
                    modalSuggestedMaxWidth: 'min(520px, 92vw)',
                },
            };
        };
        /**
         * Ensures product name is unique among active products and pending change requests.
         */
        ProductRegistrationService_1.prototype.assertProductNameIsUnique = function (productName_1, excludeProductId_1) {
            return __awaiter(this, arguments, void 0, function (productName, excludeProductId, fieldKey) {
                var nameFilter, productQuery, conflictingProduct, pendingQuery, conflictingPending;
                var _a, _b;
                if (fieldKey === void 0) { fieldKey = 'requestedName'; }
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            nameFilter = (0, product_name_uniqueness_util_1.productNameEqualsFilter)(productName);
                            if (!nameFilter) {
                                return [2 /*return*/];
                            }
                            productQuery = __assign(__assign({}, (0, active_product_filter_1.matchActiveProducts)()), { productName: nameFilter });
                            if (excludeProductId) {
                                productQuery._id = { $ne: excludeProductId };
                            }
                            return [4 /*yield*/, this.productModel
                                    .findOne(productQuery)
                                    .select('_id productName')
                                    .lean()
                                    .exec()];
                        case 1:
                            conflictingProduct = _c.sent();
                            if (conflictingProduct) {
                                throw new common_1.BadRequestException({
                                    code: 'PRODUCT_NAME_EXISTS',
                                    message: product_name_uniqueness_util_1.PRODUCT_NAME_ALREADY_EXISTS_MESSAGE,
                                    fieldErrors: (_a = {},
                                        _a[fieldKey] = product_name_uniqueness_util_1.PRODUCT_NAME_ALREADY_EXISTS_MESSAGE,
                                        _a),
                                });
                            }
                            pendingQuery = {
                                status: 'pending',
                                requestedName: nameFilter,
                            };
                            if (excludeProductId) {
                                pendingQuery.productId = { $ne: excludeProductId };
                            }
                            return [4 /*yield*/, this.vendorProductChangeRequestModel
                                    .findOne(pendingQuery)
                                    .select('_id')
                                    .lean()
                                    .exec()];
                        case 2:
                            conflictingPending = _c.sent();
                            if (conflictingPending) {
                                throw new common_1.BadRequestException({
                                    code: 'PRODUCT_NAME_EXISTS',
                                    message: product_name_uniqueness_util_1.PRODUCT_NAME_ALREADY_EXISTS_MESSAGE,
                                    fieldErrors: (_b = {},
                                        _b[fieldKey] = product_name_uniqueness_util_1.PRODUCT_NAME_ALREADY_EXISTS_MESSAGE,
                                        _b),
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.mapProductChangeRequest = function (row) {
            var _a, _b, _c, _d, _e;
            var currentName = String((_a = row === null || row === void 0 ? void 0 : row.currentName) !== null && _a !== void 0 ? _a : '');
            var requestedName = String((_b = row === null || row === void 0 ? void 0 : row.requestedName) !== null && _b !== void 0 ? _b : '');
            return {
                _id: row === null || row === void 0 ? void 0 : row._id,
                requestId: (row === null || row === void 0 ? void 0 : row._id) != null ? String(row._id) : undefined,
                productId: row === null || row === void 0 ? void 0 : row.productId,
                vendorId: row === null || row === void 0 ? void 0 : row.vendorId,
                manufacturerId: row === null || row === void 0 ? void 0 : row.manufacturerId,
                urnNo: row === null || row === void 0 ? void 0 : row.urnNo,
                eoiNo: row === null || row === void 0 ? void 0 : row.eoiNo,
                currentName: currentName,
                requestedName: requestedName,
                currentNameDisplay: currentName,
                requestedNameDisplay: requestedName,
                reason: row === null || row === void 0 ? void 0 : row.reason,
                status: row === null || row === void 0 ? void 0 : row.status,
                adminRemarks: (_c = row === null || row === void 0 ? void 0 : row.adminRemarks) !== null && _c !== void 0 ? _c : null,
                reviewedBy: (_d = row === null || row === void 0 ? void 0 : row.reviewedBy) !== null && _d !== void 0 ? _d : null,
                reviewedAt: (_e = row === null || row === void 0 ? void 0 : row.reviewedAt) !== null && _e !== void 0 ? _e : null,
                createdDate: row === null || row === void 0 ? void 0 : row.createdDate,
                updatedDate: row === null || row === void 0 ? void 0 : row.updatedDate,
            };
        };
        /**
         * Update URN status for a product
         * Updates products table where vendorId and urnNo match, sets urnStatus to updateStatusTo
         * Also logs activity for the status change
         */
        ProductRegistrationService_1.prototype.vendorUrnProductMatch = function (manufacturerId, urnNo) {
            var orgObjectId = this.toObjectId(manufacturerId, 'manufacturerId');
            return (0, active_product_filter_1.matchActiveProducts)({
                urnNo: urnNo,
                $and: [
                    {
                        $or: [{ vendorId: orgObjectId }, { manufacturerId: orgObjectId }],
                    },
                ],
            });
        };
        ProductRegistrationService_1.prototype.resolveManufacturerDisplayName = function (manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturer;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.manufacturerModel
                                .findById(manufacturerId)
                                .select('manufacturerName vendor_name')
                                .lean()
                                .exec()];
                        case 1:
                            manufacturer = _c.sent();
                            return [2 /*return*/, (String((_a = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.manufacturerName) !== null && _a !== void 0 ? _a : '').trim() ||
                                    String((_b = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.vendor_name) !== null && _b !== void 0 ? _b : '').trim() ||
                                    undefined)];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.resolveManufacturerVendorEmail = function (manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturer, email;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.manufacturerModel
                                .findById(manufacturerId)
                                .select('vendor_email')
                                .lean()
                                .exec()];
                        case 1:
                            manufacturer = _b.sent();
                            email = String((_a = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.vendor_email) !== null && _a !== void 0 ? _a : '').trim();
                            return [2 /*return*/, email || undefined];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.updateUrnStatus = function (updateUrnStatusDto, manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var session, vendorObjectId, existingProduct, previousUrnStatus, nextUrnStatus, now, updatedProduct, trimmedUrn, _a, manufacturerName, vendorEmail, urnProducts, productNames, eoiNos, error_5;
                var _this = this;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.connection.startSession()];
                        case 1:
                            session = _c.sent();
                            session.startTransaction();
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 12, , 14]);
                            vendorObjectId = this.toObjectId(manufacturerId, 'manufacturerId');
                            return [4 /*yield*/, this.productModel
                                    .findOne(this.vendorUrnProductMatch(manufacturerId, updateUrnStatusDto.urnNo))
                                    .session(session)
                                    .exec()];
                        case 3:
                            existingProduct = _c.sent();
                            if (!existingProduct) {
                                throw new common_1.NotFoundException("Product not found with manufacturerId: ".concat(manufacturerId, " and urnNo: ").concat(updateUrnStatusDto.urnNo));
                            }
                            previousUrnStatus = Number((_b = existingProduct.urnStatus) !== null && _b !== void 0 ? _b : 0);
                            nextUrnStatus = this.resolveVendorRequestedUrnStatus(updateUrnStatusDto.updateStatusType, updateUrnStatusDto.updateStatusTo);
                            if (nextUrnStatus === 1 && previousUrnStatus >= 3) {
                                throw new common_1.BadRequestException('Invalid URN transition: cannot move back to Registration Payment from current stage');
                            }
                            now = new Date();
                            return [4 /*yield*/, this.productModel
                                    .updateMany(this.vendorUrnProductMatch(manufacturerId, updateUrnStatusDto.urnNo), {
                                    $set: __assign(__assign({ urnStatus: nextUrnStatus }, (updateUrnStatusDto.productStatus !== undefined
                                        ? { productStatus: updateUrnStatusDto.productStatus }
                                        : {})), { updatedDate: now }),
                                }, { session: session })
                                    .exec()];
                        case 4:
                            _c.sent();
                            return [4 /*yield*/, this.productModel
                                    .findOne(this.vendorUrnProductMatch(manufacturerId, updateUrnStatusDto.urnNo))
                                    .session(session)
                                    .exec()];
                        case 5:
                            updatedProduct = _c.sent();
                            if (!updatedProduct) {
                                throw new common_1.NotFoundException('Product not found after update');
                            }
                            return [4 /*yield*/, session.commitTransaction()];
                        case 6:
                            _c.sent();
                            session.endSession();
                            return [4 /*yield*/, this.tryLogUrnLifecycleStep(vendorObjectId, existingProduct.manufacturerId, updateUrnStatusDto.urnNo, nextUrnStatus, previousUrnStatus)];
                        case 7:
                            _c.sent();
                            return [4 /*yield*/, this.syncUrnProductsToZohoDeal(updateUrnStatusDto.urnNo, existingProduct.manufacturerId).catch(function (error) {
                                    _this.logger.warn("[Update URN Status] Zoho deal product sync failed for ".concat(updateUrnStatusDto.urnNo, ": ").concat((error === null || error === void 0 ? void 0 : error.message) || error));
                                })];
                        case 8:
                            _c.sent();
                            if (!(previousUrnStatus !== 4 && nextUrnStatus === 4)) return [3 /*break*/, 10];
                            trimmedUrn = updateUrnStatusDto.urnNo.trim();
                            this.urnTabReviewService
                                .ensurePendingReviewsForUrn(trimmedUrn)
                                .catch(function (err) {
                                return _this.logger.warn("[Update URN Status] Tab review init failed: ".concat(err.message));
                            });
                            if (previousUrnStatus === urn_tab_review_constants_1.VENDOR_RESUBMIT_URN_STATUS) {
                                this.urnTabReviewService
                                    .resetRejectedReviewsToPendingForUrn(trimmedUrn)
                                    .catch(function (err) {
                                    return _this.logger.warn("[Update URN Status] Tab review rejected reset failed: ".concat(err.message));
                                });
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.resolveManufacturerDisplayName(existingProduct.manufacturerId),
                                    this.resolveManufacturerVendorEmail(existingProduct.manufacturerId),
                                    this.productModel
                                        .find((0, active_product_filter_1.matchActiveProducts)({
                                        urnNo: trimmedUrn,
                                        $or: [
                                            { manufacturerId: existingProduct.manufacturerId },
                                            { vendorId: existingProduct.manufacturerId },
                                        ],
                                    }))
                                        .select({ productName: 1, eoiNo: 1 })
                                        .lean()
                                        .exec(),
                                ])];
                        case 9:
                            _a = _c.sent(), manufacturerName = _a[0], vendorEmail = _a[1], urnProducts = _a[2];
                            productNames = (urnProducts !== null && urnProducts !== void 0 ? urnProducts : [])
                                .map(function (row) { var _a; return String((_a = row.productName) !== null && _a !== void 0 ? _a : '').trim(); })
                                .filter(Boolean);
                            eoiNos = (urnProducts !== null && urnProducts !== void 0 ? urnProducts : []).map(function (row) { var _a; return String((_a = row.eoiNo) !== null && _a !== void 0 ? _a : '').trim(); });
                            this.lifecycleNotification
                                .notifyUrnSubmittedForReview({
                                manufacturerId: existingProduct.manufacturerId.toString(),
                                urnNo: trimmedUrn,
                                productName: existingProduct.productName,
                                productNames: productNames.length > 0
                                    ? productNames
                                    : existingProduct.productName
                                        ? [String(existingProduct.productName)]
                                        : [],
                                eoiNos: eoiNos,
                                manufacturerName: manufacturerName,
                                vendorEmail: vendorEmail,
                            })
                                .catch(function (err) {
                                return _this.logger.warn("[Update URN Status] Submit-for-review notification failed: ".concat(err === null || err === void 0 ? void 0 : err.message));
                            });
                            this.logger.log("[Update URN Status] Submit-for-review admin notification queued for ".concat(updateUrnStatusDto.urnNo.trim(), " (").concat(previousUrnStatus, " \u2192 4)"));
                            _c.label = 10;
                        case 10: return [4 /*yield*/, this.invalidateProductListingsCache()];
                        case 11:
                            _c.sent();
                            return [2 /*return*/, updatedProduct];
                        case 12:
                            error_5 = _c.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 13:
                            _c.sent();
                            session.endSession();
                            if (error_5 instanceof common_1.NotFoundException ||
                                error_5 instanceof common_1.BadRequestException) {
                                throw error_5;
                            }
                            console.error('[Update URN Status] Error:', error_5);
                            throw new common_1.InternalServerErrorException(error_5.message || 'Failed to update URN status');
                        case 14: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Admin path: update either `urnStatus` or `productStatus` for all products under one URN.
         * `updateStatusType`: `urn_status` | `product_status`.
         */
        ProductRegistrationService_1.prototype.adminUpdateUrnStatus = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, products, sampleUrnStatus, targetsRenewBand, inRenewBand, now, vendorId, manufacturerId, previousUrnStatus, sampleProductName, setDoc, updateFilter, session, err_3, shouldNotifyInitialUrnApproval, manufacturer, vendorEmail, manufacturerName, productRenewStatus, notifyRejected;
                var _this = this;
                var _a, _b, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            urnNo = dto.urnNo.trim();
                            if (!urnNo) {
                                throw new common_1.BadRequestException('urnNo is required');
                            }
                            return [4 /*yield*/, this.productModel.find({ urnNo: urnNo }).lean().exec()];
                        case 1:
                            products = _h.sent();
                            if (!products.length) {
                                throw new common_1.NotFoundException("No product found for URN: ".concat(urnNo));
                            }
                            if (dto.updateStatusType === 'urn_status') {
                                sampleUrnStatus = Number((_a = products[0].urnStatus) !== null && _a !== void 0 ? _a : 0);
                                targetsRenewBand = dto.updateStatusTo >= renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING &&
                                    dto.updateStatusTo <= renewal_urn_status_constants_1.RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING;
                                inRenewBand = sampleUrnStatus >= renewal_urn_status_constants_1.RENEWAL_URN_STATUS.PAYMENT_PENDING &&
                                    sampleUrnStatus <= renewal_urn_status_constants_1.RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING;
                                if (targetsRenewBand || inRenewBand) {
                                    throw new common_1.BadRequestException('Renewal URN statuses (12–17) must use PATCH /renew/urn-status with renewalCycleId. ' +
                                        'Do not use PATCH /api/admin/products/urn-status for renewal completion.');
                                }
                            }
                            if (dto.updateStatusType === 'urn_status') {
                                if (dto.updateStatusTo < 0 || dto.updateStatusTo > 17) {
                                    throw new common_1.BadRequestException('updateStatusTo must be between 0 and 17 for urn_status');
                                }
                            }
                            else if (dto.updateStatusType === 'product_status') {
                                if (dto.updateStatusTo < 0 || dto.updateStatusTo > 3) {
                                    throw new common_1.BadRequestException('updateStatusTo must be between 0 and 3 for product_status');
                                }
                            }
                            now = new Date();
                            vendorId = products[0].vendorId;
                            manufacturerId = products[0].manufacturerId;
                            previousUrnStatus = Number((_b = products[0].urnStatus) !== null && _b !== void 0 ? _b : 0);
                            sampleProductName = String((_c = products[0].productName) !== null && _c !== void 0 ? _c : '').trim();
                            if (!(dto.updateStatusType === 'urn_status')) return [3 /*break*/, 5];
                            if (!(dto.updateStatusTo === urn_tab_review_constants_1.VENDOR_RESUBMIT_URN_STATUS)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.urnTabReviewService.assertAdminQuickViewTransitionAllowed(urnNo, dto.updateStatusTo)];
                        case 2:
                            _h.sent();
                            return [3 /*break*/, 5];
                        case 3:
                            if (!(dto.updateStatusTo === category_change_constants_1.ADMIN_FINAL_SUBMIT_URN_STATUS)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.urnTabReviewService.assertAdminQuickViewTransitionAllowed(urnNo, dto.updateStatusTo)];
                        case 4:
                            _h.sent();
                            _h.label = 5;
                        case 5:
                            setDoc = { updatedDate: now };
                            updateFilter = { urnNo: urnNo };
                            if (dto.updateStatusType === 'urn_status') {
                                setDoc.urnStatus = dto.updateStatusTo;
                                // Resend to vendor (5): keep product active so vendor forms stay editable with prior data.
                                if (dto.updateStatusTo === 5) {
                                    setDoc.productStatus = 1;
                                }
                            }
                            else {
                                setDoc.productStatus = dto.updateStatusTo;
                                // Certification transition safety: only Submitted (1) rows can become Certified (2).
                                // Rejected (3) rows must remain rejected.
                                if (dto.updateStatusTo === 2) {
                                    updateFilter.productStatus = 1;
                                }
                            }
                            return [4 /*yield*/, this.connection.startSession()];
                        case 6:
                            session = _h.sent();
                            _h.label = 7;
                        case 7:
                            _h.trys.push([7, 10, 12, 13]);
                            session.startTransaction();
                            return [4 /*yield*/, this.productModel
                                    .updateMany(updateFilter, { $set: setDoc }, { session: session })
                                    .exec()];
                        case 8:
                            _h.sent();
                            return [4 /*yield*/, session.commitTransaction()];
                        case 9:
                            _h.sent();
                            return [3 /*break*/, 13];
                        case 10:
                            err_3 = _h.sent();
                            return [4 /*yield*/, session.abortTransaction()];
                        case 11:
                            _h.sent();
                            throw err_3;
                        case 12:
                            session.endSession();
                            return [7 /*endfinally*/];
                        case 13:
                            if (!(dto.updateStatusType === 'urn_status')) return [3 /*break*/, 22];
                            return [4 /*yield*/, this.tryLogUrnLifecycleStep(vendorId, manufacturerId, urnNo, dto.updateStatusTo, previousUrnStatus)];
                        case 14:
                            _h.sent();
                            return [4 /*yield*/, this.syncUrnProductsToZohoDeal(urnNo, manufacturerId).catch(function (error) {
                                    _this.logger.warn("[Admin URN Status] Zoho deal product sync failed for ".concat(urnNo, ": ").concat((error === null || error === void 0 ? void 0 : error.message) || error));
                                })];
                        case 15:
                            _h.sent();
                            if (!(dto.updateStatusTo === 6)) return [3 /*break*/, 17];
                            return [4 /*yield*/, this.syncDocumentReviewedStatusToZohoDeal(urnNo, manufacturerId).catch(function (error) {
                                    _this.logger.warn("[Admin URN Status] Zoho deal status update failed for ".concat(urnNo, ": ").concat((error === null || error === void 0 ? void 0 : error.message) || error));
                                })];
                        case 16:
                            _h.sent();
                            _h.label = 17;
                        case 17:
                            if (dto.updateStatusTo === 4 && previousUrnStatus !== 4) {
                                this.urnTabReviewService
                                    .ensurePendingReviewsForUrn(urnNo)
                                    .catch(function (err) {
                                    return _this.logger.warn("[Admin URN Status] Tab review init failed: ".concat(err.message));
                                });
                            }
                            shouldNotifyInitialUrnApproval = (dto.updateStatusTo === 1 && previousUrnStatus === 0) ||
                                (dto.updateStatusTo === 2 && previousUrnStatus === 0);
                            if (!shouldNotifyInitialUrnApproval) return [3 /*break*/, 19];
                            return [4 /*yield*/, this.manufacturerModel
                                    .findById(manufacturerId)
                                    .select('manufacturerName vendor_name vendor_email')
                                    .lean()
                                    .exec()];
                        case 18:
                            manufacturer = _h.sent();
                            vendorEmail = String((_d = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.vendor_email) !== null && _d !== void 0 ? _d : '').trim();
                            manufacturerName = String((_e = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.manufacturerName) !== null && _e !== void 0 ? _e : '').trim() ||
                                String((_f = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.vendor_name) !== null && _f !== void 0 ? _f : '').trim();
                            this.logger.log("[Admin URN Status] Initial approval email for ".concat(urnNo, " (").concat(previousUrnStatus, " \u2192 ").concat(dto.updateStatusTo, ")"));
                            this.lifecycleNotification
                                .notifyUrnInitialApproved({
                                manufacturerId: manufacturerId.toString(),
                                urnNo: urnNo,
                                productName: sampleProductName || urnNo,
                                approvedBy: 'GreenPro Admin',
                                vendorEmail: vendorEmail || undefined,
                                manufacturerName: manufacturerName || undefined,
                            })
                                .catch(function (err) {
                                return _this.logger.warn("[Admin URN Status] Initial approval notification failed: ".concat(err === null || err === void 0 ? void 0 : err.message));
                            });
                            return [3 /*break*/, 20];
                        case 19:
                            if (dto.updateStatusTo === 2 &&
                                dto.updateStatusType === 'urn_status' &&
                                previousUrnStatus === 1) {
                                this.logger.debug("[Admin URN Status] Skipping initial approval email for ".concat(urnNo, ": ").concat(previousUrnStatus, " \u2192 2 (registration payment stage)"));
                            }
                            else if (dto.updateStatusTo === 2 &&
                                dto.updateStatusType === 'urn_status' &&
                                previousUrnStatus >= 2) {
                                this.logger.debug("[Admin URN Status] Skipping initial approval email for ".concat(urnNo, ": already at urnStatus ").concat(previousUrnStatus));
                            }
                            _h.label = 20;
                        case 20:
                            if (dto.updateStatusTo === 11) {
                                productRenewStatus = Number((_g = products[0].productRenewStatus) !== null && _g !== void 0 ? _g : 0);
                                if (productRenewStatus === 0) {
                                    this.lifecycleNotification
                                        .notifyProductCertified({
                                        manufacturerId: manufacturerId.toString(),
                                        urnNo: urnNo,
                                        productName: sampleProductName || urnNo,
                                    })
                                        .catch(function (err) {
                                        return _this.logger.warn("[Admin URN Status] Certification complete notification failed: ".concat(err.message));
                                    });
                                }
                            }
                            return [4 /*yield*/, this.invalidateProductListingsCache()];
                        case 21:
                            _h.sent();
                            return [2 /*return*/, { urnNo: urnNo, urnStatus: dto.updateStatusTo }];
                        case 22:
                            if (dto.updateStatusType === 'product_status') {
                                if (dto.updateStatusTo === 2) {
                                    this.lifecycleNotification
                                        .notifyProductCertified({
                                        manufacturerId: manufacturerId.toString(),
                                        urnNo: urnNo,
                                        productName: sampleProductName || urnNo,
                                    })
                                        .catch(function (err) {
                                        return _this.logger.warn("[Admin URN Status] Product certified notification failed: ".concat(err.message));
                                    });
                                }
                                else if (dto.updateStatusTo === 3) {
                                    notifyRejected = previousUrnStatus < 2
                                        ? this.lifecycleNotification.notifyUrnRegistrationRejected({
                                            manufacturerId: manufacturerId.toString(),
                                            urnNo: urnNo,
                                            productName: sampleProductName || urnNo,
                                        })
                                        : this.lifecycleNotification.notifyProductRejected({
                                            manufacturerId: manufacturerId.toString(),
                                            urnNo: urnNo,
                                            productName: sampleProductName || urnNo,
                                        });
                                    notifyRejected.catch(function (err) {
                                        return _this.logger.warn("[Admin URN Status] Product rejected notification failed: ".concat(err.message));
                                    });
                                }
                            }
                            return [4 /*yield*/, this.invalidateProductListingsCache()];
                        case 23:
                            _h.sent();
                            return [2 /*return*/, { urnNo: urnNo, productStatus: dto.updateStatusTo }];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.adminUpdateRenewValidity = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, parsed, normalizedDate, validTillDate, products, productIds, preview, updateResult;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            urnNo = String((_a = dto.urnNo) !== null && _a !== void 0 ? _a : '').trim();
                            if (!urnNo) {
                                throw new common_1.BadRequestException('urnNo is required');
                            }
                            parsed = new Date(dto.validTillDate);
                            if (Number.isNaN(parsed.getTime())) {
                                throw new common_1.BadRequestException('validTillDate must be a valid date (YYYY-MM-DD or ISO)');
                            }
                            normalizedDate = parsed.toISOString().slice(0, 10);
                            validTillDate = new Date("".concat(normalizedDate, "T00:00:00.000Z"));
                            return [4 /*yield*/, this.productModel
                                    .find((0, active_product_filter_1.matchActiveProducts)({ urnNo: urnNo }))
                                    .select('_id')
                                    .lean()
                                    .exec()];
                        case 1:
                            products = _c.sent();
                            if (!products.length) {
                                throw new common_1.NotFoundException("No product found for URN: ".concat(urnNo));
                            }
                            productIds = products.map(function (p) { return String(p._id); });
                            preview = Boolean(dto.preview);
                            if (preview) {
                                return [2 /*return*/, {
                                        urnNo: urnNo,
                                        updatedCount: productIds.length,
                                        validTillDate: normalizedDate,
                                        productIds: productIds,
                                        preview: true,
                                    }];
                            }
                            return [4 /*yield*/, this.productModel
                                    .updateMany((0, active_product_filter_1.matchActiveProducts)({ urnNo: urnNo }), {
                                    $set: {
                                        validtillDate: validTillDate,
                                        updatedDate: new Date(),
                                    },
                                })
                                    .exec()];
                        case 2:
                            updateResult = _c.sent();
                            return [4 /*yield*/, this.invalidateProductListingsCache()];
                        case 3:
                            _c.sent();
                            return [2 /*return*/, {
                                    urnNo: urnNo,
                                    updatedCount: Number((_b = updateResult.modifiedCount) !== null && _b !== void 0 ? _b : 0),
                                    validTillDate: normalizedDate,
                                }];
                    }
                });
            });
        };
        /**
         * Vendor EOI list grouped by URN (paginate/sort URNs, not flat products).
         * Status filters apply to **`products.productStatus`** (EOI list status: Pending, Submitted, etc.), not manufacturer/vendor status.
         * **Default** (no `productStatus` / `productStatusList`): **Pending (0) + Submitted (1)** only.
         * Use `productStatusList=0,1` explicitly or a single `productStatus` / `status` to override. `4` includes expired certified rows (`productStatus` 2 past validtill).
         */
        ProductRegistrationService_1.prototype.listProducts = function (listProductsDto, manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, error_6, _a, requestedPage, _b, requestedLimit, search, _c, sort, categoryId, dateFrom, dateTo, limit, resolvedStatuses, statusMatch, vendorObjectId, nativeMatch, createdRange, to, locationProductIds, emptyResponse, basePipeline, searchRegex, rowBase, sortOrder, urnSummaryPipeline, eoiLookupMatchStages, totalUrnPipeline, countFacetResult, totalCount, pagination, skip, urnDataPipeline, dataFacetResult, payload, certifiedPairs, _i, _d, urnRow, urnNo, eois, _e, _f, eoi, plantMergeSourceIndex_1, grouped, response, error_7;
                var _this = this;
                var _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
                return __generator(this, function (_s) {
                    switch (_s.label) {
                        case 0:
                            _s.trys.push([0, 9, , 10]);
                            cacheKey = this.buildVendorProductListCacheKey(listProductsDto, manufacturerId);
                            _s.label = 1;
                        case 1:
                            _s.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _s.sent();
                            if (cached && Array.isArray(cached.data) && cached.pagination) {
                                return [2 /*return*/, cached];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_6 = _s.sent();
                            this.logger.warn("Product vendor list cache read failed: ".concat((error_6 === null || error_6 === void 0 ? void 0 : error_6.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4:
                            _a = listProductsDto.page, requestedPage = _a === void 0 ? 1 : _a, _b = listProductsDto.limit, requestedLimit = _b === void 0 ? 20 : _b, search = listProductsDto.search, _c = listProductsDto.sort, sort = _c === void 0 ? 'desc' : _c, categoryId = listProductsDto.categoryId, dateFrom = listProductsDto.dateFrom, dateTo = listProductsDto.dateTo;
                            limit = Math.min(100, Math.max(1, Number(requestedLimit) || 20));
                            resolvedStatuses = this.resolveVendorListProductStatuses(listProductsDto);
                            statusMatch = this.buildVendorListProductStatusMatch(resolvedStatuses);
                            vendorObjectId = this.toObjectId(manufacturerId, 'manufacturerId');
                            nativeMatch = __assign({ vendorId: vendorObjectId }, (0, active_product_filter_1.matchActiveProducts)());
                            if (categoryId) {
                                nativeMatch.categoryId = this.toObjectId(categoryId, 'categoryId');
                            }
                            if (dateFrom || dateTo) {
                                createdRange = {};
                                if (dateFrom) {
                                    createdRange.$gte = new Date(dateFrom);
                                }
                                if (dateTo) {
                                    to = new Date(dateTo);
                                    to.setHours(23, 59, 59, 999);
                                    createdRange.$lte = to;
                                }
                                nativeMatch.createdDate = createdRange;
                            }
                            return [4 /*yield*/, this.findVendorProductIdsByPlantLocationFilters(manufacturerId, listProductsDto)];
                        case 5:
                            locationProductIds = _s.sent();
                            if (locationProductIds !== null) {
                                if (locationProductIds.length === 0) {
                                    emptyResponse = {
                                        data: [],
                                        pagination: (0, vendor_product_list_pagination_util_1.buildVendorProductListPagination)({
                                            page: requestedPage,
                                            limit: limit,
                                            totalCount: 0,
                                        }),
                                    };
                                    this.redisService
                                        .set(cacheKey, emptyResponse, this.getProductListCacheTtlSeconds())
                                        .catch(function (error) {
                                        _this.logger.warn("Product vendor list cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                                    });
                                    return [2 /*return*/, emptyResponse];
                                }
                                nativeMatch._id = { $in: locationProductIds };
                            }
                            basePipeline = [{ $match: nativeMatch }];
                            if (statusMatch) {
                                basePipeline.push({ $match: statusMatch });
                            }
                            basePipeline.push({
                                $lookup: {
                                    from: 'categories',
                                    localField: 'categoryId',
                                    foreignField: '_id',
                                    as: 'category',
                                },
                            }, {
                                $unwind: {
                                    path: '$category',
                                    preserveNullAndEmptyArrays: true,
                                },
                            });
                            if (search && search.trim() !== '') {
                                searchRegex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                                basePipeline.push({
                                    $match: {
                                        $or: [
                                            { productName: searchRegex },
                                            { eoiNo: searchRegex },
                                            { urnNo: searchRegex },
                                            { 'category.categoryName': searchRegex },
                                            { 'category.category_name': searchRegex },
                                        ],
                                    },
                                });
                            }
                            rowBase = __spreadArray([], basePipeline, true);
                            sortOrder = sort === 'asc' ? 1 : -1;
                            urnSummaryPipeline = __spreadArray(__spreadArray([], rowBase, true), [
                                {
                                    $group: {
                                        _id: '$urnNo',
                                        urnNo: { $first: '$urnNo' },
                                        createdDate: { $min: '$createdDate' },
                                        totalEoi: { $sum: 1 },
                                        statusCodes: { $addToSet: '$productStatus' },
                                    },
                                },
                                { $sort: { createdDate: sortOrder } },
                            ], false);
                            eoiLookupMatchStages = [
                                {
                                    $match: __assign({ $expr: {
                                            $and: [
                                                { $eq: ['$urnNo', '$$urnNo'] },
                                                { $eq: ['$vendorId', vendorObjectId] },
                                            ],
                                        } }, (0, active_product_filter_1.matchActiveProducts)()),
                                },
                            ];
                            if (statusMatch) {
                                eoiLookupMatchStages.push({ $match: statusMatch });
                            }
                            if (categoryId) {
                                eoiLookupMatchStages.push({
                                    $match: {
                                        categoryId: this.toObjectId(categoryId, 'categoryId'),
                                    },
                                });
                            }
                            totalUrnPipeline = __spreadArray(__spreadArray([], urnSummaryPipeline, true), [{ $count: 'count' }], false);
                            return [4 /*yield*/, this.productModel
                                    .aggregate([
                                    {
                                        $facet: {
                                            totalCount: totalUrnPipeline,
                                        },
                                    },
                                ])
                                    .allowDiskUse(true)
                                    .option({ maxTimeMS: 120000 })
                                    .exec()];
                        case 6:
                            countFacetResult = _s.sent();
                            totalCount = (_k = (_j = (_h = (_g = countFacetResult[0]) === null || _g === void 0 ? void 0 : _g.totalCount) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.count) !== null && _k !== void 0 ? _k : 0;
                            pagination = (0, vendor_product_list_pagination_util_1.buildVendorProductListPagination)({
                                page: requestedPage,
                                limit: limit,
                                totalCount: totalCount,
                            });
                            skip = (pagination.page - 1) * pagination.limit;
                            urnDataPipeline = __spreadArray(__spreadArray([], urnSummaryPipeline, true), [
                                { $skip: skip },
                                { $limit: pagination.limit },
                                {
                                    $lookup: {
                                        from: 'products',
                                        let: { urnNo: '$urnNo' },
                                        pipeline: __spreadArray(__spreadArray([], eoiLookupMatchStages, true), [
                                            {
                                                $lookup: {
                                                    from: 'categories',
                                                    localField: 'categoryId',
                                                    foreignField: '_id',
                                                    as: 'category',
                                                },
                                            },
                                            {
                                                $unwind: {
                                                    path: '$category',
                                                    preserveNullAndEmptyArrays: true,
                                                },
                                            },
                                            {
                                                $lookup: {
                                                    from: 'product_plants',
                                                    let: { pid: '$_id' },
                                                    pipeline: [
                                                        {
                                                            $match: {
                                                                $expr: { $eq: ['$productId', '$$pid'] },
                                                                is_deleted: { $ne: true },
                                                            },
                                                        },
                                                        { $sort: { createdDate: 1 } },
                                                        { $limit: 1 },
                                                        {
                                                            $lookup: {
                                                                from: 'states',
                                                                localField: 'stateId',
                                                                foreignField: '_id',
                                                                as: 'st',
                                                            },
                                                        },
                                                        {
                                                            $unwind: {
                                                                path: '$st',
                                                                preserveNullAndEmptyArrays: true,
                                                            },
                                                        },
                                                        {
                                                            $project: {
                                                                _id: 0,
                                                                city: 1,
                                                                stateName: {
                                                                    $ifNull: ['$st.stateName', '$st.name'],
                                                                },
                                                            },
                                                        },
                                                    ],
                                                    as: 'primaryPlant',
                                                },
                                            },
                                            {
                                                $unwind: {
                                                    path: '$primaryPlant',
                                                    preserveNullAndEmptyArrays: true,
                                                },
                                            },
                                            {
                                                $lookup: {
                                                    from: 'sectors',
                                                    let: { sectorId: '$category.sector' },
                                                    pipeline: [
                                                        {
                                                            $match: {
                                                                $expr: {
                                                                    $and: [
                                                                        { $ne: ['$$sectorId', null] },
                                                                        { $eq: ['$id', '$$sectorId'] },
                                                                    ],
                                                                },
                                                            },
                                                        },
                                                        { $limit: 1 },
                                                        { $project: { _id: 0, name: 1 } },
                                                    ],
                                                    as: 'sectorDoc',
                                                },
                                            },
                                            {
                                                $unwind: {
                                                    path: '$sectorDoc',
                                                    preserveNullAndEmptyArrays: true,
                                                },
                                            },
                                            {
                                                $project: {
                                                    _id: 1,
                                                    eoiNo: 1,
                                                    productName: 1,
                                                    productStatus: 1,
                                                    validtillDate: 1,
                                                    createdDate: 1,
                                                    plantCount: 1,
                                                    categoryName: {
                                                        $ifNull: [
                                                            '$category.categoryName',
                                                            '$category.category_name',
                                                        ],
                                                    },
                                                    sector: '$category.sector',
                                                    sectorName: '$sectorDoc.name',
                                                    city: '$primaryPlant.city',
                                                    stateName: '$primaryPlant.stateName',
                                                },
                                            },
                                            { $sort: { createdDate: -1 } },
                                        ], false),
                                        as: 'eois',
                                    },
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        urnNo: 1,
                                        createdDate: 1,
                                        totalEoi: 1,
                                        statusCodes: 1,
                                        eois: 1,
                                    },
                                },
                            ], false);
                            return [4 /*yield*/, this.productModel
                                    .aggregate([
                                    {
                                        $facet: {
                                            data: urnDataPipeline,
                                        },
                                    },
                                ])
                                    .allowDiskUse(true)
                                    .option({ maxTimeMS: 120000 })
                                    .exec()];
                        case 7:
                            dataFacetResult = _s.sent();
                            payload = (_l = dataFacetResult[0]) !== null && _l !== void 0 ? _l : { data: [] };
                            certifiedPairs = [];
                            for (_i = 0, _d = (_m = payload.data) !== null && _m !== void 0 ? _m : []; _i < _d.length; _i++) {
                                urnRow = _d[_i];
                                urnNo = String((_o = urnRow.urnNo) !== null && _o !== void 0 ? _o : '').trim();
                                eois = urnRow.eois;
                                if (!urnNo || !Array.isArray(eois))
                                    continue;
                                for (_e = 0, _f = eois; _e < _f.length; _e++) {
                                    eoi = _f[_e];
                                    if (Number((_p = eoi.productStatus) !== null && _p !== void 0 ? _p : 0) === product_status_constants_1.PRODUCT_STATUS_CERTIFIED) {
                                        certifiedPairs.push({
                                            urnNo: urnNo,
                                            eoiNo: String((_q = eoi.eoiNo) !== null && _q !== void 0 ? _q : '').trim(),
                                        });
                                    }
                                }
                            }
                            return [4 /*yield*/, (0, vendor_plant_merge_status_util_1.loadVendorPlantMergeSourceIndex)(this.plantMergeAuditModel, certifiedPairs)];
                        case 8:
                            plantMergeSourceIndex_1 = _s.sent();
                            grouped = ((_r = payload.data) !== null && _r !== void 0 ? _r : []).map(function (u) {
                                var _a, _b;
                                var urnStatusCode = _this.deriveVendorUrnStatus(Array.isArray(u.statusCodes) ? u.statusCodes : []);
                                var urnStatusLabel = _this.mapUrnRollupStatusLabel(urnStatusCode);
                                var urnNo = String((_a = u.urnNo) !== null && _a !== void 0 ? _a : '').trim();
                                return {
                                    urnNo: u.urnNo,
                                    createdDate: u.createdDate,
                                    urnStatus: urnStatusLabel,
                                    urnStatusCode: urnStatusCode,
                                    urnStatusLabel: urnStatusLabel,
                                    totalEoi: Number((_b = u.totalEoi) !== null && _b !== void 0 ? _b : 0),
                                    eois: Array.isArray(u.eois)
                                        ? u.eois.map(function (e) {
                                            var _a;
                                            return _this.formatVendorListEoiEntry(e !== null && e !== void 0 ? e : {}, plantMergeSourceIndex_1.get((0, vendor_plant_merge_status_util_1.plantMergeSourceLookupKey)(urnNo, String((_a = e === null || e === void 0 ? void 0 : e.eoiNo) !== null && _a !== void 0 ? _a : ''))));
                                        })
                                        : [],
                                };
                            });
                            response = {
                                data: grouped,
                                pagination: pagination,
                            };
                            this.redisService
                                .set(cacheKey, response, this.getProductListCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("Product vendor list cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, response];
                        case 9:
                            error_7 = _s.sent();
                            this.logger.error("[List Products] ".concat((error_7 === null || error_7 === void 0 ? void 0 : error_7.message) || 'unknown error'), error_7 === null || error_7 === void 0 ? void 0 : error_7.stack);
                            throw new common_1.InternalServerErrorException(error_7.message || 'Failed to fetch EOI list');
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Admin renew products list — manufacturer-grouped with names (certified EOIs only).
         */
        ProductRegistrationService_1.prototype.adminListRenewProducts = function () {
            return __awaiter(this, void 0, void 0, function () {
                var currentDate, thresholdDate, renewMatch, pipeline, rows, data;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            currentDate = new Date();
                            thresholdDate = new Date(currentDate);
                            thresholdDate.setDate(thresholdDate.getDate() + 60);
                            renewMatch = __assign(__assign({ productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED }, (0, active_product_filter_1.matchActiveProducts)()), { $or: [
                                    {
                                        validtillDate: {
                                            $exists: true,
                                            $ne: null,
                                            $lt: thresholdDate,
                                        },
                                    },
                                    { urnStatus: { $gte: 12, $lte: 17 } },
                                ] });
                            pipeline = [
                                { $match: renewMatch },
                                {
                                    $lookup: {
                                        from: 'manufacturers',
                                        localField: 'manufacturerId',
                                        foreignField: '_id',
                                        as: 'manufacturer',
                                    },
                                },
                                {
                                    $unwind: {
                                        path: '$manufacturer',
                                        preserveNullAndEmptyArrays: true,
                                    },
                                },
                                {
                                    $lookup: {
                                        from: 'categories',
                                        localField: 'categoryId',
                                        foreignField: '_id',
                                        as: 'category',
                                    },
                                },
                                {
                                    $unwind: {
                                        path: '$category',
                                        preserveNullAndEmptyArrays: true,
                                    },
                                },
                                {
                                    $lookup: {
                                        from: 'sectors',
                                        let: { sid: '$category.sector' },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: {
                                                        $and: [{ $ne: ['$$sid', null] }, { $eq: ['$id', '$$sid'] }],
                                                    },
                                                },
                                            },
                                            { $limit: 1 },
                                            { $project: { _id: 0, name: 1 } },
                                        ],
                                        as: '_adminSectorDoc',
                                    },
                                },
                                {
                                    $unwind: {
                                        path: '$_adminSectorDoc',
                                        preserveNullAndEmptyArrays: true,
                                    },
                                },
                                {
                                    $project: {
                                        manufacturerId: 1,
                                        urnNo: 1,
                                        createdDate: 1,
                                        productStatus: 1,
                                        urnStatus: 1,
                                        _id: 1,
                                        productId: 1,
                                        eoiNo: 1,
                                        productName: 1,
                                        productDetails: 1,
                                        validtillDate: 1,
                                        categoryId: 1,
                                        productImage: 1,
                                        categoryName: {
                                            $ifNull: ['$category.categoryName', '$category.category_name'],
                                        },
                                        sector: '$category.sector',
                                        sectorName: '$_adminSectorDoc.name',
                                        manufacturerName: {
                                            $ifNull: [
                                                '$manufacturer.manufacturerName',
                                                {
                                                    $ifNull: [
                                                        '$manufacturer.companyName',
                                                        '$manufacturer.vendor_name',
                                                    ],
                                                },
                                            ],
                                        },
                                        vendor_email: {
                                            $ifNull: ['$manufacturer.vendor_email', ''],
                                        },
                                        vendor_phone: {
                                            $ifNull: ['$manufacturer.vendor_phone', ''],
                                        },
                                        plants: { $literal: [] },
                                    },
                                },
                                {
                                    $group: {
                                        _id: { manufacturerId: '$manufacturerId', urnNo: '$urnNo' },
                                        manufacturer_id: { $first: '$manufacturerId' },
                                        manufacturerName: { $first: '$manufacturerName' },
                                        vendor_email: { $first: '$vendor_email' },
                                        vendor_phone: { $first: '$vendor_phone' },
                                        urnNo: { $first: '$urnNo' },
                                        createdDate: { $min: '$createdDate' },
                                        urn_status: { $first: '$urnStatus' },
                                        totalEoi: { $sum: 1 },
                                        eoiDocs: {
                                            $push: {
                                                _id: '$_id',
                                                productId: '$productId',
                                                eoiNo: '$eoiNo',
                                                urnNo: '$urnNo',
                                                productName: '$productName',
                                                productDetails: '$productDetails',
                                                productStatus: '$productStatus',
                                                urnStatus: '$urnStatus',
                                                validtillDate: '$validtillDate',
                                                categoryId: '$categoryId',
                                                productImage: '$productImage',
                                                createdDate: '$createdDate',
                                                categoryName: '$categoryName',
                                                sector: '$sector',
                                                sectorName: '$sectorName',
                                                manufacturerName: '$manufacturerName',
                                                plants: '$plants',
                                            },
                                        },
                                    },
                                },
                                {
                                    $group: {
                                        _id: '$_id.manufacturerId',
                                        manufacturer_id: { $first: '$manufacturer_id' },
                                        manufacturerName: { $first: '$manufacturerName' },
                                        vendor_email: { $first: '$vendor_email' },
                                        vendor_phone: { $first: '$vendor_phone' },
                                        total_urns: { $sum: 1 },
                                        total_eois: { $sum: '$totalEoi' },
                                        sortKey: { $max: '$createdDate' },
                                        urns: {
                                            $push: {
                                                urnNo: '$urnNo',
                                                createdDate: '$createdDate',
                                                totalEoi: '$totalEoi',
                                                urn_status: '$urn_status',
                                                eoiDocs: '$eoiDocs',
                                            },
                                        },
                                    },
                                },
                                { $sort: { sortKey: 1 } },
                            ];
                            return [4 /*yield*/, this.productModel.aggregate(pipeline).exec()];
                        case 1:
                            rows = _a.sent();
                            data = rows.map(function (m) { return _this.formatRenewAdminListManufacturerGroup(m); });
                            return [2 /*return*/, { data: data, total: data.length }];
                    }
                });
            });
        };
        /**
         * List products eligible for renewal
         * Conditions:
         * - product_status = 2 (Certified)
         * - manufacturer_id = logged-in manufacturer
         * - validtill_date < (current_date + 60 days)
         */
        ProductRegistrationService_1.prototype.getRenewList = function (manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerObjectId, currentDate, thresholdDate, pipeline, data, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            manufacturerObjectId = this.toObjectId(manufacturerId, 'manufacturerId');
                            currentDate = new Date();
                            thresholdDate = new Date(currentDate);
                            thresholdDate.setDate(thresholdDate.getDate() + 60);
                            pipeline = [];
                            // Stage 1: $match - Filter by manufacturerId, productStatus = 2, and validtillDate < threshold
                            pipeline.push({
                                $match: __assign({ manufacturerId: manufacturerObjectId, productStatus: 2, validtillDate: {
                                        $exists: true,
                                        $ne: null,
                                        $lt: thresholdDate, // validtillDate < (current_date + 60 days)
                                    } }, (0, active_product_filter_1.matchActiveProducts)()),
                            });
                            // Stage 2: $lookup category by categoryId
                            pipeline.push({
                                $lookup: {
                                    from: 'categories',
                                    let: { categoryId: '$categoryId' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $eq: ['$_id', '$$categoryId'],
                                                },
                                            },
                                        },
                                    ],
                                    as: 'category',
                                },
                            });
                            // Stage 3: $unwind category (convert array to object)
                            pipeline.push({
                                $unwind: {
                                    path: '$category',
                                    preserveNullAndEmptyArrays: true,
                                },
                            });
                            // Stage 4: Sort by createdDate DESC (before projection to use original field name)
                            pipeline.push({
                                $sort: { createdDate: -1 },
                            });
                            // Stage 5: $project - Select only required fields with snake_case naming
                            pipeline.push({
                                $project: {
                                    _id: 0,
                                    product_id: '$productId',
                                    eoi_no: '$eoiNo',
                                    urn_no: '$urnNo',
                                    product_name: '$productName',
                                    product_details: { $ifNull: ['$productDetails', ''] },
                                    productDetails: { $ifNull: ['$productDetails', ''] },
                                    unit_count: { $ifNull: ['$plantCount', 0] },
                                    plantCount: { $ifNull: ['$plantCount', 0] },
                                    category_name: {
                                        $cond: {
                                            if: { $ne: ['$category', null] },
                                            then: {
                                                $ifNull: [
                                                    '$category.categoryName',
                                                    { $ifNull: ['$category.category_name', null] },
                                                ],
                                            },
                                            else: null,
                                        },
                                    },
                                    validtill_date: '$validtillDate',
                                    product_status: '$productStatus',
                                    created_date: '$createdDate',
                                },
                            });
                            return [4 /*yield*/, this.productModel.aggregate(pipeline).exec()];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, data];
                        case 2:
                            error_8 = _a.sent();
                            console.error('[Get Renew List] Error:', error_8);
                            console.error('[Get Renew List] Error stack:', error_8.stack);
                            throw new common_1.InternalServerErrorException(error_8.message ||
                                'Failed to get renew list. Please check the logs for details.');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Certified EOIs only — categories + product_plants (with geo) for renew URN details.
         */
        ProductRegistrationService_1.prototype.getRenewProductDetailsByUrn = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.getProductDetailsByUrn(urnNo, {
                            renewEligibleOnly: true,
                            enrichPlantsWithGeo: true,
                        })];
                });
            });
        };
        /**
         * Get complete product details by URN number
         * Includes related data from categories, manufacturers, vendors, product_plants, and payment_details
         */
        ProductRegistrationService_1.prototype.getProductDetailsByUrn = function (urnNo, options) {
            return __awaiter(this, void 0, void 0, function () {
                var renewEligibleOnly, enrichPlantsWithGeo, excludeExpired, trimmedUrnNo, urnProductMatch, urnProductSummaries, primaryProductId, pipeline, rawMaterialsCollections, _i, rawMaterialsCollections_1, collectionName, results, urnStatuses_1, anyCertifiedOnUrn_1, formattedResults, siteVisits_1, productDetailsList_1, rowsWithPlants, error_9;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 6, , 7]);
                            if (!urnNo || urnNo.trim() === '') {
                                throw new common_1.BadRequestException('URN number is required');
                            }
                            renewEligibleOnly = (options === null || options === void 0 ? void 0 : options.renewEligibleOnly) === true;
                            enrichPlantsWithGeo = (options === null || options === void 0 ? void 0 : options.enrichPlantsWithGeo) === true;
                            excludeExpired = (options === null || options === void 0 ? void 0 : options.excludeExpired) === true;
                            trimmedUrnNo = urnNo.trim();
                            urnProductMatch = __assign(__assign({ urnNo: trimmedUrnNo }, (renewEligibleOnly
                                ? __assign(__assign({}, (0, active_product_filter_1.matchActiveProducts)()), { productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED }) : (0, active_product_filter_1.matchActiveProducts)())), (excludeExpired ? { $nor: [(0, expired_product_filter_1.matchExpiredProducts)()] } : {}));
                            return [4 /*yield*/, this.productModel
                                    .find(urnProductMatch)
                                    .select('_id productId eoiNo urnNo productName productImage plantCount categoryId productDetails productType productStatus productRenewStatus urnStatus assessmentReportUrl rejectedDetails certifiedDate validtillDate firstNotifyDate secondNotifyDate thirdNotifyDate renewedDate createdDate updatedDate')
                                    .sort({ createdDate: 1 })
                                    .lean()
                                    .exec()];
                        case 1:
                            urnProductSummaries = _a.sent();
                            if (urnProductSummaries.length === 0) {
                                throw new common_1.NotFoundException("No products found with URN: ".concat(urnNo));
                            }
                            primaryProductId = urnProductSummaries[0]._id;
                            pipeline = [];
                            // Stage 1: enrich only the primary EOI row; shared URN data is attached once below.
                            pipeline.push({
                                $match: __assign(__assign({ _id: primaryProductId, urnNo: trimmedUrnNo }, (renewEligibleOnly
                                    ? __assign(__assign({}, (0, active_product_filter_1.matchActiveProducts)()), { productStatus: product_status_constants_1.PRODUCT_STATUS_CERTIFIED }) : (0, active_product_filter_1.matchActiveProducts)())), (excludeExpired ? { $nor: [(0, expired_product_filter_1.matchExpiredProducts)()] } : {})),
                            });
                            // Stage 2: $lookup - Join with categories collection
                            pipeline.push({
                                $lookup: {
                                    from: 'categories',
                                    let: { categoryId: '$categoryId' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $eq: ['$_id', '$$categoryId'],
                                                },
                                            },
                                        },
                                    ],
                                    as: 'category',
                                },
                            });
                            // Stage 3: $lookup - Join with manufacturers collection
                            pipeline.push({
                                $lookup: {
                                    from: 'manufacturers',
                                    let: { manufacturerId: '$manufacturerId' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $eq: ['$_id', '$$manufacturerId'],
                                                },
                                            },
                                        },
                                    ],
                                    as: 'manufacturer',
                                },
                            });
                            // Stage 4: $lookup - Join with vendors collection
                            pipeline.push({
                                $lookup: {
                                    from: 'vendors',
                                    let: { vendorId: '$vendorId' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $eq: ['$_id', '$$vendorId'],
                                                },
                                            },
                                        },
                                    ],
                                    as: 'vendor',
                                },
                            });
                            // Stage 5: $lookup - Join product_plants (all plants for this URN, not only primary EOI row)
                            pipeline.push(this.buildProductPlantsLookupStage({
                                enrichPlantsWithGeo: enrichPlantsWithGeo,
                                matchPlantsByUrn: true,
                            }));
                            // Stage 6: $lookup - Join with payment_details collection (by urn_no)
                            // Match trailing-slash URN variants and prefer the latest row per type.
                            pipeline.push({
                                $lookup: {
                                    from: 'payment_details',
                                    let: { urnNo: '$urnNo' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: (0, urn_lookup_match_util_1.urnLookupMatchExpr)(),
                                            },
                                        },
                                        { $sort: { updatedDate: -1, createdDate: -1, paymentId: -1 } },
                                    ],
                                    as: 'payments',
                                },
                            });
                            // Stage 7: $lookup - Join with process_product_design (urn + vendor — one row per vendor)
                            pipeline.push({
                                $lookup: {
                                    from: 'process_product_design',
                                    let: { urnNo: '$urnNo', vendorId: '$vendorId' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ['$urnNo', '$$urnNo'] },
                                                        { $eq: ['$vendorId', '$$vendorId'] },
                                                    ],
                                                },
                                            },
                                        },
                                        { $sort: { updatedDate: -1, createdDate: -1 } },
                                        { $limit: 1 },
                                    ],
                                    as: 'product_design',
                                },
                            });
                            // Stage 8: $lookup - Join with process_pd_measures (urn + vendor)
                            pipeline.push({
                                $lookup: {
                                    from: 'process_pd_measures',
                                    let: { urnNo: '$urnNo', vendorId: '$vendorId' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ['$urnNo', '$$urnNo'] },
                                                        { $eq: ['$vendorId', '$$vendorId'] },
                                                    ],
                                                },
                                            },
                                        },
                                        { $sort: { productDesignMeasureId: 1 } },
                                    ],
                                    as: 'product_design_measures',
                                },
                            });
                            // Stage 9: $lookup - Join with all_product_documents (product_design, urn + vendor)
                            pipeline.push({
                                $lookup: {
                                    from: 'all_product_documents',
                                    let: { urnNo: '$urnNo', vendorId: '$vendorId' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ['$urnNo', '$$urnNo'] },
                                                        { $eq: ['$vendorId', '$$vendorId'] },
                                                        { $eq: ['$documentForm', document_section_key_constants_1.DocumentSectionKey.PRODUCT_DESIGN] },
                                                        { $ne: ['$isDeleted', true] },
                                                    ],
                                                },
                                            },
                                        },
                                        { $sort: { productDocumentId: -1 } },
                                    ],
                                    as: 'product_design_documents',
                                },
                            });
                            // Stage 10: $lookup - Join with process_product_performance (urn + vendor)
                            pipeline.push({
                                $lookup: {
                                    from: 'process_product_performance',
                                    let: { urnNo: '$urnNo', vendorId: '$vendorId' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ['$urnNo', '$$urnNo'] },
                                                        { $eq: ['$vendorId', '$$vendorId'] },
                                                    ],
                                                },
                                            },
                                        },
                                        { $sort: { updatedDate: -1, createdDate: -1 } },
                                        { $limit: 1 },
                                    ],
                                    as: 'product_performance',
                                },
                            });
                            // Stage 10b: $lookup - Join with process_pp_test_reports (urn + vendor)
                            pipeline.push({
                                $lookup: {
                                    from: 'process_pp_test_reports',
                                    let: { urnNo: '$urnNo', vendorId: '$vendorId' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ['$urnNo', '$$urnNo'] },
                                                        { $eq: ['$vendorId', '$$vendorId'] },
                                                    ],
                                                },
                                            },
                                        },
                                        { $sort: { productPerformanceTestReportId: 1 } },
                                    ],
                                    as: 'product_performance_test_reports',
                                },
                            });
                            // Stage 11: $lookup - Join with all_product_documents (product_performance, urn + vendor)
                            pipeline.push({
                                $lookup: {
                                    from: 'all_product_documents',
                                    let: { urnNo: '$urnNo', vendorId: '$vendorId' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ['$urnNo', '$$urnNo'] },
                                                        { $eq: ['$vendorId', '$$vendorId'] },
                                                        { $eq: ['$documentForm', document_section_key_constants_1.DocumentSectionKey.PRODUCT_PERFORMANCE] },
                                                        { $ne: ['$isDeleted', true] },
                                                    ],
                                                },
                                            },
                                        },
                                        { $sort: { productDocumentId: -1 } },
                                    ],
                                    as: 'product_performance_documents',
                                },
                            });
                            // Stage 12: $lookup - Join with raw_materials_hazardous_products collection (by urn_no)
                            pipeline.push({
                                $lookup: {
                                    from: 'raw_materials_hazardous_products',
                                    let: { urnNo: '$urnNo' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $eq: ['$urnNo', '$$urnNo'],
                                                },
                                            },
                                        },
                                        { $sort: { createdDate: 1 } },
                                    ],
                                    as: 'raw_materials_hazardous_products',
                                },
                            });
                            // Stage 13: $lookup - Join with all_product_documents (only raw_materials_hazardous_products docs for this urn)
                            pipeline.push({
                                $lookup: {
                                    from: 'all_product_documents',
                                    let: { urnNo: '$urnNo' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ['$urnNo', '$$urnNo'] },
                                                        { $eq: ['$documentForm', document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS] },
                                                        { $ne: ['$isDeleted', true] },
                                                    ],
                                                },
                                            },
                                        },
                                        { $sort: { productDocumentId: -1 } },
                                    ],
                                    as: 'raw_materials_hazardous_products_documents',
                                },
                            });
                            rawMaterialsCollections = [
                                'raw_materials_additives',
                                'raw_materials_elimination_of_formaldehyde',
                                'raw_materials_elimination_of_prohibited_flame',
                                'raw_materials_elimination_of_prohibited_flame_solvents',
                                'raw_materials_elimination_of_prohibited_flame_solvents_products',
                                'raw_materials_green_supply',
                                'raw_materials_hazardous',
                                'raw_materials_optimization_of_raw_mix',
                                'raw_materials_rapidly_renewable_materials',
                                'raw_materials_recovery',
                                'raw_materials_recycled_content',
                                'raw_materials_reduce_environmental',
                                'raw_materials_regional_materials',
                                'raw_materials_utilization',
                                'raw_materials_utilization_manufacturing_units',
                                'raw_materials_utilization_rmc',
                            ];
                            for (_i = 0, rawMaterialsCollections_1 = rawMaterialsCollections; _i < rawMaterialsCollections_1.length; _i++) {
                                collectionName = rawMaterialsCollections_1[_i];
                                pipeline.push({
                                    $lookup: {
                                        from: collectionName,
                                        let: { urnNo: '$urnNo', vendorId: '$vendorId' },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: {
                                                        $and: [
                                                            { $eq: ['$urnNo', '$$urnNo'] },
                                                            { $eq: ['$vendorId', '$$vendorId'] },
                                                        ],
                                                    },
                                                },
                                            },
                                            { $sort: { createdDate: 1 } },
                                        ],
                                        as: collectionName,
                                    },
                                });
                            }
                            // Stage 13B: $lookup - Join with all_product_documents (bucket for raw-materials section docs)
                            pipeline.push({
                                $lookup: {
                                    from: 'all_product_documents',
                                    let: { urnNo: '$urnNo' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ['$urnNo', '$$urnNo'] },
                                                        {
                                                            $in: [
                                                                '$documentForm',
                                                                [
                                                                    document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_RECYCLED_CONTENT,
                                                                    document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_REGIONAL_MATERIALS,
                                                                    document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_RAPIDLY_RENEWABLE_MATERIALS,
                                                                    document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_UTILIZATION,
                                                                    document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_GREEN_SUPPLY,
                                                                    document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE,
                                                                    document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS,
                                                                    document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ALTERNATIVE_RAW_MATERIALS,
                                                                    document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_RAW_MIX_OPTIMIZATION,
                                                                    document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ADDITIVES,
                                                                    document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_RMC_ALTERNATIVE_RAW_MATERIALS,
                                                                    document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIROMENTAL,
                                                                    document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIRONMENTAL,
                                                                    document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_RECOVERY,
                                                                    document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME,
                                                                    document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_OZONE_DEPLETING_GLOBAL_WARMING_SUBSTANCES,
                                                                ],
                                                            ],
                                                        },
                                                        { $ne: ['$isDeleted', true] },
                                                    ],
                                                },
                                            },
                                        },
                                        { $sort: { productDocumentId: -1 } },
                                    ],
                                    as: 'raw_materials_documents_bucket',
                                },
                            });
                            // Stage 14: $lookup - Join with process_manufacturing collection (by urn_no)
                            pipeline.push({
                                $lookup: {
                                    from: 'process_manufacturing',
                                    let: { urnNo: '$urnNo' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: (0, urn_lookup_match_util_1.urnLookupMatchExpr)(),
                                            },
                                        },
                                    ],
                                    as: 'process_manufacturing',
                                },
                            });
                            // Stage 15: $lookup - Join with all_product_documents (only process_manufacturing docs for this urn)
                            pipeline.push({
                                $lookup: {
                                    from: 'all_product_documents',
                                    let: { urnNo: '$urnNo' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ['$urnNo', '$$urnNo'] },
                                                        { $eq: ['$documentForm', document_section_key_constants_1.DocumentSectionKey.PROCESS_MANUFACTURING] },
                                                        { $ne: ['$isDeleted', true] },
                                                    ],
                                                },
                                            },
                                        },
                                        { $sort: { productDocumentId: -1 } },
                                    ],
                                    as: 'process_manufacturing_documents',
                                },
                            });
                            // Stage 16: $lookup - Join with process_mp_manufacturing_units collection (by urn_no)
                            pipeline.push({
                                $lookup: {
                                    from: 'process_mp_manufacturing_units',
                                    let: { urnNo: '$urnNo' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $eq: ['$urnNo', '$$urnNo'],
                                                },
                                            },
                                        },
                                        { $sort: { processMpManufacturingUnitId: 1 } },
                                    ],
                                    as: 'process_mp_manufacturing_units',
                                },
                            });
                            // Stage 17: $lookup - Join with process_waste_management collection (by urn_no)
                            pipeline.push({
                                $lookup: {
                                    from: 'process_waste_management',
                                    let: { urnNo: '$urnNo' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $eq: ['$urnNo', '$$urnNo'],
                                                },
                                            },
                                        },
                                    ],
                                    as: 'process_waste_management',
                                },
                            });
                            // Stage 18: $lookup - Join with all_product_documents (only process_waste_management docs for this urn)
                            pipeline.push({
                                $lookup: {
                                    from: 'all_product_documents',
                                    let: { urnNo: '$urnNo' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ['$urnNo', '$$urnNo'] },
                                                        { $eq: ['$documentForm', document_section_key_constants_1.DocumentSectionKey.PROCESS_WASTE_MANAGEMENT] },
                                                        { $ne: ['$isDeleted', true] },
                                                    ],
                                                },
                                            },
                                        },
                                        { $sort: { productDocumentId: -1 } },
                                    ],
                                    as: 'process_waste_management_documents',
                                },
                            });
                            // Stage 19: $lookup - Join with process_wm_manufacturing_units collection (by urn_no)
                            pipeline.push({
                                $lookup: {
                                    from: 'process_wm_manufacturing_units',
                                    let: { urnNo: '$urnNo' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $eq: ['$urnNo', '$$urnNo'],
                                                },
                                            },
                                        },
                                        { $sort: { processWmManufacturingUnitId: 1 } },
                                    ],
                                    as: 'process_wm_manufacturing_units',
                                },
                            });
                            // Stage 20: $lookup - Join with process_life_cycle_approach collection (by urn_no)
                            pipeline.push({
                                $lookup: {
                                    from: 'process_life_cycle_approach',
                                    let: { urnNo: '$urnNo' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $eq: ['$urnNo', '$$urnNo'],
                                                },
                                            },
                                        },
                                    ],
                                    as: 'process_life_cycle_approach',
                                },
                            });
                            // Stage 21: $lookup - Join with all_product_documents (only process_life_cycle_approach docs for this urn)
                            pipeline.push({
                                $lookup: {
                                    from: 'all_product_documents',
                                    let: { urnNo: '$urnNo' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ['$urnNo', '$$urnNo'] },
                                                        { $eq: ['$documentForm', document_section_key_constants_1.DocumentSectionKey.PROCESS_LIFE_CYCLE_APPROACH] },
                                                        { $ne: ['$isDeleted', true] },
                                                    ],
                                                },
                                            },
                                        },
                                        { $sort: { productDocumentId: -1 } },
                                    ],
                                    as: 'process_life_cycle_approach_documents',
                                },
                            });
                            // Stage 22: $lookup - Join with process_product_stewardship collection (by urn_no)
                            pipeline.push({
                                $lookup: {
                                    from: 'process_product_stewardship',
                                    let: { urnNo: '$urnNo' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $eq: ['$urnNo', '$$urnNo'],
                                                },
                                            },
                                        },
                                    ],
                                    as: 'process_product_stewardship',
                                },
                            });
                            // Stage 23: $lookup - Join with all_product_documents (only process_product_stewardship docs for this urn)
                            pipeline.push({
                                $lookup: {
                                    from: 'all_product_documents',
                                    let: { urnNo: '$urnNo' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ['$urnNo', '$$urnNo'] },
                                                        { $eq: ['$documentForm', document_section_key_constants_1.DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP] },
                                                        { $ne: ['$isDeleted', true] },
                                                    ],
                                                },
                                            },
                                        },
                                        { $sort: { productDocumentId: -1 } },
                                    ],
                                    as: 'process_product_stewardship_documents',
                                },
                            });
                            // Stage 23A: $lookup - Join stakeholder education/awareness programme rows
                            pipeline.push({
                                $lookup: {
                                    from: 'process_ps_stakeholder_edu_awarness',
                                    let: { urnNo: '$urnNo' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ['$urnNo', '$$urnNo'] },
                                                        { $ne: ['$isDeleted', true] },
                                                    ],
                                                },
                                            },
                                        },
                                        { $sort: { createdDate: 1 } },
                                    ],
                                    as: 'process_ps_stakeholder_edu_awarness',
                                },
                            });
                            // Stage 24: $lookup - Join with process_innovation collection (by urn_no)
                            pipeline.push({
                                $lookup: {
                                    from: 'process_innovation',
                                    let: { urnNo: '$urnNo' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $eq: ['$urnNo', '$$urnNo'],
                                                },
                                            },
                                        },
                                    ],
                                    as: 'process_innovation',
                                },
                            });
                            // Stage 25: $lookup - Join with all_product_documents (only process_innovation docs for this urn)
                            pipeline.push({
                                $lookup: {
                                    from: 'all_product_documents',
                                    let: { urnNo: '$urnNo' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ['$urnNo', '$$urnNo'] },
                                                        { $eq: ['$documentForm', document_section_key_constants_1.DocumentSectionKey.PROCESS_INNOVATION] },
                                                        { $ne: ['$isDeleted', true] },
                                                    ],
                                                },
                                            },
                                        },
                                        { $sort: { productDocumentId: -1 } },
                                    ],
                                    as: 'process_innovation_documents',
                                },
                            });
                            // Stage 26: $lookup - all non-deleted vendor documents for this URN (Quick View / admin full list)
                            pipeline.push({
                                $lookup: {
                                    from: 'all_product_documents',
                                    let: { urnNo: '$urnNo' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ['$urnNo', '$$urnNo'] },
                                                        { $ne: ['$isDeleted', true] },
                                                    ],
                                                },
                                            },
                                        },
                                        { $sort: { productDocumentId: -1 } },
                                    ],
                                    as: 'all_urn_product_documents',
                                },
                            });
                            // Stage 27: $lookup - Join with process_final_review (urn + vendor)
                            pipeline.push({
                                $lookup: {
                                    from: 'process_final_review',
                                    let: { urnNo: '$urnNo', vendorId: '$vendorId' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $and: [
                                                        { $eq: ['$urnNo', '$$urnNo'] },
                                                        { $eq: ['$vendorId', '$$vendorId'] },
                                                    ],
                                                },
                                            },
                                        },
                                        { $sort: { updatedDate: -1, createdDate: -1 } },
                                        { $limit: 1 },
                                    ],
                                    as: 'process_final_review',
                                },
                            });
                            // Stage 28: $lookup - Join with process_comments collection (by urn_no)
                            pipeline.push({
                                $lookup: {
                                    from: 'process_comments',
                                    let: { urnNo: '$urnNo' },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $eq: [
                                                        { $rtrim: { input: { $toString: '$urnNo' }, chars: '/' } },
                                                        { $rtrim: { input: { $toString: '$$urnNo' }, chars: '/' } },
                                                    ],
                                                },
                                            },
                                        },
                                        { $sort: { processCommentsId: -1 } },
                                    ],
                                    as: 'process_comments',
                                },
                            });
                            // Stage 29: $project - Format the response structure
                            pipeline.push({
                                $project: {
                                    _id: 1,
                                    productId: 1,
                                    eoiNo: 1,
                                    urnNo: 1,
                                    productName: 1,
                                    productImage: 1,
                                    plantCount: 1,
                                    productDetails: 1,
                                    productType: 1,
                                    productStatus: 1,
                                    productRenewStatus: 1,
                                    renewedDate: 1,
                                    urnStatus: 1,
                                    assessmentReportUrl: 1,
                                    rejectedDetails: 1,
                                    certifiedDate: 1,
                                    validtillDate: 1,
                                    firstNotifyDate: 1,
                                    secondNotifyDate: 1,
                                    thirdNotifyDate: 1,
                                    createdDate: 1,
                                    updatedDate: 1,
                                    category: {
                                        $cond: {
                                            if: { $gt: [{ $size: '$category' }, 0] },
                                            then: { $arrayElemAt: ['$category', 0] },
                                            else: null,
                                        },
                                    },
                                    manufacturer: {
                                        $cond: {
                                            if: { $gt: [{ $size: '$manufacturer' }, 0] },
                                            then: { $arrayElemAt: ['$manufacturer', 0] },
                                            else: null,
                                        },
                                    },
                                    vendor: {
                                        $cond: {
                                            if: { $gt: [{ $size: '$vendor' }, 0] },
                                            then: { $arrayElemAt: ['$vendor', 0] },
                                            else: null,
                                        },
                                    },
                                    plants: 1,
                                    payments: 1,
                                    product_design: {
                                        $cond: {
                                            if: { $gt: [{ $size: '$product_design' }, 0] },
                                            then: { $arrayElemAt: ['$product_design', 0] },
                                            else: null,
                                        },
                                    },
                                    product_design_measures: 1,
                                    product_design_documents: 1,
                                    product_performance: {
                                        $cond: {
                                            if: { $gt: [{ $size: '$product_performance' }, 0] },
                                            then: { $arrayElemAt: ['$product_performance', 0] },
                                            else: null,
                                        },
                                    },
                                    product_performance_test_reports: 1,
                                    product_performance_documents: 1,
                                    raw_materials_hazardous_products: 1,
                                    raw_materials_hazardous_products_documents: 1,
                                    raw_materials_additives: 1,
                                    raw_materials_additives_documents: {
                                        $filter: {
                                            input: '$raw_materials_documents_bucket',
                                            as: 'doc',
                                            cond: {
                                                $eq: ['$$doc.documentForm', document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ADDITIVES],
                                            },
                                        },
                                    },
                                    raw_materials_alternative_raw_materials_documents: {
                                        $filter: {
                                            input: '$raw_materials_documents_bucket',
                                            as: 'doc',
                                            cond: {
                                                $eq: [
                                                    '$$doc.documentForm',
                                                    document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ALTERNATIVE_RAW_MATERIALS,
                                                ],
                                            },
                                        },
                                    },
                                    raw_materials_elimination_of_formaldehyde: 1,
                                    raw_materials_elimination_of_formaldehyde_documents: {
                                        $filter: {
                                            input: '$raw_materials_documents_bucket',
                                            as: 'doc',
                                            cond: {
                                                $eq: ['$$doc.documentForm', document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE],
                                            },
                                        },
                                    },
                                    raw_materials_elimination_of_prohibited_flame: 1,
                                    raw_materials_elimination_of_prohibited_flame_documents: {
                                        $filter: {
                                            input: '$raw_materials_documents_bucket',
                                            as: 'doc',
                                            cond: {
                                                $eq: ['$$doc.documentForm', document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME],
                                            },
                                        },
                                    },
                                    raw_materials_elimination_of_prohibited_flame_solvents: 1,
                                    raw_materials_elimination_of_prohibited_flame_solvents_documents: {
                                        $filter: {
                                            input: '$raw_materials_documents_bucket',
                                            as: 'doc',
                                            cond: {
                                                $eq: [
                                                    '$$doc.documentForm',
                                                    document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS,
                                                ],
                                            },
                                        },
                                    },
                                    raw_materials_elimination_of_prohibited_flame_solvents_products: 1,
                                    raw_materials_green_supply: 1,
                                    raw_materials_green_supply_documents: {
                                        $filter: {
                                            input: '$raw_materials_documents_bucket',
                                            as: 'doc',
                                            cond: {
                                                $eq: ['$$doc.documentForm', document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_GREEN_SUPPLY],
                                            },
                                        },
                                    },
                                    raw_materials_hazardous: 1,
                                    raw_materials_optimization_of_raw_mix: 1,
                                    raw_materials_raw_mix_optimization_documents: {
                                        $filter: {
                                            input: '$raw_materials_documents_bucket',
                                            as: 'doc',
                                            cond: {
                                                $eq: [
                                                    '$$doc.documentForm',
                                                    document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_RAW_MIX_OPTIMIZATION,
                                                ],
                                            },
                                        },
                                    },
                                    raw_materials_rapidly_renewable_materials: 1,
                                    raw_materials_rapidly_renewable_materials_documents: {
                                        $filter: {
                                            input: '$raw_materials_documents_bucket',
                                            as: 'doc',
                                            cond: {
                                                $eq: ['$$doc.documentForm', document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_RAPIDLY_RENEWABLE_MATERIALS],
                                            },
                                        },
                                    },
                                    raw_materials_recovery: 1,
                                    raw_materials_recovery_documents: {
                                        $filter: {
                                            input: '$raw_materials_documents_bucket',
                                            as: 'doc',
                                            cond: {
                                                $eq: ['$$doc.documentForm', document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_RECOVERY],
                                            },
                                        },
                                    },
                                    raw_materials_elimination_of_ozone_depleting_global_warming_substances_documents: {
                                        $filter: {
                                            input: '$raw_materials_documents_bucket',
                                            as: 'doc',
                                            cond: {
                                                $eq: [
                                                    '$$doc.documentForm',
                                                    document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_OZONE_DEPLETING_GLOBAL_WARMING_SUBSTANCES,
                                                ],
                                            },
                                        },
                                    },
                                    raw_materials_recycled_content: 1,
                                    raw_materials_recycled_content_documents: {
                                        $filter: {
                                            input: '$raw_materials_documents_bucket',
                                            as: 'doc',
                                            cond: {
                                                $eq: ['$$doc.documentForm', document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_RECYCLED_CONTENT],
                                            },
                                        },
                                    },
                                    raw_materials_reduce_environmental: 1,
                                    raw_materials_reduce_environmental_documents: {
                                        $filter: {
                                            input: '$raw_materials_documents_bucket',
                                            as: 'doc',
                                            cond: {
                                                $in: [
                                                    '$$doc.documentForm',
                                                    [
                                                        document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIROMENTAL,
                                                        document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIRONMENTAL,
                                                    ],
                                                ],
                                            },
                                        },
                                    },
                                    raw_materials_rmc_alternative_raw_materials_documents: {
                                        $filter: {
                                            input: '$raw_materials_documents_bucket',
                                            as: 'doc',
                                            cond: {
                                                $eq: [
                                                    '$$doc.documentForm',
                                                    document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_RMC_ALTERNATIVE_RAW_MATERIALS,
                                                ],
                                            },
                                        },
                                    },
                                    raw_materials_regional_materials: 1,
                                    raw_materials_regional_materials_documents: {
                                        $filter: {
                                            input: '$raw_materials_documents_bucket',
                                            as: 'doc',
                                            cond: {
                                                $eq: ['$$doc.documentForm', document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_REGIONAL_MATERIALS],
                                            },
                                        },
                                    },
                                    raw_materials_utilization: 1,
                                    raw_materials_utilization_documents: {
                                        $filter: {
                                            input: '$raw_materials_documents_bucket',
                                            as: 'doc',
                                            cond: {
                                                $eq: ['$$doc.documentForm', document_section_key_constants_1.DocumentSectionKey.RAW_MATERIALS_UTILIZATION],
                                            },
                                        },
                                    },
                                    raw_materials_utilization_manufacturing_units: 1,
                                    raw_materials_utilization_rmc: 1,
                                    process_manufacturing: {
                                        $cond: {
                                            if: { $gt: [{ $size: '$process_manufacturing' }, 0] },
                                            then: { $arrayElemAt: ['$process_manufacturing', 0] },
                                            else: null,
                                        },
                                    },
                                    process_manufacturing_documents: 1,
                                    process_mp_manufacturing_units: 1,
                                    process_waste_management: {
                                        $cond: {
                                            if: { $gt: [{ $size: '$process_waste_management' }, 0] },
                                            then: { $arrayElemAt: ['$process_waste_management', 0] },
                                            else: null,
                                        },
                                    },
                                    process_waste_management_documents: 1,
                                    process_wm_manufacturing_units: 1,
                                    process_life_cycle_approach: {
                                        $cond: {
                                            if: { $gt: [{ $size: '$process_life_cycle_approach' }, 0] },
                                            then: { $arrayElemAt: ['$process_life_cycle_approach', 0] },
                                            else: null,
                                        },
                                    },
                                    process_life_cycle_approach_documents: 1,
                                    process_product_stewardship: {
                                        $cond: {
                                            if: { $gt: [{ $size: '$process_product_stewardship' }, 0] },
                                            then: { $arrayElemAt: ['$process_product_stewardship', 0] },
                                            else: null,
                                        },
                                    },
                                    process_product_stewardship_documents: 1,
                                    process_ps_stakeholder_edu_awarness: 1,
                                    process_innovation: {
                                        $cond: {
                                            if: { $gt: [{ $size: '$process_innovation' }, 0] },
                                            then: { $arrayElemAt: ['$process_innovation', 0] },
                                            else: null,
                                        },
                                    },
                                    process_innovation_documents: 1,
                                    all_urn_product_documents: 1,
                                    process_final_review: {
                                        $cond: {
                                            if: { $gt: [{ $size: '$process_final_review' }, 0] },
                                            then: { $arrayElemAt: ['$process_final_review', 0] },
                                            else: null,
                                        },
                                    },
                                    process_comments: {
                                        $cond: {
                                            if: { $gt: [{ $size: '$process_comments' }, 0] },
                                            then: { $arrayElemAt: ['$process_comments', 0] },
                                            else: null,
                                        },
                                    },
                                },
                            });
                            return [4 /*yield*/, this.productModel.aggregate(pipeline).exec()];
                        case 2:
                            results = _a.sent();
                            if (results.length === 0) {
                                throw new common_1.NotFoundException("No products found with URN: ".concat(urnNo));
                            }
                            urnStatuses_1 = results.map(function (row) { var _a; return Number((_a = row.urnStatus) !== null && _a !== void 0 ? _a : 0); });
                            anyCertifiedOnUrn_1 = results.some(function (row) { var _a; return Number((_a = row.productStatus) !== null && _a !== void 0 ? _a : 0) === product_status_constants_1.PRODUCT_STATUS_CERTIFIED; });
                            formattedResults = results.map(function (product) {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                                var manufacturerDetails = _this.formatProductDetailsManufacturer(product.manufacturer);
                                var assessmentReportUrl = String((_a = product.assessmentReportUrl) !== null && _a !== void 0 ? _a : '').trim();
                                var urnAssessmentReport = assessmentReportUrl
                                    ? _this.buildUrnAssessmentReportDocumentPayload(assessmentReportUrl)
                                    : null;
                                var productStatus = Number((_b = product.productStatus) !== null && _b !== void 0 ? _b : 0);
                                var urnStatus = Number((_c = product.urnStatus) !== null && _c !== void 0 ? _c : 0);
                                var categoryEditable = (0, category_change_util_1.isProductCategoryEditableForUrn)({
                                    productStatus: productStatus,
                                    urnStatuses: urnStatuses_1,
                                    anyProductCertified: anyCertifiedOnUrn_1,
                                });
                                var categoryChangeBlockReason = (0, category_change_util_1.resolveCategoryChangeBlockReasonForUrn)({
                                    productStatus: productStatus,
                                    urnStatuses: urnStatuses_1,
                                    anyProductCertified: anyCertifiedOnUrn_1,
                                });
                                var canSaveProcessComments = (0, process_comments_lock_util_1.canAdminSaveUncertifiedProcessComments)({
                                    urnStatus: urnStatus,
                                    productStatus: productStatus,
                                });
                                var processCommentsBlockReason = (0, process_comments_lock_util_1.resolveProcessCommentsBlockReason)({
                                    urnStatus: urnStatus,
                                    productStatus: productStatus,
                                });
                                var categoryDoc = Array.isArray(product.category)
                                    ? product.category[0]
                                    : product.category;
                                var visibleRawMaterialSteps = (0, category_change_util_1.visibleStepsForCategory)(String((_d = categoryDoc === null || categoryDoc === void 0 ? void 0 : categoryDoc.category_raw_material_forms) !== null && _d !== void 0 ? _d : '').trim() || null);
                                return __assign(__assign(__assign(__assign({}, (urnAssessmentReport
                                    ? {
                                        urn_assessment_report: urnAssessmentReport,
                                        urnAssessmentReport: urnAssessmentReport,
                                    }
                                    : {})), { product_details: {
                                        _id: product._id,
                                        productId: product.productId,
                                        eoiNo: product.eoiNo,
                                        urnNo: product.urnNo,
                                        productName: product.productName,
                                        productImage: product.productImage,
                                        plantCount: product.plantCount,
                                        categoryId: (_g = (_e = product.categoryId) !== null && _e !== void 0 ? _e : (_f = product.category) === null || _f === void 0 ? void 0 : _f._id) !== null && _g !== void 0 ? _g : null,
                                        productDetails: product.productDetails,
                                        productType: product.productType,
                                        productStatus: product.productStatus,
                                        productRenewStatus: product.productRenewStatus,
                                        renewedDate: product.renewedDate,
                                        urnStatus: product.urnStatus,
                                        assessmentReportUrl: product.assessmentReportUrl,
                                        rejectedDetails: product.rejectedDetails,
                                        certifiedDate: product.certifiedDate,
                                        validtillDate: product.validtillDate,
                                        firstNotifyDate: product.firstNotifyDate,
                                        secondNotifyDate: product.secondNotifyDate,
                                        thirdNotifyDate: product.thirdNotifyDate,
                                        createdDate: product.createdDate,
                                        updatedDate: product.updatedDate,
                                        categoryEditable: categoryEditable,
                                        categoryChangeBlockReason: categoryChangeBlockReason,
                                        canSaveProcessComments: canSaveProcessComments,
                                        processCommentsBlockReason: processCommentsBlockReason,
                                        visibleRawMaterialSteps: visibleRawMaterialSteps,
                                    }, category: _this.formatCategoryForUrnDetails(categoryDoc !== null && categoryDoc !== void 0 ? categoryDoc : null), manufacturer: manufacturerDetails, 
                                    /** Admin UI section label — same payload as manufacturer (includes vendor_details). */
                                    manufacturing_details: manufacturerDetails, vendor: _this.formatProductDetailsVendor(product.manufacturer, product.vendor), plants: _this.formatProductDetailsPlants(product.plants), payments: (0, payment_response_util_1.formatPaymentRecordsForUrnDetails)(product.payments || []), product_design_measures: (product.product_design_measures || []).map(function (m) { return ({
                                        _id: m._id,
                                        productDesignMeasureId: m.productDesignMeasureId,
                                        urnNo: m.urnNo,
                                        productDesignId: m.productDesignId,
                                        measures: m.measures,
                                        benefits: m.benefits,
                                        measuresImplemented: m.measures,
                                        benefitsAchieved: m.benefits,
                                        createdDate: m.createdDate,
                                        updatedDate: m.updatedDate,
                                    }); }), product_design: _this.formatProductDesignForUrnDetails(product.product_design, (product.product_design_measures || [])), product_design_documents: (product.product_design_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), product_performance_test_reports: (product.product_performance_test_reports || []).map(function (r) { return ({
                                        _id: r._id,
                                        productPerformanceTestReportId: r.productPerformanceTestReportId,
                                        urnNo: r.urnNo,
                                        productName: r.productName,
                                        testReportFileName: r.testReportFileName,
                                        createdDate: r.createdDate,
                                        updatedDate: r.updatedDate,
                                    }); }), product_performance: _this.formatProductPerformanceForUrnDetails(product.product_performance, (product.product_performance_test_reports || [])), product_performance_documents: (product.product_performance_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), raw_materials_hazardous_products: (0, raw_materials_hazardous_display_util_1.filterHazardousProductsForVendorDisplay)(product.raw_materials_hazardous_products || []).map(function (r) { return ({
                                        _id: r._id,
                                        rawMaterialsHazardousProductsId: r.rawMaterialsHazardousProductsId,
                                        urnNo: r.urnNo,
                                        vendorId: r.vendorId,
                                        productsName: r.productsName,
                                        productsTestReport: r.productsTestReport,
                                        createdDate: r.createdDate,
                                        updatedDate: r.updatedDate,
                                    }); }), raw_materials_hazardous_products_documents: (product.raw_materials_hazardous_products_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), raw_materials_additives: (0, raw_materials_upload_util_1.normalizeRawMaterialsAdditivesUnits)(product.raw_materials_additives || []), raw_materials_additives_documents: (product.raw_materials_additives_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), raw_materials_alternative_raw_materials_documents: (product.raw_materials_alternative_raw_materials_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), raw_materials_elimination_of_formaldehyde: (0, raw_materials_hazardous_display_util_1.filterFormaldehydeStyleProductsForVendorDisplay)(product.raw_materials_elimination_of_formaldehyde || []), raw_materials_elimination_of_formaldehyde_documents: (product.raw_materials_elimination_of_formaldehyde_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), raw_materials_elimination_of_prohibited_flame: product.raw_materials_elimination_of_prohibited_flame || [], raw_materials_elimination_of_prohibited_flame_documents: (product.raw_materials_elimination_of_prohibited_flame_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), raw_materials_elimination_of_prohibited_flame_solvents: product.raw_materials_elimination_of_prohibited_flame_solvents || [], raw_materials_elimination_of_prohibited_flame_solvents_documents: (product.raw_materials_elimination_of_prohibited_flame_solvents_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), raw_materials_elimination_of_prohibited_flame_solvents_products: (0, raw_materials_hazardous_display_util_1.filterFormaldehydeStyleProductsForVendorDisplay)(product.raw_materials_elimination_of_prohibited_flame_solvents_products ||
                                        []), raw_materials_green_supply: product.raw_materials_green_supply || [], raw_materials_green_supply_documents: (product.raw_materials_green_supply_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), raw_materials_hazardous: product.raw_materials_hazardous || [], raw_materials_optimization_of_raw_mix: (0, raw_materials_upload_util_1.normalizeRawMaterialsManufacturingUnits)(product.raw_materials_optimization_of_raw_mix || []), raw_materials_raw_mix_optimization_documents: (product.raw_materials_raw_mix_optimization_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), raw_materials_rapidly_renewable_materials: (0, raw_materials_upload_util_1.normalizeRawMaterialsStandardGridUnits)(product.raw_materials_rapidly_renewable_materials || []), raw_materials_rapidly_renewable_materials_documents: (product.raw_materials_rapidly_renewable_materials_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), raw_materials_recovery: (0, raw_materials_upload_util_1.normalizeRawMaterialsStandardGridUnits)(product.raw_materials_recovery || []), raw_materials_recovery_documents: (product.raw_materials_recovery_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), raw_materials_elimination_of_ozone_depleting_global_warming_substances_documents: (product.raw_materials_elimination_of_ozone_depleting_global_warming_substances_documents ||
                                        []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), raw_materials_recycled_content: (0, raw_materials_upload_util_1.normalizeRawMaterialsStandardGridUnits)(product.raw_materials_recycled_content || []), raw_materials_recycled_content_documents: (product.raw_materials_recycled_content_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), raw_materials_reduce_environmental: product.raw_materials_reduce_environmental || [], raw_materials_reduce_enviromental: product.raw_materials_reduce_environmental || [], raw_materials_reduce_environmental_documents: (product.raw_materials_reduce_environmental_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), raw_materials_reduce_enviromental_documents: (product.raw_materials_reduce_environmental_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), raw_materials_rmc_alternative_raw_materials_documents: (product.raw_materials_rmc_alternative_raw_materials_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), raw_materials_regional_materials: (0, raw_materials_upload_util_1.normalizeRawMaterialsStandardGridUnits)(product.raw_materials_regional_materials || []), raw_materials_regional_materials_documents: (product.raw_materials_regional_materials_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), raw_materials_utilization: product.raw_materials_utilization || [], raw_materials_utilization_documents: (product.raw_materials_utilization_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), raw_materials_utilization_manufacturing_units: (0, raw_materials_upload_util_1.normalizeRawMaterialsManufacturingUnits)(product.raw_materials_utilization_manufacturing_units || []), raw_materials_utilization_rmc: (0, raw_materials_upload_util_1.normalizeRawMaterialsUtilizationRmcRows)(product.raw_materials_utilization_rmc || []), process_manufacturing: product.process_manufacturing
                                        ? {
                                            _id: product.process_manufacturing._id,
                                            processManufacturingId: product.process_manufacturing.processManufacturingId,
                                            vendorId: product.process_manufacturing.vendorId,
                                            urnNo: product.process_manufacturing.urnNo,
                                            energyConservationSupportingDocuments: _this.asNullableNumber(product.process_manufacturing.energyConservationSupportingDocuments),
                                            portableWaterDemand: product.process_manufacturing.portableWaterDemand,
                                            rainWaterHarvesting: product.process_manufacturing.rainWaterHarvesting,
                                            beyondTheFenceInitiatives: product.process_manufacturing.beyondTheFenceInitiatives,
                                            totalEnergyConsumption: _this.asNullableNumber(product.process_manufacturing.totalEnergyConsumption),
                                            energyConsumptionDocuments: _this.asNullableNumber(product.process_manufacturing.energyConsumptionDocuments),
                                            processManufacturingStatus: _this.asNullableNumber(product.process_manufacturing.processManufacturingStatus),
                                            createdDate: product.process_manufacturing.createdDate,
                                            updatedDate: product.process_manufacturing.updatedDate,
                                        }
                                        : null, process_manufacturing_documents: (0, urn_renew_process_documents_util_1.collectUrnScopedManufacturingProcessDocuments)(product).map(function (d) { return (0, urn_renew_process_documents_util_1.formatUrnProcessDocumentForResponse)(d); }) }), (function () {
                                    var processMpManufacturingUnits = (product.process_mp_manufacturing_units || []).map(function (u) {
                                        return (0, mp_energy_consumption_calculations_util_1.enrichMpManufacturingUnitCalculations)({
                                            _id: u._id,
                                            processMpManufacturingUnitId: u.processMpManufacturingUnitId,
                                            vendorId: u.vendorId,
                                            urnNo: u.urnNo,
                                            unitName: u.unitName,
                                            renewableEnergyUtilization: u.renewableEnergyUtilization,
                                            ecdYear1: u.ecdYear1,
                                            ecdYear2: u.ecdYear2,
                                            ecdYear3: u.ecdYear3,
                                            ecdProductionUnit: u.ecdProductionUnit,
                                            ecdProductionYear1: u.ecdProductionYear1,
                                            ecdProductionYear2: u.ecdProductionYear2,
                                            ecdProductionYear3: u.ecdProductionYear3,
                                            ecdElectricUnit: u.ecdElectricUnit,
                                            ecdElectricYear1: u.ecdElectricYear1,
                                            ecdElectricYear2: u.ecdElectricYear2,
                                            ecdElectricYear3: u.ecdElectricYear3,
                                            ecdThermalUnitFuel1: u.ecdThermalUnitFuel1,
                                            ecdThermalUnitFuel2: u.ecdThermalUnitFuel2,
                                            ecdThermalUnitFuel3: u.ecdThermalUnitFuel3,
                                            ecdThermalFuel1Year1: u.ecdThermalFuel1Year1,
                                            ecdThermalFuel1Year2: u.ecdThermalFuel1Year2,
                                            ecdThermalFuel1Year3: u.ecdThermalFuel1Year3,
                                            ecdThermalFuel2Year1: u.ecdThermalFuel2Year1,
                                            ecdThermalFuel2Year2: u.ecdThermalFuel2Year2,
                                            ecdThermalFuel2Year3: u.ecdThermalFuel2Year3,
                                            ecdThermalFuel3Year1: u.ecdThermalFuel3Year1,
                                            ecdThermalFuel3Year2: u.ecdThermalFuel3Year2,
                                            ecdThermalFuel3Year3: u.ecdThermalFuel3Year3,
                                            ecdCalorificFuel1Year1: u.ecdCalorificFuel1Year1,
                                            ecdCalorificFuel1Year2: u.ecdCalorificFuel1Year2,
                                            ecdCalorificFuel1Year3: u.ecdCalorificFuel1Year3,
                                            ecdCalorificFuel2Year1: u.ecdCalorificFuel2Year1,
                                            ecdCalorificFuel2Year2: u.ecdCalorificFuel2Year2,
                                            ecdCalorificFuel2Year3: u.ecdCalorificFuel2Year3,
                                            ecdCalorificFuel3Year1: u.ecdCalorificFuel3Year1,
                                            ecdCalorificFuel3Year2: u.ecdCalorificFuel3Year2,
                                            ecdCalorificFuel3Year3: u.ecdCalorificFuel3Year3,
                                            ecdTextareaNewUnits: u.ecdTextareaNewUnits,
                                            wcdYear1: u.wcdYear1,
                                            wcdYear2: u.wcdYear2,
                                            wcdYear3: u.wcdYear3,
                                            wcdProductionUnit: u.wcdProductionUnit,
                                            wcdWaterUnit: u.wcdWaterUnit,
                                            wcdProductionYear1: u.wcdProductionYear1,
                                            wcdProductionYear2: u.wcdProductionYear2,
                                            wcdProductionYear3: u.wcdProductionYear3,
                                            wcdWaterYear1: u.wcdWaterYear1,
                                            wcdWaterYear2: u.wcdWaterYear2,
                                            wcdWaterYear3: u.wcdWaterYear3,
                                            reYear: u.reYear,
                                            reSolarPhotovoltaic: u.reSolarPhotovoltaic,
                                            reWind: u.reWind,
                                            reBiomass: u.reBiomass,
                                            reSolarThermal: u.reSolarThermal,
                                            reOthersUnit: u.reOthersUnit,
                                            reOthers: u.reOthers,
                                            offsiteRenewablePower: u.offsiteRenewablePower,
                                            processMpManufacturingUnitStatus: u.processMpManufacturingUnitStatus,
                                            calculateBulkSec: u.calculateBulkSec,
                                            calculateBulkSwc: u.calculateBulkSwc,
                                            calculateBulkStec: u.calculateBulkStec,
                                            calculateBulkSecMultipled: u.calculateBulkSecMultipled,
                                            calculateBulkSwcMultipled: u.calculateBulkSwcMultipled,
                                            calculateBulkTecMultipled: u.calculateBulkTecMultipled,
                                            calculateBulkStecMultipled: u.calculateBulkStecMultipled,
                                            measuresImplementedMpUnits: u.measuresImplementedMpUnits,
                                            detailsOfRainWaterHarvestingMpUnits: u.detailsOfRainWaterHarvestingMpUnits,
                                            createdDate: u.createdDate,
                                            updatedDate: u.updatedDate,
                                        });
                                    });
                                    var manufacturingWeightedTotals = (0, mp_manufacturing_weighted_totals_util_1.buildManufacturingWeightedTotals)(processMpManufacturingUnits);
                                    return {
                                        process_mp_manufacturing_units: processMpManufacturingUnits,
                                        manufacturing_weighted_totals: manufacturingWeightedTotals,
                                        manufacturingWeightedTotals: manufacturingWeightedTotals,
                                    };
                                })()), { process_waste_management: product.process_waste_management
                                        ? {
                                            _id: product.process_waste_management._id,
                                            processWasteManagementId: product.process_waste_management.processWasteManagementId,
                                            vendorId: product.process_waste_management.vendorId,
                                            urnNo: product.process_waste_management.urnNo,
                                            wmImplementationDetails: product.process_waste_management.wmImplementationDetails,
                                            wmSupportingDocuments: _this.asNullableNumber(product.process_waste_management.wmSupportingDocuments),
                                            processWasteManagementStatus: _this.asNullableNumber(product.process_waste_management.processWasteManagementStatus),
                                            createdDate: product.process_waste_management.createdDate,
                                            updatedDate: product.process_waste_management.updatedDate,
                                        }
                                        : null, process_waste_management_documents: (product.process_waste_management_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), process_wm_manufacturing_units: (product.process_wm_manufacturing_units || []).map(function (u) {
                                        return (0, wm_waste_disposal_calculations_util_1.enrichWmManufacturingUnitCalculations)({
                                            _id: u._id,
                                            processWmManufacturingUnitId: u.processWmManufacturingUnitId,
                                            vendorId: u.vendorId,
                                            urnNo: u.urnNo,
                                            processWasteManagementId: u.processWasteManagementId,
                                            unitName: u.unitName,
                                            hazardousWasteYear1: u.hazardousWasteYear1,
                                            hazardousWasteYear2: u.hazardousWasteYear2,
                                            hazardousWasteYear3: u.hazardousWasteYear3,
                                            hazardousWasteProductionUnit: u.hazardousWasteProductionUnit,
                                            hazardousWasteQuantityUnit: u.hazardousWasteQuantityUnit,
                                            hazardousWasteProductionYear1: u.hazardousWasteProductionYear1,
                                            hazardousWasteProductionYear2: u.hazardousWasteProductionYear2,
                                            hazardousWasteProductionYear3: u.hazardousWasteProductionYear3,
                                            hazardousWasteQuantityYear1: u.hazardousWasteQuantityYear1,
                                            hazardousWasteQuantityYear2: u.hazardousWasteQuantityYear2,
                                            hazardousWasteQuantityYear3: u.hazardousWasteQuantityYear3,
                                            nonHazardousWasteYear1: u.nonHazardousWasteYear1,
                                            nonHazardousWasteYear2: u.nonHazardousWasteYear2,
                                            nonHazardousWasteYear3: u.nonHazardousWasteYear3,
                                            nonHazardousWasteProductionUnit: u.nonHazardousWasteProductionUnit,
                                            nonHazardousWasteWaterUnit: u.nonHazardousWasteWaterUnit,
                                            nonHazardousWasteProductionYear1: u.nonHazardousWasteProductionYear1,
                                            nonHazardousWasteProductionYear2: u.nonHazardousWasteProductionYear2,
                                            nonHazardousWasteProductionYear3: u.nonHazardousWasteProductionYear3,
                                            nonHazardousWasteWaterYear1: u.nonHazardousWasteWaterYear1,
                                            nonHazardousWasteWaterYear2: u.nonHazardousWasteWaterYear2,
                                            nonHazardousWasteWaterYear3: u.nonHazardousWasteWaterYear3,
                                            wmImplementationDetailsWmUnits: u.wmImplementationDetailsWmUnits,
                                            calculateBulkRshwd: u.calculateBulkRshwd,
                                            calculateBulkRsnhwd: u.calculateBulkRsnhwd,
                                            calculateBulkRshwdMultipled: u.calculateBulkRshwdMultipled,
                                            calculateBulkRsnhwdMultipled: u.calculateBulkRsnhwdMultipled,
                                            createdDate: u.createdDate,
                                            updatedDate: u.updatedDate,
                                        });
                                    }), process_life_cycle_approach: product.process_life_cycle_approach
                                        ? {
                                            _id: product.process_life_cycle_approach._id,
                                            processLifeCycleApproachId: product.process_life_cycle_approach.processLifeCycleApproachId,
                                            vendorId: product.process_life_cycle_approach.vendorId,
                                            urnNo: product.process_life_cycle_approach.urnNo,
                                            lifeCycleAssesmentReports: _this.asNullableNumber(product.process_life_cycle_approach.lifeCycleAssesmentReports),
                                            lifeCycleImplementationDetails: product.process_life_cycle_approach
                                                .lifeCycleImplementationDetails,
                                            lifeCycleImplementationDocuments: _this.asNullableNumber(product.process_life_cycle_approach.lifeCycleImplementationDocuments),
                                            processLifeCycleApproachStatus: _this.asNullableNumber(product.process_life_cycle_approach.processLifeCycleApproachStatus),
                                            createdDate: product.process_life_cycle_approach.createdDate,
                                            updatedDate: product.process_life_cycle_approach.updatedDate,
                                        }
                                        : null, process_life_cycle_approach_documents: (product.process_life_cycle_approach_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), process_product_stewardship: product.process_product_stewardship
                                        ? {
                                            _id: product.process_product_stewardship._id,
                                            processProductStewardshipId: product.process_product_stewardship.processProductStewardshipId,
                                            vendorId: product.process_product_stewardship.vendorId,
                                            urnNo: product.process_product_stewardship.urnNo,
                                            seaSupportingDocuments: _this.asNullableNumber(product.process_product_stewardship.seaSupportingDocuments),
                                            qualityManagementDetails: product.process_product_stewardship.qualityManagementDetails,
                                            qmSupportingDocuments: _this.asNullableNumber(product.process_product_stewardship.qmSupportingDocuments),
                                            eprImplementedDetails: product.process_product_stewardship.eprImplementedDetails,
                                            eprGreenPackagingDetails: product.process_product_stewardship.eprGreenPackagingDetails,
                                            eprSupportingDocuments: _this.asNullableNumber(product.process_product_stewardship.eprSupportingDocuments),
                                            productStewardshipStatus: _this.asNullableNumber(product.process_product_stewardship.productStewardshipStatus),
                                            programmeDetails: (product.process_ps_stakeholder_edu_awarness || []).map(function (row) {
                                                var _a, _b;
                                                return ({
                                                    _id: row._id,
                                                    programmeDetails: (_a = row.seaProgramDetails) !== null && _a !== void 0 ? _a : '',
                                                    numberOfPrograms: (_b = row.seaNoOfPrograms) !== null && _b !== void 0 ? _b : '',
                                                    seaSupportingDocuments: _this.asNullableNumber(row.seaSupportingDocuments),
                                                    productStewardshipStatus: _this.asNullableNumber(row.productStewardshipStatus),
                                                    createdDate: row.createdDate,
                                                    updatedDate: row.updatedDate,
                                                });
                                            }),
                                            createdDate: product.process_product_stewardship.createdDate,
                                            updatedDate: product.process_product_stewardship.updatedDate,
                                        }
                                        : null, process_product_stewardship_documents: (product.process_product_stewardship_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), process_ps_stakeholder_edu_awarness: (product.process_ps_stakeholder_edu_awarness || []).map(function (row) { return ({
                                        _id: row._id,
                                        vendorId: row.vendorId,
                                        urnNo: row.urnNo,
                                        processProductStewardshipId: row.processProductStewardshipId,
                                        seaProgramDetails: row.seaProgramDetails,
                                        seaNoOfPrograms: row.seaNoOfPrograms,
                                        seaSupportingDocuments: row.seaSupportingDocuments,
                                        productStewardshipStatus: row.productStewardshipStatus,
                                        createdDate: row.createdDate,
                                        updatedDate: row.updatedDate,
                                        isDeleted: row.isDeleted,
                                    }); }), process_innovation: product.process_innovation
                                        ? {
                                            _id: product.process_innovation._id,
                                            processInnovationId: product.process_innovation.processInnovationId,
                                            vendorId: product.process_innovation.vendorId,
                                            urnNo: product.process_innovation.urnNo,
                                            innovationImplementationDetails: product.process_innovation.innovationImplementationDetails,
                                            innovationImplementationDocuments: product.process_innovation.innovationImplementationDocuments,
                                            processInnovationStatus: product.process_innovation.processInnovationStatus,
                                            createdDate: product.process_innovation.createdDate,
                                            updatedDate: product.process_innovation.updatedDate,
                                        }
                                        : null, process_innovation_documents: (product.process_innovation_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        documentTag: d.documentTag,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), all_urn_product_documents: (product.all_urn_product_documents || []).map(function (d) { return ({
                                        _id: d._id,
                                        productDocumentId: d.productDocumentId,
                                        vendorId: d.vendorId,
                                        urnNo: d.urnNo,
                                        eoiNo: d.eoiNo,
                                        documentForm: d.documentForm,
                                        documentFormSubsection: d.documentFormSubsection,
                                        formPrimaryId: d.formPrimaryId,
                                        documentName: d.documentName,
                                        documentOriginalName: d.documentOriginalName,
                                        documentLink: d.documentLink,
                                        documentTag: d.documentTag,
                                        createdDate: d.createdDate,
                                        updatedDate: d.updatedDate,
                                    }); }), process_comments: product.process_comments
                                        ? (0, process_comments_payload_util_1.formatProcessCommentsForApi)(__assign(__assign({}, product.process_comments), { _id: product.process_comments._id, processCommentsId: product.process_comments.processCommentsId, urnNo: product.process_comments.urnNo, vendorId: product.process_comments.vendorId, adminProcessComments: (_l = (_k = (_j = (_h = product.process_comments.adminProcessComments) !== null && _h !== void 0 ? _h : product.process_comments.adminComments) !== null && _j !== void 0 ? _j : product.process_comments.admin_comment) !== null && _k !== void 0 ? _k : product.process_comments.admin_comments) !== null && _l !== void 0 ? _l : null, vendorProcessComments: (_q = (_p = (_o = (_m = product.process_comments.vendorProcessComments) !== null && _m !== void 0 ? _m : product.process_comments.vendorComments) !== null && _o !== void 0 ? _o : product.process_comments.vendor_comment) !== null && _p !== void 0 ? _p : product.process_comments.vendor_comments) !== null && _q !== void 0 ? _q : null, productDesign: product.process_comments.productDesign, productPerformance: product.process_comments.productPerformance, manfacturingProcess: product.process_comments.manfacturingProcess, wasteManagement: product.process_comments.wasteManagement, lifeCycleApproach: product.process_comments.lifeCycleApproach, productStewardship: product.process_comments.productStewardship, productInnovation: product.process_comments.productInnovation, rawMaterials31: product.process_comments.rawMaterials31, rawMaterials32: product.process_comments.rawMaterials32, rawMaterials33: product.process_comments.rawMaterials33, rawMaterials34: product.process_comments.rawMaterials34, rawMaterials35: product.process_comments.rawMaterials35, rawMaterials36: product.process_comments.rawMaterials36, rawMaterials37: product.process_comments.rawMaterials37, rawMaterials38: product.process_comments.rawMaterials38, rawMaterials39: product.process_comments.rawMaterials39, rawMaterials310: product.process_comments.rawMaterials310, rawMaterials311: product.process_comments.rawMaterials311, rawMaterials312: product.process_comments.rawMaterials312, rawMaterials313: product.process_comments.rawMaterials313, rawMaterials314: product.process_comments.rawMaterials314, rawMaterials315: product.process_comments.rawMaterials315, updatedDate: product.process_comments.updatedDate }))
                                        : null, process_final_review: (0, format_process_final_review_util_1.formatProcessFinalReviewPayload)(product.process_final_review) });
                            });
                            return [4 /*yield*/, this.urnSiteVisitsService.findAllByUrnForEmbed(trimmedUrnNo)];
                        case 3:
                            siteVisits_1 = _a.sent();
                            return [4 /*yield*/, this.buildUrnProductDetailsList(urnProductSummaries, {
                                    urnStatuses: urnStatuses_1,
                                    anyCertifiedOnUrn: anyCertifiedOnUrn_1,
                                })];
                        case 4:
                            productDetailsList_1 = _a.sent();
                            return [4 /*yield*/, this.enrichUrnDetailRowsWithManufacturerAndPlants(trimmedUrnNo, formattedResults)];
                        case 5:
                            rowsWithPlants = _a.sent();
                            return [2 /*return*/, (0, consolidate_urn_detail_items_util_1.enrichUrnDetailRowsWithSharedProcessData)(rowsWithPlants.map(function (row) { return (__assign(__assign({}, row), { siteVisits: siteVisits_1, product_details_list: productDetailsList_1 })); }))];
                        case 6:
                            error_9 = _a.sent();
                            console.error('[Get Product Details by URN] Error:', error_9);
                            console.error('[Get Product Details by URN] Error stack:', error_9.stack);
                            if (error_9 instanceof common_1.NotFoundException ||
                                error_9 instanceof common_1.BadRequestException) {
                                throw error_9;
                            }
                            throw new common_1.InternalServerErrorException(error_9.message ||
                                'Failed to get product details. Please check the logs for details.');
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Dropdown values for admin certified (or other) product list filters.
         * Categories: all active categories. Other fields: distinct values from products in scope.
         */
        ProductRegistrationService_1.prototype.adminGetProductListFilterOptions = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var statuses, categories, categoryOptions, productMatch, _a, manufacturerRows, yearRows, countryOptions, sectorOptions, currentYear, validTillYearOptions, certifiedScope;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            statuses = (function () {
                                for (var _i = 0, _a = [dto.status, dto.productStatus, dto.product_status]; _i < _a.length; _i++) {
                                    var c = _a[_i];
                                    if (Array.isArray(c) && c.length > 0) {
                                        return c;
                                    }
                                }
                                return [2];
                            })();
                            return [4 /*yield*/, this.categoryModel
                                    .find({ category_status: 1 })
                                    .select('_id category_name category_name_normalized')
                                    .sort({ category_name: 1 })
                                    .lean()
                                    .exec()];
                        case 1:
                            categories = _b.sent();
                            categoryOptions = categories.map(function (c) {
                                var _a;
                                return ({
                                    value: String(c._id),
                                    label: String((_a = c.category_name) !== null && _a !== void 0 ? _a : '').trim() || 'Category',
                                });
                            });
                            productMatch = __assign(__assign({}, (0, active_product_filter_1.matchActiveProducts)()), { productStatus: statuses.length === 1 ? statuses[0] : { $in: statuses } });
                            return [4 /*yield*/, Promise.all([
                                    this.productModel
                                        .aggregate([
                                        { $match: productMatch },
                                        {
                                            $lookup: {
                                                from: 'manufacturers',
                                                localField: 'manufacturerId',
                                                foreignField: '_id',
                                                as: 'manufacturer',
                                            },
                                        },
                                        { $unwind: '$manufacturer' },
                                        {
                                            $group: {
                                                _id: '$manufacturerId',
                                                label: { $first: '$manufacturer.manufacturerName' },
                                            },
                                        },
                                        { $match: { label: { $type: 'string', $ne: '' } } },
                                        { $sort: { label: 1 } },
                                        {
                                            $project: {
                                                _id: 0,
                                                value: { $toString: '$_id' },
                                                label: 1,
                                            },
                                        },
                                    ])
                                        .exec(),
                                    this.productModel
                                        .aggregate([
                                        {
                                            $match: __assign(__assign({}, productMatch), { validtillDate: { $exists: true, $ne: null } }),
                                        },
                                        {
                                            $project: {
                                                year: { $year: '$validtillDate' },
                                            },
                                        },
                                        { $group: { _id: '$year' } },
                                        { $sort: { _id: -1 } },
                                    ])
                                        .exec(),
                                    this.countriesService.buildDropdownOptions(),
                                    this.sectorsService.buildDropdownOptions(),
                                ])];
                        case 2:
                            _a = _b.sent(), manufacturerRows = _a[0], yearRows = _a[1], countryOptions = _a[2], sectorOptions = _a[3];
                            currentYear = new Date().getUTCFullYear();
                            validTillYearOptions = yearRows
                                .map(function (row) { return Number(row._id); })
                                .filter(function (y) { return Number.isFinite(y) && y <= currentYear; })
                                .map(function (y) { return ({
                                value: String(y),
                                label: String(y),
                            }); });
                            certifiedScope = statuses.length === 0 || statuses.includes(2);
                            return [2 /*return*/, {
                                    message: 'Filter options retrieved successfully',
                                    data: {
                                        categories: categoryOptions,
                                        manufacturers: manufacturerRows,
                                        validTillYears: validTillYearOptions,
                                        countries: countryOptions,
                                        countriesTotal: countryOptions.length,
                                        sectors: sectorOptions,
                                        buildings: sectorOptions,
                                        sectorsTotal: sectorOptions.length,
                                        filterControls: __assign(__assign({ categoryIds: {
                                                type: 'multiselect',
                                                label: 'Category',
                                                queryParam: 'categoryIds',
                                                snakeCaseQueryParam: 'category_ids',
                                                singleAliases: ['categoryId', 'category_id'],
                                                optionsKey: 'categories',
                                            }, sectorIds: {
                                                type: 'multiselect',
                                                label: 'Building',
                                                queryParam: 'sectorIds',
                                                snakeCaseQueryParam: 'sector_ids',
                                                aliases: ['buildingIds', 'building_ids', 'buildings'],
                                                singleAliases: ['sectorId', 'sector_id', 'buildingId', 'building_id', 'building'],
                                                optionsKey: 'sectors',
                                            } }, (certifiedScope
                                            ? {
                                                validTillMonthYear: {
                                                    type: 'monthYearPicker',
                                                    label: 'Valid Till',
                                                    queryParam: 'validTillMonthYear',
                                                    snakeCaseQueryParam: 'valid_till_month_year',
                                                    aliases: [
                                                        'validTillDate',
                                                        'validTill',
                                                        'valid_till',
                                                        'valid_till_date',
                                                        'validtillDate',
                                                        'validtill_date',
                                                    ],
                                                    format: 'YYYY-MM',
                                                    monthQueryParam: 'validTillMonth',
                                                    snakeCaseMonthQueryParam: 'valid_till_month',
                                                    yearQueryParam: 'validTillYear',
                                                    snakeCaseYearQueryParam: 'valid_till_year',
                                                    rangeQueryParams: {
                                                        from: 'validTillFrom',
                                                        to: 'validTillTo',
                                                        snakeCaseFrom: 'valid_till_from',
                                                        snakeCaseTo: 'valid_till_to',
                                                    },
                                                },
                                            }
                                            : {})), { countryId: {
                                                type: 'dropdown',
                                                label: 'Country',
                                                queryParam: 'countryId',
                                                optionsKey: 'countries',
                                            }, state: {
                                                type: 'text',
                                                label: 'State',
                                                queryParam: 'state',
                                                placeholder: 'Search by state name',
                                            }, city: {
                                                type: 'text',
                                                label: 'City',
                                                queryParam: 'city',
                                                placeholder: 'Search by city',
                                            } }),
                                    },
                                }];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.adminListProducts = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var groupBy;
                var _a;
                return __generator(this, function (_b) {
                    groupBy = (_a = dto.groupBy) !== null && _a !== void 0 ? _a : 'manufacturer';
                    if (groupBy === 'urn') {
                        return [2 /*return*/, this.adminListProductsGroupedByUrn(dto)];
                    }
                    return [2 /*return*/, this.adminListProductsGroupedByManufacturer(dto)];
                });
            });
        };
        ProductRegistrationService_1.prototype.buildAdminListRowBase = function (dto, locationProductIds, options) {
            var _this = this;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            if (locationProductIds === void 0) { locationProductIds = null; }
            var page = (_a = dto.page) !== null && _a !== void 0 ? _a : 1;
            var limit = (_b = dto.limit) !== null && _b !== void 0 ? _b : 10;
            var skip = (page - 1) * limit;
            var sortOrder = ((_c = dto.order) !== null && _c !== void 0 ? _c : dto.sortOrder) === 'asc' ? 1 : -1;
            var now = new Date();
            var urnSortFieldMap = {
                createdDate: 'createdDate',
                createdAt: 'createdDate',
                validTill: 'validtillDate',
                productName: 'productName',
                eoiNo: 'eoiNo',
                urnNo: 'urnNo',
            };
            var urnSortField = (_e = urnSortFieldMap[(_d = dto.sortBy) !== null && _d !== void 0 ? _d : 'createdDate']) !== null && _e !== void 0 ? _e : 'createdDate';
            var manufacturerSortFieldMap = {
                createdDate: 'sortKey',
                createdAt: 'sortKey',
                manufacturerName: 'manufacturerName',
                validTill: 'sortKey',
                productName: 'sortKey',
                eoiNo: 'sortKey',
                urnNo: 'sortKey',
            };
            var manufacturerSortField = (_g = manufacturerSortFieldMap[(_f = dto.sortBy) !== null && _f !== void 0 ? _f : 'createdDate']) !== null && _g !== void 0 ? _g : 'sortKey';
            var nativeMatch = __assign({}, (0, active_product_filter_1.matchActiveProducts)());
            if (locationProductIds != null) {
                nativeMatch._id = { $in: locationProductIds };
            }
            if (dto.product_type !== undefined) {
                nativeMatch.productType = dto.product_type;
            }
            var urnStatuses = (function () {
                for (var _i = 0, _a = [dto.urnStatuses, dto.urnStatus, dto.urn_status]; _i < _a.length; _i++) {
                    var c = _a[_i];
                    if (c === undefined || c === null || c === '')
                        continue;
                    var source = Array.isArray(c) ? c : String(c).split(',');
                    var parsed = source
                        .map(function (v) { return Number(String(v).trim()); })
                        .filter(function (v) { return Number.isFinite(v); });
                    if (parsed.length > 0)
                        return parsed;
                }
                return [];
            })();
            if (urnStatuses.length > 0) {
                nativeMatch.urnStatus = { $in: urnStatuses };
            }
            var categoryIds = this.resolveAdminListCategoryIds(dto);
            if (categoryIds && categoryIds.length > 0) {
                nativeMatch.categoryId = {
                    $in: categoryIds.map(function (id) { return _this.toObjectId(id, 'categoryId'); }),
                };
            }
            var manufacturerIds = this.resolveAdminListManufacturerIds(dto);
            if (manufacturerIds && manufacturerIds.length > 0) {
                nativeMatch.manufacturerId = {
                    $in: manufacturerIds.map(function (id) {
                        return _this.toObjectId(id, 'manufacturerId');
                    }),
                };
            }
            var createdFrom = (_h = dto.from) !== null && _h !== void 0 ? _h : dto.fromDate;
            var createdTo = (_j = dto.to) !== null && _j !== void 0 ? _j : dto.toDate;
            if (createdFrom || createdTo) {
                var createdRange = {};
                if (createdFrom) {
                    createdRange.$gte = new Date(createdFrom);
                }
                if (createdTo) {
                    var to = new Date(createdTo);
                    to.setHours(23, 59, 59, 999);
                    createdRange.$lte = to;
                }
                nativeMatch.createdDate = createdRange;
            }
            var validTillMonthYearFilter = (0, admin_list_valid_till_filter_util_1.resolveAdminListValidTillMonthYearFilter)(dto);
            if (validTillMonthYearFilter) {
                (0, admin_list_valid_till_filter_util_1.mergeMongoExpr)(nativeMatch, (0, admin_list_valid_till_filter_util_1.buildValidTillMonthYearExpr)(validTillMonthYearFilter));
            }
            else {
                var validTillYears = this.resolveAdminListValidTillYears(dto);
                if (validTillYears && validTillYears.length > 0) {
                    (0, admin_list_valid_till_filter_util_1.mergeMongoExpr)(nativeMatch, (0, admin_list_valid_till_filter_util_1.buildValidTillYearsExpr)(validTillYears));
                }
            }
            var basePipeline = [];
            if (Object.keys(nativeMatch).length > 0) {
                basePipeline.push({ $match: nativeMatch });
            }
            var sectorFilterIds = this.resolveAdminListSectorIds(dto);
            basePipeline.push({
                $lookup: {
                    from: 'manufacturers',
                    localField: 'manufacturerId',
                    foreignField: '_id',
                    as: 'manufacturer',
                },
            }, {
                $unwind: {
                    path: '$manufacturer',
                    preserveNullAndEmptyArrays: true,
                },
            });
            if (options === null || options === void 0 ? void 0 : options.requirePublicWebsiteManufacturerVisibility) {
                basePipeline.push({
                    $match: (0, public_website_manufacturer_visibility_filter_1.matchPublicWebsiteManufacturerVisibility)(),
                });
            }
            basePipeline.push({
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category',
                },
            }, {
                $unwind: {
                    path: '$category',
                    preserveNullAndEmptyArrays: true,
                },
            });
            if (sectorFilterIds && sectorFilterIds.length > 0) {
                basePipeline.push({
                    $match: { 'category.sector': { $in: sectorFilterIds } },
                });
            }
            basePipeline.push({
                $lookup: {
                    from: 'product_plants',
                    let: { pid: '$_id' },
                    pipeline: [
                        {
                            $match: __assign({ $expr: { $eq: ['$productId', '$$pid'] } }, (0, active_product_filter_1.matchActiveProductPlants)()),
                        },
                        {
                            $lookup: {
                                from: 'states',
                                localField: 'stateId',
                                foreignField: '_id',
                                as: 'state',
                            },
                        },
                        {
                            $unwind: {
                                path: '$state',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                productPlantId: 1,
                                productId: 1,
                                eoiNo: 1,
                                urnNo: 1,
                                plantName: 1,
                                plantLocation: 1,
                                countryId: 1,
                                stateId: 1,
                                city: 1,
                                plantStatus: 1,
                                createdDate: 1,
                                stateName: {
                                    $ifNull: [
                                        '$state.stateName',
                                        { $ifNull: ['$state.state_name', '$state.name'] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'plants',
                },
            }, {
                $lookup: {
                    from: 'sectors',
                    let: { sid: '$category.sector' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [{ $ne: ['$$sid', null] }, { $eq: ['$id', '$$sid'] }],
                                },
                            },
                        },
                        { $limit: 1 },
                        { $project: { _id: 0, name: 1 } },
                    ],
                    as: '_adminSectorDoc',
                },
            }, {
                $unwind: {
                    path: '$_adminSectorDoc',
                    preserveNullAndEmptyArrays: true,
                },
            });
            var manufacturerNames = this.resolveAdminListManufacturerNames(dto);
            if (manufacturerNames && manufacturerNames.length > 0) {
                var escaped = manufacturerNames.map(function (name) { return new RegExp("^".concat(_this.escapeRegexLiteral(name), "$"), 'i'); });
                basePipeline.push({
                    $match: {
                        'manufacturer.manufacturerName': escaped.length === 1 ? escaped[0] : { $in: escaped },
                    },
                });
            }
            if (dto.search && dto.search.trim() !== '') {
                var rx = new RegExp(dto.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                basePipeline.push({
                    $match: {
                        $or: [
                            { eoiNo: rx },
                            { urnNo: rx },
                            { productName: rx },
                            { 'manufacturer.manufacturerName': rx },
                            { 'manufacturer.vendor_name': rx },
                            { 'manufacturer.vendor_email': rx },
                            { 'manufacturer.vendor_phone': rx },
                        ],
                    },
                });
            }
            var statuses = (function () {
                for (var _i = 0, _a = [dto.status, dto.productStatus, dto.product_status]; _i < _a.length; _i++) {
                    var c = _a[_i];
                    if (Array.isArray(c) && c.length > 0) {
                        return c;
                    }
                }
                return [];
            })();
            var includeExpired = statuses.includes(4);
            var regularStatuses = statuses.filter(function (s) { return s !== 4; });
            var statusMatch = null;
            if (statuses.length > 0) {
                if (includeExpired && regularStatuses.length > 0) {
                    statusMatch = {
                        $or: [
                            { productStatus: { $in: regularStatuses } },
                            (0, expired_product_filter_1.matchExpiredProducts)(now),
                        ],
                    };
                }
                else if (includeExpired) {
                    statusMatch = (0, expired_product_filter_1.matchExpiredProducts)(now);
                }
                else if (regularStatuses.length === 1) {
                    statusMatch = { productStatus: regularStatuses[0] };
                }
                else {
                    statusMatch = { productStatus: { $in: regularStatuses } };
                }
            }
            var rowBase = __spreadArray([], basePipeline, true);
            if (statusMatch) {
                rowBase.push({ $match: statusMatch });
            }
            return {
                page: page,
                limit: limit,
                skip: skip,
                sortOrder: sortOrder,
                now: now,
                rowBase: rowBase,
                statusMatch: statusMatch,
                urnSortField: urnSortField,
                manufacturerSortField: manufacturerSortField,
            };
        };
        ProductRegistrationService_1.prototype.adminListProductsGroupedByManufacturer = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, error_10, page, limit, locationProductIds, _a, skip, sortOrder, now, rowBase, manufacturerSortField, manufacturerGroupPipeline, facetResult, payload, total, statusCounts, _i, _b, row, grouped, response;
                var _c;
                var _this = this;
                var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                return __generator(this, function (_r) {
                    switch (_r.label) {
                        case 0:
                            cacheKey = this.buildAdminProductListCacheKey(dto);
                            _r.label = 1;
                        case 1:
                            _r.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _r.sent();
                            if (cached && Array.isArray(cached.data)) {
                                return [2 /*return*/, cached];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_10 = _r.sent();
                            this.logger.warn("Product admin list cache read failed: ".concat((error_10 === null || error_10 === void 0 ? void 0 : error_10.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4:
                            page = (_d = dto.page) !== null && _d !== void 0 ? _d : 1;
                            limit = (_e = dto.limit) !== null && _e !== void 0 ? _e : 10;
                            return [4 /*yield*/, this.findAdminListProductIdsByPlantLocation(dto)];
                        case 5:
                            locationProductIds = _r.sent();
                            if (locationProductIds !== null && locationProductIds.length === 0) {
                                return [2 /*return*/, {
                                        message: 'Products listed successfully',
                                        data: [],
                                        total: 0,
                                        page: page,
                                        limit: limit,
                                        statusCounts: {},
                                    }];
                            }
                            _a = this.buildAdminListRowBase(dto, locationProductIds), skip = _a.skip, sortOrder = _a.sortOrder, now = _a.now, rowBase = _a.rowBase, manufacturerSortField = _a.manufacturerSortField;
                            manufacturerGroupPipeline = __spreadArray(__spreadArray([], rowBase, true), [
                                {
                                    $project: {
                                        manufacturerId: 1,
                                        urnNo: 1,
                                        createdDate: 1,
                                        productStatus: 1,
                                        urnStatus: 1,
                                        _id: 1,
                                        productId: 1,
                                        eoiNo: 1,
                                        productName: 1,
                                        productDetails: 1,
                                        validtillDate: 1,
                                        categoryId: 1,
                                        productImage: 1,
                                        categoryName: {
                                            $ifNull: ['$category.categoryName', '$category.category_name'],
                                        },
                                        sector: '$category.sector',
                                        sectorName: '$_adminSectorDoc.name',
                                        manufacturerName: '$manufacturer.manufacturerName',
                                        vendor_email: {
                                            $ifNull: ['$manufacturer.vendor_email', ''],
                                        },
                                        vendor_phone: {
                                            $ifNull: ['$manufacturer.vendor_phone', ''],
                                        },
                                        plants: 1,
                                    },
                                },
                                {
                                    $group: {
                                        _id: { manufacturerId: '$manufacturerId', urnNo: '$urnNo' },
                                        manufacturer_id: { $first: '$manufacturerId' },
                                        manufacturerName: { $first: '$manufacturerName' },
                                        vendor_email: { $first: '$vendor_email' },
                                        vendor_phone: { $first: '$vendor_phone' },
                                        urnNo: { $first: '$urnNo' },
                                        createdDate: { $min: '$createdDate' },
                                        totalEoi: { $sum: 1 },
                                        statusCodes: { $addToSet: '$productStatus' },
                                        eoiDocs: {
                                            $push: {
                                                _id: '$_id',
                                                productId: '$productId',
                                                eoiNo: '$eoiNo',
                                                urnNo: '$urnNo',
                                                productName: '$productName',
                                                productDetails: '$productDetails',
                                                productStatus: '$productStatus',
                                                urnStatus: '$urnStatus',
                                                validtillDate: '$validtillDate',
                                                categoryId: '$categoryId',
                                                productImage: '$productImage',
                                                createdDate: '$createdDate',
                                                categoryName: '$categoryName',
                                                sector: '$sector',
                                                sectorName: '$sectorName',
                                                manufacturerName: '$manufacturerName',
                                                plants: '$plants',
                                            },
                                        },
                                    },
                                },
                                {
                                    $group: {
                                        _id: '$_id.manufacturerId',
                                        manufacturer_id: { $first: '$manufacturer_id' },
                                        manufacturerName: { $first: '$manufacturerName' },
                                        vendor_email: { $first: '$vendor_email' },
                                        vendor_phone: { $first: '$vendor_phone' },
                                        total_urns: { $sum: 1 },
                                        total_eois: { $sum: '$totalEoi' },
                                        sortKey: { $max: '$createdDate' },
                                        urns: {
                                            $push: {
                                                urnNo: '$urnNo',
                                                createdDate: '$createdDate',
                                                totalEoi: '$totalEoi',
                                                statusCodes: '$statusCodes',
                                                eoiDocs: '$eoiDocs',
                                            },
                                        },
                                    },
                                },
                                { $sort: (_c = {}, _c[manufacturerSortField] = sortOrder, _c) },
                            ], false);
                            return [4 /*yield*/, this.productModel
                                    .aggregate([
                                    {
                                        $facet: {
                                            data: __spreadArray(__spreadArray([], manufacturerGroupPipeline, true), [
                                                { $skip: skip },
                                                { $limit: limit },
                                                {
                                                    $project: {
                                                        _id: 0,
                                                        manufacturer_id: 1,
                                                        manufacturerName: 1,
                                                        vendor_email: 1,
                                                        vendor_phone: 1,
                                                        total_urns: 1,
                                                        total_eois: 1,
                                                        urns: 1,
                                                    },
                                                },
                                            ], false),
                                            total: __spreadArray(__spreadArray([], manufacturerGroupPipeline, true), [{ $count: 'count' }], false),
                                            byStatus: __spreadArray(__spreadArray([], rowBase, true), [
                                                { $group: { _id: '$productStatus', count: { $sum: 1 } } },
                                            ], false),
                                            expired: __spreadArray(__spreadArray([], rowBase, true), [
                                                { $match: (0, expired_product_filter_1.matchExpiredProducts)(now) },
                                                { $count: 'count' },
                                            ], false),
                                        },
                                    },
                                ])
                                    .exec()];
                        case 6:
                            facetResult = _r.sent();
                            payload = (_f = facetResult[0]) !== null && _f !== void 0 ? _f : {
                                data: [],
                                total: [],
                                byStatus: [],
                                expired: [],
                            };
                            total = (_j = (_h = (_g = payload.total) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.count) !== null && _j !== void 0 ? _j : 0;
                            statusCounts = {
                                0: 0,
                                1: 0,
                                2: 0,
                                3: 0,
                                4: (_m = (_l = (_k = payload.expired) === null || _k === void 0 ? void 0 : _k[0]) === null || _l === void 0 ? void 0 : _l.count) !== null && _m !== void 0 ? _m : 0,
                            };
                            for (_i = 0, _b = (_o = payload.byStatus) !== null && _o !== void 0 ? _o : []; _i < _b.length; _i++) {
                                row = _b[_i];
                                if ((row === null || row === void 0 ? void 0 : row._id) !== undefined && (row === null || row === void 0 ? void 0 : row._id) !== null) {
                                    statusCounts[String(row._id)] = (_p = row.count) !== null && _p !== void 0 ? _p : 0;
                                }
                            }
                            grouped = ((_q = payload.data) !== null && _q !== void 0 ? _q : []).map(function (m) {
                                return _this.formatAdminListManufacturerGroup(m);
                            });
                            if (!this.isAdminRejectedOnlyListFilter(dto)) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.enrichAdminRejectedListUrns(grouped)];
                        case 7:
                            _r.sent();
                            _r.label = 8;
                        case 8:
                            response = {
                                message: 'Products listed successfully',
                                data: grouped,
                                total: total,
                                page: page,
                                limit: limit,
                                statusCounts: statusCounts,
                            };
                            this.redisService
                                .set(cacheKey, response, this.getProductListCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("Product admin list cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, response];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.adminListProductsGroupedByUrn = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, error_11, page, limit, locationProductIds, _a, skip, sortOrder, now, rowBase, statusMatch, urnSortField, sortField, sectorFilterIds, urnSummaryPipeline, eoiLookupPipeline, urnDataPipeline, totalUrnPipeline, facetResult, payload, total, statusCounts, _i, _b, row, grouped, response;
                var _c;
                var _this = this;
                var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                return __generator(this, function (_r) {
                    switch (_r.label) {
                        case 0:
                            cacheKey = this.buildAdminProductListCacheKey(dto);
                            _r.label = 1;
                        case 1:
                            _r.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _r.sent();
                            if (cached && Array.isArray(cached.data)) {
                                return [2 /*return*/, cached];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_11 = _r.sent();
                            this.logger.warn("Product admin list cache read failed: ".concat((error_11 === null || error_11 === void 0 ? void 0 : error_11.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4:
                            page = (_d = dto.page) !== null && _d !== void 0 ? _d : 1;
                            limit = (_e = dto.limit) !== null && _e !== void 0 ? _e : 10;
                            return [4 /*yield*/, this.findAdminListProductIdsByPlantLocation(dto)];
                        case 5:
                            locationProductIds = _r.sent();
                            if (locationProductIds !== null && locationProductIds.length === 0) {
                                return [2 /*return*/, {
                                        message: 'Products listed successfully',
                                        data: [],
                                        total: 0,
                                        page: page,
                                        limit: limit,
                                        statusCounts: {},
                                    }];
                            }
                            _a = this.buildAdminListRowBase(dto, locationProductIds), skip = _a.skip, sortOrder = _a.sortOrder, now = _a.now, rowBase = _a.rowBase, statusMatch = _a.statusMatch, urnSortField = _a.urnSortField;
                            sortField = urnSortField;
                            sectorFilterIds = this.resolveAdminListSectorIds(dto);
                            urnSummaryPipeline = __spreadArray(__spreadArray([], rowBase, true), [
                                {
                                    $group: {
                                        _id: '$urnNo',
                                        urnNo: { $first: '$urnNo' },
                                        createdDate: { $min: '$createdDate' },
                                        totalEoi: { $sum: 1 },
                                        statusCodes: { $addToSet: '$productStatus' },
                                    },
                                },
                                { $sort: (_c = {}, _c[sortField] = sortOrder, _c) },
                            ], false);
                            eoiLookupPipeline = [
                                {
                                    $match: __assign({ $expr: { $eq: ['$urnNo', '$$urnNo'] } }, (0, active_product_filter_1.matchActiveProducts)()),
                                },
                            ];
                            if (statusMatch) {
                                eoiLookupPipeline.push({ $match: statusMatch });
                            }
                            urnDataPipeline = __spreadArray(__spreadArray([], urnSummaryPipeline, true), [
                                { $skip: skip },
                                { $limit: limit },
                                {
                                    $lookup: {
                                        from: 'products',
                                        let: { urnNo: '$urnNo' },
                                        pipeline: __spreadArray(__spreadArray(__spreadArray(__spreadArray([], eoiLookupPipeline, true), [
                                            {
                                                $lookup: {
                                                    from: 'manufacturers',
                                                    localField: 'manufacturerId',
                                                    foreignField: '_id',
                                                    as: 'manufacturer',
                                                },
                                            },
                                            {
                                                $unwind: {
                                                    path: '$manufacturer',
                                                    preserveNullAndEmptyArrays: true,
                                                },
                                            },
                                            {
                                                $lookup: {
                                                    from: 'categories',
                                                    localField: 'categoryId',
                                                    foreignField: '_id',
                                                    as: 'category',
                                                },
                                            },
                                            {
                                                $unwind: { path: '$category', preserveNullAndEmptyArrays: true },
                                            }
                                        ], false), (sectorFilterIds && sectorFilterIds.length > 0
                                            ? [{ $match: { 'category.sector': { $in: sectorFilterIds } } }]
                                            : []), true), [
                                            {
                                                $lookup: {
                                                    from: 'product_plants',
                                                    let: { productId: '$_id' },
                                                    pipeline: [
                                                        {
                                                            $match: __assign({ $expr: { $eq: ['$productId', '$$productId'] } }, (0, active_product_filter_1.matchActiveProductPlants)()),
                                                        },
                                                        {
                                                            $lookup: {
                                                                from: 'states',
                                                                localField: 'stateId',
                                                                foreignField: '_id',
                                                                as: 'state',
                                                            },
                                                        },
                                                        {
                                                            $unwind: {
                                                                path: '$state',
                                                                preserveNullAndEmptyArrays: true,
                                                            },
                                                        },
                                                        {
                                                            $project: {
                                                                _id: 1,
                                                                productPlantId: 1,
                                                                productId: 1,
                                                                eoiNo: 1,
                                                                urnNo: 1,
                                                                plantName: 1,
                                                                plantLocation: 1,
                                                                countryId: 1,
                                                                stateId: 1,
                                                                city: 1,
                                                                plantStatus: 1,
                                                                createdDate: 1,
                                                                stateName: {
                                                                    $ifNull: [
                                                                        '$state.stateName',
                                                                        { $ifNull: ['$state.state_name', '$state.name'] },
                                                                    ],
                                                                },
                                                            },
                                                        },
                                                    ],
                                                    as: 'plants',
                                                },
                                            },
                                            {
                                                $lookup: {
                                                    from: 'sectors',
                                                    let: { sid: '$category.sector' },
                                                    pipeline: [
                                                        {
                                                            $match: {
                                                                $expr: {
                                                                    $and: [
                                                                        { $ne: ['$$sid', null] },
                                                                        { $eq: ['$id', '$$sid'] },
                                                                    ],
                                                                },
                                                            },
                                                        },
                                                        { $limit: 1 },
                                                        { $project: { _id: 0, name: 1 } },
                                                    ],
                                                    as: '_adminSectorDoc',
                                                },
                                            },
                                            {
                                                $unwind: {
                                                    path: '$_adminSectorDoc',
                                                    preserveNullAndEmptyArrays: true,
                                                },
                                            },
                                            {
                                                $project: {
                                                    _id: 1,
                                                    productId: 1,
                                                    eoiNo: 1,
                                                    urnNo: 1,
                                                    productName: 1,
                                                    productDetails: 1,
                                                    productStatus: 1,
                                                    urnStatus: 1,
                                                    validtillDate: 1,
                                                    categoryId: 1,
                                                    productImage: 1,
                                                    createdDate: 1,
                                                    categoryName: {
                                                        $ifNull: [
                                                            '$category.categoryName',
                                                            '$category.category_name',
                                                        ],
                                                    },
                                                    manufacturerName: '$manufacturer.manufacturerName',
                                                    sector: '$category.sector',
                                                    sectorName: '$_adminSectorDoc.name',
                                                    plants: 1,
                                                },
                                            },
                                            { $sort: { createdDate: -1 } },
                                        ], false),
                                        as: 'eois',
                                    },
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        urnNo: 1,
                                        createdDate: 1,
                                        totalEoi: 1,
                                        statusCodes: 1,
                                        eois: 1,
                                    },
                                },
                            ], false);
                            totalUrnPipeline = __spreadArray(__spreadArray([], urnSummaryPipeline, true), [{ $count: 'count' }], false);
                            return [4 /*yield*/, this.productModel
                                    .aggregate([
                                    {
                                        $facet: {
                                            data: urnDataPipeline,
                                            total: totalUrnPipeline,
                                            byStatus: __spreadArray(__spreadArray([], rowBase, true), [
                                                { $group: { _id: '$productStatus', count: { $sum: 1 } } },
                                            ], false),
                                            expired: __spreadArray(__spreadArray([], rowBase, true), [
                                                { $match: (0, expired_product_filter_1.matchExpiredProducts)(now) },
                                                { $count: 'count' },
                                            ], false),
                                        },
                                    },
                                ])
                                    .exec()];
                        case 6:
                            facetResult = _r.sent();
                            payload = (_f = facetResult[0]) !== null && _f !== void 0 ? _f : {
                                data: [],
                                total: [],
                                byStatus: [],
                                expired: [],
                            };
                            total = (_j = (_h = (_g = payload.total) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.count) !== null && _j !== void 0 ? _j : 0;
                            statusCounts = {
                                0: 0,
                                1: 0,
                                2: 0,
                                3: 0,
                                4: (_m = (_l = (_k = payload.expired) === null || _k === void 0 ? void 0 : _k[0]) === null || _l === void 0 ? void 0 : _l.count) !== null && _m !== void 0 ? _m : 0,
                            };
                            for (_i = 0, _b = (_o = payload.byStatus) !== null && _o !== void 0 ? _o : []; _i < _b.length; _i++) {
                                row = _b[_i];
                                if ((row === null || row === void 0 ? void 0 : row._id) !== undefined && (row === null || row === void 0 ? void 0 : row._id) !== null) {
                                    statusCounts[String(row._id)] = (_p = row.count) !== null && _p !== void 0 ? _p : 0;
                                }
                            }
                            grouped = ((_q = payload.data) !== null && _q !== void 0 ? _q : []).map(function (u) {
                                var _a;
                                var eoiSummaryStatus = _this.deriveAdminUrnStatus(Array.isArray(u.statusCodes) ? u.statusCodes : []);
                                return {
                                    urnNo: u.urnNo,
                                    createdDate: u.createdDate,
                                    eoiSummaryStatus: eoiSummaryStatus,
                                    urnStatus: eoiSummaryStatus,
                                    totalEoi: (_a = u.totalEoi) !== null && _a !== void 0 ? _a : 0,
                                    eois: Array.isArray(u.eois)
                                        ? u.eois.map(function (e) { return _this.formatAdminListEoiEntry(e !== null && e !== void 0 ? e : {}); })
                                        : [],
                                };
                            });
                            response = {
                                message: 'Products listed successfully',
                                data: grouped,
                                total: total,
                                page: page,
                                limit: limit,
                                statusCounts: statusCounts,
                            };
                            this.redisService
                                .set(cacheKey, response, this.getProductListCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("Product admin list cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, response];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.getManufacturersByCategory = function (categoryId) {
            return __awaiter(this, void 0, void 0, function () {
                var categoryObjectId, apiBaseUrl, rows, data;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            categoryObjectId = this.toObjectId(categoryId, 'categoryId');
                            apiBaseUrl = ((_a = this.configService.get('API_BASE_URL')) !== null && _a !== void 0 ? _a : '')
                                .trim()
                                .replace(/\/+$/, '');
                            return [4 /*yield*/, this.productModel
                                    .aggregate([
                                    {
                                        $match: (0, website_public_product_filter_1.matchWebsitePublicActiveCertifiedProducts)({
                                            categoryId: categoryObjectId,
                                        }),
                                    },
                                    {
                                        $group: {
                                            _id: '$manufacturerId',
                                            productCount: { $sum: 1 },
                                        },
                                    },
                                    {
                                        $lookup: {
                                            from: 'manufacturers',
                                            localField: '_id',
                                            foreignField: '_id',
                                            as: 'manufacturer',
                                        },
                                    },
                                    {
                                        $unwind: {
                                            path: '$manufacturer',
                                            preserveNullAndEmptyArrays: false,
                                        },
                                    },
                                    {
                                        $match: (0, public_website_manufacturer_visibility_filter_1.matchPublicWebsiteManufacturerVisibility)(),
                                    },
                                    {
                                        $project: {
                                            _id: '$manufacturer._id',
                                            manufacturerName: '$manufacturer.manufacturerName',
                                            gpInternalId: '$manufacturer.gpInternalId',
                                            manufacturerInitial: '$manufacturer.manufacturerInitial',
                                            manufacturerImage: {
                                                $ifNull: ['$manufacturer.manufacturerImage', null],
                                            },
                                            manufacturerStatus: '$manufacturer.manufacturerStatus',
                                            vendor_status: '$manufacturer.vendor_status',
                                            vendor_name: '$manufacturer.vendor_name',
                                            vendor_email: '$manufacturer.vendor_email',
                                            vendor_phone: '$manufacturer.vendor_phone',
                                            vendor_website: {
                                                $ifNull: ['$manufacturer.vendor_website', ''],
                                            },
                                            vendor_facebook: {
                                                $ifNull: ['$manufacturer.vendor_facebook', ''],
                                            },
                                            vendor_youtube: {
                                                $ifNull: ['$manufacturer.vendor_youtube', ''],
                                            },
                                            vendor_twitter: {
                                                $ifNull: ['$manufacturer.vendor_twitter', ''],
                                            },
                                            vendor_linkedin: {
                                                $ifNull: ['$manufacturer.vendor_linkedin', ''],
                                            },
                                            productCount: 1,
                                        },
                                    },
                                    { $sort: { manufacturerName: 1 } },
                                ])
                                    .exec()];
                        case 1:
                            rows = _b.sent();
                            data = rows.map(function (row) {
                                var manufacturerImageUrl = (0, upload_file_util_1.resolvePublicUploadUrl)(row.manufacturerImage, apiBaseUrl);
                                var socialFields = _this.mapPublicManufacturerSocialFields({
                                    facebook: row.vendor_facebook,
                                    youtube: row.vendor_youtube,
                                    twitter: row.vendor_twitter,
                                    linkedin: row.vendor_linkedin,
                                    website: row.vendor_website,
                                });
                                var _vf = row.vendor_facebook, _vy = row.vendor_youtube, _vt = row.vendor_twitter, _vl = row.vendor_linkedin, _vw = row.vendor_website, rest = __rest(row, ["vendor_facebook", "vendor_youtube", "vendor_twitter", "vendor_linkedin", "vendor_website"]);
                                return __assign(__assign(__assign({}, rest), { manufacturerImage: manufacturerImageUrl, manufacturerImageUrl: manufacturerImageUrl }), socialFields);
                            });
                            return [2 /*return*/, {
                                    categoryId: categoryId,
                                    total: data.length,
                                    data: data,
                                }];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.getCategoriesByManufacturer = function (manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerObjectId, apiBaseUrl, rows, data;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            manufacturerObjectId = this.toObjectId(manufacturerId, 'manufacturerId');
                            apiBaseUrl = ((_a = this.configService.get('API_BASE_URL')) !== null && _a !== void 0 ? _a : '')
                                .trim()
                                .replace(/\/+$/, '');
                            return [4 /*yield*/, this.productModel
                                    .aggregate([
                                    {
                                        $match: (0, website_public_product_filter_1.matchWebsitePublicActiveCertifiedProducts)({
                                            manufacturerId: manufacturerObjectId,
                                        }),
                                    },
                                    {
                                        $group: {
                                            _id: '$categoryId',
                                            productCount: { $sum: 1 },
                                        },
                                    },
                                    {
                                        $lookup: {
                                            from: 'categories',
                                            localField: '_id',
                                            foreignField: '_id',
                                            as: 'category',
                                        },
                                    },
                                    {
                                        $unwind: {
                                            path: '$category',
                                            preserveNullAndEmptyArrays: false,
                                        },
                                    },
                                    {
                                        $match: { 'category.category_status': 1 },
                                    },
                                    {
                                        $project: {
                                            _id: '$category._id',
                                            category_id: '$category.category_id',
                                            category_name: '$category.category_name',
                                            category_image: '$category.category_image',
                                            category_status: '$category.category_status',
                                            sector: '$category.sector',
                                            productCount: 1,
                                        },
                                    },
                                    { $sort: { category_name: 1 } },
                                ])
                                    .exec()];
                        case 1:
                            rows = _b.sent();
                            data = rows.map(function (row) {
                                var _a;
                                var category_image_url = (0, upload_file_util_1.resolvePublicUploadUrl)(row.category_image, apiBaseUrl);
                                return __assign(__assign({}, row), { category_image: (_a = category_image_url !== null && category_image_url !== void 0 ? category_image_url : row.category_image) !== null && _a !== void 0 ? _a : null, category_image_url: category_image_url, categoryImageUrl: category_image_url });
                            });
                            return [2 /*return*/, {
                                    manufacturerId: manufacturerId,
                                    total: data.length,
                                    data: data,
                                }];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.exportAdminProductsFile = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var listRows, eoiRows, format, stamp, csv, buffer;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.collectAdminListRowsForExport(dto)];
                        case 1:
                            listRows = _b.sent();
                            eoiRows = this.flattenAdminListForExport(listRows).eoiRows;
                            format = (_a = dto.format) !== null && _a !== void 0 ? _a : 'xlsx';
                            stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
                            if (format === 'csv') {
                                csv = (0, admin_products_export_util_1.buildAdminProductsExportCsv)(eoiRows);
                                return [2 /*return*/, {
                                        buffer: Buffer.from(csv, 'utf-8'),
                                        fileName: "admin-products-export-".concat(stamp, ".csv"),
                                        contentType: 'text/csv; charset=utf-8',
                                        rowCount: eoiRows.length,
                                    }];
                            }
                            return [4 /*yield*/, (0, admin_products_export_util_1.buildAdminProductsExportXlsxBuffer)(eoiRows)];
                        case 2:
                            buffer = _b.sent();
                            return [2 /*return*/, {
                                    buffer: buffer,
                                    fileName: "admin-products-export-".concat(stamp, ".xlsx"),
                                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                    rowCount: eoiRows.length,
                                }];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.exportAdminProductsXlsx = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.exportAdminProductsFile(__assign(__assign({}, dto), { format: 'xlsx' }))];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    buffer: result.buffer,
                                    fileName: result.fileName,
                                }];
                    }
                });
            });
        };
        ProductRegistrationService_1.prototype.createAdminProductsExportJob = function (dto, requestedBy) {
            return __awaiter(this, void 0, void 0, function () {
                var format, includeSheets, filtersForHash, filtersHash, now, jobId, job;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    this.cleanupExpiredExportJobs();
                    format = (_a = dto.format) !== null && _a !== void 0 ? _a : 'xlsx';
                    includeSheets = this.normalizeAdminExportIncludeSheets(dto.includeSheets);
                    filtersForHash = __assign(__assign({}, dto), { page: undefined, limit: undefined, format: format, includeSheets: includeSheets });
                    filtersHash = (0, crypto_1.createHash)('sha256')
                        .update(JSON.stringify(filtersForHash))
                        .digest('hex')
                        .slice(0, 16);
                    now = new Date();
                    jobId = "exp_".concat(Date.now(), "_").concat((0, crypto_1.randomUUID)().slice(0, 8));
                    job = {
                        jobId: jobId,
                        status: 'queued',
                        progress: 0,
                        format: format,
                        includeSheets: includeSheets,
                        filtersHash: filtersHash,
                        createdAt: now,
                        updatedAt: now,
                        expiresAt: null,
                        requestedBy: requestedBy,
                    };
                    this.exportJobs.set(jobId, job);
                    setImmediate(function () {
                        void _this.runAdminProductsExportJob(jobId, dto);
                    });
                    return [2 /*return*/, {
                            jobId: jobId,
                            status: 'queued',
                        }];
                });
            });
        };
        ProductRegistrationService_1.prototype.getAdminProductsExportJob = function (jobId) {
            this.cleanupExpiredExportJobs();
            var job = this.exportJobs.get(jobId);
            if (!job) {
                throw new common_1.NotFoundException('Export job not found');
            }
            return {
                jobId: job.jobId,
                status: job.status,
                progress: job.progress,
                fileUrl: job.fileUrl,
                fileName: job.fileName,
                expiresAt: job.expiresAt,
                error: job.error,
                rowCount: job.rowCount,
                updatedAt: job.updatedAt,
                createdAt: job.createdAt,
            };
        };
        ProductRegistrationService_1.prototype.runAdminProductsExportJob = function (jobId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var job, pageSize, page, total, listRows, batch, _a, urnRows, eoiRows, stamp, ext, fileName, filePath, workbook, wroteWorksheet, ws1_1, ws2_1, ws, error_12;
                var _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            job = this.exportJobs.get(jobId);
                            if (!job)
                                return [2 /*return*/];
                            _f.label = 1;
                        case 1:
                            _f.trys.push([1, 8, , 9]);
                            this.ensureExportDir();
                            job.status = 'processing';
                            job.progress = 5;
                            job.updatedAt = new Date();
                            job.includeSheets = this.normalizeAdminExportIncludeSheets(job.includeSheets);
                            pageSize = 500;
                            page = 1;
                            total = 0;
                            listRows = [];
                            _f.label = 2;
                        case 2:
                            if (!true) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.adminListProducts(__assign(__assign({}, dto), { page: page, limit: pageSize }))];
                        case 3:
                            batch = _f.sent();
                            if (total === 0) {
                                total = (_b = batch.total) !== null && _b !== void 0 ? _b : 0;
                            }
                            listRows.push.apply(listRows, ((_c = batch.data) !== null && _c !== void 0 ? _c : []));
                            if (listRows.length >= total || ((_d = batch.data) !== null && _d !== void 0 ? _d : []).length === 0) {
                                return [3 /*break*/, 4];
                            }
                            page += 1;
                            job.progress = Math.min(70, 10 + Math.floor((listRows.length / Math.max(total, 1)) * 60));
                            job.updatedAt = new Date();
                            return [3 /*break*/, 2];
                        case 4:
                            _a = this.flattenAdminListForExport(listRows), urnRows = _a.urnRows, eoiRows = _a.eoiRows;
                            if (eoiRows.length > this.exportMaxRows) {
                                throw new common_1.BadRequestException("Export exceeds maximum allowed rows (".concat(this.exportMaxRows, "). Narrow down filters and try again."));
                            }
                            stamp = new Date().toISOString().replace(/[:.]/g, '-');
                            ext = job.format === 'csv' ? 'csv' : 'xlsx';
                            fileName = "products_export_".concat(jobId, "_").concat(stamp, ".").concat(ext);
                            filePath = (0, path_1.join)(this.exportDir, fileName);
                            if (!(job.format === 'csv')) return [3 /*break*/, 5];
                            (0, fs_1.writeFileSync)(filePath, (0, admin_products_export_util_1.buildAdminProductsExportCsv)(eoiRows), 'utf-8');
                            return [3 /*break*/, 7];
                        case 5:
                            workbook = new exceljs_1.default.Workbook();
                            wroteWorksheet = false;
                            if (job.includeSheets.includes('urn_summary')) {
                                ws1_1 = workbook.addWorksheet('URN Summary');
                                this.writeAdminUrnSummaryWorksheetHeaders(ws1_1);
                                urnRows.forEach(function (u, idx) {
                                    var _a, _b, _c, _d, _e, _f, _g, _h;
                                    ws1_1.addRow({
                                        sno: idx + 1,
                                        manufacturerName: (_a = u.manufacturerName) !== null && _a !== void 0 ? _a : '',
                                        email: (_c = (_b = u.email) !== null && _b !== void 0 ? _b : u.vendor_email) !== null && _c !== void 0 ? _c : '',
                                        phone: (_e = (_d = u.phone) !== null && _d !== void 0 ? _d : u.vendor_phone) !== null && _e !== void 0 ? _e : '',
                                        urnNo: (_f = u.urnNo) !== null && _f !== void 0 ? _f : u.urn_number,
                                        urnStatus: (_g = u.urnStatus) !== null && _g !== void 0 ? _g : u.status,
                                        totalEoi: (_h = u.totalEoi) !== null && _h !== void 0 ? _h : u.total_eoi,
                                    });
                                });
                                wroteWorksheet = true;
                            }
                            if (job.includeSheets.includes('eoi_details')) {
                                ws2_1 = workbook.addWorksheet('EOI Details');
                                (0, admin_products_export_util_1.writeAdminProductsEoiWorksheetHeaders)(ws2_1, 28);
                                eoiRows.forEach(function (row) {
                                    ws2_1.addRow((0, admin_products_export_util_1.mapAdminProductsExportEoiRow)(row));
                                });
                                wroteWorksheet = true;
                            }
                            if (!wroteWorksheet) {
                                ws = workbook.addWorksheet('Products Export');
                                (0, admin_products_export_util_1.writeAdminProductsEoiWorksheetHeaders)(ws);
                            }
                            return [4 /*yield*/, workbook.xlsx.writeFile(filePath)];
                        case 6:
                            _f.sent();
                            _f.label = 7;
                        case 7:
                            job.status = 'completed';
                            job.progress = 100;
                            job.fileName = fileName;
                            job.fileUrl = this.buildPublicFileUrl(fileName);
                            job.rowCount = eoiRows.length;
                            job.updatedAt = new Date();
                            job.expiresAt = new Date(Date.now() + this.exportTtlMs);
                            // Audit trail for export execution
                            console.log('[AdminProductsExport]', JSON.stringify({
                                jobId: job.jobId,
                                requestedBy: (_e = job.requestedBy) !== null && _e !== void 0 ? _e : null,
                                format: job.format,
                                includeSheets: job.includeSheets,
                                filtersHash: job.filtersHash,
                                rowCount: job.rowCount,
                                createdAt: job.createdAt,
                                completedAt: job.updatedAt,
                            }));
                            return [3 /*break*/, 9];
                        case 8:
                            error_12 = _f.sent();
                            job.status = 'failed';
                            job.progress = 100;
                            job.error = (error_12 === null || error_12 === void 0 ? void 0 : error_12.message) || 'Export failed';
                            job.updatedAt = new Date();
                            job.expiresAt = new Date(Date.now() + this.exportTtlMs);
                            return [3 /*break*/, 9];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        return ProductRegistrationService_1;
    }());
    __setFunctionName(_classThis, "ProductRegistrationService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductRegistrationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductRegistrationService = _classThis;
}();
exports.ProductRegistrationService = ProductRegistrationService;
