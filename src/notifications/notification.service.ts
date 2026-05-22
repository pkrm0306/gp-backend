import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import {
  NotificationChannel,
  NotificationRecipient,
  NotificationSendResult,
  ChannelDeliveryResult,
} from './interfaces/notification.types';
import { SendNotificationRequest } from './interfaces/send-notification-request.interface';
import { NotificationDispatchContext } from './interfaces/notification-channel.interface';
import { NotificationChannelRegistry } from './channels/notification-channel.registry';
import { NotificationTemplateRegistry } from './templates/notification-template.registry';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly channelRegistry: NotificationChannelRegistry,
    private readonly templateRegistry: NotificationTemplateRegistry,
  ) {}

  /**
   * Central dispatch — modules should use NotificationHelper instead of EmailService directly.
   */
  async send(request: SendNotificationRequest): Promise<NotificationSendResult> {
    this.validateRequest(request);
    this.templateRegistry.getDefinition(request.template);

    const recipients = this.resolveRecipients(request);
    const channels = this.normalizeChannels(request.type);
    const results: ChannelDeliveryResult[] = [];

    for (const recipient of recipients) {
      for (const channel of channels) {
        results.push(await this.dispatchChannel(channel, request, recipient));
      }
    }

    return {
      template: request.template,
      recipientCount: recipients.length,
      results,
    };
  }

  /**
   * Queue-ready: fire-and-forget; logs failures without throwing to caller.
   */
  sendInBackground(request: SendNotificationRequest): void {
    this.send({ ...request, async: true })
      .then((result) => {
        const failed = result.results.filter((r) => !r.success && !r.skipped);
        if (failed.length > 0) {
          this.logger.warn(
            `Background notification [${request.template}] had ${failed.length} channel failure(s)`,
          );
        }
      })
      .catch((error) => {
        this.logger.error(
          `Background notification [${request.template}] failed: ${(error as Error)?.message}`,
        );
      });
  }

  /** Multiple explicit recipients — one dispatch per recipient (failure isolated). */
  async sendToMany(
    recipients: NotificationRecipient[],
    request: Omit<SendNotificationRequest, 'userId' | 'userIds' | 'email' | 'emails'>,
  ): Promise<NotificationSendResult> {
    if (!recipients.length) {
      throw new BadRequestException('At least one recipient is required');
    }
    const allResults: ChannelDeliveryResult[] = [];
    for (const recipient of recipients) {
      const result = await this.send({
        ...request,
        userId: recipient.userId,
        email: recipient.email,
      });
      allResults.push(...result.results);
    }
    return {
      template: request.template,
      recipientCount: recipients.length,
      results: allResults,
    };
  }

  /**
   * Future: resolve users by role and broadcast.
   * Throws until role resolver is implemented.
   */
  async sendToRoles(
    _roleKeys: string[],
    _request: SendNotificationRequest,
  ): Promise<NotificationSendResult> {
    throw new BadRequestException(
      'Role-based notification broadcast is not implemented yet. Use userIds or emails.',
    );
  }

  private validateRequest(request: SendNotificationRequest): void {
    if (!request.template) {
      throw new BadRequestException('template is required');
    }
    if (!Array.isArray(request.type) || request.type.length === 0) {
      throw new BadRequestException('At least one notification channel type is required');
    }
    const recipients = this.resolveRecipients(request);
    if (recipients.length === 0) {
      throw new BadRequestException(
        'At least one recipient is required (userId, userIds, email, or emails)',
      );
    }
  }

  private normalizeChannels(types: NotificationChannel[]): NotificationChannel[] {
    const unique = [...new Set(types)];
    const unsupported = unique.filter(
      (c) => !this.channelRegistry.get(c),
    );
    if (unsupported.length > 0) {
      throw new BadRequestException(
        `Unsupported or not-yet-implemented channels: ${unsupported.join(', ')}. ` +
          `Available: ${this.channelRegistry.listImplemented().join(', ')}`,
      );
    }
    return unique;
  }

  private resolveRecipients(request: SendNotificationRequest): NotificationRecipient[] {
    const list: NotificationRecipient[] = [];

    if (request.userId?.trim()) {
      list.push({
        userId: request.userId.trim(),
        email: request.email?.trim(),
      });
    }

    for (const uid of request.userIds ?? []) {
      if (uid?.trim()) {
        list.push({ userId: uid.trim() });
      }
    }

    if (request.email?.trim() && !list.some((r) => r.email === request.email?.trim())) {
      list.push({ email: request.email.trim(), userId: request.userId?.trim() });
    }

    for (const em of request.emails ?? []) {
      if (em?.trim()) {
        list.push({ email: em.trim() });
      }
    }

    const deduped = new Map<string, NotificationRecipient>();
    for (const r of list) {
      const key = `${r.userId ?? ''}|${r.email ?? ''}`;
      if (!key.replace(/\|/g, '')) continue;
      const existing = deduped.get(key);
      if (existing) {
        deduped.set(key, {
          userId: existing.userId ?? r.userId,
          email: existing.email ?? r.email,
        });
      } else {
        deduped.set(key, r);
      }
    }

    return [...deduped.values()];
  }

  private async dispatchChannel(
    channel: NotificationChannel,
    request: SendNotificationRequest,
    recipient: NotificationRecipient,
  ): Promise<ChannelDeliveryResult> {
    const handler = this.channelRegistry.get(channel);
    if (!handler) {
      return {
        channel,
        success: false,
        error: 'Channel handler not registered',
      };
    }

    const context: NotificationDispatchContext = {
      template: request.template,
      payload: request.payload ?? {},
      recipient,
      inAppOverrides: request.inApp,
    };

    if (!handler.supports(context)) {
      this.logger.debug(
        `Skipping ${channel} for template ${request.template}: recipient missing required fields`,
      );
      return {
        channel,
        success: false,
        skipped: true,
        error: 'Recipient missing required fields for channel',
      };
    }

    try {
      return await handler.send(context);
    } catch (error) {
      const message = (error as Error)?.message || 'Channel dispatch failed';
      this.logger.error(
        `Unhandled error on ${channel} [${request.template}]: ${message}`,
      );
      if (!request.async) {
        // Failure isolation: return result instead of throwing
      }
      return { channel, success: false, error: message, attempts: 1 };
    }
  }
}
