# Centralized Notification System (API reference)

Single entry point for outbound notifications. **Do not inject `EmailService` in feature modules** — use `NotificationHelper` instead.

> **For flow diagrams and “which file does what”, see [notification-flow-guide.md](./notification-flow-guide.md).**

## Folder structure

```
src/notifications/
  notifications.module.ts      # @Global() — export NotificationHelper
  notification.helper.ts       # Facade for modules
  notification.service.ts        # Orchestrator, recipient resolution, failure isolation
  constants/
    notification.constants.ts
  interfaces/
    notification.types.ts
    notification-channel.interface.ts
    send-notification-request.interface.ts
  templates/
    notification-templates.ts
    notification-template.registry.ts
    notification-template.util.ts
  schemas/
    user-notification.schema.ts  # collection: user_notifications
  channels/
    email-notification.channel.ts
    in-app-notification.channel.ts
    notification-channel.registry.ts
    future-channels.placeholder.ts
```

Legacy admin system feed remains in `common/schemas/notification.schema.ts` (`notifications` collection).

## Supported channels (now)

| Channel   | Handler                    |
|-----------|----------------------------|
| `email`   | `EmailNotificationChannel` — wraps `EmailService` |
| `in_app`  | `InAppNotificationChannel` — `user_notifications` collection |

## Future channels (plug-in)

1. Implement `NotificationChannelHandler` (see `future-channels.placeholder.ts`).
2. Register in `notifications.module.ts` `NOTIFICATION_CHANNEL_HANDLERS` factory.
3. Add enum value to `NotificationChannel` if needed.

No changes to `NotificationService` / `NotificationHelper`.

## Templates

| Code               | Email | In-app |
|--------------------|-------|--------|
| `PRODUCT_APPROVED` | Yes   | Yes    |
| `PRODUCT_REJECTED` | Yes   | Yes    |
| `USER_CREATED`       | Yes (legacy HTML via EmailService) | Yes |
| `PASSWORD_RESET`     | Yes (legacy HTML) | Yes |
| `OTP_VERIFICATION`   | Yes   | Yes    |

Payload keys use `{{key}}` interpolation in template strings.

## Usage

```typescript
import { NotificationHelper } from '../notifications/notification.helper';
import {
  NotificationChannel,
  NotificationTemplateCode,
} from '../notifications/interfaces/notification.types';

// Inject NotificationHelper in your service

await this.notificationHelper.send({
  type: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
  template: NotificationTemplateCode.PRODUCT_APPROVED,
  userId: user.id,
  email: user.email,
  payload: {
    productName: 'ABC Product',
    approvedBy: 'Admin',
  },
});

// Fire-and-forget (password reset, non-blocking)
this.notificationHelper.sendInBackground({
  type: [NotificationChannel.EMAIL],
  template: NotificationTemplateCode.PASSWORD_RESET,
  userId: user.id,
  email: user.email,
  payload: { newPassword: '...' },
});

// Multiple users
await this.notificationHelper.sendToMany(
  [
    { userId: '...', email: 'a@x.com' },
    { userId: '...', email: 'b@x.com' },
  ],
  {
    type: [NotificationChannel.IN_APP],
    template: NotificationTemplateCode.PRODUCT_APPROVED,
    payload: { productName: 'X', approvedBy: 'Admin' },
  },
);
```

## In-app schema (`user_notifications`)

| Field        | Description        |
|-------------|--------------------|
| `id`        | Numeric sequence id |
| `user_id`   | ObjectId           |
| `title`     | string             |
| `content`   | string             |
| `type`      | info / success / warning |
| `notify_type` | template or category |
| `seen`      | 0 unseen, 1 seen   |
| `created_at` / `updated_at` | timestamps |
| `deleted_at` | soft delete (null = active) |

## Error handling

- **Per-channel isolation**: one channel failing does not block others; results returned in `NotificationSendResult.results`.
- **Skipped channels**: missing `email` or `userId` → `skipped: true` (not an error).
- **Background send**: `sendInBackground()` logs failures; does not throw to HTTP handler.
- **Sync send**: returns `{ success: false, error }` per channel without throwing (unless invalid template / no recipients).

## Queue / retry (ready)

- `ChannelDeliveryResult.attempts` reserved for retry counts.
- Replace `sendInBackground` body with Bull/BullMQ job enqueue when a queue is added.
- Handlers stay stateless for worker consumption.

## Migration checklist

- [x] `AuthService` registration + password reset
- [ ] `ManufacturersService`, `AdminService`, `RbacService`, `WebsiteService` — replace direct `EmailService` calls gradually

`EmailService` remains the SMTP transport layer; only notification channels call it.
