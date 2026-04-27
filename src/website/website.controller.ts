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
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WebsiteService } from './website.service';
import { NewsletterSubscribeDto } from './dto/newsletter-subscribe.dto';
import { NewsletterRecordDto } from './dto/newsletter-record.dto';
import { ContactSubmitDto } from './dto/contact-submit.dto';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { CategoriesService } from '../categories/categories.service';
import { ProductRegistrationService } from '../product-registration/product-registration.service';
import { ListManufacturersQueryDto } from '../manufacturers/dto/list-manufacturers-query.dto';
import { ListCategoriesQueryDto } from '../categories/dto/list-categories-query.dto';
import { AdminListProductsDto } from '../product-registration/dto/admin-list-products.dto';
import { PublicCategoryManufacturersDto } from './dto/public-category-manufacturers.dto';
import { PublicManufacturerCategoriesDto } from './dto/public-manufacturer-categories.dto';
import { ManufacturerInquiryDto } from './dto/manufacturer-inquiry.dto';

@ApiTags('Website')
@Controller('website')
export class WebsiteController {
  constructor(
    private readonly websiteService: WebsiteService,
    private readonly manufacturersService: ManufacturersService,
    private readonly categoriesService: CategoriesService,
    private readonly productRegistrationService: ProductRegistrationService,
  ) {}

  @Get('public/manufacturers')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public manufacturers listing',
    description: 'Public API to list manufacturers with optional list filters.',
  })
  @ApiResponse({
    status: 200,
    description: 'Manufacturers retrieved successfully',
  })
  async listPublicManufacturers(@Query() query: ListManufacturersQueryDto) {
    return this.manufacturersService.findAllPaginated(query);
  }

  @Get('public/categories')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public categories listing',
    description: 'Public API to list categories with optional list filters.',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  async listPublicCategories(@Query() query: ListCategoriesQueryDto) {
    const data = await this.categoriesService.findAll(query);
    return {
      message: 'Categories retrieved successfully',
      data,
    };
  }

  @Post('public/products/certified/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public certified products listing',
    description:
      'Public API for certified products only. Accepts the same filters as POST /api/admin/products/list, with status forced to [2].',
  })
  @ApiBody({ type: AdminListProductsDto })
  @ApiResponse({
    status: 200,
    description: 'Certified products retrieved successfully',
  })
  async listPublicCertifiedProducts(@Body() dto: AdminListProductsDto) {
    const result = await this.productRegistrationService.adminListProducts({
      ...dto,
      status: [2],
    });
    return {
      ...result,
      message: 'Certified products retrieved successfully',
    };
  }

  @Post('public/manufacturers/by-category')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public manufacturers by category',
    description:
      'Accepts categoryId and returns distinct manufacturers mapped through products (products.categoryId -> products.manufacturerId).',
  })
  @ApiBody({ type: PublicCategoryManufacturersDto })
  @ApiResponse({
    status: 200,
    description: 'Manufacturers retrieved successfully',
  })
  async listManufacturersByCategory(
    @Body() dto: PublicCategoryManufacturersDto,
  ) {
    const data =
      await this.productRegistrationService.getManufacturersByCategory(
        dto.categoryId,
      );
    return {
      message: 'Manufacturers retrieved successfully',
      ...data,
    };
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
    const data =
      await this.productRegistrationService.getCategoriesByManufacturer(
        dto.manufacturerId,
      );
    return {
      message: 'Categories retrieved successfully',
      ...data,
    };
  }

  @Post('newsletter')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Newsletter subscribe',
    description:
      'Public website newsletter subscribe form. Accepts email + preferences (Green Products / Events) and returns a row-like payload for the subscribers list table.',
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
      'Accepts contact form fields: name, email, phoneNumber, subject, message.',
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
      'Returns active team members for the website: name, designation, email, mobile, image, and social links.',
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
      'Accepts name, email, contact, message, manufacturerId. Fetches manufacturer details and sends an email to the customer.',
  })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Manufacturer not found' })
  async manufacturerInquiry(@Body() dto: ManufacturerInquiryDto) {
    const data = await this.websiteService.submitManufacturerInquiry(dto);
    return { message: 'Email sent successfully', data };
  }
}
