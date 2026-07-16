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
exports.SummitsService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var summit_constants_1 = require("./constants/summit.constants");
var summit_mapper_util_1 = require("./utils/summit-mapper.util");
var summit_slug_util_1 = require("./utils/summit-slug.util");
var summit_sanitize_util_1 = require("./utils/summit-sanitize.util");
var summit_speaker_util_1 = require("./utils/summit-speaker.util");
var summit_payload_normalize_util_1 = require("./utils/summit-payload-normalize.util");
var upload_file_util_1 = require("../utils/upload-file.util");
var summit_section_visibility_util_1 = require("./utils/summit-section-visibility.util");
var summit_status_util_1 = require("./utils/summit-status.util");
var summit_year_util_1 = require("./utils/summit-year.util");
var summit_basic_payload_util_1 = require("./utils/summit-basic-payload.util");
var summit_cms_sections_util_1 = require("./utils/summit-cms-sections.util");
var SummitsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SummitsService = _classThis = /** @class */ (function () {
        function SummitsService_1(summitModel) {
            this.summitModel = summitModel;
        }
        /**
         * Public website listing — only active summits (legacy `published` included).
         */
        SummitsService_1.prototype.listPublic = function (query, origin) {
            return __awaiter(this, void 0, void 0, function () {
                var page, limit, skip, filter, _a, rows, total, items;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            page = (_b = query.page) !== null && _b !== void 0 ? _b : 1;
                            limit = (_c = query.limit) !== null && _c !== void 0 ? _c : 12;
                            skip = (page - 1) * limit;
                            filter = this.buildPublicListFilter(query);
                            return [4 /*yield*/, Promise.all([
                                    this.summitModel
                                        .find(filter)
                                        .sort({ date: -1, updatedAt: -1 })
                                        .skip(skip)
                                        .limit(limit)
                                        .lean()
                                        .exec(),
                                    this.summitModel.countDocuments(filter).exec(),
                                ])];
                        case 1:
                            _a = _d.sent(), rows = _a[0], total = _a[1];
                            items = rows.map(function (row, index) {
                                return (0, summit_mapper_util_1.mapSummitToPublicListItem)(row, {
                                    s_no: skip + index + 1,
                                    origin: origin,
                                });
                            });
                            return [2 /*return*/, {
                                    items: items,
                                    total: total,
                                    page: page,
                                    limit: limit,
                                    totalPages: Math.ceil(total / limit) || 1,
                                }];
                    }
                });
            });
        };
        /** Response envelope for website controllers (matches events list shape). */
        SummitsService_1.prototype.buildPublicListResponse = function (query, origin) {
            var result = this.listPublic(query, origin);
            return result.then(function (result) { return ({
                message: 'Summits retrieved successfully',
                data: result.items,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    perPage: result.limit,
                    total: result.total,
                    totalPages: result.totalPages,
                },
            }); });
        };
        SummitsService_1.prototype.buildPublicListFilter = function (query) {
            var _a, _b;
            var clauses = [
                {
                    $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
                },
                (0, summit_status_util_1.summitStatusDbMatch)('active'),
            ];
            if ((_a = query.year) === null || _a === void 0 ? void 0 : _a.trim()) {
                clauses.push({ year: query.year.trim() });
            }
            if ((_b = query.search) === null || _b === void 0 ? void 0 : _b.trim()) {
                var regex = new RegExp(query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                clauses.push({
                    $or: [{ title: regex }, { slug: regex }, { location: regex }],
                });
            }
            return { $and: clauses };
        };
        SummitsService_1.prototype.list = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var page, limit, skip, filter, sort, _a, rows, total, items;
                var _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            page = (_b = query.page) !== null && _b !== void 0 ? _b : 1;
                            limit = (_c = query.limit) !== null && _c !== void 0 ? _c : 20;
                            skip = (page - 1) * limit;
                            filter = this.buildListFilter(query);
                            sort = this.resolveListSort((_d = query.sort) !== null && _d !== void 0 ? _d : 'updated_at_desc');
                            return [4 /*yield*/, Promise.all([
                                    this.summitModel
                                        .find(filter)
                                        .sort(sort)
                                        .skip(skip)
                                        .limit(limit)
                                        .lean()
                                        .exec(),
                                    this.summitModel.countDocuments(filter).exec(),
                                ])];
                        case 1:
                            _a = _e.sent(), rows = _a[0], total = _a[1];
                            items = rows.map(function (row) {
                                return (0, summit_mapper_util_1.mapSummitToListItem)(row);
                            });
                            return [2 /*return*/, {
                                    items: items,
                                    total: total,
                                    page: page,
                                    limit: limit,
                                    totalPages: Math.ceil(total / limit) || 1,
                                }];
                    }
                });
            });
        };
        SummitsService_1.prototype.buildListFilter = function (query) {
            var _a, _b;
            var clauses = [
                {
                    $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
                },
            ];
            if (query.status) {
                clauses.push((0, summit_status_util_1.summitStatusDbMatch)(query.status));
            }
            if ((_a = query.year) === null || _a === void 0 ? void 0 : _a.trim()) {
                clauses.push({ year: query.year.trim() });
            }
            if ((_b = query.search) === null || _b === void 0 ? void 0 : _b.trim()) {
                var regex = new RegExp(query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                clauses.push({
                    $or: [{ title: regex }, { slug: regex }, { location: regex }],
                });
            }
            return clauses.length === 1 ? clauses[0] : { $and: clauses };
        };
        SummitsService_1.prototype.getFormMeta = function (excludeSummitId) {
            return __awaiter(this, void 0, void 0, function () {
                var filter, exclude, rows, occupiedYears;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filter = { deletedAt: null };
                            exclude = String(excludeSummitId !== null && excludeSummitId !== void 0 ? excludeSummitId : '').trim();
                            if (exclude && mongoose_1.Types.ObjectId.isValid(exclude)) {
                                filter._id = { $ne: new mongoose_1.Types.ObjectId(exclude) };
                            }
                            return [4 /*yield*/, this.summitModel.find(filter).select('year').lean().exec()];
                        case 1:
                            rows = _a.sent();
                            occupiedYears = __spreadArray([], new Set(rows
                                .map(function (row) { var _a; return String((_a = row.year) !== null && _a !== void 0 ? _a : '').trim(); })
                                .filter(Boolean)), true);
                            return [2 /*return*/, {
                                    years: (0, summit_year_util_1.getSummitYearOptions)(),
                                    occupiedYears: occupiedYears,
                                    statuses: [
                                        { value: 'active', label: 'Active' },
                                        { value: 'inactive', label: 'Inactive' },
                                    ],
                                }];
                    }
                });
            });
        };
        SummitsService_1.prototype.findById = function (id, options) {
            return __awaiter(this, void 0, void 0, function () {
                var doc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findDocumentById(id, options)];
                        case 1:
                            doc = _a.sent();
                            return [2 /*return*/, (0, summit_section_visibility_util_1.buildSummitViewPayload)((0, summit_mapper_util_1.mapSummitToApi)(doc))];
                    }
                });
            });
        };
        SummitsService_1.prototype.findPublishedBySlug = function (slug, origin) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.findBySlug(slug, { origin: origin, activeOnly: true })];
                });
            });
        };
        /** Admin / draft preview — includes inactive summits. */
        SummitsService_1.prototype.findBySlugForPreview = function (slug, origin) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.findBySlug(slug, { origin: origin, activeOnly: false })];
                });
            });
        };
        SummitsService_1.prototype.findBySlug = function (slug, options) {
            return __awaiter(this, void 0, void 0, function () {
                var normalized, filter, doc, payload;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            normalized = (0, summit_slug_util_1.slugifySummitInput)(slug);
                            if (!normalized || normalized === 'list' || normalized === 'preview') {
                                throw new common_1.NotFoundException('Summit not found');
                            }
                            filter = {
                                slug: normalized,
                                deletedAt: null,
                            };
                            if ((options === null || options === void 0 ? void 0 : options.activeOnly) !== false) {
                                filter.status = { $in: ['active', 'published'] };
                            }
                            return [4 /*yield*/, this.summitModel.findOne(filter).exec()];
                        case 1:
                            doc = _a.sent();
                            if (!doc) {
                                throw new common_1.NotFoundException('Summit not found');
                            }
                            payload = (0, summit_section_visibility_util_1.buildSummitViewPayload)((0, summit_mapper_util_1.mapSummitToApi)(doc));
                            if (options === null || options === void 0 ? void 0 : options.origin) {
                                return [2 /*return*/, this.applyPublicAssetUrls(payload, options.origin)];
                            }
                            return [2 /*return*/, payload];
                    }
                });
            });
        };
        SummitsService_1.prototype.applyPublicAssetUrls = function (payload, origin) {
            var _a;
            var summit = payload;
            if (Array.isArray(summit.banners)) {
                summit.banners = summit.banners.map(function (b) { return (__assign(__assign({}, b), { imageUrl: (0, summit_mapper_util_1.normalizeSummitAssetUrl)(b.imageUrl, origin) })); });
            }
            if (summit.coverImageUrl) {
                summit.coverImageUrl =
                    (0, summit_mapper_util_1.normalizeSummitAssetUrl)(summit.coverImageUrl, origin) || null;
            }
            else if (Array.isArray(summit.banners) && ((_a = summit.banners[0]) === null || _a === void 0 ? void 0 : _a.imageUrl)) {
                summit.coverImageUrl = summit.banners[0].imageUrl || null;
            }
            if (Array.isArray(summit.speakers)) {
                summit.speakers = summit.speakers.map(function (s) {
                    var imageUrl = (0, summit_mapper_util_1.normalizeSummitAssetUrl)(s.imageUrl, origin);
                    return __assign(__assign({}, s), { imageUrl: imageUrl, image: imageUrl });
                });
            }
            if (Array.isArray(summit.sponsors)) {
                summit.sponsors = summit.sponsors.map(function (s) { return (__assign(__assign({}, s), { logoUrl: (0, summit_mapper_util_1.normalizeSummitAssetUrl)(s.logoUrl, origin) })); });
            }
            if (Array.isArray(summit.industrialPdfs)) {
                summit.industrialPdfs = summit.industrialPdfs.map(function (p) { return (__assign(__assign({}, p), { fileUrl: (0, summit_mapper_util_1.normalizeSummitAssetUrl)(p.fileUrl, origin) })); });
            }
            if (Array.isArray(summit.buildingsPdfs)) {
                summit.buildingsPdfs = summit.buildingsPdfs.map(function (p) { return (__assign(__assign({}, p), { fileUrl: (0, summit_mapper_util_1.normalizeSummitAssetUrl)(p.fileUrl, origin) })); });
            }
            return payload;
        };
        SummitsService_1.prototype.create = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var title, year, slug, doc;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            title = dto.title.trim();
                            year = dto.year.trim();
                            return [4 /*yield*/, this.resolveUniqueSummitSlug((0, summit_slug_util_1.buildSummitSlug)(title, year))];
                        case 1:
                            slug = _e.sent();
                            if (!(0, summit_slug_util_1.isValidSummitSlug)(slug)) {
                                throw new common_1.BadRequestException({
                                    message: 'Invalid title',
                                    errors: {
                                        'basic.title': 'Title must produce a valid URL identifier (use letters and numbers)',
                                    },
                                });
                            }
                            return [4 /*yield*/, this.assertYearUnique(year)];
                        case 2:
                            _e.sent();
                            return [4 /*yield*/, this.summitModel.create({
                                    year: year,
                                    title: title,
                                    slug: slug,
                                    date: (_a = dto.date) !== null && _a !== void 0 ? _a : '',
                                    location: (_c = (_b = dto.location) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : '',
                                    status: (0, summit_status_util_1.normalizeSummitStatus)((_d = dto.status) !== null && _d !== void 0 ? _d : 'inactive'),
                                    banners: [],
                                    industrialPdfs: [],
                                    buildingsPdfs: [],
                                    aboutGreenPro: { title: 'About GreenPro', content: '' },
                                    aboutSummit: { title: "About ".concat(dto.title.trim()), content: '' },
                                    highlightsTitle: 'Highlights of GreenPro Summit',
                                    highlights: [],
                                    focusedAreaTitle: 'Focused Area',
                                    focusedAreas: [],
                                    areaPoints: [],
                                    eventOutcomesTitle: 'Event Outcomes',
                                    eventOutcomes: [],
                                    speakers: [],
                                    agendaTitle: "GreenPro's Core Agenda",
                                    agendaPoints: [],
                                    agenda: { title: "GreenPro's Core Agenda", content: '' },
                                    sponsorsTitle: 'Our Sponsors & Partners',
                                    sponsors: [],
                                    deletedAt: null,
                                })];
                        case 3:
                            doc = _e.sent();
                            return [2 /*return*/, (0, summit_section_visibility_util_1.buildSummitViewPayload)((0, summit_mapper_util_1.mapSummitToApi)(doc))];
                    }
                });
            });
        };
        SummitsService_1.prototype.updateFull = function (id, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var doc, basicPatch, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.findDocumentById(id)];
                        case 1:
                            doc = _b.sent();
                            this.applyFullPayload(doc, payload);
                            return [4 /*yield*/, this.validateForActiveIfNeeded(doc)];
                        case 2:
                            _b.sent();
                            basicPatch = (0, summit_basic_payload_util_1.normalizeSummitBasicInput)(payload);
                            if (!((basicPatch === null || basicPatch === void 0 ? void 0 : basicPatch.title) !== undefined ||
                                (basicPatch === null || basicPatch === void 0 ? void 0 : basicPatch.year) !== undefined)) return [3 /*break*/, 4];
                            _a = doc;
                            return [4 /*yield*/, this.resolveUniqueSummitSlug(doc.slug, doc._id)];
                        case 3:
                            _a.slug = _b.sent();
                            doc.markModified('slug');
                            _b.label = 4;
                        case 4:
                            if (!((basicPatch === null || basicPatch === void 0 ? void 0 : basicPatch.year) !== undefined)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.assertYearUnique(doc.year, doc._id)];
                        case 5:
                            _b.sent();
                            _b.label = 6;
                        case 6: return [4 /*yield*/, doc.save()];
                        case 7:
                            _b.sent();
                            return [2 /*return*/, (0, summit_section_visibility_util_1.buildSummitViewPayload)((0, summit_mapper_util_1.mapSummitToApi)(doc))];
                    }
                });
            });
        };
        SummitsService_1.prototype.updateSection = function (id, section, body) {
            return __awaiter(this, void 0, void 0, function () {
                var doc, updatedAt, _a, basicPatch, _b, _c, title, items, _d, title, cards, _e, title, items, _f, title, points, data;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0: return [4 /*yield*/, this.findDocumentById(id)];
                        case 1:
                            doc = _g.sent();
                            updatedAt = new Date();
                            _a = section;
                            switch (_a) {
                                case 'basic': return [3 /*break*/, 2];
                                case 'banners': return [3 /*break*/, 9];
                                case 'downloads': return [3 /*break*/, 10];
                                case 'about-greenpro': return [3 /*break*/, 11];
                                case 'about-summit': return [3 /*break*/, 12];
                                case 'highlights': return [3 /*break*/, 13];
                                case 'focused-area': return [3 /*break*/, 14];
                                case 'event-outcomes': return [3 /*break*/, 15];
                                case 'speakers': return [3 /*break*/, 16];
                                case 'agenda': return [3 /*break*/, 17];
                                case 'sponsors': return [3 /*break*/, 18];
                            }
                            return [3 /*break*/, 19];
                        case 2:
                            basicPatch = (0, summit_basic_payload_util_1.normalizeSummitBasicInput)(body);
                            if (!basicPatch) return [3 /*break*/, 8];
                            this.applyBasic(doc, basicPatch);
                            if (!(basicPatch.title !== undefined ||
                                basicPatch.year !== undefined)) return [3 /*break*/, 4];
                            _b = doc;
                            return [4 /*yield*/, this.resolveUniqueSummitSlug(doc.slug, doc._id)];
                        case 3:
                            _b.slug = _g.sent();
                            doc.markModified('slug');
                            _g.label = 4;
                        case 4:
                            if (!(basicPatch.year !== undefined)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.assertYearUnique(doc.year, doc._id)];
                        case 5:
                            _g.sent();
                            _g.label = 6;
                        case 6: return [4 /*yield*/, this.validateForActiveIfNeeded(doc)];
                        case 7:
                            _g.sent();
                            _g.label = 8;
                        case 8: return [3 /*break*/, 20];
                        case 9:
                            doc.banners = this.normalizeBanners(body.banners);
                            doc.markModified('banners');
                            return [3 /*break*/, 20];
                        case 10:
                            doc.industrialPdfs = this.normalizePdfs(body.industrialPdfs);
                            doc.buildingsPdfs = this.normalizePdfs(body.buildingsPdfs);
                            doc.markModified('industrialPdfs');
                            doc.markModified('buildingsPdfs');
                            return [3 /*break*/, 20];
                        case 11:
                            doc.aboutGreenPro = this.normalizeRichText(body);
                            return [3 /*break*/, 20];
                        case 12:
                            doc.aboutSummit = this.normalizeRichText(body);
                            return [3 /*break*/, 20];
                        case 13:
                            {
                                _c = (0, summit_cms_sections_util_1.normalizeHighlightsSection)(body), title = _c.title, items = _c.items;
                                doc.highlightsTitle = title;
                                doc.highlights = items;
                                doc.markModified('highlights');
                                return [3 /*break*/, 20];
                            }
                            _g.label = 14;
                        case 14:
                            {
                                _d = (0, summit_cms_sections_util_1.normalizeFocusedAreaSection)(body), title = _d.title, cards = _d.cards;
                                doc.focusedAreaTitle = title;
                                doc.focusedAreas = cards;
                                doc.areaPoints = [];
                                doc.markModified('focusedAreas');
                                doc.markModified('areaPoints');
                                return [3 /*break*/, 20];
                            }
                            _g.label = 15;
                        case 15:
                            {
                                _e = (0, summit_cms_sections_util_1.normalizeEventOutcomesSection)(body), title = _e.title, items = _e.items;
                                doc.eventOutcomesTitle = title;
                                doc.eventOutcomes = items;
                                doc.markModified('eventOutcomes');
                                return [3 /*break*/, 20];
                            }
                            _g.label = 16;
                        case 16:
                            doc.speakers = this.normalizeSpeakers(body.speakers);
                            return [3 /*break*/, 20];
                        case 17:
                            {
                                _f = (0, summit_cms_sections_util_1.normalizeAgendaSectionInput)(body), title = _f.title, points = _f.points;
                                doc.agendaTitle = title;
                                doc.agendaPoints = points;
                                doc.agenda = { title: title, content: '' };
                                doc.markModified('agendaPoints');
                                doc.markModified('agenda');
                                return [3 /*break*/, 20];
                            }
                            _g.label = 18;
                        case 18:
                            if (typeof body.sponsorsTitle === 'string') {
                                doc.sponsorsTitle = body.sponsorsTitle;
                            }
                            doc.sponsors = this.normalizeSponsors(body.sponsors);
                            return [3 /*break*/, 20];
                        case 19: throw new common_1.BadRequestException("Unknown section: ".concat(section));
                        case 20:
                            doc.updatedAt = updatedAt;
                            return [4 /*yield*/, doc.save()];
                        case 21:
                            _g.sent();
                            data = (0, summit_section_visibility_util_1.buildSummitViewPayload)((0, summit_mapper_util_1.mapSummitToApi)(doc));
                            return [2 /*return*/, {
                                    section: section,
                                    data: data,
                                    updatedAt: doc.updatedAt.toISOString(),
                                }];
                    }
                });
            });
        };
        SummitsService_1.prototype.updateStatus = function (id, status) {
            return __awaiter(this, void 0, void 0, function () {
                var doc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findDocumentById(id)];
                        case 1:
                            doc = _a.sent();
                            doc.status = (0, summit_status_util_1.normalizeSummitStatus)(status);
                            if (!(doc.status === 'active')) return [3 /*break*/, 3];
                            this.assertActivatable(doc);
                            return [4 /*yield*/, this.refreshSummitSlug(doc)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [4 /*yield*/, doc.save()];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, (0, summit_section_visibility_util_1.buildSummitViewPayload)((0, summit_mapper_util_1.mapSummitToApi)(doc))];
                    }
                });
            });
        };
        SummitsService_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var doc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findDocumentById(id)];
                        case 1:
                            doc = _a.sent();
                            doc.deletedAt = new Date();
                            return [4 /*yield*/, doc.save()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { id: doc._id.toString() }];
                    }
                });
            });
        };
        SummitsService_1.prototype.uploadAsset = function (id, type, file, itemId) {
            return __awaiter(this, void 0, void 0, function () {
                var isPdf, maxSize, subfolder, uploaded;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!summit_constants_1.SUMMIT_UPLOAD_TYPES.includes(type)) {
                                throw new common_1.BadRequestException('Invalid upload type');
                            }
                            return [4 /*yield*/, this.findDocumentById(id)];
                        case 1:
                            _a.sent();
                            isPdf = type === 'pdf_industrial' || type === 'pdf_buildings';
                            maxSize = isPdf ? summit_constants_1.SUMMIT_PDF_MAX_BYTES : summit_constants_1.SUMMIT_IMAGE_MAX_BYTES;
                            if (file.size > maxSize) {
                                throw new common_1.PayloadTooLargeException(isPdf ? 'PDF must be 10MB or smaller' : 'Image must be 5MB or smaller');
                            }
                            subfolder = type === 'pdf_industrial'
                                ? 'pdfs/industrial'
                                : type === 'pdf_buildings'
                                    ? 'pdfs/buildings'
                                    : "".concat(type, "s");
                            return [4 /*yield*/, (0, upload_file_util_1.uploadFile)(file, "summits/".concat(id, "/").concat(subfolder))];
                        case 2:
                            uploaded = _a.sent();
                            return [2 /*return*/, {
                                    type: type,
                                    itemId: itemId !== null && itemId !== void 0 ? itemId : null,
                                    url: uploaded.fileUrl,
                                    fileName: uploaded.fileName,
                                }];
                    }
                });
            });
        };
        SummitsService_1.isValidSection = function (section) {
            return summit_constants_1.SUMMIT_SECTION_KEYS.includes(section);
        };
        SummitsService_1.prototype.resolveListSort = function (sort) {
            switch (sort) {
                case 'updated_at_asc':
                    return { updatedAt: 1 };
                case 'created_at_desc':
                    return { createdAt: -1 };
                case 'date_desc':
                    return { date: -1, updatedAt: -1 };
                default:
                    return { updatedAt: -1 };
            }
        };
        SummitsService_1.prototype.findDocumentById = function (id, options) {
            return __awaiter(this, void 0, void 0, function () {
                var filter, doc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                                throw new common_1.NotFoundException('Summit not found');
                            }
                            filter = {
                                _id: new mongoose_1.Types.ObjectId(id),
                                deletedAt: null,
                            };
                            if (options === null || options === void 0 ? void 0 : options.activeOnly) {
                                filter.status = { $in: ['active', 'published'] };
                            }
                            return [4 /*yield*/, this.summitModel.findOne(filter).exec()];
                        case 1:
                            doc = _a.sent();
                            if (!doc) {
                                throw new common_1.NotFoundException('Summit not found');
                            }
                            return [2 /*return*/, doc];
                    }
                });
            });
        };
        /** One summit per calendar year (non-deleted documents). */
        SummitsService_1.prototype.assertYearUnique = function (year, excludeId) {
            return __awaiter(this, void 0, void 0, function () {
                var normalized, filter, existing;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            normalized = String(year !== null && year !== void 0 ? year : '').trim();
                            if (!normalized)
                                return [2 /*return*/];
                            filter = {
                                year: normalized,
                                deletedAt: null,
                            };
                            if (excludeId) {
                                filter._id = { $ne: excludeId };
                            }
                            return [4 /*yield*/, this.summitModel.findOne(filter).select('_id').lean().exec()];
                        case 1:
                            existing = _a.sent();
                            if (existing) {
                                throw new common_1.ConflictException({
                                    message: 'Summit year already exists',
                                    errors: {
                                        'basic.year': "A summit for year ".concat(normalized, " already exists"),
                                    },
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        SummitsService_1.prototype.applyFullPayload = function (doc, payload) {
            var _a, _b, _c;
            var basicPatch = (0, summit_basic_payload_util_1.normalizeSummitBasicInput)(payload);
            if (basicPatch) {
                this.applyBasic(doc, basicPatch);
            }
            if (payload.banners !== undefined) {
                doc.banners = this.normalizeBanners(payload.banners);
            }
            if (payload.industrialPdfs !== undefined) {
                doc.industrialPdfs = this.normalizePdfs(payload.industrialPdfs);
                doc.markModified('industrialPdfs');
            }
            if (payload.buildingsPdfs !== undefined) {
                doc.buildingsPdfs = this.normalizePdfs(payload.buildingsPdfs);
                doc.markModified('buildingsPdfs');
            }
            if (payload.aboutGreenPro !== undefined) {
                doc.aboutGreenPro = this.normalizeRichText(payload.aboutGreenPro);
            }
            if (payload.aboutSummit !== undefined) {
                doc.aboutSummit = this.normalizeRichText(payload.aboutSummit);
            }
            if (payload.highlightsTitle !== undefined ||
                payload.highlights !== undefined) {
                var _d = (0, summit_cms_sections_util_1.normalizeHighlightsSection)({
                    highlightsTitle: payload.highlightsTitle !== undefined
                        ? payload.highlightsTitle
                        : doc.highlightsTitle,
                    highlights: payload.highlights !== undefined
                        ? payload.highlights
                        : doc.highlights,
                }), title = _d.title, items = _d.items;
                doc.highlightsTitle = title;
                doc.highlights = items;
            }
            if (payload.focusedAreaTitle !== undefined ||
                payload.focusedAreas !== undefined ||
                payload.areaPoints !== undefined) {
                var focusedBody = {
                    focusedAreaTitle: payload.focusedAreaTitle !== undefined
                        ? payload.focusedAreaTitle
                        : doc.focusedAreaTitle,
                };
                if (payload.focusedAreas !== undefined) {
                    focusedBody.focusedAreas = payload.focusedAreas;
                }
                else if (payload.areaPoints !== undefined) {
                    focusedBody.areaPoints = payload.areaPoints;
                }
                else if (((_a = doc.focusedAreas) !== null && _a !== void 0 ? _a : []).length > 0) {
                    focusedBody.focusedAreas = doc.focusedAreas;
                }
                else {
                    focusedBody.areaPoints = doc.areaPoints;
                }
                var _e = (0, summit_cms_sections_util_1.normalizeFocusedAreaSection)(focusedBody), title = _e.title, cards = _e.cards;
                doc.focusedAreaTitle = title;
                doc.focusedAreas = cards;
                doc.areaPoints = [];
            }
            if (payload.eventOutcomesTitle !== undefined ||
                payload.eventOutcomes !== undefined) {
                var _f = (0, summit_cms_sections_util_1.normalizeEventOutcomesSection)({
                    eventOutcomesTitle: payload.eventOutcomesTitle !== undefined
                        ? payload.eventOutcomesTitle
                        : doc.eventOutcomesTitle,
                    eventOutcomes: payload.eventOutcomes !== undefined
                        ? payload.eventOutcomes
                        : doc.eventOutcomes,
                }), title = _f.title, items = _f.items;
                doc.eventOutcomesTitle = title;
                doc.eventOutcomes = items;
            }
            if (payload.agendaTitle !== undefined ||
                payload.agendaPoints !== undefined ||
                payload.agenda !== undefined) {
                var _g = (0, summit_cms_sections_util_1.normalizeAgendaSectionInput)({
                    agendaTitle: payload.agendaTitle !== undefined
                        ? payload.agendaTitle
                        : (_c = (_b = payload.agenda) === null || _b === void 0 ? void 0 : _b.title) !== null && _c !== void 0 ? _c : doc.agendaTitle,
                    agendaPoints: payload.agendaPoints !== undefined
                        ? payload.agendaPoints
                        : doc.agendaPoints,
                    agenda: payload.agenda,
                }), title = _g.title, points = _g.points;
                doc.agendaTitle = title;
                doc.agendaPoints = points;
                doc.agenda = { title: title, content: '' };
            }
            if (payload.speakers !== undefined) {
                doc.speakers = this.normalizeSpeakers(payload.speakers);
            }
            if (payload.sponsorsTitle !== undefined) {
                doc.sponsorsTitle = payload.sponsorsTitle;
            }
            if (payload.sponsors !== undefined) {
                doc.sponsors = this.normalizeSponsors(payload.sponsors);
            }
        };
        SummitsService_1.prototype.applyBasic = function (doc, basic) {
            if (!basic)
                return;
            if (basic.year !== undefined) {
                doc.year = String(basic.year).trim();
                doc.markModified('year');
            }
            if (basic.title !== undefined) {
                doc.title = String(basic.title).trim();
                doc.markModified('title');
            }
            if (basic.title !== undefined || basic.year !== undefined) {
                this.assignSummitSlugFromTitleYear(doc);
            }
            if (basic.date !== undefined)
                doc.date = basic.date;
            if (basic.location !== undefined)
                doc.location = basic.location;
            if (basic.status !== undefined) {
                doc.status = (0, summit_status_util_1.normalizeSummitStatus)(basic.status);
                if (doc.status === 'active') {
                    this.assertActivatable(doc);
                }
            }
        };
        SummitsService_1.prototype.assignSummitSlugFromTitleYear = function (doc) {
            var _a;
            var title = String((_a = doc.title) !== null && _a !== void 0 ? _a : '').trim();
            var slug = (0, summit_slug_util_1.buildSummitSlug)(title, doc.year);
            if (!(0, summit_slug_util_1.isValidSummitSlug)(slug)) {
                throw new common_1.BadRequestException({
                    message: 'Invalid title',
                    errors: {
                        'basic.title': 'Title must produce a valid URL identifier (use letters and numbers)',
                    },
                });
            }
            doc.slug = slug;
            doc.markModified('slug');
        };
        SummitsService_1.prototype.refreshSummitSlug = function (doc) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.assignSummitSlugFromTitleYear(doc);
                            _a = doc;
                            return [4 /*yield*/, this.resolveUniqueSummitSlug(doc.slug, doc._id)];
                        case 1:
                            _a.slug = _b.sent();
                            doc.markModified('slug');
                            return [2 /*return*/];
                    }
                });
            });
        };
        SummitsService_1.prototype.resolveUniqueSummitSlug = function (preferredSlug, excludeId) {
            return __awaiter(this, void 0, void 0, function () {
                var candidate, suffix;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            candidate = preferredSlug;
                            suffix = 2;
                            _a.label = 1;
                        case 1: return [4 /*yield*/, this.isSlugAvailable(candidate, excludeId)];
                        case 2:
                            if (!!(_a.sent())) return [3 /*break*/, 3];
                            candidate = "".concat(preferredSlug, "-").concat(suffix);
                            suffix += 1;
                            if (suffix > 50) {
                                throw new common_1.ConflictException({
                                    message: 'Summit URL already exists',
                                    errors: {
                                        'basic.title': 'Unable to generate a unique summit URL. Change the title or year and try again.',
                                    },
                                });
                            }
                            return [3 /*break*/, 1];
                        case 3: return [2 /*return*/, candidate];
                    }
                });
            });
        };
        SummitsService_1.prototype.isSlugAvailable = function (slug, excludeId) {
            return __awaiter(this, void 0, void 0, function () {
                var filter, existing;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filter = {
                                slug: slug,
                                deletedAt: null,
                            };
                            if (excludeId) {
                                filter._id = { $ne: excludeId };
                            }
                            return [4 /*yield*/, this.summitModel
                                    .findOne(filter)
                                    .select('_id')
                                    .lean()
                                    .exec()];
                        case 1:
                            existing = _a.sent();
                            return [2 /*return*/, !existing];
                    }
                });
            });
        };
        SummitsService_1.prototype.normalizeBanners = function (raw) {
            return this.normalizeBannersAfterInput((0, summit_payload_normalize_util_1.normalizeSummitBannersInput)(raw));
        };
        SummitsService_1.prototype.normalizeBannersAfterInput = function (raw) {
            if (!Array.isArray(raw))
                return [];
            return raw.map(function (item, index) {
                var _a, _b;
                return ({
                    id: (0, summit_mapper_util_1.ensureSummitItemId)(item.id),
                    sortOrder: (_a = item.sortOrder) !== null && _a !== void 0 ? _a : index,
                    imageUrl: String((_b = item.imageUrl) !== null && _b !== void 0 ? _b : ''),
                });
            });
        };
        SummitsService_1.prototype.normalizePdfs = function (raw) {
            if (!Array.isArray(raw))
                return [];
            return raw.map(function (item, index) {
                var _a, _b, _c, _d;
                return ({
                    id: (0, summit_mapper_util_1.ensureSummitItemId)(item.id),
                    sortOrder: (_a = item.sortOrder) !== null && _a !== void 0 ? _a : index,
                    title: String((_b = item.title) !== null && _b !== void 0 ? _b : ''),
                    fileUrl: String((_c = item.fileUrl) !== null && _c !== void 0 ? _c : ''),
                    fileName: String((_d = item.fileName) !== null && _d !== void 0 ? _d : ''),
                });
            });
        };
        SummitsService_1.prototype.normalizeRichText = function (raw) {
            var _a;
            var o = (raw !== null && raw !== void 0 ? raw : {});
            return {
                title: String((_a = o.title) !== null && _a !== void 0 ? _a : ''),
                content: (0, summit_sanitize_util_1.sanitizeSummitHtml)(o.content),
            };
        };
        SummitsService_1.prototype.normalizeSpeakers = function (raw) {
            return this.normalizeSpeakersAfterInput((0, summit_payload_normalize_util_1.normalizeSummitSpeakersInput)(raw));
        };
        SummitsService_1.prototype.normalizeSpeakersAfterInput = function (raw) {
            if (!Array.isArray(raw))
                return [];
            return raw.map(function (item, index) {
                var _a, _b, _c, _d, _e;
                var _f = (0, summit_speaker_util_1.resolveSpeakerDesignationAndOrganisation)(item), designation = _f.designation, organisation = _f.organisation;
                return {
                    id: (0, summit_mapper_util_1.ensureSummitItemId)(item.id),
                    sortOrder: (_a = item.sortOrder) !== null && _a !== void 0 ? _a : index,
                    name: String((_b = item.name) !== null && _b !== void 0 ? _b : ''),
                    designation: designation,
                    organisation: organisation,
                    sub: String((_c = item.sub) !== null && _c !== void 0 ? _c : ''),
                    keyPoint: (0, summit_speaker_util_1.normalizeSpeakerKeyPoint)(item.keyPoint),
                    tags: (0, summit_speaker_util_1.normalizeSpeakerTags)(item.tags),
                    imageUrl: String((_e = (_d = item.imageUrl) !== null && _d !== void 0 ? _d : item.image) !== null && _e !== void 0 ? _e : ''),
                };
            });
        };
        SummitsService_1.prototype.normalizeSponsors = function (raw) {
            if (!Array.isArray(raw))
                return [];
            return raw.map(function (item, index) {
                var _a, _b, _c, _d;
                var tier = String((_a = item.tier) !== null && _a !== void 0 ? _a : 'Partner');
                if (!summit_constants_1.SUMMIT_SPONSOR_TIERS.includes(tier)) {
                    throw new common_1.UnprocessableEntityException({
                        message: 'Invalid sponsor tier',
                        errors: { tier: "Must be one of: ".concat(summit_constants_1.SUMMIT_SPONSOR_TIERS.join(', ')) },
                    });
                }
                return {
                    id: (0, summit_mapper_util_1.ensureSummitItemId)(item.id),
                    sortOrder: (_b = item.sortOrder) !== null && _b !== void 0 ? _b : index,
                    name: String((_c = item.name) !== null && _c !== void 0 ? _c : ''),
                    tier: tier,
                    logoUrl: String((_d = item.logoUrl) !== null && _d !== void 0 ? _d : ''),
                };
            });
        };
        SummitsService_1.prototype.validateForActiveIfNeeded = function (doc) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(0, summit_status_util_1.isSummitActiveStatus)(doc.status)) return [3 /*break*/, 2];
                            this.assertActivatable(doc);
                            return [4 /*yield*/, this.refreshSummitSlug(doc)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        SummitsService_1.prototype.assertActivatable = function (doc) {
            var _a, _b, _c;
            var errors = {};
            if (!((_a = doc.title) === null || _a === void 0 ? void 0 : _a.trim())) {
                errors['basic.title'] = 'Title is required before activating';
            }
            if (!((_b = doc.date) === null || _b === void 0 ? void 0 : _b.trim()) || !/^\d{4}-\d{2}-\d{2}$/.test(doc.date)) {
                errors['basic.date'] = 'Valid date (YYYY-MM-DD) is required before activating';
            }
            if (!((_c = doc.year) === null || _c === void 0 ? void 0 : _c.trim()) || !/^(19|20)\d{2}$/.test(doc.year)) {
                errors['basic.year'] = 'Valid year is required before activating';
            }
            if (Object.keys(errors).length > 0) {
                throw new common_1.BadRequestException({
                    message: 'Summit cannot be activated',
                    errors: errors,
                });
            }
        };
        return SummitsService_1;
    }());
    __setFunctionName(_classThis, "SummitsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SummitsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SummitsService = _classThis;
}();
exports.SummitsService = SummitsService;
