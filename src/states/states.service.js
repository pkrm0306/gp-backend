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
exports.StatesService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var StatesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var StatesService = _classThis = /** @class */ (function () {
        function StatesService_1(stateModel, countriesService, configService, redisService) {
            this.stateModel = stateModel;
            this.countriesService = countriesService;
            this.configService = configService;
            this.redisService = redisService;
            this.logger = new common_1.Logger(StatesService.name);
        }
        StatesService_1.prototype.getStatesListCacheTtlSeconds = function () {
            var ttl = parseInt(this.configService.get('STATES_LIST_CACHE_TTL_SECONDS') ||
                this.configService.get('CACHE_TTL_SECONDS') ||
                '300', 10);
            return Number.isFinite(ttl) && ttl > 0 ? ttl : 300;
        };
        /** Full state list for website filter tree — always from DB (no Redis cache). */
        StatesService_1.prototype.findAllForFilterOptions = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.stateModel
                            .find()
                            .sort({ name: 1, stateName: 1, state_name: 1 })
                            .lean()
                            .exec()];
                });
            });
        };
        StatesService_1.prototype.findAll = function (countryId) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, error_1, query, country, $or, countryCode, iso3, rows;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheKey = this.redisService.buildKey('states', 'list', countryId ? "country:".concat(countryId) : 'all:v2');
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
                            this.logger.warn("States list cache read failed: ".concat((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4:
                            query = {};
                            if (!countryId) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.countriesService.findById(countryId)];
                        case 5:
                            country = _a.sent();
                            if (!country) {
                                throw new common_1.NotFoundException("Country with ID ".concat(countryId, " not found"));
                            }
                            $or = [];
                            // Method 1: Check countryId (ObjectId)
                            $or.push({ countryId: new mongoose_1.Types.ObjectId(countryId) });
                            // Method 2: Check country_id (integer) if country has id field
                            if (country.id) {
                                $or.push({ country_id: country.id });
                            }
                            countryCode = country
                                .country_code ||
                                country.countryCode ||
                                country.iso2;
                            if (countryCode) {
                                $or.push({ country_code: countryCode });
                            }
                            iso3 = country.iso3;
                            if (iso3) {
                                $or.push({ country_code: iso3 });
                            }
                            // If we have any conditions, use them
                            if ($or.length > 0) {
                                query.$or = $or;
                            }
                            else {
                                // If no matching method found, return empty result
                                return [2 /*return*/, []];
                            }
                            _a.label = 6;
                        case 6: return [4 /*yield*/, this.stateModel
                                .find(query)
                                .sort({ name: 1, stateName: 1, state_name: 1 })
                                .lean()
                                .exec()];
                        case 7:
                            rows = _a.sent();
                            this.redisService
                                .set(cacheKey, rows, this.getStatesListCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("States list cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, rows];
                    }
                });
            });
        };
        StatesService_1.prototype.findById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.stateModel.findById(id).exec()];
                });
            });
        };
        StatesService_1.prototype.searchByName = function (stateName, countryId) {
            return __awaiter(this, void 0, void 0, function () {
                var searchTerm_1, totalCount, sampleState, sampleObj, countryFilter, country, countryConditions, countryCode, error_2, query, results, escapedSearchTerm, partialRegex, searchFields, _i, searchFields_1, fieldQuery, words, wordRegexes, fieldNames_3, _loop_1, this_1, _a, fieldNames_1, fieldName, state_1, variations, variationRegexes, fieldNames, _loop_2, this_2, _b, fieldNames_2, fieldName, state_2, allStates, similarStates, error_3;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 25, , 26]);
                            if (!stateName || stateName.trim() === '') {
                                return [2 /*return*/, []];
                            }
                            searchTerm_1 = stateName.trim();
                            console.log('[State Search] Searching for:', searchTerm_1);
                            console.log('[State Search] Country ID filter:', countryId);
                            return [4 /*yield*/, this.stateModel.countDocuments().exec()];
                        case 1:
                            totalCount = _c.sent();
                            console.log('[State Search] Total states in database:', totalCount);
                            return [4 /*yield*/, this.stateModel.findOne().exec()];
                        case 2:
                            sampleState = _c.sent();
                            if (sampleState) {
                                sampleObj = sampleState.toObject();
                                console.log('[State Search] Sample state document:', JSON.stringify(sampleObj, null, 2));
                                console.log('[State Search] Available fields:', Object.keys(sampleObj));
                                console.log('[State Search] stateName value:', sampleObj.stateName);
                                console.log('[State Search] name value:', sampleObj.name);
                                console.log('[State Search] state_name value:', sampleObj.state_name);
                            }
                            else {
                                console.log('[State Search] WARNING: No states found in database at all!');
                                return [2 /*return*/, []];
                            }
                            countryFilter = null;
                            if (!countryId) return [3 /*break*/, 6];
                            _c.label = 3;
                        case 3:
                            _c.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.countriesService.findById(countryId)];
                        case 4:
                            country = _c.sent();
                            if (country) {
                                countryConditions = [];
                                countryConditions.push({
                                    countryId: new mongoose_1.Types.ObjectId(countryId),
                                });
                                if (country.id) {
                                    countryConditions.push({ country_id: country.id });
                                }
                                countryCode = country.country_code || country.countryCode;
                                if (countryCode) {
                                    countryConditions.push({ country_code: countryCode });
                                }
                                if (countryConditions.length > 0) {
                                    countryFilter = { $or: countryConditions };
                                }
                            }
                            else {
                                console.log('[State Search] Country not found, returning empty results');
                                return [2 /*return*/, []];
                            }
                            return [3 /*break*/, 6];
                        case 5:
                            error_2 = _c.sent();
                            console.error('[State Search] Error fetching country:', error_2);
                            return [3 /*break*/, 6];
                        case 6:
                            query = {
                                stateName: new RegExp("^".concat(this.escapeRegex(searchTerm_1), "$"), 'i'),
                            };
                            if (countryFilter) {
                                query = { $and: [query, countryFilter] };
                            }
                            return [4 /*yield*/, this.stateModel
                                    .find(query)
                                    .sort({ stateName: 1 })
                                    .exec()];
                        case 7:
                            results = _c.sent();
                            if (!(results.length === 0)) return [3 /*break*/, 9];
                            // Try with name field (if it exists)
                            query = { name: new RegExp("^".concat(this.escapeRegex(searchTerm_1), "$"), 'i') };
                            if (countryFilter) {
                                query = { $and: [query, countryFilter] };
                            }
                            return [4 /*yield*/, this.stateModel.find(query).sort({ name: 1 }).exec()];
                        case 8:
                            results = _c.sent();
                            _c.label = 9;
                        case 9:
                            if (!(results.length === 0)) return [3 /*break*/, 11];
                            // Try with state_name field (snake_case)
                            query = {
                                state_name: new RegExp("^".concat(this.escapeRegex(searchTerm_1), "$"), 'i'),
                            };
                            if (countryFilter) {
                                query = { $and: [query, countryFilter] };
                            }
                            return [4 /*yield*/, this.stateModel
                                    .find(query)
                                    .sort({ state_name: 1 })
                                    .exec()];
                        case 10:
                            results = _c.sent();
                            _c.label = 11;
                        case 11:
                            if (results.length > 0) {
                                console.log('[State Search] Found', results.length, 'exact matches');
                                return [2 /*return*/, results];
                            }
                            escapedSearchTerm = this.escapeRegex(searchTerm_1);
                            partialRegex = new RegExp(escapedSearchTerm, 'i');
                            searchFields = [
                                { stateName: partialRegex },
                                { name: partialRegex },
                                { state_name: partialRegex },
                            ];
                            _i = 0, searchFields_1 = searchFields;
                            _c.label = 12;
                        case 12:
                            if (!(_i < searchFields_1.length)) return [3 /*break*/, 15];
                            fieldQuery = searchFields_1[_i];
                            query = fieldQuery;
                            if (countryFilter) {
                                query = { $and: [query, countryFilter] };
                            }
                            return [4 /*yield*/, this.stateModel
                                    .find(query)
                                    .sort({ stateName: 1 })
                                    .exec()];
                        case 13:
                            results = _c.sent();
                            if (results.length > 0) {
                                console.log('[State Search] Found', results.length, 'partial matches using field:', Object.keys(fieldQuery)[0]);
                                return [3 /*break*/, 15];
                            }
                            _c.label = 14;
                        case 14:
                            _i++;
                            return [3 /*break*/, 12];
                        case 15:
                            if (results.length > 0) {
                                console.log('[State Search] Found', results.length, 'partial matches');
                                return [2 /*return*/, results];
                            }
                            words = searchTerm_1.split(/\s+/).filter(function (w) { return w.length > 2; });
                            if (!(words.length > 0)) return [3 /*break*/, 19];
                            wordRegexes = words.map(function (word) { return new RegExp(_this.escapeRegex(word), 'i'); });
                            fieldNames_3 = ['stateName', 'name', 'state_name'];
                            _loop_1 = function (fieldName) {
                                var orConditions;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            orConditions = wordRegexes.map(function (regex) {
                                                var _a;
                                                return (_a = {},
                                                    _a[fieldName] = regex,
                                                    _a);
                                            });
                                            query = { $or: orConditions };
                                            if (countryFilter) {
                                                query = { $and: [query, countryFilter] };
                                            }
                                            return [4 /*yield*/, this_1.stateModel
                                                    .find(query)
                                                    .sort({ stateName: 1 })
                                                    .exec()];
                                        case 1:
                                            results = _d.sent();
                                            if (results.length > 0) {
                                                console.log('[State Search] Found', results.length, 'word-based matches using field:', fieldName);
                                                return [2 /*return*/, { value: results }];
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _a = 0, fieldNames_1 = fieldNames_3;
                            _c.label = 16;
                        case 16:
                            if (!(_a < fieldNames_1.length)) return [3 /*break*/, 19];
                            fieldName = fieldNames_1[_a];
                            return [5 /*yield**/, _loop_1(fieldName)];
                        case 17:
                            state_1 = _c.sent();
                            if (typeof state_1 === "object")
                                return [2 /*return*/, state_1.value];
                            _c.label = 18;
                        case 18:
                            _a++;
                            return [3 /*break*/, 16];
                        case 19:
                            variations = this.generateSearchVariations(searchTerm_1);
                            variationRegexes = variations.map(function (v) { return new RegExp(_this.escapeRegex(v), 'i'); });
                            fieldNames = ['stateName', 'name', 'state_name'];
                            _loop_2 = function (fieldName) {
                                var variationConditions;
                                return __generator(this, function (_e) {
                                    switch (_e.label) {
                                        case 0:
                                            variationConditions = variationRegexes.map(function (regex) {
                                                var _a;
                                                return (_a = {},
                                                    _a[fieldName] = regex,
                                                    _a);
                                            });
                                            query = { $or: variationConditions };
                                            if (countryFilter) {
                                                query = { $and: [query, countryFilter] };
                                            }
                                            return [4 /*yield*/, this_2.stateModel
                                                    .find(query)
                                                    .sort({ stateName: 1 })
                                                    .exec()];
                                        case 1:
                                            results = _e.sent();
                                            if (results.length > 0) {
                                                console.log('[State Search] Found', results.length, 'variation matches using field:', fieldName);
                                                return [2 /*return*/, "break"];
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            this_2 = this;
                            _b = 0, fieldNames_2 = fieldNames;
                            _c.label = 20;
                        case 20:
                            if (!(_b < fieldNames_2.length)) return [3 /*break*/, 23];
                            fieldName = fieldNames_2[_b];
                            return [5 /*yield**/, _loop_2(fieldName)];
                        case 21:
                            state_2 = _c.sent();
                            if (state_2 === "break")
                                return [3 /*break*/, 23];
                            _c.label = 22;
                        case 22:
                            _b++;
                            return [3 /*break*/, 20];
                        case 23:
                            if (results.length > 0) {
                                console.log('[State Search] Found', results.length, 'variation matches');
                                return [2 /*return*/, results];
                            }
                            return [4 /*yield*/, this.stateModel
                                    .find(countryFilter || {})
                                    .sort({ stateName: 1 })
                                    .exec()];
                        case 24:
                            allStates = _c.sent();
                            similarStates = allStates
                                .map(function (state) {
                                // Try multiple field names for similarity
                                var stateObj = state.toObject();
                                var stateNameValue = stateObj.stateName ||
                                    stateObj.name ||
                                    stateObj.state_name ||
                                    '';
                                var stateNameLower = stateNameValue.toLowerCase();
                                return {
                                    state: state,
                                    similarity: _this.calculateSimilarity(searchTerm_1.toLowerCase(), stateNameLower),
                                };
                            })
                                .filter(function (item) { return item.similarity > 0.6; }) // 60% similarity threshold
                                .sort(function (a, b) { return b.similarity - a.similarity; })
                                .slice(0, 10) // Top 10 most similar
                                .map(function (item) { return item.state; });
                            if (similarStates.length > 0) {
                                console.log('[State Search] Found', similarStates.length, 'similar matches');
                                return [2 /*return*/, similarStates];
                            }
                            console.log('[State Search] No matches found');
                            return [2 /*return*/, []];
                        case 25:
                            error_3 = _c.sent();
                            console.error('[State Search] Error:', error_3);
                            console.error('[State Search] Error stack:', error_3.stack);
                            throw error_3;
                        case 26: return [2 /*return*/];
                    }
                });
            });
        };
        StatesService_1.prototype.escapeRegex = function (str) {
            return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };
        StatesService_1.prototype.generateSearchVariations = function (term) {
            var variations = [];
            var lowerTerm = term.toLowerCase();
            // Add original
            variations.push(term);
            // Remove common suffixes
            var suffixes = ['state', 'states', 'province', 'region'];
            for (var _i = 0, suffixes_1 = suffixes; _i < suffixes_1.length; _i++) {
                var suffix = suffixes_1[_i];
                if (lowerTerm.endsWith(suffix)) {
                    variations.push(term.substring(0, term.length - suffix.length).trim());
                }
            }
            // Handle common typos/variations for specific terms
            var commonVariations = {
                telangana: ['telengana', 'telengana', 'telangana'],
                maharashtra: ['maharasthra', 'maharastra'],
                karnataka: ['karnatka', 'karnatak'],
                'tamil nadu': ['tamilnadu', 'tamil nadu'],
                'west bengal': ['westbengal', 'west bengal'],
                'uttar pradesh': ['uttarpradesh', 'up'],
                'andhra pradesh': ['andhrapradesh', 'ap'],
            };
            if (commonVariations[lowerTerm]) {
                variations.push.apply(variations, commonVariations[lowerTerm]);
            }
            return __spreadArray([], new Set(variations), true); // Remove duplicates
        };
        StatesService_1.prototype.calculateSimilarity = function (str1, str2) {
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
                console.error('[State Search] Similarity calculation error:', error);
                return 0;
            }
        };
        return StatesService_1;
    }());
    __setFunctionName(_classThis, "StatesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StatesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StatesService = _classThis;
}();
exports.StatesService = StatesService;
