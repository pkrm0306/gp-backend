import { Injectable, BadRequestException } from '@nestjs/common';
import {
  NotificationPayload,
  NotificationTemplateCode,
} from '../interfaces/notification.types';
import {
  EmailTemplateContent,
  InAppTemplateContent,
  NOTIFICATION_TEMPLATES,
  NotificationTemplateDefinition,
} from './notification-templates';
import { interpolateTemplate } from './notification-template.util';

@Injectable()
export class NotificationTemplateRegistry {
  getDefinition(code: NotificationTemplateCode): NotificationTemplateDefinition {
    const def = NOTIFICATION_TEMPLATES[code];
    if (!def) {
      throw new BadRequestException(`Unknown notification template: ${code}`);
    }
    return def;
  }

  resolveEmail(
    code: NotificationTemplateCode,
    payload: NotificationPayload,
  ): EmailTemplateContent | null {
    const def = this.getDefinition(code);
    if (!def.email) {
      return null;
    }
    return {
      subject: interpolateTemplate(def.email.subject, payload),
      html: interpolateTemplate(def.email.html, payload),
      text: def.email.text
        ? interpolateTemplate(def.email.text, payload)
        : undefined,
    };
  }

  resolveInApp(
    code: NotificationTemplateCode,
    payload: NotificationPayload,
    overrides?: Partial<InAppTemplateContent>,
  ): InAppTemplateContent | null {
    const def = this.getDefinition(code);
    if (!def.inApp && !overrides?.title) {
      return null;
    }
    const base = def.inApp ?? {
      title: '',
      content: '',
      type: 'info',
      notifyType: code,
    };
    return {
      title: overrides?.title ?? interpolateTemplate(base.title, payload),
      content: overrides?.content ?? interpolateTemplate(base.content, payload),
      type: overrides?.type ?? base.type ?? 'info',
      notifyType: overrides?.notifyType ?? base.notifyType ?? code,
    };
  }
}
