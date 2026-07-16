"use strict";
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
exports.DashboardController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var DashboardController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Vendor Dashboard'), (0, common_1.Controller)('api/vendor/dashboard'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getDashboard_decorators;
    var _getProductOutcomesChart_decorators;
    var _getDashboardOverview_decorators;
    var _listApplicationsAndUrns_decorators;
    var _listAllUrnProgress_decorators;
    var _listVendorUrns_decorators;
    var DashboardController = _classThis = /** @class */ (function () {
        function DashboardController_1(dashboardService, dashboardOverview) {
            this.dashboardService = (__runInitializers(this, _instanceExtraInitializers), dashboardService);
            this.dashboardOverview = dashboardOverview;
        }
        DashboardController_1.prototype.getDashboard = function (user, urn) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerId;
                return __generator(this, function (_a) {
                    if (!(user === null || user === void 0 ? void 0 : user.userId)) {
                        throw new common_1.UnauthorizedException('Unauthorized. Please login.');
                    }
                    manufacturerId = user.vendorId || user.manufacturerId;
                    return [2 /*return*/, this.dashboardService.getDashboardData(user.userId, manufacturerId, urn)];
                });
            });
        };
        DashboardController_1.prototype.getProductOutcomesChart = function (user, year, years, urn) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, parsedYears, parsedYear, scopedUrn, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(user === null || user === void 0 ? void 0 : user.userId)) {
                                throw new common_1.UnauthorizedException('Unauthorized. Please login.');
                            }
                            return [4 /*yield*/, this.dashboardService.resolveVendorObjectIdForOverview(user.userId, user.vendorId || user.manufacturerId)];
                        case 1:
                            vendorObjectId = _a.sent();
                            if (years != null && String(years).trim() !== '') {
                                parsedYears = String(years)
                                    .split(',')
                                    .map(function (value) { return Number(value.trim()); })
                                    .filter(function (value) { return Number.isFinite(value) && value > 0; });
                            }
                            else if (year != null && String(year).trim() !== '') {
                                parsedYear = Number(year);
                                if (Number.isFinite(parsedYear) && parsedYear > 0) {
                                    parsedYears = [parsedYear];
                                }
                            }
                            scopedUrn = (urn === null || urn === void 0 ? void 0 : urn.trim()) || undefined;
                            return [4 /*yield*/, this.dashboardOverview.getProductOutcomesChart(vendorObjectId, parsedYears, scopedUrn)];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Product outcomes chart retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        DashboardController_1.prototype.getDashboardOverview = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(user === null || user === void 0 ? void 0 : user.userId)) {
                                throw new common_1.UnauthorizedException('Unauthorized. Please login.');
                            }
                            return [4 /*yield*/, this.dashboardService.resolveVendorObjectIdForOverview(user.userId, user.vendorId || user.manufacturerId)];
                        case 1:
                            vendorObjectId = _a.sent();
                            return [4 /*yield*/, this.dashboardOverview.getOverview(vendorObjectId)];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Vendor dashboard overview retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        DashboardController_1.prototype.listApplicationsAndUrns = function (user, query) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerId;
                return __generator(this, function (_a) {
                    if (!(user === null || user === void 0 ? void 0 : user.userId)) {
                        throw new common_1.UnauthorizedException('Unauthorized. Please login.');
                    }
                    manufacturerId = user.vendorId || user.manufacturerId;
                    return [2 /*return*/, this.dashboardService.listApplicationsAndUrns(user.userId, manufacturerId, query)];
                });
            });
        };
        DashboardController_1.prototype.listAllUrnProgress = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerId, _a, urns, progress;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(user === null || user === void 0 ? void 0 : user.userId)) {
                                throw new common_1.UnauthorizedException('Unauthorized. Please login.');
                            }
                            manufacturerId = user.vendorId || user.manufacturerId;
                            return [4 /*yield*/, this.dashboardService.listAllUrnProgressTracking(user.userId, manufacturerId)];
                        case 1:
                            _a = _b.sent(), urns = _a.urns, progress = _a.progress;
                            return [2 /*return*/, {
                                    message: 'Vendor URN progress retrieved successfully',
                                    data: { urns: urns, progress: progress },
                                }];
                    }
                });
            });
        };
        DashboardController_1.prototype.listVendorUrns = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerId, urns;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(user === null || user === void 0 ? void 0 : user.userId)) {
                                throw new common_1.UnauthorizedException('Unauthorized. Please login.');
                            }
                            manufacturerId = user.vendorId || user.manufacturerId;
                            return [4 /*yield*/, this.dashboardService.listVendorUrns(user.userId, manufacturerId)];
                        case 1:
                            urns = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Vendor URNs retrieved successfully',
                                    data: { urns: urns },
                                }];
                    }
                });
            });
        };
        return DashboardController_1;
    }());
    __setFunctionName(_classThis, "DashboardController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getDashboard_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({
                summary: 'Get vendor dashboard statistics',
                description: 'Retrieves dashboard data for the **vendor panel only**: product counts, payments, partners, events, latest URN/EOI, and **progressTracking** (dynamic URN lifecycle stepper, timeline, latest/next step cards from activity_log + products.urnStatus). ' +
                    'Optional query **urn** tracks a specific certification URN; otherwise the latest URN is used.',
            }), (0, swagger_1.ApiQuery)({
                name: 'urn',
                required: false,
                description: 'Optional URN to scope progress tracking (defaults to latest URN)',
                example: 'URN-20260305124230',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Dashboard data retrieved successfully',
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: {
                            type: 'object',
                            properties: {
                                products: {
                                    type: 'object',
                                    properties: {
                                        product_count: { type: 'number', example: 25 },
                                    },
                                },
                                certifiedProducts: {
                                    type: 'object',
                                    properties: {
                                        certified_product_count: { type: 'number', example: 10 },
                                    },
                                },
                                paymentPendingAmount: {
                                    type: 'object',
                                    properties: {
                                        payment_pending_amount: {
                                            type: 'number',
                                            nullable: true,
                                            example: 50000,
                                        },
                                    },
                                },
                                partners: {
                                    type: 'object',
                                    properties: {
                                        partner_count: { type: 'number', example: 5 },
                                    },
                                },
                                upcomingEventsCount: {
                                    type: 'object',
                                    properties: {
                                        upcoming_events_count: { type: 'number', example: 3 },
                                    },
                                },
                                latestUrn: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            urn_no: { type: 'string', example: 'URN-20260305124230' },
                                            urn_status: { type: 'number', example: 2 },
                                            product_status: { type: 'number', example: 1 },
                                        },
                                    },
                                },
                                latestEoi: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            eoi_no: { type: 'string', example: 'EOI-20260305124230' },
                                            product_name: {
                                                type: 'string',
                                                example: 'Green Product XYZ',
                                            },
                                            product_status: { type: 'number', example: 1 },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Unauthorized. Please login.',
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Unauthorized. Please login.' },
                        error: { type: 'string', example: 'Unauthorized' },
                        statusCode: { type: 'number', example: 401 },
                    },
                },
            }), (0, swagger_1.ApiResponse)({
                status: 403,
                description: 'Please enter your account details to access all options!',
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: {
                            type: 'string',
                            example: 'Please enter your account details to access all options!',
                        },
                        error: { type: 'string', example: 'Forbidden' },
                        statusCode: { type: 'number', example: 403 },
                    },
                },
            }), (0, swagger_1.ApiResponse)({
                status: 500,
                description: 'Internal server error',
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Internal server error' },
                        error: { type: 'string', example: 'Internal Server Error' },
                        statusCode: { type: 'number', example: 500 },
                    },
                },
            })];
        _getProductOutcomesChart_decorators = [(0, common_1.Get)('product-outcomes-chart'), (0, swagger_1.ApiOperation)({
                summary: 'Yearly product outcomes bar chart',
                description: 'Monthly counts of registered, certified, and rejected products for the selected year. ' +
                    'Pass **year** to filter (defaults to the current year).',
            }), (0, swagger_1.ApiQuery)({
                name: 'year',
                required: false,
                type: Number,
                example: 2026,
                description: 'Single year filter (legacy). Prefer **years** for multi-year selection.',
            }), (0, swagger_1.ApiQuery)({
                name: 'years',
                required: false,
                type: String,
                example: '2024,2025,2026',
                description: 'Comma-separated years to include in the chart.',
            }), (0, swagger_1.ApiQuery)({
                name: 'urn',
                required: false,
                type: String,
                description: 'Scope chart to a single URN batch. Omit for all batches.',
                example: 'URN-20260305124230',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Product outcomes chart data retrieved' })];
        _getDashboardOverview_decorators = [(0, common_1.Get)('overview'), (0, swagger_1.ApiOperation)({
                summary: 'Vendor dashboard overview (KPIs, charts, recent EOIs, activity)',
                description: 'Single payload for the vendor panel home page: six KPI cards with trend %, ' +
                    'registration vs certification trend, product status donut, products by category bar chart, ' +
                    'recent EOIs table, and recent activity feed (last 7 days). Scoped to the authenticated vendor.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Vendor dashboard overview retrieved' })];
        _listApplicationsAndUrns_decorators = [(0, common_1.Get)('applications-and-urns'), (0, swagger_1.ApiOperation)({
                summary: 'Applications & URNs table (vendor dashboard)',
                description: 'Products/EOIs for the vendor dashboard table. Pass **urn** to scope to one batch; omit **urn** to return products across **all** URN batches. ' +
                    'Optional **search** filters EOI, product name, or URN within the current scope.',
            }), (0, swagger_1.ApiQuery)({
                name: 'urn',
                required: false,
                description: 'URN batch to show (defaults to latest URN for this vendor)',
                example: 'URN-20260305124230',
            }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }), (0, swagger_1.ApiQuery)({
                name: 'search',
                required: false,
                type: String,
                description: 'Partial match on EOI or product name (within the scoped URN)',
                example: 'GPPPK',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Table rows with pagination',
            })];
        _listAllUrnProgress_decorators = [(0, common_1.Get)('urn-progress'), (0, swagger_1.ApiOperation)({
                summary: 'Certification progress for all URN batches',
                description: 'Returns progressTracking for every distinct URN batch in one payload. Used by the dashboard journey carousel when no URN filter is selected.',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'URN progress list retrieved',
            })];
        _listVendorUrns_decorators = [(0, common_1.Get)('urns'), (0, swagger_1.ApiOperation)({
                summary: 'List vendor URN batches (dashboard selector)',
                description: 'Returns all distinct certification URNs for the authenticated vendor, newest first. Used by the dashboard global URN selector.',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'URN list retrieved',
            })];
        __esDecorate(_classThis, null, _getDashboard_decorators, { kind: "method", name: "getDashboard", static: false, private: false, access: { has: function (obj) { return "getDashboard" in obj; }, get: function (obj) { return obj.getDashboard; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProductOutcomesChart_decorators, { kind: "method", name: "getProductOutcomesChart", static: false, private: false, access: { has: function (obj) { return "getProductOutcomesChart" in obj; }, get: function (obj) { return obj.getProductOutcomesChart; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDashboardOverview_decorators, { kind: "method", name: "getDashboardOverview", static: false, private: false, access: { has: function (obj) { return "getDashboardOverview" in obj; }, get: function (obj) { return obj.getDashboardOverview; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listApplicationsAndUrns_decorators, { kind: "method", name: "listApplicationsAndUrns", static: false, private: false, access: { has: function (obj) { return "listApplicationsAndUrns" in obj; }, get: function (obj) { return obj.listApplicationsAndUrns; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listAllUrnProgress_decorators, { kind: "method", name: "listAllUrnProgress", static: false, private: false, access: { has: function (obj) { return "listAllUrnProgress" in obj; }, get: function (obj) { return obj.listAllUrnProgress; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listVendorUrns_decorators, { kind: "method", name: "listVendorUrns", static: false, private: false, access: { has: function (obj) { return "listVendorUrns" in obj; }, get: function (obj) { return obj.listVendorUrns; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DashboardController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DashboardController = _classThis;
}();
exports.DashboardController = DashboardController;
