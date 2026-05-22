import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZohoWebhookDto } from '../dto/zoho-webhook.dto';
import { ZohoWebhookService } from '../services/zoho-webhook.service';

@ApiTags('Zoho')
@Controller('zoho')
export class ZohoWebhookController {
  constructor(private readonly webhookService: ZohoWebhookService) {}

  @Post('webhooks')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Receive Zoho CRM webhook callbacks' })
  @ApiResponse({ status: 202, description: 'Webhook accepted and queued' })
  async receiveWebhook(
    @Body() payload: ZohoWebhookDto & Record<string, unknown>,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    return this.webhookService.receiveWebhook(payload, headers);
  }
}
