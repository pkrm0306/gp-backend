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
exports.AdminService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var crypto = require("crypto");
var event_date_util_1 = require("../events/utils/event-date.util");
var event_brochures_util_1 = require("../events/utils/event-brochures.util");
var event_id_counter_schema_1 = require("../events/schemas/event-id-counter.schema");
var newsletter_subscribers_query_util_1 = require("../website/utils/newsletter-subscribers-query.util");
var admin_notification_util_1 = require("./helpers/admin-notification.util");
var bcrypt = require("bcryptjs");
var admin_dashboard_metrics_util_1 = require("./admin-dashboard-metrics.util");
var dashboard_metrics_filters_util_1 = require("./utils/dashboard-metrics-filters.util");
var category_name_normalize_1 = require("../categories/category-name-normalize");
var expired_product_filter_1 = require("../product-registration/constants/expired-product.filter");
var admin_dashboard_permissions_util_1 = require("./admin-dashboard-permissions.util");
var platform_admin_util_1 = require("../common/utils/platform-admin.util");
var phone_lookup_util_1 = require("../common/utils/phone-lookup.util");
var global_phone_uniqueness_service_1 = require("../common/services/global-phone-uniqueness.service");
var admin_field_validation_util_1 = require("./admin-field-validation.util");
var banner_vendor_scope_util_1 = require("./utils/banner-vendor-scope.util");
var team_member_sectors_constants_1 = require("./team-member-sectors.constants");
function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function escapeHtml(input) {
    return String(input !== null && input !== void 0 ? input : '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
/** Same label format as website subscribe confirmation emails. */
function formatSubscribedForLabel(value) {
    if (Array.isArray(value)) {
        var parts = value.map(function (v) { return String(v !== null && v !== void 0 ? v : '').trim(); }).filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : 'Newsletter';
    }
    var asString = String(value !== null && value !== void 0 ? value : '').trim();
    return asString || 'Newsletter';
}
function resolveOptionalEventUrl(value) {
    var trimmed = String(value !== null && value !== void 0 ? value : '').trim();
    return trimmed || undefined;
}
var DEFAULT_EVENT_BROCHURE_LINK = 'https://www.linkedin.com/posts/cii-greenpro-ecolabelling_greenpro-summit-2025-brochure-03062025-activity-7335663123154014208-2ScV?utm_source=share&utm_medium=member_desktop&rcm=ACoAAB-BYukBl9XKRWqUfyykOlftYFSgtIQGafI';
var AdminService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminService = _classThis = /** @class */ (function () {
        function AdminService_1(productModel, manufacturerModel, vendorUserModel, bannerModel, eventModel, eventCounterModel, newsletterSubscriberModel, contactMessageModel, contactReplyThreadModel, notificationModel, articleModel, categoryModel, productPlantModel, stateModel, activityLogModel, paymentDetailsModel, emailService, adminSystemNotification, rbacService, redisService, categoriesService, sectorsService, manufacturerIdGeneration, productRegistrationService, globalPhoneUniqueness, authService, dashboardStatsService, revenueDashboardService) {
            this.productModel = productModel;
            this.manufacturerModel = manufacturerModel;
            this.vendorUserModel = vendorUserModel;
            this.bannerModel = bannerModel;
            this.eventModel = eventModel;
            this.eventCounterModel = eventCounterModel;
            this.newsletterSubscriberModel = newsletterSubscriberModel;
            this.contactMessageModel = contactMessageModel;
            this.contactReplyThreadModel = contactReplyThreadModel;
            this.notificationModel = notificationModel;
            this.articleModel = articleModel;
            this.categoryModel = categoryModel;
            this.productPlantModel = productPlantModel;
            this.stateModel = stateModel;
            this.activityLogModel = activityLogModel;
            this.paymentDetailsModel = paymentDetailsModel;
            this.emailService = emailService;
            this.adminSystemNotification = adminSystemNotification;
            this.rbacService = rbacService;
            this.redisService = redisService;
            this.categoriesService = categoriesService;
            this.sectorsService = sectorsService;
            this.manufacturerIdGeneration = manufacturerIdGeneration;
            this.productRegistrationService = productRegistrationService;
            this.globalPhoneUniqueness = globalPhoneUniqueness;
            this.authService = authService;
            this.dashboardStatsService = dashboardStatsService;
            this.revenueDashboardService = revenueDashboardService;
            this.logger = new common_1.Logger(AdminService.name);
        }
        AdminService_1.prototype.resolveDashboardMetricsFilters = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var dateRange, granularity, categoryObjectId, manufacturerIdsForRegion, manufacturerRaw, manufacturerObjectId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dateRange = (0, dashboard_metrics_filters_util_1.resolveDashboardDateRange)(query);
                            granularity = (0, dashboard_metrics_filters_util_1.resolveRevenueDashboardGranularity)(query.period, query.granularity);
                            if (!query.categoryId) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.resolveDashboardCategoryId(query.categoryId)];
                        case 1:
                            categoryObjectId = _a.sent();
                            _a.label = 2;
                        case 2:
                            if (!query.region) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.resolveManufacturerIdsByRegion(query.region)];
                        case 3:
                            manufacturerIdsForRegion = _a.sent();
                            _a.label = 4;
                        case 4:
                            manufacturerRaw = (query.manufacturerId || query.vendorId || '').trim();
                            if (manufacturerRaw) {
                                if (!mongoose_1.Types.ObjectId.isValid(manufacturerRaw)) {
                                    throw new common_1.BadRequestException('manufacturerId/vendorId must be a valid ObjectId');
                                }
                                manufacturerObjectId = new mongoose_1.Types.ObjectId(manufacturerRaw);
                            }
                            return [2 /*return*/, {
                                    dateRange: dateRange,
                                    granularity: granularity,
                                    categoryObjectId: categoryObjectId,
                                    region: query.region,
                                    productStatusFilter: query.productStatus,
                                    manufacturerIdsForRegion: manufacturerIdsForRegion,
                                    manufacturerObjectId: manufacturerObjectId,
                                    status: query.status,
                                }];
                    }
                });
            });
        };
        AdminService_1.prototype.buildAppliedFiltersPayload = function (query, filters) {
            return (0, dashboard_metrics_filters_util_1.buildAppliedDashboardFilters)(query, filters);
        };
        AdminService_1.prototype.getDashboardFilterOptions = function () {
            var currentYear = new Date().getFullYear();
            var years = [currentYear, currentYear - 1, currentYear - 2];
            return {
                periods: [
                    { value: 'this_week', label: 'This Week' },
                    { value: 'last_week', label: 'Last Week' },
                    { value: 'this_month', label: 'This Month' },
                    { value: 'last_month', label: 'Last Month' },
                    { value: 'this_quarter', label: 'This Quarter' },
                    { value: 'this_year', label: 'This Year' },
                    { value: 'last_year', label: 'Last Year' },
                ],
                years: __spreadArray([
                    { value: null, label: 'All Years' }
                ], years.map(function (y) { return ({ value: y, label: String(y) }); }), true),
                months: [
                    { value: null, label: 'All Months' },
                    { value: 1, label: 'Jan' },
                    { value: 2, label: 'Feb' },
                    { value: 3, label: 'Mar' },
                    { value: 4, label: 'Apr' },
                    { value: 5, label: 'May' },
                    { value: 6, label: 'Jun' },
                    { value: 7, label: 'Jul' },
                    { value: 8, label: 'Aug' },
                    { value: 9, label: 'Sep' },
                    { value: 10, label: 'Oct' },
                    { value: 11, label: 'Nov' },
                    { value: 12, label: 'Dec' },
                ],
                productStatuses: [
                    { value: null, label: 'All Statuses' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'active', label: 'Active (in certification)' },
                    { value: 'completed', label: 'Completed (certified)' },
                    { value: 'overdue', label: 'Overdue (expired)' },
                ],
                regions: [
                    { value: null, label: 'All Regions' },
                    { value: 'north', label: 'North' },
                    { value: 'south', label: 'South' },
                    { value: 'east', label: 'East' },
                    { value: 'west', label: 'West' },
                ],
                granularities: [
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'quarterly', label: 'Quarterly' },
                ],
                defaults: {
                    period: 'this_year',
                    year: currentYear,
                    month: null,
                    granularity: 'monthly',
                },
                queryParamMap: {
                    period: 'period',
                    year: 'year',
                    month: 'month',
                    quarter: 'quarter',
                    productStatus: 'productStatus',
                    categoryId: 'categoryId',
                    region: 'region',
                    granularity: 'granularity',
                },
            };
        };
        AdminService_1.prototype.resolveDashboardCategoryId = function (raw) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmed, key, cat;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmed = String(raw).trim();
                            if (/^[0-9a-fA-F]{24}$/.test(trimmed)) {
                                return [2 /*return*/, new mongoose_1.Types.ObjectId(trimmed)];
                            }
                            key = (0, category_name_normalize_1.normalizeCategoryNameKey)(trimmed.replace(/-/g, ' '));
                            return [4 /*yield*/, this.categoryModel
                                    .findOne({ category_name_normalized: key })
                                    .select('_id')
                                    .lean()
                                    .exec()];
                        case 1:
                            cat = _a.sent();
                            if (!(cat === null || cat === void 0 ? void 0 : cat._id)) {
                                throw new common_1.BadRequestException("Category not found: ".concat(raw));
                            }
                            return [2 /*return*/, cat._id];
                    }
                });
            });
        };
        AdminService_1.prototype.resolveManufacturerIdsByRegion = function (region) {
            return __awaiter(this, void 0, void 0, function () {
                var states, stateIds;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.stateModel.find().select('stateName').lean().exec()];
                        case 1:
                            states = _a.sent();
                            stateIds = states
                                .filter(function (s) { var _a; return (0, dashboard_metrics_filters_util_1.stateNameMatchesRegion)(String((_a = s.stateName) !== null && _a !== void 0 ? _a : ''), region); })
                                .map(function (s) { return s._id; });
                            if (stateIds.length === 0) {
                                return [2 /*return*/, []];
                            }
                            return [2 /*return*/, this.productPlantModel
                                    .distinct('manufacturerId', { stateId: { $in: stateIds } })
                                    .exec()];
                    }
                });
            });
        };
        AdminService_1.prototype.compareChartBuckets = function (a, b, granularity) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            var ay = (_a = a.year) !== null && _a !== void 0 ? _a : 0;
            var by = (_b = b.year) !== null && _b !== void 0 ? _b : 0;
            if (ay !== by)
                return ay - by;
            if (granularity === 'weekly') {
                return ((_c = a.week) !== null && _c !== void 0 ? _c : 0) - ((_d = b.week) !== null && _d !== void 0 ? _d : 0);
            }
            if (granularity === 'quarterly') {
                return ((_e = a.quarter) !== null && _e !== void 0 ? _e : 0) - ((_f = b.quarter) !== null && _f !== void 0 ? _f : 0);
            }
            return ((_g = a.month) !== null && _g !== void 0 ? _g : 0) - ((_h = b.month) !== null && _h !== void 0 ? _h : 0);
        };
        AdminService_1.prototype.buildDashboardCharts = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.dashboardStatsService.getCharts(filters)];
                });
            });
        };
        AdminService_1.prototype.getDashboardRecentProducts = function () {
            return __awaiter(this, arguments, void 0, function (page, limit) {
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 10; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.productRegistrationService.adminListProducts({
                            page: page,
                            limit: limit,
                            sortBy: 'createdDate',
                            sortOrder: 'desc',
                        })];
                });
            });
        };
        AdminService_1.prototype.getDashboardActivity = function () {
            return __awaiter(this, arguments, void 0, function (limit) {
                var rows;
                if (limit === void 0) { limit = 20; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.activityLogModel
                                .find()
                                .sort({ created_at: -1 })
                                .limit(limit)
                                .lean()
                                .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, rows.map(function (r) { return ({
                                    id: String(r._id),
                                    urnNo: r.urn_no,
                                    activity: r.activity,
                                    activityStatus: r.activity_status,
                                    manufacturerId: String(r.manufacturer_id),
                                    vendorId: String(r.vendor_id),
                                    createdAt: r.created_at,
                                }); })];
                    }
                });
            });
        };
        /** Normalized sector ids stored on the team member (or legacy fallback from categories). */
        AdminService_1.prototype.teamMemberStoredSectorIds = function (m) {
            var fromSectors = Array.isArray(m.sector_ids) ? m.sector_ids : [];
            var sectorIds = fromSectors.filter(function (x) { return typeof x === 'number' && Number.isInteger(x) && x >= 1; });
            if (sectorIds.length > 0) {
                return __spreadArray([], new Set(sectorIds), true);
            }
            var oneSector = typeof m.sector_id === 'number' &&
                Number.isInteger(m.sector_id) &&
                m.sector_id >= 1
                ? m.sector_id
                : null;
            if (oneSector !== null) {
                return [oneSector];
            }
            return [];
        };
        /** Legacy rows: derive sector ids from stored category_ids when sector_ids is empty. */
        AdminService_1.prototype.legacySectorIdsFromCategories = function (m) {
            return __awaiter(this, void 0, void 0, function () {
                var raw, catIds, one, catToSector, out, _i, catIds_1, cid, s;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            raw = Array.isArray(m.category_ids) ? m.category_ids : [];
                            catIds = raw.filter(function (x) { return typeof x === 'number' && Number.isInteger(x) && x >= 1; });
                            if (!catIds.length) {
                                one = typeof m.category_id === 'number' &&
                                    Number.isInteger(m.category_id) &&
                                    m.category_id >= 1
                                    ? m.category_id
                                    : null;
                                if (one !== null)
                                    catIds.push(one);
                            }
                            if (!catIds.length)
                                return [2 /*return*/, []];
                            return [4 /*yield*/, this.categoriesService.getCategorySectorsByNumericIds(catIds)];
                        case 1:
                            catToSector = _a.sent();
                            out = new Set();
                            for (_i = 0, catIds_1 = catIds; _i < catIds_1.length; _i++) {
                                cid = catIds_1[_i];
                                s = catToSector.get(cid);
                                if (typeof s === 'number' && Number.isInteger(s) && s >= 1) {
                                    out.add(s);
                                }
                            }
                            return [2 /*return*/, __spreadArray([], out, true).sort(function (a, b) { return a - b; })];
                    }
                });
            });
        };
        AdminService_1.prototype.normalizeTeamMemberSectorIds = function (m) {
            return __awaiter(this, void 0, void 0, function () {
                var stored;
                return __generator(this, function (_a) {
                    stored = this.teamMemberStoredSectorIds(m);
                    if (stored.length > 0)
                        return [2 /*return*/, stored];
                    return [2 /*return*/, this.legacySectorIdsFromCategories(m)];
                });
            });
        };
        /** Validates fixed CMS team-member sectors (ids 1–4 only). */
        AdminService_1.prototype.assertTeamMemberSectorsValid = function (sectorIds) {
            var unique = [];
            var seen = new Set();
            var invalid = [];
            for (var _i = 0, sectorIds_1 = sectorIds; _i < sectorIds_1.length; _i++) {
                var sid = sectorIds_1[_i];
                if (!Number.isInteger(sid))
                    continue;
                if (seen.has(sid))
                    continue;
                seen.add(sid);
                if ((0, team_member_sectors_constants_1.isTeamMemberSectorId)(sid)) {
                    unique.push(sid);
                }
                else {
                    invalid.push(sid);
                }
            }
            if (invalid.length > 0) {
                var allowed = team_member_sectors_constants_1.TEAM_MEMBER_SECTOR_OPTIONS.map(function (s) { return s.name; }).join(', ');
                throw new common_1.BadRequestException("Invalid sector id(s): ".concat(invalid.join(', '), ". Allowed sectors: ").concat(allowed));
            }
            return unique.sort(function (a, b) { return a - b; });
        };
        AdminService_1.prototype.listTeamMemberSectorOptions = function () {
            return {
                message: 'Team member sector options retrieved successfully',
                data: __spreadArray([], team_member_sectors_constants_1.TEAM_MEMBER_SECTOR_OPTIONS, true),
            };
        };
        AdminService_1.prototype.assertGlobalMobileAvailable = function (mobile, excludeUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.globalPhoneUniqueness.assertPhoneAvailable(mobile, {
                                    excludeUserId: excludeUserId,
                                    conflictMessage: global_phone_uniqueness_service_1.ADMIN_MOBILE_UNAVAILABLE_MESSAGE,
                                })];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _a.sent();
                            if (e_1 instanceof common_1.ConflictException) {
                                (0, admin_field_validation_util_1.throwTeamMemberMobileDuplicateIssue)();
                            }
                            throw e_1;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /** Platform admin/staff emails are globally unique (including soft-deleted rows). */
        AdminService_1.prototype.assertPlatformEmailAvailable = function (emailLower, excludeUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var filter, existing;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filter = {
                                type: { $in: ['admin', 'staff'] },
                                email: new RegExp("^".concat(escapeRegex(emailLower), "$"), 'i'),
                            };
                            if (excludeUserId) {
                                filter._id = { $ne: excludeUserId };
                            }
                            return [4 /*yield*/, this.vendorUserModel
                                    .findOne(filter)
                                    .select('_id email')
                                    .lean()
                                    .exec()];
                        case 1:
                            existing = _a.sent();
                            if (existing) {
                                throw new common_1.ConflictException('Email already exists');
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        AdminService_1.prototype.rethrowTeamMemberDuplicateKeyError = function (e) {
            var _a, _b;
            var err = e;
            if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
                var pattern = (_a = err.keyPattern) !== null && _a !== void 0 ? _a : {};
                var keyVal = (_b = err.keyValue) !== null && _b !== void 0 ? _b : {};
                if ('email' in pattern || keyVal.email !== undefined) {
                    throw new common_1.ConflictException('Email already exists');
                }
                if ('phone' in pattern || keyVal.phone !== undefined) {
                    (0, admin_field_validation_util_1.throwTeamMemberMobileDuplicateIssue)();
                }
                throw new common_1.ConflictException('Duplicate record');
            }
            throw e;
        };
        /** Attach fixed CMS sector names for API; strips category_* and internal fields. */
        AdminService_1.prototype.attachSectorsToTeamMemberRows = function (rows) {
            return __awaiter(this, void 0, void 0, function () {
                var legacyIds, _i, rows_1, row, _a, _b, sid, legacyNameMap, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            legacyIds = new Set();
                            for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                                row = rows_1[_i];
                                for (_a = 0, _b = row.sector_ids; _a < _b.length; _a++) {
                                    sid = _b[_a];
                                    if (!(0, team_member_sectors_constants_1.isTeamMemberSectorId)(sid)) {
                                        legacyIds.add(sid);
                                    }
                                }
                            }
                            if (!(legacyIds.size > 0)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.sectorsService.getSectorNamesByNumericIds(__spreadArray([], legacyIds, true))];
                        case 1:
                            _c = _d.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _c = new Map();
                            _d.label = 3;
                        case 3:
                            legacyNameMap = _c;
                            return [2 /*return*/, rows.map(function (row) {
                                    var _a, _b;
                                    var _c = row, storedSectorIds = _c.sector_ids, _cids = _c.category_ids, _cidsCamel = _c.categoryIds, _cid = _c.category_id, _sid = _c.sector_id, rest = __rest(_c, ["sector_ids", "category_ids", "categoryIds", "category_id", "sector_id"]);
                                    var sector_ids = __spreadArray([], storedSectorIds, true).filter(function (id) { return (0, team_member_sectors_constants_1.isTeamMemberSectorId)(id) || legacyNameMap.has(id); })
                                        .sort(function (a, b) { return a - b; });
                                    var sectors = sector_ids.map(function (id) {
                                        var _a;
                                        return ({
                                            id: id,
                                            name: (0, team_member_sectors_constants_1.isTeamMemberSectorId)(id)
                                                ? (0, team_member_sectors_constants_1.getTeamMemberSectorNameById)(id)
                                                : ((_a = legacyNameMap.get(id)) !== null && _a !== void 0 ? _a : ''),
                                        });
                                    });
                                    var sector_id = (_a = sector_ids[0]) !== null && _a !== void 0 ? _a : null;
                                    var sector_name = sector_id !== null
                                        ? (0, team_member_sectors_constants_1.isTeamMemberSectorId)(sector_id)
                                            ? (0, team_member_sectors_constants_1.getTeamMemberSectorNameById)(sector_id)
                                            : ((_b = legacyNameMap.get(sector_id)) !== null && _b !== void 0 ? _b : '')
                                        : null;
                                    return __assign(__assign({}, rest), { sector_ids: sector_ids, sectorIds: sector_ids, sector_id: sector_id, sector_name: sector_name, sectors: sectors });
                                })];
                    }
                });
            });
        };
        /** Resolve sector ids for a team member row (includes legacy category fallback). */
        AdminService_1.prototype.resolveTeamMemberSectorIds = function (member) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.normalizeTeamMemberSectorIds(member)];
                });
            });
        };
        /** Attach sector_ids, sectorIds, sector_id, sector_name, and sectors to list rows. */
        AdminService_1.prototype.attachTeamMemberSectorFields = function (rows) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.attachSectorsToTeamMemberRows(rows)];
                });
            });
        };
        AdminService_1.prototype.invalidateWebsiteTeamMembersListCache = function () {
            var _this = this;
            for (var _i = 0, _a = ['list-v2', 'list-v3', 'list-v4']; _i < _a.length; _i++) {
                var version = _a[_i];
                var key = this.redisService.buildKey('website', 'team-members', version);
                this.redisService.del(key).catch(function (err) {
                    _this.logger.warn("Website team-members cache invalidation failed: ".concat((err === null || err === void 0 ? void 0 : err.message) || 'unknown'));
                });
            }
        };
        AdminService_1.prototype.mapTeamMemberShowOnWebsite = function (value) {
            if (value === false || value === 0)
                return false;
            if (typeof value === 'string') {
                var normalized = value.trim().toLowerCase();
                if (normalized === '0' || normalized === 'false' || normalized === 'no' || normalized === 'off') {
                    return false;
                }
            }
            return true;
        };
        AdminService_1.prototype.resolveEventImagePath = function (eventImage) {
            var raw = String(eventImage !== null && eventImage !== void 0 ? eventImage : '').trim();
            if (!raw)
                return '';
            if (raw.startsWith('/uploads/')) {
                return raw.replace(/^\/uploads\//, '');
            }
            if (raw.startsWith('uploads/')) {
                return raw.replace(/^uploads\//, '');
            }
            return raw;
        };
        AdminService_1.prototype.resolveBannerImagePath = function (imageUrl) {
            var raw = String(imageUrl !== null && imageUrl !== void 0 ? imageUrl : '').trim();
            if (!raw)
                return '';
            if (raw.startsWith('/uploads/')) {
                return raw.replace(/^\/uploads\//, '');
            }
            if (raw.startsWith('uploads/')) {
                return raw.replace(/^uploads\//, '');
            }
            return raw;
        };
        AdminService_1.prototype.resolveBannerImageForResponse = function (imageUrl, bannerImage) {
            var imageRaw = String(imageUrl !== null && imageUrl !== void 0 ? imageUrl : '').trim();
            if (imageRaw && /^https?:\/\//i.test(imageRaw))
                return imageRaw;
            var candidate = imageRaw || (bannerImage ? "/uploads/".concat(bannerImage) : '');
            var normalized = String(candidate).trim();
            if (!normalized)
                return '';
            return normalized;
        };
        /** How the banner image was stored: multipart upload vs URL/path in form. */
        AdminService_1.prototype.resolveBannerImageSource = function (stored) {
            return stored === 'binary_upload' ? 'binary_upload' : 'manual_url';
        };
        AdminService_1.prototype.resolveBannerVideoPath = function (videoUrl) {
            return this.resolveBannerImagePath(videoUrl);
        };
        AdminService_1.prototype.resolveBannerVideoForResponse = function (videoUrl, bannerVideo) {
            var videoRaw = String(videoUrl !== null && videoUrl !== void 0 ? videoUrl : '').trim();
            if (videoRaw && /^https?:\/\//i.test(videoRaw))
                return videoRaw;
            var candidate = videoRaw || (bannerVideo ? "/uploads/".concat(bannerVideo) : '');
            return String(candidate).trim();
        };
        AdminService_1.prototype.resolveBannerVideoSource = function (stored) {
            return stored === 'binary_upload' ? 'binary_upload' : undefined;
        };
        AdminService_1.prototype.mapBannerRowForResponse = function (b, index) {
            var _a, _b;
            var st = (_a = b.status) !== null && _a !== void 0 ? _a : 1;
            return __assign(__assign({}, (index != null ? { s_no: index + 1 } : {})), { id: String(b._id), imageUrl: this.resolveBannerImageForResponse(b.imageUrl, b.banner_image), imageSource: this.resolveBannerImageSource(b.imageSource), videoUrl: this.resolveBannerVideoForResponse(b.videoUrl, b.banner_video), videoSource: this.resolveBannerVideoSource(b.videoSource), heading: b.heading, title: b.heading, sequenceNumber: Number((_b = b.sequenceNumber) !== null && _b !== void 0 ? _b : 1), description: b.description, status: st === 1 ? 'active' : 'inactive', is_active: st === 1 });
        };
        AdminService_1.prototype.resolveArticleImagePath = function (imageUrl) {
            var raw = String(imageUrl !== null && imageUrl !== void 0 ? imageUrl : '').trim();
            if (!raw)
                return '';
            // Preserve absolute S3/CloudFront URLs as-is and keep local upload paths stable.
            if (raw.startsWith('/uploads/'))
                return raw;
            if (raw.startsWith('uploads/'))
                return "/".concat(raw);
            return raw;
        };
        AdminService_1.prototype.resolveArticlePdfPath = function (pdfUrl) {
            var raw = String(pdfUrl !== null && pdfUrl !== void 0 ? pdfUrl : '').trim();
            if (!raw)
                return '';
            if (raw.startsWith('/uploads/'))
                return raw;
            if (raw.startsWith('uploads/'))
                return "/".concat(raw);
            return raw;
        };
        AdminService_1.prototype.resolveArticleAssetForResponse = function (rawUrl) {
            var raw = String(rawUrl !== null && rawUrl !== void 0 ? rawUrl : '').trim();
            if (!raw)
                return '';
            if (/^https?:\/\//i.test(raw))
                return raw;
            if (raw.startsWith('/uploads/'))
                return raw;
            if (raw.startsWith('uploads/'))
                return "/".concat(raw);
            if (raw.startsWith('/'))
                return raw;
            return "/uploads/".concat(raw.replace(/^\/+/, ''));
        };
        AdminService_1.prototype.createNotification = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.adminSystemNotification.createFeedNotification(__assign(__assign({}, input), { source: (_a = input.source) !== null && _a !== void 0 ? _a : 'admin' }))];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AdminService_1.prototype.nextEventId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var doc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.eventCounterModel
                                .findOneAndUpdate({ _id: event_id_counter_schema_1.EVENT_ID_COUNTER_KEY }, { $inc: { seq: 1 } }, { new: true, upsert: true })
                                .exec()];
                        case 1:
                            doc = _a.sent();
                            if (!doc || typeof doc.seq !== 'number' || !Number.isFinite(doc.seq)) {
                                throw new Error('Failed to allocate event id');
                            }
                            return [2 /*return*/, doc.seq];
                    }
                });
            });
        };
        AdminService_1.prototype.formatEventResponse = function (event) {
            var _a, _b;
            if (!event)
                return event;
            var obj = typeof event.toObject === 'function' ? event.toObject() : event;
            var id = (obj === null || obj === void 0 ? void 0 : obj._id)
                ? String(obj._id)
                : (obj === null || obj === void 0 ? void 0 : obj.id)
                    ? String(obj.id)
                    : undefined;
            var _c = obj !== null && obj !== void 0 ? obj : {}, _id = _c._id, __v = _c.__v, storedRegistrationLink = _c.registrationLink, rest = __rest(_c, ["_id", "__v", "registrationLink"]);
            var registrationLink = resolveOptionalEventUrl(storedRegistrationLink);
            var startDate = (0, event_date_util_1.resolveEventStartDate)(rest !== null && rest !== void 0 ? rest : {});
            var endDate = (0, event_date_util_1.resolveEventEndDate)(rest !== null && rest !== void 0 ? rest : {});
            var datePart = startDate ? (0, event_date_util_1.toDateOnlyIso)(startDate) : '';
            var endDatePart = endDate ? (0, event_date_util_1.toDateOnlyIso)(endDate) : datePart;
            var brochures = (0, event_brochures_util_1.mapEventBrochuresFromDoc)(rest !== null && rest !== void 0 ? rest : {});
            var brochureLink = (0, event_brochures_util_1.primaryEventBrochureLink)(brochures) ||
                String((_a = rest === null || rest === void 0 ? void 0 : rest.brochureLink) !== null && _a !== void 0 ? _a : '').trim() ||
                DEFAULT_EVENT_BROCHURE_LINK;
            return __assign(__assign(__assign(__assign(__assign({}, rest), { eventDate: datePart || (rest === null || rest === void 0 ? void 0 : rest.eventDate), eventStartDate: datePart, eventEndDate: endDatePart, is_active: (0, event_date_util_1.isEventVisibleOnWebsite)(rest !== null && rest !== void 0 ? rest : {}), galleryImages: Array.isArray(rest === null || rest === void 0 ? void 0 : rest.galleryImages)
                    ? rest.galleryImages
                    : (rest === null || rest === void 0 ? void 0 : rest.eventImage)
                        ? [rest.eventImage]
                        : [], event_image: (_b = rest === null || rest === void 0 ? void 0 : rest.event_image) !== null && _b !== void 0 ? _b : this.resolveEventImagePath(rest === null || rest === void 0 ? void 0 : rest.eventImage) }), (registrationLink ? { registrationLink: registrationLink } : {})), { brochures: brochures, brochureLink: brochureLink }), (id ? { id: id } : {}));
        };
        AdminService_1.prototype.eventKindMatch = function (kind) {
            if (kind === 'gallery') {
                return {
                    galleryType: { $exists: true, $nin: [null, ''] },
                };
            }
            return {
                $or: [
                    { galleryType: { $exists: false } },
                    { galleryType: null },
                    { galleryType: '' },
                ],
            };
        };
        AdminService_1.prototype.parseEventIdentifier = function (identifier) {
            var raw = String(identifier !== null && identifier !== void 0 ? identifier : '').trim();
            if (!raw)
                throw new common_1.BadRequestException('Event id is required');
            if (mongoose_1.Types.ObjectId.isValid(raw)) {
                return { where: { _id: new mongoose_1.Types.ObjectId(raw) } };
            }
            var asNumber = Number.parseInt(raw, 10);
            if (!Number.isFinite(asNumber) || asNumber <= 0) {
                throw new common_1.BadRequestException('Invalid event id (expected Mongo _id or numeric eventId)');
            }
            return { where: { eventId: asNumber } };
        };
        AdminService_1.prototype.createEvent = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var eventId, now, eventStartDate, eventEndDate, brochures, brochureLink, doc, saved;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, this.nextEventId()];
                        case 1:
                            eventId = _e.sent();
                            now = new Date();
                            eventStartDate = (_a = payload.eventStartDate) !== null && _a !== void 0 ? _a : payload.eventDate;
                            eventEndDate = (_b = payload.eventEndDate) !== null && _b !== void 0 ? _b : eventStartDate;
                            brochures = (_c = payload.brochures) !== null && _c !== void 0 ? _c : [];
                            brochureLink = (_d = (0, event_brochures_util_1.primaryEventBrochureLink)(brochures)) !== null && _d !== void 0 ? _d : payload.brochureLink;
                            doc = new this.eventModel({
                                eventId: eventId,
                                eventName: payload.eventName,
                                eventImage: payload.eventImage,
                                event_image: this.resolveEventImagePath(payload.eventImage),
                                galleryImages: Array.isArray(payload.galleryImages) && payload.galleryImages.length
                                    ? payload.galleryImages
                                    : payload.eventImage
                                        ? [payload.eventImage]
                                        : [],
                                galleryType: payload.galleryType,
                                eventDescription: payload.eventDescription,
                                eventDate: eventStartDate,
                                eventStartDate: eventStartDate,
                                eventEndDate: eventEndDate,
                                eventStartTime: payload.eventStartTime,
                                eventEndTime: payload.eventEndTime,
                                eventLocation: payload.eventLocation,
                                contactPersonName: payload.contactPersonName,
                                contactPersonDesignation: payload.contactPersonDesignation,
                                contactPersonEmail: payload.contactPersonEmail,
                                contactPersonPhone: payload.contactPersonPhone,
                                registrationLink: payload.registrationLink,
                                brochures: brochures,
                                brochureLink: brochureLink,
                                eventStatus: payload.eventStatus === 0 || payload.eventStatus === 1
                                    ? payload.eventStatus
                                    : 1,
                                createdDate: now,
                                updatedDate: now,
                            });
                            return [4 /*yield*/, doc.save()];
                        case 2:
                            saved = _e.sent();
                            return [2 /*return*/, this.formatEventResponse(saved)];
                    }
                });
            });
        };
        AdminService_1.prototype.updateEvent = function (identifier_1, payload_1) {
            return __awaiter(this, arguments, void 0, function (identifier, payload, kind) {
                var where, $set, first, registrationLink, primaryBrochure, updated;
                if (kind === void 0) { kind = 'event'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            where = this.parseEventIdentifier(identifier).where;
                            $set = { updatedDate: new Date() };
                            if (payload.eventName !== undefined &&
                                String(payload.eventName).trim() !== '')
                                $set.eventName = payload.eventName;
                            if (payload.eventStartDate !== undefined) {
                                $set.eventStartDate = payload.eventStartDate;
                                $set.eventDate = payload.eventStartDate;
                            }
                            else if (payload.eventDate !== undefined) {
                                $set.eventDate = payload.eventDate;
                                $set.eventStartDate = payload.eventDate;
                            }
                            if (payload.eventEndDate !== undefined) {
                                $set.eventEndDate = payload.eventEndDate;
                            }
                            if (payload.eventStartTime !== undefined &&
                                String(payload.eventStartTime).trim() !== '')
                                $set.eventStartTime = payload.eventStartTime;
                            if (payload.eventEndTime !== undefined &&
                                String(payload.eventEndTime).trim() !== '')
                                $set.eventEndTime = payload.eventEndTime;
                            if (payload.eventLocation !== undefined &&
                                String(payload.eventLocation).trim() !== '')
                                $set.eventLocation = payload.eventLocation;
                            if (payload.eventDescription !== undefined &&
                                String(payload.eventDescription).trim() !== '')
                                $set.eventDescription = payload.eventDescription;
                            if (payload.contactPersonName !== undefined &&
                                String(payload.contactPersonName).trim() !== '')
                                $set.contactPersonName = payload.contactPersonName;
                            if (payload.contactPersonDesignation !== undefined &&
                                String(payload.contactPersonDesignation).trim() !== '')
                                $set.contactPersonDesignation = payload.contactPersonDesignation;
                            if (payload.contactPersonEmail !== undefined &&
                                String(payload.contactPersonEmail).trim() !== '')
                                $set.contactPersonEmail = payload.contactPersonEmail;
                            if (payload.contactPersonPhone !== undefined &&
                                String(payload.contactPersonPhone).trim() !== '')
                                $set.contactPersonPhone = payload.contactPersonPhone;
                            if (payload.eventImage !== undefined) {
                                $set.eventImage = payload.eventImage;
                                $set.event_image = this.resolveEventImagePath(payload.eventImage);
                            }
                            if (payload.galleryImages !== undefined) {
                                $set.galleryImages = Array.isArray(payload.galleryImages)
                                    ? payload.galleryImages
                                    : [];
                                first = Array.isArray(payload.galleryImages)
                                    ? payload.galleryImages[0]
                                    : undefined;
                                if (first) {
                                    $set.eventImage = first;
                                    $set.event_image = this.resolveEventImagePath(first);
                                }
                            }
                            if (payload.galleryType !== undefined &&
                                String(payload.galleryType).trim() !== '') {
                                $set.galleryType = payload.galleryType;
                            }
                            if (payload.registrationLink !== undefined) {
                                registrationLink = resolveOptionalEventUrl(payload.registrationLink);
                                if (registrationLink) {
                                    $set.registrationLink = registrationLink;
                                }
                                else {
                                    $set.registrationLink = '';
                                }
                            }
                            if (payload.brochures !== undefined) {
                                $set.brochures = payload.brochures;
                                primaryBrochure = (0, event_brochures_util_1.primaryEventBrochureLink)(payload.brochures);
                                $set.brochureLink = primaryBrochure !== null && primaryBrochure !== void 0 ? primaryBrochure : '';
                            }
                            else if (payload.brochureLink !== undefined &&
                                String(payload.brochureLink).trim() !== '') {
                                $set.brochureLink = payload.brochureLink;
                            }
                            if (payload.eventStatus === 0 || payload.eventStatus === 1) {
                                $set.eventStatus = payload.eventStatus;
                            }
                            return [4 /*yield*/, this.eventModel
                                    .findOneAndUpdate(__assign(__assign({}, where), this.eventKindMatch(kind)), { $set: $set }, { new: true })
                                    .lean()
                                    .exec()];
                        case 1:
                            updated = _a.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Event not found');
                            }
                            return [2 /*return*/, this.formatEventResponse(updated)];
                    }
                });
            });
        };
        AdminService_1.prototype.listEvents = function () {
            return __awaiter(this, arguments, void 0, function (kind) {
                var rows;
                var _this = this;
                if (kind === void 0) { kind = 'event'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.eventModel
                                .find(this.eventKindMatch(kind))
                                .sort({ createdDate: -1, _id: -1 })
                                .select('eventName eventDescription eventImage event_image galleryImages galleryType eventDate eventStartDate eventEndDate eventStartTime eventEndTime eventLocation eventStatus createdDate updatedDate eventId registrationLink brochureLink brochures')
                                .lean()
                                .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, (rows !== null && rows !== void 0 ? rows : []).map(function (e, idx) {
                                    return _this.mapEventListRow(e, idx + 1);
                                })];
                    }
                });
            });
        };
        AdminService_1.prototype.listEventsPaginated = function () {
            return __awaiter(this, arguments, void 0, function (page, perPage, options) {
                var safePage, safePerPage, where, _a, total, rows, totalPages, data;
                var _this = this;
                if (page === void 0) { page = 1; }
                if (perPage === void 0) { perPage = 10; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
                            safePerPage = Number.isFinite(perPage) && perPage > 0 ? Math.floor(perPage) : 10;
                            where = __assign({}, this.eventKindMatch('event'));
                            if (options === null || options === void 0 ? void 0 : options.activeOnly) {
                                Object.assign(where, (0, event_date_util_1.buildWebsiteVisibleEventsMatch)());
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.eventModel.countDocuments(where).exec(),
                                    this.eventModel
                                        .find(where)
                                        .sort({ eventDate: -1, createdDate: -1, _id: -1 })
                                        .skip((safePage - 1) * safePerPage)
                                        .limit(safePerPage)
                                        .select('eventName eventDescription eventImage event_image galleryImages galleryType eventDate eventStartDate eventEndDate eventStartTime eventEndTime eventLocation eventStatus createdDate updatedDate eventId registrationLink brochureLink brochures')
                                        .lean()
                                        .exec(),
                                ])];
                        case 1:
                            _a = _b.sent(), total = _a[0], rows = _a[1];
                            totalPages = total > 0 ? Math.ceil(total / safePerPage) : 0;
                            data = (rows !== null && rows !== void 0 ? rows : []).map(function (e, idx) {
                                return _this.mapEventListRow(e, (safePage - 1) * safePerPage + idx + 1);
                            });
                            return [2 /*return*/, {
                                    data: data,
                                    pagination: {
                                        page: safePage,
                                        limit: safePerPage,
                                        perPage: safePerPage,
                                        total: total,
                                        totalPages: totalPages,
                                    },
                                }];
                    }
                });
            });
        };
        AdminService_1.prototype.mapEventListRow = function (e, serialNo) {
            var _a, _b, _c, _d, _e, _f, _g;
            var startDate = (0, event_date_util_1.resolveEventStartDate)(e !== null && e !== void 0 ? e : {});
            var endDate = (0, event_date_util_1.resolveEventEndDate)(e !== null && e !== void 0 ? e : {});
            var datePart = startDate ? (0, event_date_util_1.toDateOnlyIso)(startDate) : '';
            var endDatePart = endDate ? (0, event_date_util_1.toDateOnlyIso)(endDate) : datePart;
            var timePart = String((_a = e === null || e === void 0 ? void 0 : e.eventStartTime) !== null && _a !== void 0 ? _a : '').trim();
            var visible = (0, event_date_util_1.isEventVisibleOnWebsite)(e !== null && e !== void 0 ? e : {});
            var brochures = (0, event_brochures_util_1.mapEventBrochuresFromDoc)(e !== null && e !== void 0 ? e : {});
            var registrationLink = resolveOptionalEventUrl(e === null || e === void 0 ? void 0 : e.registrationLink);
            return __assign(__assign({ s_no: serialNo, id: String(e._id), eventId: typeof e.eventId === 'number' ? e.eventId : undefined, image: (_b = e.eventImage) !== null && _b !== void 0 ? _b : null, galleryImages: Array.isArray(e.galleryImages)
                    ? e.galleryImages
                    : e.eventImage
                        ? [e.eventImage]
                        : [], event_image: (_c = e.event_image) !== null && _c !== void 0 ? _c : this.resolveEventImagePath(e.eventImage), eventName: String((_d = e.eventName) !== null && _d !== void 0 ? _d : ''), eventDescription: String((_e = e.eventDescription) !== null && _e !== void 0 ? _e : ''), galleryType: (_f = e.galleryType) !== null && _f !== void 0 ? _f : '', date: datePart, eventDate: datePart, eventStartDate: datePart, eventEndDate: endDatePart, dateTime: [datePart, timePart].filter(Boolean).join(' '), location: String((_g = e.eventLocation) !== null && _g !== void 0 ? _g : ''), is_active: visible }, (registrationLink ? { registrationLink: registrationLink } : {})), { brochures: brochures, brochureLink: (0, event_brochures_util_1.primaryEventBrochureLink)(brochures) ||
                    e.brochureLink ||
                    DEFAULT_EVENT_BROCHURE_LINK });
        };
        AdminService_1.prototype.listGalleryPaginated = function () {
            return __awaiter(this, arguments, void 0, function (page, perPage, options) {
                var safePage, safePerPage, where, _a, total, rows, totalPages, data;
                var _this = this;
                if (page === void 0) { page = 1; }
                if (perPage === void 0) { perPage = 50; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
                            safePerPage = Number.isFinite(perPage) && perPage > 0 ? Math.floor(perPage) : 50;
                            where = __assign({}, this.eventKindMatch('gallery'));
                            if (options === null || options === void 0 ? void 0 : options.activeOnly) {
                                Object.assign(where, (0, event_date_util_1.buildWebsiteVisibleEventsMatch)());
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.eventModel.countDocuments(where).exec(),
                                    this.eventModel
                                        .find(where)
                                        .sort({ createdDate: -1, _id: -1 })
                                        .skip((safePage - 1) * safePerPage)
                                        .limit(safePerPage)
                                        .select('eventName eventDescription eventImage event_image galleryImages galleryType eventDate eventStartTime eventLocation eventStatus createdDate updatedDate eventId registrationLink brochureLink')
                                        .lean()
                                        .exec(),
                                ])];
                        case 1:
                            _a = _b.sent(), total = _a[0], rows = _a[1];
                            totalPages = total > 0 ? Math.ceil(total / safePerPage) : 0;
                            data = (rows !== null && rows !== void 0 ? rows : []).map(function (e, idx) {
                                return _this.mapEventListRow(e, (safePage - 1) * safePerPage + idx + 1);
                            });
                            return [2 /*return*/, {
                                    data: data,
                                    pagination: {
                                        page: safePage,
                                        perPage: safePerPage,
                                        total: total,
                                        totalPages: totalPages,
                                    },
                                }];
                    }
                });
            });
        };
        AdminService_1.prototype.getEventById = function (identifier_1) {
            return __awaiter(this, arguments, void 0, function (identifier, kind) {
                var where, event;
                if (kind === void 0) { kind = 'event'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            where = this.parseEventIdentifier(identifier).where;
                            return [4 /*yield*/, this.eventModel
                                    .findOne(__assign(__assign({}, where), this.eventKindMatch(kind)))
                                    .lean()
                                    .exec()];
                        case 1:
                            event = _a.sent();
                            if (!event) {
                                throw new common_1.NotFoundException('Event not found');
                            }
                            return [2 /*return*/, this.formatEventResponse(event)];
                    }
                });
            });
        };
        AdminService_1.prototype.deleteEvent = function (identifier_1) {
            return __awaiter(this, arguments, void 0, function (identifier, kind) {
                var where, res;
                if (kind === void 0) { kind = 'event'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            where = this.parseEventIdentifier(identifier).where;
                            return [4 /*yield*/, this.eventModel
                                    .deleteOne(__assign(__assign({}, where), this.eventKindMatch(kind)))
                                    .exec()];
                        case 1:
                            res = _a.sent();
                            if (!res || res.deletedCount === 0) {
                                throw new common_1.NotFoundException('Event not found');
                            }
                            return [2 /*return*/, { id: String(identifier !== null && identifier !== void 0 ? identifier : '').trim() }];
                    }
                });
            });
        };
        AdminService_1.prototype.setOrToggleEventStatus = function (identifier_1, status_1) {
            return __awaiter(this, arguments, void 0, function (identifier, status, kind) {
                var where, scopedWhere, nextStatus, current, cur, updated;
                if (kind === void 0) { kind = 'event'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            where = this.parseEventIdentifier(identifier).where;
                            scopedWhere = __assign(__assign({}, where), this.eventKindMatch(kind));
                            if (!(status === 0 || status === 1)) return [3 /*break*/, 1];
                            nextStatus = status;
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, this.eventModel
                                .findOne(scopedWhere)
                                .select('eventStatus')
                                .lean()
                                .exec()];
                        case 2:
                            current = _a.sent();
                            if (!current) {
                                throw new common_1.NotFoundException('Event not found');
                            }
                            cur = Number(current.eventStatus) === 1 ? 1 : 0;
                            nextStatus = cur === 1 ? 0 : 1;
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.eventModel
                                .findOneAndUpdate(scopedWhere, { $set: { eventStatus: nextStatus, updatedDate: new Date() } }, { new: true })
                                .select('_id eventId eventStatus')
                                .lean()
                                .exec()];
                        case 4:
                            updated = _a.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Event not found');
                            }
                            return [2 /*return*/, {
                                    id: String(updated._id),
                                    eventId: updated.eventId,
                                    status: Number(updated.eventStatus) === 1 ? 'active' : 'inactive',
                                    is_active: Number(updated.eventStatus) === 1,
                                }];
                    }
                });
            });
        };
        AdminService_1.prototype.createArticle = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var externalUrl, description, shortDescription, url, doc, saved;
                var _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            externalUrl = payload.externalUrl === true;
                            description = String((_a = payload.description) !== null && _a !== void 0 ? _a : '').trim();
                            shortDescription = String((_b = payload.shortDescription) !== null && _b !== void 0 ? _b : '').trim();
                            url = String((_c = payload.url) !== null && _c !== void 0 ? _c : '').trim();
                            if (externalUrl) {
                                if (!url) {
                                    throw new common_1.BadRequestException('url is required when externalUrl is true');
                                }
                                if (!shortDescription) {
                                    throw new common_1.BadRequestException('shortDescription is required when externalUrl is true');
                                }
                            }
                            else if (!description) {
                                throw new common_1.BadRequestException('description is required');
                            }
                            doc = new this.articleModel({
                                title: String((_d = payload.title) !== null && _d !== void 0 ? _d : '').trim(),
                                description: externalUrl ? '' : description,
                                shortDescription: externalUrl ? shortDescription : '',
                                date: payload.date,
                                image: payload.image,
                                article_image: this.resolveArticleImagePath(payload.image),
                                url: externalUrl ? url : '',
                                externalUrl: externalUrl,
                                pdf: payload.pdf,
                                article_pdf: this.resolveArticlePdfPath(payload.pdf),
                                status: payload.status === 0 || payload.status === 1 ? payload.status : 1,
                            });
                            return [4 /*yield*/, doc.save()];
                        case 1:
                            saved = _f.sent();
                            return [4 /*yield*/, this.createNotification({
                                    title: 'Article created',
                                    message: "Article \"".concat(String((_e = saved.title) !== null && _e !== void 0 ? _e : ''), "\" was created."),
                                    type: 'success',
                                    source: 'admin',
                                    referenceType: 'article',
                                    referenceId: String(saved._id),
                                    skipEmail: true,
                                })];
                        case 2:
                            _f.sent();
                            return [2 /*return*/, saved.toObject()];
                    }
                });
            });
        };
        AdminService_1.prototype.updateArticle = function (id, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var objectId, $set, current, nextExternalUrl, nextDescription, nextShortDescription, nextUrl, updated;
                var _a, _b, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            try {
                                objectId = new mongoose_1.Types.ObjectId(id);
                            }
                            catch (_j) {
                                throw new common_1.BadRequestException('Invalid article id');
                            }
                            $set = {};
                            if (payload.title !== undefined)
                                $set.title = String(payload.title).trim();
                            if (payload.description !== undefined)
                                $set.description = String(payload.description).trim();
                            if (payload.shortDescription !== undefined) {
                                $set.shortDescription = String(payload.shortDescription).trim();
                            }
                            if (payload.date !== undefined)
                                $set.date = payload.date;
                            if (payload.image !== undefined) {
                                $set.image = payload.image;
                                $set.article_image = this.resolveArticleImagePath(payload.image);
                            }
                            if (payload.url !== undefined)
                                $set.url = String(payload.url).trim();
                            if (payload.externalUrl !== undefined)
                                $set.externalUrl = payload.externalUrl === true;
                            if (payload.pdf !== undefined) {
                                $set.pdf = payload.pdf;
                                $set.article_pdf = this.resolveArticlePdfPath(payload.pdf);
                            }
                            if (payload.status === 0 || payload.status === 1)
                                $set.status = payload.status;
                            if (Object.keys($set).length === 0) {
                                throw new common_1.BadRequestException('No fields to update');
                            }
                            return [4 /*yield*/, this.articleModel.findById(objectId).lean().exec()];
                        case 1:
                            current = _h.sent();
                            if (!current)
                                throw new common_1.NotFoundException('Article not found');
                            nextExternalUrl = payload.externalUrl !== undefined
                                ? payload.externalUrl === true
                                : payload.url !== undefined &&
                                    payload.description === undefined &&
                                    payload.shortDescription !== undefined
                                    ? true
                                    : payload.description !== undefined && payload.url === undefined
                                        ? false
                                        : payload.shortDescription !== undefined &&
                                            payload.description === undefined
                                            ? true
                                            : current.externalUrl === true;
                            nextDescription = payload.description !== undefined
                                ? String((_a = payload.description) !== null && _a !== void 0 ? _a : '').trim()
                                : String((_b = current.description) !== null && _b !== void 0 ? _b : '').trim();
                            nextShortDescription = payload.shortDescription !== undefined
                                ? String((_c = payload.shortDescription) !== null && _c !== void 0 ? _c : '').trim()
                                : String((_d = current.shortDescription) !== null && _d !== void 0 ? _d : '').trim();
                            nextUrl = payload.url !== undefined
                                ? String((_e = payload.url) !== null && _e !== void 0 ? _e : '').trim()
                                : String((_f = current.url) !== null && _f !== void 0 ? _f : '').trim();
                            if (nextExternalUrl) {
                                if (!nextUrl) {
                                    throw new common_1.BadRequestException('url is required when externalUrl is true');
                                }
                                if (!nextShortDescription) {
                                    throw new common_1.BadRequestException('shortDescription is required when externalUrl is true');
                                }
                                $set.shortDescription = nextShortDescription;
                                $set.description = '';
                                $set.url = nextUrl;
                                $set.externalUrl = true;
                            }
                            else {
                                if (!nextDescription) {
                                    throw new common_1.BadRequestException('description is required');
                                }
                                $set.shortDescription = '';
                                $set.url = '';
                                $set.description = nextDescription;
                                $set.externalUrl = false;
                            }
                            return [4 /*yield*/, this.articleModel
                                    .findByIdAndUpdate(objectId, { $set: $set }, { new: true })
                                    .lean()
                                    .exec()];
                        case 2:
                            updated = _h.sent();
                            if (!updated)
                                throw new common_1.NotFoundException('Article not found');
                            return [4 /*yield*/, this.createNotification({
                                    title: 'Article updated',
                                    message: "Article \"".concat(String((_g = updated.title) !== null && _g !== void 0 ? _g : ''), "\" was updated."),
                                    type: 'info',
                                    source: 'admin',
                                    referenceType: 'article',
                                    referenceId: String(updated._id),
                                    skipEmail: true,
                                })];
                        case 3:
                            _h.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        AdminService_1.prototype.resolveArticleShortDescription = function (a) {
            var _a, _b;
            var shortDescription = String((_a = a === null || a === void 0 ? void 0 : a.shortDescription) !== null && _a !== void 0 ? _a : '').trim();
            if (shortDescription)
                return shortDescription;
            if ((a === null || a === void 0 ? void 0 : a.externalUrl) === true) {
                return String((_b = a === null || a === void 0 ? void 0 : a.description) !== null && _b !== void 0 ? _b : '').trim();
            }
            return '';
        };
        AdminService_1.prototype.mapArticleListRow = function (a, serialNo) {
            var _a, _b, _c, _d, _e;
            return {
                s_no: serialNo,
                id: String(a._id),
                title: String((_a = a.title) !== null && _a !== void 0 ? _a : ''),
                description: String((_b = a.description) !== null && _b !== void 0 ? _b : ''),
                shortDescription: this.resolveArticleShortDescription(a),
                date: (a === null || a === void 0 ? void 0 : a.date) instanceof Date
                    ? a.date.toISOString().slice(0, 10)
                    : (a === null || a === void 0 ? void 0 : a.date)
                        ? new Date(a.date).toISOString().slice(0, 10)
                        : '',
                image: this.resolveArticleAssetForResponse(a.image) || null,
                article_image: this.resolveArticleAssetForResponse((_c = a.article_image) !== null && _c !== void 0 ? _c : this.resolveArticleImagePath(a.image)),
                url: String((_d = a.url) !== null && _d !== void 0 ? _d : ''),
                externalUrl: a.externalUrl === true,
                pdf: this.resolveArticleAssetForResponse(a.pdf) || null,
                article_pdf: this.resolveArticleAssetForResponse((_e = a.article_pdf) !== null && _e !== void 0 ? _e : this.resolveArticlePdfPath(a.pdf)),
                is_active: Number(a.status) === 1,
            };
        };
        AdminService_1.prototype.listArticles = function () {
            return __awaiter(this, void 0, void 0, function () {
                var rows;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.articleModel
                                .find({})
                                .sort({ createdAt: -1, _id: -1 })
                                .select('title description shortDescription date image article_image url externalUrl pdf article_pdf status')
                                .lean()
                                .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, (rows !== null && rows !== void 0 ? rows : []).map(function (a, idx) { return _this.mapArticleListRow(a, idx + 1); })];
                    }
                });
            });
        };
        AdminService_1.prototype.listArticlesPaginated = function () {
            return __awaiter(this, arguments, void 0, function (page, perPage, options) {
                var safePage, safePerPage, where, _a, total, rows, totalPages, data;
                var _this = this;
                if (page === void 0) { page = 1; }
                if (perPage === void 0) { perPage = 12; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
                            safePerPage = Number.isFinite(perPage) && perPage > 0 ? Math.floor(perPage) : 12;
                            where = {};
                            if (options === null || options === void 0 ? void 0 : options.activeOnly) {
                                where.status = 1;
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.articleModel.countDocuments(where).exec(),
                                    this.articleModel
                                        .find(where)
                                        .sort({ createdAt: -1, _id: -1 })
                                        .skip((safePage - 1) * safePerPage)
                                        .limit(safePerPage)
                                        .select('title description shortDescription date image article_image url externalUrl pdf article_pdf status')
                                        .lean()
                                        .exec(),
                                ])];
                        case 1:
                            _a = _b.sent(), total = _a[0], rows = _a[1];
                            totalPages = total > 0 ? Math.ceil(total / safePerPage) : 0;
                            data = (rows !== null && rows !== void 0 ? rows : []).map(function (a, idx) {
                                return _this.mapArticleListRow(a, (safePage - 1) * safePerPage + idx + 1);
                            });
                            return [2 /*return*/, {
                                    data: data,
                                    pagination: {
                                        page: safePage,
                                        limit: safePerPage,
                                        perPage: safePerPage,
                                        total: total,
                                        totalPages: totalPages,
                                    },
                                }];
                    }
                });
            });
        };
        AdminService_1.prototype.getArticleById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var objectId, article;
                var _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            try {
                                objectId = new mongoose_1.Types.ObjectId(id);
                            }
                            catch (_g) {
                                throw new common_1.BadRequestException('Invalid article id');
                            }
                            return [4 /*yield*/, this.articleModel.findById(objectId).lean().exec()];
                        case 1:
                            article = _f.sent();
                            if (!article)
                                throw new common_1.NotFoundException('Article not found');
                            return [2 /*return*/, {
                                    id: String(article._id),
                                    title: String((_a = article.title) !== null && _a !== void 0 ? _a : ''),
                                    description: String((_b = article.description) !== null && _b !== void 0 ? _b : ''),
                                    shortDescription: this.resolveArticleShortDescription(article),
                                    date: (article === null || article === void 0 ? void 0 : article.date) instanceof Date
                                        ? article.date.toISOString().slice(0, 10)
                                        : (article === null || article === void 0 ? void 0 : article.date)
                                            ? new Date(article.date).toISOString().slice(0, 10)
                                            : '',
                                    image: this.resolveArticleAssetForResponse(article.image) || null,
                                    article_image: this.resolveArticleAssetForResponse((_c = article.article_image) !== null && _c !== void 0 ? _c : this.resolveArticleImagePath(article.image)),
                                    url: article.externalUrl === true
                                        ? String((_d = article.url) !== null && _d !== void 0 ? _d : '')
                                        : '',
                                    externalUrl: article.externalUrl === true,
                                    pdf: this.resolveArticleAssetForResponse(article.pdf) || null,
                                    article_pdf: this.resolveArticleAssetForResponse((_e = article.article_pdf) !== null && _e !== void 0 ? _e : this.resolveArticlePdfPath(article.pdf)),
                                    is_active: Number(article.status) === 1,
                                }];
                    }
                });
            });
        };
        AdminService_1.prototype.setOrToggleArticleStatus = function (id, status) {
            return __awaiter(this, void 0, void 0, function () {
                var objectId, nextStatus, current, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            try {
                                objectId = new mongoose_1.Types.ObjectId(id);
                            }
                            catch (_b) {
                                throw new common_1.BadRequestException('Invalid article id');
                            }
                            if (!(status === 0 || status === 1)) return [3 /*break*/, 1];
                            nextStatus = status;
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, this.articleModel
                                .findById(objectId)
                                .select('status')
                                .lean()
                                .exec()];
                        case 2:
                            current = _a.sent();
                            if (!current)
                                throw new common_1.NotFoundException('Article not found');
                            nextStatus = Number(current.status) === 1 ? 0 : 1;
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.articleModel
                                .findByIdAndUpdate(objectId, { $set: { status: nextStatus } }, { new: true })
                                .lean()
                                .exec()];
                        case 4:
                            updated = _a.sent();
                            if (!updated)
                                throw new common_1.NotFoundException('Article not found');
                            return [2 /*return*/, {
                                    id: String(updated._id),
                                    status: Number(updated.status) === 1 ? 'active' : 'inactive',
                                    is_active: Number(updated.status) === 1,
                                }];
                    }
                });
            });
        };
        AdminService_1.prototype.deleteArticle = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var objectId, existing, res;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            try {
                                objectId = new mongoose_1.Types.ObjectId(id);
                            }
                            catch (_c) {
                                throw new common_1.BadRequestException('Invalid article id');
                            }
                            return [4 /*yield*/, this.articleModel
                                    .findById(objectId)
                                    .select('title')
                                    .lean()
                                    .exec()];
                        case 1:
                            existing = _b.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException('Article not found');
                            }
                            return [4 /*yield*/, this.articleModel.deleteOne({ _id: objectId }).exec()];
                        case 2:
                            res = _b.sent();
                            if (!res || res.deletedCount === 0) {
                                throw new common_1.NotFoundException('Article not found');
                            }
                            return [4 /*yield*/, this.createNotification({
                                    title: 'Article deleted',
                                    message: "Article \"".concat(String((_a = existing.title) !== null && _a !== void 0 ? _a : ''), "\" was deleted."),
                                    type: 'warning',
                                    source: 'admin',
                                    referenceType: 'article',
                                    referenceId: id,
                                    skipEmail: true,
                                })];
                        case 3:
                            _b.sent();
                            return [2 /*return*/, { id: id }];
                    }
                });
            });
        };
        AdminService_1.prototype.replyToCustomerViaManufacturer = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var brand, subject, cleanReply, htmlBody, textBody;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    brand = 'GreenPro';
                    subject = "Reply from ".concat(brand);
                    cleanReply = String((_a = payload.replyMessage) !== null && _a !== void 0 ? _a : '').trim();
                    htmlBody = "\n      <p>Hello,</p>\n      <p>Please find our response below.</p>\n      <div style=\"white-space:pre-wrap; margin:0 0 16px 0; background:#f9fafb; padding:14px; border-radius:8px; border:1px solid #e5e7eb;\">".concat(escapeHtml(cleanReply), "</div>\n      <p>Regards,<br />").concat(brand, " Support Team</p>\n    ");
                    textBody = "Hello,\n\nPlease find our response below.\n\n".concat(cleanReply, "\n\nRegards,\n").concat(brand, " Support Team");
                    this.emailService.sendInBackground(function () {
                        return _this.emailService.sendEmail(payload.email, subject, htmlBody, textBody);
                    });
                    return [2 /*return*/, { to: payload.email, subject: subject }];
                });
            });
        };
        AdminService_1.prototype.sendContactReply = function (contactMessageId, replyMessage) {
            return __awaiter(this, void 0, void 0, function () {
                var objectId, contact, to, subject, name, greeting, cleanReply, htmlBody, textBody, entry;
                var _this = this;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            try {
                                objectId = new mongoose_1.Types.ObjectId(contactMessageId);
                            }
                            catch (_d) {
                                throw new common_1.BadRequestException('Invalid contact message id');
                            }
                            return [4 /*yield*/, this.contactMessageModel
                                    .findById(objectId)
                                    .select('name email phoneNumber subject message createdAt')
                                    .lean()
                                    .exec()];
                        case 1:
                            contact = _c.sent();
                            if (!contact) {
                                throw new common_1.NotFoundException('Contact message not found');
                            }
                            to = String((_a = contact.email) !== null && _a !== void 0 ? _a : '')
                                .trim()
                                .toLowerCase();
                            if (!to) {
                                throw new common_1.BadRequestException('Contact message has no email');
                            }
                            subject = "Reply to your inquiry".concat(contact.subject ? ": ".concat(String(contact.subject).trim()) : '');
                            name = String((_b = contact.name) !== null && _b !== void 0 ? _b : '').trim();
                            greeting = name ? "Hi ".concat(name, ",") : 'Hello,';
                            cleanReply = String(replyMessage !== null && replyMessage !== void 0 ? replyMessage : '').trim();
                            htmlBody = "\n      <p>".concat(escapeHtml(greeting), "</p>\n      <p>Thank you for contacting us. Please find our response below.</p>\n      <div style=\"white-space:pre-wrap; margin:0 0 16px 0; background:#f9fafb; padding:14px; border-radius:8px; border:1px solid #e5e7eb;\">").concat(escapeHtml(cleanReply), "</div>\n      <p>Regards,<br />GreenPro Support Team</p>\n    ");
                            textBody = "".concat(greeting, "\n\nThank you for contacting us. Please find our response below.\n\n").concat(cleanReply, "\n\nRegards,\nGreenPro Support Team");
                            entry = {
                                adminReply: replyMessage,
                                repliedAt: new Date(),
                            };
                            return [4 /*yield*/, this.contactReplyThreadModel
                                    .updateOne({ contactMessageId: objectId }, {
                                    $setOnInsert: { contactMessageId: objectId, email: to },
                                    $push: { conversations: entry },
                                }, { upsert: true })
                                    .exec()];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, this.createNotification({
                                    title: 'Contact replied',
                                    message: "Admin replied to contact ".concat(to, "."),
                                    type: 'info',
                                    source: 'admin',
                                    referenceType: 'contact',
                                    referenceId: String(objectId),
                                })];
                        case 3:
                            _c.sent();
                            this.emailService.sendInBackground(function () {
                                return _this.emailService.sendEmail(to, subject, htmlBody, textBody);
                            });
                            return [2 /*return*/, { sent: true }];
                    }
                });
            });
        };
        AdminService_1.prototype.getContactReplyHistory = function (contactMessageId) {
            return __awaiter(this, void 0, void 0, function () {
                var objectId, thread;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            try {
                                objectId = new mongoose_1.Types.ObjectId(contactMessageId);
                            }
                            catch (_d) {
                                throw new common_1.BadRequestException('Invalid contact message id');
                            }
                            return [4 /*yield*/, this.contactReplyThreadModel
                                    .findOne({ contactMessageId: objectId })
                                    .lean()
                                    .exec()];
                        case 1:
                            thread = _c.sent();
                            if (!thread) {
                                return [2 /*return*/, { contactMessageId: contactMessageId, email: null, conversations: [] }];
                            }
                            return [2 /*return*/, {
                                    contactMessageId: String(thread.contactMessageId),
                                    email: String((_a = thread.email) !== null && _a !== void 0 ? _a : ''),
                                    conversations: ((_b = thread.conversations) !== null && _b !== void 0 ? _b : []).map(function (c) {
                                        var _a, _b;
                                        return ({
                                            adminReply: String((_a = c === null || c === void 0 ? void 0 : c.adminReply) !== null && _a !== void 0 ? _a : ''),
                                            repliedAt: (_b = c === null || c === void 0 ? void 0 : c.repliedAt) !== null && _b !== void 0 ? _b : null,
                                        });
                                    }),
                                }];
                    }
                });
            });
        };
        AdminService_1.prototype.listNotifications = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var page, limit, safePage, safeLimit, skip, where, unreadWhere, _a, totalCount, unreadCount, rows;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            page = Number((_b = query === null || query === void 0 ? void 0 : query.page) !== null && _b !== void 0 ? _b : 1);
                            limit = Number((_c = query === null || query === void 0 ? void 0 : query.limit) !== null && _c !== void 0 ? _c : 20);
                            safePage = Number.isFinite(page) && page > 0 ? page : 1;
                            safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 20;
                            skip = (safePage - 1) * safeLimit;
                            where = (0, admin_notification_util_1.buildAdminNotificationWhere)(query);
                            unreadWhere = (0, admin_notification_util_1.buildAdminNotificationUnreadCountWhere)(query);
                            return [4 /*yield*/, Promise.all([
                                    this.notificationModel.countDocuments(where).exec(),
                                    this.notificationModel.countDocuments(unreadWhere).exec(),
                                    this.notificationModel
                                        .find(where)
                                        .sort({ createdAt: -1, _id: -1 })
                                        .skip(skip)
                                        .limit(safeLimit)
                                        .lean()
                                        .exec(),
                                ])];
                        case 1:
                            _a = _d.sent(), totalCount = _a[0], unreadCount = _a[1], rows = _a[2];
                            return [2 /*return*/, {
                                    data: (rows !== null && rows !== void 0 ? rows : []).map(function (n) {
                                        return (0, admin_notification_util_1.mapAdminNotificationRow)(n);
                                    }),
                                    totalCount: totalCount,
                                    unreadCount: unreadCount,
                                    currentPage: safePage,
                                    totalPages: Math.max(1, Math.ceil(totalCount / safeLimit) || 1),
                                }];
                    }
                });
            });
        };
        AdminService_1.prototype.markNotificationSeen = function (notificationId) {
            return __awaiter(this, void 0, void 0, function () {
                var now, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(notificationId === null || notificationId === void 0 ? void 0 : notificationId.trim())) {
                                throw new common_1.BadRequestException('Notification id is required');
                            }
                            if (!mongoose_1.Types.ObjectId.isValid(notificationId.trim())) {
                                throw new common_1.BadRequestException('Invalid notification id');
                            }
                            now = new Date();
                            return [4 /*yield*/, this.notificationModel
                                    .findByIdAndUpdate(notificationId.trim(), { $set: { seen: 1, seenAt: now } }, { new: true })
                                    .lean()
                                    .exec()];
                        case 1:
                            updated = _a.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Notification not found');
                            }
                            return [2 /*return*/, {
                                    success: true,
                                    id: String(updated._id),
                                    seen: 1,
                                }];
                    }
                });
            });
        };
        AdminService_1.prototype.markAllNotificationsSeen = function () {
            return __awaiter(this, void 0, void 0, function () {
                var now, result;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            now = new Date();
                            return [4 /*yield*/, this.notificationModel
                                    .updateMany((0, admin_notification_util_1.unreadSeenFilter)(), { $set: { seen: 1, seenAt: now } })
                                    .exec()];
                        case 1:
                            result = _b.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    markedCount: (_a = result.modifiedCount) !== null && _a !== void 0 ? _a : 0,
                                }];
                    }
                });
            });
        };
        AdminService_1.prototype.createTeamMember = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var emailLower, mobileTrim, phoneVariants, softDeletedOr, softDeleted, totalNonDeleted_1, maxAllowed_1, desiredOrder_1, passwordHash_1, $set, updatePayload, $unset, updated, e_2, normalizedRoleIds_1, obj_1, id_1, totalNonDeleted, maxAllowed, desiredOrder, passwordHash, sector_ids, teamMember, created, saved, e_3, obj, normalizedRoleIds, id, sectorIds, enriched;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            emailLower = data.email.trim().toLowerCase();
                            mobileTrim = data.mobile.trim();
                            return [4 /*yield*/, this.assertGlobalMobileAvailable(mobileTrim)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.assertPlatformEmailAvailable(emailLower)];
                        case 2:
                            _a.sent();
                            phoneVariants = (0, phone_lookup_util_1.buildPhoneLookupVariants)(mobileTrim);
                            softDeletedOr = [
                                { email: new RegExp("^".concat(escapeRegex(emailLower), "$"), 'i') },
                            ];
                            if (phoneVariants.length > 0) {
                                softDeletedOr.push({ phone: { $in: phoneVariants } });
                            }
                            return [4 /*yield*/, this.vendorUserModel
                                    .findOne({
                                    type: 'staff',
                                    status: 2,
                                    $or: softDeletedOr,
                                })
                                    .exec()];
                        case 3:
                            softDeleted = _a.sent();
                            if (!softDeleted) return [3 /*break*/, 15];
                            return [4 /*yield*/, this.assertGlobalMobileAvailable(mobileTrim, softDeleted._id)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, this.assertPlatformEmailAvailable(emailLower, softDeleted._id)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, this.vendorUserModel
                                    .countDocuments({
                                    type: 'staff',
                                    businessVertical: data.businessVertical,
                                    status: { $ne: 2 },
                                })
                                    .exec()];
                        case 6:
                            totalNonDeleted_1 = _a.sent();
                            maxAllowed_1 = Math.max(1, totalNonDeleted_1 + 1);
                            desiredOrder_1 = data.displayOrder === undefined ? maxAllowed_1 : data.displayOrder;
                            if (!Number.isInteger(desiredOrder_1) || desiredOrder_1 < 1) {
                                throw new common_1.BadRequestException('Display order must be a positive integer');
                            }
                            if (!(desiredOrder_1 <= totalNonDeleted_1)) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.vendorUserModel
                                    .updateMany({
                                    type: 'staff',
                                    businessVertical: data.businessVertical,
                                    status: { $ne: 2 },
                                    displayOrder: { $gte: desiredOrder_1 },
                                }, { $inc: { displayOrder: 1 } })
                                    .exec()];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8: return [4 /*yield*/, bcrypt.hash(crypto.randomBytes(8).toString('hex'), 10)];
                        case 9:
                            passwordHash_1 = _a.sent();
                            $set = {
                                name: data.name.trim(),
                                email: emailLower,
                                phone: mobileTrim,
                                status: 1,
                                isVerified: true,
                                password: passwordHash_1,
                                displayOrder: desiredOrder_1,
                                businessVertical: data.businessVertical,
                                image: data.imagePath,
                                facebookUrl: data.facebookUrl,
                                twitterUrl: data.twitterUrl,
                                linkedinUrl: data.linkedinUrl,
                                updatedAt: new Date(),
                                showOnWebsite: data.showOnWebsite !== false,
                            };
                            if (data.designation !== undefined && data.designation !== '') {
                                $set.designation = data.designation;
                            }
                            updatePayload = { $set: $set };
                            $unset = { team: '' };
                            if (data.designation !== undefined && data.designation === '') {
                                $unset.designation = '';
                            }
                            if (Object.keys($unset).length > 0) {
                                updatePayload.$unset = $unset;
                            }
                            updated = void 0;
                            _a.label = 10;
                        case 10:
                            _a.trys.push([10, 12, , 13]);
                            return [4 /*yield*/, this.vendorUserModel
                                    .findByIdAndUpdate(softDeleted._id, updatePayload, { new: true })
                                    .exec()];
                        case 11:
                            updated = _a.sent();
                            return [3 /*break*/, 13];
                        case 12:
                            e_2 = _a.sent();
                            this.rethrowTeamMemberDuplicateKeyError(e_2);
                            return [3 /*break*/, 13];
                        case 13:
                            if (!updated) {
                                throw new common_1.NotFoundException('Team member record could not be reactivated');
                            }
                            normalizedRoleIds_1 = Array.isArray(data.roleIds) && data.roleIds.length > 0
                                ? Array.from(new Set(data.roleIds.map(function (id) { return String(id).trim(); }).filter(Boolean)))
                                : data.roleId
                                    ? [String(data.roleId).trim()]
                                    : [];
                            return [4 /*yield*/, this.rbacService.replaceStaffRoles(undefined, {
                                    vendorUserId: String(updated._id),
                                    roleIds: normalizedRoleIds_1,
                                })];
                        case 14:
                            _a.sent();
                            this.invalidateWebsiteTeamMembersListCache();
                            obj_1 = updated.toObject();
                            delete obj_1.password;
                            delete obj_1.otp;
                            id_1 = String(updated._id);
                            return [2 /*return*/, __assign(__assign({}, obj_1), { id: id_1, vendorUserId: id_1, roleIds: normalizedRoleIds_1, portalAccess: normalizedRoleIds_1.length > 0, businessVertical: obj_1.businessVertical, business_vertical: obj_1.businessVertical, showOnWebsite: this.mapTeamMemberShowOnWebsite(obj_1.showOnWebsite) })];
                        case 15: return [4 /*yield*/, this.vendorUserModel
                                .countDocuments({
                                type: 'staff',
                                businessVertical: data.businessVertical,
                                status: { $ne: 2 },
                            })
                                .exec()];
                        case 16:
                            totalNonDeleted = _a.sent();
                            maxAllowed = Math.max(1, totalNonDeleted + 1);
                            desiredOrder = data.displayOrder === undefined ? maxAllowed : data.displayOrder;
                            if (!Number.isInteger(desiredOrder) || desiredOrder < 1) {
                                throw new common_1.BadRequestException('Display order must be a positive integer');
                            }
                            if (!(desiredOrder <= totalNonDeleted)) return [3 /*break*/, 18];
                            return [4 /*yield*/, this.vendorUserModel
                                    .updateMany({
                                    type: 'staff',
                                    businessVertical: data.businessVertical,
                                    status: { $ne: 2 },
                                    displayOrder: { $gte: desiredOrder },
                                }, { $inc: { displayOrder: 1 } })
                                    .exec()];
                        case 17:
                            _a.sent();
                            _a.label = 18;
                        case 18: return [4 /*yield*/, bcrypt.hash(crypto.randomBytes(8).toString('hex'), 10)];
                        case 19:
                            passwordHash = _a.sent();
                            sector_ids = this.assertTeamMemberSectorsValid(data.sector_ids);
                            teamMember = __assign(__assign(__assign(__assign({ type: 'staff', status: 1, isVerified: true, name: data.name }, (data.designation !== undefined && data.designation !== ''
                                ? { designation: data.designation }
                                : {})), { email: emailLower, phone: mobileTrim, image: data.imagePath, facebookUrl: data.facebookUrl, twitterUrl: data.twitterUrl, linkedinUrl: data.linkedinUrl, displayOrder: desiredOrder, businessVertical: data.businessVertical, password: passwordHash, sector_ids: sector_ids }), (sector_ids.length > 0 ? { sector_id: sector_ids[0] } : {})), { category_ids: [], showOnWebsite: data.showOnWebsite !== false });
                            created = new this.vendorUserModel(teamMember);
                            _a.label = 20;
                        case 20:
                            _a.trys.push([20, 22, , 23]);
                            return [4 /*yield*/, created.save()];
                        case 21:
                            saved = _a.sent();
                            return [3 /*break*/, 23];
                        case 22:
                            e_3 = _a.sent();
                            this.rethrowTeamMemberDuplicateKeyError(e_3);
                            return [3 /*break*/, 23];
                        case 23:
                            obj = saved.toObject();
                            delete obj.password;
                            delete obj.otp;
                            normalizedRoleIds = Array.isArray(data.roleIds) && data.roleIds.length > 0
                                ? Array.from(new Set(data.roleIds.map(function (id) { return String(id).trim(); }).filter(Boolean)))
                                : data.roleId
                                    ? [String(data.roleId).trim()]
                                    : [];
                            // Role assignments drive portal access; credentials are sent only on first transition
                            // from no-roles to any-role by RBAC service.
                            return [4 /*yield*/, this.rbacService.replaceStaffRoles(undefined, {
                                    vendorUserId: String(saved._id),
                                    roleIds: normalizedRoleIds,
                                })];
                        case 24:
                            // Role assignments drive portal access; credentials are sent only on first transition
                            // from no-roles to any-role by RBAC service.
                            _a.sent();
                            this.invalidateWebsiteTeamMembersListCache();
                            id = String(saved._id);
                            return [4 /*yield*/, this.normalizeTeamMemberSectorIds(obj)];
                        case 25:
                            sectorIds = _a.sent();
                            return [4 /*yield*/, this.attachSectorsToTeamMemberRows([
                                    {
                                        id: id,
                                        vendorUserId: id,
                                        name: obj.name,
                                        email: obj.email,
                                        phone: obj.phone,
                                        designation: obj.designation,
                                        image: obj.image,
                                        facebookUrl: obj.facebookUrl,
                                        twitterUrl: obj.twitterUrl,
                                        linkedinUrl: obj.linkedinUrl,
                                        displayOrder: obj.displayOrder,
                                        businessVertical: obj.businessVertical,
                                        business_vertical: obj.businessVertical,
                                        status: obj.status,
                                        type: obj.type,
                                        roleIds: normalizedRoleIds,
                                        portalAccess: normalizedRoleIds.length > 0,
                                        sector_ids: sectorIds,
                                        showOnWebsite: this.mapTeamMemberShowOnWebsite(obj.showOnWebsite),
                                    },
                                ])];
                        case 26:
                            enriched = (_a.sent())[0];
                            return [2 /*return*/, enriched];
                    }
                });
            });
        };
        /**
         * Team members for the admin table: non-deleted partners (status !== 2).
         * status 1 = active, 0 = inactive (matches partner toggle).
         */
        AdminService_1.prototype.listTeamMembers = function (_vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var members, rows;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.vendorUserModel
                                .find({
                                type: 'staff',
                                status: { $ne: 2 },
                            })
                                .sort({ displayOrder: 1, _id: 1 })
                                .select('name designation email phone status displayOrder businessVertical showOnWebsite sector_ids sector_id category_ids category_id')
                                .lean()
                                .exec()];
                        case 1:
                            members = _a.sent();
                            return [4 /*yield*/, Promise.all(members.map(function (m, index) { return __awaiter(_this, void 0, void 0, function () {
                                    var sector_ids;
                                    var _a, _b, _c;
                                    return __generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0: return [4 /*yield*/, this.normalizeTeamMemberSectorIds(m)];
                                            case 1:
                                                sector_ids = _d.sent();
                                                return [2 /*return*/, {
                                                        s_no: index + 1,
                                                        id: String(m._id),
                                                        vendorUserId: String(m._id),
                                                        name: m.name,
                                                        designation: (_a = m.designation) !== null && _a !== void 0 ? _a : '',
                                                        email: m.email,
                                                        mobile: m.phone,
                                                        is_active: m.status === 1,
                                                        displayOrder: Number(m.displayOrder) || 0,
                                                        businessVertical: String((_b = m.businessVertical) !== null && _b !== void 0 ? _b : ''),
                                                        business_vertical: String((_c = m.businessVertical) !== null && _c !== void 0 ? _c : ''),
                                                        showOnWebsite: this.mapTeamMemberShowOnWebsite(m.showOnWebsite),
                                                        sector_ids: sector_ids,
                                                    }];
                                        }
                                    });
                                }); }))];
                        case 2:
                            rows = _a.sent();
                            return [2 /*return*/, this.attachSectorsToTeamMemberRows(rows)];
                    }
                });
            });
        };
        AdminService_1.prototype.listTeamMembersPaginated = function (_vendorId, query, opts) {
            return __awaiter(this, void 0, void 0, function () {
                var page, limit, currentPage, perPage, skip, mongoQuery, catId, catToSector, sectorForCat, orClause, rawStatus, designation, _a, displayOrderMax, totalCount, members, totalPages, rows, data;
                var _this = this;
                var _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            page = Number((_b = query === null || query === void 0 ? void 0 : query.page) !== null && _b !== void 0 ? _b : 1);
                            limit = Number((_c = query === null || query === void 0 ? void 0 : query.limit) !== null && _c !== void 0 ? _c : 10);
                            currentPage = Number.isFinite(page) && page > 0 ? page : 1;
                            perPage = Number.isFinite(limit) && limit > 0 ? limit : 10;
                            skip = (currentPage - 1) * perPage;
                            mongoQuery = {
                                type: 'staff',
                                status: { $ne: 2 },
                            };
                            catId = opts === null || opts === void 0 ? void 0 : opts.categoryNumericId;
                            if (!(catId !== undefined &&
                                typeof catId === 'number' &&
                                Number.isInteger(catId) &&
                                catId >= 1)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.categoriesService.getCategorySectorsByNumericIds([catId])];
                        case 1:
                            catToSector = _f.sent();
                            sectorForCat = catToSector.get(catId);
                            orClause = [
                                { category_ids: catId },
                                { category_id: catId },
                            ];
                            if (typeof sectorForCat === 'number' &&
                                Number.isInteger(sectorForCat) &&
                                sectorForCat >= 1) {
                                orClause.push({ sector_ids: sectorForCat });
                                orClause.push({ sector_id: sectorForCat });
                            }
                            mongoQuery.$or = orClause;
                            _f.label = 2;
                        case 2:
                            rawStatus = (_d = query === null || query === void 0 ? void 0 : query.status) === null || _d === void 0 ? void 0 : _d.trim().toLowerCase();
                            if (rawStatus) {
                                if (rawStatus === 'active' || rawStatus === '1')
                                    mongoQuery.status = 1;
                                if (rawStatus === 'inactive' || rawStatus === '0')
                                    mongoQuery.status = 0;
                            }
                            designation = (_e = query === null || query === void 0 ? void 0 : query.designation) === null || _e === void 0 ? void 0 : _e.trim();
                            if (designation) {
                                mongoQuery.designation = new RegExp("^".concat(escapeRegex(designation), "$"), 'i');
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.vendorUserModel
                                        .countDocuments({ type: 'staff', status: { $ne: 2 } })
                                        .exec(),
                                    this.vendorUserModel.countDocuments(mongoQuery).exec(),
                                    this.vendorUserModel
                                        .find(mongoQuery)
                                        .sort({ displayOrder: 1, _id: 1 })
                                        .skip(skip)
                                        .limit(perPage)
                                        .select('name designation email phone status displayOrder businessVertical showOnWebsite sector_ids sector_id category_ids category_id')
                                        .lean()
                                        .exec(),
                                ])];
                        case 3:
                            _a = _f.sent(), displayOrderMax = _a[0], totalCount = _a[1], members = _a[2];
                            totalPages = Math.max(1, Math.ceil(totalCount / perPage));
                            return [4 /*yield*/, Promise.all((members !== null && members !== void 0 ? members : []).map(function (m, index) { return __awaiter(_this, void 0, void 0, function () {
                                    var sector_ids;
                                    var _a, _b, _c;
                                    return __generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0: return [4 /*yield*/, this.normalizeTeamMemberSectorIds(m)];
                                            case 1:
                                                sector_ids = _d.sent();
                                                return [2 /*return*/, {
                                                        s_no: skip + index + 1,
                                                        id: String(m._id),
                                                        vendorUserId: String(m._id),
                                                        name: m.name,
                                                        designation: (_a = m.designation) !== null && _a !== void 0 ? _a : '',
                                                        email: m.email,
                                                        mobile: m.phone,
                                                        is_active: m.status === 1,
                                                        displayOrder: Number(m.displayOrder) || 0,
                                                        businessVertical: String((_b = m.businessVertical) !== null && _b !== void 0 ? _b : ''),
                                                        business_vertical: String((_c = m.businessVertical) !== null && _c !== void 0 ? _c : ''),
                                                        showOnWebsite: this.mapTeamMemberShowOnWebsite(m.showOnWebsite),
                                                        sector_ids: sector_ids,
                                                    }];
                                        }
                                    });
                                }); }))];
                        case 4:
                            rows = _f.sent();
                            return [4 /*yield*/, this.attachSectorsToTeamMemberRows(rows)];
                        case 5:
                            data = _f.sent();
                            return [2 /*return*/, {
                                    data: data,
                                    displayOrderMax: Math.max(1, displayOrderMax),
                                    totalCount: totalCount,
                                    currentPage: currentPage,
                                    totalPages: totalPages,
                                }];
                    }
                });
            });
        };
        /**
         * Partial, case-insensitive match on name and/or email (non-deleted partners only).
         * When both filters are set, both must match (AND).
         */
        AdminService_1.prototype.searchTeamMembers = function (_vendorId, filters) {
            return __awaiter(this, void 0, void 0, function () {
                var name, email, query, members, rows;
                var _this = this;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            name = (_a = filters.name) === null || _a === void 0 ? void 0 : _a.trim();
                            email = (_b = filters.email) === null || _b === void 0 ? void 0 : _b.trim();
                            if (!name && !email) {
                                throw new common_1.BadRequestException('Provide a name and/or email to search');
                            }
                            query = {
                                type: 'staff',
                                status: { $ne: 2 },
                            };
                            if (name) {
                                query.name = new RegExp(escapeRegex(name), 'i');
                            }
                            if (email) {
                                query.email = new RegExp(escapeRegex(email), 'i');
                            }
                            return [4 /*yield*/, this.vendorUserModel
                                    .find(query)
                                    .sort({ displayOrder: 1, _id: 1 })
                                    .select('name designation email phone status displayOrder businessVertical showOnWebsite sector_ids sector_id category_ids category_id')
                                    .lean()
                                    .exec()];
                        case 1:
                            members = _c.sent();
                            return [4 /*yield*/, Promise.all(members.map(function (m, index) { return __awaiter(_this, void 0, void 0, function () {
                                    var sector_ids;
                                    var _a, _b, _c;
                                    return __generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0: return [4 /*yield*/, this.normalizeTeamMemberSectorIds(m)];
                                            case 1:
                                                sector_ids = _d.sent();
                                                return [2 /*return*/, {
                                                        s_no: index + 1,
                                                        id: String(m._id),
                                                        vendorUserId: String(m._id),
                                                        name: m.name,
                                                        designation: (_a = m.designation) !== null && _a !== void 0 ? _a : '',
                                                        email: m.email,
                                                        mobile: m.phone,
                                                        is_active: m.status === 1,
                                                        displayOrder: Number(m.displayOrder) || 0,
                                                        businessVertical: String((_b = m.businessVertical) !== null && _b !== void 0 ? _b : ''),
                                                        business_vertical: String((_c = m.businessVertical) !== null && _c !== void 0 ? _c : ''),
                                                        showOnWebsite: this.mapTeamMemberShowOnWebsite(m.showOnWebsite),
                                                        sector_ids: sector_ids,
                                                    }];
                                        }
                                    });
                                }); }))];
                        case 2:
                            rows = _c.sent();
                            return [2 /*return*/, this.attachSectorsToTeamMemberRows(rows)];
                    }
                });
            });
        };
        /** Single team member for view modal (non-deleted partner, same vendor). */
        AdminService_1.prototype.getTeamMemberById = function (_vendorId, memberId) {
            return __awaiter(this, void 0, void 0, function () {
                var memberObjectId, member, st, sector_ids, enriched;
                var _a, _b, _c, _d, _e, _f, _g, _h;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            try {
                                memberObjectId = new mongoose_1.Types.ObjectId(memberId);
                            }
                            catch (_k) {
                                throw new common_1.BadRequestException('Invalid ID format');
                            }
                            return [4 /*yield*/, this.vendorUserModel
                                    .findOne({
                                    _id: memberObjectId,
                                    type: 'staff',
                                    status: { $ne: 2 },
                                })
                                    .select('name designation email phone status image facebookUrl twitterUrl linkedinUrl displayOrder businessVertical showOnWebsite sector_ids sector_id category_ids category_id')
                                    .lean()
                                    .exec()];
                        case 1:
                            member = _j.sent();
                            if (!member) {
                                throw new common_1.NotFoundException('Team member not found');
                            }
                            st = (_a = member.status) !== null && _a !== void 0 ? _a : 0;
                            return [4 /*yield*/, this.normalizeTeamMemberSectorIds(member)];
                        case 2:
                            sector_ids = _j.sent();
                            return [4 /*yield*/, this.attachSectorsToTeamMemberRows([
                                    {
                                        id: String(member._id),
                                        vendorUserId: String(member._id),
                                        name: member.name,
                                        designation: (_b = member.designation) !== null && _b !== void 0 ? _b : '',
                                        email: member.email,
                                        mobile: member.phone,
                                        status: st === 1 ? 'Active' : 'Inactive',
                                        image: (_c = member.image) !== null && _c !== void 0 ? _c : null,
                                        facebookUrl: (_d = member.facebookUrl) !== null && _d !== void 0 ? _d : '',
                                        twitterUrl: (_e = member.twitterUrl) !== null && _e !== void 0 ? _e : '',
                                        linkedinUrl: (_f = member.linkedinUrl) !== null && _f !== void 0 ? _f : '',
                                        displayOrder: Number(member.displayOrder) || 0,
                                        businessVertical: String((_g = member.businessVertical) !== null && _g !== void 0 ? _g : ''),
                                        business_vertical: String((_h = member.businessVertical) !== null && _h !== void 0 ? _h : ''),
                                        showOnWebsite: this.mapTeamMemberShowOnWebsite(member.showOnWebsite),
                                        sector_ids: sector_ids,
                                    },
                                ])];
                        case 3:
                            enriched = (_j.sent())[0];
                            return [2 /*return*/, enriched];
                    }
                });
            });
        };
        AdminService_1.prototype.createBanner = function (vendorScope, dto, resolvedImageSource, resolvedVideoSource) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, scopeFilter, sequenceNumber, latestBanner, currentMax, duplicateSequence, videoUrl, created, saved, o, st;
                var _a, _b, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            vendorObjectId = (0, banner_vendor_scope_util_1.resolveBannerPersistVendorObjectId)(vendorScope);
                            scopeFilter = (0, banner_vendor_scope_util_1.buildBannerVendorScopeFilter)(vendorScope);
                            sequenceNumber = dto.sequenceNumber;
                            if (!(sequenceNumber === undefined)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.bannerModel
                                    .findOne(scopeFilter)
                                    .sort({ sequenceNumber: -1, createdAt: -1 })
                                    .select('sequenceNumber')
                                    .lean()
                                    .exec()];
                        case 1:
                            latestBanner = _h.sent();
                            currentMax = Number((_a = latestBanner === null || latestBanner === void 0 ? void 0 : latestBanner.sequenceNumber) !== null && _a !== void 0 ? _a : 0);
                            sequenceNumber = Number.isFinite(currentMax) && currentMax >= 1 ? currentMax + 1 : 1;
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.bannerModel
                                .exists(__assign({ sequenceNumber: sequenceNumber }, scopeFilter))
                                .lean()
                                .exec()];
                        case 3:
                            duplicateSequence = _h.sent();
                            if (duplicateSequence) {
                                throw new common_1.ConflictException("Sequence number ".concat(sequenceNumber, " already exists for another banner"));
                            }
                            _h.label = 4;
                        case 4:
                            videoUrl = String((_b = dto.videoUrl) !== null && _b !== void 0 ? _b : '').trim();
                            created = new this.bannerModel(__assign(__assign({ vendorId: vendorObjectId, banner_image: this.resolveBannerImagePath(dto.imageUrl), imageUrl: String((_c = dto.imageUrl) !== null && _c !== void 0 ? _c : '').trim(), imageSource: resolvedImageSource, banner_video: videoUrl ? this.resolveBannerVideoPath(videoUrl) : '', videoUrl: videoUrl }, (resolvedVideoSource ? { videoSource: resolvedVideoSource } : {})), { heading: dto.title.trim(), sequenceNumber: sequenceNumber, description: dto.description.trim(), status: String((_d = dto.status) !== null && _d !== void 0 ? _d : '').trim().toLowerCase() === 'inactive' ||
                                    String((_e = dto.status) !== null && _e !== void 0 ? _e : '').trim() === '0'
                                    ? 0
                                    : 1 }));
                            return [4 /*yield*/, created.save()];
                        case 5:
                            saved = _h.sent();
                            o = saved.toObject();
                            st = (_f = o.status) !== null && _f !== void 0 ? _f : 1;
                            return [2 /*return*/, {
                                    id: String(o._id),
                                    imageUrl: this.resolveBannerImageForResponse(o.imageUrl, o.banner_image),
                                    imageSource: this.resolveBannerImageSource(o.imageSource),
                                    videoUrl: this.resolveBannerVideoForResponse(o.videoUrl, o.banner_video),
                                    videoSource: this.resolveBannerVideoSource(o.videoSource),
                                    heading: o.heading,
                                    title: o.heading,
                                    sequenceNumber: Number((_g = o.sequenceNumber) !== null && _g !== void 0 ? _g : 1),
                                    description: o.description,
                                    status: st === 1 ? 'active' : 'inactive',
                                    is_active: st === 1,
                                    createdAt: o.createdAt,
                                    updatedAt: o.updatedAt,
                                }];
                    }
                });
            });
        };
        /**
         * Banners for the vendor admin grid: image, heading, full description (UI clamps ~3 lines), toggle state.
         */
        AdminService_1.prototype.listBanners = function (vendorScope) {
            return __awaiter(this, void 0, void 0, function () {
                var scopeFilter, rows;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            scopeFilter = (0, banner_vendor_scope_util_1.buildBannerVendorScopeFilter)(vendorScope);
                            return [4 /*yield*/, this.bannerModel
                                    .find(scopeFilter)
                                    .sort({ sequenceNumber: 1, createdAt: -1, _id: -1 })
                                    .select('banner_image imageUrl imageSource banner_video videoUrl videoSource heading sequenceNumber description status')
                                    .lean()
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, rows.map(function (b, index) { return _this.mapBannerRowForResponse(b, index); })];
                    }
                });
            });
        };
        /** Public banner list for website (active only, newest first). */
        AdminService_1.prototype.listPublicBanners = function () {
            return __awaiter(this, void 0, void 0, function () {
                var rows;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.bannerModel
                                .find({
                                $or: [
                                    { status: 1 },
                                    { status: { $exists: false } },
                                    { status: null },
                                ],
                            })
                                .sort({ sequenceNumber: 1, createdAt: -1, _id: -1 })
                                .select('banner_image imageUrl imageSource banner_video videoUrl videoSource heading sequenceNumber description status')
                                .lean()
                                .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, rows.map(function (b, index) { return _this.mapBannerRowForResponse(b, index); })];
                    }
                });
            });
        };
        /** Single banner for the View modal (image URL, heading, description). */
        AdminService_1.prototype.getBannerById = function (vendorScope, bannerId) {
            return __awaiter(this, void 0, void 0, function () {
                var bannerObjectId, b;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            try {
                                bannerObjectId = new mongoose_1.Types.ObjectId(bannerId);
                            }
                            catch (_b) {
                                throw new common_1.BadRequestException('Invalid ID format');
                            }
                            return [4 /*yield*/, this.bannerModel
                                    .findOne(__assign({ _id: bannerObjectId }, (0, banner_vendor_scope_util_1.buildBannerVendorScopeFilter)(vendorScope)))
                                    .select('banner_image imageUrl imageSource banner_video videoUrl videoSource heading sequenceNumber description status')
                                    .lean()
                                    .exec()];
                        case 1:
                            b = _a.sent();
                            if (!b) {
                                throw new common_1.NotFoundException('Banner not found');
                            }
                            return [2 /*return*/, __assign({}, this.mapBannerRowForResponse(b))];
                    }
                });
            });
        };
        /** Updates a banner that belongs to the vendor. */
        AdminService_1.prototype.updateBanner = function (vendorScope, bannerId, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var bannerObjectId, scopeFilter, existing, duplicateSequence, $set, trimmedVideo, updated, st;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            try {
                                bannerObjectId = new mongoose_1.Types.ObjectId(bannerId);
                            }
                            catch (_d) {
                                throw new common_1.BadRequestException('Invalid ID format');
                            }
                            scopeFilter = (0, banner_vendor_scope_util_1.buildBannerVendorScopeFilter)(vendorScope);
                            return [4 /*yield*/, this.bannerModel
                                    .findOne(__assign({ _id: bannerObjectId }, scopeFilter))
                                    .select('_id')
                                    .lean()
                                    .exec()];
                        case 1:
                            existing = _c.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException('Banner not found');
                            }
                            if (!(payload.sequenceNumber !== undefined)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.bannerModel
                                    .exists(__assign({ _id: { $ne: bannerObjectId }, sequenceNumber: payload.sequenceNumber }, scopeFilter))
                                    .lean()
                                    .exec()];
                        case 2:
                            duplicateSequence = _c.sent();
                            if (duplicateSequence) {
                                throw new common_1.ConflictException("Sequence number ".concat(payload.sequenceNumber, " already exists for another banner"));
                            }
                            _c.label = 3;
                        case 3:
                            $set = { updatedAt: new Date() };
                            if (payload.title !== undefined) {
                                $set.heading = payload.title.trim();
                            }
                            if (payload.sequenceNumber !== undefined) {
                                $set.sequenceNumber = payload.sequenceNumber;
                            }
                            if (payload.description !== undefined) {
                                $set.description = payload.description.trim();
                            }
                            if (payload.status !== undefined) {
                                $set.status =
                                    String(payload.status).trim().toLowerCase() === 'inactive' ||
                                        String(payload.status).trim() === '0'
                                        ? 0
                                        : 1;
                            }
                            if (payload.imageUrl !== undefined) {
                                $set.imageUrl = payload.imageUrl.trim();
                                $set.banner_image = this.resolveBannerImagePath(payload.imageUrl);
                            }
                            if (payload.imageSource !== undefined) {
                                $set.imageSource = payload.imageSource;
                            }
                            if (payload.clearVideo) {
                                $set.videoUrl = '';
                                $set.banner_video = '';
                                $set.videoSource = undefined;
                            }
                            else if (payload.videoUrl !== undefined) {
                                trimmedVideo = payload.videoUrl.trim();
                                $set.videoUrl = trimmedVideo;
                                $set.banner_video = trimmedVideo
                                    ? this.resolveBannerVideoPath(trimmedVideo)
                                    : '';
                                if (payload.videoSource !== undefined) {
                                    $set.videoSource = payload.videoSource;
                                }
                                else if (!trimmedVideo) {
                                    $set.videoSource = undefined;
                                }
                            }
                            return [4 /*yield*/, this.bannerModel
                                    .findByIdAndUpdate(bannerObjectId, { $set: $set }, { new: true })
                                    .lean()
                                    .exec()];
                        case 4:
                            updated = _c.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Banner not found');
                            }
                            st = (_a = updated.status) !== null && _a !== void 0 ? _a : 1;
                            return [2 /*return*/, {
                                    id: String(updated._id),
                                    imageUrl: this.resolveBannerImageForResponse(updated.imageUrl, updated.banner_image),
                                    imageSource: this.resolveBannerImageSource(updated.imageSource),
                                    videoUrl: this.resolveBannerVideoForResponse(updated.videoUrl, updated.banner_video),
                                    videoSource: this.resolveBannerVideoSource(updated.videoSource),
                                    heading: updated.heading,
                                    title: updated.heading,
                                    sequenceNumber: Number((_b = updated.sequenceNumber) !== null && _b !== void 0 ? _b : 1),
                                    description: updated.description,
                                    status: st === 1 ? 'active' : 'inactive',
                                    is_active: st === 1,
                                    createdAt: updated.createdAt,
                                    updatedAt: updated.updatedAt,
                                }];
                    }
                });
            });
        };
        /** Permanently removes a banner that belongs to the vendor. */
        AdminService_1.prototype.deleteBanner = function (vendorScope, bannerId) {
            return __awaiter(this, void 0, void 0, function () {
                var bannerObjectId, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            try {
                                bannerObjectId = new mongoose_1.Types.ObjectId(bannerId);
                            }
                            catch (_b) {
                                throw new common_1.BadRequestException('Invalid ID format');
                            }
                            return [4 /*yield*/, this.bannerModel
                                    .deleteOne(__assign({ _id: bannerObjectId }, (0, banner_vendor_scope_util_1.buildBannerVendorScopeFilter)(vendorScope)))
                                    .exec()];
                        case 1:
                            res = _a.sent();
                            if (res.deletedCount === 0) {
                                throw new common_1.NotFoundException('Banner not found');
                            }
                            return [2 /*return*/, { id: bannerId }];
                    }
                });
            });
        };
        /**
         * Set or toggle a banner's status (vendor-scoped).
         *
         * - When `status` is provided: sets explicitly (active/inactive)
         * - When `status` is omitted: toggles (1 ↔ 0)
         */
        AdminService_1.prototype.setOrToggleBannerStatus = function (vendorScope, bannerId, status) {
            return __awaiter(this, void 0, void 0, function () {
                var bannerObjectId, existing, desired, newStatus, cur, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            try {
                                bannerObjectId = new mongoose_1.Types.ObjectId(bannerId);
                            }
                            catch (_b) {
                                throw new common_1.BadRequestException('Invalid ID format');
                            }
                            return [4 /*yield*/, this.bannerModel
                                    .findOne(__assign({ _id: bannerObjectId }, (0, banner_vendor_scope_util_1.buildBannerVendorScopeFilter)(vendorScope)))
                                    .select('status')
                                    .lean()
                                    .exec()];
                        case 1:
                            existing = _a.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException('Banner not found');
                            }
                            desired = status !== undefined ? String(status).trim().toLowerCase() : undefined;
                            newStatus = null;
                            if (desired === undefined || desired === '') {
                                cur = Number(existing.status) === 1 ? 1 : 0;
                                newStatus = cur === 1 ? 0 : 1;
                            }
                            else {
                                if (desired === 'active' || desired === '1')
                                    newStatus = 1;
                                if (desired === 'inactive' || desired === '0')
                                    newStatus = 0;
                                if (newStatus === null) {
                                    throw new common_1.BadRequestException('Invalid status. Use "active" or "inactive"');
                                }
                            }
                            return [4 /*yield*/, this.bannerModel
                                    .findByIdAndUpdate(bannerObjectId, { $set: { status: newStatus, updatedAt: new Date() } }, { new: true })
                                    .lean()
                                    .exec()];
                        case 2:
                            updated = _a.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Banner not found');
                            }
                            return [2 /*return*/, {
                                    id: String(updated._id),
                                    status: Number(updated.status) === 1 ? 'active' : 'inactive',
                                    is_active: Number(updated.status) === 1,
                                }];
                    }
                });
            });
        };
        AdminService_1.prototype.updateTeamMember = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var memberObjectId, member, emailLower, mobileTrim, totalNonDeleted, maxAllowed, desiredOrder, currentOrder, $set, $unset, sector_ids_1, updatePayload, updated, e_4, obj, normalizedRoleIds, id, sector_ids, enriched;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            try {
                                memberObjectId = new mongoose_1.Types.ObjectId(data.id);
                            }
                            catch (_b) {
                                throw new common_1.BadRequestException('Invalid ID format');
                            }
                            return [4 /*yield*/, this.vendorUserModel
                                    .findOne({
                                    _id: memberObjectId,
                                    type: 'staff',
                                    status: { $ne: 2 },
                                })
                                    .exec()];
                        case 1:
                            member = _a.sent();
                            if (!member) {
                                throw new common_1.NotFoundException('Team member not found');
                            }
                            emailLower = data.email.trim().toLowerCase();
                            mobileTrim = data.mobile.trim();
                            return [4 /*yield*/, this.assertGlobalMobileAvailable(mobileTrim, memberObjectId)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.assertPlatformEmailAvailable(emailLower, memberObjectId)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.vendorUserModel
                                    .countDocuments({ type: 'staff', status: { $ne: 2 } })
                                    .exec()];
                        case 4:
                            totalNonDeleted = _a.sent();
                            maxAllowed = Math.max(1, totalNonDeleted);
                            desiredOrder = data.displayOrder === undefined ? maxAllowed : data.displayOrder;
                            if (!Number.isInteger(desiredOrder) || desiredOrder < 1) {
                                throw new common_1.BadRequestException('Display order must be a positive integer');
                            }
                            currentOrder = Number(member.displayOrder) || maxAllowed;
                            if (!(desiredOrder !== currentOrder)) return [3 /*break*/, 8];
                            if (!(desiredOrder < currentOrder)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.vendorUserModel
                                    .updateMany({
                                    _id: { $ne: memberObjectId },
                                    type: 'staff',
                                    status: { $ne: 2 },
                                    displayOrder: { $gte: desiredOrder, $lt: currentOrder },
                                }, { $inc: { displayOrder: 1 } })
                                    .exec()];
                        case 5:
                            _a.sent();
                            return [3 /*break*/, 8];
                        case 6: return [4 /*yield*/, this.vendorUserModel
                                .updateMany({
                                _id: { $ne: memberObjectId },
                                type: 'staff',
                                status: { $ne: 2 },
                                displayOrder: { $gt: currentOrder, $lte: desiredOrder },
                            }, { $inc: { displayOrder: -1 } })
                                .exec()];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8:
                            $set = {
                                name: data.name,
                                email: emailLower,
                                phone: mobileTrim,
                                updatedAt: new Date(),
                            };
                            if (data.designation !== undefined && data.designation !== '') {
                                $set.designation = data.designation;
                            }
                            if (data.facebookUrl !== undefined) {
                                $set.facebookUrl = data.facebookUrl;
                            }
                            if (data.twitterUrl !== undefined) {
                                $set.twitterUrl = data.twitterUrl;
                            }
                            if (data.linkedinUrl !== undefined) {
                                $set.linkedinUrl = data.linkedinUrl;
                            }
                            if (data.imagePath !== undefined) {
                                $set.image = data.imagePath;
                            }
                            $set.displayOrder = desiredOrder;
                            $set.businessVertical = data.businessVertical;
                            if (data.showOnWebsite !== undefined) {
                                $set.showOnWebsite = data.showOnWebsite;
                            }
                            $unset = { team: '' };
                            if (data.sector_ids !== undefined) {
                                sector_ids_1 = this.assertTeamMemberSectorsValid(data.sector_ids);
                                $set.sector_ids = sector_ids_1;
                                if (sector_ids_1.length > 0) {
                                    $set.sector_id = sector_ids_1[0];
                                }
                                else {
                                    $unset.sector_id = '';
                                }
                                $set.category_ids = [];
                                $unset.category_id = '';
                            }
                            updatePayload = { $set: $set };
                            if (data.designation !== undefined && data.designation === '') {
                                $unset.designation = '';
                            }
                            // Platform CMS team members must not carry manufacturer scope (legacy rows).
                            $unset.manufacturerId = '';
                            $unset.vendorId = '';
                            if (Object.keys($unset).length > 0) {
                                updatePayload.$unset = $unset;
                            }
                            _a.label = 9;
                        case 9:
                            _a.trys.push([9, 11, , 12]);
                            return [4 /*yield*/, this.vendorUserModel
                                    .findByIdAndUpdate(memberObjectId, updatePayload, { new: true })
                                    .exec()];
                        case 10:
                            updated = _a.sent();
                            return [3 /*break*/, 12];
                        case 11:
                            e_4 = _a.sent();
                            this.rethrowTeamMemberDuplicateKeyError(e_4);
                            return [3 /*break*/, 12];
                        case 12:
                            if (!updated) {
                                throw new common_1.NotFoundException('Team member not found');
                            }
                            obj = updated.toObject();
                            delete obj.password;
                            delete obj.otp;
                            normalizedRoleIds = Array.isArray(data.roleIds) && data.roleIds.length > 0
                                ? Array.from(new Set(data.roleIds.map(function (id) { return String(id).trim(); }).filter(Boolean)))
                                : data.roleId
                                    ? [String(data.roleId).trim()]
                                    : [];
                            return [4 /*yield*/, this.rbacService.replaceStaffRoles(undefined, {
                                    vendorUserId: data.id,
                                    roleIds: normalizedRoleIds,
                                })];
                        case 13:
                            _a.sent();
                            this.invalidateWebsiteTeamMembersListCache();
                            id = String(updated._id);
                            return [4 /*yield*/, this.normalizeTeamMemberSectorIds(obj)];
                        case 14:
                            sector_ids = _a.sent();
                            return [4 /*yield*/, this.attachSectorsToTeamMemberRows([
                                    {
                                        id: id,
                                        vendorUserId: id,
                                        name: obj.name,
                                        email: obj.email,
                                        phone: obj.phone,
                                        designation: obj.designation,
                                        image: obj.image,
                                        facebookUrl: obj.facebookUrl,
                                        twitterUrl: obj.twitterUrl,
                                        linkedinUrl: obj.linkedinUrl,
                                        displayOrder: obj.displayOrder,
                                        businessVertical: obj.businessVertical,
                                        business_vertical: obj.businessVertical,
                                        status: obj.status,
                                        type: obj.type,
                                        roleIds: normalizedRoleIds,
                                        portalAccess: normalizedRoleIds.length > 0,
                                        sector_ids: sector_ids,
                                        showOnWebsite: this.mapTeamMemberShowOnWebsite(obj.showOnWebsite),
                                    },
                                ])];
                        case 15:
                            enriched = (_a.sent())[0];
                            return [2 /*return*/, enriched];
                    }
                });
            });
        };
        /** Soft delete: status 2 (same as partners). */
        AdminService_1.prototype.deleteTeamMember = function (_vendorId, teamMemberId) {
            return __awaiter(this, void 0, void 0, function () {
                var memberObjectId, member, updated, deletedOrder, obj;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            try {
                                memberObjectId = new mongoose_1.Types.ObjectId(teamMemberId);
                            }
                            catch (_b) {
                                throw new common_1.BadRequestException('Invalid ID format');
                            }
                            return [4 /*yield*/, this.vendorUserModel
                                    .findOne({
                                    _id: memberObjectId,
                                    type: 'staff',
                                    status: { $ne: 2 },
                                })
                                    .exec()];
                        case 1:
                            member = _a.sent();
                            if (!member) {
                                throw new common_1.NotFoundException('Team member not found');
                            }
                            return [4 /*yield*/, this.vendorUserModel
                                    .findByIdAndUpdate(memberObjectId, { status: 2, updatedAt: new Date() }, { new: true })
                                    .exec()];
                        case 2:
                            updated = _a.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Team member not found');
                            }
                            deletedOrder = Number(member.displayOrder);
                            if (!(Number.isFinite(deletedOrder) && deletedOrder > 0)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.vendorUserModel
                                    .updateMany({
                                    _id: { $ne: memberObjectId },
                                    type: 'staff',
                                    status: { $ne: 2 },
                                    displayOrder: { $gt: deletedOrder },
                                }, { $inc: { displayOrder: -1 } })
                                    .exec()];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [4 /*yield*/, this.rbacService
                                .unassignStaffRole(undefined, teamMemberId)
                                .catch(function (err) {
                                _this.logger.warn("Failed to clean up role mappings for deleted team member ".concat(teamMemberId, ": ").concat((err === null || err === void 0 ? void 0 : err.message) || 'unknown'));
                            })];
                        case 5:
                            _a.sent();
                            obj = updated.toObject();
                            delete obj.password;
                            delete obj.otp;
                            this.invalidateWebsiteTeamMembersListCache();
                            return [2 /*return*/, obj];
                    }
                });
            });
        };
        /** Permanently deletes a newsletter subscriber by document id. */
        AdminService_1.prototype.invalidateNewsletterSubscribersCache = function () {
            return __awaiter(this, void 0, void 0, function () {
                var key;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            key = this.redisService.buildKey('website', 'newsletter', 'subscribers');
                            return [4 /*yield*/, this.redisService.del(key).catch(function () { return undefined; })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AdminService_1.prototype.formatNewsletterSubscriberRow = function (row, serialNo) {
            var _a;
            var subscribedFor = formatSubscribedForLabel(row.subscribedFor);
            var activity = (0, newsletter_subscribers_query_util_1.newsletterSubscriberActivityDate)(row);
            var createdRaw = activity !== null && activity !== void 0 ? activity : row.createdAt;
            var createdAt = createdRaw instanceof Date
                ? createdRaw.toISOString().slice(0, 10)
                : createdRaw
                    ? new Date(String(createdRaw)).toISOString().slice(0, 10)
                    : '';
            var isActive = Number(row.status) === 1;
            return {
                id: row._id ? String(row._id) : '',
                s_no: serialNo,
                email: String((_a = row.email) !== null && _a !== void 0 ? _a : ''),
                subscribedFor: subscribedFor,
                subscribeFor: subscribedFor,
                createdAt: createdAt,
                createdDate: createdAt,
                status: isActive ? 'active' : 'inactive',
                is_active: isActive,
            };
        };
        /** Admin subscribers list — always reads MongoDB (no stale Redis empty cache). */
        AdminService_1.prototype.listNewsletterSubscribers = function () {
            return __awaiter(this, void 0, void 0, function () {
                var rows;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadNewsletterSubscriberDocs()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, (rows !== null && rows !== void 0 ? rows : []).map(function (row, idx) {
                                    return _this.formatNewsletterSubscriberRow(row, idx + 1);
                                })];
                    }
                });
            });
        };
        /**
         * Reads `newslettersubscribers` plus any stray `newsletter_subscribers` docs.
         * Sorted by last activity so website re-subscribes appear at the top.
         */
        AdminService_1.prototype.loadNewsletterSubscriberDocs = function () {
            return __awaiter(this, void 0, void 0, function () {
                var projection, byEmail, primary, primaryName, _i, NEWSLETTER_SUBSCRIBER_COLLECTIONS_1, name_1, altRows, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            projection = {
                                email: 1,
                                subscribedFor: 1,
                                status: 1,
                                createdAt: 1,
                                updatedAt: 1,
                            };
                            byEmail = new Map();
                            return [4 /*yield*/, this.newsletterSubscriberModel
                                    .find({}, projection)
                                    .lean()
                                    .exec()];
                        case 1:
                            primary = _b.sent();
                            (0, newsletter_subscribers_query_util_1.absorbNewsletterSubscriberRows)(byEmail, primary !== null && primary !== void 0 ? primary : []);
                            primaryName = this.newsletterSubscriberModel.collection.name;
                            _i = 0, NEWSLETTER_SUBSCRIBER_COLLECTIONS_1 = newsletter_subscribers_query_util_1.NEWSLETTER_SUBSCRIBER_COLLECTIONS;
                            _b.label = 2;
                        case 2:
                            if (!(_i < NEWSLETTER_SUBSCRIBER_COLLECTIONS_1.length)) return [3 /*break*/, 7];
                            name_1 = NEWSLETTER_SUBSCRIBER_COLLECTIONS_1[_i];
                            if (name_1 === primaryName)
                                return [3 /*break*/, 6];
                            _b.label = 3;
                        case 3:
                            _b.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.newsletterSubscriberModel.db
                                    .collection(name_1)
                                    .find({}, { projection: projection })
                                    .toArray()];
                        case 4:
                            altRows = _b.sent();
                            (0, newsletter_subscribers_query_util_1.absorbNewsletterSubscriberRows)(byEmail, altRows !== null && altRows !== void 0 ? altRows : []);
                            return [3 /*break*/, 6];
                        case 5:
                            _a = _b.sent();
                            return [3 /*break*/, 6];
                        case 6:
                            _i++;
                            return [3 /*break*/, 2];
                        case 7: return [2 /*return*/, (0, newsletter_subscribers_query_util_1.sortNewsletterSubscribersByActivity)(Array.from(byEmail.values()))];
                    }
                });
            });
        };
        AdminService_1.prototype.deleteNewsletterSubscriber = function (subscriberId) {
            return __awaiter(this, void 0, void 0, function () {
                var raw, deleted_1, asNumber, idx, rows, target, deleted;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            raw = String(subscriberId !== null && subscriberId !== void 0 ? subscriberId : '').trim();
                            if (!raw) {
                                throw new common_1.BadRequestException('Subscriber id is required');
                            }
                            if (!mongoose_1.Types.ObjectId.isValid(raw)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.deleteNewsletterByObjectId(raw)];
                        case 1:
                            deleted_1 = _b.sent();
                            if (!deleted_1) {
                                throw new common_1.NotFoundException('Subscriber not found');
                            }
                            return [4 /*yield*/, this.invalidateNewsletterSubscribersCache()];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, { id: raw }];
                        case 3:
                            asNumber = Number.parseInt(raw, 10);
                            if (!Number.isFinite(asNumber) || asNumber <= 0) {
                                throw new common_1.BadRequestException('Invalid subscriber id. Provide MongoDB _id or S.No (e.g. "1")');
                            }
                            idx = asNumber - 1;
                            return [4 /*yield*/, this.loadNewsletterSubscriberDocs()];
                        case 4:
                            rows = _b.sent();
                            target = ((_a = rows === null || rows === void 0 ? void 0 : rows[idx]) === null || _a === void 0 ? void 0 : _a._id) ? String(rows[idx]._id) : null;
                            if (!target) {
                                throw new common_1.NotFoundException('Subscriber not found');
                            }
                            return [4 /*yield*/, this.deleteNewsletterByObjectId(target)];
                        case 5:
                            deleted = _b.sent();
                            if (!deleted) {
                                throw new common_1.NotFoundException('Subscriber not found');
                            }
                            return [4 /*yield*/, this.invalidateNewsletterSubscribersCache()];
                        case 6:
                            _b.sent();
                            return [2 /*return*/, { id: target }];
                    }
                });
            });
        };
        AdminService_1.prototype.deleteNewsletterByObjectId = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var objectId, primary, primaryName, _i, _a, altName, alt, _b;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            objectId = new mongoose_1.Types.ObjectId(id);
                            return [4 /*yield*/, this.newsletterSubscriberModel
                                    .deleteOne({ _id: objectId })
                                    .exec()];
                        case 1:
                            primary = _d.sent();
                            if (primary.deletedCount > 0)
                                return [2 /*return*/, true];
                            _d.label = 2;
                        case 2:
                            _d.trys.push([2, 7, , 8]);
                            primaryName = this.newsletterSubscriberModel.collection.name;
                            _i = 0, _a = [
                                'newslettersubscribers',
                                'newsletter_subscribers',
                            ];
                            _d.label = 3;
                        case 3:
                            if (!(_i < _a.length)) return [3 /*break*/, 6];
                            altName = _a[_i];
                            if (altName === primaryName)
                                return [3 /*break*/, 5];
                            return [4 /*yield*/, this.newsletterSubscriberModel.db
                                    .collection(altName)
                                    .deleteOne({ _id: objectId })];
                        case 4:
                            alt = _d.sent();
                            if (((_c = alt.deletedCount) !== null && _c !== void 0 ? _c : 0) > 0)
                                return [2 /*return*/, true];
                            _d.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 3];
                        case 6: return [2 /*return*/, false];
                        case 7:
                            _b = _d.sent();
                            return [2 /*return*/, false];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        AdminService_1.prototype.resolveNewsletterSubscriberId = function (identifier) {
            return __awaiter(this, void 0, void 0, function () {
                var raw, asNumber, idx, rows, target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            raw = String(identifier !== null && identifier !== void 0 ? identifier : '').trim();
                            if (!raw)
                                throw new common_1.BadRequestException('Subscriber id is required');
                            if (mongoose_1.Types.ObjectId.isValid(raw))
                                return [2 /*return*/, raw];
                            asNumber = Number.parseInt(raw, 10);
                            if (!Number.isFinite(asNumber) || asNumber <= 0) {
                                throw new common_1.BadRequestException('Invalid subscriber id. Provide MongoDB _id or S.No (e.g. "1")');
                            }
                            idx = asNumber - 1;
                            return [4 /*yield*/, this.loadNewsletterSubscriberDocs()];
                        case 1:
                            rows = _b.sent();
                            target = ((_a = rows === null || rows === void 0 ? void 0 : rows[idx]) === null || _a === void 0 ? void 0 : _a._id) ? String(rows[idx]._id) : null;
                            if (!target)
                                throw new common_1.NotFoundException('Subscriber not found');
                            return [2 /*return*/, target];
                    }
                });
            });
        };
        /**
         * Set or toggle a newsletter subscriber's status.
         *
         * - When `status` is provided: sets explicitly (active/inactive)
         * - When `status` is omitted: toggles (1 ↔ 0)
         */
        AdminService_1.prototype.setOrToggleNewsletterSubscriberStatus = function (identifier, status) {
            return __awaiter(this, void 0, void 0, function () {
                var targetId, objectId, desired, newStatus, current, _a, cur, updated;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.resolveNewsletterSubscriberId(identifier)];
                        case 1:
                            targetId = _c.sent();
                            objectId = new mongoose_1.Types.ObjectId(targetId);
                            desired = status !== undefined ? String(status).trim().toLowerCase() : undefined;
                            newStatus = null;
                            return [4 /*yield*/, this.newsletterSubscriberModel
                                    .findById(objectId)
                                    .select('status')
                                    .lean()
                                    .exec()];
                        case 2:
                            _a = (_c.sent());
                            if (_a) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.findNewsletterStatusInAltCollection(objectId)];
                        case 3:
                            _a = (_c.sent());
                            _c.label = 4;
                        case 4:
                            current = _a;
                            if (!current)
                                throw new common_1.NotFoundException('Subscriber not found');
                            if (desired === undefined || desired === '') {
                                cur = Number(current.status) === 1 ? 1 : 0;
                                newStatus = cur === 1 ? 0 : 1;
                            }
                            else {
                                if (desired === 'active' || desired === '1')
                                    newStatus = 1;
                                if (desired === 'inactive' || desired === '0')
                                    newStatus = 0;
                                if (newStatus === null) {
                                    throw new common_1.BadRequestException('Invalid status. Use "active" or "inactive"');
                                }
                            }
                            return [4 /*yield*/, this.newsletterSubscriberModel
                                    .findByIdAndUpdate(objectId, { $set: { status: newStatus, updatedAt: new Date() } }, { new: true })
                                    .lean()
                                    .exec()];
                        case 5:
                            updated = (_b = (_c.sent())) !== null && _b !== void 0 ? _b : null;
                            if (!!updated) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.updateNewsletterStatusInAltCollection(objectId, newStatus)];
                        case 6:
                            updated = _c.sent();
                            _c.label = 7;
                        case 7:
                            if (!updated)
                                throw new common_1.NotFoundException('Subscriber not found');
                            return [4 /*yield*/, this.invalidateNewsletterSubscribersCache()];
                        case 8:
                            _c.sent();
                            return [2 /*return*/, this.formatNewsletterSubscriberRow(updated, 1)];
                    }
                });
            });
        };
        AdminService_1.prototype.findNewsletterStatusInAltCollection = function (objectId) {
            return __awaiter(this, void 0, void 0, function () {
                var primaryName, _i, _a, altName, row, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 5, , 6]);
                            primaryName = this.newsletterSubscriberModel.collection.name;
                            _i = 0, _a = [
                                'newslettersubscribers',
                                'newsletter_subscribers',
                            ];
                            _c.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            altName = _a[_i];
                            if (altName === primaryName)
                                return [3 /*break*/, 3];
                            return [4 /*yield*/, this.newsletterSubscriberModel.db
                                    .collection(altName)
                                    .findOne({ _id: objectId }, { projection: { status: 1 } })];
                        case 2:
                            row = _c.sent();
                            if (row)
                                return [2 /*return*/, row];
                            _c.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, null];
                        case 5:
                            _b = _c.sent();
                            return [2 /*return*/, null];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        AdminService_1.prototype.updateNewsletterStatusInAltCollection = function (objectId, newStatus) {
            return __awaiter(this, void 0, void 0, function () {
                var primaryName, _i, _a, altName, res, updated, _b;
                var _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _e.trys.push([0, 5, , 6]);
                            primaryName = this.newsletterSubscriberModel.collection.name;
                            _i = 0, _a = [
                                'newslettersubscribers',
                                'newsletter_subscribers',
                            ];
                            _e.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            altName = _a[_i];
                            if (altName === primaryName)
                                return [3 /*break*/, 3];
                            return [4 /*yield*/, this.newsletterSubscriberModel.db
                                    .collection(altName)
                                    .findOneAndUpdate({ _id: objectId }, { $set: { status: newStatus, updatedAt: new Date() } }, { returnDocument: 'after' })];
                        case 2:
                            res = _e.sent();
                            updated = (_d = (_c = res === null || res === void 0 ? void 0 : res.value) !== null && _c !== void 0 ? _c : res) !== null && _d !== void 0 ? _d : null;
                            if (updated)
                                return [2 /*return*/, updated];
                            _e.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, null];
                        case 5:
                            _b = _e.sent();
                            return [2 /*return*/, null];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Contact messages list for admin table.
         *
         * Sample Mongo (Mongoose) query:
         *   this.contactMessageModel.find({}, { name: 1, email: 1, phoneNumber: 1 })
         *     .sort({ createdAt: -1 })
         *     .lean()
         *     .exec();
         */
        AdminService_1.prototype.listContactMessages = function () {
            return __awaiter(this, void 0, void 0, function () {
                var rows;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.contactMessageModel
                                .find({
                                $or: [
                                    { inquiryType: 'contact' },
                                    { inquiryType: { $exists: false } },
                                    { inquiryType: null },
                                    { inquiryType: '' },
                                ],
                            })
                                .select('name email phoneNumber message subject createdAt inquiryType')
                                .sort({ createdAt: -1, _id: -1 })
                                .lean()
                                .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, (rows !== null && rows !== void 0 ? rows : []).map(function (r, idx) {
                                    var _a, _b, _c, _d, _e;
                                    return ({
                                        s_no: idx + 1,
                                        id: String(r._id),
                                        name: String((_a = r.name) !== null && _a !== void 0 ? _a : ''),
                                        email: String((_b = r.email) !== null && _b !== void 0 ? _b : ''),
                                        phoneNo: String((_c = r.phoneNumber) !== null && _c !== void 0 ? _c : ''),
                                        message: typeof r.message === 'string'
                                            ? String(r.message).trim()
                                            : '',
                                        subject: String((_d = r.subject) !== null && _d !== void 0 ? _d : ''),
                                        createdAt: (_e = r.createdAt) !== null && _e !== void 0 ? _e : null,
                                        inquiryType: 'contact',
                                    });
                                })];
                    }
                });
            });
        };
        AdminService_1.prototype.collectValidObjectIds = function (values) {
            var out = [];
            var seen = new Set();
            for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                var raw = values_1[_i];
                var id = String(raw !== null && raw !== void 0 ? raw : '').trim();
                if (!id || seen.has(id) || !mongoose_1.Types.ObjectId.isValid(id)) {
                    continue;
                }
                seen.add(id);
                out.push(new mongoose_1.Types.ObjectId(id));
            }
            return out;
        };
        AdminService_1.prototype.mapProductInquiryRow = function (r, idx, lookups) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
            var manufacturerId = String((_a = r.manufacturerId) !== null && _a !== void 0 ? _a : '').trim();
            var categoryId = String((_b = r.categoryId) !== null && _b !== void 0 ? _b : '').trim();
            var productId = String((_c = r.productId) !== null && _c !== void 0 ? _c : '').trim();
            var product = productId ? lookups.productById.get(productId) : undefined;
            var resolvedManufacturerId = manufacturerId ||
                ((product === null || product === void 0 ? void 0 : product.manufacturerId) ? String(product.manufacturerId) : '');
            var resolvedCategoryId = categoryId || ((product === null || product === void 0 ? void 0 : product.categoryId) ? String(product.categoryId) : '');
            var manufacturer = resolvedManufacturerId
                ? lookups.manufacturerById.get(resolvedManufacturerId)
                : undefined;
            var category = resolvedCategoryId
                ? lookups.categoryById.get(resolvedCategoryId)
                : undefined;
            var storedUrn = String((_d = r.urnNumber) !== null && _d !== void 0 ? _d : '').trim();
            var urnNumber = storedUrn || String((_e = product === null || product === void 0 ? void 0 : product.urnNo) !== null && _e !== void 0 ? _e : '').trim();
            return {
                s_no: typeof r.s_no === 'number' ? r.s_no : idx + 1,
                id: String((_g = (_f = r.id) !== null && _f !== void 0 ? _f : r._id) !== null && _g !== void 0 ? _g : ''),
                name: String((_h = r.name) !== null && _h !== void 0 ? _h : ''),
                email: String((_j = r.email) !== null && _j !== void 0 ? _j : ''),
                phoneNo: String((_l = (_k = r.phoneNo) !== null && _k !== void 0 ? _k : r.phoneNumber) !== null && _l !== void 0 ? _l : ''),
                message: typeof r.message === 'string' ? String(r.message).trim() : '',
                designation: String((_m = r.designation) !== null && _m !== void 0 ? _m : ''),
                organisation: String((_o = r.organisation) !== null && _o !== void 0 ? _o : ''),
                manufacturerId: resolvedManufacturerId,
                manufacturerName: String((_p = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.manufacturerName) !== null && _p !== void 0 ? _p : '').trim(),
                gpInternalId: String((_q = manufacturer === null || manufacturer === void 0 ? void 0 : manufacturer.gpInternalId) !== null && _q !== void 0 ? _q : '').trim() || undefined,
                productId: productId,
                productName: String((_r = product === null || product === void 0 ? void 0 : product.productName) !== null && _r !== void 0 ? _r : '').trim(),
                categoryId: resolvedCategoryId,
                categoryName: String((_s = category === null || category === void 0 ? void 0 : category.category_name) !== null && _s !== void 0 ? _s : '').trim(),
                category_id: (category === null || category === void 0 ? void 0 : category.category_id) !== undefined && (category === null || category === void 0 ? void 0 : category.category_id) !== null
                    ? Number(category.category_id)
                    : undefined,
                urnNumber: urnNumber,
                urnNo: urnNumber,
                eoiNo: String((_t = product === null || product === void 0 ? void 0 : product.eoiNo) !== null && _t !== void 0 ? _t : '').trim(),
                createdAt: (_u = r.createdAt) !== null && _u !== void 0 ? _u : null,
                inquiryType: 'product',
            };
        };
        AdminService_1.prototype.enrichProductInquiries = function (rows) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerIdSet, categoryIdSet, productIdSet, _i, rows_2, r, manufacturerId, categoryId, productId, productObjectIds, products, _a, _b, products_1, product, manufacturerId, categoryId, manufacturerObjectIds, categoryObjectIds, _c, manufacturers, categories, manufacturerById, categoryById, productById;
                var _this = this;
                var _d, _e, _f, _g, _h;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            if (!rows.length) {
                                return [2 /*return*/, []];
                            }
                            manufacturerIdSet = new Set();
                            categoryIdSet = new Set();
                            productIdSet = new Set();
                            for (_i = 0, rows_2 = rows; _i < rows_2.length; _i++) {
                                r = rows_2[_i];
                                manufacturerId = String((_d = r.manufacturerId) !== null && _d !== void 0 ? _d : '').trim();
                                categoryId = String((_e = r.categoryId) !== null && _e !== void 0 ? _e : '').trim();
                                productId = String((_f = r.productId) !== null && _f !== void 0 ? _f : '').trim();
                                if (manufacturerId)
                                    manufacturerIdSet.add(manufacturerId);
                                if (categoryId)
                                    categoryIdSet.add(categoryId);
                                if (productId)
                                    productIdSet.add(productId);
                            }
                            productObjectIds = this.collectValidObjectIds(productIdSet);
                            if (!productObjectIds.length) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.productModel
                                    .find({ _id: { $in: productObjectIds } })
                                    .select('_id productName urnNo eoiNo categoryId manufacturerId')
                                    .lean()
                                    .exec()];
                        case 1:
                            _a = _j.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = [];
                            _j.label = 3;
                        case 3:
                            products = _a;
                            for (_b = 0, products_1 = products; _b < products_1.length; _b++) {
                                product = products_1[_b];
                                manufacturerId = String((_g = product.manufacturerId) !== null && _g !== void 0 ? _g : '').trim();
                                categoryId = String((_h = product.categoryId) !== null && _h !== void 0 ? _h : '').trim();
                                if (manufacturerId)
                                    manufacturerIdSet.add(manufacturerId);
                                if (categoryId)
                                    categoryIdSet.add(categoryId);
                            }
                            manufacturerObjectIds = this.collectValidObjectIds(manufacturerIdSet);
                            categoryObjectIds = this.collectValidObjectIds(categoryIdSet);
                            return [4 /*yield*/, Promise.all([
                                    manufacturerObjectIds.length
                                        ? this.manufacturerModel
                                            .find({ _id: { $in: manufacturerObjectIds } })
                                            .select('_id manufacturerName gpInternalId')
                                            .lean()
                                            .exec()
                                        : Promise.resolve([]),
                                    categoryObjectIds.length
                                        ? this.categoryModel
                                            .find({ _id: { $in: categoryObjectIds } })
                                            .select('_id category_name category_id')
                                            .lean()
                                            .exec()
                                        : Promise.resolve([]),
                                ])];
                        case 4:
                            _c = _j.sent(), manufacturers = _c[0], categories = _c[1];
                            manufacturerById = new Map(manufacturers.map(function (m) { return [String(m._id), m]; }));
                            categoryById = new Map(categories.map(function (c) { return [String(c._id), c]; }));
                            productById = new Map(products.map(function (p) { return [String(p._id), p]; }));
                            return [2 /*return*/, rows.map(function (r, idx) {
                                    return _this.mapProductInquiryRow(r, idx, {
                                        manufacturerById: manufacturerById,
                                        categoryById: categoryById,
                                        productById: productById,
                                    });
                                })];
                    }
                });
            });
        };
        AdminService_1.prototype.listProductInquiries = function () {
            return __awaiter(this, void 0, void 0, function () {
                var rows;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.contactMessageModel
                                .find({ inquiryType: 'product' })
                                .select('name email phoneNumber message designation organisation manufacturerId productId categoryId urnNumber createdAt')
                                .sort({ createdAt: -1, _id: -1 })
                                .lean()
                                .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, this.enrichProductInquiries((rows !== null && rows !== void 0 ? rows : []).map(function (r) {
                                    var _a;
                                    return (__assign(__assign({}, r), { id: String(r._id), phoneNo: String((_a = r.phoneNumber) !== null && _a !== void 0 ? _a : '') }));
                                }))];
                    }
                });
            });
        };
        /** Single product inquiry for admin view modal. */
        AdminService_1.prototype.getProductInquiryById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var objectId, msg, enriched;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            try {
                                objectId = new mongoose_1.Types.ObjectId(id);
                            }
                            catch (_d) {
                                throw new common_1.BadRequestException('Invalid inquiry id');
                            }
                            return [4 /*yield*/, this.contactMessageModel
                                    .findOne({ _id: objectId, inquiryType: 'product' })
                                    .select('name email phoneNumber message designation organisation manufacturerId productId categoryId urnNumber createdAt')
                                    .lean()
                                    .exec()];
                        case 1:
                            msg = _c.sent();
                            if (!msg) {
                                throw new common_1.NotFoundException('Product inquiry not found');
                            }
                            return [4 /*yield*/, this.enrichProductInquiries([
                                    __assign(__assign({}, msg), { id: String(msg._id), phoneNo: String((_a = msg.phoneNumber) !== null && _a !== void 0 ? _a : '') }),
                                ])];
                        case 2:
                            enriched = (_c.sent())[0];
                            return [2 /*return*/, __assign(__assign({}, enriched), { phone: (_b = enriched === null || enriched === void 0 ? void 0 : enriched.phoneNo) !== null && _b !== void 0 ? _b : '' })];
                    }
                });
            });
        };
        /** Single contact message for admin "view" modal/page. */
        AdminService_1.prototype.getContactMessageById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var objectId, msg;
                var _a, _b, _c, _d, _e, _f, _g, _h;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            try {
                                objectId = new mongoose_1.Types.ObjectId(id);
                            }
                            catch (_k) {
                                throw new common_1.BadRequestException('Invalid contact id');
                            }
                            return [4 /*yield*/, this.contactMessageModel
                                    .findById(objectId)
                                    .select('name email phoneNumber message subject createdAt inquiryType')
                                    .lean()
                                    .exec()];
                        case 1:
                            msg = _j.sent();
                            if (!msg) {
                                throw new common_1.NotFoundException('Contact message not found');
                            }
                            return [2 /*return*/, {
                                    id: String(msg._id),
                                    name: String((_a = msg.name) !== null && _a !== void 0 ? _a : ''),
                                    email: String((_b = msg.email) !== null && _b !== void 0 ? _b : ''),
                                    phone: String((_c = msg.phoneNumber) !== null && _c !== void 0 ? _c : ''),
                                    phoneNo: String((_d = msg.phoneNumber) !== null && _d !== void 0 ? _d : ''),
                                    subject: String((_e = msg.subject) !== null && _e !== void 0 ? _e : ''),
                                    message: String((_f = msg.message) !== null && _f !== void 0 ? _f : ''),
                                    createdAt: (_g = msg.createdAt) !== null && _g !== void 0 ? _g : null,
                                    inquiryType: String((_h = msg.inquiryType) !== null && _h !== void 0 ? _h : 'contact'),
                                }];
                    }
                });
            });
        };
        /** Permanently deletes a contact message by MongoDB id. */
        AdminService_1.prototype.deleteContactMessage = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var objectId, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            try {
                                objectId = new mongoose_1.Types.ObjectId(id);
                            }
                            catch (_b) {
                                throw new common_1.BadRequestException('Invalid contact id');
                            }
                            return [4 /*yield*/, this.contactMessageModel
                                    .deleteOne({ _id: objectId })
                                    .exec()];
                        case 1:
                            res = _a.sent();
                            if (res.deletedCount === 0) {
                                throw new common_1.NotFoundException('Contact message not found');
                            }
                            return [2 /*return*/, { id: id }];
                    }
                });
            });
        };
        /**
         * Toggle active flag for a team member (partner): status 1 ↔ 0.
         * Same semantics as partners PATCH /partners/status; excludes soft-deleted (2).
         */
        AdminService_1.prototype.updateTeamMemberStatus = function (_vendorId, teamMemberId) {
            return __awaiter(this, void 0, void 0, function () {
                var memberObjectId, member, current, newStatus, updated, obj;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            try {
                                memberObjectId = new mongoose_1.Types.ObjectId(teamMemberId);
                            }
                            catch (_b) {
                                throw new common_1.BadRequestException('Invalid ID format');
                            }
                            return [4 /*yield*/, this.vendorUserModel
                                    .findOne({
                                    _id: memberObjectId,
                                    type: 'staff',
                                    status: { $ne: 2 },
                                })
                                    .exec()];
                        case 1:
                            member = _a.sent();
                            if (!member) {
                                throw new common_1.NotFoundException('Team member not found');
                            }
                            current = member.status;
                            if (current === 1) {
                                newStatus = 0;
                            }
                            else if (current === 0) {
                                newStatus = 1;
                            }
                            else {
                                throw new common_1.BadRequestException("Invalid team member status: ".concat(current));
                            }
                            return [4 /*yield*/, this.vendorUserModel
                                    .findByIdAndUpdate(memberObjectId, { status: newStatus, updatedAt: new Date() }, { new: true })
                                    .exec()];
                        case 2:
                            updated = _a.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Team member not found');
                            }
                            obj = updated.toObject();
                            delete obj.password;
                            delete obj.otp;
                            return [2 /*return*/, obj];
                    }
                });
            });
        };
        AdminService_1.prototype.updateManufacturer = function (id, updateDto, imagePath) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerId_1, error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            manufacturerId_1 = new mongoose_1.Types.ObjectId(id);
                            return [4 /*yield*/, this.manufacturerIdGeneration.withTransaction(function (session) { return __awaiter(_this, void 0, void 0, function () {
                                    var existing, isUnverified, updateData, auto, rawGp, rawIni, dupInitial, dupGp, manufacturer;
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0: return [4 /*yield*/, this.manufacturerModel
                                                    .findById(manufacturerId_1)
                                                    .session(session)
                                                    .exec()];
                                            case 1:
                                                existing = _b.sent();
                                                if (!existing) {
                                                    throw new common_1.NotFoundException('Manufacturer not found');
                                                }
                                                isUnverified = ((_a = existing.manufacturerStatus) !== null && _a !== void 0 ? _a : 0) !== 1;
                                                updateData = {
                                                    manufacturerName: updateDto.manufacturerName,
                                                    updatedAt: new Date(),
                                                };
                                                if (imagePath) {
                                                    updateData.manufacturerImage = imagePath;
                                                }
                                                if (!isUnverified) return [3 /*break*/, 3];
                                                return [4 /*yield*/, this.manufacturerIdGeneration.resolveAutoIdentifiersForUnverified(updateDto.manufacturerName, existing._id, {
                                                        manufacturerName: existing.manufacturerName,
                                                        manufacturerInitial: existing.manufacturerInitial,
                                                        gpInternalId: existing.gpInternalId,
                                                    }, session)];
                                            case 2:
                                                auto = _b.sent();
                                                updateData.manufacturerInitial = auto.manufacturerInitial;
                                                updateData.gpInternalId = auto.gpInternalId;
                                                return [3 /*break*/, 4];
                                            case 3:
                                                rawGp = updateDto.gpInternalId !== undefined
                                                    ? String(updateDto.gpInternalId).trim()
                                                    : '';
                                                rawIni = updateDto.manufacturerInitial !== undefined
                                                    ? String(updateDto.manufacturerInitial).trim()
                                                    : '';
                                                if (rawGp) {
                                                    updateData.gpInternalId = rawGp.toUpperCase();
                                                }
                                                if (rawIni) {
                                                    updateData.manufacturerInitial = rawIni.toUpperCase();
                                                }
                                                _b.label = 4;
                                            case 4:
                                                if (!(updateData.manufacturerInitial !== undefined)) return [3 /*break*/, 6];
                                                return [4 /*yield*/, this.manufacturerModel
                                                        .findOne({
                                                        manufacturerInitial: updateData.manufacturerInitial,
                                                        _id: { $ne: existing._id },
                                                    })
                                                        .session(session)
                                                        .select('_id')
                                                        .lean()
                                                        .exec()];
                                            case 5:
                                                dupInitial = _b.sent();
                                                if (dupInitial) {
                                                    throw new common_1.ConflictException('manufacturerInitial already exists on another manufacturer');
                                                }
                                                _b.label = 6;
                                            case 6:
                                                if (!(updateData.gpInternalId !== undefined)) return [3 /*break*/, 8];
                                                return [4 /*yield*/, this.manufacturerModel
                                                        .findOne({
                                                        gpInternalId: updateData.gpInternalId,
                                                        _id: { $ne: existing._id },
                                                    })
                                                        .session(session)
                                                        .select('_id')
                                                        .lean()
                                                        .exec()];
                                            case 7:
                                                dupGp = _b.sent();
                                                if (dupGp) {
                                                    throw new common_1.ConflictException('gpInternalId already exists on another manufacturer');
                                                }
                                                _b.label = 8;
                                            case 8: return [4 /*yield*/, this.manufacturerModel
                                                    .findByIdAndUpdate(manufacturerId_1, updateData, {
                                                    new: true,
                                                    session: session,
                                                })
                                                    .exec()];
                                            case 9:
                                                manufacturer = _b.sent();
                                                if (!manufacturer) {
                                                    throw new common_1.NotFoundException('Manufacturer not found');
                                                }
                                                return [2 /*return*/, manufacturer];
                                        }
                                    });
                                }); })];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_1 = _a.sent();
                            if ((error_1 === null || error_1 === void 0 ? void 0 : error_1.code) === 11000) {
                                throw new common_1.ConflictException('Duplicate manufacturer identifier (initial or internal id)');
                            }
                            if (error_1 instanceof common_1.NotFoundException ||
                                error_1 instanceof common_1.ConflictException) {
                                throw error_1;
                            }
                            if (error_1.name === 'CastError') {
                                throw new common_1.BadRequestException('Invalid manufacturer ID format');
                            }
                            throw new common_1.BadRequestException(error_1.message || 'Failed to update manufacturer');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        AdminService_1.prototype.updateManufacturerStatus = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerId, manufacturer, currentStatus, newStatus, updatedManufacturer, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            manufacturerId = new mongoose_1.Types.ObjectId(id);
                            return [4 /*yield*/, this.manufacturerModel
                                    .findById(manufacturerId)
                                    .exec()];
                        case 1:
                            manufacturer = _a.sent();
                            if (!manufacturer) {
                                throw new common_1.NotFoundException('Manufacturer not found');
                            }
                            currentStatus = manufacturer.manufacturerStatus;
                            newStatus = currentStatus === 1 ? 2 : 1;
                            return [4 /*yield*/, this.manufacturerModel
                                    .findByIdAndUpdate(manufacturerId, {
                                    manufacturerStatus: newStatus,
                                    updatedAt: new Date(),
                                }, { new: true })
                                    .exec()];
                        case 2:
                            updatedManufacturer = _a.sent();
                            return [2 /*return*/, updatedManufacturer];
                        case 3:
                            error_2 = _a.sent();
                            if (error_2 instanceof common_1.NotFoundException) {
                                throw error_2;
                            }
                            if (error_2.name === 'CastError') {
                                throw new common_1.BadRequestException('Invalid manufacturer ID format');
                            }
                            throw new common_1.BadRequestException(error_2.message || 'Failed to update manufacturer status');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Platform-wide metrics for the admin dashboard home screen.
         * Honors global filters (period, category, productStatus, region, etc.).
         */
        AdminService_1.prototype.getDashboardMetrics = function () {
            return __awaiter(this, arguments, void 0, function (filters) {
                var now, manufacturerMatch, productMatch, manufacturerPipeline, productPipeline, _a, manufacturerFacet, productFacet, charts, mfgPayload, productPayload, manufacturers, _i, _b, row, key, productStatusCounts, _c, _d, row, expiredCount, certifiedActive, byProductStatus, urnCountMap, _e, _f, row, byUrnStatus, proposalPending, certificatePublished, inCertificationPipeline, s;
                var _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15;
                if (filters === void 0) { filters = { granularity: 'monthly' }; }
                return __generator(this, function (_16) {
                    switch (_16.label) {
                        case 0:
                            now = new Date();
                            manufacturerMatch = (0, dashboard_metrics_filters_util_1.buildManufacturerSnapshotMatch)(filters);
                            productMatch = (0, dashboard_metrics_filters_util_1.buildProductSnapshotMatch)(filters, now);
                            manufacturerPipeline = [];
                            if (Object.keys(manufacturerMatch).length > 0) {
                                manufacturerPipeline.push({ $match: manufacturerMatch });
                            }
                            manufacturerPipeline.push({
                                $facet: {
                                    total: [{ $count: 'count' }],
                                    byStatus: [
                                        { $group: { _id: '$manufacturerStatus', count: { $sum: 1 } } },
                                    ],
                                    verifiedActive: [
                                        { $match: { manufacturerStatus: 1, vendor_status: 1 } },
                                        { $count: 'count' },
                                    ],
                                    verifiedInactive: [
                                        {
                                            $match: {
                                                manufacturerStatus: 1,
                                                vendor_status: { $ne: 1 },
                                            },
                                        },
                                        { $count: 'count' },
                                    ],
                                },
                            });
                            productPipeline = [];
                            if (Object.keys(productMatch).length > 0) {
                                productPipeline.push({ $match: productMatch });
                            }
                            productPipeline.push({
                                $facet: {
                                    total: [{ $count: 'count' }],
                                    distinctUrns: [{ $group: { _id: '$urnNo' } }, { $count: 'count' }],
                                    byProductStatus: [
                                        { $group: { _id: '$productStatus', count: { $sum: 1 } } },
                                    ],
                                    byUrnStatus: [
                                        { $group: { _id: '$urnStatus', count: { $sum: 1 } } },
                                    ],
                                    expired: [
                                        { $match: (0, expired_product_filter_1.matchExpiredProducts)(now) },
                                        { $count: 'count' },
                                    ],
                                },
                            });
                            return [4 /*yield*/, Promise.all([
                                    this.manufacturerModel
                                        .aggregate(manufacturerPipeline)
                                        .exec(),
                                    this.productModel
                                        .aggregate(productPipeline)
                                        .exec(),
                                    this.buildDashboardCharts(filters),
                                ])];
                        case 1:
                            _a = _16.sent(), manufacturerFacet = _a[0], productFacet = _a[1], charts = _a[2];
                            mfgPayload = (_g = manufacturerFacet[0]) !== null && _g !== void 0 ? _g : {
                                total: [],
                                byStatus: [],
                                verifiedActive: [],
                                verifiedInactive: [],
                            };
                            productPayload = (_h = productFacet[0]) !== null && _h !== void 0 ? _h : {
                                total: [],
                                distinctUrns: [],
                                byProductStatus: [],
                                byUrnStatus: [],
                                expired: [],
                            };
                            manufacturers = {
                                verified: 0,
                                unverified: 0,
                                inactivePending: 0,
                                verifiedActive: (_l = (_k = (_j = mfgPayload.verifiedActive) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.count) !== null && _l !== void 0 ? _l : 0,
                                verifiedInactive: (_p = (_o = (_m = mfgPayload.verifiedInactive) === null || _m === void 0 ? void 0 : _m[0]) === null || _o === void 0 ? void 0 : _o.count) !== null && _p !== void 0 ? _p : 0,
                            };
                            for (_i = 0, _b = (_q = mfgPayload.byStatus) !== null && _q !== void 0 ? _q : []; _i < _b.length; _i++) {
                                row = _b[_i];
                                key = (0, admin_dashboard_metrics_util_1.manufacturerStatusKey)(Number((_r = row._id) !== null && _r !== void 0 ? _r : 0));
                                manufacturers[key] += (_s = row.count) !== null && _s !== void 0 ? _s : 0;
                            }
                            productStatusCounts = {};
                            for (_c = 0, _d = (_t = productPayload.byProductStatus) !== null && _t !== void 0 ? _t : []; _c < _d.length; _c++) {
                                row = _d[_c];
                                if ((row === null || row === void 0 ? void 0 : row._id) !== undefined && (row === null || row === void 0 ? void 0 : row._id) !== null) {
                                    productStatusCounts[Number(row._id)] = (_u = row.count) !== null && _u !== void 0 ? _u : 0;
                                }
                            }
                            expiredCount = (_x = (_w = (_v = productPayload.expired) === null || _v === void 0 ? void 0 : _v[0]) === null || _w === void 0 ? void 0 : _w.count) !== null && _x !== void 0 ? _x : 0;
                            certifiedActive = (_y = productStatusCounts[2]) !== null && _y !== void 0 ? _y : 0;
                            byProductStatus = {
                                pending: (_z = productStatusCounts[0]) !== null && _z !== void 0 ? _z : 0,
                                approved: (_0 = productStatusCounts[1]) !== null && _0 !== void 0 ? _0 : 0,
                                certified: Math.max(0, certifiedActive - expiredCount),
                                rejected: (_1 = productStatusCounts[3]) !== null && _1 !== void 0 ? _1 : 0,
                                expired: expiredCount,
                            };
                            urnCountMap = new Map();
                            for (_e = 0, _f = (_2 = productPayload.byUrnStatus) !== null && _2 !== void 0 ? _2 : []; _e < _f.length; _e++) {
                                row = _f[_e];
                                if ((row === null || row === void 0 ? void 0 : row._id) !== undefined && (row === null || row === void 0 ? void 0 : row._id) !== null) {
                                    urnCountMap.set(Number(row._id), (_3 = row.count) !== null && _3 !== void 0 ? _3 : 0);
                                }
                            }
                            byUrnStatus = Object.keys(admin_dashboard_metrics_util_1.URN_STATUS_LABELS)
                                .map(function (k) { return Number(k); })
                                .sort(function (a, b) { return a - b; })
                                .map(function (status) {
                                var _a;
                                return ({
                                    status: status,
                                    label: (0, admin_dashboard_metrics_util_1.urnStatusLabel)(status),
                                    count: (_a = urnCountMap.get(status)) !== null && _a !== void 0 ? _a : 0,
                                });
                            });
                            proposalPending = (_4 = urnCountMap.get(0)) !== null && _4 !== void 0 ? _4 : 0;
                            certificatePublished = (_5 = urnCountMap.get(11)) !== null && _5 !== void 0 ? _5 : 0;
                            inCertificationPipeline = 0;
                            for (s = 1; s <= 10; s += 1) {
                                inCertificationPipeline += (_6 = urnCountMap.get(s)) !== null && _6 !== void 0 ? _6 : 0;
                            }
                            return [2 /*return*/, {
                                    totalManufacturers: (_9 = (_8 = (_7 = mfgPayload.total) === null || _7 === void 0 ? void 0 : _7[0]) === null || _8 === void 0 ? void 0 : _8.count) !== null && _9 !== void 0 ? _9 : 0,
                                    manufacturers: manufacturers,
                                    productSubmissions: {
                                        total: (_12 = (_11 = (_10 = productPayload.total) === null || _10 === void 0 ? void 0 : _10[0]) === null || _11 === void 0 ? void 0 : _11.count) !== null && _12 !== void 0 ? _12 : 0,
                                        totalUrns: (_15 = (_14 = (_13 = productPayload.distinctUrns) === null || _13 === void 0 ? void 0 : _13[0]) === null || _14 === void 0 ? void 0 : _14.count) !== null && _15 !== void 0 ? _15 : 0,
                                    },
                                    certificationProgress: {
                                        byProductStatus: byProductStatus,
                                        byUrnStatus: byUrnStatus,
                                        summary: {
                                            certifiedProducts: byProductStatus.certified,
                                            inCertificationPipeline: inCertificationPipeline,
                                            proposalPending: proposalPending,
                                            certificatePublished: certificatePublished,
                                        },
                                    },
                                    charts: charts,
                                }];
                    }
                });
            });
        };
        /**
         * Dashboard metrics filtered by staff role grants. Platform admins see all sections.
         */
        AdminService_1.prototype.getDashboardMetricsForUser = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var full, appliedFilters, grants;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getDashboardMetrics(input.filters)];
                        case 1:
                            full = _a.sent();
                            appliedFilters = this.buildAppliedFiltersPayload(input.query, input.filters);
                            if ((0, platform_admin_util_1.isPlatformAdminUser)({ role: input.role, type: input.type })) {
                                return [2 /*return*/, __assign(__assign({}, full), { visibleSections: {
                                            manufacturers: true,
                                            products: true,
                                            certification: true,
                                        }, appliedFilters: appliedFilters })];
                            }
                            return [4 /*yield*/, this.rbacService.getStaffPermissions(undefined, input.userId)];
                        case 2:
                            grants = _a.sent();
                            return [2 /*return*/, (0, admin_dashboard_permissions_util_1.filterDashboardMetricsByPermissions)(full, grants, appliedFilters)];
                    }
                });
            });
        };
        AdminService_1.prototype.getCertifiedVsUncertifiedProductsForUser = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var metrics, chartBlock, totalProducts, certifiedProducts, uncertifiedProducts;
                var _a, _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0: return [4 /*yield*/, this.getDashboardMetricsForUser(input)];
                        case 1:
                            metrics = _g.sent();
                            chartBlock = (_a = metrics.charts) === null || _a === void 0 ? void 0 : _a.certifiedVsUncertified;
                            if (chartBlock) {
                                return [2 /*return*/, {
                                        appliedFilters: metrics.appliedFilters,
                                        totals: chartBlock.totals,
                                        chart: chartBlock.chart,
                                    }];
                            }
                            totalProducts = (_c = (_b = metrics.productSubmissions) === null || _b === void 0 ? void 0 : _b.total) !== null && _c !== void 0 ? _c : 0;
                            certifiedProducts = (_f = (_e = (_d = metrics.certificationProgress) === null || _d === void 0 ? void 0 : _d.summary) === null || _e === void 0 ? void 0 : _e.certifiedProducts) !== null && _f !== void 0 ? _f : 0;
                            uncertifiedProducts = Math.max(0, totalProducts - certifiedProducts);
                            return [2 /*return*/, {
                                    totals: {
                                        totalProducts: totalProducts,
                                        certifiedProducts: certifiedProducts,
                                        uncertifiedProducts: uncertifiedProducts,
                                    },
                                    chart: [
                                        { key: 'certified', label: 'Certified', count: certifiedProducts },
                                        { key: 'uncertified', label: 'Uncertified', count: uncertifiedProducts },
                                    ],
                                }];
                    }
                });
            });
        };
        AdminService_1.prototype.getVerifiedVsUnverifiedManufacturersForUser = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var metrics, manufacturers, verified, unverified;
                var _a, _b, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0: return [4 /*yield*/, this.getDashboardMetricsForUser(input)];
                        case 1:
                            metrics = _h.sent();
                            manufacturers = (_a = metrics.manufacturers) !== null && _a !== void 0 ? _a : {
                                verified: 0,
                                unverified: 0,
                                inactivePending: 0,
                                verifiedActive: 0,
                                verifiedInactive: 0,
                            };
                            verified = (_b = manufacturers.verified) !== null && _b !== void 0 ? _b : 0;
                            unverified = ((_c = manufacturers.unverified) !== null && _c !== void 0 ? _c : 0) + ((_d = manufacturers.inactivePending) !== null && _d !== void 0 ? _d : 0);
                            return [2 /*return*/, {
                                    totals: {
                                        totalManufacturers: (_e = metrics.totalManufacturers) !== null && _e !== void 0 ? _e : 0,
                                        verifiedManufacturers: verified,
                                        unverifiedManufacturers: unverified,
                                        verifiedActive: (_f = manufacturers.verifiedActive) !== null && _f !== void 0 ? _f : 0,
                                        verifiedInactive: (_g = manufacturers.verifiedInactive) !== null && _g !== void 0 ? _g : 0,
                                    },
                                    chart: [
                                        { key: 'verified', label: 'Verified', count: verified },
                                        { key: 'unverified', label: 'Unverified', count: unverified },
                                    ],
                                }];
                    }
                });
            });
        };
        AdminService_1.prototype.getExpiredProductsImpactForUser = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var metrics, byProductStatus, expiredProducts, activeCertifiedProducts, certifiedProductsTotal, expiredImpactPercent;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, this.getDashboardMetricsForUser(input)];
                        case 1:
                            metrics = _d.sent();
                            byProductStatus = (_a = metrics.certificationProgress) === null || _a === void 0 ? void 0 : _a.byProductStatus;
                            expiredProducts = (_b = byProductStatus === null || byProductStatus === void 0 ? void 0 : byProductStatus.expired) !== null && _b !== void 0 ? _b : 0;
                            activeCertifiedProducts = (_c = byProductStatus === null || byProductStatus === void 0 ? void 0 : byProductStatus.certified) !== null && _c !== void 0 ? _c : 0;
                            certifiedProductsTotal = activeCertifiedProducts + expiredProducts;
                            expiredImpactPercent = certifiedProductsTotal > 0
                                ? Number(((expiredProducts / certifiedProductsTotal) * 100).toFixed(2))
                                : 0;
                            return [2 /*return*/, {
                                    totals: {
                                        expiredProducts: expiredProducts,
                                        activeCertifiedProducts: activeCertifiedProducts,
                                        certifiedProductsTotal: certifiedProductsTotal,
                                        expiredImpactPercent: expiredImpactPercent,
                                    },
                                    chart: [
                                        { key: 'activeCertified', label: 'Active Certified', count: activeCertifiedProducts },
                                        { key: 'expired', label: 'Expired', count: expiredProducts },
                                    ],
                                }];
                    }
                });
            });
        };
        AdminService_1.prototype.getRejectedProductsAnalyticsForUser = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var metrics, totalProducts, rejectedProducts, nonRejectedProducts, rejectionRatePercent;
                var _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0: return [4 /*yield*/, this.getDashboardMetricsForUser(input)];
                        case 1:
                            metrics = _f.sent();
                            totalProducts = (_b = (_a = metrics.productSubmissions) === null || _a === void 0 ? void 0 : _a.total) !== null && _b !== void 0 ? _b : 0;
                            rejectedProducts = (_e = (_d = (_c = metrics.certificationProgress) === null || _c === void 0 ? void 0 : _c.byProductStatus) === null || _d === void 0 ? void 0 : _d.rejected) !== null && _e !== void 0 ? _e : 0;
                            nonRejectedProducts = Math.max(0, totalProducts - rejectedProducts);
                            rejectionRatePercent = totalProducts > 0
                                ? Number(((rejectedProducts / totalProducts) * 100).toFixed(2))
                                : 0;
                            return [2 /*return*/, {
                                    totals: {
                                        totalProducts: totalProducts,
                                        rejectedProducts: rejectedProducts,
                                        nonRejectedProducts: nonRejectedProducts,
                                        rejectionRatePercent: rejectionRatePercent,
                                    },
                                    chart: [
                                        { key: 'rejected', label: 'Rejected', count: rejectedProducts },
                                        { key: 'nonRejected', label: 'Non-Rejected', count: nonRejectedProducts },
                                    ],
                                }];
                    }
                });
            });
        };
        AdminService_1.prototype.revenueFiltersNeedProductScope = function (filters) {
            var _a;
            return !!(filters.categoryObjectId ||
                ((_a = filters.manufacturerIdsForRegion) === null || _a === void 0 ? void 0 : _a.length) ||
                filters.productStatusFilter);
        };
        AdminService_1.prototype.resolveRevenueScopeUrns = function (filters, now) {
            return __awaiter(this, void 0, void 0, function () {
                var productMatch, pipeline, rows;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            productMatch = (0, dashboard_metrics_filters_util_1.buildProductSnapshotMatch)(filters, now);
                            pipeline = [];
                            if (Object.keys(productMatch).length > 0) {
                                pipeline.push({ $match: productMatch });
                            }
                            pipeline.push({ $group: { _id: '$urnNo' } });
                            return [4 /*yield*/, this.productModel
                                    .aggregate(pipeline)
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, rows
                                    .map(function (r) { var _a; return String((_a = r._id) !== null && _a !== void 0 ? _a : '').trim(); })
                                    .filter(function (urn) { return urn.length > 0; })];
                    }
                });
            });
        };
        /**
         * Revenue from paid/approved payments (`paymentStatus` 1–2), summed on `quoteTotal`.
         * Date filters use cheque date, else created/updated date.
         */
        AdminService_1.prototype.getRevenueAnalytics = function (filters, query) {
            return __awaiter(this, void 0, void 0, function () {
                var scopedByProducts, scopeUrns, _a, appliedFilters;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            scopedByProducts = this.revenueFiltersNeedProductScope(filters);
                            if (!scopedByProducts) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.resolveRevenueScopeUrns(filters, new Date())];
                        case 1:
                            _a = _b.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = undefined;
                            _b.label = 3;
                        case 3:
                            scopeUrns = _a;
                            appliedFilters = this.buildAppliedFiltersPayload(query, filters);
                            return [2 /*return*/, this.revenueDashboardService.getRevenueAnalytics(filters, query, appliedFilters, scopeUrns, scopedByProducts)];
                    }
                });
            });
        };
        AdminService_1.prototype.getProductStatusBreakdownForUser = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var widgets;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.dashboardStatsService.getProductWidgetStats(input.filters)];
                        case 1:
                            widgets = _a.sent();
                            return [2 /*return*/, __assign(__assign({ appliedFilters: this.buildAppliedFiltersPayload(input.query, input.filters) }, widgets.statusBreakdown), { statusCounts: widgets.statusCounts })];
                    }
                });
            });
        };
        AdminService_1.prototype.getUrnPipelineForUser = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var widgets;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.dashboardStatsService.getProductWidgetStats(input.filters)];
                        case 1:
                            widgets = _c.sent();
                            return [2 /*return*/, {
                                    appliedFilters: this.buildAppliedFiltersPayload(input.query, input.filters),
                                    steps: widgets.urnPipeline,
                                    totals: {
                                        inPipeline: widgets.urnPipeline
                                            .filter(function (s) { return s.key !== 'certified'; })
                                            .reduce(function (sum, s) { return sum + s.count; }, 0),
                                        certified: (_b = (_a = widgets.urnPipeline.find(function (s) { return s.key === 'certified'; })) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0,
                                    },
                                }];
                    }
                });
            });
        };
        AdminService_1.prototype.getRevenueAnalyticsForUser = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.getRevenueAnalytics(input.filters, input.query)];
                });
            });
        };
        AdminService_1.prototype.updateVendorStatus = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerId, manufacturer, currentStatus, newStatus, updatedVendor, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            manufacturerId = new mongoose_1.Types.ObjectId(id);
                            return [4 /*yield*/, this.manufacturerModel
                                    .findById(manufacturerId)
                                    .exec()];
                        case 1:
                            manufacturer = _a.sent();
                            if (!manufacturer) {
                                throw new common_1.NotFoundException('Manufacturer not found');
                            }
                            currentStatus = manufacturer.vendor_status;
                            newStatus = void 0;
                            if (currentStatus === 0) {
                                newStatus = 1;
                            }
                            else if (currentStatus === 1) {
                                newStatus = 0;
                            }
                            else {
                                throw new common_1.BadRequestException("Invalid vendor status: ".concat(currentStatus));
                            }
                            return [4 /*yield*/, this.manufacturerModel
                                    .findByIdAndUpdate(manufacturerId, {
                                    vendor_status: newStatus,
                                    updatedAt: new Date(),
                                }, { new: true })
                                    .exec()];
                        case 2:
                            updatedVendor = _a.sent();
                            if (!(updatedVendor && newStatus === 0)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.authService.invalidateSessionsForManufacturer(id)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/, updatedVendor];
                        case 5:
                            error_3 = _a.sent();
                            if (error_3 instanceof common_1.NotFoundException) {
                                throw error_3;
                            }
                            if (error_3.name === 'CastError') {
                                throw new common_1.BadRequestException('Invalid manufacturer ID format');
                            }
                            throw new common_1.BadRequestException(error_3.message || 'Failed to update vendor status');
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        return AdminService_1;
    }());
    __setFunctionName(_classThis, "AdminService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminService = _classThis;
}();
exports.AdminService = AdminService;
