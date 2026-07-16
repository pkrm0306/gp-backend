"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUDIT_SENSITIVE_BODY_KEYS = void 0;
/** Body keys never copied into audit snapshots or metadata. */
exports.AUDIT_SENSITIVE_BODY_KEYS = new Set([
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
