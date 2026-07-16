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
exports.WebsiteAnalyticsService = void 0;
var common_1 = require("@nestjs/common");
var dashboard_metrics_filters_util_1 = require("../admin/utils/dashboard-metrics-filters.util");
var WebsiteAnalyticsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var WebsiteAnalyticsService = _classThis = /** @class */ (function () {
        function WebsiteAnalyticsService_1(eventModel) {
            this.eventModel = eventModel;
        }
        WebsiteAnalyticsService_1.prototype.collect = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var visitorId, docs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            visitorId = dto.visitorId.trim();
                            docs = dto.events.map(function (event) {
                                var _a, _b, _c;
                                return ({
                                    eventType: event.type,
                                    visitorId: visitorId,
                                    path: ((_a = event.path) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                                    signUpType: ((_b = event.signUpType) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
                                    measurementId: ((_c = dto.measurementId) === null || _c === void 0 ? void 0 : _c.trim()) || undefined,
                                    createdAt: event.timestamp ? new Date(event.timestamp) : new Date(),
                                });
                            });
                            if (docs.length === 0)
                                return [2 /*return*/, { accepted: 0 }];
                            return [4 /*yield*/, this.eventModel.insertMany(docs, { ordered: false })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { accepted: docs.length }];
                    }
                });
            });
        };
        WebsiteAnalyticsService_1.prototype.recordSignUp = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var visitorId;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            visitorId = params.visitorKey.trim();
                            if (!visitorId)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.eventModel.create({
                                    eventType: 'sign_up',
                                    visitorId: visitorId,
                                    signUpType: params.signUpType.trim(),
                                    path: ((_a = params.path) === null || _a === void 0 ? void 0 : _a.trim()) || undefined,
                                    createdAt: new Date(),
                                })];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WebsiteAnalyticsService_1.prototype.getChartPoints = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var now, granularity, dateRange, events, buckets, ensureBucket, _i, events_1, row, bucket, visitorId;
                var _this = this;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            now = new Date();
                            granularity = (_a = filters.granularity) !== null && _a !== void 0 ? _a : 'monthly';
                            dateRange = (_b = filters.dateRange) !== null && _b !== void 0 ? _b : this.defaultTrailingRange(now, granularity);
                            return [4 /*yield*/, this.eventModel
                                    .find({
                                    createdAt: { $gte: dateRange.from, $lte: dateRange.to },
                                })
                                    .select('eventType visitorId createdAt')
                                    .lean()
                                    .exec()];
                        case 1:
                            events = _d.sent();
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
                                    visitorIds: new Set(),
                                    signUps: 0,
                                };
                                buckets.set(key, created);
                                return created;
                            };
                            for (_i = 0, events_1 = events; _i < events_1.length; _i++) {
                                row = events_1[_i];
                                if (!row.createdAt)
                                    continue;
                                bucket = ensureBucket(new Date(row.createdAt));
                                visitorId = String((_c = row.visitorId) !== null && _c !== void 0 ? _c : '').trim();
                                if (row.eventType === 'page_view') {
                                    bucket.pageViews += 1;
                                    if (visitorId)
                                        bucket.visitorIds.add(visitorId);
                                }
                                else if (row.eventType === 'sign_up') {
                                    bucket.signUps += 1;
                                    if (visitorId)
                                        bucket.visitorIds.add(visitorId);
                                }
                            }
                            return [2 /*return*/, __spreadArray([], buckets.values(), true).sort(function (a, b) { return _this.compareBuckets(a.bucket, b.bucket, granularity); })
                                    .map(function (bucket) {
                                    var _a;
                                    return ({
                                        label: bucket.label,
                                        year: (_a = bucket.bucket.year) !== null && _a !== void 0 ? _a : 0,
                                        month: bucket.bucket.month,
                                        quarter: bucket.bucket.quarter,
                                        week: bucket.bucket.week,
                                        pageViews: bucket.pageViews,
                                        visitors: bucket.visitorIds.size,
                                        signUps: bucket.signUps,
                                    });
                                })];
                    }
                });
            });
        };
        WebsiteAnalyticsService_1.prototype.hasAnyEvents = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sample;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.eventModel.findOne().select('_id').lean().exec()];
                        case 1:
                            sample = _a.sent();
                            return [2 /*return*/, Boolean(sample)];
                    }
                });
            });
        };
        WebsiteAnalyticsService_1.prototype.defaultTrailingRange = function (now, granularity) {
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
        WebsiteAnalyticsService_1.prototype.resolveBucketId = function (date, granularity) {
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
        WebsiteAnalyticsService_1.prototype.bucketKey = function (bucket) {
            var _a, _b, _c, _d;
            return "".concat((_a = bucket.year) !== null && _a !== void 0 ? _a : 0, ":").concat((_b = bucket.month) !== null && _b !== void 0 ? _b : 0, ":").concat((_c = bucket.quarter) !== null && _c !== void 0 ? _c : 0, ":").concat((_d = bucket.week) !== null && _d !== void 0 ? _d : 0);
        };
        WebsiteAnalyticsService_1.prototype.compareBuckets = function (a, b, granularity) {
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
        WebsiteAnalyticsService_1.prototype.isoWeekYear = function (date) {
            var target = new Date(date);
            target.setHours(0, 0, 0, 0);
            target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));
            return target.getFullYear();
        };
        WebsiteAnalyticsService_1.prototype.isoWeek = function (date) {
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
        return WebsiteAnalyticsService_1;
    }());
    __setFunctionName(_classThis, "WebsiteAnalyticsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WebsiteAnalyticsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WebsiteAnalyticsService = _classThis;
}();
exports.WebsiteAnalyticsService = WebsiteAnalyticsService;
