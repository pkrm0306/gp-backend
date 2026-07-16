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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteService = void 0;
var common_1 = require("@nestjs/common");
var crypto = require("crypto");
var fs_1 = require("fs");
var path_1 = require("path");
var mongoose_1 = require("mongoose");
var normalize_phone_with_country_code_util_1 = require("../common/utils/normalize-phone-with-country-code.util");
var public_website_manufacturer_visibility_filter_1 = require("../manufacturers/constants/public-website-manufacturer-visibility.filter");
var website_public_product_filter_1 = require("../product-registration/constants/website-public-product.filter");
var upload_file_util_1 = require("../utils/upload-file.util");
var newsletter_subscribers_query_util_1 = require("./utils/newsletter-subscribers-query.util");
function buildSubscribedFor(dto) {
    var prefs = [];
    if (dto.greenProducts)
        prefs.push('Green Products');
    if (dto.events)
        prefs.push('Events');
    if (prefs.length === 0)
        prefs.push('Newsletter');
    return prefs;
}
/** Same label shown in admin Subscribers list and in confirmation emails. */
function formatSubscribedForLabel(value) {
    if (Array.isArray(value)) {
        var parts = value.map(function (v) { return String(v !== null && v !== void 0 ? v : '').trim(); }).filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : 'Newsletter';
    }
    var asString = String(value !== null && value !== void 0 ? value : '').trim();
    return asString || 'Newsletter';
}
function formatDateYYYYMMDD(value) {
    var d = value instanceof Date ? value : value ? new Date(value) : new Date();
    if (Number.isNaN(d.getTime()))
        return new Date().toISOString().slice(0, 10);
    return d.toISOString().slice(0, 10);
}
function sanitizeWebsiteImagePath(raw) {
    var value = String(raw !== null && raw !== void 0 ? raw : '').trim();
    if (!value)
        return null;
    if (/^https?:\/\//i.test(value))
        return value;
    var normalized = value.startsWith('/') ? value : "/".concat(value);
    if (!normalized.startsWith('/uploads/'))
        return normalized;
    var rel = normalized.replace(/^\/uploads\//, '');
    if (!rel)
        return null;
    var safeRel = rel
        .split('/')
        .filter(Boolean)
        .map(function (segment) { return decodeURIComponent(segment); })
        .join('/');
    var absolute = (0, path_1.join)(process.cwd(), 'uploads', safeRel);
    return (0, fs_1.existsSync)(absolute) ? normalized : null;
}
var WebsiteService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var WebsiteService = _classThis = /** @class */ (function () {
        function WebsiteService_1(subscriberModel, contactMessageModel, eventModel, vendorUserModel, notificationModel, productModel, manufacturerModel, categoryModel, manufacturersService, adminService, galleryService, productRegistrationService, emailService, lifecycleNotification, adminSystemNotification, configService, redisService, websiteAnalytics) {
            this.subscriberModel = subscriberModel;
            this.contactMessageModel = contactMessageModel;
            this.eventModel = eventModel;
            this.vendorUserModel = vendorUserModel;
            this.notificationModel = notificationModel;
            this.productModel = productModel;
            this.manufacturerModel = manufacturerModel;
            this.categoryModel = categoryModel;
            this.manufacturersService = manufacturersService;
            this.adminService = adminService;
            this.galleryService = galleryService;
            this.productRegistrationService = productRegistrationService;
            this.emailService = emailService;
            this.lifecycleNotification = lifecycleNotification;
            this.adminSystemNotification = adminSystemNotification;
            this.configService = configService;
            this.redisService = redisService;
            this.websiteAnalytics = websiteAnalytics;
            this.logger = new common_1.Logger(WebsiteService.name);
        }
        WebsiteService_1.prototype.getWebsitePublicListCacheTtlSeconds = function () {
            var ttl = parseInt(this.configService.get('WEBSITE_PUBLIC_LIST_CACHE_TTL_SECONDS') ||
                this.configService.get('CACHE_TTL_SECONDS') ||
                '120', 10);
            return Number.isFinite(ttl) && ttl > 0 ? ttl : 120;
        };
        WebsiteService_1.prototype.stableJsonValue = function (value) {
            var _this = this;
            if (value === null || typeof value !== 'object') {
                return value;
            }
            if (Array.isArray(value)) {
                return value.map(function (v) { return _this.stableJsonValue(v); });
            }
            var obj = value;
            var out = {};
            for (var _i = 0, _a = Object.keys(obj).sort(); _i < _a.length; _i++) {
                var k = _a[_i];
                out[k] = this.stableJsonValue(obj[k]);
            }
            return out;
        };
        WebsiteService_1.prototype.stableJsonStringify = function (value) {
            return JSON.stringify(this.stableJsonValue(value));
        };
        /** Ignore empty paths and Swagger placeholder `"string"`. */
        WebsiteService_1.prototype.pickImagePath = function (raw) {
            var v = String(raw !== null && raw !== void 0 ? raw : '').trim();
            if (!v || v.toLowerCase() === 'string') {
                return null;
            }
            var resolved = (0, upload_file_util_1.resolveStoredUploadUrl)(v);
            return resolved || v;
        };
        WebsiteService_1.prototype.normalizeWebsiteImageUrl = function (raw, origin, kind) {
            if (kind === void 0) { kind = 'product'; }
            var v = this.pickImagePath(raw);
            if (!v) {
                return null;
            }
            if (/^https?:\/\//i.test(v)) {
                return v;
            }
            if (v.startsWith('/uploads/')) {
                return "".concat(origin).concat(v);
            }
            if (v.startsWith('uploads/')) {
                return "".concat(origin, "/").concat(v);
            }
            if (v.startsWith('/')) {
                return "".concat(origin).concat(v);
            }
            var folder = kind === 'category' ? 'categories' : 'products';
            var encoded = v
                .split('/')
                .filter(Boolean)
                .map(function (segment) { return encodeURIComponent(segment); })
                .join('/');
            return "".concat(origin, "/uploads/").concat(folder, "/").concat(encoded);
        };
        WebsiteService_1.prototype.mapCertifiedProductCardForWebsite = function (row, origin) {
            var _a, _b, _c, _d;
            var productOnly = this.pickImagePath((_b = (_a = row.productImageUrl) !== null && _a !== void 0 ? _a : row.productImage) !== null && _b !== void 0 ? _b : row.product_image);
            var categoryOnly = this.pickImagePath((_d = (_c = row.categoryImageUrl) !== null && _c !== void 0 ? _c : row.categoryImage) !== null && _d !== void 0 ? _d : row.category_image);
            var normalizedProductImage = productOnly
                ? this.normalizeWebsiteImageUrl(productOnly, origin, 'product')
                : null;
            var normalizedCategoryImage = this.normalizeWebsiteImageUrl(categoryOnly, origin, 'category');
            var cardImage = normalizedProductImage !== null && normalizedProductImage !== void 0 ? normalizedProductImage : normalizedCategoryImage;
            return __assign(__assign({}, row), { productImage: cardImage, productImageUrl: normalizedProductImage, categoryImage: categoryOnly, categoryImageUrl: normalizedCategoryImage });
        };
        WebsiteService_1.prototype.shortHash = function (input) {
            return crypto.createHash('sha256').update(input).digest('hex').slice(0, 40);
        };
        WebsiteService_1.prototype.buildManufacturersWebsiteCacheKey = function (query) {
            var _a, _b, _c, _d, _e;
            var normalized = {
                id: String(query.id || '').trim(),
                page: (_a = query.page) !== null && _a !== void 0 ? _a : 1,
                limit: (_b = query.limit) !== null && _b !== void 0 ? _b : 10,
                search: String(query.search || '').trim().toLowerCase(),
                manufacturerName: String(query.manufacturerName || '')
                    .trim()
                    .toLowerCase(),
                gpInternalId: String(query.gpInternalId || '').trim().toLowerCase(),
                manufacturerInitial: String(query.manufacturerInitial || '')
                    .trim()
                    .toLowerCase(),
                manufacturerStatus: (_c = query.manufacturerStatus) !== null && _c !== void 0 ? _c : null,
                vendor_status: (_d = query.vendor_status) !== null && _d !== void 0 ? _d : null,
                sortBy: (_e = query.sortBy) !== null && _e !== void 0 ? _e : 'createdAt',
                order: query.order === 'asc' ? 'asc' : 'desc',
            };
            return this.redisService.buildKey('website', 'public', 'manufacturers', 'with-certified-products', 'v4', this.shortHash(this.stableJsonStringify(normalized)));
        };
        WebsiteService_1.prototype.invalidateNewsletterSubscribersCache = function () {
            return __awaiter(this, void 0, void 0, function () {
                var key;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            key = this.redisService.buildKey('website', 'newsletter', 'subscribers');
                            return [4 /*yield*/, this.redisService.del(key).catch(function (error) {
                                    _this.logger.warn("Newsletter cache invalidation failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown'));
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Public manufacturers listing (Redis). */
        WebsiteService_1.prototype.getPublicManufacturersPaginated = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, error_1, result;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheKey = this.buildManufacturersWebsiteCacheKey(query);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _a.sent();
                            if (cached && typeof cached === 'object' && Array.isArray(cached.data)) {
                                return [2 /*return*/, cached];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            this.logger.warn("Website manufacturers cache read failed: ".concat((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4: return [4 /*yield*/, this.manufacturersService.findAllPaginatedForWebsitePublic(query)];
                        case 5:
                            result = _a.sent();
                            this.redisService
                                .set(cacheKey, result, this.getWebsitePublicListCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("Website manufacturers cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        /** Public banners with absolute image URLs (Redis). */
        WebsiteService_1.prototype.getPublicBannersNormalized = function (origin) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, error_2, rows, normalizeImageUrl, data, payload;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheKey = this.redisService.buildKey('website', 'public', 'banners', this.shortHash(origin));
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _a.sent();
                            if ((cached === null || cached === void 0 ? void 0 : cached.data) && Array.isArray(cached.data)) {
                                return [2 /*return*/, cached];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            this.logger.warn("Website banners cache read failed: ".concat((error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4: return [4 /*yield*/, this.adminService.listPublicBanners()];
                        case 5:
                            rows = _a.sent();
                            normalizeImageUrl = function (raw) {
                                var v = (raw !== null && raw !== void 0 ? raw : '').toString().trim();
                                if (!v)
                                    return v;
                                if (/^https?:\/\//i.test(v))
                                    return v;
                                if (v.startsWith('/uploads/'))
                                    return "".concat(origin).concat(v);
                                if (v.startsWith('uploads/'))
                                    return "".concat(origin, "/").concat(v);
                                return v;
                            };
                            data = rows.map(function (b) { return (__assign(__assign({}, b), { imageUrl: normalizeImageUrl(b.imageUrl) })); });
                            payload = { message: 'Banners retrieved successfully', data: data };
                            this.redisService
                                .set(cacheKey, payload, this.getWebsitePublicListCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("Website banners cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, payload];
                    }
                });
            });
        };
        /** Public paginated gallery for website (active only, default 50 per page). */
        WebsiteService_1.prototype.getPublicGalleryPaginated = function (query, origin) {
            return __awaiter(this, void 0, void 0, function () {
                var page, limit, cacheKey, cached, error_3, normalizeImageUrl, result, data, payload;
                var _this = this;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            page = (_a = query.page) !== null && _a !== void 0 ? _a : 1;
                            limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 50;
                            cacheKey = this.redisService.buildKey('website', 'public', 'gallery', String(page), String(limit), this.shortHash(origin));
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _d.sent();
                            if ((cached === null || cached === void 0 ? void 0 : cached.data) && Array.isArray(cached.data) && cached.pagination) {
                                return [2 /*return*/, cached];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_3 = _d.sent();
                            this.logger.warn("Website gallery cache read failed: ".concat((error_3 === null || error_3 === void 0 ? void 0 : error_3.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4:
                            normalizeImageUrl = function (raw) {
                                var v = String(raw !== null && raw !== void 0 ? raw : '').trim();
                                if (!v)
                                    return v;
                                if (/^https?:\/\//i.test(v))
                                    return v;
                                if (v.startsWith('/uploads/'))
                                    return "".concat(origin).concat(v);
                                if (v.startsWith('uploads/'))
                                    return "".concat(origin, "/").concat(v);
                                return v;
                            };
                            return [4 /*yield*/, this.galleryService.listGalleryPaginated(page, limit, {
                                    activeOnly: true,
                                })];
                        case 5:
                            result = _d.sent();
                            data = ((_c = result.data) !== null && _c !== void 0 ? _c : []).map(function (row) {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                                var images = Array.isArray(row.galleryImages)
                                    ? row.galleryImages
                                    : row.image
                                        ? [row.image]
                                        : [];
                                var normalizedImages = images.map(function (img) { return normalizeImageUrl(img); });
                                return {
                                    s_no: row.s_no,
                                    id: row.id,
                                    eventId: (_a = row.eventId) !== null && _a !== void 0 ? _a : row.galleryId,
                                    title: (_c = (_b = row.title) !== null && _b !== void 0 ? _b : row.eventName) !== null && _c !== void 0 ? _c : '',
                                    galleryType: (_d = row.galleryType) !== null && _d !== void 0 ? _d : '',
                                    description: (_f = (_e = row.description) !== null && _e !== void 0 ? _e : row.eventDescription) !== null && _f !== void 0 ? _f : '',
                                    date: (_g = row.date) !== null && _g !== void 0 ? _g : '',
                                    dateTime: (_h = row.dateTime) !== null && _h !== void 0 ? _h : '',
                                    image: (_j = normalizedImages[0]) !== null && _j !== void 0 ? _j : null,
                                    images: normalizedImages,
                                    event_image: normalizeImageUrl((_k = row.gallery_image) !== null && _k !== void 0 ? _k : row.event_image),
                                    is_active: (_l = row.is_active) !== null && _l !== void 0 ? _l : true,
                                };
                            });
                            payload = {
                                message: 'Gallery retrieved successfully',
                                pagination: __assign(__assign({}, result.pagination), { limit: result.pagination.perPage }),
                                data: data,
                            };
                            this.redisService
                                .set(cacheKey, payload, this.getWebsitePublicListCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("Website gallery cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, payload];
                    }
                });
            });
        };
        /** Public paginated events for website (active only, default 10 per page). */
        WebsiteService_1.prototype.getPublicEventsPaginated = function (query, origin) {
            return __awaiter(this, void 0, void 0, function () {
                var page, limit, cacheKey, cached, error_4, normalizeImageUrl, result, data, payload;
                var _this = this;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            page = (_a = query.page) !== null && _a !== void 0 ? _a : 1;
                            limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 10;
                            cacheKey = this.redisService.buildKey('website', 'public', 'events', 'v4', String(page), String(limit), this.shortHash(origin));
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _d.sent();
                            if ((cached === null || cached === void 0 ? void 0 : cached.data) && Array.isArray(cached.data) && cached.pagination) {
                                return [2 /*return*/, cached];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_4 = _d.sent();
                            this.logger.warn("Website events cache read failed: ".concat((error_4 === null || error_4 === void 0 ? void 0 : error_4.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4:
                            normalizeImageUrl = function (raw) {
                                var v = String(raw !== null && raw !== void 0 ? raw : '').trim();
                                if (!v)
                                    return v;
                                if (/^https?:\/\//i.test(v))
                                    return v;
                                if (v.startsWith('/uploads/'))
                                    return "".concat(origin).concat(v);
                                if (v.startsWith('uploads/'))
                                    return "".concat(origin, "/").concat(v);
                                return v;
                            };
                            return [4 /*yield*/, this.adminService.listEventsPaginated(page, limit, {
                                    activeOnly: true,
                                })];
                        case 5:
                            result = _d.sent();
                            data = ((_c = result.data) !== null && _c !== void 0 ? _c : []).map(function (row) { return (__assign(__assign({}, row), { image: normalizeImageUrl(row.image), event_image: normalizeImageUrl(row.event_image) })); });
                            payload = {
                                message: 'Events retrieved successfully',
                                pagination: result.pagination,
                                data: data,
                            };
                            this.redisService
                                .set(cacheKey, payload, this.getWebsitePublicListCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("Website events cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, payload];
                    }
                });
            });
        };
        /** Public active articles with absolute asset URLs (paginated, Redis). */
        WebsiteService_1.prototype.getPublicArticlesNormalized = function (query, origin) {
            return __awaiter(this, void 0, void 0, function () {
                var page, limit, cacheKey, cached, error_5, normalizeImageUrl, result, data, payload;
                var _this = this;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            page = (_a = query.page) !== null && _a !== void 0 ? _a : 1;
                            limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 12;
                            cacheKey = this.redisService.buildKey('website', 'public', 'articles', 'v2', String(page), String(limit), this.shortHash(origin));
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _d.sent();
                            if ((cached === null || cached === void 0 ? void 0 : cached.data) && Array.isArray(cached.data) && cached.pagination) {
                                return [2 /*return*/, cached];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_5 = _d.sent();
                            this.logger.warn("Website articles cache read failed: ".concat((error_5 === null || error_5 === void 0 ? void 0 : error_5.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4:
                            normalizeImageUrl = function (raw) {
                                var v = String(raw !== null && raw !== void 0 ? raw : '').trim();
                                if (!v)
                                    return v;
                                if (/^https?:\/\//i.test(v))
                                    return v;
                                if (v.startsWith('/uploads/'))
                                    return "".concat(origin).concat(v);
                                if (v.startsWith('uploads/'))
                                    return "".concat(origin, "/").concat(v);
                                return v;
                            };
                            return [4 /*yield*/, this.adminService.listArticlesPaginated(page, limit, {
                                    activeOnly: true,
                                })];
                        case 5:
                            result = _d.sent();
                            data = ((_c = result.data) !== null && _c !== void 0 ? _c : []).map(function (a) {
                                var _a, _b;
                                var externalUrl = a.externalUrl === true;
                                var shortDescription = String((_a = a.shortDescription) !== null && _a !== void 0 ? _a : '').trim();
                                var legacyShort = externalUrl && !shortDescription
                                    ? String((_b = a.description) !== null && _b !== void 0 ? _b : '').trim()
                                    : shortDescription;
                                return __assign(__assign({}, a), { description: externalUrl ? '' : a.description, shortDescription: legacyShort, image: normalizeImageUrl(a.image), article_image: normalizeImageUrl(a.article_image), pdf: normalizeImageUrl(a.pdf), article_pdf: normalizeImageUrl(a.article_pdf), is_active: true });
                            });
                            payload = {
                                message: 'Articles retrieved successfully',
                                pagination: result.pagination,
                                data: data,
                            };
                            this.redisService
                                .set(cacheKey, payload, this.getWebsitePublicListCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("Website articles cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, payload];
                    }
                });
            });
        };
        /** Filter options for public certified products page (categories + country/state tree). */
        WebsiteService_1.prototype.getPublicCertifiedProductsFilterOptions = function () {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, error_6, data, payload;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheKey = this.redisService.buildKey('website', 'public', 'certified-products', 'filter-options', 'v5');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _a.sent();
                            if (cached === null || cached === void 0 ? void 0 : cached.data) {
                                return [2 /*return*/, cached];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_6 = _a.sent();
                            this.logger.warn("Website certified filter-options cache read failed: ".concat((error_6 === null || error_6 === void 0 ? void 0 : error_6.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4: return [4 /*yield*/, this.productRegistrationService.getPublicCertifiedWebsiteFilterOptions()];
                        case 5:
                            data = _a.sent();
                            payload = {
                                message: 'Filter options retrieved successfully',
                                data: data,
                            };
                            this.redisService
                                .set(cacheKey, payload, this.getWebsitePublicListCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("Website certified filter-options cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, payload];
                    }
                });
            });
        };
        /** Typeahead suggestions for certified product search bar. */
        WebsiteService_1.prototype.searchPublicCertifiedProducts = function (q, limit, origin) {
            return __awaiter(this, void 0, void 0, function () {
                var rows;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.productRegistrationService.searchPublicCertifiedProducts(q, limit)];
                        case 1:
                            rows = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Product suggestions retrieved successfully',
                                    data: rows.map(function (row) {
                                        return _this.mapCertifiedProductCardForWebsite(row, origin);
                                    }),
                                }];
                    }
                });
            });
        };
        WebsiteService_1.prototype.hasPublicCertifiedProductsListFilter = function (dto) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            var search = String((_a = dto.search) !== null && _a !== void 0 ? _a : '').trim();
            if (search.length >= 2) {
                return true;
            }
            if (dto.productId) {
                return true;
            }
            var categoryIds = (_b = dto.categoryIds) !== null && _b !== void 0 ? _b : dto.category_ids;
            if (categoryIds && categoryIds.length > 0) {
                return true;
            }
            if (dto.categoryId) {
                return true;
            }
            if (dto.manufacturerId || ((_c = dto.manufacturerIds) === null || _c === void 0 ? void 0 : _c.length) || ((_d = dto.manufacturer_ids) === null || _d === void 0 ? void 0 : _d.length)) {
                return true;
            }
            if (((_e = dto.manufacturerNames) === null || _e === void 0 ? void 0 : _e.length) || ((_f = dto.manufacturer_names) === null || _f === void 0 ? void 0 : _f.length)) {
                return true;
            }
            if (dto.countryId) {
                return true;
            }
            var stateIds = (_g = dto.stateIds) !== null && _g !== void 0 ? _g : dto.state_ids;
            if (stateIds && stateIds.length > 0) {
                return true;
            }
            if (dto.stateId || dto.state_name) {
                return true;
            }
            if (dto.city) {
                return true;
            }
            if (dto.fromDate ||
                dto.toDate ||
                dto.from ||
                dto.to ||
                dto.validTillYear !== undefined ||
                ((_h = dto.validTillYears) === null || _h === void 0 ? void 0 : _h.length) ||
                ((_j = dto.valid_till_years) === null || _j === void 0 ? void 0 : _j.length)) {
                return true;
            }
            return false;
        };
        WebsiteService_1.prototype.toAdminListDtoFromPublicWebsite = function (dto) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            var categoryIds = (_b = (_a = dto.categoryIds) !== null && _a !== void 0 ? _a : dto.category_ids) !== null && _b !== void 0 ? _b : (dto.categoryId ? [dto.categoryId] : undefined);
            var manufacturerIds = (_d = (_c = dto.manufacturerIds) !== null && _c !== void 0 ? _c : dto.manufacturer_ids) !== null && _d !== void 0 ? _d : (dto.manufacturerId ? [dto.manufacturerId] : undefined);
            var stateIds = (_f = (_e = dto.stateIds) !== null && _e !== void 0 ? _e : dto.state_ids) !== null && _f !== void 0 ? _f : (dto.stateId ? [dto.stateId] : undefined);
            return __assign(__assign({}, dto), { categoryIds: categoryIds, manufacturerIds: manufacturerIds, stateIds: stateIds, countryId: dto.countryId, fromDate: (_g = dto.fromDate) !== null && _g !== void 0 ? _g : dto.from, toDate: (_h = dto.toDate) !== null && _h !== void 0 ? _h : dto.to, page: (_j = dto.page) !== null && _j !== void 0 ? _j : 1, limit: (_k = dto.limit) !== null && _k !== void 0 ? _k : 12, sortBy: (_l = dto.sortBy) !== null && _l !== void 0 ? _l : 'createdDate', sortOrder: (_m = dto.sortOrder) !== null && _m !== void 0 ? _m : 'desc' });
        };
        /**
         * Public certified product cards (flat list).
         * Returns empty until user applies search, category, location, or picks a product.
         */
        WebsiteService_1.prototype.listPublicCertifiedProductsForWebsite = function (dto, origin) {
            return __awaiter(this, void 0, void 0, function () {
                var page, limit, cacheKey, cached, error_7, adminDto, result, data, hasLocationFilter, message, payload;
                var _this = this;
                var _a, _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            page = (_a = dto.page) !== null && _a !== void 0 ? _a : 1;
                            limit = (_b = dto.limit) !== null && _b !== void 0 ? _b : 12;
                            if (!this.hasPublicCertifiedProductsListFilter(dto)) {
                                return [2 /*return*/, {
                                        message: 'Apply a search (min 2 characters), category, country/state, or select a product to view results',
                                        data: [],
                                        total: 0,
                                        page: page,
                                        limit: limit,
                                        totalPages: 0,
                                    }];
                            }
                            cacheKey = this.redisService.buildKey('website', 'public', 'certified-products', 'flat', 'v11', this.shortHash(this.stableJsonStringify(__assign(__assign({}, dto), { origin: origin }))));
                            _g.label = 1;
                        case 1:
                            _g.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _g.sent();
                            if (cached && Array.isArray(cached.data)) {
                                return [2 /*return*/, __assign(__assign({}, cached), { message: 'Certified products retrieved successfully' })];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_7 = _g.sent();
                            this.logger.warn("Website certified products flat cache read failed: ".concat((error_7 === null || error_7 === void 0 ? void 0 : error_7.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4:
                            adminDto = this.toAdminListDtoFromPublicWebsite(dto);
                            return [4 /*yield*/, this.productRegistrationService.listPublicCertifiedProductsFlat(adminDto, dto.productId)];
                        case 5:
                            result = _g.sent();
                            data = ((_c = result.data) !== null && _c !== void 0 ? _c : []).map(function (row) {
                                return _this.mapCertifiedProductCardForWebsite(row, origin);
                            });
                            hasLocationFilter = Boolean((_d = dto.countryId) !== null && _d !== void 0 ? _d : (_f = ((_e = dto.stateIds) !== null && _e !== void 0 ? _e : dto.state_ids)) === null || _f === void 0 ? void 0 : _f.length);
                            message = result.total === 0 && hasLocationFilter
                                ? 'No certified products found for the selected location'
                                : 'Certified products retrieved successfully';
                            payload = {
                                message: message,
                                data: data,
                                total: result.total,
                                page: result.page,
                                limit: result.limit,
                                totalPages: result.totalPages,
                            };
                            this.redisService
                                .set(cacheKey, payload, this.getWebsitePublicListCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("Website certified products flat cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, payload];
                    }
                });
            });
        };
        /** Public certified products (Redis; key from request body). */
        WebsiteService_1.prototype.getPublicCertifiedProducts = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, error_8, result;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheKey = this.redisService.buildKey('website', 'public', 'certified-products', this.shortHash(this.stableJsonStringify(__assign({}, dto))));
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _a.sent();
                            if (cached && typeof cached === 'object' && Array.isArray(cached.data)) {
                                return [2 /*return*/, __assign(__assign({}, cached), { message: 'Certified products retrieved successfully' })];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_8 = _a.sent();
                            this.logger.warn("Website certified products cache read failed: ".concat((error_8 === null || error_8 === void 0 ? void 0 : error_8.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4: return [4 /*yield*/, this.productRegistrationService.adminListProducts(__assign(__assign({}, dto), { status: [2], groupBy: 'urn' }))];
                        case 5:
                            result = _a.sent();
                            this.redisService
                                .set(cacheKey, result, this.getWebsitePublicListCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("Website certified products cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, __assign(__assign({}, result), { message: 'Certified products retrieved successfully' })];
                    }
                });
            });
        };
        WebsiteService_1.prototype.getPublicCertifiedProductPassport = function (productId, origin) {
            return __awaiter(this, void 0, void 0, function () {
                var normalizedProductId, data, resolvedOrigin, productImage, productImageUrl;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            normalizedProductId = String(productId !== null && productId !== void 0 ? productId : '').trim();
                            if (!normalizedProductId) {
                                throw new common_1.BadRequestException('productId is required');
                            }
                            return [4 /*yield*/, this.productRegistrationService.getPublicCertifiedProductPassport(normalizedProductId)];
                        case 1:
                            data = _c.sent();
                            resolvedOrigin = String(origin !== null && origin !== void 0 ? origin : '').trim();
                            if (!resolvedOrigin) {
                                return [2 /*return*/, {
                                        message: 'Certified product passport retrieved successfully',
                                        data: data,
                                    }];
                            }
                            productImage = this.pickImagePath((_a = data.productImageUrl) !== null && _a !== void 0 ? _a : data.productImage);
                            productImageUrl = productImage
                                ? this.normalizeWebsiteImageUrl(productImage, resolvedOrigin, 'product')
                                : null;
                            return [2 /*return*/, {
                                    message: 'Certified product passport retrieved successfully',
                                    data: __assign(__assign({}, data), { productImage: productImage, productImageUrl: (_b = productImageUrl !== null && productImageUrl !== void 0 ? productImageUrl : data.productImageUrl) !== null && _b !== void 0 ? _b : null }),
                                }];
                    }
                });
            });
        };
        /** Matches public website manufacturer visibility (see website `isPublicManufacturerWebsiteVisible`). */
        WebsiteService_1.prototype.matchPublicWebsiteManufacturerVisibility = function () {
            return (0, public_website_manufacturer_visibility_filter_1.matchPublicWebsiteManufacturerVisibility)();
        };
        WebsiteService_1.prototype.getPublicWebsiteStats = function () {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, error_9, productScope, _a, facetResult, productCategories, ecolabelledProducts, facet, payload;
                var _this = this;
                var _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            cacheKey = this.redisService.buildKey('website', 'public', 'stats', 'v7');
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _e.sent();
                            if (cached &&
                                typeof cached === 'object' &&
                                cached.data &&
                                Number.isFinite(Number(cached.data.companies)) &&
                                Number.isFinite(Number(cached.data.productCategories)) &&
                                Number.isFinite(Number(cached.data.ecolabelledProducts))) {
                                return [2 /*return*/, cached];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_9 = _e.sent();
                            this.logger.warn("Website stats cache read failed: ".concat((error_9 === null || error_9 === void 0 ? void 0 : error_9.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4:
                            productScope = (0, website_public_product_filter_1.matchWebsitePublicCertifiedProducts)({
                                manufacturerId: { $exists: true, $ne: null },
                                categoryId: { $exists: true, $ne: null },
                            });
                            return [4 /*yield*/, Promise.all([
                                    this.productModel
                                        .aggregate([
                                        { $match: productScope },
                                        {
                                            $lookup: {
                                                from: 'categories',
                                                localField: 'categoryId',
                                                foreignField: '_id',
                                                as: 'category',
                                            },
                                        },
                                        { $unwind: '$category' },
                                        { $match: { 'category.category_status': 1 } },
                                        {
                                            $lookup: {
                                                from: 'manufacturers',
                                                localField: 'manufacturerId',
                                                foreignField: '_id',
                                                as: 'manufacturer',
                                            },
                                        },
                                        { $unwind: '$manufacturer' },
                                        { $match: this.matchPublicWebsiteManufacturerVisibility() },
                                        {
                                            $facet: {
                                                companies: [
                                                    { $group: { _id: '$manufacturerId' } },
                                                    { $count: 'count' },
                                                ],
                                            },
                                        },
                                    ])
                                        .exec(),
                                    this.categoryModel.countDocuments({}).exec(),
                                    this.productModel
                                        .aggregate([
                                        { $match: (0, website_public_product_filter_1.matchWebsitePublicCertifiedProducts)() },
                                        {
                                            $lookup: {
                                                from: 'manufacturers',
                                                localField: 'manufacturerId',
                                                foreignField: '_id',
                                                as: 'manufacturer',
                                            },
                                        },
                                        { $unwind: '$manufacturer' },
                                        { $match: this.matchPublicWebsiteManufacturerVisibility() },
                                        { $count: 'count' },
                                    ])
                                        .exec()
                                        .then(function (rows) { var _a, _b; return (_b = (_a = rows[0]) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0; }),
                                ])];
                        case 5:
                            _a = _e.sent(), facetResult = _a[0], productCategories = _a[1], ecolabelledProducts = _a[2];
                            facet = (_b = facetResult[0]) !== null && _b !== void 0 ? _b : {
                                companies: [],
                            };
                            payload = {
                                message: 'Website stats retrieved successfully',
                                data: {
                                    companies: (_d = (_c = facet.companies[0]) === null || _c === void 0 ? void 0 : _c.count) !== null && _d !== void 0 ? _d : 0,
                                    productCategories: productCategories,
                                    ecolabelledProducts: ecolabelledProducts,
                                },
                            };
                            this.redisService
                                .set(cacheKey, payload, this.getWebsitePublicListCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("Website stats cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, payload];
                    }
                });
            });
        };
        WebsiteService_1.prototype.getManufacturersByCategoryPublic = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var id, cacheKey, cached, error_10, result;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            id = String((_a = dto.categoryId) !== null && _a !== void 0 ? _a : '').trim();
                            cacheKey = this.redisService.buildKey('website', 'public', 'manufacturers-by-category', 'v5', id);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _b.sent();
                            if (cached && typeof cached === 'object' && Array.isArray(cached.data)) {
                                return [2 /*return*/, __assign({ message: 'Manufacturers retrieved successfully' }, cached)];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_10 = _b.sent();
                            this.logger.warn("Website manufacturers-by-category cache read failed: ".concat((error_10 === null || error_10 === void 0 ? void 0 : error_10.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4: return [4 /*yield*/, this.productRegistrationService.getManufacturersByCategory(dto.categoryId)];
                        case 5:
                            result = _b.sent();
                            this.redisService
                                .set(cacheKey, result, this.getWebsitePublicListCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("Website manufacturers-by-category cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, __assign({ message: 'Manufacturers retrieved successfully' }, result)];
                    }
                });
            });
        };
        WebsiteService_1.prototype.getCategoriesByManufacturerPublic = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var id, cacheKey, cached, error_11, result;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            id = String((_a = dto.manufacturerId) !== null && _a !== void 0 ? _a : '').trim();
                            cacheKey = this.redisService.buildKey('website', 'public', 'categories-by-manufacturer', 'v3', id);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _b.sent();
                            if (cached && typeof cached === 'object' && Array.isArray(cached.data)) {
                                return [2 /*return*/, __assign({ message: 'Categories retrieved successfully' }, cached)];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_11 = _b.sent();
                            this.logger.warn("Website categories-by-manufacturer cache read failed: ".concat((error_11 === null || error_11 === void 0 ? void 0 : error_11.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4: return [4 /*yield*/, this.productRegistrationService.getCategoriesByManufacturer(dto.manufacturerId)];
                        case 5:
                            result = _b.sent();
                            this.redisService
                                .set(cacheKey, result, this.getWebsitePublicListCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("Website categories-by-manufacturer cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, __assign({ message: 'Categories retrieved successfully' }, result)];
                    }
                });
            });
        };
        WebsiteService_1.prototype.createNotification = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.adminSystemNotification.createFeedNotification(__assign(__assign({}, input), { source: (_a = input.source) !== null && _a !== void 0 ? _a : 'website' }))];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WebsiteService_1.prototype.subscribeNewsletter = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var email, greenProducts, events, subscribedFor, saved, _a, createdAt, createdDate;
                var _this = this;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            email = dto.email.trim().toLowerCase();
                            if (!email) {
                                throw new common_1.BadRequestException('Email is required');
                            }
                            greenProducts = Boolean(dto.greenProducts);
                            events = Boolean(dto.events);
                            subscribedFor = buildSubscribedFor(dto);
                            return [4 /*yield*/, this.subscriberModel
                                    .findOneAndUpdate({ email: email }, {
                                    $set: {
                                        email: email,
                                        subscribedFor: subscribedFor,
                                        status: 1,
                                        updatedAt: new Date(),
                                    },
                                    $setOnInsert: {
                                        createdAt: new Date(),
                                    },
                                }, { upsert: true, new: true })
                                    .lean()
                                    .exec()];
                        case 1:
                            saved = _c.sent();
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.subscriberModel.db
                                    .collection('newsletter_subscribers')
                                    .deleteMany({ email: email })];
                        case 3:
                            _c.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            _a = _c.sent();
                            return [3 /*break*/, 5];
                        case 5: return [4 /*yield*/, this.invalidateNewsletterSubscribersCache()];
                        case 6:
                            _c.sent();
                            createdAt = (saved === null || saved === void 0 ? void 0 : saved.createdAt) ? new Date(saved.createdAt) : new Date();
                            createdDate = createdAt.toISOString().slice(0, 10);
                            return [4 /*yield*/, this.createNotification({
                                    title: 'New subscriber added',
                                    message: "".concat(email, " subscribed to newsletter."),
                                    type: 'success',
                                    source: 'website',
                                    referenceType: 'newsletter',
                                    referenceId: String((_b = saved === null || saved === void 0 ? void 0 : saved._id) !== null && _b !== void 0 ? _b : ''),
                                    actorName: email,
                                })];
                        case 7:
                            _c.sent();
                            void this.websiteAnalytics
                                .recordSignUp({
                                visitorKey: email,
                                signUpType: 'newsletter',
                                path: '/newsletter',
                            })
                                .catch(function () { return undefined; });
                            this.emailService.sendInBackground(function () {
                                return _this.emailService.sendNewsletterSubscribeEmail(email, subscribedFor);
                            });
                            return [2 /*return*/, {
                                    email: saved.email,
                                    greenProducts: greenProducts,
                                    events: events,
                                    createdDate: createdDate,
                                    is_active: true,
                                    subscribedFor: formatSubscribedForLabel(subscribedFor),
                                    subscribeFor: formatSubscribedForLabel(subscribedFor),
                                    status: 'active',
                                }];
                    }
                });
            });
        };
        /**
         * Admin list endpoint backing `GET /api/website/newsletter`.
         * Always reads MongoDB (and any legacy collection) so new website signups appear immediately.
         */
        WebsiteService_1.prototype.getNewsletterSubscribers = function () {
            return __awaiter(this, void 0, void 0, function () {
                var rows, data, cacheKey, e_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.loadNewsletterSubscriberDocs()];
                        case 1:
                            rows = _a.sent();
                            data = (rows !== null && rows !== void 0 ? rows : []).map(function (r, idx) {
                                var _a, _b, _c;
                                var subscribedFor = formatSubscribedForLabel(r.subscribedFor);
                                var activity = (0, newsletter_subscribers_query_util_1.newsletterSubscriberActivityDate)(r);
                                var dateStr = formatDateYYYYMMDD(activity !== null && activity !== void 0 ? activity : r.createdAt);
                                return {
                                    id: r._id ? String(r._id) : String(idx + 1),
                                    s_no: idx + 1,
                                    email: String((_a = r.email) !== null && _a !== void 0 ? _a : ''),
                                    subscribedFor: subscribedFor,
                                    subscribeFor: subscribedFor,
                                    createdAt: dateStr,
                                    createdDate: dateStr,
                                    updatedAt: formatDateYYYYMMDD((_c = (_b = r.updatedAt) !== null && _b !== void 0 ? _b : activity) !== null && _c !== void 0 ? _c : r.createdAt),
                                    status: Number(r.status) === 1 ? 'active' : 'inactive',
                                    is_active: Number(r.status) === 1,
                                };
                            });
                            cacheKey = this.redisService.buildKey('website', 'newsletter', 'subscribers');
                            this.redisService
                                .set(cacheKey, data, this.getWebsitePublicListCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("Newsletter subscribers cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, data];
                        case 2:
                            e_1 = _a.sent();
                            throw new common_1.InternalServerErrorException((e_1 === null || e_1 === void 0 ? void 0 : e_1.message) || 'Failed to fetch newsletter subscriptions');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Reads `newslettersubscribers` (canonical in Atlas) plus any stray
         * `newsletter_subscribers` docs. Re-subscribes sort by latest activity
         * (updatedAt / createdAt), not the original signup date.
         */
        WebsiteService_1.prototype.loadNewsletterSubscriberDocs = function () {
            return __awaiter(this, void 0, void 0, function () {
                var projection, byEmail, primary, primaryName, _i, NEWSLETTER_SUBSCRIBER_COLLECTIONS_1, name_1, altRows, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            projection = {
                                email: 1,
                                subscribedFor: 1,
                                status: 1,
                                createdAt: 1,
                                updatedAt: 1,
                            };
                            byEmail = new Map();
                            return [4 /*yield*/, this.subscriberModel
                                    .find({}, projection)
                                    .lean()
                                    .exec()];
                        case 1:
                            primary = _b.sent();
                            (0, newsletter_subscribers_query_util_1.absorbNewsletterSubscriberRows)(byEmail, primary !== null && primary !== void 0 ? primary : []);
                            primaryName = this.subscriberModel.collection.name;
                            _i = 0, NEWSLETTER_SUBSCRIBER_COLLECTIONS_1 = newsletter_subscribers_query_util_1.NEWSLETTER_SUBSCRIBER_COLLECTIONS;
                            _b.label = 2;
                        case 2:
                            if (!(_i < NEWSLETTER_SUBSCRIBER_COLLECTIONS_1.length)) return [3 /*break*/, 7];
                            name_1 = NEWSLETTER_SUBSCRIBER_COLLECTIONS_1[_i];
                            if (name_1 === primaryName)
                                return [3 /*break*/, 6];
                            _b.label = 3;
                        case 3:
                            _b.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.subscriberModel.db
                                    .collection(name_1)
                                    .find({}, { projection: projection })
                                    .toArray()];
                        case 4:
                            altRows = _b.sent();
                            (0, newsletter_subscribers_query_util_1.absorbNewsletterSubscriberRows)(byEmail, altRows !== null && altRows !== void 0 ? altRows : []);
                            return [3 /*break*/, 6];
                        case 5:
                            _a = _b.sent();
                            return [3 /*break*/, 6];
                        case 6:
                            _i++;
                            return [3 /*break*/, 2];
                        case 7: return [2 /*return*/, (0, newsletter_subscribers_query_util_1.sortNewsletterSubscribersByActivity)(Array.from(byEmail.values()))];
                    }
                });
            });
        };
        /**
         * Stores a website "Contact Us" form submission.
         *
         * Sample Mongo (Mongoose) insert:
         *   const doc = new this.contactMessageModel(payload);
         *   await doc.save();
         */
        WebsiteService_1.prototype.submitContact = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var name_2, email, phoneNumber, subject, message, payload, created, saved, e_2;
                var _a, _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            _g.trys.push([0, 3, , 4]);
                            name_2 = String((_a = dto.name) !== null && _a !== void 0 ? _a : '').trim();
                            email = String((_b = dto.email) !== null && _b !== void 0 ? _b : '').trim().toLowerCase();
                            phoneNumber = String((_d = (_c = dto.phoneNumber) !== null && _c !== void 0 ? _c : dto.phone) !== null && _d !== void 0 ? _d : '').trim();
                            subject = String((_e = dto.subject) !== null && _e !== void 0 ? _e : '').trim();
                            message = String((_f = dto.message) !== null && _f !== void 0 ? _f : '').trim();
                            payload = {
                                inquiryType: 'contact',
                                name: name_2,
                                email: email,
                                phoneNumber: phoneNumber,
                                subject: subject,
                                message: message,
                            };
                            created = new this.contactMessageModel(payload);
                            return [4 /*yield*/, created.save()];
                        case 1:
                            saved = _g.sent();
                            return [4 /*yield*/, this.createNotification({
                                    title: 'New website inquiry',
                                    message: "".concat(payload.name || 'Anonymous', " submitted a contact inquiry."),
                                    type: 'info',
                                    source: 'website',
                                    referenceType: 'contact',
                                    referenceId: String(saved._id),
                                    actorName: payload.name,
                                })];
                        case 2:
                            _g.sent();
                            return [2 /*return*/, {
                                    id: String(saved._id),
                                    name: saved.name,
                                    email: saved.email,
                                    phoneNumber: saved.phoneNumber,
                                    subject: saved.subject,
                                    message: saved.message,
                                    createdAt: saved.createdAt,
                                }];
                        case 3:
                            e_2 = _g.sent();
                            throw new common_1.InternalServerErrorException((e_2 === null || e_2 === void 0 ? void 0 : e_2.message) || 'Failed to submit contact message');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Public event status toggle for the website events page.
         *
         * - Accepts Mongo `_id` OR numeric `eventId`
         * - If status is missing/invalid, treats it as active by default (1)
         * - Toggles: 1 ↔ 0
         */
        WebsiteService_1.prototype.toggleWebsiteEventStatus = function (identifier) {
            return __awaiter(this, void 0, void 0, function () {
                var raw, findQuery, asNumber, current, cur, normalized, next, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            raw = String(identifier !== null && identifier !== void 0 ? identifier : '').trim();
                            if (!raw) {
                                throw new common_1.BadRequestException('Event id is required');
                            }
                            findQuery = {};
                            if (mongoose_1.Types.ObjectId.isValid(raw)) {
                                findQuery._id = new mongoose_1.Types.ObjectId(raw);
                            }
                            else {
                                asNumber = Number.parseInt(raw, 10);
                                if (!Number.isFinite(asNumber) || asNumber <= 0) {
                                    throw new common_1.BadRequestException('Invalid event id (expected Mongo _id or numeric eventId)');
                                }
                                findQuery.eventId = asNumber;
                            }
                            return [4 /*yield*/, this.eventModel
                                    .findOne(findQuery)
                                    .select('eventStatus')
                                    .lean()
                                    .exec()];
                        case 1:
                            current = _a.sent();
                            if (!current) {
                                throw new common_1.NotFoundException('Event not found');
                            }
                            cur = Number(current.eventStatus);
                            normalized = cur === 0 || cur === 1 ? cur : 1;
                            next = normalized === 1 ? 0 : 1;
                            return [4 /*yield*/, this.eventModel
                                    .findOneAndUpdate(findQuery, { $set: { eventStatus: next, updatedDate: new Date() } }, { new: true })
                                    .select('eventStatus eventId')
                                    .lean()
                                    .exec()];
                        case 2:
                            updated = _a.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Event not found');
                            }
                            return [2 /*return*/, {
                                    id: String(updated._id),
                                    eventId: updated.eventId,
                                    status: Number(updated.eventStatus) === 1 ? 'active' : 'inactive',
                                }];
                    }
                });
            });
        };
        /**
         * Public website team members list.
         * Pulls active team members from shared dataset (type=staff, status=1),
         * sorted by displayOrder so website follows admin ordering.
         */
        WebsiteService_1.prototype.listWebsiteTeamMembers = function () {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, error_12, rows, baseRows, data;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheKey = this.redisService.buildKey('website', 'team-members', 'list-v4');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redisService.get(cacheKey)];
                        case 2:
                            cached = _a.sent();
                            if (Array.isArray(cached)) {
                                return [2 /*return*/, cached.map(function (member) { return (__assign(__assign({}, member), { image: sanitizeWebsiteImagePath(member.image) })); })];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_12 = _a.sent();
                            this.logger.warn("Website team-members cache read failed: ".concat((error_12 === null || error_12 === void 0 ? void 0 : error_12.message) || 'unknown error'));
                            return [3 /*break*/, 4];
                        case 4: return [4 /*yield*/, this.vendorUserModel
                                .find({ type: 'staff', status: 1, showOnWebsite: { $ne: false } })
                                .sort({ displayOrder: 1, _id: 1 })
                                .select('name designation email phone image facebookUrl twitterUrl linkedinUrl displayOrder businessVertical showOnWebsite sector_ids sector_id category_ids category_id')
                                .lean()
                                .exec()];
                        case 5:
                            rows = _a.sent();
                            return [4 /*yield*/, Promise.all((rows !== null && rows !== void 0 ? rows : []).map(function (m, idx) { return __awaiter(_this, void 0, void 0, function () {
                                    var sector_ids;
                                    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                                    return __generator(this, function (_k) {
                                        switch (_k.label) {
                                            case 0: return [4 /*yield*/, this.adminService.resolveTeamMemberSectorIds(m)];
                                            case 1:
                                                sector_ids = _k.sent();
                                                return [2 /*return*/, {
                                                        s_no: idx + 1,
                                                        id: String(m._id),
                                                        name: String((_a = m.name) !== null && _a !== void 0 ? _a : ''),
                                                        designation: String((_b = m.designation) !== null && _b !== void 0 ? _b : ''),
                                                        email: String((_c = m.email) !== null && _c !== void 0 ? _c : ''),
                                                        mobile: String((_d = m.phone) !== null && _d !== void 0 ? _d : ''),
                                                        displayOrder: Number(m.displayOrder) || 0,
                                                        businessVertical: String((_e = m.businessVertical) !== null && _e !== void 0 ? _e : ''),
                                                        business_vertical: String((_f = m.businessVertical) !== null && _f !== void 0 ? _f : ''),
                                                        image: sanitizeWebsiteImagePath(m.image),
                                                        facebookUrl: String((_g = m.facebookUrl) !== null && _g !== void 0 ? _g : ''),
                                                        twitterUrl: String((_h = m.twitterUrl) !== null && _h !== void 0 ? _h : ''),
                                                        linkedinUrl: String((_j = m.linkedinUrl) !== null && _j !== void 0 ? _j : ''),
                                                        sector_ids: sector_ids,
                                                    }];
                                        }
                                    });
                                }); }))];
                        case 6:
                            baseRows = _a.sent();
                            return [4 /*yield*/, this.adminService.attachTeamMemberSectorFields(baseRows)];
                        case 7:
                            data = _a.sent();
                            this.redisService
                                .set(cacheKey, data, this.getWebsitePublicListCacheTtlSeconds())
                                .catch(function (error) {
                                _this.logger.warn("Website team-members cache write failed: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                            });
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        /**
         * Sends an email to the customer with manufacturer details included.
         * Uses `manufacturerId` to fetch manufacturer details.
         */
        WebsiteService_1.prototype.submitManufacturerInquiry = function (dto, manufacturerIdFromQuery) {
            return __awaiter(this, void 0, void 0, function () {
                var manufacturerId, manufacturer, manufacturerName, vendorName, vendorEmail, vendorPhone, vendorUser, subject, safe, visitorPhone, visitorMessage, visitorDetailsBlock, htmlBody, productId, categoryId, urnNumber, product, designation, organisation, inquiryDoc, saved, err_1;
                var _this = this;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
                return __generator(this, function (_w) {
                    switch (_w.label) {
                        case 0:
                            manufacturerId = String((_b = (_a = dto.manufacturerId) !== null && _a !== void 0 ? _a : manufacturerIdFromQuery) !== null && _b !== void 0 ? _b : '').trim();
                            if (!manufacturerId) {
                                throw new common_1.BadRequestException('manufacturerId is required');
                            }
                            return [4 /*yield*/, this.manufacturersService.findById(manufacturerId)];
                        case 1:
                            manufacturer = _w.sent();
                            if (!manufacturer) {
                                throw new common_1.NotFoundException('Manufacturer not found');
                            }
                            manufacturerName = ((_c = manufacturer.manufacturerName) !== null && _c !== void 0 ? _c : '')
                                .toString()
                                .trim();
                            vendorName = ((_d = manufacturer.vendor_name) !== null && _d !== void 0 ? _d : '').toString().trim();
                            vendorEmail = ((_e = manufacturer.vendor_email) !== null && _e !== void 0 ? _e : '').toString().trim();
                            vendorPhone = ((_f = manufacturer.vendor_phone) !== null && _f !== void 0 ? _f : '').toString().trim();
                            if (!(!vendorEmail || !vendorPhone)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.vendorUserModel
                                    .findOne({
                                    manufacturerId: new mongoose_1.Types.ObjectId(String(manufacturer._id)),
                                    type: 'vendor',
                                    status: { $ne: 2 },
                                })
                                    .select('email phone')
                                    .lean()
                                    .exec()];
                        case 2:
                            vendorUser = _w.sent();
                            if (!vendorEmail)
                                vendorEmail = String((_g = vendorUser === null || vendorUser === void 0 ? void 0 : vendorUser.email) !== null && _g !== void 0 ? _g : '').trim();
                            if (!vendorPhone)
                                vendorPhone = String((_h = vendorUser === null || vendorUser === void 0 ? void 0 : vendorUser.phone) !== null && _h !== void 0 ? _h : '').trim();
                            _w.label = 3;
                        case 3:
                            subject = dto.subject && String(dto.subject).trim()
                                ? String(dto.subject).trim()
                                : "Thanks, we received your inquiry".concat(manufacturerName ? " \u2014 ".concat(manufacturerName) : '');
                            safe = function (s) {
                                return s
                                    .replace(/&/g, '&amp;')
                                    .replace(/</g, '&lt;')
                                    .replace(/>/g, '&gt;')
                                    .replace(/"/g, '&quot;')
                                    .replace(/'/g, '&#39;');
                            };
                            visitorPhone = '';
                            try {
                                visitorPhone = safe((0, normalize_phone_with_country_code_util_1.resolveManufacturerInquiryPhone)(dto));
                            }
                            catch (error) {
                                throw new common_1.BadRequestException(error instanceof Error ? error.message : 'Phone number is invalid');
                            }
                            visitorMessage = String((_j = dto.message) !== null && _j !== void 0 ? _j : '').trim();
                            visitorDetailsBlock = visitorMessage
                                ? "\n            <h3 style=\"margin:18px 0 8px;\">Your Message</h3>\n            <div style=\"background:#f9fafb; padding:14px; border-radius:8px; border:1px solid #e5e7eb;\">\n              <p style=\"margin:0;\"><strong>Phone:</strong> ".concat(visitorPhone, "</p>\n              <p style=\"margin:8px 0 0; white-space:pre-wrap;\">").concat(safe(visitorMessage), "</p>\n            </div>")
                                : "\n            <h3 style=\"margin:18px 0 8px;\">Your Contact Details</h3>\n            <div style=\"background:#f9fafb; padding:14px; border-radius:8px; border:1px solid #e5e7eb;\">\n              <p style=\"margin:0;\"><strong>Phone:</strong> ".concat(visitorPhone, "</p>\n            </div>");
                            htmlBody = "\n      <p>Hi ".concat(safe(dto.name), ",</p>\n      <p>We\u2019ve recorded your inquiry and included the manufacturer details below for your reference.</p>\n").concat(visitorDetailsBlock, "\n\n      <h3 style=\"margin:18px 0 8px;\">Manufacturer Details</h3>\n      <div style=\"background:#f9fafb; padding:14px; border-radius:8px; border:1px solid #e5e7eb;\">\n        <p style=\"margin:0;\"><strong>Name:</strong> ").concat(safe(manufacturerName || vendorName || 'N/A'), "</p>\n        <p style=\"margin:8px 0 0;\"><strong>Email:</strong> ").concat(safe(vendorEmail || 'N/A'), "</p>\n        <p style=\"margin:8px 0 0;\"><strong>Phone:</strong> ").concat(safe(vendorPhone || 'N/A'), "</p>\n      </div>\n    ");
                            return [4 /*yield*/, this.lifecycleNotification
                                    .notifyProductEnquiry({
                                    manufacturerId: manufacturerId,
                                    manufacturerName: manufacturerName || vendorName,
                                    vendorEmail: vendorEmail,
                                    visitorName: dto.name,
                                    visitorEmail: dto.email,
                                    visitorPhone: visitorPhone,
                                    visitorMessage: visitorMessage || undefined,
                                })
                                    .catch(function (err) {
                                    return _this.logger.warn("[submitManufacturerInquiry] Lifecycle notification failed: ".concat(err.message));
                                })];
                        case 4:
                            _w.sent();
                            productId = String((_k = dto.productId) !== null && _k !== void 0 ? _k : '').trim();
                            categoryId = String((_l = dto.categoryId) !== null && _l !== void 0 ? _l : '').trim();
                            urnNumber = String((_p = (_o = (_m = dto.urnNumber) !== null && _m !== void 0 ? _m : dto.urnNo) !== null && _o !== void 0 ? _o : dto.urn_no) !== null && _p !== void 0 ? _p : '').trim();
                            if (!(productId && mongoose_1.Types.ObjectId.isValid(productId))) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.productModel
                                    .findById(new mongoose_1.Types.ObjectId(productId))
                                    .select('urnNo categoryId')
                                    .lean()
                                    .exec()];
                        case 5:
                            product = _w.sent();
                            if (product) {
                                if (!urnNumber) {
                                    urnNumber = String((_q = product.urnNo) !== null && _q !== void 0 ? _q : '').trim();
                                }
                                if (!categoryId && product.categoryId) {
                                    categoryId = String(product.categoryId);
                                }
                            }
                            _w.label = 6;
                        case 6:
                            designation = String((_r = dto.designation) !== null && _r !== void 0 ? _r : '').trim();
                            organisation = String((_t = (_s = dto.organisation) !== null && _s !== void 0 ? _s : dto.organization) !== null && _t !== void 0 ? _t : '').trim();
                            _w.label = 7;
                        case 7:
                            _w.trys.push([7, 10, , 11]);
                            inquiryDoc = new this.contactMessageModel({
                                inquiryType: 'product',
                                name: String((_u = dto.name) !== null && _u !== void 0 ? _u : '').trim(),
                                email: String((_v = dto.email) !== null && _v !== void 0 ? _v : '')
                                    .trim()
                                    .toLowerCase(),
                                phoneNumber: visitorPhone,
                                subject: subject,
                                message: visitorMessage,
                                designation: designation,
                                organisation: organisation,
                                manufacturerId: manufacturerId,
                                productId: productId,
                                categoryId: categoryId,
                                urnNumber: urnNumber,
                            });
                            return [4 /*yield*/, inquiryDoc.save()];
                        case 8:
                            saved = _w.sent();
                            return [4 /*yield*/, this.createNotification({
                                    title: 'New product inquiry',
                                    message: "".concat(dto.name || 'A visitor', " submitted a product inquiry."),
                                    type: 'info',
                                    source: 'website',
                                    referenceType: 'product_inquiry',
                                    referenceId: String(saved._id),
                                    actorName: dto.name,
                                })];
                        case 9:
                            _w.sent();
                            return [3 /*break*/, 11];
                        case 10:
                            err_1 = _w.sent();
                            this.logger.warn("[submitManufacturerInquiry] Failed to persist product inquiry: ".concat(err_1.message));
                            return [3 /*break*/, 11];
                        case 11:
                            this.emailService.sendInBackground(function () {
                                return _this.emailService.sendEmail(dto.email, subject, htmlBody);
                            });
                            return [2 /*return*/, { sent: true, subject: subject }];
                    }
                });
            });
        };
        return WebsiteService_1;
    }());
    __setFunctionName(_classThis, "WebsiteService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WebsiteService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WebsiteService = _classThis;
}();
exports.WebsiteService = WebsiteService;
