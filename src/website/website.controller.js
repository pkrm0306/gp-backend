"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const website_service_1 = require("./website.service");
const newsletter_subscribe_dto_1 = require("./dto/newsletter-subscribe.dto");
const newsletter_record_dto_1 = require("./dto/newsletter-record.dto");
const contact_submit_dto_1 = require("./dto/contact-submit.dto");
const categories_service_1 = require("../categories/categories.service");
const list_manufacturers_query_dto_1 = require("../manufacturers/dto/list-manufacturers-query.dto");
const list_categories_query_dto_1 = require("../categories/dto/list-categories-query.dto");
const admin_list_products_dto_1 = require("../product-registration/dto/admin-list-products.dto");
const public_certified_product_search_query_dto_1 = require("./dto/public-certified-product-search-query.dto");
const public_category_manufacturers_dto_1 = require("./dto/public-category-manufacturers.dto");
const public_manufacturer_categories_dto_1 = require("./dto/public-manufacturer-categories.dto");
const manufacturer_inquiry_dto_1 = require("./dto/manufacturer-inquiry.dto");
const public_list_events_query_dto_1 = require("./dto/public-list-events-query.dto");
const public_list_articles_query_dto_1 = require("./dto/public-list-articles-query.dto");
const public_list_gallery_query_dto_1 = require("./dto/public-list-gallery-query.dto");
const public_list_summits_query_dto_1 = require("../summits/dto/public-list-summits-query.dto");
const summits_service_1 = require("../summits/summits.service");
const website_analytics_service_1 = require("./website-analytics.service");
const website_analytics_collect_dto_1 = require("./dto/website-analytics-collect.dto");
const share_product_by_email_dto_1 = require("./dto/share-product-by-email.dto");
let WebsiteController = class WebsiteController {
    constructor(websiteService, categoriesService, summitsService, websiteAnalytics) {
        this.websiteService = websiteService;
        this.categoriesService = categoriesService;
        this.summitsService = summitsService;
        this.websiteAnalytics = websiteAnalytics;
    }
    async listPublicManufacturers(query) {
        return this.websiteService.getPublicManufacturersPaginated(query);
    }
    async listPublicCategories(query) {
        const data = await this.categoriesService.findAllForWebsitePublic(query);
        return {
            message: 'Categories retrieved successfully',
            data,
        };
    }
    async getPublicCategoryBySlug(categorySlug) {
        const data = await this.categoriesService.findBySlugForWebsitePublic(categorySlug);
        return {
            message: 'Category retrieved successfully',
            data,
        };
    }
    async getPublicManufacturerBySlug(manufacturerSlug) {
        return this.websiteService.getPublicManufacturerBySlug(manufacturerSlug);
    }
    async getPublicCertifiedProductPassportBySlug(req, productSlug) {
        const origin = `${req.protocol}://${req.get('host')}`;
        return this.websiteService.getPublicCertifiedProductPassportBySlug(productSlug, origin);
    }
    async getPublicCertifiedProductBySlug(req, productSlug) {
        const origin = `${req.protocol}://${req.get('host')}`;
        return this.websiteService.getPublicCertifiedProductBySlug(productSlug, origin);
    }
    async getPublicWebsiteStats() {
        return this.websiteService.getPublicWebsiteStats();
    }
    async listPublicBanners(req) {
        const origin = `${req.protocol}://${req.get('host')}`;
        return this.websiteService.getPublicBannersNormalized(origin);
    }
    async listPublicArticles(req, query) {
        const origin = `${req.protocol}://${req.get('host')}`;
        return this.websiteService.getPublicArticlesNormalized(query, origin);
    }
    async listPublicArticlesAlias(req, query) {
        return this.listPublicArticles(req, query);
    }
    async getPublicArticleById(req, id) {
        const origin = `${req.protocol}://${req.get('host')}`;
        return this.websiteService.getPublicArticleById(id, origin);
    }
    async listPublicSummits(req, query) {
        const origin = `${req.protocol}://${req.get('host')}`;
        return this.summitsService.buildPublicListResponse(query, origin);
    }
    async listPublicSummitsRoot(req, query) {
        return this.listPublicSummits(req, query);
    }
    async listPublicEvents(req, query) {
        const origin = `${req.protocol}://${req.get('host')}`;
        return this.websiteService.getPublicEventsPaginated(query, origin);
    }
    async listPublicGallery(req, query) {
        const origin = `${req.protocol}://${req.get('host')}`;
        return this.websiteService.getPublicGalleryPaginated(query, origin);
    }
    async getPublicCertifiedProductsFilterOptions() {
        return this.websiteService.getPublicCertifiedProductsFilterOptions();
    }
    async searchPublicCertifiedProducts(req, query) {
        const origin = `${req.protocol}://${req.get('host')}`;
        return this.websiteService.searchPublicCertifiedProducts(query.q, query.limit ?? 15, origin);
    }
    async listPublicCertifiedProducts(req, dto) {
        const origin = `${req.protocol}://${req.get('host')}`;
        return this.websiteService.listPublicCertifiedProductsForWebsite(dto, origin);
    }
    async listPublicCertifiedProductsLegacy(dto) {
        return this.websiteService.getPublicCertifiedProducts(dto);
    }
    async getPublicCertifiedProductPassport(req, productId) {
        const origin = `${req.protocol}://${req.get('host')}`;
        return this.websiteService.getPublicCertifiedProductPassport(productId, origin);
    }
    async shareProductByEmail(dto) {
        const data = await this.websiteService.shareProductByEmail(dto);
        return {
            success: true,
            message: 'Product share email sent successfully',
            data,
        };
    }
    async listManufacturersByCategory(dto) {
        return this.websiteService.getManufacturersByCategoryPublic(dto);
    }
    async listCategoriesByManufacturer(dto) {
        return this.websiteService.getCategoriesByManufacturerPublic(dto);
    }
    async collectAnalytics(dto) {
        const data = await this.websiteAnalytics.collect(dto);
        return { message: 'Analytics recorded', data };
    }
    async subscribe(dto) {
        const data = await this.websiteService.subscribeNewsletter(dto);
        return { message: 'Subscribed successfully', data };
    }
    async listNewsletter() {
        const data = await this.websiteService.getNewsletterSubscribers();
        if (!data.length) {
            return { message: 'No subscriptions found', data: [] };
        }
        return { data };
    }
    async submitContact(dto) {
        const data = await this.websiteService.submitContact(dto);
        return { message: 'Message sent successfully', data };
    }
    async toggleEventStatus(id) {
        const data = await this.websiteService.toggleWebsiteEventStatus(id);
        return { message: 'Event status updated successfully', data };
    }
    async listWebsiteTeamMembers() {
        const data = await this.websiteService.listWebsiteTeamMembers();
        if (!data.length) {
            return { message: 'No team members found', data: [] };
        }
        return { data };
    }
    async manufacturerInquiry(dto, manufacturerId) {
        const data = await this.websiteService.submitManufacturerInquiry(dto, manufacturerId);
        return { message: 'Email sent successfully', data };
    }
};
exports.WebsiteController = WebsiteController;
__decorate([
    (0, common_1.Get)('public/manufacturers'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Public manufacturers listing',
        description: 'Public API to list manufacturers with optional list filters. Only manufacturers with at least one certified, active (non-deleted) product are returned. Each manufacturer includes manufacturer_product_count, productCount, and resolved manufacturerImage / manufacturerImageUrl URLs for the public website.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Manufacturers retrieved successfully',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_manufacturers_query_dto_1.ListManufacturersQueryDto]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "listPublicManufacturers", null);
__decorate([
    (0, common_1.Get)('public/categories'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Public categories listing',
        description: 'Public API to list categories with optional list filters. Only categories with at least one certified, active (non-deleted) product are returned. Each category includes category_product_count, category_manufacturer_count, and resolved category_image / category_image_url / categoryImageUrl fields for the public website.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Categories retrieved successfully',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_categories_query_dto_1.ListCategoriesQueryDto]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "listPublicCategories", null);
__decorate([
    (0, common_1.Get)('public/categories/by-slug/:categorySlug'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Public category by unique slug',
        description: 'Resolve an active category for SEO paths `/categories/{categorySlug}`. Returns 404 when missing or inactive / without certified products.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    __param(0, (0, common_1.Param)('categorySlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "getPublicCategoryBySlug", null);
__decorate([
    (0, common_1.Get)('public/manufacturers/by-slug/:manufacturerSlug'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Public manufacturer by unique slug',
        description: 'Resolve a website-visible manufacturer for SEO paths `/manufacturers/{manufacturerSlug}`.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Manufacturer retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Manufacturer not found' }),
    __param(0, (0, common_1.Param)('manufacturerSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "getPublicManufacturerBySlug", null);
__decorate([
    (0, common_1.Get)('public/products/certified/by-slug/:productSlug/passport'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Public certified product passport by slug',
        description: 'Same payload as the ID passport route, resolved via unique product slug.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Certified product passport retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Certified product not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('productSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "getPublicCertifiedProductPassportBySlug", null);
__decorate([
    (0, common_1.Get)('public/products/certified/by-slug/:productSlug'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Public certified product by unique slug',
        description: 'Product detail for SEO paths. Includes `slug`, `categorySlug`, and `manufacturerSlug` for nested category/manufacturer trees.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Certified product retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Certified product not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('productSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "getPublicCertifiedProductBySlug", null);
__decorate([
    (0, common_1.Get)('public/stats'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Public website impact stats',
        description: 'Returns cached counters for the website impact section: certified manufacturers (companies), total product categories in the categories list, and total certified ecolabelled products.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Website stats retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "getPublicWebsiteStats", null);
__decorate([
    (0, common_1.Get)(['public/banners', 'banner/list', 'banners/list']),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Public banners for website',
        description: 'Returns **all vendors’** active banners (ordered by sequence number) for homepage/marketing carousel. For a vendor’s **own** banners in the admin panel, use **GET /admin/banner/list** with auth.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Banner cards data (same shape as legacy public admin list)',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "listPublicBanners", null);
__decorate([
    (0, common_1.Get)('public/articles/list'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Public articles list (paginated)',
        description: 'Returns active articles for website/blog cards (newest first). Default pagination: page=1, limit=12 (max 100).',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Articles retrieved successfully' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, public_list_articles_query_dto_1.PublicListArticlesQueryDto]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "listPublicArticles", null);
__decorate([
    (0, common_1.Get)('public/articles'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, public_list_articles_query_dto_1.PublicListArticlesQueryDto]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "listPublicArticlesAlias", null);
__decorate([
    (0, common_1.Get)('public/articles/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Public article by id',
        description: 'Returns one active article for the public website (title, description, date, image/images). First image is the heading; all images are for the gallery below What\'s inside.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "getPublicArticleById", null);
__decorate([
    (0, common_1.Get)('public/summits/list'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Public summits list (active only)',
        description: 'Alias of `GET /website/summits/list`. Returns only active summits for the public website. No authentication.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated summits list' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, public_list_summits_query_dto_1.PublicListSummitsQueryDto]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "listPublicSummits", null);
__decorate([
    (0, common_1.Get)('public/summits'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Public summits list (alias of GET /website/summits)',
        description: 'Same card preview payload as `GET /website/summits` — cover image and excerpt per summit.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated summits list' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, public_list_summits_query_dto_1.PublicListSummitsQueryDto]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "listPublicSummitsRoot", null);
__decorate([
    (0, common_1.Get)('public/events/list'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Public events list (paginated)',
        description: 'Returns published events (eventStatus=1) for the public website events page (past and upcoming). Each row includes `is_active` based on end date. Default pagination: page=1, limit=10 (max 200). Sorted by event date (newest first).',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated events list',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, public_list_events_query_dto_1.PublicListEventsQueryDto]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "listPublicEvents", null);
__decorate([
    (0, common_1.Get)('public/gallery/list'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Public gallery list (paginated)',
        description: 'Returns active gallery items for the public website. Default: page=1, limit=50 (max 50). No authentication required.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated gallery list',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, public_list_gallery_query_dto_1.PublicListGalleryQueryDto]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "listPublicGallery", null);
__decorate([
    (0, common_1.Get)('public/products/certified/filter-options'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Public certified products filter options',
        description: 'Returns category multi-select options and country → state tree for the public website filter panel. No auth required.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Filter options' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "getPublicCertifiedProductsFilterOptions", null);
__decorate([
    (0, common_1.Get)('public/products/certified/search'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Public certified product search (typeahead)',
        description: 'Active search suggestions (min 2 characters). Each hit includes `slug`, `categorySlug`, and `manufacturerSlug` for SEO navigation without Mongo IDs. Searching by category name also returns matching certified products.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Search suggestions' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, public_certified_product_search_query_dto_1.PublicCertifiedProductSearchQueryDto]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "searchPublicCertifiedProducts", null);
__decorate([
    (0, common_1.Post)('public/products/certified/list'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Public certified products listing (website grid)',
        description: 'Flat product cards for the public website. Requires at least one filter: `search` (min 2 chars), `categoryIds` / `categorySlug(s)`, `manufacturerId` / `manufacturerSlug`, `countryId`, `stateIds`, `productId` / `productSlug`. Certified only (status 2). Every row includes `slug`, `categorySlug`, and `manufacturerSlug`.',
    }),
    (0, swagger_1.ApiBody)({ type: admin_list_products_dto_1.AdminListProductsDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Certified products retrieved successfully',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_list_products_dto_1.AdminListProductsDto]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "listPublicCertifiedProducts", null);
__decorate([
    (0, common_1.Post)('public/products/certified/list/legacy'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Public certified products listing (legacy URN groups)',
        description: 'Legacy shape grouped by URN. Prefer POST /website/public/products/certified/list for the website grid.',
    }),
    (0, swagger_1.ApiBody)({ type: admin_list_products_dto_1.AdminListProductsDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Certified products retrieved successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_list_products_dto_1.AdminListProductsDto]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "listPublicCertifiedProductsLegacy", null);
__decorate([
    (0, common_1.Get)('public/products/certified/:productId/passport'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Public certified product passport',
        description: 'Public API for product detail page. Returns passport content, product image URLs, and `slug` / `categorySlug` / `manufacturerSlug` for a certified product only. Prefer the by-slug passport route for SEO URLs.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Certified product passport retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Certified product not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "getPublicCertifiedProductPassport", null);
__decorate([
    (0, common_1.Post)('public/products/share-by-email'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Share certified product by email (HTML card)',
        description: 'Sends a rich HTML product card email (image, GREENPRO CERTIFIED badge, Product / Manufacturer / EOI / URN, View Product Details CTA). ' +
            'Use this instead of mailto so Outlook/Gmail render the full card.',
    }),
    (0, swagger_1.ApiBody)({ type: share_product_by_email_dto_1.ShareProductByEmailDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Share email sent' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [share_product_by_email_dto_1.ShareProductByEmailDto]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "shareProductByEmail", null);
__decorate([
    (0, common_1.Post)('public/manufacturers/by-category'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Public manufacturers by category',
        description: 'Accepts `categorySlug` (preferred) or category Mongo `_id` / numeric `category_id` and returns distinct manufacturers mapped through certified products. Each manufacturer includes `slug`.',
    }),
    (0, swagger_1.ApiBody)({ type: public_category_manufacturers_dto_1.PublicCategoryManufacturersDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Manufacturers retrieved successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [public_category_manufacturers_dto_1.PublicCategoryManufacturersDto]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "listManufacturersByCategory", null);
__decorate([
    (0, common_1.Post)('public/categories/by-manufacturer'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Public categories by manufacturer',
        description: 'Accepts `manufacturerSlug` (preferred) or `manufacturerId` and returns distinct categories mapped through certified products. Each category includes `slug`.',
    }),
    (0, swagger_1.ApiBody)({ type: public_manufacturer_categories_dto_1.PublicManufacturerCategoriesDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Categories retrieved successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [public_manufacturer_categories_dto_1.PublicManufacturerCategoriesDto]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "listCategoriesByManufacturer", null);
__decorate([
    (0, common_1.Post)('analytics/collect'),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, swagger_1.ApiOperation)({
        summary: 'Collect public website analytics events',
        description: 'Accepts batched page_view and sign_up events from the public website. ' +
            'Used to power the admin Visitor Analytics dashboard.',
    }),
    (0, swagger_1.ApiBody)({ type: website_analytics_collect_dto_1.WebsiteAnalyticsCollectDto }),
    (0, swagger_1.ApiResponse)({ status: 202, description: 'Events accepted' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [website_analytics_collect_dto_1.WebsiteAnalyticsCollectDto]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "collectAnalytics", null);
__decorate([
    (0, common_1.Post)('newsletter'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Newsletter subscribe',
        description: 'Public website newsletter subscribe form. Accepts email + preferences (Green Products / Events) and `recaptchaToken` (required). reCAPTCHA is verified server-side before subscribe.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Subscribed/updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newsletter_subscribe_dto_1.NewsletterSubscribeDto]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "subscribe", null);
__decorate([
    (0, common_1.Get)('newsletter'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List newsletter subscriptions (admin)',
        description: 'Fetches newsletter subscription records for the admin panel table.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of subscriptions (empty array if none)',
        type: newsletter_record_dto_1.NewsletterRecordDto,
        isArray: true,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "listNewsletter", null);
__decorate([
    (0, common_1.Post)('contact'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Website contact form submit',
        description: 'Accepts contact form fields: name, email, phoneNumber, subject, message, and `recaptchaToken` (required). reCAPTCHA is verified server-side before the message is saved.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Message submitted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contact_submit_dto_1.ContactSubmitDto]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "submitContact", null);
__decorate([
    (0, common_1.Patch)('events/:id/status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Toggle website event status',
        description: 'Toggles event status for the website events page. Default is active if status is missing/invalid. Accepts Mongo `_id` or numeric `eventId`.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Event status updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid id' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Event not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "toggleEventStatus", null);
__decorate([
    (0, common_1.Get)('team-members/list'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Website team members list',
        description: 'Returns active team members for the website: name, designation, email, mobile, image, social links, team, display order, and sector(s).',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Team members list' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "listWebsiteTeamMembers", null);
__decorate([
    (0, common_1.Post)('manufacturer/inquiry'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Manufacturer inquiry (send email to customer)',
        description: 'Accepts name, email, countryCode (+ dial code from selector), phoneNumber (local digits), optional manufacturerId, optional message/subject, and `recaptchaToken` (required). reCAPTCHA is verified server-side before the inquiry is processed. Sends a confirmation email to the visitor.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Email sent successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Manufacturer not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('manufacturerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [manufacturer_inquiry_dto_1.ManufacturerInquiryDto, String]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "manufacturerInquiry", null);
exports.WebsiteController = WebsiteController = __decorate([
    (0, swagger_1.ApiTags)('Website'),
    (0, common_1.Controller)('website'),
    __metadata("design:paramtypes", [website_service_1.WebsiteService,
        categories_service_1.CategoriesService,
        summits_service_1.SummitsService,
        website_analytics_service_1.WebsiteAnalyticsService])
], WebsiteController);
//# sourceMappingURL=website.controller.js.map