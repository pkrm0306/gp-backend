export enum NotificationChannel {
  EMAIL = 'email',
  IN_APP = 'in_app',
  /** Future — register handler when implemented */
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  PUSH = 'push',
}

export enum NotificationTemplateCode {
  PRODUCT_APPROVED = 'PRODUCT_APPROVED',
  PRODUCT_REJECTED = 'PRODUCT_REJECTED',
  USER_CREATED = 'USER_CREATED',
  PASSWORD_RESET = 'PASSWORD_RESET',
  OTP_VERIFICATION = 'OTP_VERIFICATION',
}

export type NotificationPayload = Record<string, unknown>;

export interface NotificationRecipient {
  userId?: string;
  email?: string;
}

export interface ChannelDeliveryResult {
  channel: NotificationChannel;
  success: boolean;
  skipped?: boolean;
  error?: string;
  /** Reserved for queue/retry metadata */
  attempts?: number;
  metadata?: Record<string, unknown>;
}

export interface NotificationSendResult {
  template: NotificationTemplateCode;
  recipientCount: number;
  results: ChannelDeliveryResult[];
}
