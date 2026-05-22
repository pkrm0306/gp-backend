import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { createHmac, timingSafeEqual } from 'crypto';
import { Model } from 'mongoose';
import { ZohoWebhookDto } from '../dto/zoho-webhook.dto';
import { ZOHO_WEBHOOK_SIGNATURE_HEADER } from '../helpers/zoho.constants';
import {
  ZohoWebhookLog,
  ZohoWebhookLogDocument,
} from '../schemas/zoho-webhook-log.schema';
import { ZohoSyncQueueService } from '../jobs/zoho-sync-queue.service';

@Injectable()
export class ZohoWebhookService {
  private readonly logger = new Logger(ZohoWebhookService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly queueService: ZohoSyncQueueService,
    @InjectModel(ZohoWebhookLog.name)
    private readonly webhookLogModel: Model<ZohoWebhookLogDocument>,
  ) {}

  async receiveWebhook(
    payload: ZohoWebhookDto & Record<string, unknown>,
    headers: Record<string, string | string[] | undefined>,
  ): Promise<{ accepted: boolean; webhookLogId: string; jobId: string }> {
    if (!payload || Object.keys(payload).length === 0) {
      throw new BadRequestException('Webhook payload is required');
    }

    const signatureValid = this.verifySignature(payload, headers);
    if (!signatureValid && this.signatureRequired()) {
      throw new UnauthorizedException('Invalid Zoho webhook signature');
    }

    const webhookLog = await this.webhookLogModel.create({
      event: payload.event,
      module: payload.module,
      recordId: payload.recordId,
      headers: this.sanitizeHeaders(headers),
      payload,
      signatureValid,
      status: 'received',
    });

    const queued = await this.queueService.enqueue({
      type: 'webhook.process',
      payload: {
        webhookLogId: String(webhookLog._id),
        event: payload.event,
        module: payload.module,
        recordId: payload.recordId,
        data: payload.data ?? payload,
      },
    });

    await this.webhookLogModel
      .findByIdAndUpdate(webhookLog._id, {
        $set: { status: 'queued' },
      })
      .exec();

    this.logger.log(`Accepted Zoho webhook ${webhookLog._id}`);
    return {
      accepted: true,
      webhookLogId: String(webhookLog._id),
      jobId: queued.jobId,
    };
  }

  private verifySignature(
    payload: Record<string, unknown>,
    headers: Record<string, string | string[] | undefined>,
  ): boolean {
    const secret = this.configService.get<string>('ZOHO_WEBHOOK_SECRET');
    if (!secret) return false;

    const signatureHeader = headers[ZOHO_WEBHOOK_SIGNATURE_HEADER];
    const signature = Array.isArray(signatureHeader)
      ? signatureHeader[0]
      : signatureHeader;
    if (!signature) return false;

    const expected = createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    const normalizedSignature = signature.replace(/^sha256=/i, '').trim();
    const expectedBuffer = Buffer.from(expected, 'hex');
    const actualBuffer = Buffer.from(normalizedSignature, 'hex');

    return (
      expectedBuffer.length === actualBuffer.length &&
      timingSafeEqual(expectedBuffer, actualBuffer)
    );
  }

  private signatureRequired(): boolean {
    return (
      this.configService.get<string>('ZOHO_WEBHOOK_SECRET_REQUIRED') === 'true'
    );
  }

  private sanitizeHeaders(
    headers: Record<string, string | string[] | undefined>,
  ): Record<string, string | string[]> {
    const sanitized: Record<string, string | string[]> = {};
    for (const [key, value] of Object.entries(headers)) {
      if (!value) continue;
      const lower = key.toLowerCase();
      if (lower === 'authorization' || lower.includes('cookie')) continue;
      sanitized[lower] = value;
    }
    return sanitized;
  }
}
