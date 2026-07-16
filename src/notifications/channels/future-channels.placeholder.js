"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FUTURE_NOTIFICATION_CHANNELS = void 0;
var notification_types_1 = require("../interfaces/notification.types");
exports.FUTURE_NOTIFICATION_CHANNELS = [
    notification_types_1.NotificationChannel.SMS,
    notification_types_1.NotificationChannel.WHATSAPP,
    notification_types_1.NotificationChannel.PUSH,
];
