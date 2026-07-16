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
exports.CountriesService = void 0;
var common_1 = require("@nestjs/common");
var CountriesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CountriesService = _classThis = /** @class */ (function () {
        function CountriesService_1(countryModel, configService, redisService) {
            this.countryModel = countryModel;
            this.configService = configService;
            this.redisService = redisService;
            this.logger = new common_1.Logger(CountriesService.name);
        }
        CountriesService_1.prototype.getCountriesListCacheTtlSeconds = function () {
            var ttl = parseInt(this.configService.get('COUNTRIES_LIST_CACHE_TTL_SECONDS') ||
                this.configService.get('CACHE_TTL_SECONDS') ||
                '300', 10);
            return Number.isFinite(ttl) && ttl > 0 ? ttl : 300;
        };
        /** Full country list for filter dropdowns — always from DB (no Redis cache, no product scope). */
        CountriesService_1.prototype.findAllForFilterOptions = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.countryModel
                            .find()
                            .sort({ countryName: 1, country_name: 1, name: 1 })
                            .lean()
                            .exec()];
                });
            });
        };
        /**
         * All countries as `{ value, label }` for dropdowns (uncertified list filters, etc.).
         * Not scoped to existing products — every row in `countries` is included.
         */
        CountriesService_1.prototype.buildDropdownOptions = function () {
            return __awaiter(this, void 0, void 0, function () {
                var countries;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findAllForFilterOptions()];
                        case 1:
                            countries = _a.sent();
                            return [2 /*return*/, (countries !== null && countries !== void 0 ? countries : [])
                                    .map(function (country) {
                                    var _a, _b, _c, _d;
                                    var c = country;
                                    var value = String((_a = c._id) !== null && _a !== void 0 ? _a : '').trim();
                                    if (!value || value === 'undefined') {
                                        return null;
                                    }
                                    var label = String((_d = (_c = (_b = c.countryName) !== null && _b !== void 0 ? _b : c.country_name) !== null && _c !== void 0 ? _c : c.name) !== null && _d !== void 0 ? _d : '').trim() ||
                                        'Country';
                                    return { value: value, label: label };
                                })
                                    .filter(function (row) { return row != null; })
                                    .sort(function (a, b) { return a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }); })];
                    }
                });
            });
        };
        CountriesService_1.prototype.findAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, error_1, rows;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheKey = this.redisService.buildKey('countries', 'list', 'all:v2');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _a.sent();
                            if (Array.isArray(cached))
                                return [2 /*return*/, cached];
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            this.logger.warn("Countries list cache read failed: ".concat((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4: return [4 /*yield*/, this.countryModel
                                .find()
                                .sort({ countryName: 1, country_name: 1, name: 1 })
                                .lean()
                                .exec()];
                        case 5:
                            rows = _a.sent();
                            this.redisService
                                .set(cacheKey, rows, this.getCountriesListCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("Countries list cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, rows];
                    }
                });
            });
        };
        CountriesService_1.prototype.findById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.countryModel.findById(id).exec()];
                });
            });
        };
        CountriesService_1.prototype.searchByName = function (countryName) {
            return __awaiter(this, void 0, void 0, function () {
                var searchTerm_1, totalCount, sampleCountry, sampleObj, results, escapedSearchTerm, partialRegex, searchFields, _i, searchFields_1, fieldQuery, words, wordRegexes, orConditions, variations, variationRegexes, variationConditions, allCountries, similarCountries, error_2;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 17, , 18]);
                            if (!countryName || countryName.trim() === '') {
                                return [2 /*return*/, []];
                            }
                            searchTerm_1 = countryName.trim();
                            console.log('[Country Search] Searching for:', searchTerm_1);
                            return [4 /*yield*/, this.countryModel.countDocuments().exec()];
                        case 1:
                            totalCount = _a.sent();
                            console.log('[Country Search] Total countries in database:', totalCount);
                            return [4 /*yield*/, this.countryModel.findOne().exec()];
                        case 2:
                            sampleCountry = _a.sent();
                            if (sampleCountry) {
                                sampleObj = sampleCountry.toObject();
                                console.log('[Country Search] Sample country document:', JSON.stringify(sampleObj, null, 2));
                                console.log('[Country Search] Available fields:', Object.keys(sampleObj));
                                console.log('[Country Search] countryName value:', sampleObj.countryName);
                                console.log('[Country Search] name value:', sampleObj.name);
                                console.log('[Country Search] country_name value:', sampleObj.country_name);
                            }
                            else {
                                console.log('[Country Search] WARNING: No countries found in database at all!');
                                return [2 /*return*/, []];
                            }
                            return [4 /*yield*/, this.countryModel
                                    .find({
                                    countryName: new RegExp("^".concat(this.escapeRegex(searchTerm_1), "$"), 'i'),
                                })
                                    .sort({ countryName: 1 })
                                    .exec()];
                        case 3:
                            results = _a.sent();
                            if (!(results.length === 0)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.countryModel
                                    .find({ name: new RegExp("^".concat(this.escapeRegex(searchTerm_1), "$"), 'i') })
                                    .sort({ name: 1 })
                                    .exec()];
                        case 4:
                            // Try with name field (if it exists)
                            results = _a.sent();
                            _a.label = 5;
                        case 5:
                            if (!(results.length === 0)) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.countryModel
                                    .find({
                                    country_name: new RegExp("^".concat(this.escapeRegex(searchTerm_1), "$"), 'i'),
                                })
                                    .sort({ country_name: 1 })
                                    .exec()];
                        case 6:
                            // Try with country_name field (snake_case)
                            results = _a.sent();
                            _a.label = 7;
                        case 7:
                            if (results.length > 0) {
                                console.log('[Country Search] Found', results.length, 'exact matches');
                                return [2 /*return*/, results];
                            }
                            escapedSearchTerm = this.escapeRegex(searchTerm_1);
                            partialRegex = new RegExp(escapedSearchTerm, 'i');
                            searchFields = [
                                { countryName: partialRegex },
                                { name: partialRegex },
                                { country_name: partialRegex },
                            ];
                            _i = 0, searchFields_1 = searchFields;
                            _a.label = 8;
                        case 8:
                            if (!(_i < searchFields_1.length)) return [3 /*break*/, 11];
                            fieldQuery = searchFields_1[_i];
                            return [4 /*yield*/, this.countryModel
                                    .find(fieldQuery)
                                    .sort({ countryName: 1 })
                                    .exec()];
                        case 9:
                            results = _a.sent();
                            if (results.length > 0) {
                                console.log('[Country Search] Found', results.length, 'partial matches using field:', Object.keys(fieldQuery)[0]);
                                return [3 /*break*/, 11];
                            }
                            _a.label = 10;
                        case 10:
                            _i++;
                            return [3 /*break*/, 8];
                        case 11:
                            if (results.length > 0) {
                                console.log('[Country Search] Found', results.length, 'partial matches');
                                return [2 /*return*/, results];
                            }
                            words = searchTerm_1.split(/\s+/).filter(function (w) { return w.length > 2; });
                            if (!(words.length > 0)) return [3 /*break*/, 13];
                            wordRegexes = words.map(function (word) { return new RegExp(_this.escapeRegex(word), 'i'); });
                            orConditions = wordRegexes.map(function (regex) { return ({
                                countryName: regex,
                            }); });
                            return [4 /*yield*/, this.countryModel
                                    .find({ $or: orConditions })
                                    .sort({ countryName: 1 })
                                    .exec()];
                        case 12:
                            results = _a.sent();
                            if (results.length > 0) {
                                console.log('[Country Search] Found', results.length, 'word-based matches');
                                return [2 /*return*/, results];
                            }
                            _a.label = 13;
                        case 13:
                            variations = this.generateSearchVariations(searchTerm_1);
                            variationRegexes = variations.map(function (v) { return new RegExp(_this.escapeRegex(v), 'i'); });
                            variationConditions = variationRegexes.map(function (regex) { return ({
                                countryName: regex,
                            }); });
                            if (!(variationConditions.length > 0)) return [3 /*break*/, 15];
                            return [4 /*yield*/, this.countryModel
                                    .find({ $or: variationConditions })
                                    .sort({ countryName: 1 })
                                    .exec()];
                        case 14:
                            results = _a.sent();
                            if (results.length > 0) {
                                console.log('[Country Search] Found', results.length, 'variation matches');
                                return [2 /*return*/, results];
                            }
                            _a.label = 15;
                        case 15: return [4 /*yield*/, this.countryModel
                                .find()
                                .sort({ countryName: 1 })
                                .exec()];
                        case 16:
                            allCountries = _a.sent();
                            similarCountries = allCountries
                                .map(function (country) {
                                var countryNameLower = (country.countryName || '').toLowerCase();
                                return {
                                    country: country,
                                    similarity: _this.calculateSimilarity(searchTerm_1.toLowerCase(), countryNameLower),
                                };
                            })
                                .filter(function (item) { return item.similarity > 0.6; }) // 60% similarity threshold
                                .sort(function (a, b) { return b.similarity - a.similarity; })
                                .slice(0, 10) // Top 10 most similar
                                .map(function (item) { return item.country; });
                            if (similarCountries.length > 0) {
                                console.log('[Country Search] Found', similarCountries.length, 'similar matches');
                                return [2 /*return*/, similarCountries];
                            }
                            console.log('[Country Search] No matches found');
                            return [2 /*return*/, []];
                        case 17:
                            error_2 = _a.sent();
                            console.error('[Country Search] Error:', error_2);
                            console.error('[Country Search] Error stack:', error_2.stack);
                            throw error_2;
                        case 18: return [2 /*return*/];
                    }
                });
            });
        };
        CountriesService_1.prototype.escapeRegex = function (str) {
            return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };
        CountriesService_1.prototype.generateSearchVariations = function (term) {
            var variations = [];
            var lowerTerm = term.toLowerCase();
            // Add original
            variations.push(term);
            // Remove common suffixes
            var suffixes = [
                'country',
                'nation',
                'republic',
                'kingdom',
                'state',
                'states',
            ];
            for (var _i = 0, suffixes_1 = suffixes; _i < suffixes_1.length; _i++) {
                var suffix = suffixes_1[_i];
                if (lowerTerm.endsWith(suffix)) {
                    variations.push(term.substring(0, term.length - suffix.length).trim());
                }
            }
            // Handle common typos/variations for specific terms
            var commonVariations = {
                india: ['indian', 'hindustan'],
                usa: ['united states', 'america', 'us'],
                uk: ['united kingdom', 'britain', 'england'],
                telangana: ['telengana', 'telengana'],
            };
            if (commonVariations[lowerTerm]) {
                variations.push.apply(variations, commonVariations[lowerTerm]);
            }
            return __spreadArray([], new Set(variations), true); // Remove duplicates
        };
        CountriesService_1.prototype.calculateSimilarity = function (str1, str2) {
            try {
                if (!str1 || !str2)
                    return 0;
                // Simple Levenshtein-like similarity calculation
                var longer = str1.length > str2.length ? str1 : str2;
                var shorter = str1.length > str2.length ? str2 : str1;
                if (longer.length === 0)
                    return 1.0;
                // Check if one contains the other
                if (longer.includes(shorter)) {
                    return shorter.length / longer.length;
                }
                // Simple character-based similarity
                var matches = 0;
                var shorterChars = shorter.split('');
                var longerChars = longer.split('');
                for (var _i = 0, shorterChars_1 = shorterChars; _i < shorterChars_1.length; _i++) {
                    var char = shorterChars_1[_i];
                    if (longerChars.includes(char)) {
                        matches++;
                        var index = longerChars.indexOf(char);
                        longerChars.splice(index, 1);
                    }
                }
                return matches / longer.length;
            }
            catch (error) {
                console.error('[Country Search] Similarity calculation error:', error);
                return 0;
            }
        };
        return CountriesService_1;
    }());
    __setFunctionName(_classThis, "CountriesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CountriesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CountriesService = _classThis;
}();
exports.CountriesService = CountriesService;
