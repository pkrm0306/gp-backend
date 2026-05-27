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
  VENDOR_REGISTRATION_COMPLETE = 'VENDOR_REGISTRATION_COMPLETE',
  URN_INITIAL_APPROVED = 'URN_INITIAL_APPROVED',
  URN_SUBMITTED_FOR_REVIEW = 'URN_SUBMITTED_FOR_REVIEW',
  CERTIFICATION_PAYMENT_SUBMITTED = 'CERTIFICATION_PAYMENT_SUBMITTED',
  CERTIFICATION_PAYMENT_APPROVED = 'CERTIFICATION_PAYMENT_APPROVED',
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
