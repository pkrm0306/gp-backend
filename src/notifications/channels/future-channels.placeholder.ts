/**
 * Future channel handlers (not registered yet):
 *
 * - SmsNotificationChannel implements NotificationChannelHandler { channel = SMS }
 * - WhatsAppNotificationChannel { channel = WHATSAPP }
 * - PushNotificationChannel { channel = PUSH }
 *
 * To enable: create handler class, add to NOTIFICATION_CHANNEL_HANDLERS factory
 * in notifications.module.ts. No changes required in NotificationService or Helper.
 */

import { NotificationChannel } from '../interfaces/notification.types';

export const FUTURE_NOTIFICATION_CHANNELS: NotificationChannel[] = [
  NotificationChannel.SMS,
  NotificationChannel.WHATSAPP,
  NotificationChannel.PUSH,
];
