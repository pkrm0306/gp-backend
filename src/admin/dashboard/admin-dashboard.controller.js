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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
var permissions_guard_1 = require("../../common/guards/permissions.guard");
var any_permissions_decorator_1 = require("../../common/decorators/any-permissions.decorator");
var permissions_constants_1 = require("../../common/constants/permissions.constants");
/**
 * Dedicated admin dashboard analytics routes (product counts, pipeline, categories).
 * Counts use **active** products and match the admin Products list — not filtered by period/year.
 */
var AdminDashboardController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Admin Dashboard'), (0, common_1.Controller)('admin/dashboard'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getDashboardOverview_decorators;
    var _getPaymentStatus_decorators;
    var _getRecentPayments_decorators;
    var _getRecentApplications_decorators;
    var _getDashboardAlerts_decorators;
    var _getKpiCards_decorators;
    var _getCertificationTiming_decorators;
    var _getVisitorAnalytics_decorators;
    var _getSustainabilityContributions_decorators;
    var _getRejectionTrend_decorators;
    var _getDashboardStats_decorators;
    var _getProductSummary_decorators;
    var _getRevenueWidgets_decorators;
    var _getDashboardCharts_decorators;
    var _getPendingAdminActions_decorators;
    var _getActivityCenter_decorators;
    var _getActivityCenterTab_decorators;
    var _getSmartAlerts_decorators;
    var _getOperationalInsights_decorators;
    var _getReportsCatalog_decorators;
    var _downloadReport_decorators;
    var AdminDashboardController = _classThis = /** @class */ (function () {
        function AdminDashboardController_1(adminService, dashboardStats, dashboardKpi, dashboardWidgets, certificationTiming, sustainability, visitorAnalytics, dashboardOptimized) {
            this.adminService = (__runInitializers(this, _instanceExtraInitializers), adminService);
            this.dashboardStats = dashboardStats;
            this.dashboardKpi = dashboardKpi;
            this.dashboardWidgets = dashboardWidgets;
            this.certificationTiming = certificationTiming;
            this.sustainability = sustainability;
            this.visitorAnalytics = visitorAnalytics;
            this.dashboardOptimized = dashboardOptimized;
        }
        AdminDashboardController_1.prototype.getDashboardOverview = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.dashboardWidgets.getOverview(filters, {
                                    recentLimit: 5,
                                })];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Dashboard overview retrieved successfully',
                                    data: __assign({ appliedFilters: this.dashboardStats.buildAppliedFilters(query, filters) }, data),
                                }];
                    }
                });
            });
        };
        AdminDashboardController_1.prototype.getPaymentStatus = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, paymentStatus;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.dashboardWidgets.getPaymentStatus(filters)];
                        case 2:
                            paymentStatus = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Payment status retrieved successfully',
                                    data: __assign({ appliedFilters: this.dashboardStats.buildAppliedFilters(query, filters) }, paymentStatus),
                                }];
                    }
                });
            });
        };
        AdminDashboardController_1.prototype.getRecentPayments = function (query, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, parsedLimit, items;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            parsedLimit = Math.min(Math.max(Number(limit) || 5, 1), 20);
                            return [4 /*yield*/, this.dashboardWidgets.getRecentPayments(filters, parsedLimit)];
                        case 2:
                            items = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Recent payments retrieved successfully',
                                    data: { items: items, limit: parsedLimit },
                                }];
                    }
                });
            });
        };
        AdminDashboardController_1.prototype.getRecentApplications = function (query, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, parsedLimit, items;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            parsedLimit = Math.min(Math.max(Number(limit) || 5, 1), 20);
                            return [4 /*yield*/, this.dashboardWidgets.getRecentApplications(filters, parsedLimit)];
                        case 2:
                            items = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Recent applications retrieved successfully',
                                    data: { items: items, limit: parsedLimit },
                                }];
                    }
                });
            });
        };
        AdminDashboardController_1.prototype.getDashboardAlerts = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, alerts;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.dashboardWidgets.getAlerts(filters)];
                        case 2:
                            alerts = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Dashboard alerts retrieved successfully',
                                    data: { alerts: alerts },
                                }];
                    }
                });
            });
        };
        AdminDashboardController_1.prototype.getKpiCards = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, bundle;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.dashboardOptimized.getKpis(filters)];
                        case 2:
                            bundle = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Dashboard KPI cards retrieved successfully',
                                    data: {
                                        appliedFilters: this.dashboardStats.buildAppliedFilters(query, filters),
                                        cards: bundle.cards,
                                        certificationTiming: bundle.certificationTiming,
                                    },
                                }];
                    }
                });
            });
        };
        AdminDashboardController_1.prototype.getCertificationTiming = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, certificationTiming;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.certificationTiming.getCertificationTiming(filters)];
                        case 2:
                            certificationTiming = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Certification timing analytics retrieved successfully',
                                    data: __assign({ appliedFilters: this.dashboardStats.buildAppliedFilters(query, filters) }, certificationTiming),
                                }];
                    }
                });
            });
        };
        AdminDashboardController_1.prototype.getVisitorAnalytics = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, visitorAnalytics;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.visitorAnalytics.getVisitorAnalytics(filters)];
                        case 2:
                            visitorAnalytics = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Visitor analytics retrieved successfully',
                                    data: __assign({ appliedFilters: this.dashboardStats.buildAppliedFilters(query, filters) }, visitorAnalytics),
                                }];
                    }
                });
            });
        };
        AdminDashboardController_1.prototype.getSustainabilityContributions = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, sustainabilityContributions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.sustainability.getSustainabilityContributions(filters)];
                        case 2:
                            sustainabilityContributions = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Sustainability contributions retrieved successfully',
                                    data: __assign({ appliedFilters: this.dashboardStats.buildAppliedFilters(query, filters) }, sustainabilityContributions),
                                }];
                    }
                });
            });
        };
        AdminDashboardController_1.prototype.getRejectionTrend = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, rejectionTrend;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.dashboardStats.getRejectionTrend(filters)];
                        case 2:
                            rejectionTrend = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Rejection trend retrieved successfully',
                                    data: __assign({ appliedFilters: this.dashboardStats.buildAppliedFilters(query, filters) }, rejectionTrend),
                                }];
                    }
                });
            });
        };
        AdminDashboardController_1.prototype.getDashboardStats = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, appliedFilters, _a, products, charts, rejectionTrend;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _b.sent();
                            appliedFilters = this.dashboardStats.buildAppliedFilters(query, filters);
                            return [4 /*yield*/, Promise.all([
                                    this.dashboardStats.getProductWidgetStats(filters),
                                    this.dashboardStats.getTrendCharts(filters, filters.granularity),
                                    this.dashboardStats.getRejectionTrend(filters),
                                ])];
                        case 2:
                            _a = _b.sent(), products = _a[0], charts = _a[1], rejectionTrend = _a[2];
                            return [2 /*return*/, {
                                    message: 'Dashboard stats retrieved successfully',
                                    data: {
                                        appliedFilters: appliedFilters,
                                        products: products,
                                        charts: charts,
                                        rejectionTrend: rejectionTrend,
                                    },
                                }];
                    }
                });
            });
        };
        AdminDashboardController_1.prototype.getProductSummary = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, products;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.dashboardStats.getProductWidgetStats(filters)];
                        case 2:
                            products = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Dashboard product summary retrieved successfully',
                                    data: __assign({ appliedFilters: this.dashboardStats.buildAppliedFilters(query, filters) }, products),
                                }];
                    }
                });
            });
        };
        AdminDashboardController_1.prototype.getRevenueWidgets = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.adminService.getRevenueAnalyticsForUser({
                                    filters: filters,
                                    query: query,
                                })];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Revenue analytics retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        // ─── Optimized REST endpoints (aggregated + cached) ───────────────────────
        AdminDashboardController_1.prototype.getDashboardCharts = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, charts;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.dashboardOptimized.getCharts(filters)];
                        case 2:
                            charts = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Dashboard charts retrieved successfully',
                                    data: __assign({ appliedFilters: this.dashboardStats.buildAppliedFilters(query, filters) }, charts),
                                }];
                    }
                });
            });
        };
        AdminDashboardController_1.prototype.getPendingAdminActions = function (query, page, pageSize, search) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.dashboardOptimized.getPendingActions(filters, {
                                    page: Number(page) || 1,
                                    pageSize: Number(pageSize) || 5,
                                    search: search,
                                })];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Pending admin actions retrieved successfully',
                                    data: __assign({ appliedFilters: this.dashboardStats.buildAppliedFilters(query, filters) }, data),
                                }];
                    }
                });
            });
        };
        AdminDashboardController_1.prototype.getActivityCenter = function (query, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, parsedLimit, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            parsedLimit = Math.min(Math.max(Number(limit) || 12, 1), 24);
                            return [4 /*yield*/, this.dashboardOptimized.getActivityCenter(filters, parsedLimit)];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Activity center retrieved successfully',
                                    data: __assign({ appliedFilters: this.dashboardStats.buildAppliedFilters(query, filters) }, data),
                                }];
                    }
                });
            });
        };
        AdminDashboardController_1.prototype.getActivityCenterTab = function (tab, query, page, pageSize, search) {
            return __awaiter(this, void 0, void 0, function () {
                var allowed, normalized, filters, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            allowed = new Set(['vendors', 'applications', 'payments', 'renewals']);
                            normalized = String(tab || '').trim().toLowerCase();
                            if (!allowed.has(normalized)) {
                                return [2 /*return*/, {
                                        message: 'Invalid activity tab',
                                        data: { tab: normalized, items: [], total: 0, page: 1, pageSize: 5 },
                                    }];
                            }
                            return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.dashboardOptimized.getActivityCenterTab(filters, normalized, {
                                    page: Number(page) || 1,
                                    pageSize: Number(pageSize) || 5,
                                    search: search,
                                })];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Activity center tab retrieved successfully',
                                    data: __assign({ appliedFilters: this.dashboardStats.buildAppliedFilters(query, filters) }, data),
                                }];
                    }
                });
            });
        };
        AdminDashboardController_1.prototype.getSmartAlerts = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.dashboardOptimized.getSmartAlerts(filters)];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Smart alerts retrieved successfully',
                                    data: __assign({ appliedFilters: this.dashboardStats.buildAppliedFilters(query, filters) }, data),
                                }];
                    }
                });
            });
        };
        AdminDashboardController_1.prototype.getOperationalInsights = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            return [4 /*yield*/, this.dashboardOptimized.getOperationalInsights(filters)];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Operational insights retrieved successfully',
                                    data: __assign({ appliedFilters: this.dashboardStats.buildAppliedFilters(query, filters) }, data),
                                }];
                    }
                });
            });
        };
        AdminDashboardController_1.prototype.getReportsCatalog = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.dashboardOptimized.getReportsCatalog()];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Reports catalog retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        AdminDashboardController_1.prototype.downloadReport = function (reportKey, query, formatRaw, res) {
            return __awaiter(this, void 0, void 0, function () {
                var filters, format, file;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.adminService.resolveDashboardMetricsFilters(query)];
                        case 1:
                            filters = _a.sent();
                            format = (String(formatRaw || 'csv').toLowerCase() ||
                                'csv');
                            return [4 /*yield*/, this.dashboardOptimized.downloadReport(String(reportKey).trim().toLowerCase(), format, filters)];
                        case 2:
                            file = _a.sent();
                            res.setHeader('Content-Type', file.contentType);
                            res.setHeader('Content-Disposition', "attachment; filename=\"".concat(file.filename, "\""));
                            return [2 /*return*/, res.send(file.buffer)];
                    }
                });
            });
        };
        return AdminDashboardController_1;
    }());
    __setFunctionName(_classThis, "AdminDashboardController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getDashboardOverview_decorators = [(0, common_1.Get)('overview'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_MANUFACTURERS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW, permissions_constants_1.PERMISSIONS.PAYMENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Full admin dashboard overview (KPIs + widgets + charts)',
                description: 'Single payload for the dashboard home page: KPI cards, payment status (paid/pending only), ' +
                    'recent payments, recent applications, alerts, and chart data.',
            })];
        _getPaymentStatus_decorators = [(0, common_1.Get)('payment-status'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.PAYMENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Payment status widget (paid and pending only)',
                description: 'Returns paid (`paymentStatus` 2) and pending (`paymentStatus` 1) counts with percentages. ' +
                    'Does not include created, cancelled, or overdue buckets.',
            })];
        _getRecentPayments_decorators = [(0, common_1.Get)('recent-payments'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.PAYMENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Recent paid/pending payments for dashboard list',
                description: 'Latest payments with status paid or pending only (default limit 5).',
            })];
        _getRecentApplications_decorators = [(0, common_1.Get)('recent-applications'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Recent product applications for dashboard list',
                description: 'Latest EOIs/products with status labels (default limit 5).',
            })];
        _getDashboardAlerts_decorators = [(0, common_1.Get)('alerts'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Dashboard alerts and action items',
                description: 'Counts for expiring certifications, pending applications, rejected products, and renewals due.',
            })];
        _getKpiCards_decorators = [(0, common_1.Get)('kpi-cards'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_MANUFACTURERS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW, permissions_constants_1.PERMISSIONS.PAYMENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Dashboard home KPI card counts + certification timing widgets',
                description: 'Returns the eight dashboard stat cards plus certification timing analytics ' +
                    '(Time at Stage bar chart + Avg. Time to Certification). ' +
                    'Counts use the current platform snapshot (not limited by period/year). Optional `categoryId` and `region` apply.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'KPI card counts retrieved' })];
        _getCertificationTiming_decorators = [(0, common_1.Get)('certification-timing'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Certification timing widgets (Time at Stage + Avg. Time to Certification)',
                description: 'Computes average days per certification stage from `activity_log` milestones on certified URNs. ' +
                    'Includes end-to-end average days and Technical / Audit / Review breakdown. ' +
                    'Optional `categoryId` and `region` filters apply.',
            })];
        _getVisitorAnalytics_decorators = [(0, common_1.Get)('visitor-analytics'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Visitor Analytics multi-line chart (page views, visitors, sign-ups)',
                description: 'Returns platform traffic from website analytics events (page views sent by the public site, ' +
                    'sign-ups from newsletter/vendor registration). Falls back to engagement estimates when no ' +
                    'website events exist yet. Optional `period`, `year`, `month`, `granularity`.',
            })];
        _getSustainabilityContributions_decorators = [(0, common_1.Get)('sustainability-contributions'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Sustainability Contributions progress widget',
                description: 'Returns Energy Saved, Water Saved, Recyclability, and Carbon Offset percentages ' +
                    'aggregated from certified product process forms (energy/water reductions, recycled content, ' +
                    'renewable materials). Optional `categoryId` and `region` filters apply.',
            })];
        _getRejectionTrend_decorators = [(0, common_1.Get)('rejection-trend'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Rejection trend area chart (monthly rejected product volume)',
                description: 'Returns time-bucketed counts of rejected products (`productStatus: 3`) for the dashboard ' +
                    'Rejection Trend widget. Buckets by `rejectedAt` (fallback `updatedDate`). ' +
                    'Respects `period`, `year`, `month`, `granularity`, `categoryId`, and `region` filters.',
            })];
        _getDashboardStats_decorators = [(0, common_1.Get)('stats'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW, permissions_constants_1.PERMISSIONS.PAYMENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'All dashboard widget stats (accurate product counts)',
                description: 'Returns product status breakdown, certified vs uncertified, URN pipeline, category certified counts, ' +
                    'and trend charts. **Product counts ignore period/year** (current platform snapshot). ' +
                    'Optional `categoryId`, `region`, `productStatus` still apply. Revenue included when caller has payments permission.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard stats retrieved' })];
        _getProductSummary_decorators = [(0, common_1.Get)('products/summary'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Product counts for dashboard widgets',
                description: 'Certified, uncertified, expired, renewed, URN pipeline, and per-category certified counts. ' +
                    'Matches admin Products list totals (active products only).',
            })];
        _getRevenueWidgets_decorators = [(0, common_1.Get)('revenue'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.PAYMENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Revenue analytics widgets (donut + weekly comparison)',
                description: 'Reads from `payment_details` (same as Payment History). ' +
                    'Donut centre: `distribution.totalRevenue`. Segments: Registration Fee, Certificate Fee, Renew Payment with amount + percentage. ' +
                    'Line chart: `weeklyComparison` (W1–W5, current vs previous period). ' +
                    'Filters: `period=this_week|this_month|this_year|last_month|last_week|last_year` (aliases: week, month, year, last_month).',
            })];
        _getDashboardCharts_decorators = [(0, common_1.Get)('charts'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW, permissions_constants_1.PERMISSIONS.PAYMENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Cached analytics charts bundle',
                description: 'Lightweight product widgets, trends, rejection trend, and payment status. ' +
                    'Uses Redis cache (~90s). Supports global filters: date, manufacturer/vendor, status, region, category.',
            })];
        _getPendingAdminActions_decorators = [(0, common_1.Get)('pending-admin-actions'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_MANUFACTURERS_VIEW, permissions_constants_1.PERMISSIONS.PAYMENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Pending admin actions (aggregated, server-paginated)',
                description: 'Operational backlog rows from `$facet` aggregations (Redis-cached). ' +
                    'Supports `page`, `pageSize`, and `search`.',
            }), (0, swagger_1.ApiQuery)({ name: 'page', required: false }), (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false }), (0, swagger_1.ApiQuery)({ name: 'search', required: false })];
        _getActivityCenter_decorators = [(0, common_1.Get)('activity-center'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_MANUFACTURERS_VIEW, permissions_constants_1.PERMISSIONS.PAYMENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Activity center — latest vendors, applications, payments, renewals',
                description: 'Latest-only lists (default 12) with Redis cache. Supports global filters.',
            }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: '1–24 (default 12)' })];
        _getActivityCenterTab_decorators = [(0, common_1.Get)('activity-center/:tab'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_MANUFACTURERS_VIEW, permissions_constants_1.PERMISSIONS.PAYMENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Activity center tab — server-side pagination',
                description: 'Paginated tab rows (`vendors` | `applications` | `payments` | `renewals`) with search.',
            }), (0, swagger_1.ApiParam)({ name: 'tab', enum: ['vendors', 'applications', 'payments', 'renewals'] }), (0, swagger_1.ApiQuery)({ name: 'page', required: false }), (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false }), (0, swagger_1.ApiQuery)({ name: 'search', required: false })];
        _getSmartAlerts_decorators = [(0, common_1.Get)('smart-alerts'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_MANUFACTURERS_VIEW, permissions_constants_1.PERMISSIONS.PAYMENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Smart alerts generated from dashboard signals',
                description: 'Vendors awaiting approval, payments pending, expiring certificates, assessment backlog, revenue decrease, renewals.',
            })];
        _getOperationalInsights_decorators = [(0, common_1.Get)('operational-insights'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Operational timing KPIs (cycle times + SLA thresholds)',
                description: 'Average times for vendor, product, assessment, certification, payment, renewal.',
            })];
        _getReportsCatalog_decorators = [(0, common_1.Get)('reports'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.PAYMENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Quick reports catalog',
                description: 'Downloadable report metadata (formats + last generated). Lightweight cached list.',
            })];
        _downloadReport_decorators = [(0, common_1.Get)('reports/:reportKey'), (0, any_permissions_decorator_1.AnyPermissions)(permissions_constants_1.PERMISSIONS.DASHBOARD_VIEW, permissions_constants_1.PERMISSIONS.DASHBOARD_PRODUCTS_VIEW, permissions_constants_1.PERMISSIONS.PAYMENTS_VIEW), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Download a quick report',
                description: 'Returns a lightweight export (CSV body; content-type varies by format). ' +
                    'Query: format=pdf|xlsx|csv plus global dashboard filters.',
            }), (0, swagger_1.ApiParam)({ name: 'reportKey', example: 'vendor' }), (0, swagger_1.ApiQuery)({ name: 'format', required: false, enum: ['pdf', 'xlsx', 'csv'] })];
        __esDecorate(_classThis, null, _getDashboardOverview_decorators, { kind: "method", name: "getDashboardOverview", static: false, private: false, access: { has: function (obj) { return "getDashboardOverview" in obj; }, get: function (obj) { return obj.getDashboardOverview; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPaymentStatus_decorators, { kind: "method", name: "getPaymentStatus", static: false, private: false, access: { has: function (obj) { return "getPaymentStatus" in obj; }, get: function (obj) { return obj.getPaymentStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRecentPayments_decorators, { kind: "method", name: "getRecentPayments", static: false, private: false, access: { has: function (obj) { return "getRecentPayments" in obj; }, get: function (obj) { return obj.getRecentPayments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRecentApplications_decorators, { kind: "method", name: "getRecentApplications", static: false, private: false, access: { has: function (obj) { return "getRecentApplications" in obj; }, get: function (obj) { return obj.getRecentApplications; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDashboardAlerts_decorators, { kind: "method", name: "getDashboardAlerts", static: false, private: false, access: { has: function (obj) { return "getDashboardAlerts" in obj; }, get: function (obj) { return obj.getDashboardAlerts; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getKpiCards_decorators, { kind: "method", name: "getKpiCards", static: false, private: false, access: { has: function (obj) { return "getKpiCards" in obj; }, get: function (obj) { return obj.getKpiCards; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCertificationTiming_decorators, { kind: "method", name: "getCertificationTiming", static: false, private: false, access: { has: function (obj) { return "getCertificationTiming" in obj; }, get: function (obj) { return obj.getCertificationTiming; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVisitorAnalytics_decorators, { kind: "method", name: "getVisitorAnalytics", static: false, private: false, access: { has: function (obj) { return "getVisitorAnalytics" in obj; }, get: function (obj) { return obj.getVisitorAnalytics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSustainabilityContributions_decorators, { kind: "method", name: "getSustainabilityContributions", static: false, private: false, access: { has: function (obj) { return "getSustainabilityContributions" in obj; }, get: function (obj) { return obj.getSustainabilityContributions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRejectionTrend_decorators, { kind: "method", name: "getRejectionTrend", static: false, private: false, access: { has: function (obj) { return "getRejectionTrend" in obj; }, get: function (obj) { return obj.getRejectionTrend; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDashboardStats_decorators, { kind: "method", name: "getDashboardStats", static: false, private: false, access: { has: function (obj) { return "getDashboardStats" in obj; }, get: function (obj) { return obj.getDashboardStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProductSummary_decorators, { kind: "method", name: "getProductSummary", static: false, private: false, access: { has: function (obj) { return "getProductSummary" in obj; }, get: function (obj) { return obj.getProductSummary; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRevenueWidgets_decorators, { kind: "method", name: "getRevenueWidgets", static: false, private: false, access: { has: function (obj) { return "getRevenueWidgets" in obj; }, get: function (obj) { return obj.getRevenueWidgets; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDashboardCharts_decorators, { kind: "method", name: "getDashboardCharts", static: false, private: false, access: { has: function (obj) { return "getDashboardCharts" in obj; }, get: function (obj) { return obj.getDashboardCharts; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPendingAdminActions_decorators, { kind: "method", name: "getPendingAdminActions", static: false, private: false, access: { has: function (obj) { return "getPendingAdminActions" in obj; }, get: function (obj) { return obj.getPendingAdminActions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getActivityCenter_decorators, { kind: "method", name: "getActivityCenter", static: false, private: false, access: { has: function (obj) { return "getActivityCenter" in obj; }, get: function (obj) { return obj.getActivityCenter; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getActivityCenterTab_decorators, { kind: "method", name: "getActivityCenterTab", static: false, private: false, access: { has: function (obj) { return "getActivityCenterTab" in obj; }, get: function (obj) { return obj.getActivityCenterTab; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSmartAlerts_decorators, { kind: "method", name: "getSmartAlerts", static: false, private: false, access: { has: function (obj) { return "getSmartAlerts" in obj; }, get: function (obj) { return obj.getSmartAlerts; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getOperationalInsights_decorators, { kind: "method", name: "getOperationalInsights", static: false, private: false, access: { has: function (obj) { return "getOperationalInsights" in obj; }, get: function (obj) { return obj.getOperationalInsights; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getReportsCatalog_decorators, { kind: "method", name: "getReportsCatalog", static: false, private: false, access: { has: function (obj) { return "getReportsCatalog" in obj; }, get: function (obj) { return obj.getReportsCatalog; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _downloadReport_decorators, { kind: "method", name: "downloadReport", static: false, private: false, access: { has: function (obj) { return "downloadReport" in obj; }, get: function (obj) { return obj.downloadReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminDashboardController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminDashboardController = _classThis;
}();
exports.AdminDashboardController = AdminDashboardController;
