import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WebsiteService } from './website.service';
import { NewsletterSubscribeDto } from './dto/newsletter-subscribe.dto';
import { NewsletterRecordDto } from './dto/newsletter-record.dto';
import { ContactSubmitDto } from './dto/contact-submit.dto';
import { CategoriesService } from '../categories/categories.service';
import { ListManufacturersQueryDto } from '../manufacturers/dto/list-manufacturers-query.dto';
import { ListCategoriesQueryDto } from '../categories/dto/list-categories-query.dto';
import { AdminListProductsDto } from '../product-registration/dto/admin-list-products.dto';
import { PublicCertifiedProductSearchQueryDto } from './dto/public-certified-product-search-query.dto';
import { PublicCategoryManufacturersDto } from './dto/public-category-manufacturers.dto';
import { PublicManufacturerCategoriesDto } from './dto/public-manufacturer-categories.dto';
import { ManufacturerInquiryDto } from './dto/manufacturer-inquiry.dto';
import { PublicListEventsQueryDto } from './dto/public-list-events-query.dto';
import { PublicListArticlesQueryDto } from './dto/public-list-articles-query.dto';
import { PublicListGalleryQueryDto } from './dto/public-list-gallery-query.dto';
import { PublicListSummitsQueryDto } from '../summits/dto/public-list-summits-query.dto';
import { SummitsService } from '../summits/summits.service';
import { WebsiteAnalyticsService } from './website-analytics.service';
import { WebsiteAnalyticsCollectDto } from './dto/website-analytics-collect.dto';
import { ShareProductByEmailDto } from './dto/share-product-by-email.dto';

@ApiTags('Website')
@Controller('website')
export class WebsiteController {
  constructor(
    private readonly websiteService: WebsiteService,
    private readonly categoriesService: CategoriesService,
    private readonly summitsService: SummitsService,
    private readonly websiteAnalytics: WebsiteAnalyticsService,
  ) {}

