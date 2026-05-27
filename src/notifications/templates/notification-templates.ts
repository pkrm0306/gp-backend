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
  [NotificationTemplateCode.VENDOR_REGISTRATION_COMPLETE]: {
    code: NotificationTemplateCode.VENDOR_REGISTRATION_COMPLETE,
    email: {
      subject: 'GreenPro — Email verified, registration complete',
      html: `
        <p>Dear {{manufacturerName}},</p>
        <p>Your email has been verified and your GreenPro account is ready.</p>
        <p>You can sign in and continue product registration.</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: 'Your GreenPro vendor registration is complete. You can sign in now.',
    },
    inApp: {
      title: 'Registration complete',
      content: 'Your email is verified. You can sign in and register products.',
      type: 'success',
      notifyType: 'VENDOR_REGISTRATION_COMPLETE',
    },
  },
  [NotificationTemplateCode.URN_INITIAL_APPROVED]: {
    code: NotificationTemplateCode.URN_INITIAL_APPROVED,
    email: {
      subject: 'GreenPro — Registration fee approved for {{urnNo}}',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>Your registration fee for URN <strong>{{urnNo}}</strong> has been approved.</p>
        <p>You may continue with the certification process forms.</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: 'Registration fee approved for {{urnNo}}. Continue with certification forms.',
    },
  },
  [NotificationTemplateCode.URN_SUBMITTED_FOR_REVIEW]: {
    code: NotificationTemplateCode.URN_SUBMITTED_FOR_REVIEW,
    email: {
      subject: 'GreenPro — URN {{urnNo}} submitted for review',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>Your certification forms for URN <strong>{{urnNo}}</strong> have been submitted for GreenPro review.</p>
        <p>Our team will verify your submission and update you on next steps.</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: 'URN {{urnNo}} submitted for review. We will notify you when verification progresses.',
    },
    inApp: {
      title: 'Submitted for review',
      content: 'URN {{urnNo}} is submitted for review. Editing is locked until admin responds.',
      type: 'info',
      notifyType: 'URN_SUBMITTED_FOR_REVIEW',
    },
  },
  [NotificationTemplateCode.CERTIFICATION_PAYMENT_SUBMITTED]: {
    code: NotificationTemplateCode.CERTIFICATION_PAYMENT_SUBMITTED,
    email: {
      subject: 'GreenPro — Certification payment submitted for {{urnNo}}',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>We received your certification payment submission for URN <strong>{{urnNo}}</strong>.</p>
        <p>Payment reference: {{paymentId}}. Amount: {{quoteTotal}}.</p>
        <p>Admin verification is pending.</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: 'Certification payment submitted for {{urnNo}}. Pending admin approval.',
    },
    inApp: {
      title: 'Certification payment submitted',
      content: 'Payment for {{urnNo}} is pending admin approval.',
      type: 'info',
      notifyType: 'CERTIFICATION_PAYMENT_SUBMITTED',
    },
  },
  [NotificationTemplateCode.CERTIFICATION_PAYMENT_APPROVED]: {
    code: NotificationTemplateCode.CERTIFICATION_PAYMENT_APPROVED,
    email: {
      subject: 'GreenPro — Certification payment approved for {{urnNo}}',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>Your certification payment for URN <strong>{{urnNo}}</strong> has been approved.</p>
        <p>Payment reference: {{paymentId}}.</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: 'Certification payment approved for {{urnNo}}.',
    },
  },
};
