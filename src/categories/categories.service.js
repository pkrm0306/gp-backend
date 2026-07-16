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
exports.CategoriesService = void 0;
var common_1 = require("@nestjs/common");
var fs_1 = require("fs");
var path_1 = require("path");
var mongoose_1 = require("mongoose");
var mongodb_1 = require("mongodb");
var category_name_normalize_1 = require("./category-name-normalize");
var category_id_counter_schema_1 = require("./schemas/category-id-counter.schema");
var upload_file_util_1 = require("../utils/upload-file.util");
var website_public_product_filter_1 = require("../product-registration/constants/website-public-product.filter");
function pad2(n) {
    return String(n).padStart(2, '0');
}
function numericFromMax(value) {
    if (value == null)
        return NaN;
    if (typeof value === 'number')
        return Number.isFinite(value) ? value : NaN;
    if (typeof value === 'object' &&
        value !== null &&
        typeof value.toNumber === 'function') {
        try {
            return value.toNumber();
        }
        catch (_a) {
            return NaN;
        }
    }
    var n = parseFloat(String(value));
    return Number.isFinite(n) ? n : NaN;
}
function csvEscape(value) {
    if (value === null || value === undefined)
        return '';
    var s = String(value);
    if (/[",\n\r]/.test(s)) {
        return "\"".concat(s.replace(/"/g, '""'), "\"");
    }
    return s;
}
function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
var CategoriesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CategoriesService = _classThis = /** @class */ (function () {
        function CategoriesService_1(categoryModel, counterModel, productModel, productPlantModel, configService, redisService) {
            this.categoryModel = categoryModel;
            this.counterModel = counterModel;
            this.productModel = productModel;
            this.productPlantModel = productPlantModel;
            this.configService = configService;
            this.redisService = redisService;
            this.logger = new common_1.Logger(CategoriesService.name);
        }
        CategoriesService_1.prototype.getCategoryListCacheTtlSeconds = function () {
            var ttl = parseInt(this.configService.get('CATEGORY_LIST_CACHE_TTL_SECONDS') ||
                this.configService.get('CACHE_TTL_SECONDS') ||
                '60', 10);
            return Number.isFinite(ttl) && ttl > 0 ? ttl : 60;
        };
        CategoriesService_1.prototype.buildCategoryListCacheKey = function (query) {
            var _a, _b;
            var normalized = {
                sector: (_a = query.sector) !== null && _a !== void 0 ? _a : null,
                sectors: String(query.sectors || '')
                    .split(',')
                    .map(function (v) { return v.trim(); })
                    .filter(Boolean)
                    .sort()
                    .join(','),
                status: (_b = query.status) !== null && _b !== void 0 ? _b : null,
                raw_material: String(query.raw_material || '')
                    .split(',')
                    .map(function (v) { return v.trim(); })
                    .filter(Boolean)
                    .sort()
                    .join(','),
                sort: query.sort === 'desc' ? 'desc' : 'asc',
            };
            return this.redisService.buildKey('categories', 'list', JSON.stringify(normalized));
        };
        CategoriesService_1.prototype.invalidateCategoryListCache = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.redisService
                                .deleteByPattern(this.redisService.buildKey('categories', 'list', '*'))
                                .catch(function (error) {
                                _this.logger.warn("Failed to invalidate category list cache: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        CategoriesService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                var shouldSyncIndexes, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.ensureCategoryUploadDirs();
                            return [4 /*yield*/, this.backfillCategoryNameNormalized()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.dedupeCategoryNameNormalized()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.syncCategoryIdCounterFromCategories()];
                        case 3:
                            _a.sent();
                            shouldSyncIndexes = String(process.env.SYNC_INDEXES_ON_BOOT || 'false').toLowerCase() ===
                                'true';
                            if (!shouldSyncIndexes)
                                return [2 /*return*/];
                            _a.label = 4;
                        case 4:
                            _a.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, this.categoryModel.syncIndexes()];
                        case 5:
                            _a.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            err_1 = _a.sent();
                            console.error('[categories] syncIndexes failed — duplicate normalized names or DB issue:', err_1);
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * If legacy data contains duplicates for category_name_normalized, a UNIQUE index build will fail.
         * This step makes duplicates unique by appending "-<shortId>" to all but the newest document.
         */
        CategoriesService_1.prototype.dedupeCategoryNameNormalized = function () {
            return __awaiter(this, void 0, void 0, function () {
                var dupGroups, ops, _i, dupGroups_1, g, ids, sorted, keep, rewrite, _a, rewrite_1, id, shortId, base, next;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.categoryModel
                                .aggregate([
                                {
                                    $match: {
                                        category_name_normalized: { $exists: true, $nin: [null, ''] },
                                    },
                                },
                                {
                                    $group: {
                                        _id: '$category_name_normalized',
                                        ids: { $push: '$_id' },
                                        count: { $sum: 1 },
                                    },
                                },
                                { $match: { count: { $gt: 1 } } },
                            ])
                                .exec()];
                        case 1:
                            dupGroups = _c.sent();
                            if (!(dupGroups === null || dupGroups === void 0 ? void 0 : dupGroups.length))
                                return [2 /*return*/];
                            ops = [];
                            for (_i = 0, dupGroups_1 = dupGroups; _i < dupGroups_1.length; _i++) {
                                g = dupGroups_1[_i];
                                ids = ((_b = g === null || g === void 0 ? void 0 : g.ids) !== null && _b !== void 0 ? _b : []).filter(Boolean);
                                if (ids.length < 2)
                                    continue;
                                sorted = __spreadArray([], ids, true).sort(function (a, b) { return (String(a) < String(b) ? -1 : 1); });
                                keep = sorted[sorted.length - 1];
                                rewrite = sorted.slice(0, -1);
                                for (_a = 0, rewrite_1 = rewrite; _a < rewrite_1.length; _a++) {
                                    id = rewrite_1[_a];
                                    shortId = String(id).slice(-6);
                                    base = String(g._id);
                                    next = "".concat(base, "-").concat(shortId);
                                    ops.push({
                                        updateOne: {
                                            filter: { _id: id },
                                            update: { $set: { category_name_normalized: next } },
                                        },
                                    });
                                }
                                // Ensure the kept doc still has the base (in case it was rewritten earlier).
                                ops.push({
                                    updateOne: {
                                        filter: { _id: keep },
                                        update: { $set: { category_name_normalized: String(g._id) } },
                                    },
                                });
                            }
                            if (!(ops.length > 0)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.categoryModel.bulkWrite(ops, { ordered: false })];
                        case 2:
                            _c.sent();
                            _c.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /** Ensures category_name_normalized exists for legacy rows before unique index sync */
        CategoriesService_1.prototype.backfillCategoryNameNormalized = function () {
            return __awaiter(this, void 0, void 0, function () {
                var cursor, ops, _a, cursor_1, cursor_1_1, doc, display, key, e_1_1;
                var _b, e_1, _c, _d;
                var _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            cursor = this.categoryModel
                                .find({
                                $or: [
                                    { category_name_normalized: { $exists: false } },
                                    { category_name_normalized: null },
                                    { category_name_normalized: '' },
                                ],
                            })
                                .select('_id category_name')
                                .cursor();
                            ops = [];
                            _f.label = 1;
                        case 1:
                            _f.trys.push([1, 6, 7, 12]);
                            _a = true, cursor_1 = __asyncValues(cursor);
                            _f.label = 2;
                        case 2: return [4 /*yield*/, cursor_1.next()];
                        case 3:
                            if (!(cursor_1_1 = _f.sent(), _b = cursor_1_1.done, !_b)) return [3 /*break*/, 5];
                            _d = cursor_1_1.value;
                            _a = false;
                            doc = _d;
                            display = (0, category_name_normalize_1.formatCategoryDisplayName)(String((_e = doc.category_name) !== null && _e !== void 0 ? _e : ''));
                            key = (0, category_name_normalize_1.normalizeCategoryNameKey)(display);
                            if (!key)
                                return [3 /*break*/, 4];
                            ops.push({
                                updateOne: {
                                    filter: { _id: doc._id },
                                    update: { $set: { category_name_normalized: key } },
                                },
                            });
                            _f.label = 4;
                        case 4:
                            _a = true;
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 12];
                        case 6:
                            e_1_1 = _f.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 12];
                        case 7:
                            _f.trys.push([7, , 10, 11]);
                            if (!(!_a && !_b && (_c = cursor_1.return))) return [3 /*break*/, 9];
                            return [4 /*yield*/, _c.call(cursor_1)];
                        case 8:
                            _f.sent();
                            _f.label = 9;
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            if (e_1) throw e_1.error;
                            return [7 /*endfinally*/];
                        case 11: return [7 /*endfinally*/];
                        case 12:
                            if (!(ops.length > 0)) return [3 /*break*/, 14];
                            return [4 /*yield*/, this.categoryModel.bulkWrite(ops, { ordered: false })];
                        case 13:
                            _f.sent();
                            _f.label = 14;
                        case 14: return [2 /*return*/];
                    }
                });
            });
        };
        CategoriesService_1.prototype.rethrowIfDuplicateCategoryName = function (err) {
            if (err instanceof mongodb_1.MongoServerError &&
                err.code === 11000) {
                var pattern = err.keyPattern;
                if (pattern &&
                    Object.prototype.hasOwnProperty.call(pattern, 'category_name_normalized')) {
                    throw new common_1.ConflictException('A category with this name already exists');
                }
            }
        };
        CategoriesService_1.prototype.assertCategoryNameUnique = function (normalized, excludeId) {
            return __awaiter(this, void 0, void 0, function () {
                var filter, existing;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filter = {
                                category_name_normalized: normalized,
                            };
                            if (excludeId) {
                                filter._id = { $ne: excludeId };
                            }
                            return [4 /*yield*/, this.categoryModel
                                    .findOne(filter)
                                    .select('_id')
                                    .lean()
                                    .exec()];
                        case 1:
                            existing = _a.sent();
                            if (existing) {
                                throw new common_1.ConflictException('A category with this name already exists');
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Ensures project/uploads/categories exists (matches main.ts /uploads static mount) */
        CategoriesService_1.prototype.ensureCategoryUploadDirs = function () {
            var dir = (0, path_1.join)(process.cwd(), 'uploads', 'categories');
            if (!(0, fs_1.existsSync)(dir)) {
                (0, fs_1.mkdirSync)(dir, { recursive: true });
            }
        };
        /** Public base for absolute image URLs (set API_BASE_URL in production). */
        CategoriesService_1.prototype.getApiBaseUrl = function () {
            var _a;
            var fromEnv = (_a = this.configService.get('API_BASE_URL')) === null || _a === void 0 ? void 0 : _a.trim();
            if (fromEnv)
                return fromEnv.replace(/\/$/, '');
            var port = this.configService.get('PORT') || process.env.PORT || '3000';
            return "http://localhost:".concat(port);
        };
        /**
         * Full URL for category_image served under /uploads/ (see main.ts express.static mount).
         * If category_image is already an http(s) URL, returns it unchanged.
         * The file must exist on disk under project/uploads/ or the browser will get 404.
         */
        CategoriesService_1.prototype.resolveCategoryImageUrl = function (categoryImage) {
            return (0, upload_file_util_1.resolvePublicUploadUrl)(categoryImage, this.getApiBaseUrl());
        };
        CategoriesService_1.prototype.buildFindFilter = function (query, options) {
            var _a, _b, _c;
            var filter = {};
            var enableMultiSector = (_a = options === null || options === void 0 ? void 0 : options.enableMultiSector) !== null && _a !== void 0 ? _a : false;
            if (enableMultiSector) {
                var sectors = ((_b = query.sectors) !== null && _b !== void 0 ? _b : '')
                    .split(',')
                    .map(function (v) { return parseInt(v.trim(), 10); })
                    .filter(function (n) { return Number.isFinite(n) && n > 0; });
                if (sectors.length > 0) {
                    filter.sector = { $in: sectors };
                }
                else if (query.sector !== undefined && query.sector !== null) {
                    filter.sector = query.sector;
                }
            }
            else if (query.sector !== undefined && query.sector !== null) {
                filter.sector = query.sector;
            }
            if (query.status !== undefined && query.status !== null) {
                filter.category_status = query.status;
            }
            var rawMaterialTokens = ((_c = query.raw_material) !== null && _c !== void 0 ? _c : '')
                .split(',')
                .map(function (v) { return v.trim(); })
                .filter(function (v) { return v.length > 0; });
            if (rawMaterialTokens.length > 0) {
                filter.$or = rawMaterialTokens.map(function (token) { return ({
                    category_raw_material_forms: {
                        $regex: new RegExp("(^|,)\\s*".concat(escapeRegex(token), "\\s*(,|$)")),
                    },
                }); });
            }
            return filter;
        };
        CategoriesService_1.prototype.findAll = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, error_1, filter, sortOrder, rows, out, _i, rows_1, doc;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheKey = this.buildCategoryListCacheKey(query);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _a.sent();
                            if (Array.isArray(cached)) {
                                return [2 /*return*/, cached];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            this.logger.warn("Category list cache read failed: ".concat((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4:
                            filter = this.buildFindFilter(query, { enableMultiSector: true });
                            sortOrder = query.sort === 'desc' ? -1 : 1;
                            return [4 /*yield*/, this.categoryModel
                                    .find(filter)
                                    .sort({ category_name: sortOrder })
                                    .lean()
                                    .exec()];
                        case 5:
                            rows = _a.sent();
                            out = [];
                            for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                                doc = rows_1[_i];
                                out.push(__assign(__assign({}, doc), { category_image_url: this.resolveCategoryImageUrl(doc.category_image) }));
                            }
                            this.redisService
                                .set(cacheKey, out, this.getCategoryListCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("Category list cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, out];
                    }
                });
            });
        };
        CategoriesService_1.prototype.countWebsitePublicProductsAndManufacturersByCategory = function (categoryIds) {
            return __awaiter(this, void 0, void 0, function () {
                var rows, out, _i, rows_2, row;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!categoryIds.length) {
                                return [2 /*return*/, new Map()];
                            }
                            return [4 /*yield*/, this.productModel
                                    .aggregate([
                                    {
                                        $match: (0, website_public_product_filter_1.matchWebsitePublicCertifiedProducts)({
                                            categoryId: { $in: categoryIds },
                                        }),
                                    },
                                    {
                                        $group: {
                                            _id: '$categoryId',
                                            category_product_count: { $sum: 1 },
                                            manufacturerIds: { $addToSet: '$manufacturerId' },
                                        },
                                    },
                                    {
                                        $project: {
                                            category_product_count: 1,
                                            category_manufacturer_count: { $size: '$manufacturerIds' },
                                        },
                                    },
                                ])
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            out = new Map();
                            for (_i = 0, rows_2 = rows; _i < rows_2.length; _i++) {
                                row = rows_2[_i];
                                out.set(String(row._id), {
                                    category_product_count: row.category_product_count,
                                    category_manufacturer_count: row.category_manufacturer_count,
                                });
                            }
                            return [2 /*return*/, out];
                    }
                });
            });
        };
        /**
         * Public website categories listing: only categories with at least one certified,
         * non–soft-deleted product (same scope as the website product grid).
         */
        CategoriesService_1.prototype.findAllForWebsitePublic = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, error_2, categoryIds, filter, sortOrder, rows, categoryObjectIds, countsByCategoryId, out;
                var _this = this;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            cacheKey = this.redisService.buildKey('categories', 'list', 'website-public-certified-products-v3', JSON.stringify({
                                sector: (_a = query.sector) !== null && _a !== void 0 ? _a : null,
                                sectors: String(query.sectors || '')
                                    .split(',')
                                    .map(function (v) { return v.trim(); })
                                    .filter(Boolean)
                                    .sort()
                                    .join(','),
                                status: (_b = query.status) !== null && _b !== void 0 ? _b : null,
                                raw_material: String(query.raw_material || '')
                                    .split(',')
                                    .map(function (v) { return v.trim(); })
                                    .filter(Boolean)
                                    .sort()
                                    .join(','),
                                sort: query.sort === 'desc' ? 'desc' : 'asc',
                            }));
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _c.sent();
                            if (Array.isArray(cached)) {
                                return [2 /*return*/, cached];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _c.sent();
                            this.logger.warn("Website public category list cache read failed: ".concat((error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4: return [4 /*yield*/, this.productModel
                                .distinct('categoryId', (0, website_public_product_filter_1.matchWebsitePublicCertifiedProducts)())
                                .exec()];
                        case 5:
                            categoryIds = _c.sent();
                            if (!categoryIds.length) {
                                return [2 /*return*/, []];
                            }
                            filter = this.buildFindFilter(query, { enableMultiSector: true });
                            filter._id = { $in: categoryIds };
                            if (query.status === undefined || query.status === null) {
                                filter.category_status = 1;
                            }
                            sortOrder = query.sort === 'desc' ? -1 : 1;
                            return [4 /*yield*/, this.categoryModel
                                    .find(filter)
                                    .sort({ category_name: sortOrder })
                                    .lean()
                                    .exec()];
                        case 6:
                            rows = _c.sent();
                            categoryObjectIds = rows.map(function (doc) { return doc._id; });
                            return [4 /*yield*/, this.countWebsitePublicProductsAndManufacturersByCategory(categoryObjectIds)];
                        case 7:
                            countsByCategoryId = _c.sent();
                            out = rows.map(function (doc) {
                                var _a, _b;
                                var counts = (_a = countsByCategoryId.get(String(doc._id))) !== null && _a !== void 0 ? _a : {
                                    category_product_count: 0,
                                    category_manufacturer_count: 0,
                                };
                                var category_image_url = _this.resolveCategoryImageUrl(doc.category_image);
                                return __assign(__assign(__assign({}, doc), { category_image: (_b = category_image_url !== null && category_image_url !== void 0 ? category_image_url : doc.category_image) !== null && _b !== void 0 ? _b : null, category_image_url: category_image_url, categoryImageUrl: category_image_url }), counts);
                            });
                            this.redisService
                                .set(cacheKey, out, this.getCategoryListCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("Website public category list cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, out];
                    }
                });
            });
        };
        CategoriesService_1.prototype.buildCsvExport = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var filter, sortOrder, rows, header, lines;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filter = this.buildFindFilter(query);
                            sortOrder = query.sort === 'desc' ? -1 : 1;
                            return [4 /*yield*/, this.categoryModel
                                    .find(filter)
                                    .sort({ category_name: sortOrder })
                                    .lean()
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            header = [
                                'category_id',
                                'category_name',
                                'category_image',
                                'category_image_url',
                                'category_raw_material_forms',
                                'category_status',
                                'sector',
                                'created_date',
                                'updated_date',
                            ];
                            lines = __spreadArray([
                                header.join(',')
                            ], rows.map(function (r) {
                                var _a, _b, _c, _d, _e;
                                return [
                                    r.category_id,
                                    r.category_name,
                                    (_a = r.category_image) !== null && _a !== void 0 ? _a : '',
                                    (_b = _this.resolveCategoryImageUrl(r.category_image)) !== null && _b !== void 0 ? _b : '',
                                    (_c = r.category_raw_material_forms) !== null && _c !== void 0 ? _c : '',
                                    r.category_status,
                                    r.sector,
                                    (_d = r.created_date) !== null && _d !== void 0 ? _d : '',
                                    (_e = r.updated_date) !== null && _e !== void 0 ? _e : '',
                                ]
                                    .map(csvEscape)
                                    .join(',');
                            }), true);
                            return [2 /*return*/, lines.join('\r\n')];
                    }
                });
            });
        };
        /** Max numeric category_id in categories (legacy string/int/long values). */
        CategoriesService_1.prototype.getMaxCategoryIdFromCollection = function () {
            return __awaiter(this, void 0, void 0, function () {
                var agg, max;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.categoryModel
                                .aggregate([
                                { $match: { category_id: { $exists: true, $ne: null } } },
                                {
                                    $addFields: {
                                        _n: {
                                            $convert: {
                                                input: '$category_id',
                                                to: 'double',
                                                onError: null,
                                                onNull: null,
                                            },
                                        },
                                    },
                                },
                                { $match: { _n: { $gt: 0 } } },
                                { $group: { _id: null, maxId: { $max: '$_n' } } },
                            ])
                                .exec()];
                        case 1:
                            agg = _b.sent();
                            max = numericFromMax((_a = agg[0]) === null || _a === void 0 ? void 0 : _a.maxId);
                            return [2 /*return*/, Number.isFinite(max) && max > 0 ? Math.floor(max) : 0];
                    }
                });
            });
        };
        /** Ensure counter seq is at least max(existing category_id) so the next $inc is unique. */
        CategoriesService_1.prototype.syncCategoryIdCounterFromCategories = function () {
            return __awaiter(this, void 0, void 0, function () {
                var maxFromDocs, existing, currentSeq, seed;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.getMaxCategoryIdFromCollection()];
                        case 1:
                            maxFromDocs = _b.sent();
                            return [4 /*yield*/, this.counterModel
                                    .findOne({ _id: category_id_counter_schema_1.CATEGORY_ID_COUNTER_KEY })
                                    .lean()
                                    .exec()];
                        case 2:
                            existing = _b.sent();
                            currentSeq = (_a = existing === null || existing === void 0 ? void 0 : existing.seq) !== null && _a !== void 0 ? _a : 0;
                            seed = Math.max(currentSeq, maxFromDocs);
                            return [4 /*yield*/, this.counterModel
                                    .updateOne({ _id: category_id_counter_schema_1.CATEGORY_ID_COUNTER_KEY }, { $set: { seq: seed } }, { upsert: true })
                                    .exec()];
                        case 3:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Atomic next id — never derived from the request body */
        CategoriesService_1.prototype.nextCategoryIdFromCounter = function () {
            return __awaiter(this, void 0, void 0, function () {
                var doc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.counterModel
                                .findOneAndUpdate({ _id: category_id_counter_schema_1.CATEGORY_ID_COUNTER_KEY }, { $inc: { seq: 1 } }, { new: true, upsert: true })
                                .exec()];
                        case 1:
                            doc = _a.sent();
                            if (!doc || typeof doc.seq !== 'number' || !Number.isFinite(doc.seq)) {
                                throw new Error('Failed to allocate category_id');
                            }
                            return [2 /*return*/, doc.seq];
                    }
                });
            });
        };
        CategoriesService_1.prototype.formatCreatedDate = function () {
            var d = new Date();
            return "".concat(d.getFullYear(), "-").concat(pad2(d.getMonth() + 1), "-").concat(pad2(d.getDate()), " ").concat(pad2(d.getHours()), ":").concat(pad2(d.getMinutes()), ":").concat(pad2(d.getSeconds()));
        };
        CategoriesService_1.prototype.formatUpdatedDate = function () {
            var d = new Date();
            return "".concat(pad2(d.getDate()), "/").concat(pad2(d.getMonth() + 1), "/").concat(d.getFullYear());
        };
        CategoriesService_1.prototype.create = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var displayName, category_name_normalized, created_date, updated_date, category_id, doc, err_2, plain;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            displayName = (0, category_name_normalize_1.formatCategoryDisplayName)(dto.category_name);
                            if (!displayName) {
                                throw new common_1.BadRequestException('Category name is required');
                            }
                            category_name_normalized = (0, category_name_normalize_1.normalizeCategoryNameKey)(displayName);
                            return [4 /*yield*/, this.assertCategoryNameUnique(category_name_normalized)];
                        case 1:
                            _c.sent();
                            created_date = this.formatCreatedDate();
                            updated_date = this.formatUpdatedDate();
                            return [4 /*yield*/, this.nextCategoryIdFromCounter()];
                        case 2:
                            category_id = _c.sent();
                            _c.label = 3;
                        case 3:
                            _c.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.categoryModel.create({
                                    category_name: displayName,
                                    category_name_normalized: category_name_normalized,
                                    category_image: dto.category_image,
                                    category_raw_material_forms: dto.category_raw_material_forms,
                                    category_status: (_a = dto.category_status) !== null && _a !== void 0 ? _a : 1,
                                    sector: (_b = dto.sector) !== null && _b !== void 0 ? _b : 1,
                                    created_date: created_date,
                                    updated_date: updated_date,
                                    category_id: category_id,
                                })];
                        case 4:
                            doc = _c.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            err_2 = _c.sent();
                            this.rethrowIfDuplicateCategoryName(err_2);
                            throw err_2;
                        case 6:
                            plain = doc.toObject();
                            return [4 /*yield*/, this.invalidateCategoryListCache()];
                        case 7:
                            _c.sent();
                            return [2 /*return*/, __assign(__assign({}, plain), { category_image_url: this.resolveCategoryImageUrl(plain.category_image) })];
                    }
                });
            });
        };
        CategoriesService_1.prototype.parseCategoryObjectId = function (id) {
            var trimmed = id === null || id === void 0 ? void 0 : id.trim();
            if (!trimmed || !mongoose_1.Types.ObjectId.isValid(trimmed)) {
                throw new common_1.BadRequestException('Invalid category id');
            }
            return new mongoose_1.Types.ObjectId(trimmed);
        };
        CategoriesService_1.prototype.toCategoryResponse = function (plain) {
            return __assign(__assign({}, plain), { category_image_url: this.resolveCategoryImageUrl(plain.category_image) });
        };
        CategoriesService_1.prototype.updateStatus = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var oid, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            oid = this.parseCategoryObjectId(id);
                            return [4 /*yield*/, this.categoryModel
                                    .findOneAndUpdate({ _id: oid }, {
                                    $set: {
                                        category_status: dto.category_status,
                                        updated_date: this.formatUpdatedDate(),
                                    },
                                }, { new: true })
                                    .exec()];
                        case 1:
                            updated = _a.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Category not found');
                            }
                            return [4 /*yield*/, this.invalidateCategoryListCache()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.toCategoryResponse(updated.toObject())];
                    }
                });
            });
        };
        CategoriesService_1.prototype.update = function (id, dto, image) {
            return __awaiter(this, void 0, void 0, function () {
                var oid, existing, hasFieldUpdate, set, displayName, category_name_normalized, uploaded, updated, err_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            oid = this.parseCategoryObjectId(id);
                            return [4 /*yield*/, this.categoryModel.findById(oid).exec()];
                        case 1:
                            existing = _a.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException('Category not found');
                            }
                            hasFieldUpdate = (dto.category_name !== undefined &&
                                String(dto.category_name).trim() !== '') ||
                                dto.category_raw_material_forms !== undefined ||
                                dto.category_status !== undefined ||
                                dto.sector !== undefined ||
                                !!image;
                            if (!hasFieldUpdate) {
                                throw new common_1.BadRequestException('No fields to update');
                            }
                            set = {
                                updated_date: this.formatUpdatedDate(),
                            };
                            if (!(dto.category_name !== undefined &&
                                String(dto.category_name).trim() !== '')) return [3 /*break*/, 3];
                            displayName = (0, category_name_normalize_1.formatCategoryDisplayName)(dto.category_name);
                            if (!displayName) {
                                throw new common_1.BadRequestException('Category name cannot be empty');
                            }
                            category_name_normalized = (0, category_name_normalize_1.normalizeCategoryNameKey)(displayName);
                            return [4 /*yield*/, this.assertCategoryNameUnique(category_name_normalized, oid)];
                        case 2:
                            _a.sent();
                            set.category_name = displayName;
                            set.category_name_normalized = category_name_normalized;
                            _a.label = 3;
                        case 3:
                            if (dto.category_raw_material_forms !== undefined) {
                                set.category_raw_material_forms = dto.category_raw_material_forms;
                            }
                            if (dto.category_status !== undefined) {
                                set.category_status = dto.category_status;
                            }
                            if (dto.sector !== undefined) {
                                set.sector = dto.sector;
                            }
                            if (!image) return [3 /*break*/, 5];
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(image, 'categories')];
                        case 4:
                            uploaded = _a.sent();
                            set.category_image = uploaded.fileUrl;
                            _a.label = 5;
                        case 5:
                            _a.trys.push([5, 7, , 8]);
                            return [4 /*yield*/, this.categoryModel
                                    .findOneAndUpdate({ _id: oid }, { $set: set }, { new: true })
                                    .exec()];
                        case 6:
                            updated = _a.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            err_3 = _a.sent();
                            this.rethrowIfDuplicateCategoryName(err_3);
                            throw err_3;
                        case 8:
                            if (!updated) {
                                throw new common_1.NotFoundException('Category not found');
                            }
                            return [4 /*yield*/, this.invalidateCategoryListCache()];
                        case 9:
                            _a.sent();
                            return [2 /*return*/, this.toCategoryResponse(updated.toObject())];
                    }
                });
            });
        };
        CategoriesService_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var oid, existing, _a, productCount, plantCount;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            oid = this.parseCategoryObjectId(id);
                            return [4 /*yield*/, this.categoryModel.findById(oid).exec()];
                        case 1:
                            existing = _b.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException('Category not found');
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.productModel.countDocuments({ categoryId: oid }).exec(),
                                    this.productPlantModel.countDocuments({ categoryId: oid }).exec(),
                                ])];
                        case 2:
                            _a = _b.sent(), productCount = _a[0], plantCount = _a[1];
                            if (productCount > 0 || plantCount > 0) {
                                throw new common_1.ConflictException('Products exist under this category; remove or reassign them before deleting.');
                            }
                            return [4 /*yield*/, this.categoryModel.deleteOne({ _id: oid }).exec()];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, this.invalidateCategoryListCache()];
                        case 4:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Resolve `category_name` for numeric ids returned by GET /categories (`category_id`).
         */
        CategoriesService_1.prototype.getCategoryNamesByNumericIds = function (categoryIds) {
            return __awaiter(this, void 0, void 0, function () {
                var unique, rows;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            unique = __spreadArray([], new Set(categoryIds.filter(function (x) {
                                return typeof x === 'number' && Number.isInteger(x) && x >= 1;
                            })), true);
                            if (!unique.length) {
                                return [2 /*return*/, new Map()];
                            }
                            return [4 /*yield*/, this.categoryModel
                                    .find({ category_id: { $in: unique } })
                                    .select('category_id category_name')
                                    .lean()
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, new Map(rows.map(function (r) { return [r.category_id, r.category_name]; }))];
                    }
                });
            });
        };
        /**
         * Numeric `category_id` values for categories in a sector (GET /categories `sector` field).
         * Sorted ascending by `category_id`.
         */
        CategoriesService_1.prototype.listNumericCategoryIdsBySector = function (sectorId) {
            return __awaiter(this, void 0, void 0, function () {
                var rows;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!Number.isInteger(sectorId) || sectorId < 1) {
                                return [2 /*return*/, []];
                            }
                            return [4 /*yield*/, this.categoryModel
                                    .find({ sector: sectorId })
                                    .select('category_id')
                                    .sort({ category_id: 1 })
                                    .lean()
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, rows
                                    .map(function (r) { return r.category_id; })
                                    .filter(function (x) {
                                    return typeof x === 'number' && Number.isInteger(x) && x >= 1;
                                })];
                    }
                });
            });
        };
        /** Maps numeric `category_id` → sector id from the categories collection. */
        CategoriesService_1.prototype.getCategorySectorsByNumericIds = function (categoryIds) {
            return __awaiter(this, void 0, void 0, function () {
                var unique, rows, m, _i, rows_3, r, cid, sec;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            unique = __spreadArray([], new Set(categoryIds.filter(function (x) {
                                return typeof x === 'number' && Number.isInteger(x) && x >= 1;
                            })), true);
                            if (!unique.length) {
                                return [2 /*return*/, new Map()];
                            }
                            return [4 /*yield*/, this.categoryModel
                                    .find({ category_id: { $in: unique } })
                                    .select('category_id sector')
                                    .lean()
                                    .exec()];
                        case 1:
                            rows = _a.sent();
                            m = new Map();
                            for (_i = 0, rows_3 = rows; _i < rows_3.length; _i++) {
                                r = rows_3[_i];
                                cid = r.category_id;
                                sec = typeof r.sector === 'number' && Number.isFinite(r.sector)
                                    ? Math.floor(r.sector)
                                    : 1;
                                m.set(cid, sec);
                            }
                            return [2 /*return*/, m];
                    }
                });
            });
        };
        /**
         * For standards filters: numeric `category_id` from GET /categories, or MongoDB category `_id`
         * (24-char hex) when the client uses document ids in URLs.
         */
        CategoriesService_1.prototype.resolveNumericCategoryKey = function (param) {
            return __awaiter(this, void 0, void 0, function () {
                var trimmed, doc, n;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trimmed = String(param !== null && param !== void 0 ? param : '').trim();
                            if (!trimmed) {
                                throw new common_1.BadRequestException('Invalid category id');
                            }
                            if (!mongoose_1.Types.ObjectId.isValid(trimmed)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.categoryModel
                                    .findById(new mongoose_1.Types.ObjectId(trimmed))
                                    .select('category_id')
                                    .lean()
                                    .exec()];
                        case 1:
                            doc = _a.sent();
                            if (!doc ||
                                typeof doc.category_id !== 'number' ||
                                !Number.isInteger(doc.category_id) ||
                                doc.category_id < 1) {
                                throw new common_1.BadRequestException({
                                    statusCode: 400,
                                    error: 'Bad Request',
                                    message: 'Unknown category_id',
                                });
                            }
                            return [2 /*return*/, doc.category_id];
                        case 2:
                            n = parseInt(trimmed, 10);
                            if (!Number.isFinite(n) || n < 1 || !Number.isInteger(n)) {
                                throw new common_1.BadRequestException('Invalid category id');
                            }
                            return [4 /*yield*/, this.assertNumericCategoryExists(n)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, n];
                    }
                });
            });
        };
        /** Ensures a row exists with this numeric `category_id` (categories collection). */
        CategoriesService_1.prototype.assertNumericCategoryExists = function (categoryId) {
            return __awaiter(this, void 0, void 0, function () {
                var ok;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.categoryModel.exists({ category_id: categoryId })];
                        case 1:
                            ok = _a.sent();
                            if (!ok) {
                                throw new common_1.BadRequestException({
                                    statusCode: 400,
                                    error: 'Bad Request',
                                    message: 'Unknown category_id',
                                    category_id: categoryId,
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Ensures every numeric `category_id` exists (batch). */
        CategoriesService_1.prototype.assertNumericCategoriesExist = function (categoryIds) {
            return __awaiter(this, void 0, void 0, function () {
                var unique, count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            unique = __spreadArray([], new Set(categoryIds.filter(function (x) {
                                return typeof x === 'number' && Number.isInteger(x) && x >= 1;
                            })), true);
                            if (unique.length === 0) {
                                throw new common_1.BadRequestException({
                                    statusCode: 400,
                                    error: 'Bad Request',
                                    message: 'At least one valid category_id is required',
                                });
                            }
                            return [4 /*yield*/, this.categoryModel
                                    .countDocuments({ category_id: { $in: unique } })
                                    .exec()];
                        case 1:
                            count = _a.sent();
                            if (count !== unique.length) {
                                throw new common_1.BadRequestException({
                                    statusCode: 400,
                                    error: 'Bad Request',
                                    message: 'One or more category_id values are unknown',
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        return CategoriesService_1;
    }());
    __setFunctionName(_classThis, "CategoriesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CategoriesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CategoriesService = _classThis;
}();
exports.CategoriesService = CategoriesService;
