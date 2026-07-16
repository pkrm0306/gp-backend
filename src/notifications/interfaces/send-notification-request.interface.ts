import {
  NotificationChannel,
  NotificationPayload,
  NotificationTemplateCode,
} from './notification.types';

export interface SendNotificationRequest {
  /** Channels to dispatch (failure isolated per channel) */
  type: NotificationChannel[];
  template: NotificationTemplateCode;
  /** Single user (vendor/admin ObjectId string) */
  userId?: string;
  /** Multiple users — batch send */
  userIds?: string[];
  email?: string;
  emails?: string[];
  payload?: NotificationPayload;
  /**
   * Optional email CC list (vendor lifecycle mails always merge ADMIN_MAIL_CC
   * in EmailNotificationChannel even when this is omitted).
   */
  cc?: string | string[];
  /** Optional in-app field overrides (template defaults still apply) */
  inApp?: {
    title?: string;
    content?: string;
    type?: string;
    notifyType?: string;
  };
  /**
   * When true (default), email failures are logged but do not throw from sendInBackground.
   * Sync send() still returns per-channel results.
   */
  async?: boolean;
  /**
   * Future: role keys for broadcast (e.g. ['admin', 'vendor']).
   * Not implemented — reserved for NotificationService.sendToRoles().
   */
  roleKeys?: string[];
}