  @Get('public/manufacturers')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public manufacturers listing',
    description:
      'Public API to list manufacturers with optional list filters. Only manufacturers with at least one certified, active (non-deleted) product are returned. Each manufacturer includes manufacturer_product_count, productCount, and resolved manufacturerImage / manufacturerImageUrl URLs for the public website.',
  })
  @ApiResponse({
    status: 200,
    description: 'Manufacturers retrieved successfully',
  })
  async listPublicManufacturers(@Query() query: ListManufacturersQueryDto) {
    return this.websiteService.getPublicManufacturersPaginated(query);
  }

  @Get('public/categories')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public categories listing',
    description:
      'Public API to list categories with optional list filters. Only categories with at least one certified, active (non-deleted) product are returned. Each category includes category_product_count, category_manufacturer_count, and resolved category_image / category_image_url / categoryImageUrl fields for the public website.',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  async listPublicCategories(@Query() query: ListCategoriesQueryDto) {
    const data = await this.categoriesService.findAllForWebsitePublic(query);
    return {
      message: 'Categories retrieved successfully',
      data,
    };
  }

  @Get('public/stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public website impact stats',
    description:
      'Returns cached counters for the website impact section: certified manufacturers (companies), total product categories in the categories list, and total certified ecolabelled products.',
  })
  @ApiResponse({
    status: 200,
    description: 'Website stats retrieved successfully',
  })
  async getPublicWebsiteStats() {
    return this.websiteService.getPublicWebsiteStats();
  }

  @Get(['public/banners', 'banner/list', 'banners/list'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public banners for website',
    description:
      'Returns **all vendors’** active banners (ordered by sequence number) for homepage/marketing carousel. For a vendor’s **own** banners in the admin panel, use **GET /admin/banner/list** with auth.',
  })
  @ApiResponse({
    status: 200,
    description: 'Banner cards data (same shape as legacy public admin list)',
  })
  async listPublicBanners(@Req() req: Request) {
    const origin = `${req.protocol}://${req.get('host')}`;
    return this.websiteService.getPublicBannersNormalized(origin);
  }

  @Get('public/articles/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public articles list (paginated)',
    description:
      'Returns active articles for website/blog cards (newest first). Default pagination: page=1, limit=12 (max 50).',
  })
  @ApiResponse({ status: 200, description: 'Articles retrieved successfully' })
  async listPublicArticles(
    @Req() req: Request,
    @Query() query: PublicListArticlesQueryDto,
  ) {
    const origin = `${req.protocol}://${req.get('host')}`;
    return this.websiteService.getPublicArticlesNormalized(query, origin);
  }

  // Alias route for clients using `/website/public/articles`
  @Get('public/articles')
  @HttpCode(HttpStatus.OK)
  async listPublicArticlesAlias(
    @Req() req: Request,
    @Query() query: PublicListArticlesQueryDto,
  ) {
    return this.listPublicArticles(req, query);
  }

  @Get('public/articles/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public article by id',
    description:
      'Returns one active article for the public website (title, description, date, image, pdf).',
  })
  @ApiResponse({ status: 200, description: 'Article retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async getPublicArticleById(@Req() req: Request, @Param('id') id: string) {
    const origin = `${req.protocol}://${req.get('host')}`;
    return this.websiteService.getPublicArticleById(id, origin);
  }

  @Get('public/summits/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public summits list (active only)',
    description:
      'Alias of `GET /website/summits/list`. Returns only active summits for the public website. No authentication.',
  })
  @ApiResponse({ status: 200, description: 'Paginated summits list' })
  async listPublicSummits(
    @Req() req: Request,
    @Query() query: PublicListSummitsQueryDto,
  ) {
    const origin = `${req.protocol}://${req.get('host')}`;
    return this.summitsService.buildPublicListResponse(query, origin);
  }

  @Get('public/summits')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public summits list (alias of GET /website/summits)',
    description:
      'Same card preview payload as `GET /website/summits` — cover image and excerpt per summit.',
  })
  @ApiResponse({ status: 200, description: 'Paginated summits list' })
  async listPublicSummitsRoot(
    @Req() req: Request,
    @Query() query: PublicListSummitsQueryDto,
  ) {
    return this.listPublicSummits(req, query);
  }

  @Get('public/events/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public events list (paginated)',
    description:
      'Returns active events for the public website events page. Default pagination: page=1, limit=10 (max 200). Sorted by event date (newest first).',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated events list',
  })
  async listPublicEvents(
    @Req() req: Request,
    @Query() query: PublicListEventsQueryDto,
  ) {
    const origin = `${req.protocol}://${req.get('host')}`;
    return this.websiteService.getPublicEventsPaginated(query, origin);
  }

  @Get('public/gallery/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public gallery list (paginated)',
    description:
      'Returns active gallery items for the public website. Default: page=1, limit=50 (max 50). No authentication required.',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated gallery list',
  })
  async listPublicGallery(
    @Req() req: Request,
    @Query() query: PublicListGalleryQueryDto,
  ) {
    const origin = `${req.protocol}://${req.get('host')}`;
    return this.websiteService.getPublicGalleryPaginated(query, origin);
  }

  @Get('public/products/certified/filter-options')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public certified products filter options',
    description:
      'Returns category multi-select options and country → state tree for the public website filter panel. No auth required.',
  })
  @ApiResponse({ status: 200, description: 'Filter options' })
  async getPublicCertifiedProductsFilterOptions() {
    return this.websiteService.getPublicCertifiedProductsFilterOptions();
  }

  @Get('public/products/certified/search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public certified product search (typeahead)',
    description:
      'Active search suggestions (min 2 characters). Use returned `id` as `productId` in the list API when user selects a row.',
  })
  @ApiResponse({ status: 200, description: 'Search suggestions' })
  async searchPublicCertifiedProducts(
    @Req() req: Request,
    @Query() query: PublicCertifiedProductSearchQueryDto,
  ) {
    const origin = `${req.protocol}://${req.get('host')}`;
    return this.websiteService.searchPublicCertifiedProducts(
      query.q,
      query.limit ?? 15,
      origin,
    );
  }

  @Post('public/products/certified/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public certified products listing (website grid)',
    description:
      'Flat product cards for the public website. Requires at least one filter: `search` (min 2 chars), `categoryIds`, `countryId`, `stateIds`, or `productId` from search. Certified only (status 2). Each row includes `productImage`, `productImageUrl` (absolute URL), and category image fallbacks when the product has no image.',
  })
  @ApiBody({ type: AdminListProductsDto })
  @ApiResponse({
    status: 200,
    description: 'Certified products retrieved successfully',
  })
  async listPublicCertifiedProducts(
    @Req() req: Request,
    @Body() dto: AdminListProductsDto,
  ) {
    const origin = `${req.protocol}://${req.get('host')}`;
    return this.websiteService.listPublicCertifiedProductsForWebsite(dto, origin);
  }

  @Post('public/products/certified/list/legacy')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public certified products listing (legacy URN groups)',
    description:
      'Legacy shape grouped by URN. Prefer POST /website/public/products/certified/list for the website grid.',
  })
  @ApiBody({ type: AdminListProductsDto })
  @ApiResponse({
    status: 200,
    description: 'Certified products retrieved successfully',
  })
  async listPublicCertifiedProductsLegacy(
    @Body() dto: AdminListProductsDto,
  ) {
    return this.websiteService.getPublicCertifiedProducts(dto);
  }

  @Get('public/products/certified/:productId/passport')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public certified product passport',
    description:
      'Public API for product detail page. Returns passport content and product image URLs for a certified product only.',
  })
  @ApiResponse({
    status: 200,
    description: 'Certified product passport retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Certified product not found' })
  async getPublicCertifiedProductPassport(
    @Req() req: Request,
    @Param('productId') productId: string,
  ) {
    const origin = `${req.protocol}://${req.get('host')}`;
    return this.websiteService.getPublicCertifiedProductPassport(
      productId,
      origin,
    );
  }

  @Post('public/products/share-by-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Share certified product by email (HTML card)',
    description:
      'Sends a rich HTML product card email (image, GREENPRO CERTIFIED badge, Product / Manufacturer / EOI / URN, View Product Details CTA). ' +
      'Use this instead of mailto so Outlook/Gmail render the full card.',
  })
  @ApiBody({ type: ShareProductByEmailDto })
  @ApiResponse({ status: 200, description: 'Share email sent' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async shareProductByEmail(@Body() dto: ShareProductByEmailDto) {
    const data = await this.websiteService.shareProductByEmail(dto);
    return {
      success: true,
      message: 'Product share email sent successfully',
      data,
    };
  }

  @Post('public/manufacturers/by-category')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public manufacturers by category',
    description:
      'Accepts category Mongo `_id` or numeric `category_id` and returns distinct manufacturers mapped through products (products.categoryId -> products.manufacturerId).',
  })
  @ApiBody({ type: PublicCategoryManufacturersDto })
  @ApiResponse({
    status: 200,
    description: 'Manufacturers retrieved successfully',
  })
  async listManufacturersByCategory(
    @Body() dto: PublicCategoryManufacturersDto,
  ) {
    return this.websiteService.getManufacturersByCategoryPublic(dto);
  }

  @Post('public/categories/by-manufacturer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public categories by manufacturer',
    description:
      'Accepts manufacturerId and returns distinct categories mapped through products (products.manufacturerId -> products.categoryId).',
  })
  @ApiBody({ type: PublicManufacturerCategoriesDto })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  async listCategoriesByManufacturer(
    @Body() dto: PublicManufacturerCategoriesDto,
  ) {
    return this.websiteService.getCategoriesByManufacturerPublic(dto);
  }

  @Post('analytics/collect')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Collect public website analytics events',
    description:
      'Accepts batched page_view and sign_up events from the public website. ' +
      'Used to power the admin Visitor Analytics dashboard.',
  })
  @ApiBody({ type: WebsiteAnalyticsCollectDto })
  @ApiResponse({ status: 202, description: 'Events accepted' })
  async collectAnalytics(@Body() dto: WebsiteAnalyticsCollectDto) {
    const data = await this.websiteAnalytics.collect(dto);
    return { message: 'Analytics recorded', data };
  }

  @Post('newsletter')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Newsletter subscribe',
    description:
      'Public website newsletter subscribe form. Accepts email + preferences (Green Products / Events) and `recaptchaToken` (required). reCAPTCHA is verified server-side before subscribe.',
  })
  @ApiResponse({ status: 201, description: 'Subscribed/updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async subscribe(@Body() dto: NewsletterSubscribeDto) {
    const data = await this.websiteService.subscribeNewsletter(dto);
    return { message: 'Subscribed successfully', data };
  }

  @Get('newsletter')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List newsletter subscriptions (admin)',
    description:
      'Fetches newsletter subscription records for the admin panel table.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of subscriptions (empty array if none)',
    type: NewsletterRecordDto,
    isArray: true,
  })
  async listNewsletter() {
    const data = await this.websiteService.getNewsletterSubscribers();
    if (!data.length) {
      return { message: 'No subscriptions found', data: [] };
    }
    return { data };
  }

  @Post('contact')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Website contact form submit',
    description:
      'Accepts contact form fields: name, email, phoneNumber, subject, message, and `recaptchaToken` (required). reCAPTCHA is verified server-side before the message is saved.',
  })
  @ApiResponse({ status: 201, description: 'Message submitted successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async submitContact(@Body() dto: ContactSubmitDto) {
    const data = await this.websiteService.submitContact(dto);
    return { message: 'Message sent successfully', data };
  }

  @Patch('events/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Toggle website event status',
    description:
      'Toggles event status for the website events page. Default is active if status is missing/invalid. Accepts Mongo `_id` or numeric `eventId`.',
  })
  @ApiResponse({
    status: 200,
    description: 'Event status updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async toggleEventStatus(@Param('id') id: string) {
    const data = await this.websiteService.toggleWebsiteEventStatus(id);
    return { message: 'Event status updated successfully', data };
  }

  @Get('team-members/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Website team members list',
    description:
      'Returns active team members for the website: name, designation, email, mobile, image, social links, team, display order, and sector(s).',
  })
  @ApiResponse({ status: 200, description: 'Team members list' })
  async listWebsiteTeamMembers() {
    const data = await this.websiteService.listWebsiteTeamMembers();
    if (!data.length) {
      return { message: 'No team members found', data: [] };
    }
    return { data };
  }

  @Post('manufacturer/inquiry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Manufacturer inquiry (send email to customer)',
    description:
      'Accepts name, email, countryCode (+ dial code from selector), phoneNumber (local digits), optional manufacturerId, optional message/subject, and `recaptchaToken` (required). reCAPTCHA is verified server-side before the inquiry is processed. Sends a confirmation email to the visitor.',
  })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Manufacturer not found' })
  async manufacturerInquiry(
    @Body() dto: ManufacturerInquiryDto,
    @Query('manufacturerId') manufacturerId?: string,
  ) {
    const data = await this.websiteService.submitManufacturerInquiry(
      dto,
      manufacturerId,
    );
    return { message: 'Email sent successfully', data };
  }
}
