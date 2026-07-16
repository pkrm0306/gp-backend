"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.WebsiteController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var newsletter_record_dto_1 = require("./dto/newsletter-record.dto");
var admin_list_products_dto_1 = require("../product-registration/dto/admin-list-products.dto");
var public_category_manufacturers_dto_1 = require("./dto/public-category-manufacturers.dto");
var public_manufacturer_categories_dto_1 = require("./dto/public-manufacturer-categories.dto");
var website_analytics_collect_dto_1 = require("./dto/website-analytics-collect.dto");
var WebsiteController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Website'), (0, common_1.Controller)('website')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _listPublicManufacturers_decorators;
    var _listPublicCategories_decorators;
    var _getPublicWebsiteStats_decorators;
    var _listPublicBanners_decorators;
    var _listPublicArticles_decorators;
    var _listPublicArticlesAlias_decorators;
    var _listPublicSummits_decorators;
    var _listPublicSummitsRoot_decorators;
    var _listPublicEvents_decorators;
    var _listPublicGallery_decorators;
    var _getPublicCertifiedProductsFilterOptions_decorators;
    var _searchPublicCertifiedProducts_decorators;
    var _listPublicCertifiedProducts_decorators;
    var _listPublicCertifiedProductsLegacy_decorators;
    var _getPublicCertifiedProductPassport_decorators;
    var _listManufacturersByCategory_decorators;
    var _listCategoriesByManufacturer_decorators;
    var _collectAnalytics_decorators;
    var _subscribe_decorators;
    var _listNewsletter_decorators;
    var _submitContact_decorators;
    var _toggleEventStatus_decorators;
    var _listWebsiteTeamMembers_decorators;
    var _manufacturerInquiry_decorators;
    var WebsiteController = _classThis = /** @class */ (function () {
        function WebsiteController_1(websiteService, categoriesService, summitsService, websiteAnalytics) {
            this.websiteService = (__runInitializers(this, _instanceExtraInitializers), websiteService);
            this.categoriesService = categoriesService;
            this.summitsService = summitsService;
            this.websiteAnalytics = websiteAnalytics;
        }
        WebsiteController_1.prototype.listPublicManufacturers = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.websiteService.getPublicManufacturersPaginated(query)];
                });
            });
        };
        WebsiteController_1.prototype.listPublicCategories = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.categoriesService.findAllForWebsitePublic(query)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Categories retrieved successfully',
                                    data: data,
                                }];
                    }
                });
            });
        };
        WebsiteController_1.prototype.getPublicWebsiteStats = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.websiteService.getPublicWebsiteStats()];
                });
            });
        };
        WebsiteController_1.prototype.listPublicBanners = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                var origin;
                return __generator(this, function (_a) {
                    origin = "".concat(req.protocol, "://").concat(req.get('host'));
                    return [2 /*return*/, this.websiteService.getPublicBannersNormalized(origin)];
                });
            });
        };
        WebsiteController_1.prototype.listPublicArticles = function (req, query) {
            return __awaiter(this, void 0, void 0, function () {
                var origin;
                return __generator(this, function (_a) {
                    origin = "".concat(req.protocol, "://").concat(req.get('host'));
                    return [2 /*return*/, this.websiteService.getPublicArticlesNormalized(query, origin)];
                });
            });
        };
        // Alias route for clients using `/website/public/articles`
        WebsiteController_1.prototype.listPublicArticlesAlias = function (req, query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.listPublicArticles(req, query)];
                });
            });
        };
        WebsiteController_1.prototype.listPublicSummits = function (req, query) {
            return __awaiter(this, void 0, void 0, function () {
                var origin;
                return __generator(this, function (_a) {
                    origin = "".concat(req.protocol, "://").concat(req.get('host'));
                    return [2 /*return*/, this.summitsService.buildPublicListResponse(query, origin)];
                });
            });
        };
        WebsiteController_1.prototype.listPublicSummitsRoot = function (req, query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.listPublicSummits(req, query)];
                });
            });
        };
        WebsiteController_1.prototype.listPublicEvents = function (req, query) {
            return __awaiter(this, void 0, void 0, function () {
                var origin;
                return __generator(this, function (_a) {
                    origin = "".concat(req.protocol, "://").concat(req.get('host'));
                    return [2 /*return*/, this.websiteService.getPublicEventsPaginated(query, origin)];
                });
            });
        };
        WebsiteController_1.prototype.listPublicGallery = function (req, query) {
            return __awaiter(this, void 0, void 0, function () {
                var origin;
                return __generator(this, function (_a) {
                    origin = "".concat(req.protocol, "://").concat(req.get('host'));
                    return [2 /*return*/, this.websiteService.getPublicGalleryPaginated(query, origin)];
                });
            });
        };
        WebsiteController_1.prototype.getPublicCertifiedProductsFilterOptions = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.websiteService.getPublicCertifiedProductsFilterOptions()];
                });
            });
        };
        WebsiteController_1.prototype.searchPublicCertifiedProducts = function (req, query) {
            return __awaiter(this, void 0, void 0, function () {
                var origin;
                var _a;
                return __generator(this, function (_b) {
                    origin = "".concat(req.protocol, "://").concat(req.get('host'));
                    return [2 /*return*/, this.websiteService.searchPublicCertifiedProducts(query.q, (_a = query.limit) !== null && _a !== void 0 ? _a : 15, origin)];
                });
            });
        };
        WebsiteController_1.prototype.listPublicCertifiedProducts = function (req, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var origin;
                return __generator(this, function (_a) {
                    origin = "".concat(req.protocol, "://").concat(req.get('host'));
                    return [2 /*return*/, this.websiteService.listPublicCertifiedProductsForWebsite(dto, origin)];
                });
            });
        };
        WebsiteController_1.prototype.listPublicCertifiedProductsLegacy = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.websiteService.getPublicCertifiedProducts(dto)];
                });
            });
        };
        WebsiteController_1.prototype.getPublicCertifiedProductPassport = function (req, productId) {
            return __awaiter(this, void 0, void 0, function () {
                var origin;
                return __generator(this, function (_a) {
                    origin = "".concat(req.protocol, "://").concat(req.get('host'));
                    return [2 /*return*/, this.websiteService.getPublicCertifiedProductPassport(productId, origin)];
                });
            });
        };
        WebsiteController_1.prototype.listManufacturersByCategory = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.websiteService.getManufacturersByCategoryPublic(dto)];
                });
            });
        };
        WebsiteController_1.prototype.listCategoriesByManufacturer = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.websiteService.getCategoriesByManufacturerPublic(dto)];
                });
            });
        };
        WebsiteController_1.prototype.collectAnalytics = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.websiteAnalytics.collect(dto)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Analytics recorded', data: data }];
                    }
                });
            });
        };
        WebsiteController_1.prototype.subscribe = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.websiteService.subscribeNewsletter(dto)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Subscribed successfully', data: data }];
                    }
                });
            });
        };
        WebsiteController_1.prototype.listNewsletter = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.websiteService.getNewsletterSubscribers()];
                        case 1:
                            data = _a.sent();
                            if (!data.length) {
                                return [2 /*return*/, { message: 'No subscriptions found', data: [] }];
                            }
                            return [2 /*return*/, { data: data }];
                    }
                });
            });
        };
        WebsiteController_1.prototype.submitContact = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.websiteService.submitContact(dto)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Message sent successfully', data: data }];
                    }
                });
            });
        };
        WebsiteController_1.prototype.toggleEventStatus = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.websiteService.toggleWebsiteEventStatus(id)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Event status updated successfully', data: data }];
                    }
                });
            });
        };
        WebsiteController_1.prototype.listWebsiteTeamMembers = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.websiteService.listWebsiteTeamMembers()];
                        case 1:
                            data = _a.sent();
                            if (!data.length) {
                                return [2 /*return*/, { message: 'No team members found', data: [] }];
                            }
                            return [2 /*return*/, { data: data }];
                    }
                });
            });
        };
        WebsiteController_1.prototype.manufacturerInquiry = function (dto, manufacturerId) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.websiteService.submitManufacturerInquiry(dto, manufacturerId)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { message: 'Email sent successfully', data: data }];
                    }
                });
            });
        };
        return WebsiteController_1;
    }());
    __setFunctionName(_classThis, "WebsiteController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _listPublicManufacturers_decorators = [(0, common_1.Get)('public/manufacturers'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Public manufacturers listing',
                description: 'Public API to list manufacturers with optional list filters. Only manufacturers with at least one certified, active (non-deleted) product are returned. Each manufacturer includes manufacturer_product_count, productCount, and resolved manufacturerImage / manufacturerImageUrl URLs for the public website.',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Manufacturers retrieved successfully',
            })];
        _listPublicCategories_decorators = [(0, common_1.Get)('public/categories'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Public categories listing',
                description: 'Public API to list categories with optional list filters. Only categories with at least one certified, active (non-deleted) product are returned. Each category includes category_product_count, category_manufacturer_count, and resolved category_image / category_image_url / categoryImageUrl fields for the public website.',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Categories retrieved successfully',
            })];
        _getPublicWebsiteStats_decorators = [(0, common_1.Get)('public/stats'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Public website impact stats',
                description: 'Returns cached counters for the website impact section: certified manufacturers (companies), total product categories in the categories list, and total certified ecolabelled products.',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Website stats retrieved successfully',
            })];
        _listPublicBanners_decorators = [(0, common_1.Get)(['public/banners', 'banner/list', 'banners/list']), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Public banners for website',
                description: 'Returns **all vendors’** active banners (ordered by sequence number) for homepage/marketing carousel. For a vendor’s **own** banners in the admin panel, use **GET /admin/banner/list** with auth.',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Banner cards data (same shape as legacy public admin list)',
            })];
        _listPublicArticles_decorators = [(0, common_1.Get)('public/articles/list'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Public articles list (paginated)',
                description: 'Returns active articles for website/blog cards (newest first). Default pagination: page=1, limit=12 (max 50).',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Articles retrieved successfully' })];
        _listPublicArticlesAlias_decorators = [(0, common_1.Get)('public/articles'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
        _listPublicSummits_decorators = [(0, common_1.Get)('public/summits/list'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Public summits list (active only)',
                description: 'Alias of `GET /website/summits/list`. Returns only active summits for the public website. No authentication.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated summits list' })];
        _listPublicSummitsRoot_decorators = [(0, common_1.Get)('public/summits'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Public summits list (alias of GET /website/summits)',
                description: 'Same card preview payload as `GET /website/summits` — cover image and excerpt per summit.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated summits list' })];
        _listPublicEvents_decorators = [(0, common_1.Get)('public/events/list'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Public events list (paginated)',
                description: 'Returns active events for the public website events page. Default pagination: page=1, limit=10 (max 50). Sorted by event date (newest first).',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Paginated events list',
            })];
        _listPublicGallery_decorators = [(0, common_1.Get)('public/gallery/list'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Public gallery list (paginated)',
                description: 'Returns active gallery items for the public website. Default: page=1, limit=50 (max 50). No authentication required.',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Paginated gallery list',
            })];
        _getPublicCertifiedProductsFilterOptions_decorators = [(0, common_1.Get)('public/products/certified/filter-options'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Public certified products filter options',
                description: 'Returns category multi-select options and country → state tree for the public website filter panel. No auth required.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Filter options' })];
        _searchPublicCertifiedProducts_decorators = [(0, common_1.Get)('public/products/certified/search'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Public certified product search (typeahead)',
                description: 'Active search suggestions (min 2 characters). Use returned `id` as `productId` in the list API when user selects a row.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Search suggestions' })];
        _listPublicCertifiedProducts_decorators = [(0, common_1.Post)('public/products/certified/list'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Public certified products listing (website grid)',
                description: 'Flat product cards for the public website. Requires at least one filter: `search` (min 2 chars), `categoryIds`, `countryId`, `stateIds`, or `productId` from search. Certified only (status 2). Each row includes `productImage`, `productImageUrl` (absolute URL), and category image fallbacks when the product has no image.',
            }), (0, swagger_1.ApiBody)({ type: admin_list_products_dto_1.AdminListProductsDto }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Certified products retrieved successfully',
            })];
        _listPublicCertifiedProductsLegacy_decorators = [(0, common_1.Post)('public/products/certified/list/legacy'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Public certified products listing (legacy URN groups)',
                description: 'Legacy shape grouped by URN. Prefer POST /website/public/products/certified/list for the website grid.',
            }), (0, swagger_1.ApiBody)({ type: admin_list_products_dto_1.AdminListProductsDto }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Certified products retrieved successfully',
            })];
        _getPublicCertifiedProductPassport_decorators = [(0, common_1.Get)('public/products/certified/:productId/passport'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Public certified product passport',
                description: 'Public API for product detail page. Returns passport content and product image URLs for a certified product only.',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Certified product passport retrieved successfully',
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Certified product not found' })];
        _listManufacturersByCategory_decorators = [(0, common_1.Post)('public/manufacturers/by-category'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Public manufacturers by category',
                description: 'Accepts categoryId and returns distinct manufacturers mapped through products (products.categoryId -> products.manufacturerId).',
            }), (0, swagger_1.ApiBody)({ type: public_category_manufacturers_dto_1.PublicCategoryManufacturersDto }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Manufacturers retrieved successfully',
            })];
        _listCategoriesByManufacturer_decorators = [(0, common_1.Post)('public/categories/by-manufacturer'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Public categories by manufacturer',
                description: 'Accepts manufacturerId and returns distinct categories mapped through products (products.manufacturerId -> products.categoryId).',
            }), (0, swagger_1.ApiBody)({ type: public_manufacturer_categories_dto_1.PublicManufacturerCategoriesDto }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Categories retrieved successfully',
            })];
        _collectAnalytics_decorators = [(0, common_1.Post)('analytics/collect'), (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED), (0, swagger_1.ApiOperation)({
                summary: 'Collect public website analytics events',
                description: 'Accepts batched page_view and sign_up events from the public website. ' +
                    'Used to power the admin Visitor Analytics dashboard.',
            }), (0, swagger_1.ApiBody)({ type: website_analytics_collect_dto_1.WebsiteAnalyticsCollectDto }), (0, swagger_1.ApiResponse)({ status: 202, description: 'Events accepted' })];
        _subscribe_decorators = [(0, common_1.Post)('newsletter'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({
                summary: 'Newsletter subscribe',
                description: 'Public website newsletter subscribe form. Accepts email + preferences (Green Products / Events) and returns a row-like payload for the subscribers list table.',
            }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Subscribed/updated successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' })];
        _listNewsletter_decorators = [(0, common_1.Get)('newsletter'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'List newsletter subscriptions (admin)',
                description: 'Fetches newsletter subscription records for the admin panel table.',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'List of subscriptions (empty array if none)',
                type: newsletter_record_dto_1.NewsletterRecordDto,
                isArray: true,
            })];
        _submitContact_decorators = [(0, common_1.Post)('contact'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({
                summary: 'Website contact form submit',
                description: 'Accepts contact form fields: name, email, phoneNumber, subject, message.',
            }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Message submitted successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' })];
        _toggleEventStatus_decorators = [(0, common_1.Patch)('events/:id/status'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Toggle website event status',
                description: 'Toggles event status for the website events page. Default is active if status is missing/invalid. Accepts Mongo `_id` or numeric `eventId`.',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Event status updated successfully',
            }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Event not found' })];
        _listWebsiteTeamMembers_decorators = [(0, common_1.Get)('team-members/list'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Website team members list',
                description: 'Returns active team members for the website: name, designation, email, mobile, image, social links, team, display order, and sector(s).',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Team members list' })];
        _manufacturerInquiry_decorators = [(0, common_1.Post)('manufacturer/inquiry'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({
                summary: 'Manufacturer inquiry (send email to customer)',
                description: 'Accepts name, email, countryCode (+ dial code from selector), phoneNumber (local digits), optional manufacturerId, and optional message/subject. **reCAPTCHA is not required** (no `x-recaptcha-token` header needed). Matches the public manufacturer contact form. Sends a confirmation email to the visitor.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Email sent successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Manufacturer not found' })];
        __esDecorate(_classThis, null, _listPublicManufacturers_decorators, { kind: "method", name: "listPublicManufacturers", static: false, private: false, access: { has: function (obj) { return "listPublicManufacturers" in obj; }, get: function (obj) { return obj.listPublicManufacturers; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listPublicCategories_decorators, { kind: "method", name: "listPublicCategories", static: false, private: false, access: { has: function (obj) { return "listPublicCategories" in obj; }, get: function (obj) { return obj.listPublicCategories; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPublicWebsiteStats_decorators, { kind: "method", name: "getPublicWebsiteStats", static: false, private: false, access: { has: function (obj) { return "getPublicWebsiteStats" in obj; }, get: function (obj) { return obj.getPublicWebsiteStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listPublicBanners_decorators, { kind: "method", name: "listPublicBanners", static: false, private: false, access: { has: function (obj) { return "listPublicBanners" in obj; }, get: function (obj) { return obj.listPublicBanners; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listPublicArticles_decorators, { kind: "method", name: "listPublicArticles", static: false, private: false, access: { has: function (obj) { return "listPublicArticles" in obj; }, get: function (obj) { return obj.listPublicArticles; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listPublicArticlesAlias_decorators, { kind: "method", name: "listPublicArticlesAlias", static: false, private: false, access: { has: function (obj) { return "listPublicArticlesAlias" in obj; }, get: function (obj) { return obj.listPublicArticlesAlias; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listPublicSummits_decorators, { kind: "method", name: "listPublicSummits", static: false, private: false, access: { has: function (obj) { return "listPublicSummits" in obj; }, get: function (obj) { return obj.listPublicSummits; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listPublicSummitsRoot_decorators, { kind: "method", name: "listPublicSummitsRoot", static: false, private: false, access: { has: function (obj) { return "listPublicSummitsRoot" in obj; }, get: function (obj) { return obj.listPublicSummitsRoot; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listPublicEvents_decorators, { kind: "method", name: "listPublicEvents", static: false, private: false, access: { has: function (obj) { return "listPublicEvents" in obj; }, get: function (obj) { return obj.listPublicEvents; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listPublicGallery_decorators, { kind: "method", name: "listPublicGallery", static: false, private: false, access: { has: function (obj) { return "listPublicGallery" in obj; }, get: function (obj) { return obj.listPublicGallery; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPublicCertifiedProductsFilterOptions_decorators, { kind: "method", name: "getPublicCertifiedProductsFilterOptions", static: false, private: false, access: { has: function (obj) { return "getPublicCertifiedProductsFilterOptions" in obj; }, get: function (obj) { return obj.getPublicCertifiedProductsFilterOptions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _searchPublicCertifiedProducts_decorators, { kind: "method", name: "searchPublicCertifiedProducts", static: false, private: false, access: { has: function (obj) { return "searchPublicCertifiedProducts" in obj; }, get: function (obj) { return obj.searchPublicCertifiedProducts; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listPublicCertifiedProducts_decorators, { kind: "method", name: "listPublicCertifiedProducts", static: false, private: false, access: { has: function (obj) { return "listPublicCertifiedProducts" in obj; }, get: function (obj) { return obj.listPublicCertifiedProducts; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listPublicCertifiedProductsLegacy_decorators, { kind: "method", name: "listPublicCertifiedProductsLegacy", static: false, private: false, access: { has: function (obj) { return "listPublicCertifiedProductsLegacy" in obj; }, get: function (obj) { return obj.listPublicCertifiedProductsLegacy; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPublicCertifiedProductPassport_decorators, { kind: "method", name: "getPublicCertifiedProductPassport", static: false, private: false, access: { has: function (obj) { return "getPublicCertifiedProductPassport" in obj; }, get: function (obj) { return obj.getPublicCertifiedProductPassport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listManufacturersByCategory_decorators, { kind: "method", name: "listManufacturersByCategory", static: false, private: false, access: { has: function (obj) { return "listManufacturersByCategory" in obj; }, get: function (obj) { return obj.listManufacturersByCategory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listCategoriesByManufacturer_decorators, { kind: "method", name: "listCategoriesByManufacturer", static: false, private: false, access: { has: function (obj) { return "listCategoriesByManufacturer" in obj; }, get: function (obj) { return obj.listCategoriesByManufacturer; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _collectAnalytics_decorators, { kind: "method", name: "collectAnalytics", static: false, private: false, access: { has: function (obj) { return "collectAnalytics" in obj; }, get: function (obj) { return obj.collectAnalytics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _subscribe_decorators, { kind: "method", name: "subscribe", static: false, private: false, access: { has: function (obj) { return "subscribe" in obj; }, get: function (obj) { return obj.subscribe; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listNewsletter_decorators, { kind: "method", name: "listNewsletter", static: false, private: false, access: { has: function (obj) { return "listNewsletter" in obj; }, get: function (obj) { return obj.listNewsletter; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _submitContact_decorators, { kind: "method", name: "submitContact", static: false, private: false, access: { has: function (obj) { return "submitContact" in obj; }, get: function (obj) { return obj.submitContact; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _toggleEventStatus_decorators, { kind: "method", name: "toggleEventStatus", static: false, private: false, access: { has: function (obj) { return "toggleEventStatus" in obj; }, get: function (obj) { return obj.toggleEventStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listWebsiteTeamMembers_decorators, { kind: "method", name: "listWebsiteTeamMembers", static: false, private: false, access: { has: function (obj) { return "listWebsiteTeamMembers" in obj; }, get: function (obj) { return obj.listWebsiteTeamMembers; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _manufacturerInquiry_decorators, { kind: "method", name: "manufacturerInquiry", static: false, private: false, access: { has: function (obj) { return "manufacturerInquiry" in obj; }, get: function (obj) { return obj.manufacturerInquiry; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WebsiteController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WebsiteController = _classThis;
}();
exports.WebsiteController = WebsiteController;
