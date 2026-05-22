import { NotificationTemplateCode } from '../interfaces/notification.types';

export interface EmailTemplateContent {
  subject: string;
  html: string;
  text?: string;
}

export interface InAppTemplateContent {
  title: string;
  content: string;
  type?: string;
  notifyType?: string;
}

export interface NotificationTemplateDefinition {
  code: NotificationTemplateCode;
  email?: EmailTemplateContent;
  inApp?: InAppTemplateContent;
}

export const NOTIFICATION_TEMPLATES: Record<
  NotificationTemplateCode,
  NotificationTemplateDefinition
> = {
  [NotificationTemplateCode.PRODUCT_APPROVED]: {
    code: NotificationTemplateCode.PRODUCT_APPROVED,
    email: {
      subject: 'GreenPro — Product approved: {{productName}}',
      html: `
        <p>Hello,</p>
        <p>Your product <strong>{{productName}}</strong> has been approved by {{approvedBy}}.</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: 'Your product {{productName}} has been approved by {{approvedBy}}.',
    },
    inApp: {
      title: 'Product approved',
      content: '{{productName}} was approved by {{approvedBy}}.',
      type: 'success',
      notifyType: 'PRODUCT_APPROVED',
    },
  },
  [NotificationTemplateCode.PRODUCT_REJECTED]: {
    code: NotificationTemplateCode.PRODUCT_REJECTED,
    email: {
      subject: 'GreenPro — Product rejected: {{productName}}',
      html: `
        <p>Hello,</p>
        <p>Your product <strong>{{productName}}</strong> was not approved.</p>
        <p>Reason: {{reason}}</p>
        <p>Reviewed by: {{rejectedBy}}</p>
      `,
      text: 'Product {{productName}} was rejected. Reason: {{reason}}',
    },
    inApp: {
      title: 'Product rejected',
      content: '{{productName}} was rejected. {{reason}}',
      type: 'warning',
      notifyType: 'PRODUCT_REJECTED',
    },
  },
  [NotificationTemplateCode.USER_CREATED]: {
    code: NotificationTemplateCode.USER_CREATED,
    email: {
      subject: 'Welcome to GreenPro - Registration Successful',
      html: `
        <p>Dear {{name}},</p>
        <p>Your account has been created.</p>
        <p><strong>Email:</strong> {{email}}</p>
        <p><strong>Password:</strong> {{password}}</p>
        <p><strong>OTP:</strong> {{otp}}</p>
      `,
      text: 'Welcome. Email: {{email}} Password: {{password}} OTP: {{otp}}',
    },
    inApp: {
      title: 'Welcome to GreenPro',
      content: 'Your account was created. Verify your email with the OTP sent to you.',
      type: 'info',
      notifyType: 'USER_CREATED',
    },
  },
  [NotificationTemplateCode.PASSWORD_RESET]: {
    code: NotificationTemplateCode.PASSWORD_RESET,
    email: {
      subject: 'GreenPro - Password Reset',
      html: `
        <p>Your password has been reset.</p>
        <p><strong>New password:</strong> {{newPassword}}</p>
        <p>Please sign in and change your password immediately.</p>
      `,
      text: 'Your new password is: {{newPassword}}',
    },
    inApp: {
      title: 'Password reset',
      content: 'Your password was reset. Please sign in and update it.',
      type: 'warning',
      notifyType: 'PASSWORD_RESET',
    },
  },
  [NotificationTemplateCode.OTP_VERIFICATION]: {
    code: NotificationTemplateCode.OTP_VERIFICATION,
    email: {
      subject: 'GreenPro - Email verification OTP',
      html: `
        <p>Your verification code is:</p>
        <h2>{{otp}}</h2>
        <p>This code expires in {{expiresInMinutes}} minutes.</p>
      `,
      text: 'Your OTP is {{otp}} (expires in {{expiresInMinutes}} minutes).',
    },
    inApp: {
      title: 'Verification OTP',
      content: 'Your OTP is {{otp}}.',
      type: 'info',
      notifyType: 'OTP_VERIFICATION',
    },
  },
};
