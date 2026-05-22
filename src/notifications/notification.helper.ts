import { Injectable } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SendNotificationRequest } from './interfaces/send-notification-request.interface';
import {
  NotificationRecipient,
  NotificationSendResult,
} from './interfaces/notification.types';

/**
 * Facade for application modules — inject this instead of EmailService for outbound notifications.
 */
@Injectable()
export class NotificationHelper {
  constructor(private readonly notificationService: NotificationService) {}

  send(request: SendNotificationRequest): Promise<NotificationSendResult> {
    if (request.async === true) {
      this.notificationService.sendInBackground(request);
      return Promise.resolve({
        template: request.template,
        recipientCount: 0,
        results: [],
      });
    }
    return this.notificationService.send(request);
  }

  sendInBackground(request: SendNotificationRequest): void {
    this.notificationService.sendInBackground(request);
  }

  sendToMany(
    recipients: NotificationRecipient[],
    request: Omit<SendNotificationRequest, 'userId' | 'userIds' | 'email' | 'emails'>,
  ): Promise<NotificationSendResult> {
    return this.notificationService.sendToMany(recipients, request);
  }

  /** Reserved for role-based broadcasts */
  sendToRoles(
    roleKeys: string[],
    request: SendNotificationRequest,
  ): Promise<NotificationSendResult> {
    return this.notificationService.sendToRoles(roleKeys, request);
  }
}
