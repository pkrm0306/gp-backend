/** Body keys never copied into audit snapshots or metadata. */
export const AUDIT_SENSITIVE_BODY_KEYS = new Set([
  'password',
  'confirmPassword',
  'newPassword',
  'oldPassword',
  'currentPassword',
  'token',
  'refreshToken',
  'accessToken',
  'captchaToken',
  'otp',
]);
