import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WebsiteService } from './website.service';
import { NewsletterSubscribeDto } from './dto/newsletter-subscribe.dto';
import { NewsletterRecordDto } from './dto/newsletter-record.dto';
import { ContactSubmitDto } from './dto/contact-submit.dto';

@ApiTags('Website')
@Controller('website')
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

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
}

