import { NotificationPayload } from '../interfaces/notification.types';

const PLACEHOLDER_RE = /\{\{(\w+)\}\}/g;

export function interpolateTemplate(
  template: string,
  payload: NotificationPayload,
): string {
  return template.replace(PLACEHOLDER_RE, (_, key: string) =>
    String(payload[key] ?? ''),
  );
}
