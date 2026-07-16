"use strict";
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
exports.AdminDashboardVisitorAnalyticsService = void 0;
var common_1 = require("@nestjs/common");
var dashboard_metrics_filters_util_1 = require("../utils/dashboard-metrics-filters.util");
var SERIES_META = [
    { key: 'pageViews', label: 'Page Views', color: '#3B82F6', order: 1 },
    { key: 'visitors', label: 'Visitors', color: '#22C55E', order: 2 },
    { key: 'signUps', label: 'Sign-ups', color: '#8B5CF6', order: 3 },
];
var PAGE_VIEWS_PER_ENGAGEMENT = 3;
var AdminDashboardVisitorAnalyticsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminDashboardVisitorAnalyticsService = _classThis = /** @class */ (function () {
        function AdminDashboardVisitorAnalyticsService_1(contactMessageModel, newsletterModel, notificationModel, manufacturerModel, websiteAnalytics) {
            this.contactMessageModel = contactMessageModel;
            this.newsletterModel = newsletterModel;
            this.notificationModel = notificationModel;
            this.manufacturerModel = manufacturerModel;
            this.websiteAnalytics = websiteAnalytics;
        }
        AdminDashboardVisitorAnalyticsService_1.prototype.getVisitorAnalytics = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var hasWebsiteEvents, chart;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.websiteAnalytics.hasAnyEvents()];
                        case 1:
                            hasWebsiteEvents = _b.sent();
                            if (!hasWebsiteEvents) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.websiteAnalytics.getChartPoints(filters)];
                        case 2:
                            chart = _b.sent();
                            return [2 /*return*/, this.buildResponse(chart, (_a = filters.granularity) !== null && _a !== void 0 ? _a : 'monthly', 'website', {
                                    pageViews: 'Page views recorded by the public website and stored via POST /website/analytics/collect.',
                                    visitors: 'Unique anonymous visitor sessions (visitorId) per period from website analytics events.',
                                    signUps: 'Sign-up events from newsletter subscriptions, vendor registrations, and website sign_up beacons.',
                                })];
                        case 3: return [2 /*return*/, this.getEstimatedVisitorAnalytics(filters)];
                    }
                });
            });
        };
        AdminDashboardVisitorAnalyticsService_1.prototype.getEstimatedVisitorAnalytics = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var now, granularity, dateRange, _a, contacts, newsletters, inquiries, manufacturers, buckets, ensureBucket, _i, contacts_1, row, bucket, email, _b, newsletters_1, row, bucket, email, _c, inquiries_1, row, bucket, identity, _d, manufacturers_1, row, bucket, email, sortedBuckets, chart;
                var _this = this;
                var _e, _f, _g, _h, _j, _k;
                return __generator(this, function (_l) {
                    switch (_l.label) {
                        case 0:
                            now = new Date();
                            granularity = (_e = filters.granularity) !== null && _e !== void 0 ? _e : 'monthly';
                            dateRange = (_f = filters.dateRange) !== null && _f !== void 0 ? _f : this.defaultTrailingRange(now, granularity);
                            return [4 /*yield*/, Promise.all([
                                    this.contactMessageModel
                                        .find({
                                        createdAt: { $gte: dateRange.from, $lte: dateRange.to },
                                    })
                                        .select('email createdAt')
                                        .lean()
                                        .exec(),
                                    this.newsletterModel
                                        .find({
                                        createdAt: { $gte: dateRange.from, $lte: dateRange.to },
                                    })
                                        .select('email createdAt')
                                        .lean()
                                        .exec(),
                                    this.notificationModel
                                        .find({
                                        source: 'website',
                                        referenceType: 'manufacturer_inquiry',
                                        createdAt: { $gte: dateRange.from, $lte: dateRange.to },
                                    })
                                        .select('actorName createdAt')
                                        .lean()
                                        .exec(),
                                    this.manufacturerModel
                                        .find({
                                        createdAt: { $gte: dateRange.from, $lte: dateRange.to },
                                    })
                                        .select('vendor_email createdAt')
                                        .lean()
                                        .exec(),
                                ])];
                        case 1:
                            _a = _l.sent(), contacts = _a[0], newsletters = _a[1], inquiries = _a[2], manufacturers = _a[3];
                            buckets = new Map();
                            ensureBucket = function (date) {
                                var bucketId = _this.resolveBucketId(date, granularity);
                                var key = _this.bucketKey(bucketId);
                                var existing = buckets.get(key);
                                if (existing)
                                    return existing;
                                var created = {
                                    bucket: bucketId,
                                    label: (0, dashboard_metrics_filters_util_1.formatBucketLabel)(granularity, bucketId),
                                    pageViews: 0,
                                    visitorEmails: new Set(),
                                    signUps: 0,
                                };
                                buckets.set(key, created);
                                return created;
                            };
                            for (_i = 0, contacts_1 = contacts; _i < contacts_1.length; _i++) {
                                row = contacts_1[_i];
                                if (!row.createdAt)
                                    continue;
                                bucket = ensureBucket(new Date(row.createdAt));
                                bucket.pageViews += PAGE_VIEWS_PER_ENGAGEMENT;
                                email = String((_g = row.email) !== null && _g !== void 0 ? _g : '').trim().toLowerCase();
                                if (email)
                                    bucket.visitorEmails.add(email);
                            }
                            for (_b = 0, newsletters_1 = newsletters; _b < newsletters_1.length; _b++) {
                                row = newsletters_1[_b];
                                if (!row.createdAt)
                                    continue;
                                bucket = ensureBucket(new Date(row.createdAt));
                                bucket.pageViews += PAGE_VIEWS_PER_ENGAGEMENT;
                                bucket.signUps += 1;
                                email = String((_h = row.email) !== null && _h !== void 0 ? _h : '').trim().toLowerCase();
                                if (email)
                                    bucket.visitorEmails.add(email);
                            }
                            for (_c = 0, inquiries_1 = inquiries; _c < inquiries_1.length; _c++) {
                                row = inquiries_1[_c];
                                if (!row.createdAt)
                                    continue;
                                bucket = ensureBucket(new Date(row.createdAt));
                                bucket.pageViews += PAGE_VIEWS_PER_ENGAGEMENT;
                                identity = String((_j = row.actorName) !== null && _j !== void 0 ? _j : '').trim().toLowerCase();
                                if (identity)
                                    bucket.visitorEmails.add("inquiry:".concat(identity));
                            }
                            for (_d = 0, manufacturers_1 = manufacturers; _d < manufacturers_1.length; _d++) {
                                row = manufacturers_1[_d];
                                if (!row.createdAt)
                                    continue;
                                bucket = ensureBucket(new Date(row.createdAt));
                                bucket.pageViews += PAGE_VIEWS_PER_ENGAGEMENT;
                                bucket.signUps += 1;
                                email = String((_k = row.vendor_email) !== null && _k !== void 0 ? _k : '').trim().toLowerCase();
                                if (email)
                                    bucket.visitorEmails.add(email);
                            }
                            sortedBuckets = __spreadArray([], buckets.values(), true).sort(function (a, b) {
                                return _this.compareBuckets(a.bucket, b.bucket, granularity);
                            });
                            chart = sortedBuckets.map(function (bucket) {
                                var _a;
                                return ({
                                    label: bucket.label,
                                    year: (_a = bucket.bucket.year) !== null && _a !== void 0 ? _a : 0,
                                    month: bucket.bucket.month,
                                    quarter: bucket.bucket.quarter,
                                    week: bucket.bucket.week,
                                    pageViews: bucket.pageViews,
                                    visitors: bucket.visitorEmails.size,
                                    signUps: bucket.signUps,
                                });
                            });
                            return [2 /*return*/, this.buildResponse(chart, granularity, 'estimated', {
                                    pageViews: 'Estimated from recorded public website engagements until the website analytics beacon is deployed.',
                                    visitors: 'Unique visitor identities per bucket (distinct contact/newsletter emails and manufacturer inquiry submitters).',
                                    signUps: 'New newsletter subscribers plus new manufacturer (vendor portal) registrations.',
                                })];
                    }
                });
            });
        };
        AdminDashboardVisitorAnalyticsService_1.prototype.buildResponse = function (chart, granularity, source, methodology) {
            var totals = chart.reduce(function (acc, point) { return ({
                pageViews: acc.pageViews + point.pageViews,
                visitors: acc.visitors + point.visitors,
                signUps: acc.signUps + point.signUps,
            }); }, { pageViews: 0, visitors: 0, signUps: 0 });
            var maxValue = chart.reduce(function (max, point) {
                return Math.max(max, point.pageViews, point.visitors, point.signUps);
            }, 0);
            return {
                title: 'Visitor Analytics',
                subtitle: 'Platform traffic and engagement',
                granularity: granularity,
                source: source,
                series: SERIES_META,
                chart: chart,
                totals: totals,
                yAxis: {
                    min: 0,
                    suggestedMax: this.suggestYMax(maxValue),
                },
                methodology: methodology,
            };
        };
        AdminDashboardVisitorAnalyticsService_1.prototype.defaultTrailingRange = function (now, granularity) {
            var to = new Date(now);
            var from = new Date(now);
            if (granularity === 'weekly') {
                from.setDate(from.getDate() - 7 * 11);
            }
            else if (granularity === 'quarterly') {
                from.setMonth(from.getMonth() - 11);
            }
            else {
                from.setMonth(from.getMonth() - 5);
            }
            from.setHours(0, 0, 0, 0);
            return { from: from, to: to };
        };
        AdminDashboardVisitorAnalyticsService_1.prototype.resolveBucketId = function (date, granularity) {
            if (granularity === 'weekly') {
                return {
                    year: this.isoWeekYear(date),
                    week: this.isoWeek(date),
                };
            }
            if (granularity === 'quarterly') {
                return {
                    year: date.getUTCFullYear(),
                    quarter: Math.ceil((date.getUTCMonth() + 1) / 3),
                };
            }
            return {
                year: date.getUTCFullYear(),
                month: date.getUTCMonth() + 1,
            };
        };
        AdminDashboardVisitorAnalyticsService_1.prototype.bucketKey = function (bucket) {
            var _a, _b, _c, _d;
            return "".concat((_a = bucket.year) !== null && _a !== void 0 ? _a : 0, ":").concat((_b = bucket.month) !== null && _b !== void 0 ? _b : 0, ":").concat((_c = bucket.quarter) !== null && _c !== void 0 ? _c : 0, ":").concat((_d = bucket.week) !== null && _d !== void 0 ? _d : 0);
        };
        AdminDashboardVisitorAnalyticsService_1.prototype.compareBuckets = function (a, b, granularity) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            var ay = (_a = a.year) !== null && _a !== void 0 ? _a : 0;
            var by = (_b = b.year) !== null && _b !== void 0 ? _b : 0;
            if (ay !== by)
                return ay - by;
            if (granularity === 'weekly')
                return ((_c = a.week) !== null && _c !== void 0 ? _c : 0) - ((_d = b.week) !== null && _d !== void 0 ? _d : 0);
            if (granularity === 'quarterly')
                return ((_e = a.quarter) !== null && _e !== void 0 ? _e : 0) - ((_f = b.quarter) !== null && _f !== void 0 ? _f : 0);
            return ((_g = a.month) !== null && _g !== void 0 ? _g : 0) - ((_h = b.month) !== null && _h !== void 0 ? _h : 0);
        };
        AdminDashboardVisitorAnalyticsService_1.prototype.isoWeekYear = function (date) {
            var target = new Date(date);
            target.setHours(0, 0, 0, 0);
            target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));
            return target.getFullYear();
        };
        AdminDashboardVisitorAnalyticsService_1.prototype.isoWeek = function (date) {
            var target = new Date(date);
            target.setHours(0, 0, 0, 0);
            target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));
            var week1 = new Date(target.getFullYear(), 0, 4);
            return (1 +
                Math.round(((target.getTime() - week1.getTime()) / 86400000 -
                    3 +
                    ((week1.getDay() + 6) % 7)) /
                    7));
        };
        AdminDashboardVisitorAnalyticsService_1.prototype.suggestYMax = function (maxValue) {
            if (maxValue <= 0)
                return 10;
            if (maxValue <= 10)
                return 10;
            if (maxValue <= 100)
                return Math.ceil(maxValue / 10) * 10;
            if (maxValue <= 1000)
                return Math.ceil(maxValue / 100) * 100;
            if (maxValue <= 10000)
                return Math.ceil(maxValue / 1000) * 1000;
            var magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
            var normalized = maxValue / magnitude;
            var nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
            return nice * magnitude;
        };
        return AdminDashboardVisitorAnalyticsService_1;
    }());
    __setFunctionName(_classThis, "AdminDashboardVisitorAnalyticsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminDashboardVisitorAnalyticsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminDashboardVisitorAnalyticsService = _classThis;
}();
exports.AdminDashboardVisitorAnalyticsService = AdminDashboardVisitorAnalyticsService;
