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
exports.GrievancesService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var date_range_validator_1 = require("../common/validators/date-range.validator");
var grievance_schema_1 = require("./schemas/grievance.schema");
function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
var GrievancesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var GrievancesService = _classThis = /** @class */ (function () {
        function GrievancesService_1(grievanceModel, manufacturerModel, lifecycleNotification) {
            this.grievanceModel = grievanceModel;
            this.manufacturerModel = manufacturerModel;
            this.lifecycleNotification = lifecycleNotification;
            this.logger = new common_1.Logger(GrievancesService.name);
        }
        GrievancesService_1.prototype.toObjectId = function (id, label) {
            if (label === void 0) { label = 'ID'; }
            var trimmed = String(id !== null && id !== void 0 ? id : '').trim();
            if (!mongoose_1.Types.ObjectId.isValid(trimmed)) {
                throw new common_1.BadRequestException("Invalid ".concat(label, " format"));
            }
            return new mongoose_1.Types.ObjectId(trimmed);
        };
        GrievancesService_1.prototype.toVendorObjectId = function (vendorId) {
            return this.toObjectId(vendorId, 'vendor ID');
        };
        GrievancesService_1.prototype.manufacturerIdFromGrievance = function (grievance) {
            var _a;
            return String((_a = grievance.vendorId) !== null && _a !== void 0 ? _a : '').trim();
        };
        GrievancesService_1.prototype.scheduleNotification = function (label, task) {
            var _this = this;
            void task().catch(function (err) {
                return _this.logger.warn("[".concat(label, "] notification failed: ").concat((err === null || err === void 0 ? void 0 : err.message) || 'unknown error'));
            });
        };
        GrievancesService_1.prototype.endOfDay = function (date) {
            var d = new Date(date);
            d.setHours(23, 59, 59, 999);
            return d;
        };
        GrievancesService_1.prototype.startOfDay = function (date) {
            var d = new Date(date);
            d.setHours(0, 0, 0, 0);
            return d;
        };
        GrievancesService_1.prototype.buildAdminListFilter = function (query) {
            var _a, _b;
            (0, date_range_validator_1.assertFromDateNotLaterThanToDate)(query.from, query.to);
            var and = [];
            if ((_a = query.search) === null || _a === void 0 ? void 0 : _a.trim()) {
                var regex = new RegExp(escapeRegex(query.search.trim()), 'i');
                and.push({
                    $or: [
                        { grievanceNo: regex },
                        { subject: regex },
                        { category: regex },
                        { description: regex },
                    ],
                });
            }
            if (query.status) {
                and.push({ status: query.status });
            }
            if ((_b = query.category) === null || _b === void 0 ? void 0 : _b.trim()) {
                and.push({ category: query.category.trim() });
            }
            if (query.from || query.to) {
                var createdAt = {};
                if (query.from) {
                    createdAt.$gte = this.startOfDay(new Date(query.from));
                }
                if (query.to) {
                    createdAt.$lte = this.endOfDay(new Date(query.to));
                }
                and.push({ createdAt: createdAt });
            }
            if (and.length === 0)
                return {};
            if (and.length === 1)
                return and[0];
            return { $and: and };
        };
        GrievancesService_1.prototype.vendorNameMap = function (vendorIds) {
            return __awaiter(this, void 0, void 0, function () {
                var unique, rows, map, _i, rows_1, row, name_1;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            unique = __spreadArray([], new Map(vendorIds.map(function (id) { return [String(id), id]; })).values(), true);
                            if (unique.length === 0)
                                return [2 /*return*/, new Map()];
                            return [4 /*yield*/, this.manufacturerModel
                                    .find({ _id: { $in: unique } })
                                    .select({
                                    manufacturerName: 1,
                                    vendor_name: 1,
                                    vendor_email: 1,
                                    vendor_phone: 1,
                                })
                                    .lean()
                                    .exec()];
                        case 1:
                            rows = _c.sent();
                            map = new Map();
                            for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                                row = rows_1[_i];
                                name_1 = String((_a = row.manufacturerName) !== null && _a !== void 0 ? _a : '').trim() ||
                                    String((_b = row.vendor_name) !== null && _b !== void 0 ? _b : '').trim();
                                if (name_1)
                                    map.set(String(row._id), name_1);
                            }
                            return [2 /*return*/, map];
                    }
                });
            });
        };
        GrievancesService_1.prototype.vendorDetailsMap = function (vendorIds) {
            return __awaiter(this, void 0, void 0, function () {
                var unique, rows, map, _i, rows_2, row, vendorName;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            unique = __spreadArray([], new Map(vendorIds.map(function (id) { return [String(id), id]; })).values(), true);
                            if (unique.length === 0)
                                return [2 /*return*/, new Map()];
                            return [4 /*yield*/, this.manufacturerModel
                                    .find({ _id: { $in: unique } })
                                    .select({
                                    manufacturerName: 1,
                                    vendor_name: 1,
                                    vendor_email: 1,
                                    vendor_phone: 1,
                                })
                                    .lean()
                                    .exec()];
                        case 1:
                            rows = _e.sent();
                            map = new Map();
                            for (_i = 0, rows_2 = rows; _i < rows_2.length; _i++) {
                                row = rows_2[_i];
                                vendorName = String((_a = row.manufacturerName) !== null && _a !== void 0 ? _a : '').trim() ||
                                    String((_b = row.vendor_name) !== null && _b !== void 0 ? _b : '').trim() ||
                                    '—';
                                map.set(String(row._id), {
                                    vendorName: vendorName,
                                    vendorEmail: String((_c = row.vendor_email) !== null && _c !== void 0 ? _c : '').trim() || undefined,
                                    vendorPhone: String((_d = row.vendor_phone) !== null && _d !== void 0 ? _d : '').trim() || undefined,
                                });
                            }
                            return [2 /*return*/, map];
                    }
                });
            });
        };
        GrievancesService_1.prototype.collectVendorObjectIds = function (items) {
            var ids = [];
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                var raw = item.vendorId;
                if (raw instanceof mongoose_1.Types.ObjectId) {
                    ids.push(raw);
                }
                else if (typeof raw === 'string' && mongoose_1.Types.ObjectId.isValid(raw)) {
                    ids.push(new mongoose_1.Types.ObjectId(raw));
                }
            }
            return ids;
        };
        GrievancesService_1.prototype.withVendorName = function (doc) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorId, map, details;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vendorId = doc.vendorId;
                            if (!vendorId) {
                                return [2 /*return*/, __assign(__assign({}, doc), { vendorName: '—' })];
                            }
                            return [4 /*yield*/, this.vendorDetailsMap([vendorId])];
                        case 1:
                            map = _a.sent();
                            details = map.get(String(vendorId));
                            return [2 /*return*/, __assign(__assign({}, doc), { vendorName: (details === null || details === void 0 ? void 0 : details.vendorName) || '—', vendorEmail: details === null || details === void 0 ? void 0 : details.vendorEmail, vendorPhone: details === null || details === void 0 ? void 0 : details.vendorPhone })];
                    }
                });
            });
        };
        GrievancesService_1.prototype.withVendorNames = function (items) {
            return __awaiter(this, void 0, void 0, function () {
                var map;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.vendorNameMap(this.collectVendorObjectIds(items))];
                        case 1:
                            map = _a.sent();
                            return [2 /*return*/, items.map(function (item) {
                                    var _a;
                                    return (__assign(__assign({}, item), { vendorName: map.get(String((_a = item.vendorId) !== null && _a !== void 0 ? _a : '')) || '—' }));
                                })];
                    }
                });
            });
        };
        GrievancesService_1.prototype.findAllForVendor = function (vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId;
                return __generator(this, function (_a) {
                    vendorObjectId = this.toVendorObjectId(vendorId);
                    return [2 /*return*/, this.grievanceModel
                            .find({ vendorId: vendorObjectId })
                            .sort({ createdAt: -1 })
                            .exec()];
                });
            });
        };
        GrievancesService_1.prototype.findOneForVendor = function (id, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var grievanceObjectId, vendorObjectId, grievance;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            grievanceObjectId = this.toObjectId(id, 'grievance ID');
                            vendorObjectId = this.toVendorObjectId(vendorId);
                            return [4 /*yield*/, this.grievanceModel
                                    .findOne({
                                    _id: grievanceObjectId,
                                    vendorId: vendorObjectId,
                                })
                                    .exec()];
                        case 1:
                            grievance = _a.sent();
                            if (!grievance) {
                                throw new common_1.NotFoundException('Grievance not found');
                            }
                            return [2 /*return*/, grievance];
                    }
                });
            });
        };
        GrievancesService_1.prototype.createForVendor = function (vendorId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var vendorObjectId, grievance, saved;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vendorObjectId = this.toVendorObjectId(vendorId);
                            grievance = new this.grievanceModel(__assign(__assign({ vendorId: vendorObjectId, category: dto.category.trim(), subject: dto.subject.trim(), description: dto.description.trim() }, (dto.attachment !== undefined && dto.attachment !== null
                                ? { attachment: String(dto.attachment).trim() }
                                : {})), { status: grievance_schema_1.GrievanceStatus.Pending, adminResponse: '', respondedBy: null, respondedAt: null }));
                            return [4 /*yield*/, grievance.save()];
                        case 1:
                            saved = _a.sent();
                            this.scheduleNotification('notifyGrievanceCreated', function () {
                                return _this.lifecycleNotification.notifyGrievanceCreated({
                                    manufacturerId: vendorId,
                                    grievanceId: String(saved._id),
                                    grievanceNo: saved.grievanceNo,
                                    subject: saved.subject,
                                    category: saved.category,
                                });
                            });
                            return [2 /*return*/, saved];
                    }
                });
            });
        };
        GrievancesService_1.prototype.findAllForAdmin = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var page, limit, skip, filter, _a, items, total, enriched;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            page = (_b = query.page) !== null && _b !== void 0 ? _b : 1;
                            limit = (_c = query.limit) !== null && _c !== void 0 ? _c : 10;
                            skip = (page - 1) * limit;
                            filter = this.buildAdminListFilter(query);
                            return [4 /*yield*/, Promise.all([
                                    this.grievanceModel
                                        .find(filter)
                                        .sort({ createdAt: -1 })
                                        .skip(skip)
                                        .limit(limit)
                                        .lean()
                                        .exec(),
                                    this.grievanceModel.countDocuments(filter).exec(),
                                ])];
                        case 1:
                            _a = _d.sent(), items = _a[0], total = _a[1];
                            return [4 /*yield*/, this.withVendorNames(items)];
                        case 2:
                            enriched = _d.sent();
                            return [2 /*return*/, {
                                    items: enriched,
                                    total: total,
                                    page: page,
                                    limit: limit,
                                    totalPages: Math.max(1, Math.ceil(total / limit) || 1),
                                }];
                    }
                });
            });
        };
        GrievancesService_1.prototype.findOneForAdmin = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var grievanceObjectId, grievance;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            grievanceObjectId = this.toObjectId(id, 'grievance ID');
                            return [4 /*yield*/, this.grievanceModel
                                    .findById(grievanceObjectId)
                                    .lean()
                                    .exec()];
                        case 1:
                            grievance = _a.sent();
                            if (!grievance) {
                                throw new common_1.NotFoundException('Grievance not found');
                            }
                            return [2 /*return*/, this.withVendorName(grievance)];
                    }
                });
            });
        };
        GrievancesService_1.prototype.respondForAdmin = function (id, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var grievanceObjectId, grievance, existingResponse, incomingResponse, manufacturerId, saved_1, responderId, saved;
                var _this = this;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            grievanceObjectId = this.toObjectId(id, 'grievance ID');
                            return [4 /*yield*/, this.grievanceModel
                                    .findById(grievanceObjectId)
                                    .exec()];
                        case 1:
                            grievance = _c.sent();
                            if (!grievance) {
                                throw new common_1.NotFoundException('Grievance not found');
                            }
                            if (grievance.status === grievance_schema_1.GrievanceStatus.Closed) {
                                throw new common_1.ConflictException('This grievance is closed and cannot be modified');
                            }
                            existingResponse = String((_a = grievance.adminResponse) !== null && _a !== void 0 ? _a : '').trim();
                            incomingResponse = String((_b = dto.adminResponse) !== null && _b !== void 0 ? _b : '').trim();
                            manufacturerId = this.manufacturerIdFromGrievance(grievance);
                            if (!existingResponse) return [3 /*break*/, 3];
                            if (dto.status !== grievance_schema_1.GrievanceStatus.Closed) {
                                throw new common_1.BadRequestException('A response has already been submitted for this grievance');
                            }
                            grievance.status = grievance_schema_1.GrievanceStatus.Closed;
                            return [4 /*yield*/, grievance.save()];
                        case 2:
                            saved_1 = _c.sent();
                            if (manufacturerId) {
                                this.scheduleNotification('notifyGrievanceClosed', function () {
                                    return _this.lifecycleNotification.notifyGrievanceClosed({
                                        manufacturerId: manufacturerId,
                                        grievanceNo: saved_1.grievanceNo,
                                        subject: saved_1.subject,
                                        category: saved_1.category,
                                    });
                                });
                            }
                            return [2 /*return*/, saved_1];
                        case 3:
                            if (!incomingResponse) {
                                throw new common_1.BadRequestException('Admin response is required');
                            }
                            responderId = this.toObjectId(adminUserId, 'admin user ID');
                            grievance.adminResponse = incomingResponse;
                            grievance.respondedBy = responderId;
                            grievance.respondedAt = new Date();
                            grievance.status = dto.status;
                            return [4 /*yield*/, grievance.save()];
                        case 4:
                            saved = _c.sent();
                            if (manufacturerId) {
                                if (saved.status === grievance_schema_1.GrievanceStatus.Closed) {
                                    this.scheduleNotification('notifyGrievanceClosed', function () {
                                        return _this.lifecycleNotification.notifyGrievanceClosed({
                                            manufacturerId: manufacturerId,
                                            grievanceNo: saved.grievanceNo,
                                            subject: saved.subject,
                                            category: saved.category,
                                        });
                                    });
                                }
                                else {
                                    this.scheduleNotification('notifyGrievanceResponded', function () {
                                        return _this.lifecycleNotification.notifyGrievanceResponded({
                                            manufacturerId: manufacturerId,
                                            grievanceNo: saved.grievanceNo,
                                            subject: saved.subject,
                                            category: saved.category,
                                        });
                                    });
                                }
                            }
                            return [2 /*return*/, saved];
                    }
                });
            });
        };
        return GrievancesService_1;
    }());
    __setFunctionName(_classThis, "GrievancesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GrievancesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GrievancesService = _classThis;
}();
exports.GrievancesService = GrievancesService;
