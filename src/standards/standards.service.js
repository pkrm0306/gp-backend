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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
exports.StandardsService = void 0;
var common_1 = require("@nestjs/common");
var fs_1 = require("fs");
var path_1 = require("path");
var upload_file_util_1 = require("../utils/upload-file.util");
var standard_id_counter_schema_1 = require("./schemas/standard-id-counter.schema");
var merge_category_ids_util_1 = require("./utils/merge-category-ids.util");
var parse_resource_standard_types_util_1 = require("./utils/parse-resource-standard-types.util");
var standard_public_file_url_util_1 = require("./utils/standard-public-file-url.util");
var merge_sector_ids_from_form_util_1 = require("./utils/merge-sector-ids-from-form.util");
function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
/** Case-insensitive match for the same logical type/name pair (Mongo `$regex` anchors). */
function nameAndTypeCaseInsensitiveFilter(name, resourceStandardType) {
    return {
        resource_standard_type: {
            $regex: new RegExp("^".concat(escapeRegex(resourceStandardType), "$"), 'i'),
        },
        name: { $regex: new RegExp("^".concat(escapeRegex(name), "$"), 'i') },
    };
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
var StandardsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var StandardsService = _classThis = /** @class */ (function () {
        function StandardsService_1(standardModel, counterModel, standardCategoryModel, configService, redisService, categoriesService, sectorsService) {
            this.standardModel = standardModel;
            this.counterModel = counterModel;
            this.standardCategoryModel = standardCategoryModel;
            this.configService = configService;
            this.redisService = redisService;
            this.categoriesService = categoriesService;
            this.sectorsService = sectorsService;
            this.logger = new common_1.Logger(StandardsService.name);
        }
        StandardsService_1.prototype.getStandardListCacheTtlSeconds = function () {
            var ttl = parseInt(this.configService.get('STANDARD_LIST_CACHE_TTL_SECONDS') ||
                this.configService.get('CACHE_TTL_SECONDS') ||
                '60', 10);
            return Number.isFinite(ttl) && ttl > 0 ? ttl : 60;
        };
        StandardsService_1.prototype.buildStandardListCacheKey = function (query) {
            var _a, _b, _c, _d, _e, _f;
            var normalized = {
                page: (_a = query.page) !== null && _a !== void 0 ? _a : 1,
                limit: (_b = query.limit) !== null && _b !== void 0 ? _b : 10,
                search: String(query.search || '').trim().toLowerCase(),
                resource_standard_types: (0, parse_resource_standard_types_util_1.mergeResourceStandardTypeFilters)(query)
                    .map(function (t) { return t.toLowerCase(); })
                    .sort(),
                category_id: (_c = query.category_id) !== null && _c !== void 0 ? _c : null,
                sector: (_d = query.sector) !== null && _d !== void 0 ? _d : null,
                status: (_e = query.status) !== null && _e !== void 0 ? _e : null,
                sortBy: (_f = query.sortBy) !== null && _f !== void 0 ? _f : 'id',
                order: query.order === 'desc' ? 'desc' : 'asc',
            };
            return this.redisService.buildKey('standards', 'list', JSON.stringify(normalized));
        };
        StandardsService_1.prototype.invalidateStandardListCache = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.redisService
                                .deleteByPattern(this.redisService.buildKey('standards', 'list', '*'))
                                .catch(function (error) {
                                _this.logger.warn("Failed to invalidate standard list cache: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        StandardsService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.syncStandardIdCounter()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.backfillStandardCategoriesFromLegacy().catch(function (error) {
                                    _this.logger.warn("standard_categories backfill skipped: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        StandardsService_1.prototype.multerFileByteLength = function (file) {
            var _a;
            if ((_a = file === null || file === void 0 ? void 0 : file.buffer) === null || _a === void 0 ? void 0 : _a.length) {
                return file.buffer.length;
            }
            return 0;
        };
        /**
         * Persist standard PDF/image only via shared `uploadFile()` (`upload-file.util.ts`).
         */
        StandardsService_1.prototype.uploadStandardDocument = function (file) {
            return __awaiter(this, void 0, void 0, function () {
                var e_1, msg;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.multerFileByteLength(file) <= 0) {
                                throw new common_1.BadRequestException('Standard document is empty or unreadable. Re-select the PDF/image and try again.');
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(file, 'standards')];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            e_1 = _a.sent();
                            msg = e_1 instanceof Error ? e_1.message : String(e_1);
                            if (msg.includes('requires file buffer')) {
                                throw new common_1.BadRequestException('Standard document could not be read. Use multipart field **file** (PDF, JPG, JPEG, PNG, DOC, or DOCX, max 10MB).');
                            }
                            throw e_1;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        StandardsService_1.prototype.standardFileFieldsFromUpload = function (file, upload) {
            return {
                filename: upload.relativePath,
                file_url: upload.fileUrl,
                storage_type: upload.storage,
                s3_key: upload.s3Key,
                original_filename: file.originalname || upload.fileName,
            };
        };
        StandardsService_1.prototype.getMaxStandardIdFromCollection = function () {
            return __awaiter(this, void 0, void 0, function () {
                var agg, max;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.standardModel
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
        StandardsService_1.prototype.syncStandardIdCounter = function () {
            return __awaiter(this, void 0, void 0, function () {
                var maxFromDocs, existing, currentSeq, seed;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.getMaxStandardIdFromCollection()];
                        case 1:
                            maxFromDocs = _b.sent();
                            return [4 /*yield*/, this.counterModel
                                    .findOne({ _id: standard_id_counter_schema_1.STANDARD_ID_COUNTER_KEY })
                                    .lean()
                                    .exec()];
                        case 2:
                            existing = _b.sent();
                            currentSeq = (_a = existing === null || existing === void 0 ? void 0 : existing.seq) !== null && _a !== void 0 ? _a : 0;
                            seed = Math.max(currentSeq, maxFromDocs);
                            return [4 /*yield*/, this.counterModel
                                    .updateOne({ _id: standard_id_counter_schema_1.STANDARD_ID_COUNTER_KEY }, { $set: { seq: seed } }, { upsert: true })
                                    .exec()];
                        case 3:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        StandardsService_1.prototype.nextStandardId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var doc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.counterModel
                                .findOneAndUpdate({ _id: standard_id_counter_schema_1.STANDARD_ID_COUNTER_KEY }, { $inc: { seq: 1 } }, { new: true, upsert: true })
                                .exec()];
                        case 1:
                            doc = _a.sent();
                            if (!doc || typeof doc.seq !== 'number' || !Number.isFinite(doc.seq)) {
                                throw new Error('Failed to allocate standard id');
                            }
                            return [2 /*return*/, doc.seq];
                    }
                });
            });
        };
        StandardsService_1.prototype.parseStandardId = function (param) {
            var n = parseInt(param, 10);
            if (!Number.isFinite(n) || n < 1) {
                throw new common_1.BadRequestException('Invalid standard id');
            }
            return n;
        };
        StandardsService_1.prototype.formFlagIsTrue = function (value) {
            if (value === undefined || value === null)
                return false;
            var s = String(value).trim().toLowerCase();
            return s === '1' || s === 'true' || s === 'yes' || s === 'on';
        };
        /** Resolves path `categoryId` to numeric `category_id` stored on standards (see CategoriesService). */
        StandardsService_1.prototype.resolveCategoryIdForByCategoryRoute = function (param) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.categoriesService.resolveNumericCategoryKey(param)];
                });
            });
        };
        /** Path `sectorId` must be a positive integer sector `id` (GET /api/sectors). */
        StandardsService_1.prototype.parseStandardSectorPathParam = function (param) {
            var n = parseInt(String(param !== null && param !== void 0 ? param : '').trim(), 10);
            if (!Number.isFinite(n) || !Number.isInteger(n) || n < 1) {
                throw new common_1.BadRequestException('Invalid sector id');
            }
            return n;
        };
        StandardsService_1.prototype.categoryIdsForSectorsOrThrow = function (sectorIds) {
            return __awaiter(this, void 0, void 0, function () {
                var uniqueSectorOrder, seenSectors, _i, sectorIds_1, sid, categoryOut, seenCategories, _a, uniqueSectorOrder_1, sectorId, ids, _b, ids_1, cid;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            uniqueSectorOrder = [];
                            seenSectors = new Set();
                            for (_i = 0, sectorIds_1 = sectorIds; _i < sectorIds_1.length; _i++) {
                                sid = sectorIds_1[_i];
                                if (!Number.isInteger(sid) || sid < 1)
                                    continue;
                                if (seenSectors.has(sid))
                                    continue;
                                seenSectors.add(sid);
                                uniqueSectorOrder.push(sid);
                            }
                            if (!uniqueSectorOrder.length) {
                                throw new common_1.BadRequestException('At least one valid sector id is required (GET /api/sectors).');
                            }
                            categoryOut = [];
                            seenCategories = new Set();
                            _a = 0, uniqueSectorOrder_1 = uniqueSectorOrder;
                            _c.label = 1;
                        case 1:
                            if (!(_a < uniqueSectorOrder_1.length)) return [3 /*break*/, 5];
                            sectorId = uniqueSectorOrder_1[_a];
                            return [4 /*yield*/, this.sectorsService.assertSectorExists(sectorId)];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, this.categoriesService.listNumericCategoryIdsBySector(sectorId)];
                        case 3:
                            ids = _c.sent();
                            if (!ids.length) {
                                throw new common_1.BadRequestException("No categories exist for sector ".concat(sectorId, "; create categories under that sector first."));
                            }
                            for (_b = 0, ids_1 = ids; _b < ids_1.length; _b++) {
                                cid = ids_1[_b];
                                if (seenCategories.has(cid))
                                    continue;
                                seenCategories.add(cid);
                                categoryOut.push(cid);
                            }
                            _c.label = 4;
                        case 4:
                            _a++;
                            return [3 /*break*/, 1];
                        case 5: return [2 /*return*/, categoryOut];
                    }
                });
            });
        };
        StandardsService_1.prototype.mergedSectorIdsFromCreateOrUpdate = function (dto, raw) {
            return (0, merge_sector_ids_from_form_util_1.mergeSectorIdsFromFormObject)(__assign(__assign({}, dto), (raw !== null && raw !== void 0 ? raw : {})));
        };
        StandardsService_1.prototype.explicitSectorAssignmentInUpdate = function (dto, raw) {
            if ((0, merge_sector_ids_from_form_util_1.hasExplicitSectorAssignmentFields)(raw)) {
                return true;
            }
            var d = dto;
            if (d.sectors !== undefined && d.sectors !== null) {
                return true;
            }
            if (d.sector !== undefined && d.sector !== null && d.sector !== '') {
                return true;
            }
            if (d.sector_id !== undefined && d.sector_id !== null && d.sector_id !== '') {
                return true;
            }
            return false;
        };
        StandardsService_1.prototype.buildListFilter = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var parts, standardTypes, cid, linked, linkedIds, catIds, linked, linkedIds;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            parts = [];
                            if (query.search !== undefined && query.search.trim() !== '') {
                                parts.push({
                                    name: { $regex: new RegExp(escapeRegex(query.search.trim()), 'i') },
                                });
                            }
                            standardTypes = (0, parse_resource_standard_types_util_1.mergeResourceStandardTypeFilters)(query);
                            if (standardTypes.length === 1) {
                                parts.push({
                                    resource_standard_type: {
                                        $regex: new RegExp("^".concat(escapeRegex(standardTypes[0]), "$"), 'i'),
                                    },
                                });
                            }
                            else if (standardTypes.length > 1) {
                                parts.push({
                                    $or: standardTypes.map(function (t) { return ({
                                        resource_standard_type: {
                                            $regex: new RegExp("^".concat(escapeRegex(t), "$"), 'i'),
                                        },
                                    }); }),
                                });
                            }
                            if (query.status !== undefined) {
                                parts.push({ status: query.status });
                            }
                            if (!(query.category_id !== undefined &&
                                Number.isInteger(query.category_id) &&
                                query.category_id >= 1)) return [3 /*break*/, 2];
                            cid = query.category_id;
                            return [4 /*yield*/, this.standardCategoryModel
                                    .distinct('standard_id', { category_id: cid })
                                    .exec()];
                        case 1:
                            linked = _a.sent();
                            linkedIds = (linked !== null && linked !== void 0 ? linked : []).filter(function (x) { return typeof x === 'number' && Number.isInteger(x); });
                            parts.push({
                                $or: [{ category_id: cid }, { id: { $in: linkedIds } }],
                            });
                            _a.label = 2;
                        case 2:
                            if (!(query.sector !== undefined &&
                                Number.isInteger(query.sector) &&
                                query.sector >= 1)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.categoriesService.listNumericCategoryIdsBySector(query.sector)];
                        case 3:
                            catIds = _a.sent();
                            if (!!catIds.length) return [3 /*break*/, 4];
                            parts.push({ id: { $in: [] } });
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, this.standardCategoryModel
                                .distinct('standard_id', { category_id: { $in: catIds } })
                                .exec()];
                        case 5:
                            linked = _a.sent();
                            linkedIds = (linked !== null && linked !== void 0 ? linked : []).filter(function (x) { return typeof x === 'number' && Number.isInteger(x); });
                            parts.push({
                                $or: [
                                    { category_id: { $in: catIds } },
                                    { id: { $in: linkedIds } },
                                ],
                            });
                            _a.label = 6;
                        case 6:
                            if (parts.length === 0) {
                                return [2 /*return*/, {}];
                            }
                            if (parts.length === 1) {
                                return [2 /*return*/, parts[0]];
                            }
                            return [2 /*return*/, { $and: parts }];
                    }
                });
            });
        };
        StandardsService_1.prototype.replaceStandardCategories = function (standardId, categoryIds) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.standardCategoryModel
                                .deleteMany({ standard_id: standardId })
                                .exec()];
                        case 1:
                            _a.sent();
                            if (!categoryIds.length) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.standardCategoryModel.insertMany(categoryIds.map(function (category_id) { return ({
                                    standard_id: standardId,
                                    category_id: category_id,
                                }); }), { ordered: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        StandardsService_1.prototype.loadCategoryIdsMapByStandardIds = function (standardIds) {
            return __awaiter(this, void 0, void 0, function () {
                var map, _i, standardIds_1, id, rows, _a, rows_1, r, sid, cur;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            map = new Map();
                            for (_i = 0, standardIds_1 = standardIds; _i < standardIds_1.length; _i++) {
                                id = standardIds_1[_i];
                                map.set(id, []);
                            }
                            if (!standardIds.length) {
                                return [2 /*return*/, map];
                            }
                            return [4 /*yield*/, this.standardCategoryModel
                                    .find({ standard_id: { $in: standardIds } })
                                    .sort({ _id: 1 })
                                    .select('standard_id category_id')
                                    .lean()
                                    .exec()];
                        case 1:
                            rows = _c.sent();
                            for (_a = 0, rows_1 = rows; _a < rows_1.length; _a++) {
                                r = rows_1[_a];
                                sid = r.standard_id;
                                cur = (_b = map.get(sid)) !== null && _b !== void 0 ? _b : [];
                                cur.push(r.category_id);
                                map.set(sid, cur);
                            }
                            return [2 /*return*/, map];
                    }
                });
            });
        };
        StandardsService_1.prototype.effectiveCategoryIdsForDoc = function (doc, map) {
            var _a;
            var sid = doc.id;
            if (typeof sid !== 'number' || !Number.isInteger(sid)) {
                return [];
            }
            var fromJoin = (_a = map.get(sid)) !== null && _a !== void 0 ? _a : [];
            if (fromJoin.length) {
                return fromJoin;
            }
            if (typeof doc.category_id === 'number' &&
                Number.isInteger(doc.category_id) &&
                doc.category_id >= 1) {
                return [doc.category_id];
            }
            return [];
        };
        StandardsService_1.prototype.attachCategoriesToStandardDocs = function (docs) {
            return __awaiter(this, void 0, void 0, function () {
                var ids, map, allCatIds, _i, docs_1, d, _a, _b, c, nameMap, catToSector, allSectorIds, _c, allCatIds_1, cid, s, sectorNameMap;
                var _this = this;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            ids = docs
                                .map(function (d) { return (typeof d.id === 'number' && Number.isInteger(d.id) ? d.id : null); })
                                .filter(function (x) { return x !== null; });
                            return [4 /*yield*/, this.loadCategoryIdsMapByStandardIds(ids)];
                        case 1:
                            map = _d.sent();
                            allCatIds = new Set();
                            for (_i = 0, docs_1 = docs; _i < docs_1.length; _i++) {
                                d = docs_1[_i];
                                for (_a = 0, _b = this.effectiveCategoryIdsForDoc(d, map); _a < _b.length; _a++) {
                                    c = _b[_a];
                                    allCatIds.add(c);
                                }
                            }
                            return [4 /*yield*/, this.categoriesService.getCategoryNamesByNumericIds(__spreadArray([], allCatIds, true))];
                        case 2:
                            nameMap = _d.sent();
                            return [4 /*yield*/, this.categoriesService.getCategorySectorsByNumericIds(__spreadArray([], allCatIds, true))];
                        case 3:
                            catToSector = _d.sent();
                            allSectorIds = new Set();
                            for (_c = 0, allCatIds_1 = allCatIds; _c < allCatIds_1.length; _c++) {
                                cid = allCatIds_1[_c];
                                s = catToSector.get(cid);
                                if (typeof s === 'number' && Number.isInteger(s) && s >= 1) {
                                    allSectorIds.add(s);
                                }
                            }
                            return [4 /*yield*/, this.sectorsService.getSectorNamesByNumericIds(__spreadArray([], allSectorIds, true))];
                        case 4:
                            sectorNameMap = _d.sent();
                            return [2 /*return*/, docs.map(function (d) {
                                    var _a, _b, _c;
                                    var category_ids = _this.effectiveCategoryIdsForDoc(d, map);
                                    var categories = category_ids.map(function (id) {
                                        var _a;
                                        return ({
                                            id: id,
                                            name: (_a = nameMap.get(id)) !== null && _a !== void 0 ? _a : '',
                                        });
                                    });
                                    var primary = (_a = category_ids[0]) !== null && _a !== void 0 ? _a : null;
                                    var docSectorIds = new Set();
                                    for (var _i = 0, category_ids_1 = category_ids; _i < category_ids_1.length; _i++) {
                                        var cid = category_ids_1[_i];
                                        var s = catToSector.get(cid);
                                        if (typeof s === 'number' && Number.isInteger(s) && s >= 1) {
                                            docSectorIds.add(s);
                                        }
                                    }
                                    var sector_ids = __spreadArray([], docSectorIds, true).sort(function (a, b) { return a - b; });
                                    var sector_id = null;
                                    var sector_name = null;
                                    if (primary !== null) {
                                        var sid = catToSector.get(primary);
                                        if (typeof sid === 'number' && Number.isInteger(sid) && sid >= 1) {
                                            sector_id = sid;
                                            sector_name = (_b = sectorNameMap.get(sid)) !== null && _b !== void 0 ? _b : null;
                                        }
                                    }
                                    return __assign(__assign({}, d), { category_ids: category_ids, categories: categories, category_id: primary, category_name: primary !== null ? (_c = nameMap.get(primary)) !== null && _c !== void 0 ? _c : null : null, sector_id: sector_id, sector_ids: sector_ids, sector_name: sector_name });
                                })];
                    }
                });
            });
        };
        StandardsService_1.prototype.backfillStandardCategoriesFromLegacy = function () {
            return __awaiter(this, void 0, void 0, function () {
                var cursor, upserts, _a, cursor_1, cursor_1_1, row, sid, cid, res, e_2_1;
                var _b, e_2, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            cursor = this.standardModel
                                .find({ category_id: { $exists: true, $ne: null } })
                                .select('id category_id')
                                .lean()
                                .cursor();
                            upserts = 0;
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 7, 8, 13]);
                            _a = true, cursor_1 = __asyncValues(cursor);
                            _e.label = 2;
                        case 2: return [4 /*yield*/, cursor_1.next()];
                        case 3:
                            if (!(cursor_1_1 = _e.sent(), _b = cursor_1_1.done, !_b)) return [3 /*break*/, 6];
                            _d = cursor_1_1.value;
                            _a = false;
                            row = _d;
                            sid = row.id;
                            cid = row.category_id;
                            if (!Number.isInteger(sid) ||
                                sid < 1 ||
                                !Number.isInteger(cid) ||
                                cid < 1) {
                                return [3 /*break*/, 5];
                            }
                            return [4 /*yield*/, this.standardCategoryModel.updateOne({ standard_id: sid, category_id: cid }, { $setOnInsert: { standard_id: sid, category_id: cid } }, { upsert: true })];
                        case 4:
                            res = _e.sent();
                            if (res.upsertedCount) {
                                upserts += 1;
                            }
                            _e.label = 5;
                        case 5:
                            _a = true;
                            return [3 /*break*/, 2];
                        case 6: return [3 /*break*/, 13];
                        case 7:
                            e_2_1 = _e.sent();
                            e_2 = { error: e_2_1 };
                            return [3 /*break*/, 13];
                        case 8:
                            _e.trys.push([8, , 11, 12]);
                            if (!(!_a && !_b && (_c = cursor_1.return))) return [3 /*break*/, 10];
                            return [4 /*yield*/, _c.call(cursor_1)];
                        case 9:
                            _e.sent();
                            _e.label = 10;
                        case 10: return [3 /*break*/, 12];
                        case 11:
                            if (e_2) throw e_2.error;
                            return [7 /*endfinally*/];
                        case 12: return [7 /*endfinally*/];
                        case 13:
                            if (upserts > 0) {
                                this.logger.log("Backfilled ".concat(upserts, " standard_categories row(s) from legacy category_id"));
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        StandardsService_1.prototype.ensureDescriptionField = function (doc) {
            return __assign(__assign({}, doc), { description: typeof doc.description === 'string' ? doc.description : '' });
        };
        StandardsService_1.prototype.findAllPaginated = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, error_1, page, limit, sortBy, order, sortOrder, sort, filter, skip, _a, rows, total, withMeta, data, response;
                var _b;
                var _this = this;
                var _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            cacheKey = this.buildStandardListCacheKey(query);
                            _g.label = 1;
                        case 1:
                            _g.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _g.sent();
                            if (cached && Array.isArray(cached.data)) {
                                return [2 /*return*/, __assign(__assign({}, cached), { data: cached.data.map(function (row) {
                                            var doc = row;
                                            return _this.ensureDescriptionField(_this.enrichStandardFileUrl(doc));
                                        }) })];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _g.sent();
                            this.logger.warn("Standard list cache read failed: ".concat((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4:
                            page = (_c = query.page) !== null && _c !== void 0 ? _c : 1;
                            limit = (_d = query.limit) !== null && _d !== void 0 ? _d : 10;
                            sortBy = (_e = query.sortBy) !== null && _e !== void 0 ? _e : 'id';
                            order = (_f = query.order) !== null && _f !== void 0 ? _f : 'asc';
                            sortOrder = order === 'desc' ? -1 : 1;
                            sort = (_b = {}, _b[sortBy] = sortOrder, _b);
                            return [4 /*yield*/, this.buildListFilter(query)];
                        case 5:
                            filter = _g.sent();
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, Promise.all([
                                    this.standardModel
                                        .find(filter)
                                        .sort(sort)
                                        .skip(skip)
                                        .limit(limit)
                                        .lean()
                                        .exec(),
                                    this.standardModel.countDocuments(filter).exec(),
                                ])];
                        case 6:
                            _a = _g.sent(), rows = _a[0], total = _a[1];
                            withMeta = rows.map(function (d) {
                                return _this.ensureDescriptionField(_this.enrichStandardFileUrl(d));
                            });
                            return [4 /*yield*/, this.attachCategoriesToStandardDocs(withMeta)];
                        case 7:
                            data = _g.sent();
                            response = {
                                message: 'Standards retrieved successfully',
                                data: data,
                                total: total,
                                page: page,
                                limit: limit,
                            };
                            this.redisService
                                .set(cacheKey, response, this.getStandardListCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("Standard list cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, response];
                    }
                });
            });
        };
        /** List standards scoped to a sector (path); validates sector id exists. */
        StandardsService_1.prototype.findAllPaginatedForSectorPath = function (sectorIdParam, query) {
            return __awaiter(this, void 0, void 0, function () {
                var sid;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sid = this.parseStandardSectorPathParam(sectorIdParam);
                            return [4 /*yield*/, this.sectorsService.assertSectorExists(sid)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.findAllPaginated(__assign(__assign({}, query), { sector: sid }))];
                    }
                });
            });
        };
        StandardsService_1.prototype.findOneById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var doc, withMeta, enriched;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.standardModel.findOne({ id: id }).lean().exec()];
                        case 1:
                            doc = _a.sent();
                            if (!doc) {
                                throw new common_1.NotFoundException('Standard not found');
                            }
                            withMeta = this.ensureDescriptionField(this.enrichStandardFileUrl(doc));
                            return [4 /*yield*/, this.attachCategoriesToStandardDocs([withMeta])];
                        case 2:
                            enriched = (_a.sent())[0];
                            return [2 /*return*/, enriched];
                    }
                });
            });
        };
        /**
         * Ensures API always exposes a working public URL (`/uploads/standards/...` or S3 https).
         * Legacy rows may have `file_url: /standards/foo.pdf` — normalized here.
         */
        StandardsService_1.prototype.enrichStandardFileUrl = function (doc) {
            var file_url = (0, standard_public_file_url_util_1.resolveStandardPublicFileUrl)(doc);
            if (!file_url) {
                return doc;
            }
            return __assign(__assign({}, doc), { file_url: file_url, file: file_url, pdf: file_url });
        };
        /** Stream local file or redirect to S3/CloudFront for GET /api/standards/:id/file */
        StandardsService_1.prototype.streamStandardFile = function (id, res) {
            return __awaiter(this, void 0, void 0, function () {
                var doc, publicUrl, storage, rel, absolute, ext, contentType;
                var _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0: return [4 /*yield*/, this.standardModel.findOne({ id: id }).lean().exec()];
                        case 1:
                            doc = _f.sent();
                            if (!doc) {
                                throw new common_1.NotFoundException('Standard not found');
                            }
                            publicUrl = (0, standard_public_file_url_util_1.resolveStandardPublicFileUrl)(doc);
                            storage = String((_a = doc.storage_type) !== null && _a !== void 0 ? _a : '').toLowerCase();
                            if (publicUrl &&
                                (/^https?:\/\//i.test(publicUrl) || storage === 's3')) {
                                res.redirect(302, publicUrl);
                                return [2 /*return*/];
                            }
                            rel = (0, standard_public_file_url_util_1.normalizeStandardRelativePath)(String((_c = (_b = doc.filename) !== null && _b !== void 0 ? _b : doc.file_url) !== null && _c !== void 0 ? _c : ''));
                            if (!rel) {
                                throw new common_1.NotFoundException('File not available for this standard');
                            }
                            absolute = (0, path_1.join)(process.cwd(), 'uploads', rel);
                            if (!(0, fs_1.existsSync)(absolute)) {
                                throw new common_1.NotFoundException('File not found on server');
                            }
                            ext = (_e = (_d = rel.split('.').pop()) === null || _d === void 0 ? void 0 : _d.toLowerCase()) !== null && _e !== void 0 ? _e : '';
                            contentType = ext === 'pdf'
                                ? 'application/pdf'
                                : ext === 'png'
                                    ? 'image/png'
                                    : ext === 'jpg' || ext === 'jpeg'
                                        ? 'image/jpeg'
                                        : 'application/octet-stream';
                            res.setHeader('Content-Type', contentType);
                            res.setHeader('Content-Disposition', 'inline');
                            res.sendFile(absolute);
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Standard names must be unique per **resource_standard_type** (case-insensitive for both).
         */
        StandardsService_1.prototype.assertUniqueStandardNameWithinType = function (name, resourceStandardType, excludeStandardId) {
            return __awaiter(this, void 0, void 0, function () {
                var nameTrim, typeTrim, filter, dup;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            nameTrim = String(name !== null && name !== void 0 ? name : '').trim();
                            typeTrim = String(resourceStandardType !== null && resourceStandardType !== void 0 ? resourceStandardType : '').trim();
                            if (!nameTrim || !typeTrim) {
                                return [2 /*return*/];
                            }
                            filter = __assign({}, nameAndTypeCaseInsensitiveFilter(nameTrim, typeTrim));
                            if (excludeStandardId !== undefined) {
                                filter.id = { $ne: excludeStandardId };
                            }
                            return [4 /*yield*/, this.standardModel
                                    .findOne(filter)
                                    .select('id')
                                    .lean()
                                    .exec()];
                        case 1:
                            dup = _a.sent();
                            if (dup) {
                                throw new common_1.ConflictException('Name already exists');
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        StandardsService_1.prototype.fileMetaForDelete = function (doc) {
            var _a, _b;
            var storage_type = ((_a = doc.storage_type) !== null && _a !== void 0 ? _a : 'local');
            var relativePath = String((_b = doc.filename) !== null && _b !== void 0 ? _b : '').replace(/^\/+/, '');
            if (!relativePath && storage_type !== 's3') {
                return null;
            }
            return {
                storage_type: storage_type,
                s3_key: doc.s3_key,
                relativePath: relativePath,
            };
        };
        StandardsService_1.prototype.create = function (dto, file, rawBody) {
            return __awaiter(this, void 0, void 0, function () {
                var mergedSectors, merged, primary, upload, now, numericId, doc, created, enriched;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!file) {
                                throw new common_1.BadRequestException('File is required (field name: file). Allowed: PDF, JPG, PNG. Max 10MB.');
                            }
                            if ((0, merge_category_ids_util_1.hasExplicitCategoryIdFields)(rawBody)) {
                                throw new common_1.BadRequestException('Category fields are no longer accepted. Send **sector** only (numeric id from GET /api/sectors).');
                            }
                            mergedSectors = this.mergedSectorIdsFromCreateOrUpdate(dto, rawBody);
                            if (!mergedSectors.length) {
                                throw new common_1.BadRequestException('Select at least one **sector** (multiselect): send **sectors** as a JSON array (e.g. [1,2]), repeated **sectors** / **sectors[]**, or **sector_ids** — numeric ids from GET /api/sectors. Legacy single **sector** is also accepted.');
                            }
                            return [4 /*yield*/, this.categoryIdsForSectorsOrThrow(mergedSectors)];
                        case 1:
                            merged = _c.sent();
                            return [4 /*yield*/, this.categoriesService.assertNumericCategoriesExist(merged)];
                        case 2:
                            _c.sent();
                            primary = merged[0];
                            return [4 /*yield*/, this.assertUniqueStandardNameWithinType(dto.name, dto.resource_standard_type)];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, this.uploadStandardDocument(file)];
                        case 4:
                            upload = _c.sent();
                            now = new Date();
                            return [4 /*yield*/, this.nextStandardId()];
                        case 5:
                            numericId = _c.sent();
                            return [4 /*yield*/, this.standardModel.create(__assign(__assign({ id: numericId, category_id: primary, name: dto.name.trim(), description: (_b = (_a = dto.description) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '', resource_standard_type: dto.resource_standard_type.trim(), status: 1 }, this.standardFileFieldsFromUpload(file, upload)), { created_at: now, updated_at: now }))];
                        case 6:
                            doc = _c.sent();
                            return [4 /*yield*/, this.replaceStandardCategories(numericId, merged)];
                        case 7:
                            _c.sent();
                            created = this.ensureDescriptionField(this.enrichStandardFileUrl(doc.toObject()));
                            return [4 /*yield*/, this.invalidateStandardListCache()];
                        case 8:
                            _c.sent();
                            return [4 /*yield*/, this.attachCategoriesToStandardDocs([created])];
                        case 9:
                            enriched = (_c.sent())[0];
                            return [2 /*return*/, enriched];
                    }
                });
            });
        };
        StandardsService_1.prototype.update = function (id, dto, file, rawBody) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, explicitSector, mergedSectors, hasText, wantsRemoveFile, set, mergedForCategories, effectiveName, effectiveType, deleteMeta, upload, updated, response, enriched;
                var _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0: return [4 /*yield*/, this.standardModel.findOne({ id: id }).exec()];
                        case 1:
                            existing = _f.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException('Standard not found');
                            }
                            if ((0, merge_category_ids_util_1.hasExplicitCategoryIdFields)(rawBody)) {
                                throw new common_1.BadRequestException('Category fields are no longer accepted. Send **sector** only (numeric id from GET /api/sectors).');
                            }
                            explicitSector = this.explicitSectorAssignmentInUpdate(dto, rawBody);
                            mergedSectors = this.mergedSectorIdsFromCreateOrUpdate(dto, rawBody);
                            hasText = (dto.name !== undefined && dto.name.trim() !== '') ||
                                dto.description !== undefined ||
                                (dto.resource_standard_type !== undefined &&
                                    dto.resource_standard_type.trim() !== '') ||
                                explicitSector;
                            wantsRemoveFile = this.formFlagIsTrue((_c = (_b = (_a = rawBody === null || rawBody === void 0 ? void 0 : rawBody.remove_file) !== null && _a !== void 0 ? _a : rawBody === null || rawBody === void 0 ? void 0 : rawBody.delete_file) !== null && _b !== void 0 ? _b : dto.remove_file) !== null && _c !== void 0 ? _c : dto.delete_file);
                            if (!hasText && !file && !wantsRemoveFile) {
                                throw new common_1.BadRequestException('No fields to update');
                            }
                            if (wantsRemoveFile && !file) {
                                throw new common_1.BadRequestException('Upload a new document (field **file**) to replace the current file, or keep the existing file.');
                            }
                            set = { updated_at: new Date() };
                            if (dto.name !== undefined && dto.name.trim() !== '') {
                                set.name = dto.name.trim();
                            }
                            if (dto.description !== undefined) {
                                set.description = dto.description.trim();
                            }
                            if (dto.resource_standard_type !== undefined &&
                                dto.resource_standard_type.trim() !== '') {
                                set.resource_standard_type = dto.resource_standard_type.trim();
                            }
                            mergedForCategories = null;
                            if (!explicitSector) return [3 /*break*/, 4];
                            if (!mergedSectors.length) {
                                throw new common_1.BadRequestException('When updating sector assignment, send at least one sector id (**sectors** multiselect or legacy **sector**).');
                            }
                            return [4 /*yield*/, this.categoryIdsForSectorsOrThrow(mergedSectors)];
                        case 2:
                            mergedForCategories =
                                _f.sent();
                            return [4 /*yield*/, this.categoriesService.assertNumericCategoriesExist(mergedForCategories)];
                        case 3:
                            _f.sent();
                            set.category_id = mergedForCategories[0];
                            _f.label = 4;
                        case 4:
                            effectiveName = String(set.name !== undefined ? set.name : (_d = existing.name) !== null && _d !== void 0 ? _d : '').trim();
                            effectiveType = String(set.resource_standard_type !== undefined
                                ? set.resource_standard_type
                                : (_e = existing.resource_standard_type) !== null && _e !== void 0 ? _e : '').trim();
                            return [4 /*yield*/, this.assertUniqueStandardNameWithinType(effectiveName, effectiveType, id)];
                        case 5:
                            _f.sent();
                            if (!file) return [3 /*break*/, 9];
                            deleteMeta = this.fileMetaForDelete(existing);
                            if (!deleteMeta) return [3 /*break*/, 7];
                            return [4 /*yield*/, (0, upload_file_util_1.deleteUploadedFile)(deleteMeta)];
                        case 6:
                            _f.sent();
                            _f.label = 7;
                        case 7: return [4 /*yield*/, this.uploadStandardDocument(file)];
                        case 8:
                            upload = _f.sent();
                            Object.assign(set, this.standardFileFieldsFromUpload(file, upload));
                            if (!upload.s3Key) {
                                set.s3_key = null;
                            }
                            _f.label = 9;
                        case 9: return [4 /*yield*/, this.standardModel
                                .findOneAndUpdate({ id: id }, { $set: set }, { new: true })
                                .lean()
                                .exec()];
                        case 10:
                            updated = _f.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Standard not found');
                            }
                            if (!mergedForCategories) return [3 /*break*/, 12];
                            return [4 /*yield*/, this.replaceStandardCategories(id, mergedForCategories)];
                        case 11:
                            _f.sent();
                            _f.label = 12;
                        case 12:
                            response = this.ensureDescriptionField(this.enrichStandardFileUrl(updated));
                            return [4 /*yield*/, this.invalidateStandardListCache()];
                        case 13:
                            _f.sent();
                            return [4 /*yield*/, this.attachCategoriesToStandardDocs([response])];
                        case 14:
                            enriched = (_f.sent())[0];
                            return [2 /*return*/, enriched];
                    }
                });
            });
        };
        StandardsService_1.prototype.updateStatus = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var updated, response, enriched;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.standardModel
                                .findOneAndUpdate({ id: id }, { $set: { status: dto.status, updated_at: new Date() } }, { new: true })
                                .lean()
                                .exec()];
                        case 1:
                            updated = _a.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Standard not found');
                            }
                            response = this.ensureDescriptionField(this.enrichStandardFileUrl(updated));
                            return [4 /*yield*/, this.invalidateStandardListCache()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.attachCategoriesToStandardDocs([response])];
                        case 3:
                            enriched = (_a.sent())[0];
                            return [2 /*return*/, enriched];
                    }
                });
            });
        };
        StandardsService_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, deleteMeta;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.standardModel.findOne({ id: id }).exec()];
                        case 1:
                            existing = _a.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException('Standard not found');
                            }
                            deleteMeta = this.fileMetaForDelete(existing);
                            if (!deleteMeta) return [3 /*break*/, 3];
                            return [4 /*yield*/, (0, upload_file_util_1.deleteUploadedFile)(deleteMeta)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.standardCategoryModel.deleteMany({ standard_id: id }).exec()];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, this.standardModel.deleteOne({ id: id }).exec()];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, this.invalidateStandardListCache()];
                        case 6:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        StandardsService_1.prototype.buildCsvExport = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var sortBy, order, sort, filter, rows, stdIds, joinMap, allIds, _i, rows_2, r, _a, _b, c, nameMap, catToSector, allSectorIds, _c, allIds_1, cid, s, sectorNameMap, header, lines;
                var _d;
                var _this = this;
                var _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            sortBy = (_e = query.sortBy) !== null && _e !== void 0 ? _e : 'id';
                            order = (_f = query.order) !== null && _f !== void 0 ? _f : 'asc';
                            sort = (_d = {},
                                _d[sortBy] = order === 'desc' ? -1 : 1,
                                _d);
                            return [4 /*yield*/, this.buildListFilter(query)];
                        case 1:
                            filter = _g.sent();
                            return [4 /*yield*/, this.standardModel.find(filter).sort(sort).lean().exec()];
                        case 2:
                            rows = _g.sent();
                            stdIds = rows
                                .map(function (r) { return r.id; })
                                .filter(function (x) { return typeof x === 'number' && Number.isInteger(x); });
                            return [4 /*yield*/, this.loadCategoryIdsMapByStandardIds(stdIds)];
                        case 3:
                            joinMap = _g.sent();
                            allIds = new Set();
                            for (_i = 0, rows_2 = rows; _i < rows_2.length; _i++) {
                                r = rows_2[_i];
                                for (_a = 0, _b = this.effectiveCategoryIdsForDoc(r, joinMap); _a < _b.length; _a++) {
                                    c = _b[_a];
                                    allIds.add(c);
                                }
                            }
                            return [4 /*yield*/, this.categoriesService.getCategoryNamesByNumericIds(__spreadArray([], allIds, true))];
                        case 4:
                            nameMap = _g.sent();
                            return [4 /*yield*/, this.categoriesService.getCategorySectorsByNumericIds(__spreadArray([], allIds, true))];
                        case 5:
                            catToSector = _g.sent();
                            allSectorIds = new Set();
                            for (_c = 0, allIds_1 = allIds; _c < allIds_1.length; _c++) {
                                cid = allIds_1[_c];
                                s = catToSector.get(cid);
                                if (typeof s === 'number' && Number.isInteger(s) && s >= 1) {
                                    allSectorIds.add(s);
                                }
                            }
                            return [4 /*yield*/, this.sectorsService.getSectorNamesByNumericIds(__spreadArray([], allSectorIds, true))];
                        case 6:
                            sectorNameMap = _g.sent();
                            header = [
                                'id',
                                'category_ids',
                                'category_names',
                                'category_id',
                                'category_name',
                                'sector_id',
                                'sector_name',
                                'name',
                                'description',
                                'filename',
                                'file_url',
                                'storage_type',
                                'original_filename',
                                'resource_standard_type',
                                'status',
                                'created_at',
                                'updated_at',
                            ];
                            lines = __spreadArray([
                                header.join(',')
                            ], rows.map(function (r) {
                                var _a, _b, _c, _d, _e, _f;
                                var e = _this.enrichStandardFileUrl(r);
                                var cids = _this.effectiveCategoryIdsForDoc(e, joinMap);
                                var cnames = cids.map(function (id) { var _a; return (_a = nameMap.get(id)) !== null && _a !== void 0 ? _a : ''; }).join('; ');
                                var primary = (_a = cids[0]) !== null && _a !== void 0 ? _a : null;
                                var primaryName = primary !== null ? (_b = nameMap.get(primary)) !== null && _b !== void 0 ? _b : '' : '';
                                var sectorIdVal = '';
                                var sectorNameVal = '';
                                if (primary !== null) {
                                    var sid = catToSector.get(primary);
                                    if (typeof sid === 'number' && Number.isInteger(sid) && sid >= 1) {
                                        sectorIdVal = sid;
                                        sectorNameVal = (_c = sectorNameMap.get(sid)) !== null && _c !== void 0 ? _c : '';
                                    }
                                }
                                return [
                                    e.id,
                                    cids.join(';'),
                                    cnames,
                                    primary !== null && primary !== void 0 ? primary : '',
                                    primaryName,
                                    sectorIdVal,
                                    sectorNameVal,
                                    e.name,
                                    (_d = e.description) !== null && _d !== void 0 ? _d : '',
                                    e.filename,
                                    (_e = e.file_url) !== null && _e !== void 0 ? _e : '',
                                    (_f = e.storage_type) !== null && _f !== void 0 ? _f : 'local',
                                    e.original_filename,
                                    e.resource_standard_type,
                                    e.status,
                                    e.created_at,
                                    e.updated_at,
                                ]
                                    .map(csvEscape)
                                    .join(',');
                            }), true);
                            return [2 /*return*/, lines.join('\r\n')];
                    }
                });
            });
        };
        return StandardsService_1;
    }());
    __setFunctionName(_classThis, "StandardsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StandardsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StandardsService = _classThis;
}();
exports.StandardsService = StandardsService;
