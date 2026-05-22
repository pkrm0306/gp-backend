import {
  NotificationChannel,
  NotificationPayload,
  NotificationRecipient,
  NotificationTemplateCode,
  ChannelDeliveryResult,
} from './notification.types';

export interface NotificationDispatchContext {
  template: NotificationTemplateCode;
  payload: NotificationPayload;
  recipient: NotificationRecipient;
  /** Per-channel overrides from the send request */
  inAppOverrides?: {
    title?: string;
    content?: string;
    type?: string;
    notifyType?: string;
  };
}

export interface NotificationChannelHandler {
  readonly channel: NotificationChannel;
  /** Whether this channel can handle the given template for the recipient */
  supports(context: NotificationDispatchContext): boolean;
  send(context: NotificationDispatchContext): Promise<ChannelDeliveryResult>;
}
