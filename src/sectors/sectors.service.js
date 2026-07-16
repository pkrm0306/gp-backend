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
exports.SectorsService = void 0;
var common_1 = require("@nestjs/common");
var sector_id_counter_schema_1 = require("./schemas/sector-id-counter.schema");
function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function csvEscape(value) {
    if (value === null || value === undefined)
        return '';
    var s = value instanceof Date ? value.toISOString() : String(value);
    if (/[",\n\r]/.test(s)) {
        return "\"".concat(s.replace(/"/g, '""'), "\"");
    }
    return s;
}
var SectorsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SectorsService = _classThis = /** @class */ (function () {
        function SectorsService_1(sectorModel, counterModel, categoryModel, configService, redisService) {
            this.sectorModel = sectorModel;
            this.counterModel = counterModel;
            this.categoryModel = categoryModel;
            this.configService = configService;
            this.redisService = redisService;
            this.logger = new common_1.Logger(SectorsService.name);
        }
        /** Block sector delete when one or more categories still reference this sector id. */
        SectorsService_1.prototype.assertSectorNotAllocatedToCategories = function (sectorId) {
            return __awaiter(this, void 0, void 0, function () {
                var total, sample, names, nameHint;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.categoryModel.countDocuments({ sector: sectorId }).exec()];
                        case 1:
                            total = _a.sent();
                            if (total === 0) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.categoryModel
                                    .find({ sector: sectorId })
                                    .select('category_name')
                                    .sort({ category_name: 1 })
                                    .limit(5)
                                    .lean()
                                    .exec()];
                        case 2:
                            sample = _a.sent();
                            names = sample
                                .map(function (c) { var _a; return String((_a = c.category_name) !== null && _a !== void 0 ? _a : '').trim(); })
                                .filter(Boolean);
                            nameHint = names.length > 0
                                ? ": ".concat(names.join(', ')).concat(total > names.length ? ', …' : '')
                                : '';
                            throw new common_1.ConflictException("This sector cannot be deleted because it is assigned to ".concat(total, " ") +
                                "categor".concat(total === 1 ? 'y' : 'ies').concat(nameHint, ". ") +
                                'Reassign or remove those categories first.');
                    }
                });
            });
        };
        SectorsService_1.prototype.getSectorListCacheTtlSeconds = function () {
            var ttl = parseInt(this.configService.get('SECTOR_LIST_CACHE_TTL_SECONDS') ||
                this.configService.get('CACHE_TTL_SECONDS') ||
                '60', 10);
            return Number.isFinite(ttl) && ttl > 0 ? ttl : 60;
        };
        SectorsService_1.prototype.buildSectorListCacheKey = function (query) {
            var _a, _b, _c, _d;
            var normalized = {
                page: (_a = query.page) !== null && _a !== void 0 ? _a : 1,
                limit: (_b = query.limit) !== null && _b !== void 0 ? _b : 10,
                search: String(query.search || '').trim().toLowerCase(),
                status: (_c = query.status) !== null && _c !== void 0 ? _c : null,
                sortBy: (_d = query.sortBy) !== null && _d !== void 0 ? _d : 'id',
                order: query.order === 'desc' ? 'desc' : 'asc',
            };
            return this.redisService.buildKey('sectors', 'list', JSON.stringify(normalized));
        };
        SectorsService_1.prototype.invalidateSectorListCache = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.redisService
                                .deleteByPattern(this.redisService.buildKey('sectors', 'list', '*'))
                                .catch(function (error) {
                                _this.logger.warn("Failed to invalidate sector list cache: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SectorsService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.syncSectorIdCounter()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SectorsService_1.prototype.getMaxSectorIdFromCollection = function () {
            return __awaiter(this, void 0, void 0, function () {
                var agg, max;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.sectorModel
                                .aggregate([{ $group: { _id: null, maxId: { $max: '$id' } } }])
                                .exec()];
                        case 1:
                            agg = _b.sent();
                            max = (_a = agg[0]) === null || _a === void 0 ? void 0 : _a.maxId;
                            return [2 /*return*/, typeof max === 'number' && Number.isFinite(max) ? max : 0];
                    }
                });
            });
        };
        SectorsService_1.prototype.syncSectorIdCounter = function () {
            return __awaiter(this, void 0, void 0, function () {
                var maxFromDocs, existing, currentSeq, seed;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.getMaxSectorIdFromCollection()];
                        case 1:
                            maxFromDocs = _b.sent();
                            return [4 /*yield*/, this.counterModel
                                    .findOne({ _id: sector_id_counter_schema_1.SECTOR_ID_COUNTER_KEY })
                                    .lean()
                                    .exec()];
                        case 2:
                            existing = _b.sent();
                            currentSeq = (_a = existing === null || existing === void 0 ? void 0 : existing.seq) !== null && _a !== void 0 ? _a : 0;
                            seed = Math.max(currentSeq, maxFromDocs);
                            return [4 /*yield*/, this.counterModel
                                    .updateOne({ _id: sector_id_counter_schema_1.SECTOR_ID_COUNTER_KEY }, { $set: { seq: seed } }, { upsert: true })
                                    .exec()];
                        case 3:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SectorsService_1.prototype.nextSectorId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var doc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.counterModel
                                .findOneAndUpdate({ _id: sector_id_counter_schema_1.SECTOR_ID_COUNTER_KEY }, { $inc: { seq: 1 } }, { new: true, upsert: true })
                                .exec()];
                        case 1:
                            doc = _a.sent();
                            if (!doc || typeof doc.seq !== 'number' || !Number.isFinite(doc.seq)) {
                                throw new Error('Failed to allocate sector id');
                            }
                            return [2 /*return*/, doc.seq];
                    }
                });
            });
        };
        SectorsService_1.prototype.parseSectorId = function (param) {
            var n = parseInt(param, 10);
            if (!Number.isFinite(n) || n < 1) {
                throw new common_1.BadRequestException('Invalid sector id');
            }
            return n;
        };
        SectorsService_1.prototype.notDeletedFilter = function () {
            return {
                $or: [{ deleted_at: null }, { deleted_at: { $exists: false } }],
            };
        };
        SectorsService_1.prototype.buildListFilter = function (query) {
            var base = this.notDeletedFilter();
            var and = [base];
            if (query.search !== undefined && query.search.trim() !== '') {
                and.push({
                    name: { $regex: new RegExp(escapeRegex(query.search.trim()), 'i') },
                });
            }
            if (query.status !== undefined) {
                and.push({ status: query.status });
            }
            if (and.length === 1) {
                return and[0];
            }
            return { $and: and };
        };
        SectorsService_1.prototype.findAllPaginated = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, error_1, page, limit, sortBy, order, sortOrder, sort, filter, skip, _a, data, total, response;
                var _b;
                var _this = this;
                var _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            cacheKey = this.buildSectorListCacheKey(query);
                            _g.label = 1;
                        case 1:
                            _g.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _g.sent();
                            if (cached && Array.isArray(cached.data)) {
                                return [2 /*return*/, cached];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _g.sent();
                            this.logger.warn("Sector list cache read failed: ".concat((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4:
                            page = (_c = query.page) !== null && _c !== void 0 ? _c : 1;
                            limit = (_d = query.limit) !== null && _d !== void 0 ? _d : 10;
                            sortBy = (_e = query.sortBy) !== null && _e !== void 0 ? _e : 'id';
                            order = (_f = query.order) !== null && _f !== void 0 ? _f : 'asc';
                            sortOrder = order === 'desc' ? -1 : 1;
                            sort = (_b = {}, _b[sortBy] = sortOrder, _b);
                            filter = this.buildListFilter(query);
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, Promise.all([
                                    this.sectorModel
                                        .find(filter)
                                        .sort(sort)
                                        .skip(skip)
                                        .limit(limit)
                                        .lean()
                                        .exec(),
                                    this.sectorModel.countDocuments(filter).exec(),
                                ])];
                        case 5:
                            _a = _g.sent(), data = _a[0], total = _a[1];
                            response = {
                                message: 'Sectors retrieved successfully',
                                data: data,
                                total: total,
                                page: page,
                                limit: limit,
                            };
                            this.redisService
                                .set(cacheKey, response, this.getSectorListCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("Sector list cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, response];
                    }
                });
            });
        };
        SectorsService_1.prototype.findOneById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var doc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.sectorModel
                                .findOne(__assign({ id: id }, this.notDeletedFilter()))
                                .lean()
                                .exec()];
                        case 1:
                            doc = _a.sent();
                            if (!doc) {
                                throw new common_1.NotFoundException('Sector not found');
                            }
                            return [2 /*return*/, doc];
                    }
                });
            });
        };
        /** Ensures sector `id` exists and is not soft-deleted (for standards / validation). */
        SectorsService_1.prototype.assertSectorExists = function (sectorId) {
            return __awaiter(this, void 0, void 0, function () {
                var ok;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!Number.isInteger(sectorId) || sectorId < 1) {
                                throw new common_1.BadRequestException('Invalid sector id');
                            }
                            return [4 /*yield*/, this.sectorModel.exists(__assign({ id: sectorId }, this.notDeletedFilter()))];
                        case 1:
                            ok = _a.sent();
                            if (!ok) {
                                throw new common_1.BadRequestException({
                                    statusCode: 400,
                                    message: 'Unknown sector id',
                                    sector: sectorId,
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Sector display names for numeric sector ids (GET /sectors `id`). */
        SectorsService_1.prototype.getSectorNamesByNumericIds = function (sectorIds) {
            return __awaiter(this, void 0, void 0, function () {
                var unique, rows;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            unique = __spreadArray([], new Set(sectorIds.filter(function (x) {
                                return typeof x === 'number' && Number.isInteger(x) && x >= 1;
                            })), true);
                            if (!unique.length) {
                                return [2 /*return*/, new Map()];
                            }
                            return [4 /*yield*/, this.sectorModel
                                    .find(__assign({ id: { $in: unique } }, this.notDeletedFilter()))
                                    .select('id name')
                                    .lean()
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, new Map(rows.map(function (r) { return [r.id, r.name]; }))];
                    }
                });
            });
        };
        SectorsService_1.prototype.create = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var now, sectorId, doc, created;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            now = new Date();
                            return [4 /*yield*/, this.nextSectorId()];
                        case 1:
                            sectorId = _d.sent();
                            return [4 /*yield*/, this.sectorModel.create({
                                    id: sectorId,
                                    name: dto.name.trim(),
                                    description: (_b = (_a = dto.description) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '',
                                    status: (_c = dto.status) !== null && _c !== void 0 ? _c : 1,
                                    created_at: now,
                                    updated_at: now,
                                    deleted_at: null,
                                })];
                        case 2:
                            doc = _d.sent();
                            created = doc.toObject();
                            return [4 /*yield*/, this.invalidateSectorListCache()];
                        case 3:
                            _d.sent();
                            return [2 /*return*/, created];
                    }
                });
            });
        };
        SectorsService_1.prototype.update = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var set, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (dto.name === undefined &&
                                dto.description === undefined &&
                                dto.status === undefined) {
                                throw new common_1.BadRequestException('Provide name, description and/or status to update');
                            }
                            set = { updated_at: new Date() };
                            if (dto.name !== undefined) {
                                set.name = dto.name.trim();
                            }
                            if (dto.description !== undefined) {
                                set.description = dto.description.trim();
                            }
                            if (dto.status !== undefined) {
                                set.status = dto.status;
                            }
                            return [4 /*yield*/, this.sectorModel
                                    .findOneAndUpdate(__assign({ id: id }, this.notDeletedFilter()), { $set: set }, { new: true })
                                    .lean()
                                    .exec()];
                        case 1:
                            updated = _a.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Sector not found');
                            }
                            return [4 /*yield*/, this.invalidateSectorListCache()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        SectorsService_1.prototype.updateStatus = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.sectorModel
                                .findOneAndUpdate(__assign({ id: id }, this.notDeletedFilter()), { $set: { status: dto.status, updated_at: new Date() } }, { new: true })
                                .lean()
                                .exec()];
                        case 1:
                            updated = _a.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Sector not found');
                            }
                            return [4 /*yield*/, this.invalidateSectorListCache()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        SectorsService_1.prototype.softDelete = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.assertSectorNotAllocatedToCategories(id)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.sectorModel
                                    .findOneAndUpdate(__assign({ id: id }, this.notDeletedFilter()), { $set: { deleted_at: new Date(), updated_at: new Date() } }, { new: true })
                                    .lean()
                                    .exec()];
                        case 2:
                            updated = _a.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Sector not found');
                            }
                            return [4 /*yield*/, this.invalidateSectorListCache()];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        /** CSV rows for non-deleted sectors; same filters as list (search, status) — no pagination */
        SectorsService_1.prototype.buildCsvExport = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var sortBy, order, sort, filter, rows, header, lines;
                var _a;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            sortBy = (_b = query.sortBy) !== null && _b !== void 0 ? _b : 'id';
                            order = (_c = query.order) !== null && _c !== void 0 ? _c : 'asc';
                            sort = (_a = {},
                                _a[sortBy] = order === 'desc' ? -1 : 1,
                                _a);
                            filter = this.buildListFilter(query);
                            return [4 /*yield*/, this.sectorModel.find(filter).sort(sort).lean().exec()];
                        case 1:
                            rows = _d.sent();
                            header = [
                                'id',
                                'name',
                                'description',
                                'status',
                                'created_at',
                                'updated_at',
                            ];
                            lines = __spreadArray([
                                header.join(',')
                            ], rows.map(function (r) {
                                return [r.id, r.name, r.description, r.status, r.created_at, r.updated_at]
                                    .map(csvEscape)
                                    .join(',');
                            }), true);
                            return [2 /*return*/, lines.join('\r\n')];
                    }
                });
            });
        };
        /** Active sectors for admin/vendor filter dropdowns (Building, Industries, …). */
        SectorsService_1.prototype.buildDropdownOptions = function () {
            return __awaiter(this, void 0, void 0, function () {
                var rows;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.sectorModel
                                .find({ status: 1, deleted_at: null })
                                .select('id name')
                                .sort({ name: 1 })
                                .lean()
                                .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, (rows !== null && rows !== void 0 ? rows : [])
                                    .map(function (row) {
                                    var _a;
                                    var id = Number(row.id);
                                    if (!Number.isFinite(id)) {
                                        return null;
                                    }
                                    var label = String((_a = row.name) !== null && _a !== void 0 ? _a : '').trim();
                                    return {
                                        value: String(id),
                                        label: label || "Sector ".concat(id),
                                    };
                                })
                                    .filter(function (row) { return row != null; })];
                    }
                });
            });
        };
        return SectorsService_1;
    }());
    __setFunctionName(_classThis, "SectorsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SectorsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SectorsService = _classThis;
}();
exports.SectorsService = SectorsService;
