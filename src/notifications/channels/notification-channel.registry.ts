import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { NotificationChannel } from '../interfaces/notification.types';
import { NotificationChannelHandler } from '../interfaces/notification-channel.interface';
import { NOTIFICATION_CHANNEL_HANDLERS } from '../constants/notification.constants';

@Injectable()
export class NotificationChannelRegistry {
  private readonly logger = new Logger(NotificationChannelRegistry.name);
  private readonly handlerMap = new Map<NotificationChannel, NotificationChannelHandler>();

  constructor(
    @Inject(NOTIFICATION_CHANNEL_HANDLERS)
    handlers: NotificationChannelHandler[],
  ) {
    for (const handler of handlers) {
      this.handlerMap.set(handler.channel, handler);
    }
    this.logger.log(
      `Registered notification channels: ${[...this.handlerMap.keys()].join(', ')}`,
    );
  }

  get(channel: NotificationChannel): NotificationChannelHandler | undefined {
    return this.handlerMap.get(channel);
  }

  listImplemented(): NotificationChannel[] {
    return [...this.handlerMap.keys()];
  }
}
