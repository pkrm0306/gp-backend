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
exports.AuditLogService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var audit_friendlies_1 = require("./audit-friendlies");
var audit_log_user_filter_util_1 = require("./audit-log-user-filter.util");
var audit_response_suppressed_fields_1 = require("./audit-response-suppressed-fields");
var AuditLogService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuditLogService = _classThis = /** @class */ (function () {
        function AuditLogService_1(auditLogModel, lookupResolver, valueTransformer) {
            this.auditLogModel = auditLogModel;
            this.lookupResolver = lookupResolver;
            this.valueTransformer = valueTransformer;
            this.logger = new common_1.Logger('AuditLog');
        }
        /**
         * Append-only insert. Never throws to callers for persistence failures.
         */
        AuditLogService_1.prototype.record = function (entry_1) {
            return __awaiter(this, arguments, void 0, function (entry, options) {
                var doc, e_1, msg;
                var _a;
                if (options === void 0) { options = {}; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 5, , 6]);
                            doc = {
                                occurred_at: (_a = entry.occurred_at) !== null && _a !== void 0 ? _a : new Date(),
                                action: entry.action,
                                outcome: entry.outcome,
                                module: entry.module,
                                action_type: entry.action_type,
                                entity_name: entry.entity_name,
                                description: entry.description,
                                performed_by: entry.performed_by,
                                old_values: this.valueTransformer.sanitizeSnapshot(entry.old_values),
                                new_values: this.valueTransformer.sanitizeSnapshot(entry.new_values),
                                http_method: entry.http_method,
                                route: entry.route,
                                status_code: entry.status_code,
                                actor: entry.actor,
                                resource: entry.resource,
                                request: entry.request,
                                changes: this.valueTransformer.sanitizeChanges(entry.changes),
                                metadata: entry.metadata,
                            };
                            if (!options.session) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.auditLogModel.create([doc], { session: options.session })];
                        case 1:
                            _b.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.auditLogModel.create(doc)];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            e_1 = _b.sent();
                            msg = e_1 instanceof Error ? e_1.message : String(e_1);
                            if (this.isDuplicateKeyError(e_1)) {
                                this.logger.debug("[AuditLog] duplicate event skipped: ".concat(msg));
                                return [2 /*return*/];
                            }
                            if (options.throwOnError) {
                                throw e_1;
                            }
                            this.logger.warn("[AuditLog] insert failed: ".concat(msg));
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /** Batch append-only insert for bulk admin actions (e.g. URN reactivation). */
        AuditLogService_1.prototype.recordMany = function (entries_1) {
            return __awaiter(this, arguments, void 0, function (entries, options) {
                var docs, e_2, msg;
                var _this = this;
                if (options === void 0) { options = {}; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!entries.length)
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            docs = entries.map(function (entry) {
                                var _a;
                                return ({
                                    occurred_at: (_a = entry.occurred_at) !== null && _a !== void 0 ? _a : new Date(),
                                    action: entry.action,
                                    outcome: entry.outcome,
                                    module: entry.module,
                                    action_type: entry.action_type,
                                    entity_name: entry.entity_name,
                                    description: entry.description,
                                    performed_by: entry.performed_by,
                                    old_values: _this.valueTransformer.sanitizeSnapshot(entry.old_values),
                                    new_values: _this.valueTransformer.sanitizeSnapshot(entry.new_values),
                                    http_method: entry.http_method,
                                    route: entry.route,
                                    status_code: entry.status_code,
                                    actor: entry.actor,
                                    resource: entry.resource,
                                    request: entry.request,
                                    changes: _this.valueTransformer.sanitizeChanges(entry.changes),
                                    metadata: entry.metadata,
                                });
                            });
                            if (!options.session) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.auditLogModel.insertMany(docs, {
                                    session: options.session,
                                    ordered: false,
                                })];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, this.auditLogModel.insertMany(docs, { ordered: false })];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            e_2 = _a.sent();
                            msg = e_2 instanceof Error ? e_2.message : String(e_2);
                            if (options.throwOnError) {
                                throw e_2;
                            }
                            this.logger.warn("[AuditLog] bulk insert failed: ".concat(msg));
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        AuditLogService_1.prototype.list = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var page, limit, _a, filter, from, to, skip, _b, itemsRaw, total, items;
                var _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            page = (_c = query.page) !== null && _c !== void 0 ? _c : 1;
                            limit = (_d = query.limit) !== null && _d !== void 0 ? _d : 20;
                            _a = this.buildFilter(query), filter = _a.filter, from = _a.from, to = _a.to;
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, Promise.all([
                                    this.auditLogModel
                                        .find(filter)
                                        .sort({ occurred_at: -1 })
                                        .skip(skip)
                                        .limit(limit)
                                        .lean()
                                        .exec(),
                                    this.auditLogModel.countDocuments(filter).exec(),
                                ])];
                        case 1:
                            _b = _e.sent(), itemsRaw = _b[0], total = _b[1];
                            return [4 /*yield*/, this.enrichRows(itemsRaw)];
                        case 2:
                            items = _e.sent();
                            return [2 /*return*/, {
                                    items: items,
                                    total: total,
                                    page: page,
                                    limit: limit,
                                    pages: Math.max(1, Math.ceil(total / limit)),
                                    from: from,
                                    to: to,
                                }];
                    }
                });
            });
        };
        AuditLogService_1.prototype.filterOptions = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var page, limit, _a, filter, from, to, skip, result, totalCount;
                var _b, _c, _d, _e, _f, _g, _h, _j, _k;
                return __generator(this, function (_l) {
                    switch (_l.label) {
                        case 0:
                            page = (_b = query.page) !== null && _b !== void 0 ? _b : 1;
                            limit = (_c = query.limit) !== null && _c !== void 0 ? _c : 20;
                            _a = this.buildFilter(query), filter = _a.filter, from = _a.from, to = _a.to;
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, this.auditLogModel
                                    .aggregate([
                                    { $match: filter },
                                    {
                                        $facet: {
                                            modules: [
                                                { $match: { module: { $type: 'string', $ne: '' } } },
                                                { $group: { _id: '$module', count: { $sum: 1 } } },
                                                { $sort: { count: -1, _id: 1 } },
                                            ],
                                            action_types: [
                                                { $match: { action_type: { $type: 'string', $ne: '' } } },
                                                { $group: { _id: '$action_type', count: { $sum: 1 } } },
                                                { $sort: { count: -1, _id: 1 } },
                                            ],
                                            actions: [
                                                { $match: { action: { $type: 'string', $ne: '' } } },
                                                { $group: { _id: '$action', count: { $sum: 1 } } },
                                                { $sort: { count: -1, _id: 1 } },
                                                { $skip: skip },
                                                { $limit: limit },
                                            ],
                                            users: [
                                                {
                                                    $project: {
                                                        user_id: {
                                                            $let: {
                                                                vars: {
                                                                    raw: {
                                                                        $ifNull: [
                                                                            '$performed_by.user_id',
                                                                            '$actor.user_id',
                                                                        ],
                                                                    },
                                                                },
                                                                in: {
                                                                    $cond: [
                                                                        {
                                                                            $in: [
                                                                                { $type: '$$raw' },
                                                                                ['string', 'objectId', 'int', 'long', 'double', 'decimal'],
                                                                            ],
                                                                        },
                                                                        { $toString: '$$raw' },
                                                                        '',
                                                                    ],
                                                                },
                                                            },
                                                        },
                                                        user_label: {
                                                            $ifNull: [
                                                                '$performed_by.name',
                                                                {
                                                                    $ifNull: [
                                                                        '$performed_by.email',
                                                                        {
                                                                            $let: {
                                                                                vars: {
                                                                                    raw: {
                                                                                        $ifNull: [
                                                                                            '$performed_by.user_id',
                                                                                            '$actor.user_id',
                                                                                        ],
                                                                                    },
                                                                                },
                                                                                in: {
                                                                                    $cond: [
                                                                                        {
                                                                                            $in: [
                                                                                                { $type: '$$raw' },
                                                                                                ['string', 'objectId', 'int', 'long', 'double', 'decimal'],
                                                                                            ],
                                                                                        },
                                                                                        { $toString: '$$raw' },
                                                                                        '',
                                                                                    ],
                                                                                },
                                                                            },
                                                                        },
                                                                    ],
                                                                },
                                                            ],
                                                        },
                                                    },
                                                },
                                                { $match: { user_id: { $type: 'string', $ne: '' } } },
                                                { $group: { _id: '$user_id', label: { $first: '$user_label' }, count: { $sum: 1 } } },
                                                { $sort: { count: -1, _id: 1 } },
                                                { $skip: skip },
                                                { $limit: limit },
                                            ],
                                            actionsTotal: [
                                                { $match: { action: { $type: 'string', $ne: '' } } },
                                                { $group: { _id: '$action' } },
                                                { $count: 'count' },
                                            ],
                                        },
                                    },
                                ])
                                    .exec()];
                        case 1:
                            result = (_l.sent())[0];
                            totalCount = (_f = (_e = (_d = result === null || result === void 0 ? void 0 : result.actionsTotal) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.count) !== null && _f !== void 0 ? _f : 0;
                            return [2 /*return*/, {
                                    modules: this.toOptions((_g = result === null || result === void 0 ? void 0 : result.modules) !== null && _g !== void 0 ? _g : [], function (value) {
                                        return (0, audit_friendlies_1.auditModuleDisplayName)(value);
                                    }),
                                    action_types: this.toOptions((_h = result === null || result === void 0 ? void 0 : result.action_types) !== null && _h !== void 0 ? _h : []),
                                    actions: this.toOptions((_j = result === null || result === void 0 ? void 0 : result.actions) !== null && _j !== void 0 ? _j : []),
                                    users: this.toUserFilterOptions((_k = result === null || result === void 0 ? void 0 : result.users) !== null && _k !== void 0 ? _k : []),
                                    pagination: {
                                        page: page,
                                        limit: limit,
                                        totalCount: totalCount,
                                        totalPages: Math.max(1, Math.ceil(totalCount / limit)),
                                    },
                                    from: from,
                                    to: to,
                                }];
                    }
                });
            });
        };
        AuditLogService_1.prototype.findById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var raw, row, productValues, labels, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, this.auditLogModel
                                    .findById(new mongoose_1.Types.ObjectId(id))
                                    .lean()
                                    .exec()];
                        case 1:
                            raw = _b.sent();
                            if (!raw) {
                                return [2 /*return*/, null];
                            }
                            row = raw;
                            productValues = this.lookupResolver.onlyModels(this.lookupResolver.collectValues(__spreadArray([
                                row.old_values,
                                row.new_values
                            ], this.changeValueSnapshots(row.changes), true)), ['product']);
                            if (!(productValues.size > 0)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.lookupResolver.resolveLookupLabels(productValues)];
                        case 2:
                            _a = _b.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a = new Map();
                            _b.label = 4;
                        case 4:
                            labels = _a;
                            return [2 /*return*/, this.transformStoredRow(row, labels)];
                    }
                });
            });
        };
        AuditLogService_1.prototype.buildFilter = function (query) {
            var filter = {};
            if (query.action) {
                filter.action = query.action;
            }
            if (query.module) {
                filter.module = query.module;
            }
            if (query.action_type) {
                filter.action_type = query.action_type;
            }
            if (query.actor_user_id) {
                var actorFilter = (0, audit_log_user_filter_util_1.buildAuditActorUserFilter)(query.actor_user_id);
                if (actorFilter) {
                    Object.assign(filter, actorFilter);
                }
            }
            if (query.resource_type) {
                filter['resource.type'] = query.resource_type;
            }
            if (query.resource_id) {
                filter['resource.id'] = query.resource_id;
            }
            if (query.urn_no) {
                filter['resource.urn_no'] = query.urn_no;
            }
            var to = query.to ? new Date(query.to) : new Date();
            var from = query.from ? new Date(query.from) : new Date(to);
            if (!query.from) {
                from.setMonth(from.getMonth() - 1);
            }
            filter.occurred_at = { $gte: from, $lte: to };
            return { filter: filter, from: from, to: to };
        };
        AuditLogService_1.prototype.toUserFilterOptions = function (rows) {
            return rows
                .map(function (row) {
                var _a, _b, _c;
                return ({
                    value: String((_a = row._id) !== null && _a !== void 0 ? _a : '').trim(),
                    label: String((_c = (_b = row.label) !== null && _b !== void 0 ? _b : row._id) !== null && _c !== void 0 ? _c : '').trim(),
                    count: row.count,
                });
            })
                .filter(function (row) { return row.value !== ''; })
                .map(function (row) { return ({
                value: row.value,
                label: row.label || row.value,
                count: row.count,
            }); });
        };
        AuditLogService_1.prototype.toOptions = function (rows, labelFor) {
            if (labelFor === void 0) { labelFor = function (value) { return value; }; }
            return rows
                .filter(function (row) { return typeof row._id === 'string' && row._id.trim() !== ''; })
                .map(function (row) {
                var _a;
                return ({
                    value: row._id,
                    label: (_a = labelFor(row._id)) !== null && _a !== void 0 ? _a : row._id,
                    count: row.count,
                });
            });
        };
        AuditLogService_1.prototype.enrichRows = function (rows) {
            return __awaiter(this, void 0, void 0, function () {
                var valuesByModel, labels;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            valuesByModel = this.lookupResolver.collectValues(rows.flatMap(function (row) { return __spreadArray([
                                row.old_values,
                                row.new_values
                            ], _this.changeValueSnapshots(row.changes), true); }));
                            return [4 /*yield*/, this.lookupResolver.resolveLookupLabels(valuesByModel)];
                        case 1:
                            labels = _a.sent();
                            return [2 /*return*/, rows.map(function (row) { return _this.stripResponseSuppressedFields(__assign(__assign({}, row), { old_values: _this.enrichValues(row.old_values, labels), new_values: _this.enrichValues(row.new_values, labels), changes: _this.enrichChanges(row.changes, labels) })); })];
                    }
                });
            });
        };
        /** Hide internal process-tab status flags from API output only. */
        AuditLogService_1.prototype.stripResponseSuppressedFields = function (row) {
            return __assign(__assign({}, row), { old_values: (0, audit_response_suppressed_fields_1.omitSuppressedAuditResponseFields)(row.old_values), new_values: (0, audit_response_suppressed_fields_1.omitSuppressedAuditResponseFields)(row.new_values), changes: (0, audit_response_suppressed_fields_1.omitSuppressedAuditResponseChanges)(row.changes) });
        };
        AuditLogService_1.prototype.enrichValues = function (values, labels) {
            var _this = this;
            return this.valueTransformer.transformDisplayValues(values, function (key, value) {
                return _this.lookupResolver.resolveLabel(labels, key, value);
            });
        };
        AuditLogService_1.prototype.enrichChanges = function (changes, labels) {
            var _this = this;
            return this.valueTransformer.transformDisplayChanges(changes, function (key, value) { return _this.lookupResolver.resolveLabel(labels, key, value); });
        };
        AuditLogService_1.prototype.transformStoredRow = function (row, labels) {
            var _this = this;
            return this.stripResponseSuppressedFields(__assign(__assign({}, row), { old_values: this.valueTransformer.transformDisplayValues(row.old_values, function (key, value) { return _this.lookupResolver.resolveLabel(labels, key, value); }), new_values: this.valueTransformer.transformDisplayValues(row.new_values, function (key, value) { return _this.lookupResolver.resolveLabel(labels, key, value); }), changes: this.valueTransformer.transformDisplayChanges(row.changes, function (key, value) { return _this.lookupResolver.resolveLabel(labels, key, value); }) }));
        };
        AuditLogService_1.prototype.changeValueSnapshots = function (changes) {
            if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
                return [];
            }
            var before = {};
            var after = {};
            for (var _i = 0, _a = Object.entries(changes); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                if (!value || typeof value !== 'object' || Array.isArray(value)) {
                    continue;
                }
                var pair = value;
                if (pair.before !== undefined) {
                    before[key] = pair.before;
                }
                if (pair.after !== undefined) {
                    after[key] = pair.after;
                }
            }
            return [before, after].filter(function (snapshot) { return Object.keys(snapshot).length; });
        };
        AuditLogService_1.prototype.isDuplicateKeyError = function (error) {
            return (typeof error === 'object' &&
                error !== null &&
                error.code === 11000);
        };
        return AuditLogService_1;
    }());
    __setFunctionName(_classThis, "AuditLogService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuditLogService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuditLogService = _classThis;
}();
exports.AuditLogService = AuditLogService;
